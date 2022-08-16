import { Vector3 } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';
import * as Colyseus from 'colyseus.js';
import type { HASRoomState } from '../../../../../Server/hide-and-seek/src/rooms/schema/HASRoomState';
import { PlayerInputMessage } from '../../../../../Server/hide-and-seek/src/models/PlayerInputMessage';
import ColyseusSettings from '../colyseusSettings';
import { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
import GameManager from './gameManager';
import { EventEmitter } from 'stream';

export default class NetworkManager extends Node {
	public onPlayerAdded: (state: PlayerState, sesstionId: string) => void;
	public onPlayerRemoved: (state: PlayerState, sessionId: string) => void;

	private static _instance: NetworkManager = null;

	private _serverSettings: ColyseusSettings = null;
	private _client: Colyseus.Client = null;
	private _room: Colyseus.Room<HASRoomState> = null;

	/**
	 * Override constructor.
	 * @warn do not fill.
	 */
	// @ts-ignore ignoring the super call as we don't want to re-init
	protected constructor() {}

	public static get Instance(): NetworkManager {
		return NetworkManager._instance;
	}

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
		NetworkManager._instance = this;

		console.log(`Network Manager - On Initialize - Create Colyseus Client with URL: ${this.WebSocketEndPoint()}`);
		this._client = new Colyseus.Client(this.WebSocketEndPoint());

		this.bindHandlers();
	}

	private bindHandlers() {
		this.handleMessages = this.handleMessages.bind(this);
	}

	/**
	 * Called on the scene starts.
	 */
	public async onStart(): Promise<void> {
		// // ...
		// console.log(`Network Manager - On Initialize - Create Colyseus Client with URL: ${this.WebSocketEndPoint()}`);
		// this._client = new Colyseus.Client(this.WebSocketEndPoint());
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

		if (this.Room) {
			console.log(`Joined Room: ${this.Room.id}`);
		}

		this.registerRoomHandlers();
	}

	private async joinRoomWithId(roomId: string = ''): Promise<Colyseus.Room<HASRoomState>> {
		try {
			if (roomId) {
				console.log(`Join room with id: ${roomId}`);
				return await this._client.joinById(roomId);
			} else {
				console.log(`Join or create room`);
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

			this.Room.state.players.onAdd = this.onPlayerAdded;
			this.Room.state.players.onRemove = this.onPlayerRemoved;

			this.Room.onMessage('*', this.handleMessages);
		} else {
			console.error(`Cannot register room handlers; room is null!`);
		}
	}

	private unregisterRoomHandlers() {
		if (this.Room) {
			this.Room.state.players.onAdd = null;
			this.Room.state.players.onRemove = null;
			// this.Room.onLeave.remove(this.onLeaveGridRoom);
			// this.Room.onStateChange.remove(this.onRoomStateChange);
			// this.Room.state.networkedUsers.onAdd = null;
			// this.Room.state.networkedUsers.onRemove = null;
		}
	}

	// public sendPlayerDirectionInput(velocity: Vector3, position: Vector3) {
	// 	if (!this.Room) {
	// 		return;
	// 	}

	// 	const inputMsg: PlayerInputMessage = new PlayerInputMessage(this.Room.sessionId, [velocity.x, velocity.y, velocity.z], [position.x, position.y, position.z]);

	// 	this.Room.send('playerInput', inputMsg);
	// }

	public sendPlayerPosition(positionMsg: PlayerInputMessage) {
		this.Room.send('playerInput', positionMsg);
	}

	// private playerAdded(item: PlayerState, key: string) {
	// 	//

	// 	if (this.onPlayerAdded) {
	// 		this.onPlayerAdded(item, key);
	// 	}
	// }

	private handleMessages(name: string, message: any) {
		// switch (name) {
		// 	case 'velocityChange':
		// 		this.handleVelocityChange(message);
		// }
	}

	// public handleVelocityChange(velocityChange: VelocityChangeMessage) {
	// 	if (!velocityChange || velocityChange.velocity.length < 3) {
	// 		console.error(`Handle Velocity Change - Invalid message`);
	// 		return;
	// 	}

	// 	console.log(`${velocityChange.clientId} Velocity Changed: (${velocityChange.velocity[0]}, ${velocityChange.velocity[1]}, ${velocityChange.velocity[2]})`);
	// }
}
