import { Scene } from '@babylonjs/core';
import { Control, InputText, TextBlock } from '@babylonjs/gui';
import { UIController } from './uiController';

export class TitleUI extends UIController {
	private _quickPlayBtn: Control;
	private _joinBtn: Control;
	private _gameOptions: Control;
	private _joinUI: Control;
	private _joinInput: InputText;
	private _joinSubmit: Control;
	private _joinErrorText: TextBlock;
	private _cancelJoin: Control;

	constructor(scene: Scene, layer: number) {
		super('Title', scene, layer);

		this.handleQuickPlay = this.handleQuickPlay.bind(this);
		this.handleJoin = this.handleJoin.bind(this);
		this.handleJoinSubmit = this.handleJoinSubmit.bind(this);
		this.handleCancleJoin = this.handleCancleJoin.bind(this);

		this.initialize();
	}

	protected async initialize(): Promise<void> {
		await super.initialize();

		this.setUpControls();
	}

	private setUpControls() {
		this._quickPlayBtn = this.getControl('QuickPlayBtn');
		this._joinBtn = this.getControl('JoinBtn');

		this._gameOptions = this.getControl('GameOptions');
		this._joinUI = this.getControl('JoinRoom');

		this._joinInput = this.getControl('JoinInput') as InputText;
		this._joinSubmit = this.getControl('JoinSubmit');
		this._joinErrorText = this.getControl('JoinErrorText') as TextBlock;
		this._cancelJoin = this.getControl('CancelJoin');

		this._joinUI.isVisible = false;
		this._joinErrorText.text = '';

		this.registerControlHandlers();
	}

	private registerControlHandlers() {
		this._quickPlayBtn.onPointerClickObservable.add(this.handleQuickPlay);
		this._joinBtn.onPointerClickObservable.add(this.handleJoin);
		this._joinSubmit.onPointerClickObservable.add(this.handleJoinSubmit);
		this._cancelJoin.onPointerClickObservable.add(this.handleCancleJoin);
	}

	private handleQuickPlay() {
		this.emit('joinRoom');
	}

	public joinFailed(error: string) {
		this._joinErrorText.text = error;
	}

	public setJoinUIEnabled(enabled: boolean) {
		this._joinInput.isEnabled = enabled;
		this._joinSubmit.isEnabled = enabled;
		this._cancelJoin.isEnabled = enabled;
		this._quickPlayBtn.isEnabled = enabled;
		this._joinBtn.isEnabled = enabled;
	}

	private handleJoin() {
		this._joinErrorText.text = '';
		this._joinInput.text = '';

		this._joinUI.isVisible = true;
		this._gameOptions.isVisible = false;
	}

	private handleJoinSubmit() {
		this._joinErrorText.text = '';

		const roomCode: string = this._joinInput.text.trim();

		if (!roomCode || roomCode.length === 0) {
			this._joinErrorText.text = 'Invalid room code';

			return;
		}

		this.emit('joinRoom', roomCode);
	}

	private handleCancleJoin() {
		this._joinUI.isVisible = false;
		this._gameOptions.isVisible = true;
	}
}
