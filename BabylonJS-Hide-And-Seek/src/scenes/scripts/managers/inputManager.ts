import { DeviceSource, DeviceSourceManager, DeviceType, EventState, KeyboardEventTypes, KeyboardInfo } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';

export default class InputManager extends Node {
	private static _instance: InputManager;

	private dsm: DeviceSourceManager = null;
	private _inputSource: DeviceSource<DeviceType.Keyboard> = null;

	private _keyUp: Map<number, any> = null;

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
		InputManager._instance = this;

		this.dsm = new DeviceSourceManager(this.getScene().getEngine());

		this.handleKeyboardEvent = this.handleKeyboardEvent.bind(this);

		this._keyUp = new Map<number, boolean>();

		this.getScene().onKeyboardObservable.add(this.handleKeyboardEvent);
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		// ...
		// return;

		const frame: number = this.getScene().getFrameId();

		this._keyUp.forEach((keyInfo: any, keyCode: number) => {
			// console.log(`Key Code: ${keyCode} - Up: ${keyInfo.value}  Up Frame: ${keyInfo.frame}  Current Frame: ${frame}`);

			if (keyInfo.value && keyInfo.frame < frame) {
				keyInfo.value = false;
			}
		});
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

	private handleKeyboardEvent(eventData: KeyboardInfo, eventState: EventState) {
		// console.log(`Keyboard Event`);

		if (eventData.type === KeyboardEventTypes.KEYUP) {
			this._keyUp.set(eventData.event.keyCode, { value: true, frame: this.getScene().getFrameId() });
		}
	}

	public static getKey(key: number): boolean {
		if (!this._instance._inputSource) {
			this._instance._inputSource = this._instance.dsm.getDeviceSource(DeviceType.Keyboard);
		}

		if (!this._instance._inputSource) {
			return false;
		}

		return this._instance._inputSource.getInput(key) === 1;
	}

	public static getKeyUp(key: number): boolean {
		return this._instance._keyUp.get(key)?.value || false;
	}
}
