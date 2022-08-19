"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@babylonjs/core");
var node_1 = require("@babylonjs/core/node");
var GameState_1 = require("../GameState");
var decorators_1 = require("../../decorators");
var spawnPoints_1 = require("../spawnPoints");
var inputManager_1 = require("./inputManager");
var networkManager_1 = require("./networkManager");
var PlayerInputMessage_1 = require("../../../../../Server/hide-and-seek/src/models/PlayerInputMessage");
var GameManager = /** @class */ (function (_super) {
    __extends(GameManager, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function GameManager() {
        var _this = this;
        _this._availableRemotePlayerObjects = null;
        _this._spawnPoints = null;
        _this._spawnedRemotes = null;
        _this._players = null;
        _this._currentGameState = GameState_1.GameState.NONE;
        _this._joiningRoom = false;
        _this._playAgain = false;
        _this._playerChaseSpeed = 25;
        _this._startChaseSpeed = 3;
        return _this;
    }
    Object.defineProperty(GameManager.prototype, "CurrentGameState", {
        get: function () {
            return GameManager.Instance._currentGameState;
        },
        set: function (gameState) {
            GameManager.Instance._currentGameState = gameState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameManager, "Instance", {
        get: function () {
            return GameManager._instance;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameManager, "DeltaTime", {
        get: function () {
            return this._instance._scene.deltaTime / 1000;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    GameManager.prototype.onInitialize = function () {
        // ...
        GameManager._instance = this;
        this._availableRemotePlayerObjects = [];
        this._spawnedRemotes = new Map();
        this._players = new Map();
        this.onJoinedRoom = this.onJoinedRoom.bind(this);
        this.onLeftRoom = this.onLeftRoom.bind(this);
        this.onPlayerAdded = this.onPlayerAdded.bind(this);
        this.onPlayerRemoved = this.onPlayerRemoved.bind(this);
        this.onGameStateChange = this.onGameStateChange.bind(this);
    };
    /**
     * Called on the scene starts.
     */
    GameManager.prototype.onStart = function () {
        // ...
        this.initializeSpawnPoints();
        // Add remote player references to the array
        this._availableRemotePlayerObjects.push(this._remotePlayer1);
        this._availableRemotePlayerObjects.push(this._remotePlayer2);
        this._availableRemotePlayerObjects.push(this._remotePlayer3);
        this._availableRemotePlayerObjects.push(this._remotePlayer4);
        this._availableRemotePlayerObjects.push(this._remotePlayer5);
        this._availableRemotePlayerObjects.push(this._remotePlayer6);
        this._availableRemotePlayerObjects.push(this._remotePlayer7);
        this._player.setParent(null);
        networkManager_1.default.Instance.onJoinedRoom = this.onJoinedRoom;
        networkManager_1.default.Instance.onLeftRoom = this.onLeftRoom;
        networkManager_1.default.Instance.onPlayerAdded = this.onPlayerAdded;
        networkManager_1.default.Instance.onPlayerRemoved = this.onPlayerRemoved;
        networkManager_1.default.Instance.onGameStateChange = this.onGameStateChange;
        this._cameraHolder.setTarget(this._cameraStartPos, this._startChaseSpeed);
    };
    GameManager.prototype.initializeSpawnPoints = function () {
        var spawnPoints = this._spawnPointsRoot.getChildren();
        this._spawnPoints = new spawnPoints_1.SpawnPoints(spawnPoints);
    };
    GameManager.prototype.onJoinedRoom = function (roomId) {
        this._joiningRoom = false;
    };
    GameManager.prototype.onLeftRoom = function (code) {
        console.log("Left room: ".concat(code));
        this._cameraHolder.setTarget(this._cameraStartPos, this._startChaseSpeed);
    };
    GameManager.prototype.onPlayerAdded = function (state, sessionId) {
        console.log("On Player Added: ".concat(sessionId));
        this._players.set(sessionId, state);
    };
    GameManager.prototype.onPlayerRemoved = function (state, sessionId) {
        console.log("On Player Removed: ".concat(sessionId));
        this.despawnPlayer(state);
        this._players.delete(sessionId);
    };
    GameManager.prototype.resetPlayerObject = function (player) {
        player.setPlayerState(null);
        player.setVelocity(core_1.Vector3.Zero());
        player.setEnabled(false);
        player.setParent(this);
        this._availableRemotePlayerObjects.push(player);
    };
    GameManager.prototype.onGameStateChange = function (changes) {
        // console.log(`Game Manager - On Game State Change: %o`, changes);
        var change = null;
        for (var i = 0; i < changes.length; i++) {
            change = changes[i];
            if (!change) {
                continue;
            }
            switch (change.field) {
                case 'currentState':
                    this.handleGameStateChange(change.value);
                    break;
                case 'countdown':
                    this.handleCountdownChange(change.value);
                    break;
            }
        }
    };
    GameManager.prototype.handleGameStateChange = function (gameState) {
        console.log("Game Manager - Game State Changed: ".concat(gameState));
        this.CurrentGameState = gameState;
        switch (gameState) {
            case GameState_1.GameState.NONE:
                break;
            case GameState_1.GameState.WAIT_FOR_MINIMUM:
                this.despawnPlayers();
                this._spawnPoints.reset();
                this._playAgain = false;
                break;
            case GameState_1.GameState.CLOSE_COUNTDOWN:
                break;
            case GameState_1.GameState.INITIALIZE:
                break;
            case GameState_1.GameState.PROLOGUE:
                // Set up player objects for the local player as well as all remote players
                this.spawnPlayers();
                // Send the initial position of the player to the server
                networkManager_1.default.Instance.sendPlayerPosition(new PlayerInputMessage_1.PlayerInputMessage(this._player.position.asArray()));
                this._cameraHolder.setTargetPosition(this._player.position, this._startChaseSpeed);
                break;
            case GameState_1.GameState.SCATTER:
                this._cameraHolder.setTarget(this._player, this._playerChaseSpeed);
                break;
            case GameState_1.GameState.HUNT:
                break;
            case GameState_1.GameState.GAME_OVER:
                break;
            default:
                break;
        }
    };
    GameManager.prototype.handleCountdownChange = function (countdown) {
        console.log("Countdown: ".concat(countdown));
    };
    GameManager.prototype.spawnPlayers = function () {
        var _this = this;
        networkManager_1.default.Instance.Room.state.players.forEach(function (player, sessionId) {
            _this.spawnPlayer(player, sessionId);
        });
    };
    GameManager.prototype.spawnPlayer = function (playerState, sessionId) {
        var player = null;
        if (networkManager_1.default.Instance.Room.sessionId === sessionId) {
            // Assign the local player object
            player = this._player;
        }
        else {
            // Player is remote
            if (this._availableRemotePlayerObjects.length === 0) {
                console.error("On Player Added - No more remote player objects to assign!");
                return;
            }
            // Retrieve a remote player object
            player = this._availableRemotePlayerObjects.splice(0, 1)[0];
            // Add the player to the map of remote players
            this._spawnedRemotes.set(sessionId, player);
        }
        var point = this._spawnPoints.getSpawnPoint(playerState);
        player.setParent(null);
        player.position.copyFrom(point.position);
        player.rotation.copyFrom(point.rotation);
        // Delay enabling player object to avoid visual briefly appearing somewhere else before getting moved to its spawn position
        setTimeout(function () {
            player.setEnabled(true);
        }, 100);
        player.setPlayerState(playerState);
    };
    GameManager.prototype.despawnPlayers = function () {
        var _this = this;
        networkManager_1.default.Instance.Room.state.players.forEach(function (player, sessionId) {
            _this.despawnPlayer(player);
        });
    };
    GameManager.prototype.despawnPlayer = function (player) {
        // Reset the player object if it has been spawned
        var playerObject;
        console.log("Despawn Player: %o", player);
        if (player.id === networkManager_1.default.Instance.Room.sessionId) {
            playerObject = this._player;
        }
        else {
            playerObject = this._spawnedRemotes.get(player.id);
            this._spawnedRemotes.delete(player.id);
        }
        if (playerObject) {
            this.resetPlayerObject(playerObject);
        }
        this._spawnPoints.freeUpSpawnPoint(player);
    };
    /**
     * Called each frame.
     */
    GameManager.prototype.onUpdate = function () {
        // ...
        if (!networkManager_1.default.Instance.Room && inputManager_1.default.getKeyUp(32) && !this._joiningRoom) {
            console.log('Join Room');
            this._joiningRoom = true;
            networkManager_1.default.Instance.joinRoom();
        }
        else {
            if (networkManager_1.default.Instance.Room && this.CurrentGameState === GameState_1.GameState.GAME_OVER && !this._playAgain && inputManager_1.default.getKeyUp(32)) {
                this._playAgain = true;
                this._cameraHolder.setTarget(this._cameraStartPos, this._startChaseSpeed);
                networkManager_1.default.Instance.sendPlayAgain();
            }
        }
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    GameManager.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    GameManager.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    GameManager._instance = null;
    __decorate([
        (0, decorators_1.fromScene)('Camera Holder')
    ], GameManager.prototype, "_cameraHolder", void 0);
    __decorate([
        (0, decorators_1.fromScene)('CameraStartPos')
    ], GameManager.prototype, "_cameraStartPos", void 0);
    __decorate([
        (0, decorators_1.fromScene)('Spawn Points')
    ], GameManager.prototype, "_spawnPointsRoot", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('Player')
    ], GameManager.prototype, "_player", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('Remote Player 1')
    ], GameManager.prototype, "_remotePlayer1", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('Remote Player 2')
    ], GameManager.prototype, "_remotePlayer2", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('Remote Player 3')
    ], GameManager.prototype, "_remotePlayer3", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('Remote Player 4')
    ], GameManager.prototype, "_remotePlayer4", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('Remote Player 5')
    ], GameManager.prototype, "_remotePlayer5", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('Remote Player 6')
    ], GameManager.prototype, "_remotePlayer6", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('Remote Player 7')
    ], GameManager.prototype, "_remotePlayer7", void 0);
    return GameManager;
}(node_1.Node));
exports.default = GameManager;
//# sourceMappingURL=gameManager.js.map