import { ArcRotateCamera, Camera, Engine, Vector3 } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';
import { visibleInInspector } from '../../decorators';
import { delay } from '../../utility';
import { GameState } from '../GameState';
import { GameplayUI } from '../ui/GameplayUI';
import { LobbyUI } from '../ui/lobbyUI';
import { OverlayUI } from '../ui/overlayUI';
import { PrologueUI } from '../ui/prologueUI';
import { StatsUI } from '../ui/statusUI';
import { TitleUI } from '../ui/titleUI';
import GameManager from './gameManager';
import NetworkManager, { NetworkEvent } from './networkManager';

export default class UIManager extends Node {
	private _camera: Camera;

	@visibleInInspector('number', 'UI Layer', 2)
	private _uiLayer: number = 2;

	private _titleUI: TitleUI;
	private _lobbyUI: LobbyUI;
	private _prologueUI: PrologueUI;
	private _gameplayUI: GameplayUI;
	private _overlayUI: OverlayUI;
	private _statUI: StatsUI;

	private _engine: Engine;

	// Magic Numbers
	//==========================================
	private _gameOverDelay: number = 3000;
	//==========================================

	/**
	 * Override constructor.
	 * @warn do not fill.
	 */
	// @ts-ignore ignoring the super call as we don't want to re-init
	protected constructor() {}

	/**
	 * Called on the node is being initialized.
	 * This function is called immediatly after the constructor has been called.
	 */
	public onInitialize(): void {
		// ...
		this.handleJoinRoom = this.handleJoinRoom.bind(this);
		this.handleReturnToTitle = this.handleReturnToTitle.bind(this);
		this.handleGameStateChanged = this.handleGameStateChanged.bind(this);
		this.handleLeftRoom = this.handleLeftRoom.bind(this);
		this.handlePlayAgain = this.handlePlayAgain.bind(this);
		this.onWindowResize = this.onWindowResize.bind(this);

		this._engine = this.getEngine();
	}

	/**
	 * Called on the node has been fully initialized and is ready.
	 */
	public onInitialized(): void {
		// ...
		window.onresize = this.onWindowResize;
	}

	/**
	 * Called on the scene starts.
	 */
	public async onStart(): Promise<void> {
		// ...
		this.initializeUICamera();

		this.loadUI();

		GameManager.Instance.addOnEvent('gameStateChanged', this.handleGameStateChanged);
		NetworkManager.Instance.addOnEvent(NetworkEvent.LEFT_ROOM, this.handleLeftRoom);
	}

	private initializeUICamera() {
		// Create UI camera
		this._camera = new ArcRotateCamera('UICam', 0, 0.8, 100, Vector3.Zero(), this._scene);
		this._camera.layerMask = this._uiLayer;

		// Get the UI camera to work with the existing game camera
		this._scene.activeCameras = [this._scene.activeCamera, this._camera];
	}

	private loadUI() {
		this.loadTitleUI();
		this.loadLobbyUI();
		this.loadPrologueUI();
		this.loadGameplayUI();
		// Load overaly last so it will be rendered on top of everything else
		this.loadOverlayUI();

		this.loadStatsUI();
	}

	private loadTitleUI() {
		this._titleUI = new TitleUI(this._scene, this._uiLayer);

		// Subscribe to UI events
		this._titleUI.addListener('joinRoom', this.handleJoinRoom);
	}

	private async loadOverlayUI() {
		this._overlayUI = new OverlayUI(this._scene, this._uiLayer);

		while (!this._overlayUI.loaded()) {
			await delay(100);
		}

		this._overlayUI.setVisible(false);
	}

	private async loadLobbyUI() {
		this._lobbyUI = new LobbyUI(this._scene, this._uiLayer);

		this._lobbyUI.addListener('returnToTitle', this.handleReturnToTitle);
		this._lobbyUI.addListener('playAgain', this.handlePlayAgain);

		while (!this._lobbyUI.loaded()) {
			await delay(100);
		}

		this._lobbyUI.setVisible(false);
	}

	private async loadPrologueUI() {
		this._prologueUI = new PrologueUI(this._scene, this._uiLayer);

		while (!this._lobbyUI.loaded()) {
			await delay(100);
		}

		this._prologueUI.setVisible(false);
	}

	private async loadGameplayUI() {
		this._gameplayUI = new GameplayUI(this._scene, this._uiLayer);

		while (!this._gameplayUI.loaded()) {
			await delay(100);
		}

		this._gameplayUI.setVisible(false);
	}

	private loadStatsUI() {
		this._statUI = new StatsUI(this._scene, this._uiLayer);

		this._scene.registerBeforeRender(() => {
			this._statUI.setFPSValue(this._engine.getFps().toFixed());
		});
	}

	private async handleJoinRoom(roomId: string = null) {
		this._overlayUI.setVisible(true);
		this._titleUI.setJoinUIEnabled(false);

		try {
			// Attempt to join the room
			await GameManager.Instance.joinRoom(roomId);

			while (!NetworkManager.Ready()) {
				await delay(100);
			}

			console.log(`Config: %o`, NetworkManager.Config); //

			this._titleUI.setVisible(false);
			this._lobbyUI.setVisible(true);
		} catch (error: any) {
			console.error(error.stack);

			if (roomId) {
				this._titleUI.joinFailed(error.message);
			}
		}

		this._titleUI.setJoinUIEnabled(true);
		this._overlayUI.setVisible(false);

		while (!GameManager.Instance.Countdown) {
			await delay(100);
		}

		console.log(`UI Manager - Handle Join Room - update countdown: ${GameManager.Instance.Countdown}`);
		this._lobbyUI.updateCountdown(GameManager.Instance.Countdown);
	}

	private handleLeftRoom() {
		this._lobbyUI.clearPlayerList();
		this._lobbyUI.setVisible(false);
		this._gameplayUI.setVisible(false);
		this._titleUI.setVisible(true);
	}

	private handleReturnToTitle() {
		this._lobbyUI.setVisible(false);
		this._titleUI.setVisible(true);

		NetworkManager.Instance.leaveRoom();
	}

	private handlePlayAgain() {
		NetworkManager.Instance.sendPlayAgain();

		this._lobbyUI.setVisible(true);
	}

	private handleGameStateChanged(gameState: GameState) {
		switch (gameState) {
			case GameState.NONE:
				break;
			case GameState.WAIT_FOR_MINIMUM:
				if (NetworkManager.Ready()) {
					this._lobbyUI.setVisible(true);
				}
				break;
			case GameState.CLOSE_COUNTDOWN:
				if (NetworkManager.Ready()) {
					this._lobbyUI.setVisible(true);
				}
				break;
			case GameState.INITIALIZE:
				break;
			case GameState.PROLOGUE:
				this._lobbyUI.setVisible(false);
				this._prologueUI.setVisible(true);
				break;
			case GameState.SCATTER:
				if (!GameManager.Instance.PlayerIsSeeker()) {
					this._prologueUI.setVisible(true);

					this._prologueUI.shouldUpdatedCountdown = false;
					// this._prologueUI.setCountdownText('Scatter!');
				}

				this._prologueUI.showInfo(false);
				this._prologueUI.showCountdown(GameManager.Instance.PlayerIsSeeker());
				break;
			case GameState.HUNT:
				this._prologueUI.setVisible(false);
				this._gameplayUI.setVisible(true);
				break;
			case GameState.GAME_OVER:
				this._gameplayUI.setVisible(false);

				setTimeout(() => {
					this._lobbyUI.setVisible(true);
				}, this._gameOverDelay);
				break;
			default:
				break;
		}
	}

	private onWindowResize() {
		console.log(`Window Resized!`);
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		// ...
	}

	/**
	 * Called on the object has been disposed.
	 * Object can be disposed manually or when the editor stops running the scene.
	 */
	public onStop(): void {
		// ...
	}

	/**
	 * Called on a message has been received and sent from a graph.
	 * @param message defines the name of the message sent from the graph.
	 * @param data defines the data sent in the message.
	 * @param sender defines the reference to the graph class that sent the message.
	 */
	public onMessage(name: string, data: any, sender: any): void {
		switch (name) {
			case 'myMessage':
				// Do something...
				break;
		}
	}
}
