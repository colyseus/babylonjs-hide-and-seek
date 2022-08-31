import { ActionEvent, ActionManager, ExecuteCodeAction, Mesh } from '@babylonjs/core';

export default class CapturedTrigger extends Mesh {
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
		this.actionManager = new ActionManager(this.getScene());
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...
		this.isVisible = false;
	}

	public registerMeshForIntersection(mesh: Mesh) {
		let enterAction = new ExecuteCodeAction(
			{
				trigger: ActionManager.OnIntersectionEnterTrigger,
				parameter: {
					mesh: mesh,
					usePreciseIntersection: true,
				},
			},
			(event: ActionEvent) => {
				console.log(`Captured Trigger - Mesh intersection ENTER %o`, event);
			}
		);

		let exitAction = new ExecuteCodeAction(
			{
				trigger: ActionManager.OnIntersectionExitTrigger,
				parameter: {
					mesh: mesh,
					usePreciseIntersection: true,
				},
			},
			(event: ActionEvent) => {
				console.log(`Captured Trigger - Mesh intersection EXIT %o`, event);
			}
		);

		this.actionManager.registerAction(enterAction);
		this.actionManager.registerAction(exitAction);
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
