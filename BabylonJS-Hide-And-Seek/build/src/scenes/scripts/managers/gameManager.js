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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@babylonjs/core");
var EventEmitter = require("events");
var node_1 = require("@babylonjs/core/node");
var GameState_1 = require("../GameState");
var decorators_1 = require("../../decorators");
var spawnPoints_1 = require("../spawnPoints");
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
        _this._seekerFOV = 60;
        _this.seekerCheckDistance = 6;
        /** In ms, the time between messages sent to the server for each Hider discovered by the Seeker */
        _this._foundHiderMsgRate = 1000;
        _this._halfSeekerFOV = 0;
        _this._playerState = null;
        _this._eventEmitter = new EventEmitter();
        return _this;
    }
    Object.defineProperty(GameManager, "PlayerState", {
        get: function () {
            return GameManager.Instance._playerState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameManager.prototype, "Countdown", {
        get: function () {
            return networkManager_1.default.Instance.Room.state.gameState.countdown;
        },
        enumerable: false,
        configurable: true
    });
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
    GameManager.prototype.SeekerWon = function () {
        return networkManager_1.default.Instance.Room.state.gameState.seekerWon;
    };
    GameManager.prototype.addOnEvent = function (eventName, callback) {
        this._eventEmitter.addListener(eventName, callback);
    };
    GameManager.prototype.removeOnEvent = function (eventName, callback) {
        this._eventEmitter.removeListener(eventName, callback);
    };
    GameManager.prototype.broadcastEvent = function (eventName, data) {
        this._eventEmitter.emit(eventName, data);
    };
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
        this._foundHiders = new Map();
        this._halfSeekerFOV = this._seekerFOV / 2;
        this.onJoinedRoom = this.onJoinedRoom.bind(this);
        this.onLeftRoom = this.onLeftRoom.bind(this);
        this.onPlayerAdded = this.onPlayerAdded.bind(this);
        this.onPlayerRemoved = this.onPlayerRemoved.bind(this);
        this.onGameStateChange = this.onGameStateChange.bind(this);
        this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
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
        networkManager_1.default.Instance.addOnEvent(networkManager_1.NetworkEvent.JOINED_ROOM, this.onJoinedRoom);
        networkManager_1.default.Instance.addOnEvent(networkManager_1.NetworkEvent.LEFT_ROOM, this.onLeftRoom);
        networkManager_1.default.Instance.addOnEvent(networkManager_1.NetworkEvent.PLAYER_ADDED, this.onPlayerAdded);
        networkManager_1.default.Instance.addOnEvent(networkManager_1.NetworkEvent.PLAYER_REMOVED, this.onPlayerRemoved);
        networkManager_1.default.Instance.addOnEvent(networkManager_1.NetworkEvent.GAME_STATE_CHANGED, this.onGameStateChange);
        this._cameraHolder.setTarget(this._cameraStartPos, this._startChaseSpeed);
        // Set the layermask of all scene meshes so they aren't visible in the UI camera
        //================================================
        var meshes = this._scene.meshes;
        var meshLayermask = 1;
        meshes.forEach(function (mesh) {
            // console.log(`Setting ${mesh.name} Layermask to ${meshLayermask}`);
            mesh.layerMask = meshLayermask;
        });
        //================================================
    };
    GameManager.prototype.PlayerIsSeeker = function () {
        return this._playerState.isSeeker;
    };
    GameManager.prototype.joinRoom = function (roomId) {
        if (roomId === void 0) { roomId = null; }
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._joiningRoom || networkManager_1.default.Instance.Room) {
                            return [2 /*return*/];
                        }
                        if (!roomId) {
                            console.log('Start Quick Play!');
                        }
                        else {
                            console.log("Join room \"".concat(roomId, "\""));
                        }
                        this._joiningRoom = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, networkManager_1.default.Instance.joinRoom(roomId)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this._joiningRoom = false;
                        throw new Error(error_1.message);
                    case 4: return [2 /*return*/];
                }
            });
        });
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
        this._playerState = null;
        this.reset();
    };
    GameManager.prototype.onPlayerAdded = function (state) {
        var _this = this;
        console.log("On Player Added: %o", state.id);
        if (state.id === networkManager_1.default.Instance.Room.sessionId) {
            console.log("Local Player State Received!");
            this._playerState = state;
        }
        state.onChange = function (changes) {
            _this.onPlayerStateChange(state.id, changes);
        };
        this._players.set(state.id, state);
    };
    GameManager.prototype.onPlayerStateChange = function (sessionId, changes) {
        var change = null;
        for (var i = 0; i < changes.length; i++) {
            change = changes[i];
            if (!change) {
                continue;
            }
            switch (change.field) {
                case 'playAgain':
                    console.log("Player (".concat(sessionId, ") State Change - ").concat(change.field, " to ").concat(change.value));
                    this.broadcastEvent('playerPlayAgain', { sessionId: sessionId, value: change.value });
                    break;
            }
        }
    };
    GameManager.prototype.onPlayerRemoved = function (state) {
        console.log("On Player Removed: ".concat(state.id));
        this.despawnPlayer(state);
        this._players.delete(state.id);
    };
    GameManager.prototype.resetPlayerObject = function (player) {
        player.reset();
        player.toggleEnabled(false);
        player.setParent(this);
        if (!player.isLocalPlayer) {
            this._availableRemotePlayerObjects.push(player);
        }
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
                this.reset();
                break;
            case GameState_1.GameState.CLOSE_COUNTDOWN:
                break;
            case GameState_1.GameState.INITIALIZE:
                break;
            case GameState_1.GameState.PROLOGUE:
                // Set up player objects for the local player as well as all remote players
                this.spawnPlayers();
                // Send the initial position of the player to the server
                networkManager_1.default.Instance.sendPlayerPosition(new PlayerInputMessage_1.PlayerInputMessage([], this._player.position.asArray()));
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
        this.broadcastEvent('gameStateChanged', gameState);
    };
    GameManager.prototype.handleCountdownChange = function (countdown) {
        // console.log(`Countdown: ${countdown}`);
        this.broadcastEvent('updateCountdown', countdown);
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
        player.setVisualLookDirection(point.forward);
        // Delay enabling player object to avoid visual briefly appearing somewhere else before getting moved to its spawn position
        setTimeout(function () {
            player.toggleEnabled(true);
        }, 100);
        player.setPlayerState(playerState);
    };
    GameManager.prototype.despawnPlayers = function () {
        var _this = this;
        // if (NetworkManager.Instance.Room) {
        // 	NetworkManager.Instance.Room.state.players.forEach((player: PlayerState, sessionId: string) => {
        // 		this.despawnPlayer(player);
        // 	});
        // } else {
        this.resetPlayerObject(this._player);
        this._spawnedRemotes.forEach(function (playerObject) {
            _this.resetPlayerObject(playerObject);
        });
        this._spawnedRemotes.clear();
        // }
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
     * Used only when the local player is the Seeker to retrieve any Hider
     * player objects within distance to the Seeker player.
     */
    GameManager.prototype.getOverlappingHiders = function () {
        var _this = this;
        var overlappingHiders = [];
        this._spawnedRemotes.forEach(function (hider) {
            var forward = _this._player.visualForward();
            var dir = hider.position.subtract(_this._player.position).normalize();
            // Check for Hiders within the field of view of the Seeker by getting the angle between the Seeker's
            // forward vector and the normalized direction vector between the Seeker and the Hider
            var angle = Math.abs(core_1.Vector3.GetAngleBetweenVectors(forward, dir, core_1.Vector3.Forward()));
            // Convert angle to degrees
            angle *= 180 / Math.PI;
            // console.log(`Forward: (${forward.x}, ${forward.y}, ${forward.z})\nDir: (${dir.x}, ${dir.y}, ${dir.z})\nAngle: ${angle}`);
            // If angle falls within the Seekers FOV check if the hider is close enough.
            // If within the check distance the hider is a possible candiate for capture as
            // as they are overlapping with the Seeker capture area.
            if (angle <= _this._halfSeekerFOV && core_1.Vector3.Distance(_this._player.position, hider.position) <= _this.seekerCheckDistance) {
                // console.log(`Overlapping Hider: %o`, hider);
                overlappingHiders.push(hider);
            }
        });
        return overlappingHiders;
    };
    GameManager.prototype.seekerFoundHider = function (hider) {
        // Sending the message to the server is not a guarantee the Hider will be captured by the Seeker.
        // The server will do a final, yet simple, check to see if the Hider is close enough to be considered found.
        var _this = this;
        // Only send a capture message to the server if the hider is not currently captured
        // or if we haven't sent a message in the past 'x' seconds
        if (!hider.isCaptured() && !this._foundHiders.has(hider.sessionId())) {
            // console.log(`Game Manager - Seeker found player: ${hider.sessionId()}`);
            this._foundHiders.set(hider.sessionId(), hider);
            // Send server message
            networkManager_1.default.Instance.sendHiderFound(hider.sessionId());
            // Remove the found hider from the collection after the elapsed time
            // to allow the message to be sent again
            setTimeout(function () {
                _this._foundHiders.delete(hider.sessionId());
            }, this._foundHiderMsgRate);
        }
    };
    GameManager.prototype.reset = function () {
        this.despawnPlayers();
        this.initializeSpawnPoints();
        this.CurrentGameState = GameState_1.GameState.NONE;
        this._foundHiders.clear();
        this._playAgain = false;
    };
    /**
     * Called each frame.
     */
    GameManager.prototype.onUpdate = function () {
        // ...
        // if (!NetworkManager.Instance.Room && InputManager.getKeyUp(32) && !this._joiningRoom) {
        // 	console.log('Join Room');
        // 	this._joiningRoom = true;
        // 	NetworkManager.Instance.joinRoom();
        // } else {
        // if (NetworkManager.Instance.Room && this.CurrentGameState === GameState.GAME_OVER && !this._playAgain && InputManager.getKeyUp(32)) {
        // 	this._playAgain = true;
        // 	this._cameraHolder.setTarget(this._cameraStartPos, this._startChaseSpeed);
        // 	NetworkManager.Instance.sendPlayAgain();
        // }
        // }
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