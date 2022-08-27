import { GUID, Scene } from '@babylonjs/core';
import { Control, Grid, StackPanel, TextBlock } from '@babylonjs/gui';
import { UIController } from './uiController';
import NetworkManager, { NetworkEvent } from '../managers/networkManager';
import type { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
import GameManager from '../managers/gameManager';

export class LobbyUI extends UIController {
	private _playerList: StackPanel;
	private _playerEntryTemplate: Control;
	private _header: TextBlock;
	private _playerCount: TextBlock;
	private _backBtn: Control;

	private _playerEntries: Map<string, Control>;

	constructor(scene: Scene, layer: number) {
		super('Lobby', scene, layer);

		this.onPlayerAdded = this.onPlayerAdded.bind(this);
		this.onPlayerRemoved = this.onPlayerRemoved.bind(this);
		this.returnToTitle = this.returnToTitle.bind(this);
		this.updateHeader = this.updateHeader.bind(this);

		this.initialize();
	}

	protected async initialize(): Promise<void> {
		await super.initialize();

		this._playerEntries = new Map<string, Control>();

		this.setUpControls();

		NetworkManager.Instance.addOnEvent(NetworkEvent.PLAYER_ADDED, this.onPlayerAdded);
		NetworkManager.Instance.addOnEvent(NetworkEvent.PLAYER_REMOVED, this.onPlayerRemoved);
	}

	private setUpControls() {
		this._playerList = this.getControl('PlayerList') as StackPanel;
		this._playerEntryTemplate = this.getControl('PlayerEl');
		this._header = this.getControl('Header') as TextBlock;
		this._playerCount = this.getControl('PlayerCount') as TextBlock;
		this._backBtn = this.getControl('BackBtn');

		this.updateHeader();
		this.updatePlayerCount();

		this._backBtn.onPointerClickObservable.add(this.returnToTitle);

		// Hide the template
		this._playerEntryTemplate.isVisible = false;
	}

	public setVisible(visible: boolean) {
		super.setVisible(visible);

		if (visible) {
			this.updateHeader();
			this.updatePlayerCount();

			GameManager.Instance.addOnEvent('updateCountdown', this.updateHeader);
		} else {
			GameManager.Instance.removeOnEvent('updateCountdown', this.updateHeader);
		}
	}

	private updateHeader(countdown: number = 0) {
		if (!NetworkManager.Config) {
			return;
		}

		this._header.text = NetworkManager.PlayerCount < NetworkManager.Config.MinPlayers ? `Waiting for Players` : `Game Starting in ${countdown}`;
	}

	private updatePlayerCount() {
		if (!NetworkManager.Config) {
			return;
		}

		this._playerCount.text = `Minimum of ${NetworkManager.Config.MinPlayers} players required (${NetworkManager.PlayerCount}/${NetworkManager.Config.MaxPlayers})`;
	}

	private onPlayerAdded(player: PlayerState) {
		this.addPlayerEntry(player.id, player.id === NetworkManager.Instance.Room.sessionId ? 'You' : player.username || player.id);
		this.updatePlayerCount();
	}

	private onPlayerRemoved(player: PlayerState) {
		const control: Control = this._playerEntries.get(player.id);

		if (control) {
			this._playerList.removeControl(control);
		}

		this._playerEntries.delete(player.id);
		this.updatePlayerCount();
		this.updateHeader();
	}

	private returnToTitle() {
		this._playerList.getDescendants().forEach((control: Control) => {
			this._playerList.removeControl(control);
		});

		this.emit('returnToTitle');
	}

	private addPlayerEntry(sessionId: string, playerName: string) {
		const playerEntry: Control = this.cloneControl(this._playerEntryTemplate);

		const playerNameText: TextBlock = this.getControlChild(playerEntry, 'PlayerName') as TextBlock;
		playerNameText.text = playerName;

		playerEntry.isVisible = true;

		this._playerList.addControl(playerEntry);

		this._playerEntries.set(sessionId, playerEntry);
	}
}
