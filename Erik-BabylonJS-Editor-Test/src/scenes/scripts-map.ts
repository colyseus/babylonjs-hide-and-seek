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
export const scriptsMap: ISceneScriptMap = {
	"src/scenes/scripts/managers/GameManager.ts": require("./scripts/managers/GameManager"),
	"src/scenes/scripts/TestSphere.ts": require("./scripts/TestSphere"),
	"src/scenes/scripts/VFXSparks.ts": require("./scripts/VFXSparks"),
	"src/scenes/scripts/VFXTrigger.ts": require("./scripts/VFXTrigger"),
}
