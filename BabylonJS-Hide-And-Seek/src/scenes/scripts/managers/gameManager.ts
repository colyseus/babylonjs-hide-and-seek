import { AbstractMesh, TransformNode, Vector3 } from '@babylonjs/core';
import EventEmitter = require('events');
import { Node } from '@babylonjs/core/node';
import { GameState } from '../GameState';
import type { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
import { fromChildren, fromScene } from '../../decorators';
import CameraHolder from '../players/cameraHolder';
import Player from '../players/player';
import { SpawnPoints } from '../spawnPoints';
import NetworkManager, { NetworkEvent } from './networkManager';
import { PlayerInputMessage } from '../../../../../Server/hide-and-seek/src/models/PlayerInputMessage';
import InteractableTrigger from '../interactables/interactableTrigger';
import { delay } from '../../utility';

export default class GameManager extends Node {
	private static _instance: GameManager = null;

	// Magic Numbers
	//==========================================
	private _playerChaseSpeed: number = 25;
	private _startChaseSpeed: number = 3;
	private _seekerFOV: number = 60;
	public seekerCheckDistance: number = 6;
	/** In ms, the time between messages sent to the server for each Hider discovered by the Seeker */
	private _foundHiderMsgRate: number = 1000;
	//==========================================

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

	private _halfSeekerFOV: number = 0;
	private _foundHiders: Map<string, Player>;
	private _playerState: PlayerState = null;

	private _eventEmitter: EventEmitter = new EventEmitter();

	private _cachedInteractables: InteractableTrigger[];
	private _countdown: number = 0;

	private _characterVisuals: TransformNode[];

	public static get PlayerState(): PlayerState {
		return GameManager.Instance._playerState;
	}

	public get Countdown(): number {
		return this._countdown;
	}

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

	public SeekerWon(): boolean {
		return NetworkManager.Instance.Room.state.gameState.seekerWon;
	}

	public addOnEvent(eventName: string, callback: (data?: any) => void) {
		this._eventEmitter.addListener(eventName, callback);
	}

	public removeOnEvent(eventName: string, callback: (data?: any) => void) {
		this._eventEmitter.removeListener(eventName, callback);
	}

	private broadcastEvent(eventName: string, data?: any) {
		this._eventEmitter.emit(eventName, data);
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

		this._spawnedRemotes = new Map<string, Player>();
		this._players = new Map<string, PlayerState>();
		this._foundHiders = new Map<string, Player>();
		this._availableRemotePlayerObjects = [];
		this._cachedInteractables = [];
		this._characterVisuals = [];

		this._halfSeekerFOV = this._seekerFOV / 2;

		this.onJoinedRoom = this.onJoinedRoom.bind(this);
		this.onLeftRoom = this.onLeftRoom.bind(this);
		this.onPlayerAdded = this.onPlayerAdded.bind(this);
		this.onPlayerRemoved = this.onPlayerRemoved.bind(this);
		this.onGameStateChange = this.onGameStateChange.bind(this);
		this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...

		this.initializeSpawnPoints();

		this.initializePlayers();
		this.collectCharacterVisuals();

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

		NetworkManager.Instance.addOnEvent(NetworkEvent.JOINED_ROOM, this.onJoinedRoom);
		NetworkManager.Instance.addOnEvent(NetworkEvent.LEFT_ROOM, this.onLeftRoom);
		NetworkManager.Instance.addOnEvent(NetworkEvent.PLAYER_ADDED, this.onPlayerAdded);
		NetworkManager.Instance.addOnEvent(NetworkEvent.PLAYER_REMOVED, this.onPlayerRemoved);
		NetworkManager.Instance.addOnEvent(NetworkEvent.GAME_STATE_CHANGED, this.onGameStateChange);
	}

	private initializePlayers() {
		// Add remote player references to the array
		this._availableRemotePlayerObjects.push(this._remotePlayer1);
		this._availableRemotePlayerObjects.push(this._remotePlayer2);
		this._availableRemotePlayerObjects.push(this._remotePlayer3);
		this._availableRemotePlayerObjects.push(this._remotePlayer4);
		this._availableRemotePlayerObjects.push(this._remotePlayer5);
		this._availableRemotePlayerObjects.push(this._remotePlayer6);
		this._availableRemotePlayerObjects.push(this._remotePlayer7);

		this._availableRemotePlayerObjects.forEach((player: Player) => {
			player.registerPlayerMeshForIntersection(this._player.visual.rescueMesh);
		});

		this._player.setParent(null);

		// Register any cached interactables
		if (this._cachedInteractables.length > 0) {
			console.log(`Registering ${this._cachedInteractables.length} interactables`);
			this._cachedInteractables.forEach((interactable: InteractableTrigger) => {
				this.registerInteractable(interactable);
			});
		}
	}

	private collectCharacterVisuals() {
		for (let i = 0; i < 7; i++) {
			this._characterVisuals.push(this._scene.getTransformNodeByName(`V-ghost ${i + 1}`));
		}

		// Add the seeker visual last; we will always assume the seeker visual is last
		this._characterVisuals.push(this._scene.getTransformNodeByName('V-seeker'));

		// console.log(`Character Visuals: %o`, this._characterVisuals);

		this.reparentCharacterVisuals();
	}

	private reparentCharacterVisuals() {
		for (let i = 0; i < this._characterVisuals.length; i++) {
			this._characterVisuals[i].setParent(this);
			this._characterVisuals[i].setEnabled(false);
		}
	}

	public PlayerIsSeeker(): boolean {
		return this._playerState.isSeeker;
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

	public registerInteractable(interactable: InteractableTrigger) {
		if (this._availableRemotePlayerObjects.length <= 0) {
			// Cache the interactable until the remote players have been initialized
			this._cachedInteractables.push(interactable);
		} else {
			// Register each remote player object with the interactable
			this._availableRemotePlayerObjects.forEach((player: Player) => {
				interactable.registerMeshForIntersection(player.visual);
			});

			// Register the local player object with the interactable
			interactable.registerMeshForIntersection(this._player.visual);
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

		this._playerState = null;
		this.reset();
	}

	private onPlayerAdded(state: PlayerState) {
		console.log(`On Player Added: %o`, state.id);

		if (state.id === NetworkManager.Instance.Room.sessionId) {
			console.log(`Local Player State Received!`);
			this._playerState = state;
		}

		state.onChange = (changes: any[]) => {
			this.onPlayerStateChange(state.id, changes);
		};

		this._players.set(state.id, state);
	}

	private onPlayerStateChange(sessionId: string, changes: any[]) {
		let change: any = null;
		for (let i = 0; i < changes.length; i++) {
			change = changes[i];

			if (!change) {
				continue;
			}

			switch (change.field) {
				case 'playAgain':
					this.broadcastEvent('playerPlayAgain', { sessionId, value: change.value });
					break;
				case 'isCaptured':
					// this.broadcastEvent('playerCaptured', { sessionId, value: change.value });
					this.playerCaptureChanged(sessionId, change.value);
					break;
			}
		}
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
		let stateChange: GameState = null;
		for (let i = 0; i < changes.length; i++) {
			change = changes[i];

			if (!change) {
				continue;
			}

			switch (change.field) {
				case 'currentState':
					stateChange = change.value;
					break;
				case 'countdown':
					this.handleCountdownChange(Number(change.value));
					break;
			}
		}

		if (stateChange) {
			this.handleGameStateChange(stateChange);
		}
	}

	private handleGameStateChange(gameState: GameState) {
		// console.log(`Game Manager - Game State Changed: ${gameState}`);

		this.CurrentGameState = gameState;

		switch (gameState) {
			case GameState.NONE:
				this.reparentCharacterVisuals();
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

				if (this.PlayerIsSeeker()) {
					this.hidePlayersFromSeeker();
				}
				break;
			case GameState.HUNT:
				break;
			case GameState.GAME_OVER:
				this.revealAllPlayers();
				break;
			default:
				break;
		}

		this.broadcastEvent('gameStateChanged', gameState);
	}

	private handleCountdownChange(countdown: number) {
		if (!this.CurrentGameState) {
			return;
		}

		this._countdown = countdown;

		this.broadcastEvent('updateCountdown', this._countdown);
	}

	private spawnPlayers() {
		NetworkManager.Instance.Room.state.players.forEach((player: PlayerState, sessionId: string) => {
			this.spawnPlayer(player, sessionId);
		});

		this.revealAllPlayers();
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

		// Assign character visual
		//============================
		const visualIndex: number = playerState.spawnPoint > -1 ? playerState.spawnPoint + 1 : this._characterVisuals.length - 1;

		const visual: TransformNode = this._characterVisuals[visualIndex];

		player.setVisual(visual);
		//============================

		const point: TransformNode = this._spawnPoints.getSpawnPoint(playerState);

		player.setParent(null);

		player.position.copyFrom(point.position);

		player.setVisualLookDirection(point.forward);

		// Delay enabling player object to avoid visual briefly appearing somewhere else before getting moved to its spawn position
		setTimeout(() => {
			player.toggleEnabled(true);
		}, 100);

		player.setPlayerState(playerState);

		console.log(`Game Manager - Spawn Player - set captured trigger size`);
		player.setCapturedTriggerSize(NetworkManager.Config.RescueDistance);
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

	private hidePlayersFromSeeker() {
		if (!this.PlayerIsSeeker()) {
			console.log(`Player is not the Seeker`);
			return;
		}

		this._spawnedRemotes.forEach((player: Player) => {
			player.setVisualVisibility(false);
		});
	}

	private revealAllPlayers() {
		this._spawnedRemotes.forEach((player: Player) => {
			player.setVisualVisibility(true);
		});
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

	public rescueCapturedHider(hider: Player) {
		NetworkManager.Instance.sendRescueHider(hider.sessionId());
	}

	private playerCaptureChanged(playerId: string, captured: boolean) {
		if (playerId === NetworkManager.Instance.Room.sessionId) {
			// Local player was captured
			this._player.showCaptured(captured);
		}

		const remotePlayer: Player = this._spawnedRemotes.get(playerId);

		if (remotePlayer) {
			remotePlayer.showCaptured(captured);
		}
	}

	private reset() {
		this.despawnPlayers();
		this.initializeSpawnPoints();

		this.CurrentGameState = GameState.NONE;
		this._foundHiders.clear();
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		//
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
