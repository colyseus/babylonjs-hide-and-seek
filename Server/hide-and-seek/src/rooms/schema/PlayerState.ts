import { Schema, type, MapSchema, ArraySchema } from '@colyseus/schema';
import logger from '../../helpers/logger';
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

	// // Player Velocity
	// @type('number') xVel: number = 0.0;
	// @type('number') yVel: number = 0.0;
	// @type('number') zVel: number = 0.0;

	// Player Position
	@type('number') xPos: number = 0.0;
	@type('number') yPos: number = 0.5;
	@type('number') zPos: number = 0.0;
	@type('number') positionTimestamp: number = 0.0;

	// private roomRef: HASRoom = null;

	// private xDir: number = 0;
	// private yDir: number = 0;
	// private zDir: number = 0;

	constructor(/*room: HASRoom,*/ ...args: any[]) {
		super(args);

		// this.roomRef = room;
	}

	public resetPlayer() {
		this.playAgain = this.canMove = this.isCaptured = this.isSeeker = false;
		this.spawnPoint = -1;
		this.positionTimestamp = 0;
	}

	// public setMovementDirection(direction: number[]) {
	// 	this.xDir = clamp(direction[0], -1, 1);
	// 	this.yDir = clamp(direction[1], -1, 1);
	// 	this.zDir = clamp(direction[2], -1, 1);
	// }

	public update(deltaTime: number) {
		//
		// this.calculateVelocityWithDirection(deltaTime);
	}

	// private calculateVelocityWithDirection(deltaTime: number) {
	// 	let velocity: number[] = [this.xDir, this.yDir, this.zDir];

	// 	velocity[0] *= this.roomRef.movementSpeed * deltaTime;
	// 	velocity[1] *= this.roomRef.movementSpeed * deltaTime;
	// 	velocity[2] *= this.roomRef.movementSpeed * deltaTime;

	// 	// TODO: take the average of velocity readings to get a smoother velocity over time

	// 	// this.setVelocity(velocity);
	// }

	// public setVelocity(velocity: number[]) {
	// 	this.xVel = velocity[0];
	// 	this.yVel = velocity[1];
	// 	this.zVel = velocity[2];

	// 	// logger.debug(`Player State - Set Velocity: (${velocity[0]}, ${velocity[1]}, ${velocity[2]})`);
	// }

	public setPosition(position: number[], positionTimestamp: number) {
		this.xPos = position[0];
		this.yPos = position[1];
		this.zPos = position[2];

		this.positionTimestamp = positionTimestamp;
	}
}
