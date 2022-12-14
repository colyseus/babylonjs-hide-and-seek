import { AbstractMesh, Mesh, PhysicsImpostor, PickingInfo, Ray, RayHelper, TransformNode, Vector3 } from '@babylonjs/core';
import { fromChildren } from '../../decorators';
import GameManager from '../managers/gameManager';
import InputManager from '../managers/inputManager';
import NetworkManager from '../managers/networkManager';
import type { PlayerState } from '../../../../../Server/src/rooms/schema/PlayerState';
import { PlayerInputMessage } from '../../../../../Server/src/models/PlayerInputMessage';
import PlayerVisual from './playerVisual';

export default class Player extends Mesh {
	@fromChildren('PlayerBody')
	public visual: PlayerVisual;

	public isLocalPlayer: boolean = false;

	private _rigidbody: PhysicsImpostor = null;

	private _xDirection: number = 0;
	private _zDirection: number = 0;
	private _originalPosition: Vector3;
	private _lastPosition: Vector3;
	private _previousMovements: PlayerInputMessage[] = null;
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

		this._originalPosition = this.position;
		this._lastPosition = this._originalPosition;

		if (this.isLocalPlayer) {
			this.isPickable = false;
		}

		if (this.visual) {
			this.visual.setTarget(this);
			this.visual.setParent(null);
			this.visual.setPickable(false);
			this.visual.setPlayerReference(this);
		}
	}

	public visualForward(): Vector3 {
		return this.visual.forward;
	}

	public toggleEnabled(enabled: boolean) {
		this.setEnabled(enabled);
		this.visual?.setEnabled(enabled);
	}

	public setPlayerState(state: PlayerState) {
		this._state = state;
	}

	public setCapturedTriggerSize(size: number) {
		this.visual.setTriggerSize(size);
	}

	public setVisualVisibility(visible: boolean) {
		this.visual.setVisibility(visible);
	}

	public setVisual(visual: TransformNode) {
		this.visual.setVisual(visual);
	}

	public showCaptured(captured: boolean) {
		// Only change the visibility of the player if the local player is the Seeker
		if (GameManager.Instance.PlayerIsSeeker()) {
			this.setVisualVisibility(captured);
		}

		// Alter appearance to show captured state (like show the player in a cage or something)
		this.visual.setCaptured(captured);
	}

	public reset() {
		this._previousMovements = [];
		this.position = this._originalPosition;
		this._lastPosition = this.position;
		this._state = null;

		this.visual.setCaptured(false);

		this.setVelocity(Vector3.Zero());
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		if (!this.isEnabled(false)) {
			return;
		}

		// console.log(`Player Rotation: %o`, this.rotation);

		if (this.isLocalPlayer) {
			this.updatePlayerMovement();
		} else {
			this.setVisualLookDirection(new Vector3(this._state.xDir, this._state.yDir, this._state.zDir));
		}

		this.updatePositionFromState();

		// Seeker detection of Hider players
		if (this._state.isSeeker) {
			this.checkForHiders();
		}
	}

	public setVelocity(vel: Vector3) {
		if (!this.isLocalPlayer) {
			return;
		}

		this._rigidbody.setLinearVelocity(vel);
	}

	public setVisualLookDirection(dir: Vector3) {
		if (this.visual && dir.length() > 0) {
			this.visual.setLookTargetDirection(dir);
		}
	}

	public registerPlayerMeshForIntersection(mesh: Mesh) {
		this.visual.registerPlayerMeshForIntersection(mesh);
	}

	private updatePlayerMovement() {
		if (!this._state.canMove || this._state.isCaptured) {
			if (this._rigidbody.getLinearVelocity().length() > 0) {
				this._rigidbody.setLinearVelocity(Vector3.Zero());
			}
			return;
		}

		// Check if the player is outside the arena
		//============================
		this.correctPositionForArenaBoundary();
		//============================

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

		velocity.x *= this.getMovementSpeed() * GameManager.DeltaTime;
		velocity.z *= this.getMovementSpeed() * GameManager.DeltaTime;

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

	private correctPositionForArenaBoundary() {
		if (Math.abs(this.position.x) >= GameManager.Instance.ArenaWidthBoundary()) {
			// Correct the x position
			if (this.position.x < 0) {
				this.position.x = -GameManager.Instance.ArenaWidthBoundary() + 1.5;
			} else {
				this.position.x = GameManager.Instance.ArenaWidthBoundary() - 1.5;
			}

			this.sendPositionUpdateToServer();
		}

		if (Math.abs(this.position.z) >= GameManager.Instance.ArenaDepthBoundary()) {
			// Correct the z position
			if (this.position.z < 0) {
				this.position.z = -GameManager.Instance.ArenaDepthBoundary() + 1.5;
			} else {
				this.position.z = GameManager.Instance.ArenaDepthBoundary() - 1.5;
			}

			this.sendPositionUpdateToServer();
		}
	}

	private getMovementSpeed(): number {
		return NetworkManager.Config.PlayerMovementSpeed * (GameManager.Instance.PlayerIsSeeker() ? NetworkManager.Config.SeekerMovementBoost : 1);
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

			this.correctPositionForArenaBoundary();
		} else {
			// Lerp the remote player object to their position
			this.position.copyFrom(Vector3.Lerp(this.position, new Vector3(this._state.xPos, 0.5, this._state.zPos), GameManager.DeltaTime * 35));
		}
	}

	private sendPositionUpdateToServer() {
		const dir: Vector3 = Vector3.Normalize(this._rigidbody.getLinearVelocity());
		const inputMsg: PlayerInputMessage = new PlayerInputMessage([dir.x, 0, dir.z], [this.position.x, 0.5, this.position.z]);

		this._previousMovements.push(inputMsg);

		NetworkManager.Instance.sendPlayerPosition(inputMsg);
	}

	private checkForHiders() {
		// When all nearby Hiders have been collected we can do a raycast check from the Seeker to each of the Hiders to determine if they are within line of sight
		// Send a message to the server with the Ids of all the Hiders that are within line of sight.

		const hiders: Player[] = GameManager.Instance.getOverlappingHiders();

		if (hiders && hiders.length > 0) {
			let distanceToHider: number = -1;

			// Raycast to each hider to determine if an obstacle is between them and the Seeker
			hiders.forEach((hider: Player) => {
				distanceToHider = Vector3.Distance(this.position, hider.position);

				let ray: Ray = new Ray(this.position, hider.position.subtract(this.position).normalize(), NetworkManager.Config.SeekerCheckDistance + 1);

				// Draw debug ray visual
				//============================================
				// if (this._rayHelper) {
				// 	this._rayHelper.dispose();
				// }

				// this._rayHelper = new RayHelper(ray);
				// this._rayHelper.show(this._scene, Color3.Green());
				//============================================

				const info: PickingInfo[] = this._scene.multiPickWithRay(ray, this.checkPredicate);

				/** Flag for if the hider is obscurred by an obstacle mesh */
				let viewBlocked: boolean = false;

				for (let i = 0; i < info.length && !viewBlocked; i++) {
					const mesh: AbstractMesh = info[i].pickedMesh;

					// If an obstacle is closer than the Hider it would block the Seeker's view of the Hider
					if (info[i].distance < distanceToHider && !mesh.name.includes('Remote')) {
						viewBlocked = true;
					}
				}

				if (!viewBlocked) {
					GameManager.Instance.seekerFoundHider(hider);
				}
			});
		}
	}

	private checkPredicate(mesh: AbstractMesh): boolean {
		if (!mesh.isPickable || mesh === this || mesh === this.visual || mesh.name === 'ray') {
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
