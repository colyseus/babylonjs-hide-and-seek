import { Scene, Texture } from '@babylonjs/core';
import { AdvancedDynamicTexture, Control } from '@babylonjs/gui';
import EventEmitter = require('events');

export class UIController extends EventEmitter {
	protected _uiName: string;
	protected _scene: Scene;
	protected _uiLayer: number;
	protected _uiTex: AdvancedDynamicTexture;
	protected _root: Control;

	constructor(uiName: string, scene: Scene, layer: number) {
		super();

		this._uiName = uiName;
		this._scene = scene;
		this._uiLayer = layer;
	}

	protected async initialize() {
		this._uiTex = await this.loadGUI(this._uiName);
	}

	protected async loadGUI(guiName: string): Promise<AdvancedDynamicTexture> {
		try {
			let uiTex: AdvancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI', true, this._scene, Texture.TRILINEAR_SAMPLINGMODE, true);

			uiTex.layer.layerMask = this._uiLayer;

			await uiTex.parseFromURLAsync(`assets/gui/${guiName}.gui`);

			// Get UI root component
			this._root = uiTex.getControlByName('Root');

			return uiTex;
		} catch (error: any) {
			console.log(`Error loading ${guiName} UI: ${error.stack}`);

			return null;
		}
	}

	protected getControl(name: string): Control {
		return this._uiTex.getControlByName(name);
	}

	public setVisible(visible: boolean) {
		this._root.isVisible = visible;
	}
}
