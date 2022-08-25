import { EventState, Scene } from '@babylonjs/core';
import { Control, InputText, TextBlock } from '@babylonjs/gui';
import { UIController } from './uiController';

export class TestUI extends UIController {
	constructor(scene: Scene, layer: number) {
		super('TestGUI', scene, layer);

		this.initialize();
	}

	protected async initialize(): Promise<void> {
		await super.initialize();

		this.setUpControls();
	}

	private setUpControls() {
		const btn: Control = this.getControl('TestButton');
		const text: TextBlock = this.getControl('TestText') as TextBlock;
		const input: InputText = this.getControl('TestInput') as InputText;
		const closeBtn: Control = this.getControl('CloseBtn');

		btn.onPointerClickObservable.add(() => {
			console.log(`Button Click`);
			text.text = `Click ${this._scene.getFrameId()}`;
		});

		input.onTextChangedObservable.add((eventData: InputText, eventState: EventState) => {
			// console.log(`Input changed - data: %o  state: %o`, eventData, eventState);
			text.text = input.text;
		});

		closeBtn.onPointerClickObservable.add(() => {
			this._root.isVisible = false;
		});
	}
}
