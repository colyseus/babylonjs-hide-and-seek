module BABYLON {
    /**
     * Babylon shuriken particle system pro class (Unity Style Shuriken Particle System)
     * @class ShurikenParticles - All rights reserved (c) 2020 Mackey Kinard
     */
    export class ShurikenParticles extends BABYLON.ScriptComponent {
        protected awake(): void { /* Awake component function */ }
        protected start(): void { /* Start render loop function */ }
        protected ready(): void { /* Execute when ready function */ }
        protected update(): void { /* Update render loop function */ }
        protected late(): void { /* Late update render loop function */ }
        protected after(): void { /* After render loop function */ }
        protected fixed(): void { /* Fixed update physics step function */ }
        protected destroy(): void { /* Destroy component function */ }
    }
}