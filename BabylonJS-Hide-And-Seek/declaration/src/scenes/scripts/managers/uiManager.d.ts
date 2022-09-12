import { Node } from '@babylonjs/core/node';
export default class UIManager extends Node {
    private _camera;
    private _uiLayer;
    private _titleUI;
    private _lobbyUI;
    private _prologueUI;
    private _gameplayUI;
    private _overlayUI;
    private _statUI;
    private _engine;
    private _gameOverDelay;
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
     * Called on the node has been fully initialized and is ready.
     */
    onInitialized(): void;
    /**
     * Called on the scene starts.
     */
    onStart(): Promise<void>;
    private initializeUICamera;
    private loadUI;
    private loadTitleUI;
    private loadOverlayUI;
    private loadLobbyUI;
    private loadPrologueUI;
    private loadGameplayUI;
    private loadStatsUI;
    private handleJoinRoom;
    private handleLeftRoom;
    private handleReturnToTitle;
    private handlePlayAgain;
    private handleGameStateChanged;
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
