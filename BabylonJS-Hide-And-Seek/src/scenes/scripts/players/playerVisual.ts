import { AbstractMesh, Axis, Mesh, Quaternion, Space, Vector3 } from '@babylonjs/core';
import { Quat, Vec3 } from '../../utility';
import GameManager from '../managers/gameManager';
import Player from './player';

export default class PlayerVisual extends Mesh {
	private _target: Player = null;
	private _targetLookDirection: Vector3;

	private _lerpSpeed: number = 1;

	private _lastLookDir: Vector3 = new Vector3();

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

		this._lastLookDir = this.forward;
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
			this.setDirection(this._targetLookDirection);
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
