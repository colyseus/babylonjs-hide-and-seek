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
	"src/scenes/scripts/managers/uiManager.ts": ScriptMap;
	"src/scenes/scripts/players/cameraHolder.ts": ScriptMap;
	"src/scenes/scripts/players/capturedTrigger.ts": ScriptMap;
	"src/scenes/scripts/players/player.ts": ScriptMap;
	"src/scenes/scripts/players/playerVisual.ts": ScriptMap;
	"src/scenes/scripts/spawnPoint.ts": ScriptMap;
	"src/scenes/scripts/spawnPoints.ts": ScriptMap;
	"src/scenes/scripts/ui/GameplayUI.ts": ScriptMap;
	"src/scenes/scripts/ui/lobbyUI.ts": ScriptMap;
	"src/scenes/scripts/ui/overlayUI.ts": ScriptMap;
	"src/scenes/scripts/ui/prologueUI.ts": ScriptMap;
	"src/scenes/scripts/ui/testUI.ts": ScriptMap;
	"src/scenes/scripts/ui/titleUI.ts": ScriptMap;
	"src/scenes/scripts/ui/uiController.ts": ScriptMap;
	"src/scenes/utility.ts": ScriptMap;
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
	"src/scenes/scripts/managers/uiManager.ts": require("./scripts/managers/uiManager"),
	"src/scenes/scripts/players/cameraHolder.ts": require("./scripts/players/cameraHolder"),
	"src/scenes/scripts/players/capturedTrigger.ts": require("./scripts/players/capturedTrigger"),
	"src/scenes/scripts/players/player.ts": require("./scripts/players/player"),
	"src/scenes/scripts/players/playerVisual.ts": require("./scripts/players/playerVisual"),
	"src/scenes/scripts/spawnPoint.ts": require("./scripts/spawnPoint"),
	"src/scenes/scripts/spawnPoints.ts": require("./scripts/spawnPoints"),
	"src/scenes/scripts/ui/GameplayUI.ts": require("./scripts/ui/GameplayUI"),
	"src/scenes/scripts/ui/lobbyUI.ts": require("./scripts/ui/lobbyUI"),
	"src/scenes/scripts/ui/overlayUI.ts": require("./scripts/ui/overlayUI"),
	"src/scenes/scripts/ui/prologueUI.ts": require("./scripts/ui/prologueUI"),
	"src/scenes/scripts/ui/testUI.ts": require("./scripts/ui/testUI"),
	"src/scenes/scripts/ui/titleUI.ts": require("./scripts/ui/titleUI"),
	"src/scenes/scripts/ui/uiController.ts": require("./scripts/ui/uiController"),
	"src/scenes/utility.ts": require("./utility"),
}
