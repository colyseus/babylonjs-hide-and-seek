import { ISimplificationSettings, Mesh, SimplificationSettings, TransformNode } from '@babylonjs/core';

export default class MeshMerger extends TransformNode {
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

		const meshes: Mesh[] = this.getChildMeshes() as Mesh[];

		console.log(`${this.name} Mesh Count: ${meshes.length}`);

		const newMesh: Mesh = Mesh.MergeMeshes(meshes, true, true);

		// let settings: Array<ISimplificationSettings> = [];

		// settings.push(new SimplificationSettings(0.8, 60));
		// settings.push(new SimplificationSettings(0.4, 150));

		// newMesh.simplify(settings);
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
