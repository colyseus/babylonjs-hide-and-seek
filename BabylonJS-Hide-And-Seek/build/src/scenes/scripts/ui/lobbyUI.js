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
exports.LobbyUI = void 0;
var uiController_1 = require("./uiController");
var networkManager_1 = require("../managers/networkManager");
var gameManager_1 = require("../managers/gameManager");
var GameState_1 = require("../GameState");
var LobbyUI = /** @class */ (function (_super) {
    __extends(LobbyUI, _super);
    function LobbyUI(scene, layer) {
        var _this = _super.call(this, 'Lobby', scene, layer) || this;
        _this.onPlayerAdded = _this.onPlayerAdded.bind(_this);
        _this.onPlayerRemoved = _this.onPlayerRemoved.bind(_this);
        _this.returnToTitle = _this.returnToTitle.bind(_this);
        _this.updateHeader = _this.updateHeader.bind(_this);
        _this.playAgain = _this.playAgain.bind(_this);
        _this.onPlayerPlayAgain = _this.onPlayerPlayAgain.bind(_this);
        _this.updateCountdown = _this.updateCountdown.bind(_this);
        _this.initialize();
        return _this;
    }
    LobbyUI.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.initialize.call(this)];
                    case 1:
                        _a.sent();
                        this._playerEntries = new Map();
                        this.setUpControls();
                        networkManager_1.default.Instance.addOnEvent(networkManager_1.NetworkEvent.PLAYER_ADDED, this.onPlayerAdded);
                        networkManager_1.default.Instance.addOnEvent(networkManager_1.NetworkEvent.PLAYER_REMOVED, this.onPlayerRemoved);
                        gameManager_1.default.Instance.addOnEvent('playerPlayAgain', this.onPlayerPlayAgain);
                        gameManager_1.default.Instance.addOnEvent('updateCountdown', this.updateCountdown);
                        return [2 /*return*/];
                }
            });
        });
    };
    LobbyUI.prototype.setUpControls = function () {
        this._playerList = this.getControl('PlayerList');
        this._playerEntryTemplate = this.getControl('PlayerEl');
        this._header = this.getControl('Header');
        this._playerCount = this.getControl('PlayerCount');
        this._roomCode = this.getControl('RoomCode');
        this._gameOverCountdown = this.getControl('GameOverCountdown');
        this._playAgainBtn = this.getControl('PlayAgainBtn');
        this._leaveBtn = this.getControl('LeaveBtn');
        this.updateHeader(gameManager_1.default.Instance.Countdown);
        this.updatePlayerCount();
        this.registerControlHandlers();
        // Hide the template
        this._playerEntryTemplate.isVisible = false;
    };
    LobbyUI.prototype.registerControlHandlers = function () {
        this._playAgainBtn.onPointerClickObservable.add(this.playAgain);
        this._leaveBtn.onPointerClickObservable.add(this.returnToTitle);
    };
    LobbyUI.prototype.setVisible = function (visible) {
        _super.prototype.setVisible.call(this, visible);
        if (visible) {
            var countdown = gameManager_1.default.Instance.Countdown;
            if (!countdown) {
                if (gameManager_1.default.Instance.CurrentGameState === GameState_1.GameState.CLOSE_COUNTDOWN || gameManager_1.default.Instance.CurrentGameState === GameState_1.GameState.NONE) {
                    countdown = networkManager_1.default.Config.PreRoundCountdown / 1000;
                }
                else if (gameManager_1.default.Instance.CurrentGameState === GameState_1.GameState.GAME_OVER) {
                    countdown = networkManager_1.default.Config.GameOverCountdown / 1000;
                }
            }
            if (!countdown) {
                console.trace("Invalid Countdown in Game State ".concat(gameManager_1.default.Instance.CurrentGameState));
            }
            this.updateHeader(countdown);
            this.updatePlayerCount();
            this._roomCode.text = "Room: ".concat(networkManager_1.default.Instance.Room.id);
            this._playAgainBtn.isVisible = gameManager_1.default.Instance.CurrentGameState === GameState_1.GameState.GAME_OVER;
            this._gameOverCountdown.isVisible = gameManager_1.default.Instance.CurrentGameState === GameState_1.GameState.GAME_OVER;
            this._playerCount.isVisible = gameManager_1.default.Instance.CurrentGameState !== GameState_1.GameState.GAME_OVER;
            // GameManager.Instance.addOnEvent('updateCountdown', this.updateCountdown);
        }
        else {
            // GameManager.Instance.removeOnEvent('updateCountdown', this.updateCountdown);
            this._gameOverCountdown.isVisible = false;
        }
    };
    LobbyUI.prototype.clearPlayerList = function () {
        var _this = this;
        this._playerList.getDescendants().forEach(function (control) {
            _this._playerList.removeControl(control);
        });
        this._playerEntries.clear();
    };
    LobbyUI.prototype.updateCountdown = function (countdown) {
        if (gameManager_1.default.Instance.CurrentGameState !== GameState_1.GameState.CLOSE_COUNTDOWN && gameManager_1.default.Instance.CurrentGameState !== GameState_1.GameState.GAME_OVER) {
            return;
        }
        // console.trace(`Lobby UI - Countdown: ${countdown}`);
        this._gameOverCountdown.text = "".concat(countdown);
        //if (GameManager.Instance.CurrentGameState !== GameState.GAME_OVER) {
        this.updateHeader(countdown);
        //}
    };
    LobbyUI.prototype.updateHeader = function (countdown) {
        if (!networkManager_1.default.Config) {
            return;
        }
        if (gameManager_1.default.Instance.CurrentGameState !== GameState_1.GameState.GAME_OVER) {
            this._header.text = networkManager_1.default.PlayerCount < networkManager_1.default.Config.MinPlayers ? "Waiting for Players" : "Game Starting in ".concat(countdown);
        }
        else {
            this._header.text = gameManager_1.default.Instance.SeekerWon() ? "Seeker Wins!" : "Hiders Win!";
        }
    };
    LobbyUI.prototype.updatePlayerCount = function () {
        if (!networkManager_1.default.Config) {
            return;
        }
        this._playerCount.text = "Minimum of ".concat(networkManager_1.default.Config.MinPlayers, " players required (").concat(networkManager_1.default.PlayerCount, "/").concat(networkManager_1.default.Config.MaxPlayers, ")");
    };
    LobbyUI.prototype.onPlayerAdded = function (player) {
        this.addPlayerEntry(player.id, player.id === networkManager_1.default.Instance.Room.sessionId ? 'You' : player.username || player.id);
        this.updatePlayerCount();
    };
    LobbyUI.prototype.onPlayerRemoved = function (player) {
        var control = this._playerEntries.get(player.id);
        if (control) {
            this._playerList.removeControl(control);
        }
        this._playerEntries.delete(player.id);
        this.updatePlayerCount();
        this.updateHeader(gameManager_1.default.Instance.Countdown);
    };
    LobbyUI.prototype.onPlayerPlayAgain = function (player) {
        var sessionId = player.sessionId;
        var playAgain = player.value;
        var playerEntry = this._playerEntries.get(sessionId);
        if (playerEntry) {
            var playAgainCheck = this.getControlChild(playerEntry, 'PlayAgainCheck');
            playAgainCheck.isVisible = playAgain;
        }
    };
    LobbyUI.prototype.returnToTitle = function () {
        this.clearPlayerList();
        this.emit('returnToTitle');
    };
    LobbyUI.prototype.playAgain = function () {
        this.emit('playAgain');
    };
    LobbyUI.prototype.addPlayerEntry = function (sessionId, playerName) {
        var playerEntry = this.cloneControl(this._playerEntryTemplate);
        var playerNameText = this.getControlChild(playerEntry, 'PlayerName');
        playerNameText.text = playerName;
        playerEntry.isVisible = true;
        this._playerList.addControl(playerEntry);
        this._playerEntries.set(sessionId, playerEntry);
    };
    return LobbyUI;
}(uiController_1.UIController));
exports.LobbyUI = LobbyUI;
//# sourceMappingURL=lobbyUI.js.map