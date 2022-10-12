import { Mesh } from '@babylonjs/core';
export default class CapturedVFX extends Mesh {
    private _center;
    private _innerChains;
    private _outerChains;
    private _halo;
    private _particlesPrefab;
    private _emitter;
    private _play;
    private _particles;
    private _maxChainSpeed;
    private _minChainSpeed;
    private _chainSpinSpeed;
    private _chainLerpTime;
    private _haloPunchTime;
    private _chainFadeTime;
    private _rescuePunchTime;
    private debugPlay;
    private debugRescue;
    private debugStop;
    private _playingCaptured;
    private _playerRescued;
    private _meshes;
    playingFX(): boolean;
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
    onStart(): void;
    private resetMeshes;
    playCaptured(): Promise<void>;
    playRescued(): Promise<void>;
    stop(): void;
    private resetFX;
    private punchHaloScaleIn;
    private lerpChainSpeed;
    private fadeChainsIn;
    private punchFXOut;
    private setHaloScale;
    private setScale;
    private setChainVisibility;
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
