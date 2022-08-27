import { Scene } from '@babylonjs/core';
import { UIController } from './uiController';
export declare class PrologueUI extends UIController {
    private _countdown;
    private _header;
    private _goal;
    constructor(scene: Scene, layer: number);
    protected initialize(): Promise<void>;
    private setUpControls;
    setVisible(visible: boolean): void;
    private updateCountdown;
    private updateTexts;
}
