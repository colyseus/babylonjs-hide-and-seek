import { Schema } from '@colyseus/schema';
export declare class PlayerState extends Schema {
    id: string;
    username: string;
    isSeeker: boolean;
    canMove: boolean;
    isCaptured: boolean;
    /** The index of the spawn point on the client */
    spawnPoint: number;
    playAgain: boolean;
    xPos: number;
    yPos: number;
    zPos: number;
    positionTimestamp: number;
    constructor(/*room: HASRoom,*/ ...args: any[]);
    resetPlayer(): void;
    update(deltaTime: number): void;
    setPosition(position: number[], positionTimestamp: number): void;
}
