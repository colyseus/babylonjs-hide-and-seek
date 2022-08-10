import { DeviceSource, DeviceSourceManager, DeviceType } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';

export default class InputManager extends Node {
	private static _instance: InputManager;

	private dsm: DeviceSourceManager = null;
	private _inputSource: DeviceSource<DeviceType.Keyboard> = null;

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

	public static getKey(key: number): boolean {
		if (!this._instance._inputSource) {
			this._instance._inputSource = this._instance.dsm.getDeviceSource(DeviceType.Keyboard);
		}

		if (!this._instance._inputSource) {
			return false;
		}

		return this._instance._inputSource.getInput(key) === 1;
	}
}
