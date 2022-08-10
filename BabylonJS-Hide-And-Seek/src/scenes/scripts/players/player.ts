import { Mesh, PhysicsImpostor, Space, Vector3 } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';
import { visibleInInspector } from '../../decorators';
import GameManager from '../managers/gameManager';
import InputManager from '../managers/inputManager';

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
export default class Player extends Mesh {
	@visibleInInspector('number', 'Movement Speed', 1)
	private _movementSpeed: number = 1;

	private _rigidbody: PhysicsImpostor = null;

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
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...
		this._rigidbody = this.getPhysicsImpostor();
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		this.updatePlayerMovement();
	}

	private updatePlayerMovement() {
		let direction: Vector3 = new Vector3();
		let z: number = 0;
		let x: number = 0;

		// W + -S (1/0 + -1/0)
		z = (InputManager.getKey(87) ? 1 : 0) + (InputManager.getKey(83) ? -1 : 0);
		// -A + D (-1/0 + 1/0)
		x = (InputManager.getKey(65) ? -1 : 0) + (InputManager.getKey(68) ? 1 : 0);

		// Prevent the player from moving faster than it should in a diagonal direction
		if (z !== 0 && x !== 0) {
			x *= 0.75;
			z *= 0.75;
		}

		direction.x = x * this._movementSpeed * GameManager.DeltaTime;
		direction.z = z * this._movementSpeed * GameManager.DeltaTime;

		this._rigidbody.setLinearVelocity(direction);
		this._rigidbody.setAngularVelocity(Vector3.Zero());

		this.position.y = 0.5;
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
}
