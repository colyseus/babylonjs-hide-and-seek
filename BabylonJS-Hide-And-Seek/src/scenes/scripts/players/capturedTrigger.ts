import { ActionEvent, ActionManager, ExecuteCodeAction, Mesh, Vector3 } from '@babylonjs/core';
import GameManager from '../managers/gameManager';
import Player from './player';
import PlayerVisual from './playerVisual';

export default class CapturedTrigger extends Mesh {
	private _player: Player;

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
		this.setEnabled(true);
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
				// console.log(`Captured Trigger - Mesh intersection ENTER %o`, event);
				const localPlayerVisual: PlayerVisual = event.additionalData.parent as PlayerVisual;

				// console.log(`Captured Trigger - Player is captured?: ${this._player.isCaptured()}`);
				if (this._player.isCaptured() && !this._player.visual.playingCapturedVFX() && localPlayerVisual.player.isLocalPlayer) {
					GameManager.Instance.rescueCapturedHider(this._player);
				}
			}
		);

		this.actionManager.registerAction(enterAction);
	}

	public setPlayerReference(player: Player) {
		this._player = player;
	}

	/** Size is the radius of the trigger so actual scale of the trigger will be double the size */
	public setTriggerSize(size: number) {
		const scale: number = size * 2;
		this.scaling = new Vector3(scale, scale, scale);
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
