import Arena from '@colyseus/arena';
import { monitor } from '@colyseus/monitor';
import { WebSocketTransport } from '@colyseus/ws-transport';

/**
 * Import your Room files
 */
import { HASRoom } from './rooms/HASRoom';

export default Arena({
	getId: () => 'Your Colyseus App',
	initializeTransport: function () {
		return new WebSocketTransport({
			/* ...options */
		});
	},
	initializeGameServer: (gameServer) => {
		/**
		 * Define your room handlers:
		 */
		gameServer.define('HAS_room', HASRoom);
	},

	initializeExpress: (app) => {
		/**
		 * Bind your custom express routes here:
		 */
		app.get('/', (req, res) => {
			res.send("It's time to kick ass and chew bubblegum!");
		});

		/**
		 * Bind @colyseus/monitor
		 * It is recommended to protect this route with a password.
		 * Read more: https://docs.colyseus.io/tools/monitor/
		 */
		app.use('/colyseus', monitor());
	},

	beforeListen: () => {
		/**
		 * Before before gameServer.listen() is called.
		 */
	},
});
