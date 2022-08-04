module PROJECT {
	/**
	 * Babylon Script Component
	 * @class BTestComponent
	 */
	export class BTestComponent extends BABYLON.ScriptComponent {
		// Example: private helloWorld:string = "Hello World";

		private val1: number = -1;
		private val2: number = -1;
		private val3: boolean = false;

		protected awake(): void {
			/* Init component function */

			this.val1 = this.getProperty('testVal_1');
			this.val2 = this.getProperty('testVal_2');
			this.val3 = this.getProperty('testVal_3');
		}

		protected start(): void {
			/* Start render loop function */
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

		public printValues() {
			console.log(`Test Component Values - 1: ${this.val1}  2: ${this.val2}  3: ${this.val3}`);
		}
	}
}
