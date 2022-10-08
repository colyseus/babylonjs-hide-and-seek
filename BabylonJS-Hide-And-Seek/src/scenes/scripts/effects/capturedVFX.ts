import { Mesh, Vector3, ParticleSystem } from '@babylonjs/core';
import { MeshButton3D } from '@babylonjs/gui';
import { fromChildren, fromParticleSystems, visibleInInspector } from '../../decorators';
import { clamp, delay, Easing, lerpNumber } from '../../utility';
import GameManager from '../managers/gameManager';
import InputManager from '../managers/inputManager';

export default class CapturedVFX extends Mesh {
	@fromChildren('pumpkin')
	private _center: Mesh;
	@fromChildren('inner-chains')
	private _innerChains: Mesh;
	@fromChildren('outer-chains')
	private _outerChains: Mesh;
	@fromChildren('halo')
	private _halo: Mesh;

	@fromParticleSystems('captured')
	private _particlesPrefab: ParticleSystem;
	@fromChildren('emitter')
	private _emitter: Mesh;

	private _play: boolean = false;

	private _particles: ParticleSystem;

	private _maxChainSpeed: number = 5;

	private _minChainSpeed: number = 1;

	private _chainSpinSpeed: number = 1;

	private _chainLerpTime: number = 2000;
	private _haloPunchTime: number = 1500;
	private _chainFadeTime: number = 1000;
	private _rescuePunchTime: number = 1000;

	private debugPlay: boolean = true;
	private debugRescue: boolean = true;
	private debugStop: boolean = true;

	private _playingCaptured: boolean = false;
	private _playerRescued: boolean = false;

	private _meshes: Mesh[];

	public playingFX(): boolean {
		return this._playingCaptured || this._playerRescued;
	}

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
		// this.onEnabledStateChange = this.onEnabledStateChange.bind(this);
	}

	/**
	 * Called on the node has been fully initialized and is ready.
	 */
	public onInitialized(): void {
		// ...
		this._meshes = [];
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// this.onEnabledStateChangedObservable.add(this.onEnabledStateChange);

		this._meshes = this.getChildMeshes() as Mesh[];

		this._emitter.isPickable = false;

		this._particlesPrefab.stop();
		this._particlesPrefab.reset();

		this._particles = this._particlesPrefab.clone(`captured-${this._scene.getUniqueId()}`, this._emitter);

		this._particles.stop();
		this._particles.reset();

		this.stop();
	}

	// private onEnabledStateChange(enabled: boolean) {
	// 	if (enabled) {
	// 		this.playCaptured();
	// 	} else {
	// 		this.stop();
	// 	}
	// }

	private fixMeshes() {
		for (let i = 0; i < this._meshes.length; i++) {
			this._meshes[i].setEnabled(true);
			this._meshes[i].isVisible = true;
		}

		this._emitter.isVisible = false;
	}

	public async playCaptured() {
		if (this.playingFX()) {
			console.warn(`Can't player captured FX - already playing`);
			return;
		}

		console.log(`Play Captured FX`);
		this.fixMeshes();

		this.setEnabled(true);

		this._play = true;
		this._playingCaptured = true;

		this.punchHaloScaleIn(this._haloPunchTime);

		await delay(this._haloPunchTime * 0.6);

		this.lerpChainSpeed(this._chainLerpTime);

		this.fadeChainsIn(this._chainFadeTime);

		setTimeout(() => {
			this._playingCaptured = false;
		}, this._chainLerpTime + 200);

		// Run partciles briefly
		//===========================
		this._particles.start();

		await delay(200);

		this._particles.stop();
		//===========================
	}

	public async playRescued() {
		if (this.playingFX()) {
			return;
		}

		console.log(`Play Rescure FX`);
		this.fixMeshes();

		this._playerRescued = true;

		this.punchFXOut(this._rescuePunchTime);

		await delay(this._rescuePunchTime / 2);

		setTimeout(() => {
			this._playerRescued = false;
		}, this._rescuePunchTime + 200);

		// Run partciles briefly
		//===========================
		this._particles.start();

		await delay(200);

		this._particles.stop();
		//===========================
		this.stop();
	}

	public stop() {
		this.resetFX();
		this._particles.stop();

		this._play = false;
	}

	private resetFX() {
		this.setScale(new Vector3(1, 1, 1));
		this.setHaloScale(Vector3.Zero());
		this.setChainVisibility(0);
	}

	private async punchHaloScaleIn(time: number) {
		let startTime: number = Date.now();
		let zero: Vector3 = Vector3.Zero();
		let one: Vector3 = new Vector3(1, 1, 1);

		let elapsed: number = 0;

		while (true) {
			await delay(GameManager.DeltaTime);

			elapsed = clamp(Date.now() - startTime, 0, time);

			this.setHaloScale(Vector3.Lerp(zero, one, Easing.easeOutBounce(elapsed / time)));

			if (elapsed >= time) {
				break;
			}
		}
	}

	private async lerpChainSpeed(time: number): Promise<void> {
		let startTime: number = Date.now();
		let elapsed: number = 0;
		this._chainSpinSpeed = this._maxChainSpeed;

		while (this._chainSpinSpeed !== this._minChainSpeed) {
			await delay(GameManager.DeltaTime);

			elapsed = clamp(Date.now() - startTime, 0, time);

			this._chainSpinSpeed = lerpNumber(this._maxChainSpeed, this._minChainSpeed, Easing.easeInCirc(elapsed / time));

			if (elapsed >= time) {
				break;
			}
		}
	}

	private async fadeChainsIn(time: number) {
		let startTime: number = Date.now();

		let elapsed: number = 0;

		while (true) {
			await delay(GameManager.DeltaTime);

			elapsed = clamp(Date.now() - startTime, 0, time);

			this.setChainVisibility(lerpNumber(0, 1, Easing.easeOutBounce(elapsed / time)));

			if (elapsed >= time) {
				break;
			}
		}
	}

	private async punchFXOut(time: number) {
		let startTime: number = Date.now();
		let zero: Vector3 = Vector3.Zero();
		let one: Vector3 = new Vector3(1, 1, 1);

		let elapsed: number = 0;

		while (true) {
			await delay(GameManager.DeltaTime);

			elapsed = clamp(Date.now() - startTime, 0, time);

			this.setScale(Vector3.Lerp(one, zero, Easing.easeOutBounce(elapsed / time)));

			if (elapsed >= time) {
				break;
			}
		}
	}

	private setHaloScale(scale: Vector3) {
		this._halo.scaling = scale;
	}

	private setScale(scale: Vector3) {
		this.scaling = scale;
	}

	private setChainVisibility(vis: number) {
		this._center.visibility = this._innerChains.visibility = this._outerChains.visibility = vis;
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		if (InputManager.getKey(13) && this.debugPlay) {
			this.debugPlay = false;
			this.stop();
			this.playCaptured();

			setTimeout(() => {
				this.debugPlay = true;
			}, 2000);
		}
		if (InputManager.getKey(8) && this.debugRescue) {
			this.debugRescue = false;

			this.playRescued();

			setTimeout(() => {
				this.debugRescue = true;
			}, 2000);
		}
		if (InputManager.getKey(32) && this.debugStop) {
			this.debugStop = false;
			this.stop();

			setTimeout(() => {
				this.debugStop = true;
			}, 1000);
		}

		if (!this._play) {
			return;
		}

		this._innerChains.rotate(Vector3.Forward(), this._chainSpinSpeed * GameManager.DeltaTime);
		this._outerChains.rotate(Vector3.Forward(), -this._chainSpinSpeed * GameManager.DeltaTime);
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
