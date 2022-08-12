import { Room, Client, Presence } from 'colyseus';
import { VelocityChangeMessage } from '../models/VelocityChangeMessage';
import { HASRoomState } from './schema/HASRoomState';
import { PlayerState } from './schema/PlayerState';
const logger = require('../helpers/logger');

export class HASRoom extends Room<HASRoomState> {
	public movementSpeed: number = 600;

	constructor(presence?: Presence) {
		super(presence);

		this.bindHandlers();
	}

	private bindHandlers() {
		this.handlePlayerInput = this.handlePlayerInput.bind(this);
	}

	onCreate(options: any) {
		this.maxClients = 8;

		this.setState(new HASRoomState(this));

		logger.info(`*********************** HIDE AND SEEK ROOM (${this.roomId}) CREATED ***********************`);
		logger.info(`Options: %o`, options);
		logger.info('**************************************************************************');

		this.registerMessageHandlers();

		// Set the frequency patch updates are sent to clients
		this.setPatchRate(16);

		// Set the Simulation Interval callback (server-side game loop)
		this.setSimulationInterval((dt) => {
			this.state.update(dt / 1000);
		});
	}

	onJoin(client: Client, options: any) {
		logger.silly(`*** On Client Join - ${client.sessionId} ***`);

		const isSeeker: boolean = this.state.players.size === 0;

		let spawnIndex: number = isSeeker ? -1 : this.state.getSpawnPointIndex();

		logger.info(`${client.sessionId} spawn index: ${spawnIndex}`);

		// Create a new instance of NetworkedEntityState for this client and assign initial state values
		const player = new PlayerState(this).assign({
			id: client.id,
			username: options.username,
			spawnPoint: spawnIndex,
			isSeeker: isSeeker,
		});

		// Add the player to the collection;
		// This will trigger the OnAdd event of the state's "players" collection on the client
		// and the client will spawn a character object for this use.
		this.state.players.set(client.sessionId, player);
	}

	async onLeave(client: Client, consented: boolean) {
		try {
			if (consented) {
				throw new Error('consented leave!');
			}

			logger.info("let's wait for reconnection for client: " + client.sessionId);
			const newClient: Client = await this.allowReconnection(client, 3);
			logger.info('reconnected! client: ' + newClient.sessionId);

			// TODO: Replace the client in the players map on reconnect?
		} catch (e) {
			logger.info('disconnected! client: ' + client.sessionId);
			logger.silly(`*** Removing player ${client.sessionId} ***`);

			// Make the spawn point index available again
			this.state.freeUpSpawnPointIndex(this.state.players.get(client.sessionId));

			//remove user
			this.state.players.delete(client.sessionId);
		}
	}

	onDispose() {
		console.log('room', this.roomId, 'disposing...');
	}

	private registerMessageHandlers() {
		this.onMessage('playerInput', this.handlePlayerInput);
	}

	private handlePlayerInput(client: Client, directions: number[]) {
		if (directions.length < 3) {
			logger.error(`Handle Player Input - Invalid length (${directions.length}) for 'directions': %o`, directions);
			return;
		}

		const playerState: PlayerState = this.state.players.get(client.sessionId);

		if (playerState) {
			playerState.setMovementDirection(directions);
		} else {
			logger.error(`Failed to retrieve Player State for ${client.sessionId}`);
		}
	}
}
