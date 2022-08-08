import { DeviceSource, DeviceSourceManager, DeviceType, Mesh, PhysicsImpostor, Vector3 } from '@babylonjs/core';
import { Node } from '@babylonjs/core/node';
import { visibleInInspector } from '../decorators';

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
export default class TestSphere extends Mesh {
	@visibleInInspector('number', 'Force Multiplier', 1)
	private _forceMultipler: number = 1;

	private dsm: DeviceSourceManager = null;
	private _inputSource: DeviceSource<DeviceType.Keyboard> = null;

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

		this.dsm = new DeviceSourceManager(this.getScene().getEngine());
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...

		this._rigidbody = this.getPhysicsImpostor();

		// console.log(`Rigidbody: %o`, this._rigidbody);
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		// ...

		if (!this._inputSource) {
			this._inputSource = this.dsm.getDeviceSource(DeviceType.Keyboard);
		}

		let force: Vector3 = new Vector3();
		let z: number = 0;
		let x: number = 0;

		if (this._inputSource) {
			// W + -S (1/0 + -1/0)
			z = this._inputSource.getInput(87) + -this._inputSource.getInput(83);
			// -A + D (-1/0 + 1/0)
			x = -this._inputSource.getInput(65) + this._inputSource.getInput(68);

			// console.log(`Z: ${z}  X: ${x}`);
		}

		// Move sphere via transform position
		// this.transform.position = new BABYLON.Vector3(this.transform.position.x + x * this.getDeltaSeconds(), this.transform.position.y, this.transform.position.z + z * this.getDeltaSeconds());

		force.x = x * this._forceMultipler;
		force.z = z * this._forceMultipler;

		// console.log(`Force: (${force.x}, 0, ${force.z})`);

		this._rigidbody.applyForce(force, this.position);
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
