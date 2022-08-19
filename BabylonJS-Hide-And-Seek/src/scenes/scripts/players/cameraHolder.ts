import { Mesh, Space, TransformNode, Vector3 } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';
import { fromScene, visibleInInspector } from '../../decorators';
import GameManager from '../managers/gameManager';

export default class CameraHolder extends Mesh {
	private _target: TransformNode = null;
	private _targetPosition: Vector3 = null;
	private _chaseSpeed: number = 1;

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
		// console.log(`Camera Holder Target: %o`, this._target);
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		if (this._target) {
			this._targetPosition.copyFrom(this._target.position);
		}

		if (!this._targetPosition) {
			return;
		}

		// TODO: rather than just use a straight up lerp, have option to use an easing value to feed the lerp
		this.position.copyFrom(Vector3.Lerp(this.position, this._targetPosition, GameManager.DeltaTime * this._chaseSpeed));
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

	public setTarget(transform: TransformNode, chaseSpeed: number) {
		console.log(`Camera Holder - Set Target to %o`, transform);

		this._target = transform;
		this._chaseSpeed = chaseSpeed;
		this._targetPosition = new Vector3(transform.position.x, transform.position.y, transform.position.z);
	}

	public setTargetPosition(position: Vector3, chaseSpeed: number) {
		this._targetPosition = new Vector3(position.x, position.y, position.z);
		this._chaseSpeed = chaseSpeed;
		this._target = null;
	}
}
