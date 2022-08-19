import { TransformNode, Vector3 } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';
import { GameState } from '../GameState';
import type { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
import { fromChildren, fromScene } from '../../decorators';
import CameraHolder from '../players/cameraHolder';
import Player from '../players/player';
import { SpawnPoints } from '../spawnPoints';
import InputManager from './inputManager';
import NetworkManager from './networkManager';
import { PlayerInputMessage } from '../../../../../Server/hide-and-seek/src/models/PlayerInputMessage';

export default class GameManager extends Node {
	private static _instance: GameManager = null;

	@fromScene('Camera Holder')
	private _cameraHolder: CameraHolder;
	@fromScene('CameraStartPos')
	private _cameraStartPos: TransformNode;
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

	private _availableRemotePlayerObjects: Player[] = null;
	private _spawnPoints: SpawnPoints = null;
	private _spawnedRemotes: Map<string, Player> = null;
	private _players: Map<string, PlayerState> = null;
	private _currentGameState: GameState = GameState.NONE;
	private _joiningRoom: boolean = false;
	private _playAgain: boolean = false;

	private _playerChaseSpeed: number = 25;
	private _startChaseSpeed: number = 3;

	public get CurrentGameState(): GameState {
		return GameManager.Instance._currentGameState;
	}

	private set CurrentGameState(gameState: GameState) {
		GameManager.Instance._currentGameState = gameState;
	}

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

		this._availableRemotePlayerObjects = [];
		this._spawnedRemotes = new Map<string, Player>();
		this._players = new Map<string, PlayerState>();

		this.onJoinedRoom = this.onJoinedRoom.bind(this);
		this.onLeftRoom = this.onLeftRoom.bind(this);
		this.onPlayerAdded = this.onPlayerAdded.bind(this);
		this.onPlayerRemoved = this.onPlayerRemoved.bind(this);
		this.onGameStateChange = this.onGameStateChange.bind(this);
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...

		this.initializeSpawnPoints();

		// Add remote player references to the array
		this._availableRemotePlayerObjects.push(this._remotePlayer1);
		this._availableRemotePlayerObjects.push(this._remotePlayer2);
		this._availableRemotePlayerObjects.push(this._remotePlayer3);
		this._availableRemotePlayerObjects.push(this._remotePlayer4);
		this._availableRemotePlayerObjects.push(this._remotePlayer5);
		this._availableRemotePlayerObjects.push(this._remotePlayer6);
		this._availableRemotePlayerObjects.push(this._remotePlayer7);

		this._player.setParent(null);

		NetworkManager.Instance.onJoinedRoom = this.onJoinedRoom;
		NetworkManager.Instance.onLeftRoom = this.onLeftRoom;
		NetworkManager.Instance.onPlayerAdded = this.onPlayerAdded;
		NetworkManager.Instance.onPlayerRemoved = this.onPlayerRemoved;
		NetworkManager.Instance.onGameStateChange = this.onGameStateChange;

		this._cameraHolder.setTarget(this._cameraStartPos, this._startChaseSpeed);
	}

	private initializeSpawnPoints() {
		const spawnPoints: TransformNode[] = this._spawnPointsRoot.getChildren();
		this._spawnPoints = new SpawnPoints(spawnPoints);
	}

	private onJoinedRoom(roomId: string) {
		this._joiningRoom = false;
	}

	private onLeftRoom(code: number) {
		console.log(`Left room: ${code}`);
		this._cameraHolder.setTarget(this._cameraStartPos, this._startChaseSpeed);
	}

	private onPlayerAdded(state: PlayerState, sessionId: string) {
		console.log(`On Player Added: ${sessionId}`);

		this._players.set(sessionId, state);
	}

	private onPlayerRemoved(state: PlayerState, sessionId: string) {
		console.log(`On Player Removed: ${sessionId}`);

		this.despawnPlayer(state);

		this._players.delete(sessionId);
	}

	private resetPlayerObject(player: Player) {
		player.setPlayerState(null);

		player.setVelocity(Vector3.Zero());

		player.setEnabled(false);

		player.setParent(this);

		this._availableRemotePlayerObjects.push(player);
	}

	private onGameStateChange(changes: any[]) {
		// console.log(`Game Manager - On Game State Change: %o`, changes);

		let change: any = null;
		for (let i = 0; i < changes.length; i++) {
			change = changes[i];

			if (!change) {
				continue;
			}

			switch (change.field) {
				case 'currentState':
					this.handleGameStateChange(change.value);
					break;
				case 'countdown':
					this.handleCountdownChange(change.value);
					break;
			}
		}
	}

	private handleGameStateChange(gameState: GameState) {
		console.log(`Game Manager - Game State Changed: ${gameState}`);

		this.CurrentGameState = gameState;

		switch (gameState) {
			case GameState.NONE:
				break;
			case GameState.WAIT_FOR_MINIMUM:
				this.despawnPlayers();
				this._spawnPoints.reset();
				this._playAgain = false;
				break;
			case GameState.CLOSE_COUNTDOWN:
				break;
			case GameState.INITIALIZE:
				break;
			case GameState.PROLOGUE:
				// Set up player objects for the local player as well as all remote players
				this.spawnPlayers();

				// Send the initial position of the player to the server
				NetworkManager.Instance.sendPlayerPosition(new PlayerInputMessage(this._player.position.asArray()));

				this._cameraHolder.setTargetPosition(this._player.position, this._startChaseSpeed);
				break;
			case GameState.SCATTER:
				this._cameraHolder.setTarget(this._player, this._playerChaseSpeed);
				break;
			case GameState.HUNT:
				break;
			case GameState.GAME_OVER:
				break;
			default:
				break;
		}
	}

	private handleCountdownChange(countdown: number) {
		console.log(`Countdown: ${countdown}`);
	}

	private spawnPlayers() {
		NetworkManager.Instance.Room.state.players.forEach((player: PlayerState, sessionId: string) => {
			this.spawnPlayer(player, sessionId);
		});
	}

	private spawnPlayer(playerState: PlayerState, sessionId: string) {
		let player: Player = null;

		if (NetworkManager.Instance.Room.sessionId === sessionId) {
			// Assign the local player object
			player = this._player;
		} else {
			// Player is remote
			if (this._availableRemotePlayerObjects.length === 0) {
				console.error(`On Player Added - No more remote player objects to assign!`);
				return;
			}

			// Retrieve a remote player object
			player = this._availableRemotePlayerObjects.splice(0, 1)[0];

			// Add the player to the map of remote players
			this._spawnedRemotes.set(sessionId, player);
		}

		const point: TransformNode = this._spawnPoints.getSpawnPoint(playerState);

		player.setParent(null);

		player.position.copyFrom(point.position);
		player.rotation.copyFrom(point.rotation);

		// Delay enabling player object to avoid visual briefly appearing somewhere else before getting moved to its spawn position
		setTimeout(() => {
			player.setEnabled(true);
		}, 100);

		player.setPlayerState(playerState);
	}

	private despawnPlayers() {
		NetworkManager.Instance.Room.state.players.forEach((player: PlayerState, sessionId: string) => {
			this.despawnPlayer(player);
		});
	}

	private despawnPlayer(player: PlayerState) {
		// Reset the player object if it has been spawned
		let playerObject: Player;

		console.log(`Despawn Player: %o`, player);

		if (player.id === NetworkManager.Instance.Room.sessionId) {
			playerObject = this._player;
		} else {
			playerObject = this._spawnedRemotes.get(player.id);
			this._spawnedRemotes.delete(player.id);
		}

		if (playerObject) {
			this.resetPlayerObject(playerObject);
		}

		this._spawnPoints.freeUpSpawnPoint(player);
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		// ...

		if (!NetworkManager.Instance.Room && InputManager.getKeyUp(32) && !this._joiningRoom) {
			console.log('Join Room');
			this._joiningRoom = true;
			NetworkManager.Instance.joinRoom();
		} else {
			if (NetworkManager.Instance.Room && this.CurrentGameState === GameState.GAME_OVER && !this._playAgain && InputManager.getKeyUp(32)) {
				this._playAgain = true;
				this._cameraHolder.setTarget(this._cameraStartPos, this._startChaseSpeed);
				NetworkManager.Instance.sendPlayAgain();
			}
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
