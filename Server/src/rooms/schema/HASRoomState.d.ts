import { Schema, MapSchema } from '@colyseus/schema';
import { HASRoom } from '../HASRoom';
import { PlayerState } from './PlayerState';
import { HASGameState } from '../schema/HASGameState';
export declare class HASRoomState extends Schema {
    players: MapSchema<PlayerState, string>;
    gameState: HASGameState;
    private _room;
    private _availableSpawnPoints;
    private _config;
    private _rescueOperations;
    constructor(room: HASRoom, ...args: any[]);
    private initializeSpawnPoints;
    private playerRemoved;
    /**
     * Get a number representing the index of the spawn point client-side
     * @param isRandom should the spawn point be chosen randomly? Default is true
     * @returns Number representing the index of the spawn point client-side
     */
    getSpawnPointIndex(isRandom?: boolean): number;
    freeUpSpawnPointIndex(playerState: PlayerState): void;
    seekerLeft(): void;
    update(deltaTime: number): void;
    resetForPlay(): void;
    seekerFoundHider(seekerId: string, hiderId: string): void;
    rescueHider(rescuerId: string, hiderId: string): void;
    /** Updates all valid rescue operations that have not failed or are not yet successful */
    private updateRescueOperations;
}
