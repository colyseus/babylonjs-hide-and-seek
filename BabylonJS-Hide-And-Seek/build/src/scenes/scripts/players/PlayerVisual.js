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
var decorators_1 = require("../../decorators");
var utility_1 = require("../../utility");
var gameManager_1 = require("../managers/gameManager");
var mudPrints_1 = require("./mudPrints");
var PlayerVisual = /** @class */ (function (_super) {
    __extends(PlayerVisual, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function PlayerVisual() {
        var _this = this;
        _this._target = null;
        _this._lerpSpeed = 10;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    PlayerVisual.prototype.onInitialize = function () {
        // ...
    };
    /**
     * Called on the node has been fully initialized and is ready.
     */
    PlayerVisual.prototype.onInitialized = function () {
        // ...
        this._mudPrints = new mudPrints_1.MudPrints(this, this._mudPrint);
        this._visualMeshes = [];
    };
    /**
     * Called on the scene starts.
     */
    PlayerVisual.prototype.onStart = function () {
        // ...
        this.setEnabled(false);
        // this.setCaptured(false);
        this._prevDir = this.forward;
        this._currentDir = this.forward;
        this._captured.setEnabled(true);
    };
    PlayerVisual.prototype.playingCapturedVFX = function () {
        return this._captured.playingFX();
    };
    PlayerVisual.prototype.setPlayerReference = function (player) {
        var _a;
        this.player = player;
        (_a = this._capturedTrigger) === null || _a === void 0 ? void 0 : _a.setPlayerReference(player);
    };
    PlayerVisual.prototype.setVisual = function (visual) {
        visual.setParent(this);
        visual.position = core_1.Vector3.Zero();
        visual.rotation = core_1.Vector3.Zero();
        visual.setEnabled(true);
        this._visualMeshes = visual.getChildMeshes();
    };
    PlayerVisual.prototype.setTriggerSize = function (size) {
        var _a;
        (_a = this._capturedTrigger) === null || _a === void 0 ? void 0 : _a.setTriggerSize(size);
    };
    PlayerVisual.prototype.setTarget = function (player) {
        this._target = player;
    };
    PlayerVisual.prototype.setLookTargetDirection = function (direction) {
        this._targetLookDirection = core_1.Vector3.Normalize(direction);
    };
    PlayerVisual.prototype.setPickable = function (isPickable) {
        this.isPickable = isPickable;
        this.getChildMeshes().forEach(function (mesh) {
            mesh.isPickable = isPickable;
        });
    };
    PlayerVisual.prototype.setVisibility = function (visible) {
        var _this = this;
        this.isVisible = visible;
        this.getChildMeshes().forEach(function (mesh) {
            if (mesh === _this._capturedTrigger) {
                return;
            }
            mesh.isVisible = visible;
        });
    };
    PlayerVisual.prototype.setCaptured = function (captured) {
        if (captured) {
            this._captured.playCaptured();
        }
        else {
            this._captured.playRescued();
        }
        this.updateVisibilityForCaptureState(captured);
    };
    PlayerVisual.prototype.updateVisibilityForCaptureState = function (captured) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                for (i = 0; i < this._visualMeshes.length; i++) {
                    this._visualMeshes[i].visibility = captured ? 0.6 : 1;
                }
                return [2 /*return*/];
            });
        });
    };
    PlayerVisual.prototype.registerPlayerMeshForIntersection = function (mesh) {
        this._capturedTrigger.registerMeshForIntersection(mesh);
    };
    PlayerVisual.prototype.toggleMudPrints = function (enabled, runTime) {
        if (runTime === void 0) { runTime = -1; }
        enabled ? this._mudPrints.start(runTime) : this._mudPrints.stop();
    };
    /**
     * Called each frame.
     */
    PlayerVisual.prototype.onUpdate = function () {
        // ...
        // Position the visual with its target
        if (this._target) {
            this.setAbsolutePosition(this._target.getAbsolutePosition());
        }
        if (this._targetLookDirection) {
            this.rotateToTargetDirection();
        }
        this._mudPrints.update();
    };
    PlayerVisual.prototype.rotateToTargetDirection = function () {
        // this.setDirection(this._targetLookDirection);
        var angle = utility_1.Vec3.SignedAngle(this.forward, this._targetLookDirection, core_1.Vector3.Up());
        // console.log(`Angle between Forward (${this.forward.x}, ${this.forward.y}, ${this.forward.z}) and Target (${this._targetLookDirection.x}, ${this._targetLookDirection.y}, ${this._targetLookDirection.z}):  %o`, angle);
        var absAngle = Math.abs(angle);
        var turnDirection = 0;
        if (absAngle < 5) {
            this.setDirection(this._targetLookDirection);
        }
        else {
            // If the angle 180 randomize which direction the visual will rotate
            if (absAngle === 180) {
                turnDirection = (0, utility_1.random)(1, 100) < 50 ? -1 : 1;
            }
            else {
                turnDirection = Math.sign(angle);
            }
            this.rotate(core_1.Vector3.Up(), gameManager_1.default.DeltaTime * this._lerpSpeed * turnDirection);
        }
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    PlayerVisual.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    PlayerVisual.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    __decorate([
        (0, decorators_1.fromChildren)('Captured')
    ], PlayerVisual.prototype, "_captured", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('RescueMesh')
    ], PlayerVisual.prototype, "rescueMesh", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('CapturedTrigger')
    ], PlayerVisual.prototype, "_capturedTrigger", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('MudPrint')
    ], PlayerVisual.prototype, "_mudPrint", void 0);
    return PlayerVisual;
}(core_1.Mesh));
exports.default = PlayerVisual;
//# sourceMappingURL=playerVisual.js.map