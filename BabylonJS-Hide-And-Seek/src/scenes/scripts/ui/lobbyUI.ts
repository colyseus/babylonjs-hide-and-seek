import { GUID, Scene } from '@babylonjs/core';
import { Control, Grid, Image, StackPanel, TextBlock } from '@babylonjs/gui';
import { UIController } from './uiController';
import NetworkManager, { NetworkEvent } from '../managers/networkManager';
import type { PlayerState } from '../../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
import GameManager from '../managers/gameManager';
import { GameState } from '../GameState';

export class LobbyUI extends UIController {
	private _playerList: StackPanel;
	private _playerEntryTemplate: Control;
	private _header: TextBlock;
	private _playerCount: TextBlock;
	private _roomCode: TextBlock;

	// Game Over UI
	private _gameOverCountdown: TextBlock;
	private _playAgainBtn: Control;
	private _leaveBtn: Control;

	// Backgrounds
	private _waitingBG: Image;
	private _startingBG: Image;
	private _seekerWinBG: Control;
	private _hidersWinBG: Image;

	private _playerEntries: Map<string, Control>;

	constructor(scene: Scene, layer: number) {
		super('Lobby', scene, layer);

		this.onPlayerAdded = this.onPlayerAdded.bind(this);
		this.onPlayerRemoved = this.onPlayerRemoved.bind(this);
		this.returnToTitle = this.returnToTitle.bind(this);
		this.updateHeader = this.updateHeader.bind(this);
		this.playAgain = this.playAgain.bind(this);
		this.onPlayerPlayAgain = this.onPlayerPlayAgain.bind(this);
		this.updateCountdown = this.updateCountdown.bind(this);

		this.initialize();
	}

	protected async initialize(): Promise<void> {
		await super.initialize();

		this._playerEntries = new Map<string, Control>();

		this.setUpControls();

		NetworkManager.Instance.addOnEvent(NetworkEvent.PLAYER_ADDED, this.onPlayerAdded);
		NetworkManager.Instance.addOnEvent(NetworkEvent.PLAYER_REMOVED, this.onPlayerRemoved);
		GameManager.Instance.addOnEvent('playerPlayAgain', this.onPlayerPlayAgain);
		GameManager.Instance.addOnEvent('updateCountdown', this.updateCountdown);
	}

	private setUpControls() {
		this._playerList = this.getControl('PlayerList') as StackPanel;
		this._playerEntryTemplate = this.getControl('PlayerEl');
		this._header = this.getControl('Header') as TextBlock;
		this._playerCount = this.getControl('PlayerCount') as TextBlock;
		this._roomCode = this.getControl('RoomCode') as TextBlock;
		this._gameOverCountdown = this.getControl('GameOverCountdown') as TextBlock;
		this._playAgainBtn = this.getControl('PlayAgainBtn');
		this._leaveBtn = this.getControl('LeaveBtn');
		this._waitingBG = this.getControl('WaitingBG') as Image;
		this._startingBG = this.getControl('StartingBG') as Image;
		this._seekerWinBG = this.getControl('SeekerWBG');
		this._hidersWinBG = this.getControl('HidersWBG') as Image;

		// this._hidersWinBG.wi

		this.updateHeader(GameManager.Instance.Countdown);
		this.updatePlayerCount();

		this.registerControlHandlers();

		// Hide the template
		this._playerEntryTemplate.isVisible = false;
	}

	private registerControlHandlers() {
		this._playAgainBtn.onPointerClickObservable.add(this.playAgain);
		this._leaveBtn.onPointerClickObservable.add(this.returnToTitle);
	}

	public setVisible(visible: boolean) {
		super.setVisible(visible);

		if (visible) {
			let countdown: number = GameManager.Instance.Countdown;

			if (!NetworkManager.Config) {
				console.trace(`*** Config is Null! ***`);
			}

			if (!countdown) {
				if (GameManager.Instance.CurrentGameState === GameState.CLOSE_COUNTDOWN || GameManager.Instance.CurrentGameState === GameState.NONE) {
					countdown = NetworkManager.Config.PreRoundCountdown / 1000;
				} else if (GameManager.Instance.CurrentGameState === GameState.GAME_OVER) {
					countdown = NetworkManager.Config.GameOverCountdown / 1000;
				}
			}

			if (!countdown) {
				console.trace(`Invalid Countdown in Game State ${GameManager.Instance.CurrentGameState}`);
			}

			this.updateBackground();
			this.updateHeader(countdown);
			this.updatePlayerCount();

			this._roomCode.text = `Room: ${NetworkManager.Instance.Room.id}`;

			this._playAgainBtn.isVisible = GameManager.Instance.CurrentGameState === GameState.GAME_OVER;
			this._gameOverCountdown.isVisible = GameManager.Instance.CurrentGameState === GameState.GAME_OVER;
			this._playerCount.isVisible = GameManager.Instance.CurrentGameState !== GameState.GAME_OVER;

			// GameManager.Instance.addOnEvent('updateCountdown', this.updateCountdown);
		} else {
			// GameManager.Instance.removeOnEvent('updateCountdown', this.updateCountdown);

			this._gameOverCountdown.isVisible = false;
		}
	}

	public clearPlayerList() {
		this._playerList.getDescendants().forEach((control: Control) => {
			this._playerList.removeControl(control);
		});

		this._playerEntries.clear();
	}

	public updateCountdown(countdown: number) {
		if (GameManager.Instance.CurrentGameState !== GameState.CLOSE_COUNTDOWN && GameManager.Instance.CurrentGameState !== GameState.GAME_OVER) {
			return;
		}

		// console.trace(`Lobby UI - Countdown: ${countdown}`);
		this._gameOverCountdown.text = `${countdown}`;

		//if (GameManager.Instance.CurrentGameState !== GameState.GAME_OVER) {
		this.updateHeader(countdown);
		//}
	}

	private updateHeader(countdown: number) {
		if (!NetworkManager.Config) {
			return;
		}

		if (GameManager.Instance.CurrentGameState !== GameState.GAME_OVER) {
			this._header.text = NetworkManager.PlayerCount < NetworkManager.Config.MinPlayers ? `Waiting for Players` : `Game Starting in ${countdown}`;
		} else {
			this._header.text = ''; // GameManager.Instance.SeekerWon() ? `Seeker Wins!` : `Hiders Win!`;
		}
	}

	private updateBackground() {
		const gameState: GameState = GameManager.Instance.CurrentGameState;

		this._waitingBG.isVisible = gameState === GameState.NONE || gameState === GameState.WAIT_FOR_MINIMUM;
		this._startingBG.isVisible = gameState === GameState.CLOSE_COUNTDOWN;
		this._seekerWinBG.isVisible = gameState === GameState.GAME_OVER && GameManager.Instance.SeekerWon();
		this._hidersWinBG.isVisible = gameState === GameState.GAME_OVER && !GameManager.Instance.SeekerWon();

		// console.log(`*** Lobby UI - updateBackground() - ${gameState} ***`
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
		this.updateHeader(GameManager.Instance.Countdown);
	}

	private onPlayerPlayAgain(player: any) {
		const sessionId: string = player.sessionId;
		const playAgain: boolean = player.value;

		const playerEntry: Control = this._playerEntries.get(sessionId);

		if (playerEntry) {
			const playAgainCheck: Control = this.getControlChild(playerEntry, 'PlayAgainCheck');
			playAgainCheck.isVisible = playAgain;
		}
	}

	private returnToTitle() {
		this.clearPlayerList();

		this.emit('returnToTitle');
	}

	private playAgain() {
		this.emit('playAgain');
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
