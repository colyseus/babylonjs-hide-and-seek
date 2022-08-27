import { Node } from '@babylonjs/core/node';
import * as Colyseus from 'colyseus.js';
import type { HASRoomState } from '../../../../../Server/hide-and-seek/src/rooms/schema/HASRoomState';
import type { PlayerInputMessage } from '../../../../../Server/hide-and-seek/src/models/PlayerInputMessage';
import ColyseusSettings from '../colyseusSettings';
import type { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
import { GameState } from '../GameState';
import { GameConfig } from '../../../../../Server/hide-and-seek/src/models/GameConfig';
import EventEmitter = require('events');

export enum NetworkEvent {
	JOINED_ROOM = 'joinedRoom',
	LEFT_ROOM = 'leftRoom',
	PLAYER_ADDED = 'playerAdded',
	PLAYER_REMOVED = 'playerRemoved',
	GAME_STATE_CHANGED = 'gameStateChanged',
}

export default class NetworkManager extends Node {
	private static _instance: NetworkManager = null;

	private _serverSettings: ColyseusSettings = null;
	private _client: Colyseus.Client = null;
	private _room: Colyseus.Room<HASRoomState> = null;
	private _eventEmitter: EventEmitter = new EventEmitter();
	private _config: GameConfig = null;

	/**
	 * Override constructor.
	 * @warn do not fill.
	 */
	// @ts-ignore ignoring the super call as we don't want to re-init
	protected constructor() {}

	public static get Instance(): NetworkManager {
		return NetworkManager._instance;
	}

	public static get Config(): GameConfig {
		return NetworkManager.Instance._config;
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

	public static Ready(): boolean {
		return this.Instance.Room !== null && this.Config !== null;
	}

	public get Room(): Colyseus.Room<HASRoomState> {
		return this._room;
	}

	private set Room(value: Colyseus.Room<HASRoomState>) {
		this._room = value;
	}

	public static get PlayerCount(): number {
		return this.Instance.Room ? this.Instance.Room.state.players.size : 0;
	}

	public get MinimumPlayers(): number {
		return 3;
	}

	public addOnEvent(eventName: string, callback: (data?: any) => void) {
		this._eventEmitter.addListener(eventName, callback);
	}

	public removeOnEvent(eventName: string, callback: (data?: any) => void) {
		this._eventEmitter.removeListener(eventName, callback);
	}

	private broadcastEvent(eventName: string, data?: any) {
		this._eventEmitter.emit(eventName, data);
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

			this.registerRoomHandlers();

			this.broadcastEvent(NetworkEvent.JOINED_ROOM, this.Room.id);
		}
	}

	private async joinRoomWithId(roomId: string = ''): Promise<Colyseus.Room<HASRoomState>> {
		// try {
		if (roomId) {
			console.log(`Join room with id: ${roomId}`);
			return await this._client.joinById(roomId);
		} else {
			console.log(`Join or create room`);
			return await this._client.joinOrCreate('HAS_room');
		}
		// } catch (error: any) {
		// 	console.error(error.stack);
		// }
	}

	public leaveRoom() {
		if (!this.Room) {
			return;
		}

		this.Room.leave(true);
	}

	private registerRoomHandlers() {
		console.log(`Register Room Handlers`);

		if (this.Room) {
			this.Room.onLeave.once((code: number) => {
				this.unregisterRoomHandlers();
				this.Room = null;
				// this.onLeftRoom(code);
				this.broadcastEvent(NetworkEvent.LEFT_ROOM, code);
			});
			this.Room.state.players.onAdd = (player: PlayerState) => this.broadcastEvent(NetworkEvent.PLAYER_ADDED, player); // this.onPlayerAdded;
			this.Room.state.players.onRemove = (player: PlayerState) => this.broadcastEvent(NetworkEvent.PLAYER_REMOVED, player); // this.onPlayerRemoved;
			this.Room.state.gameState.onChange = (changes: any[]) => this.broadcastEvent(NetworkEvent.GAME_STATE_CHANGED, changes); // this.onGameStateChange;

			this.Room.onMessage('*', this.handleMessages);
		} else {
			console.error(`Cannot register room handlers; room is null!`);
		}
	}

	private unregisterRoomHandlers() {
		if (this.Room) {
			this.Room.state.players.onAdd = null;
			this.Room.state.players.onRemove = null;
			this.Room.state.gameState.onChange = null;

			this.Room.onMessage('*', null);
		}
	}

	// Messages to server
	//==============================================
	public sendPlayerPosition(positionMsg: PlayerInputMessage) {
		if (!this.Room) {
			return;
		}

		this.Room.send('playerInput', positionMsg);
	}

	public sendPlayAgain() {
		if (!this.Room) {
			return;
		}

		this.Room.send('playAgain');
	}

	public sendHiderFound(hiderId: string) {
		if (!this.Room || this.Room.state.gameState.currentState !== GameState.HUNT) {
			return;
		}

		this.Room.send('foundHider', hiderId);
	}
	//============================================== Messages to server

	private handleMessages(name: string, message: any) {
		switch (name) {
			case 'config':
				this._config = new GameConfig(message);
				console.log(`Got Config: %o`, this._config);
				break;
		}
	}
}
