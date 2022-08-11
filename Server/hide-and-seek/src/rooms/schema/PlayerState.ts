import { Schema, type, MapSchema, ArraySchema } from '@colyseus/schema';
import logger from '../../helpers/logger';
import { clamp } from '../../helpers/Utility';
import { HASRoom } from '../HASRoom';
import { HASRoomState } from './HASRoomState';

export class PlayerState extends Schema {
	@type('string') id: string = 'ID';
	// //Position
	// @type('number') xPos: number = 0.0;
	// @type('number') yPos: number = 0.0;
	// @type('number') zPos: number = 0.0;

	// //Interpolation values
	// @type('number') timestamp: number = 0.0;

	@type('string') username: string = '';

	@type('number') xVel: number = 0.0;
	@type('number') yVel: number = 0.0;
	@type('number') zVel: number = 0.0;

	private roomRef: HASRoom = null;

	private xDir: number = 0;
	private yDir: number = 0;
	private zDir: number = 0;

	constructor(room: HASRoom, ...args: any[]) {
		super(args);

		this.roomRef = room;
	}

	public setMovementDirection(direction: number[]) {
		this.xDir = clamp(direction[0], -1, 1);
		this.yDir = clamp(direction[1], -1, 1);
		this.zDir = clamp(direction[2], -1, 1);
	}

	public update(deltaTime: number) {
		//
		this.calculateVelocityWithDirection(deltaTime);
	}

	private calculateVelocityWithDirection(deltaTime: number) {
		let velocity: number[] = [this.xDir, this.yDir, this.zDir];

		velocity[0] *= this.roomRef.movementSpeed * deltaTime;
		velocity[1] *= this.roomRef.movementSpeed * deltaTime;
		velocity[2] *= this.roomRef.movementSpeed * deltaTime;

		// TODO: take the average of velocity readings to get a smoother velocity over time

		this.setVelocity(velocity);
	}

	private setVelocity(velocity: number[]) {
		this.xVel = velocity[0];
		this.yVel = velocity[1];
		this.zVel = velocity[2];

		// logger.debug(`Player State - Set Velocity: (${velocity[0]}, ${velocity[1]}, ${velocity[2]})`);
	}
}
