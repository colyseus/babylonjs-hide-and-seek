import { Mesh, Space, Vector3 } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';
import { fromScene, visibleInInspector } from '../../decorators';

export default class CameraHolder extends Mesh {
	// @fromScene('Player')
	private _target: Mesh;

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
		// ...
		// this.lookAt(Vector3.Forward(), 0, 0, 0, Space.WORLD);

		if (!this._target) {
			return;
		}

		this.position = this._target.position;
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

	public setTarget(mesh: Mesh) {
		console.log(`Camera Holder - Set Target to %o`, mesh);

		this._target = mesh;
	}
}
