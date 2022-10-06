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
var node_1 = require("@babylonjs/core/node");
var decorators_1 = require("../../decorators");
var utility_1 = require("../../utility");
var GameState_1 = require("../GameState");
var GameplayUI_1 = require("../ui/GameplayUI");
var lobbyUI_1 = require("../ui/lobbyUI");
var overlayUI_1 = require("../ui/overlayUI");
var prologueUI_1 = require("../ui/prologueUI");
var statusUI_1 = require("../ui/statusUI");
var titleUI_1 = require("../ui/titleUI");
var gameManager_1 = require("./gameManager");
var networkManager_1 = require("./networkManager");
var UIManager = /** @class */ (function (_super) {
    __extends(UIManager, _super);
    //==========================================
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function UIManager() {
        var _this = this;
        _this._uiLayer = 2;
        // Magic Numbers
        //==========================================
        _this._gameOverDelay = 3000;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    UIManager.prototype.onInitialize = function () {
        // ...
        this.handleJoinRoom = this.handleJoinRoom.bind(this);
        this.handleReturnToTitle = this.handleReturnToTitle.bind(this);
        this.handleGameStateChanged = this.handleGameStateChanged.bind(this);
        this.handleLeftRoom = this.handleLeftRoom.bind(this);
        this.handlePlayAgain = this.handlePlayAgain.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this._engine = this.getEngine();
    };
    /**
     * Called on the node has been fully initialized and is ready.
     */
    UIManager.prototype.onInitialized = function () {
        // ...
        window.onresize = this.onWindowResize;
    };
    /**
     * Called on the scene starts.
     */
    UIManager.prototype.onStart = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // ...
                this.initializeUICamera();
                this.loadUI();
                gameManager_1.default.Instance.addOnEvent('gameStateChanged', this.handleGameStateChanged);
                networkManager_1.default.Instance.addOnEvent(networkManager_1.NetworkEvent.LEFT_ROOM, this.handleLeftRoom);
                return [2 /*return*/];
            });
        });
    };
    UIManager.prototype.initializeUICamera = function () {
        // Create UI camera
        this._camera = new core_1.ArcRotateCamera('UICam', 0, 0.8, 100, core_1.Vector3.Zero(), this._scene);
        this._camera.layerMask = this._uiLayer;
        // Get the UI camera to work with the existing game camera
        this._scene.activeCameras = [this._scene.activeCamera, this._camera];
    };
    UIManager.prototype.loadUI = function () {
        this.loadTitleUI();
        this.loadLobbyUI();
        this.loadPrologueUI();
        this.loadGameplayUI();
        // Load overaly last so it will be rendered on top of everything else
        this.loadOverlayUI();
        this.loadStatsUI();
    };
    UIManager.prototype.loadTitleUI = function () {
        this._titleUI = new titleUI_1.TitleUI(this._scene, this._uiLayer);
        // Subscribe to UI events
        this._titleUI.addListener('joinRoom', this.handleJoinRoom);
    };
    UIManager.prototype.loadOverlayUI = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._overlayUI = new overlayUI_1.OverlayUI(this._scene, this._uiLayer);
                        _a.label = 1;
                    case 1:
                        if (!!this._overlayUI.loaded()) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, utility_1.delay)(100)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        this._overlayUI.setVisible(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    UIManager.prototype.loadLobbyUI = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._lobbyUI = new lobbyUI_1.LobbyUI(this._scene, this._uiLayer);
                        this._lobbyUI.addListener('returnToTitle', this.handleReturnToTitle);
                        this._lobbyUI.addListener('playAgain', this.handlePlayAgain);
                        _a.label = 1;
                    case 1:
                        if (!!this._lobbyUI.loaded()) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, utility_1.delay)(100)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        this._lobbyUI.setVisible(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    UIManager.prototype.loadPrologueUI = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._prologueUI = new prologueUI_1.PrologueUI(this._scene, this._uiLayer);
                        _a.label = 1;
                    case 1:
                        if (!!this._lobbyUI.loaded()) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, utility_1.delay)(100)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        this._prologueUI.setVisible(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    UIManager.prototype.loadGameplayUI = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._gameplayUI = new GameplayUI_1.GameplayUI(this._scene, this._uiLayer);
                        _a.label = 1;
                    case 1:
                        if (!!this._gameplayUI.loaded()) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, utility_1.delay)(100)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3:
                        this._gameplayUI.setVisible(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    UIManager.prototype.loadStatsUI = function () {
        var _this = this;
        this._statUI = new statusUI_1.StatsUI(this._scene, this._uiLayer);
        this._scene.registerBeforeRender(function () {
            _this._statUI.setFPSValue(_this._engine.getFps().toFixed());
        });
    };
    UIManager.prototype.handleJoinRoom = function (roomId) {
        if (roomId === void 0) { roomId = null; }
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._overlayUI.setVisible(true);
                        this._titleUI.setJoinUIEnabled(false);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        // Attempt to join the room
                        return [4 /*yield*/, gameManager_1.default.Instance.joinRoom(roomId)];
                    case 2:
                        // Attempt to join the room
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!!networkManager_1.default.Ready()) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, utility_1.delay)(100)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 5:
                        console.log("Config: %o", networkManager_1.default.Config); //
                        this._titleUI.setVisible(false);
                        this._lobbyUI.setVisible(true);
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error(error_1.stack);
                        if (roomId) {
                            this._titleUI.joinFailed(error_1.message);
                        }
                        return [3 /*break*/, 7];
                    case 7:
                        this._titleUI.setJoinUIEnabled(true);
                        this._overlayUI.setVisible(false);
                        _a.label = 8;
                    case 8:
                        if (!!gameManager_1.default.Instance.Countdown) return [3 /*break*/, 10];
                        return [4 /*yield*/, (0, utility_1.delay)(100)];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 10:
                        console.log("UI Manager - Handle Join Room - update countdown: ".concat(gameManager_1.default.Instance.Countdown));
                        this._lobbyUI.updateCountdown(gameManager_1.default.Instance.Countdown);
                        return [2 /*return*/];
                }
            });
        });
    };
    UIManager.prototype.handleLeftRoom = function () {
        this._lobbyUI.clearPlayerList();
        this._lobbyUI.setVisible(false);
        this._gameplayUI.setVisible(false);
        this._titleUI.setVisible(true);
    };
    UIManager.prototype.handleReturnToTitle = function () {
        this._lobbyUI.setVisible(false);
        this._titleUI.setVisible(true);
        networkManager_1.default.Instance.leaveRoom();
    };
    UIManager.prototype.handlePlayAgain = function () {
        networkManager_1.default.Instance.sendPlayAgain();
        this._lobbyUI.setVisible(true);
    };
    UIManager.prototype.handleGameStateChanged = function (gameState) {
        var _this = this;
        switch (gameState) {
            case GameState_1.GameState.NONE:
                break;
            case GameState_1.GameState.WAIT_FOR_MINIMUM:
                if (networkManager_1.default.Ready()) {
                    this._lobbyUI.setVisible(true);
                }
                break;
            case GameState_1.GameState.CLOSE_COUNTDOWN:
                if (networkManager_1.default.Ready()) {
                    this._lobbyUI.setVisible(true);
                }
                break;
            case GameState_1.GameState.INITIALIZE:
                break;
            case GameState_1.GameState.PROLOGUE:
                this._lobbyUI.setVisible(false);
                this._prologueUI.setVisible(true);
                break;
            case GameState_1.GameState.SCATTER:
                if (!gameManager_1.default.Instance.PlayerIsSeeker()) {
                    this._prologueUI.setVisible(true);
                    this._prologueUI.shouldUpdatedCountdown = false;
                    // this._prologueUI.setCountdownText('Scatter!');
                }
                this._prologueUI.showInfo(false);
                this._prologueUI.showCountdown(gameManager_1.default.Instance.PlayerIsSeeker());
                break;
            case GameState_1.GameState.HUNT:
                this._prologueUI.setVisible(false);
                this._gameplayUI.setVisible(true);
                break;
            case GameState_1.GameState.GAME_OVER:
                this._gameplayUI.setVisible(false);
                setTimeout(function () {
                    _this._lobbyUI.setVisible(true);
                }, this._gameOverDelay);
                break;
            default:
                break;
        }
    };
    UIManager.prototype.onWindowResize = function () {
        console.log("Window Resized!");
    };
    /**
     * Called each frame.
     */
    UIManager.prototype.onUpdate = function () {
        // ...
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    UIManager.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    UIManager.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    __decorate([
        (0, decorators_1.visibleInInspector)('number', 'UI Layer', 2)
    ], UIManager.prototype, "_uiLayer", void 0);
    return UIManager;
}(node_1.Node));
exports.default = UIManager;
//# sourceMappingURL=uiManager.js.map