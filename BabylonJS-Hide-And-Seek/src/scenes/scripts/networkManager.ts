import { Node } from '@babylonjs/core/node';
import * as Colyseus from 'colyseus.js';
// @ts-ignore 2459
import type { HASRoomState } from '../../../../Server/hide-and-seek/src/rooms/HASRoom';
import ColyseusSettings from './colyseusSettings';

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
	private _serverSettings: ColyseusSettings = null;
	private _client: Colyseus.Client = null;
	private _room: Colyseus.Room<HASRoomState> = null;

	/**
	 * Override constructor.
	 * @warn do not fill.
	 */
	// @ts-ignore ignoring the super call as we don't want to re-init
	protected constructor() {}

	public get ColyseusServerAddress(): string {
		return this._serverSettings?.colyseusServerAddress || 'localhost';
	}

	public set ColyseusServerAddress(value: string) {
		this._serverSettings.colyseusServerAddress = value;
	}

	public get ColyseusServerPort(): number {
		return this._serverSettings?.colyseusServerPort || 2567;
	}

	public set ColyseusServerPort(value: number) {
		this._serverSettings.colyseusServerPort = value;
	}

	public get ColyseusUseSecure(): boolean {
		return this._serverSettings?.useSecureProtocol || false;
	}

	public set ColyseusUseSecure(value: boolean) {
		this._serverSettings.useSecureProtocol = value;
	}

	private get WebSocketEndPoint(): string {
		return `${this.ColyseusUseSecure ? 'wss' : 'ws'}://${this.ColyseusServerAddress}:${this.ColyseusServerPort}`;
	}

	private get WebRequestEndPoint(): string {
		return `${this.ColyseusUseSecure ? 'https' : 'http'}://${this.ColyseusServerAddress}:${this.ColyseusServerPort}`;
	}

	public get Room() {
		return this._room;
	}

	private set Room(value: Colyseus.Room<HASRoomState>) {
		this._room = value;
	}

	/**
	 * Called on the node is being initialized.
	 * This function is called immediatly after the constructor has been called.
	 */
	public async onInitialize(): Promise<void> {
		// ...
		// console.log(`Network Manager - On Initialize - Create Colyseus Client`);
		// this._client = new Colyseus.Client('ws://localhost:2567');
		// console.log(this._client);
		// this.Room = await this._client.joinOrCreate('HAS_room');
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		// ...
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
