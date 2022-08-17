import { Schema } from '@colyseus/schema';
import { GameConfig } from '../../models/GameConfig';
import { HASRoom } from '../HASRoom';
export declare enum GameState {
    NONE = "none",
    WAIT_FOR_MINIMUM = "waitForMinimum",
    CLOSE_COUNTDOWN = "closeCountdown",
    INITIALIZE = "initialize",
    PROLOGUE = "prologue",
    SCATTER = "scatter",
    HUNT = "hunt",
    GAME_OVER = "gameOver"
}
export declare class HASGameState extends Schema {
    currentState: GameState;
    seekerWon: boolean;
    countdown: number;
    private _room;
    private _lastState;
    private _config;
    private _stateTimestamp;
    private _capturedPlayers;
    constructor(room: HASRoom, config: GameConfig, ...args: any[]);
    /** Update the game loop */
    update(deltaTime: number): void;
    private moveToState;
    /** Waits for the minimum number of players to join the room */
    private waitForMinimum;
    private closeRoomCountdown;
    private initializeRoundOfPlay;
    private prologue;
    /** Continues where the countdown left off in the Prologue state; is the countdown for the amount of time Hiders have to move before the Seeker is released */
    private scatterCountdown;
    private hunt;
    private gameOver;
    private setCountdown;
}
