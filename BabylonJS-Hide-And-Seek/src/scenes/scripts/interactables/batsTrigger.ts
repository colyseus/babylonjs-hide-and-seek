import { Mesh, ParticleSystem } from '@babylonjs/core';
import { fromChildren, fromParticleSystems } from '../../decorators';
import Player from '../players/player';
import InteractableTrigger from './interactableTrigger';

export default class BatsTrigger extends InteractableTrigger {
	@fromParticleSystems('bats')
	private _batsPrefab: ParticleSystem;
	@fromChildren('emitter')
	private _emitter: Mesh;

	private _bats: ParticleSystem;
	private _timeout: NodeJS.Timeout = null;

	/**
	 * Override constructor.
	 * @warn do not fill.
	 */
	// @ts-ignore ignoring the super call as we don't want to re-init
	protected constructor() {}

	/**
	 * Called on the node is being initialized.
	 * This function is called immediatly after the constructor has been called.
	 */
	public onInitialize(): void {
		// ...
	}

	/**
	 * Called on the node has been fully initialized and is ready.
	 */
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

		this._batsPrefab.stop();
		this._batsPrefab.reset();

		this._bats = this._batsPrefab.clone(`bats-${this._scene.getUniqueId()}`, this._emitter);

		this._bats.stop();
		this._bats.reset();
	}

	public registerMeshForIntersection(mesh: Mesh) {
		super.registerMeshForIntersection(mesh);
	}

	protected onPlayerEnteredTrigger(player: Player) {
		if (player.isCaptured()) {
			return;
		}

		(this._bats.emitter as Mesh).setEnabled(true);

		// Tell the particle system to play
		this._bats.start();

		// Cancel any previous timeout
		if (this._timeout) {
			clearTimeout(this._timeout);
			this._timeout = null;
		}

		this._timeout = setTimeout(() => {
			this._bats.stop();
		}, 1500);
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		// ...
	}

	/**
	 * Called on the object has been disposed.
	 * Object can be disposed manually or when the editor stops running the scene.
	 */
	public onStop(): void {
		// ...
	}

	/**
	 * Called on a message has been received and sent from a graph.
	 * @param message defines the name of the message sent from the graph.
	 * @param data defines the data sent in the message.
	 * @param sender defines the reference to the graph class that sent the message.
	 */
	public onMessage(name: string, data: any, sender: any): void {
		switch (name) {
			case 'myMessage':
				// Do something...
				break;
		}
	}
}
