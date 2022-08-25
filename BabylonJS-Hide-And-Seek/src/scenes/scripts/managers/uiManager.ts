import { ArcRotateCamera, Camera, EventState, Texture, Vector3 } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';
import { AdvancedDynamicTexture, Control, InputText, TextBlock } from '@babylonjs/gui';
import { fromChildren, visibleInInspector } from '../../decorators';
import { TestUI } from '../ui/testUI';
import { TitleUI } from '../ui/titleUI';
import GameManager from './gameManager';

export default class UIManager extends Node {
	private _camera: Camera;

	@visibleInInspector('number', 'UI Layer', 2)
	private _uiLayer: number = 2;

	private _titleUI: TitleUI;

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
	}

	private initializeUICamera() {
		// Create UI camera
		this._camera = new ArcRotateCamera('UICam', 0, 0.8, 100, Vector3.Zero(), this._scene);
		this._camera.layerMask = this._uiLayer;

		// Get the UI camera to work with the existing game camera
		this._scene.activeCameras = [this._scene.activeCamera, this._camera];
	}

	private loadUI() {
		// this.loadTestGUI();
		this.loadTitleUI();
	}

	private async loadTestUI() {
		let testGUI: TestUI = new TestUI(this._scene, this._uiLayer);
	}

	private async loadTitleUI() {
		this._titleUI = new TitleUI(this._scene, this._uiLayer);

		// Subscribe to UI events
		this._titleUI.addListener('joinRoom', this.handleJoinRoom);
	}

	private async handleJoinRoom(roomId: string = null) {
		// TODO: show a "joining..." overlay

		try {
			// Attempt to join the room
			await GameManager.Instance.joinRoom(roomId);
		} catch (error: any) {
			console.error(error.stack);

			if (roomId) {
				this._titleUI.joinFailed(error.message);
			}
		}

		// TODO: Hide the "joining..." overlay
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
