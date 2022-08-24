import { AbstractMesh, Axis, Mesh, Quaternion, Space, Vector3 } from '@babylonjs/core';
import { Quat, random, Vec3 } from '../../utility';
import GameManager from '../managers/gameManager';
import Player from './player';

export default class PlayerVisual extends Mesh {
	private _target: Player = null;
	private _targetLookDirection: Vector3;
	private _lerpSpeed: number = 10;

	private _prevDir: Vector3;
	private _currentDir: Vector3;

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
	 * Called on the node has been fully initialized and is ready.
	 */
	public onInitialized(): void {
		// ...
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...
		this.setEnabled(false);

		this._prevDir = this.forward;
		this._currentDir = this.forward;
	}

	public setTarget(player: Player) {
		this._target = player;
	}

	public setLookTargetDirection(direction: Vector3) {
		this._targetLookDirection = Vector3.Normalize(direction);
	}

	public setPickable(isPickable: boolean) {
		this.isPickable = isPickable;

		this.getChildMeshes().forEach((mesh: AbstractMesh) => {
			mesh.isPickable = isPickable;
		});
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		// ...
		// Position the visual with its target
		if (this._target) {
			this.setAbsolutePosition(this._target.getAbsolutePosition());
		}

		if (this._targetLookDirection) {
			this.rotateToTargetDirection();
		}
	}

	private rotateToTargetDirection() {
		// this.setDirection(this._targetLookDirection);

		let angle: number = Vec3.SignedAngle(this.forward, this._targetLookDirection, Vector3.Up());

		// console.log(`Angle between Forward (${this.forward.x}, ${this.forward.y}, ${this.forward.z}) and Target (${this._targetLookDirection.x}, ${this._targetLookDirection.y}, ${this._targetLookDirection.z}):  %o`, angle);

		let absAngle: number = Math.abs(angle);

		let turnDirection: number = 0;

		if (absAngle < 5) {
			this.setDirection(this._targetLookDirection);
		} else {
			// If the angle 180 randomize which direction the visual will rotate
			if (absAngle === 180) {
				turnDirection = random(1, 100) < 50 ? -1 : 1;
			} else {
				turnDirection = Math.sign(angle);
			}

			this.rotate(Vector3.Up(), GameManager.DeltaTime * this._lerpSpeed * turnDirection);
		}
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
