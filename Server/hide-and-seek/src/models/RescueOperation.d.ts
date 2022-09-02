import { PlayerState } from '../rooms/schema/PlayerState';
export declare class RescueOperation {
    /** Whether or not the rescue operation is done with either the outcome a failure or success */
    get IsDone(): boolean;
    /** Whether or not the rescue operation has succeeded */
    get Success(): boolean;
    /** Combination of the Rescuer's and Hider's Ids */
    get Key(): string;
    /** The Hider that's been captured */
    get Hider(): PlayerState;
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
