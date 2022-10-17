import { Room, Client, Presence } from 'colyseus';
import { PlayerInputMessage } from '../models/PlayerInputMessage';
import { HASRoomState } from './schema/HASRoomState';
import { PlayerState } from './schema/PlayerState';
import gameConfig from '../gameConfig';
import { GameConfig } from '../models/GameConfig';

export class HASRoom extends Room<HASRoomState> {
	private _config: GameConfig;

	constructor(presence?: Presence) {
		super(presence);
		this._config = new GameConfig(gameConfig);

		this.bindHandlers();
	}

	private bindHandlers() {
		this.handlePlayerInput = this.handlePlayerInput.bind(this);
		this.handlePlayAgain = this.handlePlayAgain.bind(this);
		this.handleHiderFound = this.handleHiderFound.bind(this);
		this.handleRescueHider = this.handleRescueHider.bind(this);
	}

	onCreate(options: any) {
		this.maxClients = this._config.MaxPlayers;

		this.setState(new HASRoomState(this, this._config));

		console.info(`*********************** HIDE AND SEEK ROOM (${this.roomId}) CREATED ***********************`);
		console.info(`Options: %o`, options);
		console.info('**************************************************************************');

		this.registerMessageHandlers();

		// Set the frequency patch updates are sent to clients
		this.setPatchRate(16);

		// Set the Simulation Interval callback (server-side game loop)
		this.setSimulationInterval((dt) => {
			this.state.update(dt / 1000);
		});
	}

	onJoin(client: Client, options: any) {
		console.debug(`*** On Client Join - ${client.sessionId} ***`);

		//console.info(`${client.sessionId} spawn index: ${spawnIndex}`);

		// Create a new instance of NetworkedEntityState for this client and assign initial state values
		const player = new PlayerState(client).assign({
			id: client.sessionId,
			username: options.username,
		});

		// Add the player to the collection;
		// This will trigger the OnAdd event of the state's "players" collection on the client
		// and the client will spawn a character object for this use.
		this.state.players.set(client.sessionId, player);

		// Send game config to the client that just connected
		client.send('config', gameConfig);
	}

	async onLeave(client: Client, consented: boolean) {
		try {
			if (consented) {
				throw new Error('consented leave!');
			}

			throw new Error('DEBUG force no reconnection check');

			console.info("let's wait for reconnection for client: " + client.sessionId);
			const newClient: Client = await this.allowReconnection(client, 3);
			console.info('reconnected! client: ' + newClient.sessionId);
		} catch (e) {
			console.info('disconnected! client: ' + client.sessionId);
			console.debug(`*** Removing player ${client.sessionId} ***`);

			const playerState: PlayerState = this.state.players.get(client.sessionId);

			// If the Seeker left the game then end the round
			if (playerState && playerState.isSeeker) {
				this.state.seekerLeft();
			}

			// Make the spawn point index available again
			this.state.freeUpSpawnPointIndex(playerState);

			//remove user
			this.state.players.delete(client.sessionId);
		}
	}

	onDispose() {
		console.log('room', this.roomId, 'disposing...');
	}

	private registerMessageHandlers() {
		this.onMessage('playerInput', this.handlePlayerInput);
		this.onMessage('playAgain', this.handlePlayAgain);
		this.onMessage('foundHider', this.handleHiderFound);
		this.onMessage('rescueHider', this.handleRescueHider);
	}

	private handlePlayerInput(client: Client, playerInput: PlayerInputMessage) {
		const playerState: PlayerState = this.state.players.get(client.sessionId);

		if (playerState) {
			playerState.setPosition(playerInput.position, playerInput.timestamp);
			playerState.setDirection(playerInput.direction);
		} else {
			console.error(`Failed to retrieve Player State for ${client.sessionId}`);
		}
	}

	private handlePlayAgain(client: Client) {
		const playerState: PlayerState = this.state.players.get(client.sessionId);

		if (playerState) {
			playerState.playAgain = true;
		}
	}

	private handleHiderFound(client: Client, hiderId: string) {
		// Only accept msg from client if they are the Seeker
		const player: PlayerState = this.state.players.get(client.sessionId);

		if (!player || !player.isSeeker) {
			return;
		}

		this.state.seekerFoundHider(client.sessionId, hiderId);
	}

	private handleRescueHider(client: Client, hiderId: string) {
		// Only accept msg from client if they are not the Seeker
		const player: PlayerState = this.state.players.get(client.sessionId);

		if (!player || player.isSeeker) {
			return;
		}

		this.state.rescueHider(client.sessionId, hiderId);
	}
}
