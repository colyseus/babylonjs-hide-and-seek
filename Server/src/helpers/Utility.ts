import { PlayerState } from '../rooms/schema/PlayerState';

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function random(min: number, max: number): number {
	return Math.floor(Math.random() * max + min);
}

export function distanceBetweenPlayers(a: PlayerState, b: PlayerState): number {
	return Math.sqrt(Math.pow(a.xPos - b.xPos, 2) + Math.pow(a.yPos - b.yPos, 2) + Math.pow(a.zPos - b.zPos, 2));
}

/** Delay for a number of milliseconds */
export function delay(delay: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
}
