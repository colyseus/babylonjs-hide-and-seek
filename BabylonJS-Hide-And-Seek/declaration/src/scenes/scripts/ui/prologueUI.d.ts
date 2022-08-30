import { Scene } from '@babylonjs/core';
import { UIController } from './uiController';
export declare class PrologueUI extends UIController {
    private _countdown;
    private _infoRoot;
    private _header;
    private _goal;
    shouldUpdatedCountdown: boolean;
    constructor(scene: Scene, layer: number);
    protected initialize(): Promise<void>;
    private setUpControls;
    setVisible(visible: boolean): void;
    showInfo(show: boolean): void;
    setCountdownText(text: string): void;
    private updateCountdown;
    private updateTexts;
}
