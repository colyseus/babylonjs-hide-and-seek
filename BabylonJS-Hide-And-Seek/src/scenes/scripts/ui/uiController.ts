import { Scene, Texture } from '@babylonjs/core';
import { AdvancedDynamicTexture, Control, Grid } from '@babylonjs/gui';
import EventEmitter = require('events');

export class UIController extends EventEmitter {
	protected _uiName: string;
	protected _scene: Scene;
	protected _uiLayer: number;
	protected _uiTex: AdvancedDynamicTexture;
	protected _root: Control = null;

	public loaded(): boolean {
		return this._root !== null;
	}

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
			let uiTex: AdvancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI(`${this._uiName}-UI`, true, this._scene, Texture.TRILINEAR_SAMPLINGMODE, true);

			uiTex.layer.layerMask = this._uiLayer;

			let path: string = `${process.env.GUI_PATH}${guiName}.gui`;

			console.log(`Load GUI at: ${path}`); //

			await uiTex.parseFromURLAsync(path);

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

	protected cloneControl(control: Control): Control {
		let serialized: any = {};

		control.serialize(serialized);

		return Grid.Parse(serialized, null);
	}

	protected getControlChild(control: Control, childName: string): Control {
		return control.getDescendants(false, (ctrl) => ctrl.name === childName)[0];
	}

	public setVisible(visible: boolean) {
		if (!this._root) {
			console.error(`${this._uiName} UI - can't setVisible - No "Root" defined`);
			return;
		}

		this._root.isVisible = visible;
	}
}
