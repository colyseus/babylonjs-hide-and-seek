import { ArcRotateCamera, Camera, EventState, Texture, Vector3 } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';
import { AdvancedDynamicTexture, Control, InputText, TextBlock } from '@babylonjs/gui';
import { fromChildren, visibleInInspector } from '../../decorators';
import { delay } from '../../utility';
import { GameState } from '../GameState';
import { LobbyUI } from '../ui/lobbyUI';
import { OverlayUI } from '../ui/overlayUI';
import { PrologueUI } from '../ui/prologueUI';
import { TestUI } from '../ui/testUI';
import { TitleUI } from '../ui/titleUI';
import GameManager from './gameManager';
import NetworkManager from './networkManager';

export default class UIManager extends Node {
	private _camera: Camera;

	@visibleInInspector('number', 'UI Layer', 2)
	private _uiLayer: number = 2;

	private _titleUI: TitleUI;
	private _lobbyUI: LobbyUI;
	private _prologueUI: PrologueUI;
	private _overlayUI: OverlayUI;

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
	}

	/**
	 * Called on the node has been fully initialized and is ready.
	 */
	public onInitialized(): void {
		// ...
	}

	/**
	 * Called on the scene starts.
	 */
	public async onStart(): Promise<void> {
		// ...
		this.initializeUICamera();

		this.loadUI();

		GameManager.Instance.addOnEvent('gameStateChanged', this.handleGameStateChanged);
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
		// Load overaly last so it will be rendered on top of everything else
		this.loadOverlayUI();
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

	private async handleJoinRoom(roomId: string = null) {
		this._overlayUI.setVisible(true);
		this._titleUI.setJoinUIEnabled(false);

		try {
			// Attempt to join the room
			await GameManager.Instance.joinRoom(roomId);

			while (!NetworkManager.Ready()) {
				await delay(100);
			}

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
	}

	private handleReturnToTitle() {
		this._lobbyUI.setVisible(false);
		this._titleUI.setVisible(true);

		NetworkManager.Instance.leaveRoom();
	}

	private handleGameStateChanged(gameState: GameState) {
		switch (gameState) {
			case GameState.NONE:
				break;
			case GameState.WAIT_FOR_MINIMUM:
				break;
			case GameState.CLOSE_COUNTDOWN:
				break;
			case GameState.INITIALIZE:
				break;
			case GameState.PROLOGUE:
				this._lobbyUI.setVisible(false);
				this._prologueUI.setVisible(true);
				break;
			case GameState.SCATTER:
				break;
			case GameState.HUNT:
				break;
			case GameState.GAME_OVER:
				break;
			default:
				break;
		}
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