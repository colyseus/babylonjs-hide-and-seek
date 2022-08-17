import { Node } from '@babylonjs/core/node';
import * as Colyseus from 'colyseus.js';
import type { HASRoomState } from '../../../../../Server/hide-and-seek/src/rooms/schema/HASRoomState';
import type { PlayerInputMessage } from '../../../../../Server/hide-and-seek/src/models/PlayerInputMessage';
import type { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
export default class NetworkManager extends Node {
    onJoinedRoom: (roomId: string) => void;
    onPlayerAdded: (state: PlayerState, sesstionId: string) => void;
    onPlayerRemoved: (state: PlayerState, sessionId: string) => void;
    onGameStateChange: (changes: any[]) => void;
    onLeftRoom: (code: number) => void;
    private static _instance;
    private _serverSettings;
    private _client;
    private _room;
    /**
     * Override constructor.
     * @warn do not fill.
     */
    protected constructor();
    static get Instance(): NetworkManager;
    getColyseusServerAddress(): string;
    setColyseusServerAddress(value: string): void;
    getColyseusServerPort(): number;
    setColyseusServerPort(value: number): void;
    get ColyseusUseSecure(): boolean;
    set ColyseusUseSecure(value: boolean);
    private WebSocketEndPoint;
    private WebRequestEndPoint;
    get Room(): Colyseus.Room<HASRoomState>;
    private set Room(value);
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    onInitialize(): void;
    private bindHandlers;
    /**
     * Called on the scene starts.
     */
    onStart(): Promise<void>;
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
    joinRoom(roomId?: string): Promise<void>;
    private joinRoomWithId;
    private registerRoomHandlers;
    private unregisterRoomHandlers;
    sendPlayerPosition(positionMsg: PlayerInputMessage): void;
    private handleMessages;
}
