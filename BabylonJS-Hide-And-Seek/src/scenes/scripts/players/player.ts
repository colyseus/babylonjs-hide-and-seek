import { AbstractMesh, AxesViewer, Axis, Color3, Color4, Gizmo, IPhysicsEngine, LinesMesh, Mesh, MeshBuilder, PhysicsEngine, PhysicsImpostor, PickingInfo, Quaternion, Ray, RayHelper, Space, TransformNode, UtilityLayerRenderer, Vector3 } from '@babylonjs/core';
import { fromChildren, visibleInInspector } from '../../decorators';
import GameManager from '../managers/gameManager';
import InputManager from '../managers/inputManager';
import NetworkManager from '../managers/networkManager';
import type { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
import { PlayerInputMessage } from '../../../../../Server/hide-and-seek/src/models/PlayerInputMessage';
import PlayerVisual from './playerVisual';
import { PhysicsRaycastResult } from '@babylonjs/core/Physics/physicsRaycastResult';

export default class Player extends Mesh {
	@visibleInInspector('number', 'Movement Speed', 1)
	private _movementSpeed: number = 1;

	@fromChildren('PlayerBody')
	private _visual: PlayerVisual;

	public isLocalPlayer: boolean = false;

	private _rigidbody: PhysicsImpostor = null;

	private _xDirection: number = 0;
	private _zDirection: number = 0;
	private _lastPosition: Vector3;
	private _previousMovements: PlayerInputMessage[] = null;
	private _physics: IPhysicsEngine;
	private _state: PlayerState = null;

	private _rayHelper: RayHelper = null;

	/**
	 * Override constructor.
	 * @warn do not fill.
	 */
	// @ts-ignore ignoring the super call as we don't want to re-init
	constructor() {}

	public sessionId(): string {
		return this._state ? this._state.id : 'N/A';
	}

	public isCaptured(): boolean {
		return this._state ? this._state.isCaptured : false;
	}

	/**
	 * Called on the node is being initialized.
	 * This function is called immediatly after the constructor has been called.
	 */
	public onInitialize(): void {
		// ...
		this._previousMovements = [];
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...
		this._rigidbody = this.getPhysicsImpostor();

		// Workaround to the inspector failing to load the "visibleInInspector" tagged properties
		this.isLocalPlayer = !this.name.includes('Remote Player') ? true : false;

		this._lastPosition = this.position;
		this._physics = this.getScene()._physicsEngine;

		if (this.isLocalPlayer) {
			console.log(`Player Visual: %o`, this._visual);

			this.isPickable = false;
			this._visual?.setPickable(false);
		}

		if (this._visual) {
			this._visual.setTarget(this);
			this._visual.setParent(null);
		}
	}

	public visualForward(): Vector3 {
		return this._visual.forward;
	}

	public toggleEnabled(enabled: boolean) {
		this.setEnabled(enabled);
		this._visual?.setEnabled(enabled);
	}

	public setPlayerState(state: PlayerState) {
		console.log(`Player - Set Player State`);

		this._state = state;
	}

	public setBodyRotation(rot: Vector3) {}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		if (!this.isEnabled(false)) {
			return;
		}

		// console.log(`Player Rotation: %o`, this.rotation);

		this.updatePlayerMovement();
		this.updatePositionFromState();
		this.updateOrientation();

		// Seeker detection of Hider players
		if (this._state.isSeeker) {
			this.checkForHiders();
		}
	}

	public setVelocity(vel: Vector3) {
		this._rigidbody.setLinearVelocity(vel);
	}

	public setVisualLookDirection(dir: Vector3) {
		if (this._visual && dir.length() > 0) {
			this._visual.setLookTargetDirection(dir);
		}
	}

	private updatePlayerMovement() {
		if (!this.isLocalPlayer || !this._state.canMove) {
			if (this._rigidbody.getLinearVelocity().length() > 0) {
				this._rigidbody.setLinearVelocity(Vector3.Zero());
			}
			return;
		}

		let velocity: Vector3 = new Vector3();

		// W + -S (1/0 + -1/0)
		this._zDirection = (InputManager.getKey(87) ? 1 : 0) + (InputManager.getKey(83) ? -1 : 0);
		// -A + D (-1/0 + 1/0)
		this._xDirection = (InputManager.getKey(65) ? -1 : 0) + (InputManager.getKey(68) ? 1 : 0);

		// Prevent the player from moving faster than it should in a diagonal direction
		if (this._zDirection !== 0 && this._xDirection !== 0) {
			this._xDirection *= 0.75;
			this._zDirection *= 0.75;
		}

		velocity.x = this._xDirection;
		velocity.z = this._zDirection;

		velocity.x *= this._movementSpeed * GameManager.DeltaTime;
		velocity.z *= this._movementSpeed * GameManager.DeltaTime;

		this.setVelocity(velocity);
		this._rigidbody.setAngularVelocity(Vector3.Zero());

		this.position.y = 0.5;

		if (!this.position.equals(this._lastPosition)) {
			this._lastPosition.copyFrom(this.position);
			// Position has changed; send position to the server
			this.sendPositionUpdateToServer();
		}

		this.setVisualLookDirection(velocity);
	}

	private updatePositionFromState() {
		if (!this._state) {
			return;
		}

		// Remove up to and out of date movements from the collection//
		for (let i = this._previousMovements.length - 1; i >= 0; i--) {
			const timestamp: number = this._previousMovements[i].timestamp;
			if (timestamp <= this._state.positionTimestamp || Date.now() - timestamp > 200) {
				this._previousMovements.splice(i, 1);
			}
		}

		if (this.isLocalPlayer) {
			// Update from the state received from the server if we don't have any other previous movements
			if (this._previousMovements.length === 0) {
				this.position.copyFrom(new Vector3(this._state.xPos, 0.5, this._state.zPos));
			}
		} else {
			// Lerp the remote player object to their position
			this.position.copyFrom(Vector3.Lerp(this.position, new Vector3(this._state.xPos, 0.5, this._state.zPos), GameManager.DeltaTime * 35));
		}
	}

	private updateOrientation() {}

	private sendPositionUpdateToServer() {
		const inputMsg: PlayerInputMessage = new PlayerInputMessage([this.position.x, 0.5, this.position.z]);

		this._previousMovements.push(inputMsg);

		NetworkManager.Instance.sendPlayerPosition(inputMsg);
	}

	private checkForHiders() {
		// When all nearby Hiders have been collected we can do a raycast check from the Seeker to each of the Hiders to determine if they are within line of sight
		// Send a message to the server with the Ids of all the Hiders that are within line of sight.

		const hiders: Player[] = GameManager.Instance.getOverlappingHiders();

		if (hiders && hiders.length > 0) {
			// Raycast to each hider to determine if an obstacle is between them and the Seeker
			hiders.forEach((hider: Player) => {
				let ray: Ray = new Ray(this.position, hider.position.subtract(this.position).normalize(), GameManager.Instance.seekerCheckDistance + 1);

				// Draw debug ray visual
				//============================================
				if (this._rayHelper) {
					this._rayHelper.dispose();
				}

				this._rayHelper = new RayHelper(ray);
				this._rayHelper.show(this._scene, Color3.Green());
				//============================================

				const info: PickingInfo[] = this._scene.multiPickWithRay(ray, this.checkPredicate);

				/** Flag for if the hider is obscurred by another mesh */
				let viewBlocked: boolean = false;
				/** Flag for if we've found the hider in the list of raycast hits */
				let foundHider: boolean = false;

				for (let i = 0; i < info.length && !foundHider && !viewBlocked; i++) {
					const mesh: AbstractMesh = info[i].pickedMesh;

					if (!mesh.isPickable || mesh.name === 'ray') {
						continue;
					}

					// console.log(`Hit Pickable: %o`, mesh);

					// Starting from the first raycast hit info
					// if we hit an obstacle before we've hit the hider
					// then the hider will be considered obscurred from the Seeker's view
					if (!mesh.name.includes('Remote') && !foundHider) {
						viewBlocked = true;
						// console.log(`Seeker's view blocked by "${mesh.name}"`);
					}

					if (mesh === hider._visual || mesh === hider) {
						foundHider = true;
					}
				}

				if (!viewBlocked) {
					GameManager.Instance.seekerFoundHider(hider);
				}
			});
		}
	}

	private checkPredicate(mesh: AbstractMesh): boolean {
		if (!mesh.isPickable || mesh === this || mesh === this._visual) {
			return false;
		}

		return true;
	}

	/**
	 * Called on the object has been disposed.
	 * Object can be disposed manually or when the editor stops running the scene.
	 */
	public onStop(): void {
		// ...
	}

	/**
	 * Called on a message has been received and sent from a graph.
	 * @param message defines the name of the message sent from the graph.
	 * @param data defines the data sent in the message.
	 * @param sender defines the reference to the graph class that sent the message.
	 */
	public onMessage(name: string, data: any, sender: any): void {
		switch (name) {
			case 'myMessage':
				// Do something...
				break;
		}
	}
}
