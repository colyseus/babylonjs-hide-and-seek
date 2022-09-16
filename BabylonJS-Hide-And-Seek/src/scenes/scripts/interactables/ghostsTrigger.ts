import { Mesh, ParticleSystem } from '@babylonjs/core';
import { fromParticleSystems } from '../../decorators';
import Player from '../players/player';
import ParticlesTrigger from './particlesTrigger';

export default class GhostsTrigger extends ParticlesTrigger {
	@fromParticleSystems('ghosts')
	private _ghostsPrefab: ParticleSystem;

	private _ghosts: ParticleSystem;

	/**
	 * Override constructor.
	 * @warn do not fill.
	 */
	// @ts-ignore ignoring the super call as we don't want to re-init
	protected constructor() {}

	public onInitialized(): void {
		// ...
		super.onInitialized();
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...
		super.onStart();

		this._ghostsPrefab.stop();
		this._ghostsPrefab.reset();

		this._ghosts = this._ghostsPrefab.clone(`ghosts-${this._scene.getUniqueId()}`, this._emitter);

		this._ghosts.stop();
		this._ghosts.reset();
	}

	public registerMeshForIntersection(mesh: Mesh) {
		super.registerMeshForIntersection(mesh);
	}

	protected onPlayerEnteredTrigger(player: Player) {
		if (player.isCaptured()) {
			return;
		}

		(this._ghosts.emitter as Mesh).setEnabled(true);

		// Tell the particle system to play
		this._ghosts.start();

		// Cancel any previous timeout
		if (this._timeout) {
			clearTimeout(this._timeout);
			this._timeout = null;
		}

		this._timeout = setTimeout(() => {
			this._ghosts.stop();
		}, 1500);
	}

	// /**
	//  * Called each frame.
	//  */
	// public onUpdate(): void {
	// 	// ...
	// }

	// /**
	//  * Called on the object has been disposed.
	//  * Object can be disposed manually or when the editor stops running the scene.
	//  */
	// public onStop(): void {
	// 	// ...
	// }

	// /**
	//  * Called on a message has been received and sent from a graph.
	//  * @param message defines the name of the message sent from the graph.
	//  * @param data defines the data sent in the message.
	//  * @param sender defines the reference to the graph class that sent the message.
	//  */
	// public onMessage(name: string, data: any, sender: any): void {
	// 	switch (name) {
	// 		case 'myMessage':
	// 			// Do something...
	// 			break;
	// 	}
	// }
}
