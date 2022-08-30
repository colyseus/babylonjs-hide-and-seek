import { Scene } from '@babylonjs/core';
import { UIController } from './uiController';
export declare class TestUI extends UIController {
    constructor(scene: Scene, layer: number);
    protected initialize(): Promise<void>;
    private setUpControls;
}
