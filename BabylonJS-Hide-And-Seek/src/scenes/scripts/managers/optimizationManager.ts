import { AbstractMesh, ISimplificationSettings, Mesh, Scene, SimplificationSettings, TransformNode } from '@babylonjs/core';
import { fromScene } from '../../decorators';

export default class OptimizationManager extends TransformNode {
	@fromScene('Environment')
	private _environment: TransformNode;
	@fromScene('Border Fence')
	private _borderFence: TransformNode;

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
		// this.getScene().getMeshesByTags();

		const meshes: Mesh[] = this._borderFence.getChildMeshes() as Mesh[];

		// console.log(`Environment Mesh Count: ${environmentMeshes.length}`);
		console.log(`Border Fence Mesh Count: ${meshes.length} %o`, meshes);

		const newMesh: Mesh = Mesh.MergeMeshes(meshes, true, true);

		let settings: Array<ISimplificationSettings> = [];

		settings.push(new SimplificationSettings(0.8, 60));
		settings.push(new SimplificationSettings(0.4, 150));

		newMesh.simplify(settings);

		console.log(`Combined Mesh: %o`, newMesh);

		// meshes.forEach((mesh: AbstractMesh) => {
		// 	mesh.freezeWorldMatrix();
		// 	mesh.doNotSyncBoundingInfo = true;
		// });

		console.log(`Skip Pointer Move Picking`);
		this._scene.skipPointerMovePicking = true;

		// this._scene.autoClear = false; // Color buffer
		// this._scene.autoClearDepthAndStencil = false; // Depth and stencil

		// this._scene.freezeActiveMeshes(); // a bunch of meshes don't render
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		// ...
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
