import { Scene } from '@babylonjs/core';
import { UIController } from './uiController';
export declare class TitleUI extends UIController {
    private _quickPlayBtn;
    private _joinBtn;
    private _gameOptions;
    private _joinUI;
    private _joinInput;
    private _joinSubmit;
    private _joinErrorText;
    private _cancelJoin;
    constructor(scene: Scene, layer: number);
    protected initialize(): Promise<void>;
    private setUpControls;
    private registerControlHandlers;
    setVisible(visible: boolean): void;
    private handleQuickPlay;
    joinFailed(error: string): void;
    setJoinUIEnabled(enabled: boolean): void;
    private handleJoin;
    private handleJoinSubmit;
    private handleCancleJoin;
}
