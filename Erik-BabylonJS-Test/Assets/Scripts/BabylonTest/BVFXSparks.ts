module PROJECT {
	/**
	 * Babylon Script Component
	 * @class BVFXSparks
	 */
	export class BVFXSparks extends BABYLON.ScriptComponent {
		// Example: private helloWorld:string = "Hello World";

		private rigidbody: BABYLON.RigidbodyPhysics = null;
		private unityParticles: BABYLON.ShurikenParticles = null;
		private particles: BABYLON.ParticleSystem = null;

		protected awake(): void {
			/* Init component function */
		}

		protected start(): void {
			/* Start render loop function */

			this.rigidbody = this.getComponent<BABYLON.RigidbodyPhysics>('BABYLON.RigidbodyPhysics');
			this.unityParticles = this.getComponent<BABYLON.ShurikenParticles>('BABYLON.ShurikenParticles');

			this.initializeParticles();

			console.log(`VFX Sparks Metadata: %o`, this.transform.metadata);
			console.log(`Particles: %o`, this.unityParticles);

			this.onCollisionEnter = this.onCollisionEnter.bind(this);
			this.onTriggerEnter = this.onTriggerEnter.bind(this);

			this.rigidbody.onCollisionEnterObservable.add(this.onCollisionEnter);
			this.rigidbody.onTriggerEnterObservable.add(this.onTriggerEnter);
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
		}

		protected destroy(): void {
			/* Destroy component function */
		}

		private initializeParticles() {
			this.particles = new BABYLON.ParticleSystem('particles', 1000, this.scene);

			this.particles.emitter = this.getTransformMesh();

			this.particles.start();
		}

		private onCollisionEnter(eventData: BABYLON.AbstractMesh, eventState: BABYLON.EventState) {
			console.log(`VFX Collision Enter`);
		}

		private onTriggerEnter(eventData: BABYLON.AbstractMesh, eventState: BABYLON.EventState) {
			console.log(`VFX Trigger Enter`);
		}
	}
}
