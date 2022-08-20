import { AxesViewer, Axis, Color4, Gizmo, IPhysicsEngine, LinesMesh, Mesh, MeshBuilder, PhysicsEngine, PhysicsImpostor, Quaternion, Space, TransformNode, UtilityLayerRenderer, Vector3 } from '@babylonjs/core';
import { fromChildren, visibleInInspector } from '../../decorators';
import GameManager from '../managers/gameManager';
import InputManager from '../managers/inputManager';
import NetworkManager from '../managers/networkManager';
import type { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
import { PlayerInputMessage } from '../../../../../Server/hide-and-seek/src/models/PlayerInputMessage';
import PlayerVisual from './playerVisual';

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

	private _lineOptions: any = null;

	/**
	 * Override constructor.
	 * @warn do not fill.
	 */
	// @ts-ignore ignoring the super call as we don't want to re-init
	constructor() {}

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
		}

		if (this._visual) {
			this._visual.setTarget(this);
			this._visual.setParent(null);
		}

		if (this.isLocalPlayer) {
			this._lineOptions = {
				points: [this.position, this.position],
				colors: [new Color4(0, 0, 1), new Color4(0, 0, 1)],
				updatable: true,
				instance: null,
			};

			let lines: LinesMesh = MeshBuilder.CreateLines('lines', this._lineOptions, UtilityLayerRenderer.DefaultUtilityLayer.utilityLayerScene);

			this._lineOptions.instance = lines;
		}
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

		if (this.isLocalPlayer) {
			this.updateDebugLines();
		}
	}

	public setVelocity(vel: Vector3) {
		this._rigidbody.setLinearVelocity(vel);
		this._visual.setLookTargetDirection(vel);
	}

	private updatePlayerMovement() {
		if (!this.isLocalPlayer || !this._state.canMove) {
			if (this._rigidbody.getLinearVelocity().length() > 0) {
				this._rigidbody.setLinearVelocity(Vector3.Zero());
			}
			return;
		}

		let direction: Vector3 = new Vector3();

		// W + -S (1/0 + -1/0)
		this._zDirection = (InputManager.getKey(87) ? 1 : 0) + (InputManager.getKey(83) ? -1 : 0);
		// -A + D (-1/0 + 1/0)
		this._xDirection = (InputManager.getKey(65) ? -1 : 0) + (InputManager.getKey(68) ? 1 : 0);

		// Prevent the player from moving faster than it should in a diagonal direction
		if (this._zDirection !== 0 && this._xDirection !== 0) {
			this._xDirection *= 0.75;
			this._zDirection *= 0.75;
		}

		direction.x = this._xDirection;
		direction.z = this._zDirection;

		direction.x *= this._movementSpeed * GameManager.DeltaTime;
		direction.z *= this._movementSpeed * GameManager.DeltaTime;

		this.setVelocity(direction);
		this._rigidbody.setAngularVelocity(Vector3.Zero());

		this.position.y = 0.5;

		if (!this.position.equals(this._lastPosition)) {
			this._lastPosition.copyFrom(this.position);
			// Position has changed; send position to the server
			this.sendPositionUpdateToServer();
		}
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
			hiders.forEach((hider: Player) => {
				// console.log(`Hider: %o`, hider);
				this._physics.raycast(this.position, this.forward.scale(100));
			});
		}
	}

	private updateDebugLines() {
		this._lineOptions.points[0] = this.position;
		this._lineOptions.points[1] = this.position.add(this.forward.scale(2));

		MeshBuilder.CreateLines('lines', this._lineOptions, UtilityLayerRenderer.DefaultUtilityLayer.utilityLayerScene);
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
