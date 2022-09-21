import { Mesh } from '@babylonjs/core';
import PlayerVisual from './playerVisual';
export declare class MudPrints {
    private _playerVisual;
    private _printPrefab;
    private _enabled;
    private _lastPos;
    private _foot;
    private _livePrints;
    private _pooledPrints;
    private _delayStop;
    constructor(playerVisual: PlayerVisual, printPrefab: Mesh);
    start(runTime?: number): void;
    stop(): void;
    update(): void;
    private updateLivePrints;
    private poolPrints;
    private createPrint;
    private getPrint;
    private spawnMudPrint;
    private despawnMudPrint;
}
