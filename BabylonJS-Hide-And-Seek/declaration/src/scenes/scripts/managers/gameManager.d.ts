import { Node } from '@babylonjs/core/node';
export default class GameManager extends Node {
    private static _instance;
    private _cameraHolder;
    private _spawnPointsRoot;
    private _player;
    private _remotePlayer1;
    private _remotePlayer2;
    private _remotePlayer3;
    private _remotePlayer4;
    private _remotePlayer5;
    private _remotePlayer6;
    private _remotePlayer7;
    private _availableRemotePlayers;
    private _spawnPoints;
    private _spawnedRemotes;
    static get Instance(): GameManager;
    static get DeltaTime(): number;
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
    private initializeSpawnPoints;
    private onPlayerAdded;
    private onPlayerRemoved;
    private resetPlayer;
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
