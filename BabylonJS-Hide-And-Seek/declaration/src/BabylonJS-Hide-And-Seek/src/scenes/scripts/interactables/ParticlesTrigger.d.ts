/// <reference types="node" />
import { Mesh } from '@babylonjs/core';
import InteractableTrigger from './interactableTrigger';
export default class ParticlesTrigger extends InteractableTrigger {
    protected _emitter: Mesh;
    protected _timeout: NodeJS.Timeout;
    /**
     * Override constructor.
     * @warn do not fill.
     */
    protected constructor();
    onInitialized(): void;
    registerMeshForIntersection(mesh: Mesh): void;
}
