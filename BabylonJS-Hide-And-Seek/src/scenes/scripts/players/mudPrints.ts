import { Mesh, Quaternion, Vector3 } from '@babylonjs/core';
import { clamp, Easing } from '../../utility';
import PlayerVisual from './playerVisual';

export class MudPrints {
	private _playerVisual: PlayerVisual;
	private _printPrefab: Mesh;
	private _enabled: boolean = false;
	private _lastPos: Vector3;
	private _foot: number = 1;
	private _livePrints: Map<number, Mesh>;
	private _pooledPrints: Mesh[];
	private _delayStop: NodeJS.Timeout;

	constructor(playerVisual: PlayerVisual, printPrefab: Mesh) {
		this._playerVisual = playerVisual;
		this._printPrefab = printPrefab;

		this._lastPos = new Vector3().copyFrom(this._playerVisual.position);

		this._pooledPrints = [];
		this._livePrints = new Map<number, Mesh>();

		this.stop = this.stop.bind(this);

		this.poolPrints();
	}

	public start(runTime: number = -1) {
		this._enabled = true;

		// Update last position
		this._lastPos.copyFrom(this._playerVisual.position);

		// If a runtime is provided clear any existing timer and create a new timer that will stop mud prints from spawning
		if (runTime > 0) {
			if (this._delayStop) {
				clearTimeout(this._delayStop);

				this._delayStop = null;
			}

			this._delayStop = setTimeout(this.stop, runTime);
		}
	}

	public stop() {
		this._enabled = false;

		if (this._delayStop) {
			clearTimeout(this._delayStop);

			this._delayStop = null;
		}
	}

	public update() {
		this.updateLivePrints();

		if (!this._enabled) {
			return;
		}

		if (Vector3.Distance(this._playerVisual.position, this._lastPos) >= 1) {
			// Place a new mud print on the ground
			this.spawnMudPrint();

			this._lastPos.copyFrom(this._playerVisual.position);
		}
	}

	private updateLivePrints() {
		if (this._livePrints.size === 0) {
			return;
		}

		const currTime: number = Date.now();

		this._livePrints.forEach((print: Mesh, startTime: number) => {
			const passedTime: number = currTime - startTime;

			// Set visibility over time
			print.visibility = 1 - Easing.easeInExpo(clamp(passedTime, 0, 1000) / 1000);

			if (passedTime >= 1000) {
				this._livePrints.delete(startTime);

				this.despawnMudPrint(print);
			}
		});
	}

	private poolPrints() {
		for (let i = 0; i < 10; i++) {
			const newPrint: Mesh = this.createPrint();
			this._pooledPrints.push(newPrint);
		}
	}

	private createPrint(): Mesh {
		// Cone a new print
		const newPrint: Mesh = this._printPrefab.clone('mud-print');

		newPrint.rotationQuaternion = new Quaternion();

		newPrint.setParent(null);
		newPrint.setEnabled(false);

		return newPrint;
	}

	private getPrint(): Mesh {
		let print: Mesh;

		if (this._pooledPrints.length > 0) {
			print = this._pooledPrints.splice(0, 1)[0];
		} else {
			print = this.createPrint();
		}

		return print;
	}

	private spawnMudPrint() {
		const print: Mesh = this.getPrint();

		// Set print position to that of the visual then set it just above the ground
		print.position.copyFrom(this._playerVisual.position);
		print.position.y = 0.1;

		// Copy the rotation of the visual
		print.rotationQuaternion.copyFrom(this._playerVisual.rotationQuaternion);

		// Rotate the print so it's facing upward
		print.rotate(Vector3.Right(), 1.570796);

		// Offset the print to alternate the foot position left/right
		print.position = print.position.add(print.right.scale(this._foot * 0.2));

		// Invert the foot value for the next print
		this._foot *= -1;

		// Ensure print starts with full visibility
		print.visibility = 1;

		print.setEnabled(true);

		// Add the print to the map of live prints to be updated
		this._livePrints.set(Date.now(), print);
	}

	private despawnMudPrint(print: Mesh) {
		print.setEnabled(false);

		print.visibility = 1;

		this._pooledPrints.push(print);
	}
}
