import { Node } from '@babylonjs/core/node';
import { GameState } from '../GameState';
import type { PlayerState } from '../../../../../Server/src/rooms/schema/PlayerState';
import Player from '../players/player';
import InteractableTrigger from '../interactables/interactableTrigger';
export default class GameManager extends Node {
    private static _instance;
    private _playerChaseSpeed;
    private _startChaseSpeed;
    /** In ms, the time between messages sent to the server for each Hider discovered by the Seeker */
    private _foundHiderMsgRate;
    /** The positional values that mark the boundaries of the arena */
    private _arenaBoundaries;
    private _cameraHolder;
    private _cameraStartPos;
    private _spawnPointsRoot;
    private _player;
    private _availableRemotePlayerObjects;
    private _spawnPoints;
    private _spawnedRemotes;
    private _players;
    private _currentGameState;
    private _joiningRoom;
    private _halfSeekerFOV;
    private _foundHiders;
    private _playerState;
    private _eventEmitter;
    private _cachedInteractables;
    private _countdown;
    private _characterVisuals;
    static get PlayerState(): PlayerState;
    get Countdown(): number;
    get CurrentGameState(): GameState;
    private set CurrentGameState(value);
    static get Instance(): GameManager;
    static get DeltaTime(): number;
    ArenaWidthBoundary(): number;
    ArenaDepthBoundary(): number;
    SeekerWon(): boolean;
    addOnEvent(eventName: string, callback: (data?: any) => void): void;
    removeOnEvent(eventName: string, callback: (data?: any) => void): void;
    private broadcastEvent;
    /**
     * Override constructor.
     * @warn do not fill.
     */
    protected constructor();
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    onInitialize(): void;
    /**
     * Called on the scene starts.
     */
    onStart(): void;
    private initializePlayers;
    private collectCharacterVisuals;
    private reparentCharacterVisuals;
    PlayerIsSeeker(): boolean;
    joinRoom(roomId?: string): Promise<void>;
    registerInteractable(interactable: InteractableTrigger): void;
    private initializeSpawnPoints;
    private onJoinedRoom;
    private onLeftRoom;
    private onPlayerAdded;
    private onPlayerStateChange;
    private onPlayerRemoved;
    private resetPlayerObject;
    private onGameStateChange;
    private handleGameStateChange;
    private handleCountdownChange;
    private spawnPlayers;
    private spawnPlayer;
    private despawnPlayers;
    private despawnPlayer;
    private hidePlayersFromSeeker;
    private revealAllPlayers;
    /**
     * Used only when the local player is the Seeker to retrieve any Hider
     * player objects within distance to the Seeker player.
     */
    getOverlappingHiders(): Player[];
    seekerFoundHider(hider: Player): void;
    rescueCapturedHider(hider: Player): void;
    private playerCaptureChanged;
    private reset;
    /**
     * Called each frame.
     */
    onUpdate(): void;
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    onStop(): void;
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    onMessage(name: string, data: any, sender: any): void;
}
