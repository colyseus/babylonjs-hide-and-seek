module PROJECT {
	/**
	 * Babylon Script Component
	 * @class BTestSphere
	 */
	export class BTestSphere extends BABYLON.ScriptComponent {
		// Example: private helloWorld:string = "Hello World";

		private dsm: BABYLON.DeviceSourceManager = null;
		private inputSource: BABYLON.DeviceSource<BABYLON.DeviceType.Keyboard> = null;
		private forceMultiplier: number = 0;
		private rigidbody: BABYLON.RigidbodyPhysics = null;

		public constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any) {
			super(transform, scene, properties);

			this.dsm = new BABYLON.DeviceSourceManager(scene.getEngine());

			this.onCollisionEnter = this.onCollisionEnter.bind(this);
			this.onCollisionExit = this.onCollisionExit.bind(this);
		}

		protected awake(): void {
			/* Init component function */
		}

		protected start(): void {
			/* Start render loop function */
			// console.log(`Test Sphere - Start!`);

			// Get the force mulitplier for moving the sphere
			this.forceMultiplier = this.getProperty('forceMultiplier', 0);

			// this.getTransformMesh().onCollide = () => {
			// 	console.log(`On Collision`);
			// };

			console.log(`Test Sphere Metadata: %o`, this.transform.metadata);

			this.rigidbody = this.getComponent<BABYLON.RigidbodyPhysics>('BABYLON.RigidbodyPhysics');

			this.rigidbody.onCollisionEnterObservable.add(this.onCollisionEnter);
			this.rigidbody.onCollisionExitObservable.add(this.onCollisionExit);
		}

		protected ready(): void {
			/* Execute when ready function */
		}

		protected update(): void {
			/* Update render loop function */
		}

		protected late(): void {
			/* Late update render loop function */
		}

		protected after(): void {
			/* After update render loop function */
		}

		protected fixed(): void {
			/* Fixed update physics step function */

			let z: number = 0;
			let x: number = 0;
			let force: BABYLON.Vector3 = new BABYLON.Vector3();

			if (!this.inputSource) {
				this.inputSource = this.dsm.getDeviceSource(BABYLON.DeviceType.Keyboard);
			}

			if (this.inputSource) {
				// W + -S (1/0 + -1/0)
				z = this.inputSource.getInput(87) + -this.inputSource.getInput(83);
				// -A + D (-1/0 + 1/0)
				x = -this.inputSource.getInput(65) + this.inputSource.getInput(68);

				// console.log(`Z: ${z}  X: ${x}`);
			}

			// Move sphere via transform position
			// this.transform.position = new BABYLON.Vector3(this.transform.position.x + x * this.getDeltaSeconds(), this.transform.position.y, this.transform.position.z + z * this.getDeltaSeconds());

			force.x = x * this.forceMultiplier;
			force.z = z * this.forceMultiplier;

			// Move sphere via physics force
			this.rigidbody.applyForce(force, new BABYLON.Vector3());
		}

		protected destroy(): void {
			/* Destroy component function */
		}

		private onCollisionEnter(mesh: BABYLON.Mesh, eventState: BABYLON.EventState) {
			if (BABYLON.Tags.MatchesQuery(mesh, 'env')) {
				return;
			}

			// console.log(`On Collision Enter - Mesh: %o  Event State: %o`, mesh, eventState);
		}

		private onCollisionExit(mesh: BABYLON.AbstractMesh, eventState: BABYLON.EventState) {
			if (BABYLON.Tags.MatchesQuery(mesh, 'env')) {
				return;
			}

			// console.log(`On Collision Exit - Event Data: %o  Event State: %o`, mesh, eventState);
		}
	}
}
