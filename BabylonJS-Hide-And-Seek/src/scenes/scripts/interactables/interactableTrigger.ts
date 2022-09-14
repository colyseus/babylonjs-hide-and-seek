import { ActionEvent, ActionManager, ExecuteCodeAction, Mesh } from '@babylonjs/core';
import GameManager from '../managers/gameManager';
import Player from '../players/player';
import PlayerVisual from '../players/playerVisual';

/**
 * This represents a script that is attached to a node in the editor.
 * Available nodes are:
 *      - Meshes
 *      - Lights
 *      - Cameas
 *      - Transform nodes
 *
 * You can extend the desired class according to the node type.
 * Example:
 *      export default class MyMesh extends Mesh {
 *          public onUpdate(): void {
 *              this.rotation.y += 0.04;
 *          }
 *      }
 * The function "onInitialize" is called immediately after the constructor is called.
 * The functions "onStart" and "onUpdate" are called automatically.
 */
export default class InteractableTrigger extends Mesh {
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
		this.onPlayerEnteredTrigger = this.onPlayerEnteredTrigger.bind(this);
		this.onPlayerExitedTrigger = this.onPlayerExitedTrigger.bind(this);
	}

	/**
	 * Called on the node has been fully initialized and is ready.
	 */
	public onInitialized(): void {
		// ...
		this.actionManager = new ActionManager(this.getScene());
		console.log(`Interactable On Initialized`);
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...

		GameManager.Instance.registerInteractable(this);
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
				let playerVisual: PlayerVisual = event.additionalData as PlayerVisual;

				const player: Player = playerVisual.player;

				this.onPlayerEnteredTrigger(player);
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
				let playerVisual: PlayerVisual = event.additionalData as PlayerVisual;

				const player: Player = playerVisual.player;

				this.onPlayerExitedTrigger(player);
			}
		);

		this.actionManager.registerAction(enterAction);
		this.actionManager.registerAction(exitAction);
	}

	protected onPlayerEnteredTrigger(player: Player) {}

	protected onPlayerExitedTrigger(player: Player) {}

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
