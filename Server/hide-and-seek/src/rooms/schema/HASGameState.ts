import { Schema, MapSchema, Context, type } from '@colyseus/schema';
import logger from '../../helpers/logger';
import { clamp, random } from '../../helpers/Utility';
import { GameConfig } from '../../models/GameConfig';
import { HASRoom } from '../HASRoom';
import { PlayerState } from './PlayerState';

export enum GameState {
	NONE = 'none',
	WAIT_FOR_MINIMUM = 'waitForMinimum',
	CLOSE_COUNTDOWN = 'closeCountdown',
	INITIALIZE = 'initialize',
	PROLOGUE = 'prologue',
	SCATTER = 'scatter',
	HUNT = 'hunt',
	GAME_OVER = 'gameOver',
}

export class HASGameState extends Schema {
	@type('string') currentState: GameState = GameState.NONE;
	@type('boolean') seekerWon: boolean = false;
	@type('number') countdown: number = 0;

	private _room: HASRoom = null;
	private _lastState: GameState = GameState.NONE;
	private _config: GameConfig = null;
	private _stateTimestamp: number = 0;
	private _capturedPlayers: Map<string, PlayerState> = null;

	constructor(room: HASRoom, config: GameConfig, ...args: any[]) {
		super(args);

		this._room = room;
		this._config = config;

		this._capturedPlayers = new Map<string, PlayerState>();
	}

	private get WinCondition(): number {
		let winCondition: number = this._config.SeekerWinCondition;
		const hiderCount: number = this._room.state.players.size - 1;

		// If we don't have enough hiders to satisfy the given win condition, the hider count itself will become the win condition
		return hiderCount < winCondition ? hiderCount : winCondition;
	}

	public seekerCapturedHider(hider: PlayerState) {
		// If we're not in the right game state, return;
		if (this.currentState !== GameState.HUNT || !hider) {
			return;
		}

		logger.debug(`Game State - Seeker captured player: ${hider.id}`);

		hider.isCaptured = true;
		hider.canMove = false;

		this._capturedPlayers.set(hider.id, hider);
	}

	public capturedHiderRescued(hider: PlayerState) {
		logger.debug(`Game State - Captured Hider rescued: ${hider.id}`);

		hider.isCaptured = false;
		hider.canMove = true;

		this._capturedPlayers.delete(hider.id);
	}

	/** Update the game loop */
	public update(deltaTime: number) {
		//
		switch (this.currentState) {
			case GameState.NONE:
				this.moveToState(GameState.WAIT_FOR_MINIMUM);
				break;
			case GameState.WAIT_FOR_MINIMUM:
				this.waitForMinimum();
				break;
			case GameState.CLOSE_COUNTDOWN:
				this.closeRoomCountdown();
				break;
			case GameState.INITIALIZE:
				this.initializeRoundOfPlay();
				break;
			case GameState.PROLOGUE:
				this.prologue();
				break;
			case GameState.SCATTER:
				this.scatterCountdown();
				break;
			case GameState.HUNT:
				this.hunt();
				break;
			case GameState.GAME_OVER:
				this.gameOver();
				break;
			default:
				break;
		}
	}

	private moveToState(state: GameState) {
		this._lastState = this.currentState;

		this.currentState = state;

		logger.info(`Move state from "${this._lastState}" to "${state}"`);

		// Anything that needs doing at the beginning of the state entry do here
		switch (state) {
			case GameState.NONE:
				// Reset the timestamp
				this._stateTimestamp = 0;
				this.countdown = 0;
				this.seekerWon = false;
				this._capturedPlayers.clear();
				this._room.state.resetForPlay();

				// Unlock the room to allow more players to join (as long as the room isn't already full)
				this._room.unlock();
				break;
			case GameState.CLOSE_COUNTDOWN:
				// Reset the timestamp for the duration of the countdown to lock the room and begin a round of play
				this._stateTimestamp = Date.now();
				break;
			case GameState.INITIALIZE:
				// Reset the timestamp for the duration of the countdown to lock the room and begin a round of play
				this._stateTimestamp = Date.now();

				// Lock the room as we begin round of play initialization
				this._room.lock();

				// Randomly pick which player will be Seeker
				const players: PlayerState[] = Array.from(this._room.state.players.values());

				const index: number = random(0, players.length - 1);

				// Remove the seeker from the array; we don't need to assign a spawn point to it
				const player: PlayerState = players.splice(index, 1)[0];
				player.spawnPoint = -1;
				player.isSeeker = true;

				// Assign remaining players spawn point indices
				for (let i = 0; i < players.length; i++) {
					players[i].spawnPoint = this._room.state.getSpawnPointIndex();
					players[i].isSeeker = false;
				}

				this._capturedPlayers.clear();
				break;
			case GameState.PROLOGUE:
				// Reset the timestamp for the duration of the prologue and scatter stages
				this._stateTimestamp = Date.now();
				break;
			case GameState.SCATTER:
				// Allow all the Hiders to begin moving
				this._room.state.players.forEach((player: PlayerState) => {
					if (!player.isSeeker) {
						player.canMove = true;
					}
				});
				break;
			case GameState.HUNT:
				// Allow the Seeker to move now
				try {
					const players: PlayerState[] = Array.from(this._room.state.players.values());

					const seeker: PlayerState = players.filter((player: PlayerState) => {
						return player.isSeeker;
					})[0];

					seeker.canMove = true;
				} catch (error: any) {
					logger.error(`Error allowing Seeker to move: ${error.stack}`);
				}

				// Reset the timestamp for the duration of the hunt stage
				this._stateTimestamp = Date.now();

				break;
			case GameState.GAME_OVER:
				logger.debug(`Game Over - Seeker Won: ${this.seekerWon}`);

				// Disable player movement
				this._room.state.players.forEach((player: PlayerState) => {
					player.canMove = false;
				});

				// Reset the timestamp for the duration of the game over stage
				this._stateTimestamp = Date.now();
				break;
		}
	}

	/** Waits for the minimum number of players to join the room */
	private waitForMinimum() {
		if (this._room.state.players.size < this._config.MinPlayers) {
			return;
		}

		this.moveToState(GameState.CLOSE_COUNTDOWN);
	}

	private closeRoomCountdown() {
		let elapsedTime: number = Date.now() - this._stateTimestamp;
		const countdown: number = this._config.PreRoundCountdown;

		// If there is no longer the minimum number of player required connected go back to the waiting state
		if (this._room.state.players.size < this._config.MinPlayers) {
			this.moveToState(GameState.WAIT_FOR_MINIMUM);

			return;
		}

		// If the max number of players have joined before the countdown has expired shorten the countdown
		if (this._room.state.players.size === this._config.MaxPlayers && countdown - elapsedTime > this._config.CountdownJump) {
			this._stateTimestamp = Date.now() - (countdown - this._config.CountdownJump);
			elapsedTime = Date.now() - this._stateTimestamp;
		}

		if (elapsedTime < countdown) {
			this.setCountdown(countdown - elapsedTime, countdown);

			return;
		}

		this.countdown = 0;

		this.moveToState(GameState.INITIALIZE);
	}

	private initializeRoundOfPlay() {
		let elapsedTime: number = Date.now() - this._stateTimestamp;
		const countdown: number = this._config.InitializeCountdown;

		if (elapsedTime < countdown) {
			this.setCountdown(countdown - elapsedTime, countdown);

			return;
		}

		this.countdown = 0;

		this.moveToState(GameState.PROLOGUE);
	}

	private prologue() {
		let elapsedTime: number = Date.now() - this._stateTimestamp;
		const countdown: number = this._config.PrologueCountdown;

		if (elapsedTime < countdown - this._config.PlayStartCountdown) {
			this.setCountdown(countdown - elapsedTime, countdown);

			return;
		}

		this.moveToState(GameState.SCATTER);
	}

	/** Continues where the countdown left off in the Prologue state; is the countdown for the amount of time Hiders have to move before the Seeker is released */
	private scatterCountdown() {
		let elapsedTime: number = Date.now() - this._stateTimestamp;
		const countdown: number = this._config.PrologueCountdown;

		if (elapsedTime < countdown) {
			this.setCountdown(countdown - elapsedTime, countdown);

			return;
		}

		this.moveToState(GameState.HUNT);
	}

	private hunt() {
		let elapsedTime: number = Date.now() - this._stateTimestamp;
		const countdown: number = this._config.HuntCountdown;

		this.setCountdown(countdown - elapsedTime, countdown);

		// Determine if the Seeker has won
		this.seekerWon = this._capturedPlayers.size >= this.WinCondition;

		// Check Seeker win condition
		if (!this.seekerWon && elapsedTime < countdown) {
			return;
		}

		this.moveToState(GameState.GAME_OVER);
	}

	private gameOver() {
		let elapsedTime: number = Date.now() - this._stateTimestamp;
		const countdown: number = this._config.GameOverCountdown;

		if (elapsedTime < countdown) {
			this.setCountdown(countdown - elapsedTime, countdown);

			return;
		}

		let playAgain: number = 0;

		this._room.state.players.forEach((player: PlayerState) => {
			if (player.playAgain) {
				playAgain++;
			} else {
				// disconnect players that do not want to play again
				player.disconnect();
			}
		});

		// If any players want to play again keep the room alive and start the game state over
		if (playAgain > 0) {
			this.moveToState(GameState.NONE);
		} else {
			// No players wanted to play again so close the room
			this._room.disconnect();
		}
	}

	private setCountdown(timeMs: number, maxMs: number) {
		this.countdown = Math.ceil(clamp(timeMs, 0, maxMs) / 1000);
	}
}
