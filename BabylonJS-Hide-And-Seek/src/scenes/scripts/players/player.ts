import { Mesh, PhysicsEngine, PhysicsImpostor, Space, Vector3 } from '@babylonjs/core';
import { visibleInInspector } from '../../decorators';
import GameManager from '../managers/gameManager';
import InputManager from '../managers/inputManager';
import NetworkManager from '../managers/networkManager';
import type { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
import { PlayerInputMessage } from '../../../../../Server/hide-and-seek/src/models/PlayerInputMessage';

export default class Player extends Mesh {
	@visibleInInspector('number', 'Movement Speed', 1)
	private _movementSpeed: number = 1;

	public isLocalPlayer: boolean = false;

	private _rigidbody: PhysicsImpostor = null;

	private _xDirection: number = 0;
	private _zDirection: number = 0;
	private _lastPosition: Vector3;
	private _previousMovements: PlayerInputMessage[] = null;

	private _state: PlayerState = null;

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

		console.log(`Player - On Start - Is Local: ${this.isLocalPlayer}`);

		this._lastPosition = this.position;
	}

	public setPlayerState(state: PlayerState) {
		console.log(`Player - Set Player State`);

		this._state = state;

		// state.onChange = (changes: any[]) => {
		// 	console.log(`Player State Changed: %o`, changes);
		// };
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		this.updatePlayerMovement();
		this.updatePositionFromState();
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

	private updatePlayerMovement() {
		if (!this.isLocalPlayer) {
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

		this._rigidbody.setLinearVelocity(direction);
		this._rigidbody.setAngularVelocity(Vector3.Zero());

		this.position.y = 0.5;

		if (!this.position.equals(this._lastPosition)) {
			this._lastPosition.copyFrom(this.position);
			// Position has changed; send position to the server
			this.sendPositionUpdateToServer();
		}
	}

	private sendPositionUpdateToServer() {
		const inputMsg: PlayerInputMessage = new PlayerInputMessage([this.position.x, 0.5, this.position.z]);

		this._previousMovements.push(inputMsg);

		NetworkManager.Instance.sendPlayerPosition(inputMsg);
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
