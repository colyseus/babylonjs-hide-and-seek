import { Schema, MapSchema, Context, type } from '@colyseus/schema';
import logger from '../../helpers/logger';
import { PlayerState } from './PlayerState';

export class HASRoomState extends Schema {
	@type({ map: PlayerState }) players = new MapSchema<PlayerState>();
	@type('number') serverTime: number = 0.0;
	@type('number') deltaTime: number = 0.0;

	public update(deltaTime: number) {
		// logger.debug(`Room State Update - DT: ${deltaTime}`);
		this.deltaTime = deltaTime;

		this.updatePlayers();
	}

	private updatePlayers() {
		this.players.forEach((player: PlayerState) => {
			player.update(this.deltaTime);
		});
	}
}
