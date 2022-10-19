import { Scene } from '@babylonjs/core';
import { Control, Image, TextBlock } from '@babylonjs/gui';
import { clamp } from '../../utility';
import { GameState } from '../GameState';
import GameManager from '../managers/gameManager';
import NetworkManager from '../managers/networkManager';
import { UIController } from './uiController';

export class PrologueUI extends UIController {
	private _countdown: TextBlock;
	private _infoRoot: Control;
	private _header: TextBlock;
	private _goal: TextBlock;

	private _scatter: Image;

	//Backgrounds
	private _hiderBG: Image;
	private _seekerBG: Image;

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
		this._hiderBG = this.getControl('HiderBG') as Image;
		this._seekerBG = this.getControl('SeekerBG') as Image;
		this._scatter = this.getControl('Scatter') as Image;
	}

	public setVisible(visible: boolean) {
		super.setVisible(visible);

		if (visible) {
			this.shouldUpdatedCountdown = true;

			this.showInfo(true);
			this.showCountdown(true);

			this.updateTexts();

			this.updateBackground();

			this._scatter.isVisible = !GameManager.Instance.PlayerIsSeeker() && GameManager.Instance.CurrentGameState === GameState.SCATTER;
		}
	}

	public showInfo(show: boolean) {
		this._infoRoot.isVisible = show;
	}

	public showCountdown(show: boolean) {
		this._countdown.isVisible = show;
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
			countdown = clamp(countdown - NetworkManager.Config.ScatterCountdown / 1000, 0, Number.POSITIVE_INFINITY);
		}

		this.setCountdownText(`${GameManager.Instance.PlayerIsSeeker() ? `Hunt` : `Evade`} in ${countdown}`);
	}

	private updateTexts() {
		this._header.text = `${GameManager.Instance.PlayerIsSeeker() ? `Seeker` : `Hider`}`;
		this._goal.text = `${GameManager.Instance.PlayerIsSeeker() ? NetworkManager.Config.SeekerGoal : NetworkManager.Config.HiderGoal}`;
	}

	private updateBackground() {
		this._hiderBG.isVisible = !GameManager.Instance.PlayerIsSeeker();
		this._seekerBG.isVisible = GameManager.Instance.PlayerIsSeeker();
	}
}
