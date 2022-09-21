import { Mesh } from '@babylonjs/core';
import { fromChildren } from '../../decorators';
import InteractableTrigger from './interactableTrigger';

export default class ParticlesTrigger extends InteractableTrigger {
	@fromChildren('emitter')
	protected _emitter: Mesh;

	protected _timeout: NodeJS.Timeout = null;

	/**
	 * Override constructor.
	 * @warn do not fill.
	 */
	// @ts-ignore ignoring the super call as we don't want to re-init
	protected constructor() {}

	public onInitialized(): void {
		// ...
		super.onInitialized();
	}

	public registerMeshForIntersection(mesh: Mesh) {
		super.registerMeshForIntersection(mesh);
	}
}
