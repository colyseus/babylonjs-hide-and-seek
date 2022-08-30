import { Scene } from '@babylonjs/core';
import { UIController } from './uiController';
export declare class GameplayUI extends UIController {
    private _countdown;
    constructor(scene: Scene, layer: number);
    protected initialize(): Promise<void>;
    private setUpControls;
    setVisible(visible: boolean): void;
    private updateCountdown;
}
