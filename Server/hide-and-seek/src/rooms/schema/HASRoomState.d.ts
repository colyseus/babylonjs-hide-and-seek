import { Schema, MapSchema } from '@colyseus/schema';
import { HASRoom } from '../HASRoom';
import { PlayerState } from './PlayerState';
export declare class HASRoomState extends Schema {
    players: MapSchema<PlayerState, string>;
    serverTime: number;
    deltaTime: number;
    private _room;
    private _availableSpawnPoints;
    constructor(room: HASRoom, ...args: any[]);
    private initializeSpawnPoints;
    getSpawnPointIndex(isRandom?: boolean): number;
    freeUpSpawnPointIndex(playerState: PlayerState): void;
    update(deltaTime: number): void;
    private updatePlayers;
}
