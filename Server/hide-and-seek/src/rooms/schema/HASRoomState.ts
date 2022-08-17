import { Schema, MapSchema, Context, type } from '@colyseus/schema';
import logger from '../../helpers/logger';
import { HASRoom } from '../HASRoom';
import { PlayerState } from './PlayerState';
import { random } from '../../helpers/Utility';
import { HASGameState } from '../schema/HASGameState';
import { GameConfig } from '../../models/GameConfig';
import gameConfig from '../../gameConfig';

export class HASRoomState extends Schema {
	@type({ map: PlayerState }) players = new MapSchema<PlayerState>();
	@type(HASGameState) gameState: HASGameState;

	private _room: HASRoom = null;
	private _availableSpawnPoints: number[] = null;
	// private _gameLoop: HASGameState = null;

	constructor(room: HASRoom, ...args: any[]) {
		super(...args);

		this._room = room;

		this.initializeSpawnPoints();

		logger.info(`Game Config: %o`, gameConfig);

		this.gameState = new HASGameState(room, new GameConfig(gameConfig));
	}

	private initializeSpawnPoints() {
		this._availableSpawnPoints = [];

		if (!Number.isFinite(this._room.maxClients)) {
			logger.error(`Room State - Invalid value received for max clients`);
			return;
		}

		// With only one seeker there should be (max clients - 1) spawn points available
		for (let i: number = 0; i < this._room.maxClients - 1; i++) {
			this._availableSpawnPoints.push(i);
		}

		// //logger.info(`Spawn Points: %o`, this._availableSpawnPoints);
	}

	/**
	 * Get a number representing the inces of the spawn point client-side
	 * @param isRandom should the spawn point be chosen randomly? Default is true
	 * @returns Number representing the index of the spawn point client-side
	 */
	public getSpawnPointIndex(isRandom: boolean = true): number {
		if (this._availableSpawnPoints.length === 0) {
			logger.error(`No more available spawn point indexes!`);
			return -1;
		}

		let index: number = 0;

		if (isRandom) {
			index = random(0, this._availableSpawnPoints.length - 1);
		}

		return this._availableSpawnPoints.splice(index, 1)[0];
	}

	public freeUpSpawnPointIndex(playerState: PlayerState) {
		const spawnPoint: number = playerState.spawnPoint;

		if (playerState.isSeeker) {
			return;
		}

		if (spawnPoint < 0 || spawnPoint > this._room.maxClients - 2) {
			logger.error(`Cannot free spawn point of ${spawnPoint}`);
			return;
		}

		// Reset the player's respawn point
		playerState.spawnPoint = -1;

		this._availableSpawnPoints.push(spawnPoint);
	}

	public update(deltaTime: number) {
		// this.updatePlayers(deltaTime);

		this.gameState.update(deltaTime);
	}

	public resetForPlay() {
		this.initializeSpawnPoints();

		this.players.forEach((player: PlayerState) => {
			player.resetPlayer();
		});
	}

	// private updatePlayers(deltaTime: number) {
	// 	this.players.forEach((player: PlayerState) => {
	// 		player.update(deltaTime);
	// 	});
	// }
}
