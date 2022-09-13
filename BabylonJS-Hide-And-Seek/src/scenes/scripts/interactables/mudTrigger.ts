import { ActionEvent, ActionManager, ExecuteCodeAction, Mesh } from '@babylonjs/core';
import Player from '../players/player';
import PlayerVisual from '../players/playerVisual';
import InteractableTrigger from './interactableTrigger';

export default class MudTrigger extends InteractableTrigger {
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
		super.onInitialized();
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...
		super.onStart();
	}

	public registerMeshForIntersection(mesh: Mesh) {
		super.registerMeshForIntersection(mesh);
	}

	protected onPlayerEnteredTrigger(player: Player) {
		console.log(`Mud Trigger - Player is captured?: ${player.isCaptured()}`);
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
