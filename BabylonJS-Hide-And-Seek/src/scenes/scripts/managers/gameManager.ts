import { AbstractMesh, Quaternion, TransformNode, Vector3 } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';
import { GameState } from '../GameState';
import type { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
import { fromChildren, fromScene } from '../../decorators';
import CameraHolder from '../players/cameraHolder';
import Player from '../players/player';
import { SpawnPoints } from '../spawnPoints';
import InputManager from './inputManager';
import NetworkManager, { NetworkEvent } from './networkManager';
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
	private _seekerFOV: number = 60;
	public seekerCheckDistance: number = 6;
	/** In ms, the time between messages sent to the server for each Hider discovered by the Seeker */
	private _foundHiderMsgRate: number = 1000;

	private _halfSeekerFOV: number = 0;
	private _foundHiders: Map<string, Player>;

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
		this._foundHiders = new Map<string, Player>();

		this._halfSeekerFOV = this._seekerFOV / 2;

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

		// NetworkManager.Instance.onJoinedRoom = this.onJoinedRoom;
		// NetworkManager.Instance.onLeftRoom = this.onLeftRoom;
		// NetworkManager.Instance.onPlayerAdded = this.onPlayerAdded;
		// NetworkManager.Instance.onPlayerRemoved = this.onPlayerRemoved;
		// NetworkManager.Instance.onGameStateChange = this.onGameStateChange;

		NetworkManager.Instance.onEvent(NetworkEvent.JOINED_ROOM, this.onJoinedRoom);
		NetworkManager.Instance.onEvent(NetworkEvent.LEFT_ROOM, this.onLeftRoom);
		NetworkManager.Instance.onEvent(NetworkEvent.PLAYER_ADDED, this.onPlayerAdded);
		NetworkManager.Instance.onEvent(NetworkEvent.PLAYER_REMOVED, this.onPlayerRemoved);
		NetworkManager.Instance.onEvent(NetworkEvent.GAME_STATE_CHANGED, this.onGameStateChange);

		this._cameraHolder.setTarget(this._cameraStartPos, this._startChaseSpeed);

		// Set the layermask of all scene meshes so they aren't visible in the UI camera
		//================================================
		let meshes: AbstractMesh[] = this._scene.meshes;

		const meshLayermask: number = 1;
		meshes.forEach((mesh: AbstractMesh) => {
			// console.log(`Setting ${mesh.name} Layermask to ${meshLayermask}`);
			mesh.layerMask = meshLayermask;
		});
		//================================================
	}

	public async joinRoom(roomId: string = null): Promise<void> {
		if (this._joiningRoom || NetworkManager.Instance.Room) {
			return;
		}

		if (!roomId) {
			console.log('Start Quick Play!');
		} else {
			console.log(`Join room "${roomId}"`);
		}

		this._joiningRoom = true;

		try {
			await NetworkManager.Instance.joinRoom(roomId);
		} catch (error: any) {
			this._joiningRoom = false;
			throw new Error(error.message);
		}
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
		this.reset();
	}

	private onPlayerAdded(state: PlayerState) {
		console.log(`On Player Added: %o`, state.id);

		this._players.set(state.id, state);
	}

	private onPlayerRemoved(state: PlayerState) {
		console.log(`On Player Removed: ${state.id}`);

		this.despawnPlayer(state);

		this._players.delete(state.id);
	}

	private resetPlayerObject(player: Player) {
		player.reset();

		player.toggleEnabled(false);

		player.setParent(this);

		if (!player.isLocalPlayer) {
			this._availableRemotePlayerObjects.push(player);
		}
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
				this.reset();
				break;
			case GameState.CLOSE_COUNTDOWN:
				break;
			case GameState.INITIALIZE:
				break;
			case GameState.PROLOGUE:
				// Set up player objects for the local player as well as all remote players
				this.spawnPlayers();

				// Send the initial position of the player to the server
				NetworkManager.Instance.sendPlayerPosition(new PlayerInputMessage([], this._player.position.asArray()));

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

		player.setVisualLookDirection(point.forward);

		// Delay enabling player object to avoid visual briefly appearing somewhere else before getting moved to its spawn position
		setTimeout(() => {
			player.toggleEnabled(true);
		}, 100);

		player.setPlayerState(playerState);
	}

	private despawnPlayers() {
		// if (NetworkManager.Instance.Room) {
		// 	NetworkManager.Instance.Room.state.players.forEach((player: PlayerState, sessionId: string) => {
		// 		this.despawnPlayer(player);
		// 	});
		// } else {
		this.resetPlayerObject(this._player);

		this._spawnedRemotes.forEach((playerObject: Player) => {
			this.resetPlayerObject(playerObject);
		});

		this._spawnedRemotes.clear();
		// }
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
	 * Used only when the local player is the Seeker to retrieve any Hider
	 * player objects within distance to the Seeker player.
	 */
	public getOverlappingHiders(): Player[] {
		const overlappingHiders: Player[] = [];

		this._spawnedRemotes.forEach((hider: Player) => {
			const forward: Vector3 = this._player.visualForward();
			const dir: Vector3 = hider.position.subtract(this._player.position).normalize();

			// Check for Hiders within the field of view of the Seeker by getting the angle between the Seeker's
			// forward vector and the normalized direction vector between the Seeker and the Hider
			let angle: number = Math.abs(Vector3.GetAngleBetweenVectors(forward, dir, Vector3.Forward()));

			// Convert angle to degrees
			angle *= 180 / Math.PI;

			// console.log(`Forward: (${forward.x}, ${forward.y}, ${forward.z})\nDir: (${dir.x}, ${dir.y}, ${dir.z})\nAngle: ${angle}`);

			// If angle falls within the Seekers FOV check if the hider is close enough.
			// If within the check distance the hider is a possible candiate for capture as
			// as they are overlapping with the Seeker capture area.
			if (angle <= this._halfSeekerFOV && Vector3.Distance(this._player.position, hider.position) <= this.seekerCheckDistance) {
				// console.log(`Overlapping Hider: %o`, hider);
				overlappingHiders.push(hider);
			}
		});

		return overlappingHiders;
	}

	public seekerFoundHider(hider: Player) {
		// Sending the message to the server is not a guarantee the Hider will be captured by the Seeker.
		// The server will do a final, yet simple, check to see if the Hider is close enough to be considered found.

		// Only send a capture message to the server if the hider is not currently captured
		// or if we haven't sent a message in the past 'x' seconds
		if (!hider.isCaptured() && !this._foundHiders.has(hider.sessionId())) {
			// console.log(`Game Manager - Seeker found player: ${hider.sessionId()}`);
			this._foundHiders.set(hider.sessionId(), hider);

			// Send server message
			NetworkManager.Instance.sendHiderFound(hider.sessionId());

			// Remove the found hider from the collection after the elapsed time
			// to allow the message to be sent again
			setTimeout(() => {
				this._foundHiders.delete(hider.sessionId());
			}, this._foundHiderMsgRate);
		}
	}

	private reset() {
		this.despawnPlayers();
		this.initializeSpawnPoints();

		this._foundHiders.clear();
		this._playAgain = false;
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		// ...

		// if (!NetworkManager.Instance.Room && InputManager.getKeyUp(32) && !this._joiningRoom) {
		// 	console.log('Join Room');
		// 	this._joiningRoom = true;
		// 	NetworkManager.Instance.joinRoom();
		// } else {
		if (NetworkManager.Instance.Room && this.CurrentGameState === GameState.GAME_OVER && !this._playAgain && InputManager.getKeyUp(32)) {
			this._playAgain = true;
			this._cameraHolder.setTarget(this._cameraStartPos, this._startChaseSpeed);
			NetworkManager.Instance.sendPlayAgain();
		}
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
