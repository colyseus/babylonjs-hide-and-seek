import { distanceBetweenPlayers } from '../helpers/Utility';
import { PlayerState } from '../rooms/schema/PlayerState';

export class RescueOperation {
	public get IsValid(): boolean {
		return !this._failed && this._closeEnough && this._hider.isCaptured;
	}

	public get Success(): boolean {
		return this._success;
	}

	/** Combination of the Rescuer's and Hider's Ids */
	public get Key(): string {
		return `${this._rescuer.id}_${this._hider.id}`;
	}

	private _rescuer: PlayerState;
	private _hider: PlayerState;
	private _startTime: number;
	private _rescueTime: number;
	private _rescueDistance: number;
	private _closeEnough: boolean;
	private _failed: boolean;
	private _success: boolean;

	constructor(rescuer: PlayerState, hider: PlayerState, rescueTime: number, rescueDistance: number) {
		this._rescuer = rescuer;
		this._hider = hider;
		this._startTime = Date.now();
		this._rescueTime = rescueTime;
		this._rescueDistance = rescueDistance;
		this._closeEnough = true;
		this._failed = false;
		this._success = false;
	}

	public isPlayerInOperation(player: PlayerState): boolean {
		return player.id === this._rescuer.id || player.id === this._hider.id;
	}

	public update() {
		// The rescuer needs to remain close enough in order to rescue the hider
		this._closeEnough = distanceBetweenPlayers(this._rescuer, this._hider) <= this._rescueDistance;

		if (!this._closeEnough || this._failed) {
			this._failed = true;
			return;
		}

		if (this._closeEnough && Date.now() - this._startTime >= this._rescueTime) {
			// The rescuer has been close enough for the necessary time
			this._success = true;
			this._hider.isCaptured = false;
		}
	}
}
