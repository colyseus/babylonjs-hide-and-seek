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
var node_1 = require("@babylonjs/core/node");
var Colyseus = require("colyseus.js");
var NetworkManager = /** @class */ (function (_super) {
    __extends(NetworkManager, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function NetworkManager() {
        var _this = this;
        _this._serverSettings = null;
        _this._client = null;
        _this._room = null;
        return _this;
    }
    Object.defineProperty(NetworkManager, "Instance", {
        get: function () {
            return NetworkManager._instance;
        },
        enumerable: false,
        configurable: true
    });
    NetworkManager.prototype.getColyseusServerAddress = function () {
        var _a;
        return ((_a = this._serverSettings) === null || _a === void 0 ? void 0 : _a.colyseusServerAddress) || 'localhost';
    };
    NetworkManager.prototype.setColyseusServerAddress = function (value) {
        this._serverSettings.colyseusServerAddress = value;
    };
    NetworkManager.prototype.getColyseusServerPort = function () {
        var _a;
        return ((_a = this._serverSettings) === null || _a === void 0 ? void 0 : _a.colyseusServerPort) || 2567;
    };
    NetworkManager.prototype.setColyseusServerPort = function (value) {
        this._serverSettings.colyseusServerPort = value;
    };
    Object.defineProperty(NetworkManager.prototype, "ColyseusUseSecure", {
        get: function () {
            var _a;
            return ((_a = this._serverSettings) === null || _a === void 0 ? void 0 : _a.useSecureProtocol) || false;
        },
        set: function (value) {
            this._serverSettings.useSecureProtocol = value;
        },
        enumerable: false,
        configurable: true
    });
    NetworkManager.prototype.WebSocketEndPoint = function () {
        return "".concat(this.ColyseusUseSecure ? 'wss' : 'ws', "://").concat(this.getColyseusServerAddress(), ":").concat(this.getColyseusServerPort());
    };
    NetworkManager.prototype.WebRequestEndPoint = function () {
        return "".concat(this.ColyseusUseSecure ? 'https' : 'http', "://").concat(this.getColyseusServerAddress(), ":").concat(this.getColyseusServerPort());
    };
    Object.defineProperty(NetworkManager.prototype, "Room", {
        get: function () {
            return this._room;
        },
        set: function (value) {
            this._room = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    NetworkManager.prototype.onInitialize = function () {
        // ...
        NetworkManager._instance = this;
        console.log("Network Manager - On Initialize - Create Colyseus Client with URL: ".concat(this.WebSocketEndPoint()));
        this._client = new Colyseus.Client(this.WebSocketEndPoint());
        this.bindHandlers();
    };
    NetworkManager.prototype.bindHandlers = function () {
        this.handleMessages = this.handleMessages.bind(this);
    };
    /**
     * Called on the scene starts.
     */
    NetworkManager.prototype.onStart = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**
     * Called each frame.
     */
    NetworkManager.prototype.onUpdate = function () {
        // ...
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    NetworkManager.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    NetworkManager.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    NetworkManager.prototype.joinRoom = function (roomId) {
        if (roomId === void 0) { roomId = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.joinRoomWithId(roomId)];
                    case 1:
                        _a.Room = _b.sent();
                        if (this.Room) {
                            console.log("Joined Room: ".concat(this.Room.id));
                            this.onJoinedRoom(this.Room.id);
                        }
                        this.registerRoomHandlers();
                        return [2 /*return*/];
                }
            });
        });
    };
    NetworkManager.prototype.joinRoomWithId = function (roomId) {
        if (roomId === void 0) { roomId = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!roomId) return [3 /*break*/, 2];
                        console.log("Join room with id: ".concat(roomId));
                        return [4 /*yield*/, this._client.joinById(roomId)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        console.log("Join or create room");
                        return [4 /*yield*/, this._client.joinOrCreate('HAS_room')];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.error(error_1.stack);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    NetworkManager.prototype.registerRoomHandlers = function () {
        var _this = this;
        console.log("Register Room Handlers");
        if (this.Room) {
            // this.Room.onLeave.once(this.onLeaveGridRoom);
            // this.Room.onStateChange.once(this.onRoomStateChange);
            // this.Room.state.networkedUsers.onAdd = MMOManager.Instance.onAddNetworkedUser;
            // this.Room.state.networkedUsers.onRemove = MMOManager.Instance.onRemoveNetworkedUser;
            // this.Room.onMessage<ObjectUseMessage>('objectUsed', (msg) => {
            // 	this.awaitObjectInteraction(msg.interactedObjectID, msg.interactingStateID);
            // });
            // this.Room.onMessage<MovedToGridMessage>('movedToGrid', (msg) => {
            // 	this.onMovedToGrid(msg);
            // });
            this.Room.onLeave.once(function (code) {
                _this.Room = null;
                _this.onLeftRoom(code);
            });
            this.Room.state.players.onAdd = this.onPlayerAdded;
            this.Room.state.players.onRemove = this.onPlayerRemoved;
            this.Room.state.gameState.onChange = this.onGameStateChange;
            this.Room.onMessage('*', this.handleMessages);
        }
        else {
            console.error("Cannot register room handlers; room is null!");
        }
    };
    NetworkManager.prototype.unregisterRoomHandlers = function () {
        if (this.Room) {
            this.Room.state.players.onAdd = null;
            this.Room.state.players.onRemove = null;
            this.Room.state.gameState.onChange = null;
        }
    };
    // public sendPlayerDirectionInput(velocity: Vector3, position: Vector3) {
    // 	if (!this.Room) {
    // 		return;
    // 	}
    // 	const inputMsg: PlayerInputMessage = new PlayerInputMessage(this.Room.sessionId, [velocity.x, velocity.y, velocity.z], [position.x, position.y, position.z]);
    // 	this.Room.send('playerInput', inputMsg);
    // }
    NetworkManager.prototype.sendPlayerPosition = function (positionMsg) {
        this.Room.send('playerInput', positionMsg);
    };
    // private playerAdded(item: PlayerState, key: string) {
    // 	//
    // 	if (this.onPlayerAdded) {
    // 		this.onPlayerAdded(item, key);
    // 	}
    // }
    NetworkManager.prototype.handleMessages = function (name, message) {
        // switch (name) {
        // 	case 'velocityChange':
        // 		this.handleVelocityChange(message);
        // }
    };
    NetworkManager._instance = null;
    return NetworkManager;
}(node_1.Node));
exports.default = NetworkManager;
//# sourceMappingURL=networkManager.js.map