import { Mesh } from '@babylonjs/core';
import Player from '../players/player';
import ParticlesTrigger from './particlesTrigger';
export default class GhostsTrigger extends ParticlesTrigger {
    private _ghostsPrefab;
    private _ghosts;
    /**
     * Override constructor.
     * @warn do not fill.
     */
    protected constructor();
    onInitialized(): void;
    /**
     * Called on the scene starts.
     */
    onStart(): void;
    registerMeshForIntersection(mesh: Mesh): void;
    protected onPlayerEnteredTrigger(player: Player): void;
}
