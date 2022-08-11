import { Node } from '@babylonjs/core/node';
import { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
import { fromScene } from '../../decorators';
import CameraHolder from '../players/cameraHolder';
import Player from '../players/player';
import NetworkManager from './networkManager';

export default class GameManager extends Node {
	private static _instance: GameManager = null;

	@fromScene('Player')
	private _player: Player;
	@fromScene('Camera Holder')
	private _cameraHolder: CameraHolder;

	public static get Instance(): GameManager {
		return GameManager._instance;
	}

	public static get DeltaTime(): number {
		return this._instance._scene.deltaTime / 1000;
	}

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
		GameManager._instance = this;

		this.onPlayerAdded = this.onPlayerAdded.bind(this);
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...

		this._player.setParent(null);

		this._cameraHolder.setTarget(this._player);

		NetworkManager.Instance.onPlayerAdded = this.onPlayerAdded;

		NetworkManager.Instance.joinRoom();
	}

	private onPlayerAdded(state: PlayerState, sessionId: string) {
		if (NetworkManager.Instance.Room.sessionId === sessionId) {
			console.log(`Got local player state!`);

			this.setLocalPlayerState(state);
		}
	}

	private setLocalPlayerState(state: PlayerState) {
		this._player.setPlayerState(state);
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
