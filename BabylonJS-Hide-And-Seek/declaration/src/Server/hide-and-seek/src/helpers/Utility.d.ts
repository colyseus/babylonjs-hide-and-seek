import { PlayerState } from '../rooms/schema/PlayerState';
export declare function clamp(value: number, min: number, max: number): number;
export declare function random(min: number, max: number): number;
export declare function distanceBetweenPlayers(a: PlayerState, b: PlayerState): number;
/** Delay for a number of milliseconds */
export declare function delay(delay: number): Promise<void>;
