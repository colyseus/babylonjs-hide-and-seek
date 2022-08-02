module BABYLON {
    /**
     * Babylon terrain building system pro class (Unity Style Terrain Building System)
     * @class TerrainGenerator - All rights reserved (c) 2020 Mackey Kinard
     */
    export class TerrainGenerator extends BABYLON.ScriptComponent {
        private treeInstances:BABYLON.TransformNode[] = null;

        protected awake(): void {
            /* Init component function */
            // TESTING ONLY: const trees = this.getChildNode("_trees", BABYLON.SearchType.EndsWith, true);
            // TESTING ONLY: if (trees != null) this.treeInstances = trees.getChildren(null, true) as BABYLON.TransformNode[];

            console.log("Terrain Generator: " + this.transform.name);
            console.log(this);
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
    }
}