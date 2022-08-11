import { Mesh, PhysicsImpostor, Space, Vector3 } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';
import { visibleInInspector } from '../../decorators';
import GameManager from '../managers/gameManager';
import InputManager from '../managers/inputManager';
import NetworkManager from '../managers/networkManager';
import type { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';

export default class Player extends Mesh {
	@visibleInInspector('boolean', 'Is Local', false)
	private _isLocalPlayer: boolean = false;
	@visibleInInspector('number', 'Movement Speed', 1)
	private _movementSpeed: number = 1;

	private _rigidbody: PhysicsImpostor = null;

	private _xDirection: number = 0;
	private _zDirection: number = 0;
	private _lastXDirection: number = 0;
	private _lastZDirection: number = 0;

	private _state: PlayerState = null;

	/**
	 * Override constructor.
	 * @warn do not fill.
	 */
	// @ts-ignore ignoring the super call as we don't want to re-init
	protected constructor() {}

	/**
	 * Called on the node is being initialized.
	 * This function is called immediatly after the constructor has been called.
	 */
	public onInitialize(): void {
		// ...
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...
		this._rigidbody = this.getPhysicsImpostor();

		// Workaround to the inspector failing to load the "visibleInInspector" tagged properties
		this._isLocalPlayer = !this.name.includes('Remote Player') ? true : false;

		console.log(`Player - On Start - Is Local: ${this._isLocalPlayer}`);
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
		this.updateVelocityFromState();
	}

	private updateVelocityFromState() {
		if (!this._state) {
			return;
		}

		this._rigidbody.setLinearVelocity(new Vector3(this._state.xVel, this._state.yVel, this._state.zVel));
	}

	private updatePlayerMovement() {
		if (!this._isLocalPlayer) {
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

		// Only send the direction input if it has changed
		if (this._lastXDirection !== this._xDirection || this._lastZDirection !== this._zDirection) {
			// Send direction update message to the server
			NetworkManager.Instance.sendPlayerDirectionInput(direction);
		}

		this._lastXDirection = this._xDirection;
		this._lastZDirection = this._zDirection;

		direction.x *= this._movementSpeed * GameManager.DeltaTime;
		direction.z *= this._movementSpeed * GameManager.DeltaTime;

		// this._rigidbody.setLinearVelocity(direction);
		this._rigidbody.setAngularVelocity(Vector3.Zero());

		this.position.y = 0.5;
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
