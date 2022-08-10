import { Room, Client } from 'colyseus';
import { HASRoomState } from './schema/HASRoomState';
export declare class HASRoom extends Room<HASRoomState> {
    onCreate(options: any): void;
    onJoin(client: Client, options: any): void;
    onLeave(client: Client, consented: boolean): void;
    onDispose(): void;
}
