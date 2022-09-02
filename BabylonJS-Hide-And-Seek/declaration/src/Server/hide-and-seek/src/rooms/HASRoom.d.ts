import { Room, Client, Presence } from 'colyseus';
import { HASRoomState } from './schema/HASRoomState';
export declare class HASRoom extends Room<HASRoomState> {
    movementSpeed: number;
    private _config;
    constructor(presence?: Presence);
    private bindHandlers;
    onCreate(options: any): void;
    onJoin(client: Client, options: any): void;
    onLeave(client: Client, consented: boolean): Promise<void>;
    onDispose(): void;
    private registerMessageHandlers;
    private handlePlayerInput;
    private handlePlayAgain;
    private handleHiderFound;
    private handleRescueHider;
}
