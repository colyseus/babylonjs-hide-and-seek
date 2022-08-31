import { Mesh, Vector3 } from '@babylonjs/core';
import Player from './player';
export default class PlayerVisual extends Mesh {
    private _target;
    private _targetLookDirection;
    private _lerpSpeed;
    private _prevDir;
    private _currentDir;
    private _captured;
    private _capturedTrigger;
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
    setTarget(player: Player): void;
    setLookTargetDirection(direction: Vector3): void;
    setPickable(isPickable: boolean): void;
    setVisibility(visible: boolean): void;
    setCaptured(captured: boolean): void;
    registerPlayerMeshForIntersection(mesh: Mesh): void;
    /**
     * Called each frame.
     */
    onUpdate(): void;
    private rotateToTargetDirection;
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
