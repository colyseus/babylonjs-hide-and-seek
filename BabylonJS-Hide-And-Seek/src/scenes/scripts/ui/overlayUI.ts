import { Scene } from '@babylonjs/core';
import { UIController } from './uiController';

export class OverlayUI extends UIController {
	constructor(scene: Scene, layer: number) {
		super('Overlay', scene, layer);

		this.initialize();
	}

	protected async initialize(): Promise<void> {
		await super.initialize();

		this.setUpControls();
	}

	private setUpControls() {
		//
	}
}
