import { Scene } from '@babylonjs/core';
import { UIController } from './uiController';
export declare class StatsUI extends UIController {
    private _fps;
    constructor(scene: Scene, layer: number);
    protected initialize(): Promise<void>;
    private setUpControls;
    setFPSValue(value: string): void;
}
