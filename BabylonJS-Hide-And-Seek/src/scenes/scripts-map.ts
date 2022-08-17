import { ScriptMap } from "./tools";

/**
 * Defines the interface that exposes all exported scripts in this project.
 */
export interface ISceneScriptMap {
	"src/scenes/scripts/colyseusSettings.ts": ScriptMap;
	"src/scenes/scripts/GameState.ts": ScriptMap;
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
export const scriptsMap: ISceneScriptMap = {
	"src/scenes/scripts/colyseusSettings.ts": require("./scripts/colyseusSettings"),
	"src/scenes/scripts/GameState.ts": require("./scripts/GameState"),
	"src/scenes/scripts/managers/gameManager.ts": require("./scripts/managers/gameManager"),
	"src/scenes/scripts/managers/inputManager.ts": require("./scripts/managers/inputManager"),
	"src/scenes/scripts/managers/networkManager.ts": require("./scripts/managers/networkManager"),
	"src/scenes/scripts/players/cameraHolder.ts": require("./scripts/players/cameraHolder"),
	"src/scenes/scripts/players/player.ts": require("./scripts/players/player"),
	"src/scenes/scripts/spawnPoints.ts": require("./scripts/spawnPoints"),
}
