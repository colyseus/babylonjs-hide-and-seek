import { HASRoom } from './HASRoom';
export declare class HASGameLoop {
    private _room;
    constructor(room: HASRoom);
    update(deltaTime: number): void;
}
