import { Schema, MapSchema } from '@colyseus/schema';
import { HASRoom } from '../HASRoom';
import { PlayerState } from './PlayerState';
export declare class HASRoomState extends Schema {
    players: MapSchema<PlayerState, string>;
    countdown: number;
    seekerWon: boolean;
    private _room;
    private _availableSpawnPoints;
    private _gameLoop;
    constructor(room: HASRoom, ...args: any[]);
    private initializeSpawnPoints;
    /**
     * Get a number representing the inces of the spawn point client-side
     * @param isRandom should the spawn point be chosen randomly? Default is true
     * @returns Number representing the index of the spawn point client-side
     */
    getSpawnPointIndex(isRandom?: boolean): number;
    freeUpSpawnPointIndex(playerState: PlayerState): void;
    update(deltaTime: number): void;
    resetForPlay(): void;
}
