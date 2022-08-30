// import { Scene } from '@babylonjs/core';
// import { Control, TextBlock } from '@babylonjs/gui';
// import GameManager from '../managers/gameManager';
// import { UIController } from './uiController';
// export class GameOverUI extends UIController {
// 	constructor(scene: Scene, layer: number) {
// 		super('GameOver', scene, layer);
// 		this.playAgain = this.playAgain.bind(this);
// 		this.returnToTitle = this.returnToTitle.bind(this);
// 		this.initialize();
// 	}
// 	protected async initialize(): Promise<void> {
// 		await super.initialize();
// 		this.setUpControls();
// 	}
// 	public setVisible(visible: boolean): void {
// 		super.setVisible(visible);
// 		if (visible) {
// 			if (GameManager.Instance.SeekerWon) {
// 				this._gameOverHeader.text = `Seeker Wins!`;
// 			} else {
// 				this._gameOverHeader.text = `Hiders Win!`;
// 			}
// 		}
// 	}
// 	private setUpControls() {
// 		this._gameOverHeader = this.getControl('Header') as TextBlock;
// 		this._playAgainBtn = this.getControl('PlayAgainBtn');
// 		this._leaveBtn = this.getControl('LeaveBtn');
// 		this.registerControlHandlers();
// 	}
// 	private registerControlHandlers() {
// 		this._playAgainBtn.onPointerClickObservable.add(this.playAgain);
// 		this._leaveBtn.onPointerClickObservable.add(this.returnToTitle);
// 	}
// 	private playAgain() {
// 		this.emit('playAgain');
// 	}
// 	private returnToTitle() {
// 		this.emit('returnToTitle');
// 	}
// }
//# sourceMappingURL=gameOverUI.js.map