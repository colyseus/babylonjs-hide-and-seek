import { Room, Client } from 'colyseus.js';
import { random } from '../helpers/Utility';
import { GameState } from '../rooms/schema/HASGameState';
import { PlayerState } from '../rooms/schema/PlayerState';

export function requestJoinOptions(this: Client, i: number) {
	return { requestNumber: i };
}

export function onJoin(this: Room) {
	console.log(this.sessionId, 'joined.');

	// room.onMessage('*', (type, message) => {
	// 	// console.log(this.sessionId, "received:", type, message);
	// 	switch (type) {
	// 		case 'config':
	// 			console.log(`${room.sessionId} got config`);
	// 			break;
	// 	}
	// });

	this.state.gameState.onChange = (changes: any[]) => {
		onGameStateChange(this, changes);
	};

	this.state.players.onAdd = (player: PlayerState) => {
		if (player.id === this.sessionId) {
			// console.log(`Got PlayerState - Spawn: ${player.spawnPoint}`);
		}
	};
}

export function onLeave(this: Room) {
	console.log(this.sessionId, 'left.');
}

export function onError(this: Room, err: any) {
	console.log(this.sessionId, '!! ERROR !!', err.message);
}

export function onStateChange(this: Room, state: any) {
	// console.log(this.sessionId, "new state:", state);
}

function onGameStateChange(room: Room, changes: any[]) {
	// console.log(`Game Manager - On Game State Change: %o`, changes);

	let change: any = null;
	let stateChange: GameState = null;
	for (let i = 0; i < changes.length; i++) {
		change = changes[i];

		if (!change) {
			continue;
		}

		switch (change.field) {
			case 'currentState':
				stateChange = change.value;
				break;
			case 'countdown':
				// this.handleCountdownChange(Number(change.value));
				break;
		}
	}

	if (stateChange && stateChange === GameState.PROLOGUE) {
		const player: PlayerState = room.state.players.get(room.sessionId);

		console.log(`PROLOGUE - Spawn Index: ${player.spawnPoint}`);
		setTimeout(() => {
			room.send('playerInput', {
				direction: [0, 0, -1],
				position: [-player.spawnPoint, 0.5, -10],
				timestamp: Date.now(),
			});
		}, random(0.5, 2) * 1000);
	}
}
