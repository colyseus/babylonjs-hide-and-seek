import { Node } from '@babylonjs/core/node';
import * as Colyseus from 'colyseus.js';
import type { HASRoomState } from '../../../../Server/src/rooms/HASRoom';
/**
 * This represents a script that is attached to a node in the editor.
 * Available nodes are:
 *      - Meshes
 *      - Lights
 *      - Cameas
 *      - Transform nodes
 *
 * You can extend the desired class according to the node type.
 * Example:
 *      export default class MyMesh extends Mesh {
 *          public onUpdate(): void {
 *              this.rotation.y += 0.04;
 *          }
 *      }
 * The function "onInitialize" is called immediately after the constructor is called.
 * The functions "onStart" and "onUpdate" are called automatically.
 */
export default class NetworkManager extends Node {
	private _serverSettings;
	private _client;
	private _room;
	/**
	 * Override constructor.
	 * @warn do not fill.
	 */
	protected constructor();
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
}
