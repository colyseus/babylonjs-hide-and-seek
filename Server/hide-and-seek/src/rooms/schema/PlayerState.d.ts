import { Schema } from '@colyseus/schema';
import { HASRoom } from '../HASRoom';
export declare class PlayerState extends Schema {
    id: string;
    username: string;
    xVel: number;
    yVel: number;
    zVel: number;
    private roomRef;
    private xDir;
    private yDir;
    private zDir;
    constructor(room: HASRoom, ...args: any[]);
    setMovementDirection(direction: number[]): void;
    update(deltaTime: number): void;
    private calculateVelocityWithDirection;
    private setVelocity;
}
