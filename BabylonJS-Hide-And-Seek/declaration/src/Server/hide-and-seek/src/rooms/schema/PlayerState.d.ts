import { Schema } from '@colyseus/schema';
import { Client } from 'colyseus';
export declare class PlayerState extends Schema {
    id: string;
    username: string;
    isSeeker: boolean;
    canMove: boolean;
    isCaptured: boolean;
    /** The index of the spawn point on the client */
    spawnPoint: number;
    playAgain: boolean;
    rescueCount: number;
    xPos: number;
    yPos: number;
    zPos: number;
    positionTimestamp: number;
    xDir: number;
    yDir: number;
    zDir: number;
    private _client;
    constructor(client: Client, ...args: any[]);
    disconnect(): void;
    resetPlayer(): void;
    update(deltaTime: number): void;
    setPosition(position: number[], positionTimestamp: number): void;
    setDirection(direction: number[]): void;
}
