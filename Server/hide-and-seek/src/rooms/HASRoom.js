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
exports.HASRoom = void 0;
var colyseus_1 = require("colyseus");
var HASRoomState_1 = require("./schema/HASRoomState");
var PlayerState_1 = require("./schema/PlayerState");
var logger = require('../helpers/logger');
var HASRoom = /** @class */ (function (_super) {
    __extends(HASRoom, _super);
    function HASRoom(presence) {
        var _this = _super.call(this, presence) || this;
        _this.movementSpeed = 600;
        _this.bindHandlers();
        return _this;
    }
    HASRoom.prototype.bindHandlers = function () {
        this.handlePlayerInput = this.handlePlayerInput.bind(this);
    };
    HASRoom.prototype.onCreate = function (options) {
        var _this = this;
        this.setState(new HASRoomState_1.HASRoomState());
        logger.info("*********************** HIDE AND SEEK ROOM (".concat(this.roomId, ") CREATED ***********************"));
        logger.info("Options: %o", options);
        logger.info('**************************************************************************');
        this.maxClients = 8;
        this.registerMessageHandlers();
        // Set the frequency patch updates are sent to clients
        this.setPatchRate(16);
        // Set the Simulation Interval callback (server-side game loop)
        this.setSimulationInterval(function (dt) {
            _this.state.update(dt / 1000);
        });
    };
    HASRoom.prototype.onJoin = function (client, options) {
        logger.silly("*** On Client Join - ".concat(client.sessionId, " ***"));
        // Create a new instance of NetworkedEntityState for this client and assign initial state values
        var player = new PlayerState_1.PlayerState(this).assign({
            id: client.id,
            // timestamp: this.state.serverTime,
            username: options.username,
        });
        // Add the player to the collection;
        // This will trigger the OnAdd event of the state's "players" collection on the client
        // and the client will spawn a character object for this use.
        this.state.players.set(client.sessionId, player);
    };
    HASRoom.prototype.onLeave = function (client, consented) {
        return __awaiter(this, void 0, void 0, function () {
            var newClient, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (consented) {
                            throw new Error('consented leave!');
                        }
                        logger.info("let's wait for reconnection for client: " + client.sessionId);
                        return [4 /*yield*/, this.allowReconnection(client, 3)];
                    case 1:
                        newClient = _a.sent();
                        logger.info('reconnected! client: ' + newClient.sessionId);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        logger.info('disconnected! client: ' + client.sessionId);
                        logger.silly("*** Removing player ".concat(client.sessionId, " ***"));
                        //remove user
                        this.state.players.delete(client.sessionId);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    HASRoom.prototype.onDispose = function () {
        console.log('room', this.roomId, 'disposing...');
    };
    HASRoom.prototype.registerMessageHandlers = function () {
        this.onMessage('playerInput', this.handlePlayerInput);
    };
    HASRoom.prototype.handlePlayerInput = function (client, directions) {
        if (directions.length < 3) {
            logger.error("Handle Player Input - Invalid length (".concat(directions.length, ") for 'directions': %o"), directions);
            return;
        }
        logger.debug("Player (".concat(client.sessionId, ") Input: (").concat(directions[0], ", ").concat(directions[1], ", ").concat(directions[2], ")"));
        // Calculate the player's velocity and send back to the client
        // let velocity: number[] = [directions[0], directions[1], directions[2]];
        // const deltaTime: number = this.state.deltaTime;
        // velocity[0] *= this.movementSpeed * deltaTime;
        // velocity[1] *= this.movementSpeed * deltaTime;
        // velocity[2] *= this.movementSpeed * deltaTime;
        // const velocityChange: VelocityChangeMessage = new VelocityChangeMessage(client.sessionId, velocity);
        // client.send('velocityChange', velocityChange);
        var playerState = this.state.players.get(client.sessionId);
        if (playerState) {
            playerState.setMovementDirection(directions);
        }
        else {
            logger.error("Failed to retrieve Player State for ".concat(client.sessionId));
        }
    };
    return HASRoom;
}(colyseus_1.Room));
exports.HASRoom = HASRoom;
//# sourceMappingURL=HASRoom.js.map