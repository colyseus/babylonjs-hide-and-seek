import { Schema, MapSchema } from '@colyseus/schema';
import { PlayerState } from './PlayerState';
export declare class HASRoomState extends Schema {
    players: MapSchema<PlayerState, string>;
    serverTime: number;
    deltaTime: number;
    update(deltaTime: number): void;
    private updatePlayers;
}
