import { Schema } from '@colyseus/schema';
import { HASRoom } from '../HASRoom';
export declare class PlayerState extends Schema {
    id: string;
    username: string;
    isSeeker: boolean;
    /** The index of the spawn point on the client */
    spawnPoint: number;
    xVel: number;
    yVel: number;
    zVel: number;
    xPos: number;
    yPos: number;
    zPos: number;
    positionTimestamp: number;
    private roomRef;
    private xDir;
    private yDir;
    private zDir;
    constructor(room: HASRoom, ...args: any[]);
    setMovementDirection(direction: number[]): void;
    update(deltaTime: number): void;
    private calculateVelocityWithDirection;
    setVelocity(velocity: number[]): void;
    setPosition(position: number[], positionTimestamp: number): void;
}
