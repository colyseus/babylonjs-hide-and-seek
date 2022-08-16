import { clamp } from '../helpers/Utility';

export class GameConfig {
	private _data: any = null;

	constructor(rawData: any = {}) {
		this._data = rawData;
	}

	public get MinPlayers(): number {
		return this._data.minimumPlayers || 3;
	}

	public get MaxPlayers(): number {
		return this._data.maxPlayers || 8;
	}

	public get PreRoundCountdown(): number {
		return this._data.preRoundCountdown || 15000;
	}

	public get CountdownJump(): number {
		return this._data.countdownJump || 5000;
	}

	public get PrologueCountdown(): number {
		return this._data.prologueCountdown || 10000;
	}

	public get PlayStartCountdown(): number {
		return this._data.playStartCountdown || 3000;
	}

	public get HuntCountdown(): number {
		return this._data.huntCountdown || 30000;
	}

	public get SeekerWinCondition(): number {
		const maxWinCondition: number = this.MaxPlayers - 1;

		const winCondition: number = clamp(this._data.seekerWinCondition || maxWinCondition, 1, maxWinCondition);

		return winCondition;
	}

	public get GameOverCountdown(): number {
		return this._data.gameOverCountdown || 10000;
	}
}
