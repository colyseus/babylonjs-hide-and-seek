import { PlayerState } from '../rooms/schema/PlayerState';
export declare class RescueOperation {
    get IsValid(): boolean;
    get Success(): boolean;
    /** Combination of the Rescuer's and Hider's Ids */
    get Key(): string;
    private _rescuer;
    private _hider;
    private _startTime;
    private _rescueTime;
    private _rescueDistance;
    private _closeEnough;
    private _failed;
    private _success;
    constructor(rescuer: PlayerState, hider: PlayerState, rescueTime: number, rescueDistance: number);
    isPlayerInOperation(player: PlayerState): boolean;
    update(): void;
}
