import { Scene } from '@babylonjs/core';
import { Control, TextBlock } from '@babylonjs/gui';
import { clamp } from '../../utility';
import GameManager from '../managers/gameManager';
import NetworkManager from '../managers/networkManager';
import { UIController } from './uiController';

export class PrologueUI extends UIController {
	private _countdown: TextBlock;
	private _infoRoot: Control;
	private _header: TextBlock;
	private _goal: TextBlock;

	public shouldUpdatedCountdown: boolean = true;

	constructor(scene: Scene, layer: number) {
		super('Prologue', scene, layer);

		this.updateCountdown = this.updateCountdown.bind(this);

		this.initialize();
	}

	protected async initialize(): Promise<void> {
		await super.initialize();

		GameManager.Instance.addOnEvent('updateCountdown', this.updateCountdown);

		this.setUpControls();
	}

	private setUpControls() {
		this._countdown = this.getControl('Countdown') as TextBlock;
		this._infoRoot = this.getControl('Info');
		this._header = this.getControl('Header') as TextBlock;
		this._goal = this.getControl('Goal') as TextBlock;
	}

	public setVisible(visible: boolean) {
		super.setVisible(visible);

		if (visible) {
			this.shouldUpdatedCountdown = true;

			this.showInfo(true);

			this.updateTexts();
		}
	}

	public showInfo(show: boolean) {
		this._infoRoot.isVisible = show;
	}

	public setCountdownText(text: string) {
		this._countdown.text = text;
	}

	private updateCountdown(countdown: number) {
		if (!GameManager.Instance.CurrentGameState || !this.shouldUpdatedCountdown || !NetworkManager.Ready()) {
			return;
		}

		const before: number = countdown;

		if (!GameManager.Instance.PlayerIsSeeker()) {
			countdown = clamp(countdown - NetworkManager.Config.PlayStartCountdown / 1000, 0, Number.POSITIVE_INFINITY);
		}

		this.setCountdownText(`${GameManager.Instance.PlayerIsSeeker() ? `Hunt` : `Evade`} in ${countdown}`);
	}

	private updateTexts() {
		this._header.text = `${GameManager.Instance.PlayerIsSeeker() ? `Seeker` : `Hider`}`;
		this._goal.text = `${GameManager.Instance.PlayerIsSeeker() ? NetworkManager.Config.SeekerGoal : NetworkManager.Config.HiderGoal}`;
	}
}
