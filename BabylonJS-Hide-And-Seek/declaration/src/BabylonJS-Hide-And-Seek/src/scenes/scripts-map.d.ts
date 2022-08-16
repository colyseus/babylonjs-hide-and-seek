import { ScriptMap } from "./tools";
/**
 * Defines the interface that exposes all exported scripts in this project.
 */
export interface ISceneScriptMap {
    "src/scenes/scripts/colyseusSettings.ts": ScriptMap;
    "src/scenes/scripts/managers/gameManager.ts": ScriptMap;
    "src/scenes/scripts/managers/inputManager.ts": ScriptMap;
    "src/scenes/scripts/managers/networkManager.ts": ScriptMap;
    "src/scenes/scripts/players/cameraHolder.ts": ScriptMap;
    "src/scenes/scripts/players/player.ts": ScriptMap;
    "src/scenes/scripts/spawnPoints.ts": ScriptMap;
}
/**
 * Defines the map of all available scripts in the project.
 */
export declare const scriptsMap: ISceneScriptMap;
