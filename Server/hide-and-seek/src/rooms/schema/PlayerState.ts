import { Schema, type, MapSchema, ArraySchema } from '@colyseus/schema';
import { Client } from 'colyseus';
// import logger from '../../helpers/logger';
import { clamp } from '../../helpers/Utility';
import { HASRoom } from '../HASRoom';
import { HASRoomState } from './HASRoomState';

export class PlayerState extends Schema {
	@type('string') id: string = 'ID';
	@type('string') username: string = '';
	@type('boolean') isSeeker: boolean = false;
	@type('boolean') canMove: boolean = false;
	@type('boolean') isCaptured: boolean = false;
	/** The index of the spawn point on the client */
	@type('number') spawnPoint: number = -1;
	@type('boolean') playAgain: boolean = false;
	@type('number') rescueCount: number = 0; // The number of times the player has been rescued

	// Player Position
	@type('number') xPos: number = 0.0;
	@type('number') yPos: number = 0.5;
	@type('number') zPos: number = 0.0;
	@type('number') positionTimestamp: number = 0.0;

	// Player Position
	@type('number') xDir: number = 0.0;
	@type('number') yDir: number = 0.5;
	@type('number') zDir: number = 0.0;

	private _client: Client;

	constructor(client: Client, ...args: any[]) {
		super(args);

		this._client = client;
	}

	public disconnect() {
		this._client.leave();
	}

	public resetPlayer() {
		this.playAgain = false;
		this.canMove = false;
		this.isCaptured = false;
		this.isSeeker = false;
		this.spawnPoint = -1;
		this.positionTimestamp = 0;
		this.rescueCount = 0;
	}

	public update(deltaTime: number) {
		//
	}

	public setPosition(position: number[], positionTimestamp: number) {
		this.xPos = position[0];
		this.yPos = position[1];
		this.zPos = position[2];

		this.positionTimestamp = positionTimestamp;
	}

	public setDirection(direction: number[]) {
		this.xDir = direction[0];
		this.yDir = direction[1];
		this.zDir = direction[2];
	}
}
