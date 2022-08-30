import { Scene } from '@babylonjs/core';
import { TextBlock } from '@babylonjs/gui';
import GameManager from '../managers/gameManager';
import { UIController } from './uiController';

export class GameplayUI extends UIController {
	private _countdown: TextBlock;

	constructor(scene: Scene, layer: number) {
		super('Gameplay', scene, layer);

		this.initialize();
	}

	protected async initialize(): Promise<void> {
		await super.initialize();

		this.updateCountdown = this.updateCountdown.bind(this);

		this.setUpControls();
	}

	private setUpControls() {
		this._countdown = this.getControl('Countdown') as TextBlock;
	}

	public setVisible(visible: boolean) {
		super.setVisible(visible);

		if (visible) {
			GameManager.Instance.addOnEvent('updateCountdown', this.updateCountdown);
		} else {
			GameManager.Instance.removeOnEvent('updateCountdown', this.updateCountdown);
		}
	}

	private updateCountdown(countdown: number) {
		this._countdown.text = `${countdown}`;
	}
}
