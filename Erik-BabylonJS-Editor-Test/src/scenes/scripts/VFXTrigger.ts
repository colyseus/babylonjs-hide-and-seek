import { AbstractMesh, ActionManager, EventState, Mesh, ParticleSystem, PhysicsImpostor, SetValueAction } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';
import { fromParticleSystems, visibleInInspector } from '../decorators';

/**
 * This represents a script that is attached to a node in the editor.
 * Available nodes are:
 *      - Meshes
 *      - Lights
 *      - Cameas
 *      - Transform nodes
 *
 * You can extend the desired class according to the node type.
 * Example:
 *      export default class MyMesh extends Mesh {
 *          public onUpdate(): void {
 *              this.rotation.y += 0.04;
 *          }
 *      }
 * The function "onInitialize" is called immediately after the constructor is called.
 * The functions "onStart" and "onUpdate" are called automatically.
 */
export default class VFXTrigger extends Mesh {
	/**
	 * Override constructor.
	 * @warn do not fill.
	 */
	// @ts-ignore ignoring the super call as we don't want to re-init
	protected constructor() {}

	/**
	 * Called on the node is being initialized.
	 * This function is called immediatly after the constructor has been called.
	 */
	public onInitialize(): void {
		// ...

		this.onCollided = this.onCollided.bind(this);

		this.onCollideObservable.add(this.onCollided);

		console.log(`VFX Trigger - On Initialize`);
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		// ...
		// this.intersectsMesh();
	}

	/**
	 * Called on the object has been disposed.
	 * Object can be disposed manually or when the editor stops running the scene.
	 */
	public onStop(): void {
		// ...
	}

	/**
	 * Called on a message has been received and sent from a graph.
	 * @param message defines the name of the message sent from the graph.
	 * @param data defines the data sent in the message.
	 * @param sender defines the reference to the graph class that sent the message.
	 */
	public onMessage(name: string, data: any, sender: any): void {
		switch (name) {
			case 'myMessage':
				// Do something...
				break;
		}
	}

	private onCollided(eventData: AbstractMesh, eventState: EventState) {
		console.log(`VFX Trigger - On Collide`);
	}
}
