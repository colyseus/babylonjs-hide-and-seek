import { Mesh, Vector3 } from '@babylonjs/core';
import type { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
export default class Player extends Mesh {
    private _movementSpeed;
    isLocalPlayer: boolean;
    private _rigidbody;
    private _xDirection;
    private _zDirection;
    private _lastPosition;
    private _previousMovements;
    private _state;
    /**
     * Override constructor.
     * @warn do not fill.
     */
    constructor();
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    onInitialize(): void;
    /**
     * Called on the scene starts.
     */
    onStart(): void;
    setPlayerState(state: PlayerState): void;
    /**
     * Called each frame.
     */
    onUpdate(): void;
    setVelocity(vel: Vector3): void;
    private updatePlayerMovement;
    private updatePositionFromState;
    private sendPositionUpdateToServer;
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
