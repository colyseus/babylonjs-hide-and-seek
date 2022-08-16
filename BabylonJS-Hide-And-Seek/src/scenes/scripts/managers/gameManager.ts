import { TransformNode, Vector3 } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';
import { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
import { fromChildren, fromScene } from '../../decorators';
import CameraHolder from '../players/cameraHolder';
import Player from '../players/player';
import { SpawnPoints } from '../spawnPoints';
import InputManager from './inputManager';
import NetworkManager from './networkManager';

export default class GameManager extends Node {
	private static _instance: GameManager = null;

	@fromScene('Camera Holder')
	private _cameraHolder: CameraHolder;
	@fromScene('Spawn Points')
	private _spawnPointsRoot: Node;

	@fromChildren('Player')
	private _player: Player;
	@fromChildren('Remote Player 1')
	private _remotePlayer1: Player;
	@fromChildren('Remote Player 2')
	private _remotePlayer2: Player;
	@fromChildren('Remote Player 3')
	private _remotePlayer3: Player;
	@fromChildren('Remote Player 4')
	private _remotePlayer4: Player;
	@fromChildren('Remote Player 5')
	private _remotePlayer5: Player;
	@fromChildren('Remote Player 6')
	private _remotePlayer6: Player;
	@fromChildren('Remote Player 7')
	private _remotePlayer7: Player;

	private _availableRemotePlayers: Player[] = null;
	private _spawnPoints: SpawnPoints = null;
	private _spawnedRemotes: Map<string, Player> = null;

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

		this._availableRemotePlayers = [];
		this._spawnedRemotes = new Map<string, Player>();

		this.onPlayerAdded = this.onPlayerAdded.bind(this);
		this.onPlayerRemoved = this.onPlayerRemoved.bind(this);
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...

		this.initializeSpawnPoints();

		// Add remote player references to the array
		this._availableRemotePlayers.push(this._remotePlayer1);
		this._availableRemotePlayers.push(this._remotePlayer2);
		this._availableRemotePlayers.push(this._remotePlayer3);
		this._availableRemotePlayers.push(this._remotePlayer4);
		this._availableRemotePlayers.push(this._remotePlayer5);
		this._availableRemotePlayers.push(this._remotePlayer6);
		this._availableRemotePlayers.push(this._remotePlayer7);

		this._player.setParent(null);

		this._cameraHolder.setTarget(this._player);

		NetworkManager.Instance.onPlayerAdded = this.onPlayerAdded;
		NetworkManager.Instance.onPlayerRemoved = this.onPlayerRemoved;

		NetworkManager.Instance.joinRoom();
	}

	private initializeSpawnPoints() {
		const spawnPoints: TransformNode[] = this._spawnPointsRoot.getChildren();
		this._spawnPoints = new SpawnPoints(spawnPoints);
	}

	private onPlayerAdded(state: PlayerState, sessionId: string) {
		let player: Player = null;

		if (NetworkManager.Instance.Room.sessionId === sessionId) {
			// console.log(`Got local player state!`);

			player = this._player;
		} else {
			// Player is remote
			if (this._availableRemotePlayers.length === 0) {
				console.error(`On Player Added - No more remote player objects to assign!`);
				return;
			}

			// Retrieve a remote player object
			player = this._availableRemotePlayers.splice(0, 1)[0];

			// Add the player to the map of remote players
			this._spawnedRemotes.set(sessionId, player);
		}

		const point: TransformNode = this._spawnPoints.getSpawnPoint(state);

		player.setParent(null);

		player.position.copyFrom(point.position);
		player.rotation.copyFrom(point.rotation);

		player.setEnabled(true);
		player.setPlayerState(state);
	}

	private onPlayerRemoved(state: PlayerState, sessionId: string) {
		console.log(`On Player Removed: ${sessionId}`);

		// Reset remote player
		const player: Player = this._spawnedRemotes.get(sessionId);

		if (player) {
			this._spawnPoints.freeUpSpawnPoint(state);
			this.resetPlayer(player);
			this._spawnedRemotes.delete(sessionId);
		} else {
			console.error(`No spawned remote player object linked to client "${sessionId}"`);
		}
	}

	private resetPlayer(player: Player) {
		player.setPlayerState(null);

		player.setEnabled(false);

		player.setParent(this);

		this._availableRemotePlayers.push(player); //
	}

	private lastChange: number = 0;

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		// ...
		// if (InputManager.getKey(32)) {
		// 	if (Date.now() - this.lastChange > 500) {
		// 		this.lastChange = Date.now();
		// 		const enabled: boolean = !this._player.isEnabled();
		// 		console.log(`Toggle player ${enabled ? 'on' : 'off'} %o`, this._player);
		// 		this._player.setEnabled(enabled);
		// 		this._player.setParent(enabled ? null : this);
		// 	}
		// }
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
