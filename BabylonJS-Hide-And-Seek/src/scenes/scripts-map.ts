import { ScriptMap } from "./tools";

/**
 * Defines the interface that exposes all exported scripts in this project.
 */
export interface ISceneScriptMap {
	"src/scenes/scripts/colyseusSettings.ts": ScriptMap;
	"src/scenes/scripts/networkManager.ts": ScriptMap;
}

/**
 * Defines the map of all available scripts in the project.
 */
export const scriptsMap: ISceneScriptMap = {
	"src/scenes/scripts/colyseusSettings.ts": require("./scripts/colyseusSettings"),
	"src/scenes/scripts/networkManager.ts": require("./scripts/networkManager"),
}
