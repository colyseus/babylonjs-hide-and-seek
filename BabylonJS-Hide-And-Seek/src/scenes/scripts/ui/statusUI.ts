import { Scene } from '@babylonjs/core';
import { TextBlock } from '@babylonjs/gui';
import { UIController } from './uiController';

export class StatsUI extends UIController {
	private _fps: TextBlock;

	constructor(scene: Scene, layer: number) {
		super('Stats', scene, layer);

		this.initialize();
	}

	protected async initialize(): Promise<void> {
		await super.initialize();

		this.setUpControls();
	}

	private setUpControls() {
		this._fps = this.getControl('FPS') as TextBlock;
	}

	public setFPSValue(value: string) {
		if (!this._fps) {
			return;
		}

		this._fps.text = `${value} FPS`;
	}
}
