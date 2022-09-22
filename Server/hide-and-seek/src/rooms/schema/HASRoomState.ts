import { Schema, MapSchema, Context, type } from '@colyseus/schema';
import logger from '../../helpers/logger';
import { HASRoom } from '../HASRoom';
import { PlayerState } from './PlayerState';
import { distanceBetweenPlayers, random } from '../../helpers/Utility';
import { HASGameState } from '../schema/HASGameState';
import { GameConfig } from '../../models/GameConfig';
import { RescueOperation } from '../../models/RescueOperation';

export class HASRoomState extends Schema {
	@type({ map: PlayerState }) players = new MapSchema<PlayerState>();
	@type(HASGameState) gameState: HASGameState;

	private _room: HASRoom = null;
	private _availableSpawnPoints: number[] = null;
	private _config: GameConfig;

	private _rescueOperations: Map<string, RescueOperation>;

	constructor(room: HASRoom, ...args: any[]) {
		super(...args);

		this._room = room;

		this.initializeSpawnPoints();

		this._config = args[0];

		this.gameState = new HASGameState(room, this._config);
		this._rescueOperations = new Map<string, RescueOperation>();

		this.playerRemoved = this.playerRemoved.bind(this);

		this.players.onRemove = this.playerRemoved;
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

	private playerRemoved(player: PlayerState, sessionId: string) {
		// Check if the player was involved with any rescue operations
		this._rescueOperations.forEach((op: RescueOperation) => {
			// Remove any rescue operation the player was involved with
			if (op.isPlayerInOperation(player)) {
				this._rescueOperations.delete(op.Key);
			}
		});
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
			return;
		}

		// Reset the player's respawn point
		playerState.spawnPoint = -1;

		this._availableSpawnPoints.push(spawnPoint);
	}

	public update(deltaTime: number) {
		this.gameState.update(deltaTime);
		this.updateRescueOperations();
	}

	public resetForPlay() {
		this.initializeSpawnPoints();

		this.players.forEach((player: PlayerState) => {
			player.resetPlayer();
		});
	}

	public seekerFoundHider(seekerId: string, hiderId: string) {
		const seeker: PlayerState = this.players.get(seekerId);
		const hider: PlayerState = this.players.get(hiderId);

		if (!seeker || !hider) {
			logger.error(`Failed to get ${seeker ? '' : `Seeker ${seekerId} `}${hider ? '' : `Hider ${hiderId}`}`);
			return;
		}

		// Check if the Hider is close enough to the Seeker to be found
		const distance: number = distanceBetweenPlayers(seeker, hider);

		if (distance <= this._config.SeekerCheckDistance) {
			this.gameState.seekerCapturedHider(hider);
		}
	}

	public rescueHider(rescuerId: string, hiderId: string) {
		try {
			const rescuer: PlayerState = this.players.get(rescuerId);
			const hider: PlayerState = this.players.get(hiderId);

			if (!rescuer || !hider) {
				logger.error(`Failed to get ${rescuer ? '' : `Rescuer ${rescuerId} `}${hider ? '' : `Hider ${hiderId}`}`);
				return;
			}

			let rescueAlreadyInProgress: boolean = false;

			// Check if a rescue operation is already underway by another player; if so don't start another one
			this._rescueOperations.forEach((op: RescueOperation) => {
				// If the hider is in this operation but not the rescuer then this is a rescue operation that's already in progress
				// and we don't need to start a new one with this rescuer.
				// Now if the same rescuer already has a rescue op in progress for this hider then we'll just replace the old one with
				// a new one in the event the rescuer had left the rescue distance and returned.
				if (op.isPlayerInOperation(hider) && !op.isPlayerInOperation(rescuer)) {
					rescueAlreadyInProgress = true;
				}
			});

			if (rescueAlreadyInProgress) {
				return;
			}

			const op: RescueOperation = new RescueOperation(rescuer, hider, this._config.RescueTime, this._config.RescueDistance);

			this._rescueOperations.set(op.Key, op);
		} catch (error: any) {
			logger.error(error.stack);
		}
	}

	/** Updates all valid rescue operations that have not failed or are not yet successful */
	private updateRescueOperations() {
		this._rescueOperations.forEach((op: RescueOperation) => {
			op.update();

			if (op.Success) {
				// the rescue effort was successful
				this.gameState.capturedHiderRescued(op.Hider);
			}

			if (!op.IsDone) {
				// The rescue operation is now done, either it succeeded or failed
				this._rescueOperations.delete(op.Key);
			}
		});
	}
}
