import { Scene } from '@babylonjs/core';
import { TextBlock } from '@babylonjs/gui';
import GameManager from '../managers/gameManager';
import NetworkManager from '../managers/networkManager';
import { UIController } from './uiController';

export class PrologueUI extends UIController {
	private _countdown: TextBlock;
	private _header: TextBlock;
	private _goal: TextBlock;

	constructor(scene: Scene, layer: number) {
		super('Prologue', scene, layer);

		this.updateCountdown = this.updateCountdown.bind(this);

		this.initialize();
	}

	protected async initialize(): Promise<void> {
		await super.initialize();

		this.setUpControls();
	}

	private setUpControls() {
		this._countdown = this.getControl('Countdown') as TextBlock;
		this._header = this.getControl('Header') as TextBlock;
		this._goal = this.getControl('Goal') as TextBlock;
	}

	public setVisible(visible: boolean) {
		super.setVisible(visible);

		if (visible) {
			this.updateTexts();

			GameManager.Instance.addOnEvent('updateCountdown', this.updateCountdown);
		} else {
			GameManager.Instance.removeOnEvent('updateCountdown', this.updateCountdown);
		}
	}

	private updateCountdown(countdown: number) {
		this._countdown.text = `${GameManager.Instance.PlayerIsSeeker() ? `Hunt` : `Evade`} in ${countdown}`;
	}

	private updateTexts() {
		this._header.text = `${GameManager.Instance.PlayerIsSeeker() ? `Seeker` : `Hider`}`;
		this._goal.text = `${GameManager.Instance.PlayerIsSeeker() ? NetworkManager.Config.SeekerGoal : NetworkManager.Config.HiderGoal}`;
	}
}
