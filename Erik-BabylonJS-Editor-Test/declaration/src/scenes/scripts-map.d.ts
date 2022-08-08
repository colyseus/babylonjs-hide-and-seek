import { ScriptMap } from "./tools";
/**
 * Defines the interface that exposes all exported scripts in this project.
 */
export interface ISceneScriptMap {
    "src/scenes/scripts/managers/GameManager.ts": ScriptMap;
    "src/scenes/scripts/TestSphere.ts": ScriptMap;
    "src/scenes/scripts/VFXSparks.ts": ScriptMap;
    "src/scenes/scripts/VFXTrigger.ts": ScriptMap;
}
/**
 * Defines the map of all available scripts in the project.
 */
export declare const scriptsMap: ISceneScriptMap;
