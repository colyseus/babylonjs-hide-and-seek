import { TransformNode } from '@babylonjs/core';
import type { PlayerState } from '../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';
export declare class SpawnPoints {
    private _spawnPoints;
    private _seekerPoint;
    private _availablePoints;
    private _usedPoints;
    constructor(spawnPoints: TransformNode[]);
    private initializeSpawnPoints;
    reset(): void;
    getSpawnPoint(playerState: PlayerState): TransformNode;
    freeUpSpawnPoint(playerState: PlayerState): void;
}
