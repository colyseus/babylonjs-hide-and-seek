import { Node } from '@babylonjs/core/node';
import * as Colyseus from 'colyseus.js';
// @ts-ignore 2459
import type { HASRoomState } from '../../../../Server/hide-and-seek/src/rooms/HASRoom';
import ColyseusSettings from '../colyseusSettings';

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

	public getColyseusServerAddress(): string {
		return this._serverSettings?.colyseusServerAddress || 'localhost';
	}

	public setColyseusServerAddress(value: string) {
		this._serverSettings.colyseusServerAddress = value;
	}

	public getColyseusServerPort(): number {
		return this._serverSettings?.colyseusServerPort || 2567;
	}

	public setColyseusServerPort(value: number) {
		this._serverSettings.colyseusServerPort = value;
	}

	public get ColyseusUseSecure(): boolean {
		return this._serverSettings?.useSecureProtocol || false;
	}

	public set ColyseusUseSecure(value: boolean) {
		this._serverSettings.useSecureProtocol = value;
	}

	private WebSocketEndPoint(): string {
		return `${this.ColyseusUseSecure ? 'wss' : 'ws'}://${this.getColyseusServerAddress()}:${this.getColyseusServerPort()}`;
	}

	private WebRequestEndPoint(): string {
		return `${this.ColyseusUseSecure ? 'https' : 'http'}://${this.getColyseusServerAddress()}:${this.getColyseusServerPort()}`;
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
	public onInitialize(): void {
		// ...
	}

	/**
	 * Called on the scene starts.
	 */
	public async onStart(): Promise<void> {
		// ...
		console.log(`Network Manager - On Initialize - Create Colyseus Client with URL: ${this.WebSocketEndPoint()}`);
		this._client = new Colyseus.Client(this.WebSocketEndPoint());

		// await this.joinRoom();

		// console.log(`Joined Room! - ${this.Room.id}`);
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

	public async joinRoom(roomId: string = '') {
		this.Room = await this.joinRoomWithId(roomId);

		this.registerRoomHandlers();
	}

	private async joinRoomWithId(roomId: string = ''): Promise<Colyseus.Room<HASRoomState>> {
		try {
			if (roomId) {
				return await this._client.joinById(roomId);
			} else {
				return await this._client.joinOrCreate('HAS_room');
			}
		} catch (error: any) {
			console.error(error.stack);
		}
	}

	private registerRoomHandlers() {
		console.log(`Register Room Handlers`);

		if (this.Room) {
			// this.Room.onLeave.once(this.onLeaveGridRoom);
			// this.Room.onStateChange.once(this.onRoomStateChange);
			// this.Room.state.networkedUsers.onAdd = MMOManager.Instance.onAddNetworkedUser;
			// this.Room.state.networkedUsers.onRemove = MMOManager.Instance.onRemoveNetworkedUser;
			// this.Room.onMessage<ObjectUseMessage>('objectUsed', (msg) => {
			// 	this.awaitObjectInteraction(msg.interactedObjectID, msg.interactingStateID);
			// });
			// this.Room.onMessage<MovedToGridMessage>('movedToGrid', (msg) => {
			// 	this.onMovedToGrid(msg);
			// });
		} else {
			console.error(`Cannot register room handlers; room is null!`);
		}
	}

	private unregisterRoomHandlers() {
		if (this.Room) {
			// this.Room.onLeave.remove(this.onLeaveGridRoom);
			// this.Room.onStateChange.remove(this.onRoomStateChange);
			// this.Room.state.networkedUsers.onAdd = null;
			// this.Room.state.networkedUsers.onRemove = null;
		}
	}
}
