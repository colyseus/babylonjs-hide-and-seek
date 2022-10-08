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
var inputManager_1 = require("../managers/inputManager");
var CapturedVFX = /** @class */ (function (_super) {
    __extends(CapturedVFX, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function CapturedVFX() {
        var _this = this;
        _this._play = false;
        _this._maxChainSpeed = 5;
        _this._minChainSpeed = 1;
        _this._chainSpinSpeed = 1;
        _this._chainLerpTime = 2000;
        _this._haloPunchTime = 1500;
        _this._chainFadeTime = 1000;
        _this._rescuePunchTime = 1000;
        _this.debugPlay = true;
        _this.debugRescue = true;
        _this.debugStop = true;
        _this._playingCaptured = false;
        _this._playerRescued = false;
        return _this;
    }
    CapturedVFX.prototype.playingFX = function () {
        return this._playingCaptured || this._playerRescued;
    };
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    CapturedVFX.prototype.onInitialize = function () {
        // ...
        // this.onEnabledStateChange = this.onEnabledStateChange.bind(this);
    };
    /**
     * Called on the node has been fully initialized and is ready.
     */
    CapturedVFX.prototype.onInitialized = function () {
        // ...
        this._meshes = [];
    };
    /**
     * Called on the scene starts.
     */
    CapturedVFX.prototype.onStart = function () {
        // this.onEnabledStateChangedObservable.add(this.onEnabledStateChange);
        this._meshes = this.getChildMeshes();
        this._emitter.isPickable = false;
        this._particlesPrefab.stop();
        this._particlesPrefab.reset();
        this._particles = this._particlesPrefab.clone("captured-".concat(this._scene.getUniqueId()), this._emitter);
        this._particles.stop();
        this._particles.reset();
        this.stop();
    };
    // private onEnabledStateChange(enabled: boolean) {
    // 	if (enabled) {
    // 		this.playCaptured();
    // 	} else {
    // 		this.stop();
    // 	}
    // }
    CapturedVFX.prototype.fixMeshes = function () {
        for (var i = 0; i < this._meshes.length; i++) {
            this._meshes[i].setEnabled(true);
            this._meshes[i].isVisible = true;
        }
        this._emitter.isVisible = false;
    };
    CapturedVFX.prototype.playCaptured = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.playingFX()) {
                            console.warn("Can't player captured FX - already playing");
                            return [2 /*return*/];
                        }
                        console.log("Play Captured FX");
                        this.fixMeshes();
                        this.setEnabled(true);
                        this._play = true;
                        this._playingCaptured = true;
                        this.punchHaloScaleIn(this._haloPunchTime);
                        return [4 /*yield*/, (0, utility_1.delay)(this._haloPunchTime * 0.6)];
                    case 1:
                        _a.sent();
                        this.lerpChainSpeed(this._chainLerpTime);
                        this.fadeChainsIn(this._chainFadeTime);
                        setTimeout(function () {
                            _this._playingCaptured = false;
                        }, this._chainLerpTime + 200);
                        // Run partciles briefly
                        //===========================
                        this._particles.start();
                        return [4 /*yield*/, (0, utility_1.delay)(200)];
                    case 2:
                        _a.sent();
                        this._particles.stop();
                        return [2 /*return*/];
                }
            });
        });
    };
    CapturedVFX.prototype.playRescued = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.playingFX()) {
                            return [2 /*return*/];
                        }
                        console.log("Play Rescue FX");
                        this.fixMeshes();
                        this._playerRescued = true;
                        this.punchFXOut(this._rescuePunchTime);
                        return [4 /*yield*/, (0, utility_1.delay)(this._rescuePunchTime / 2)];
                    case 1:
                        _a.sent();
                        setTimeout(function () {
                            _this._playerRescued = false;
                        }, this._rescuePunchTime + 200);
                        // Run partciles briefly
                        //===========================
                        this._particles.start();
                        return [4 /*yield*/, (0, utility_1.delay)(200)];
                    case 2:
                        _a.sent();
                        this._particles.stop();
                        //===========================
                        this.stop();
                        return [2 /*return*/];
                }
            });
        });
    };
    CapturedVFX.prototype.stop = function () {
        console.log("Capture FX STOP");
        this.resetFX();
        this._particles.stop();
        this._play = false;
    };
    CapturedVFX.prototype.resetFX = function () {
        this.setScale(new core_1.Vector3(1, 1, 1));
        this.setHaloScale(core_1.Vector3.Zero());
        this.setChainVisibility(0);
    };
    CapturedVFX.prototype.punchHaloScaleIn = function (time) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, zero, one, elapsed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        zero = core_1.Vector3.Zero();
                        one = new core_1.Vector3(1, 1, 1);
                        elapsed = 0;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, utility_1.delay)(gameManager_1.default.DeltaTime)];
                    case 2:
                        _a.sent();
                        elapsed = (0, utility_1.clamp)(Date.now() - startTime, 0, time);
                        this.setHaloScale(core_1.Vector3.Lerp(zero, one, utility_1.Easing.easeOutBounce(elapsed / time)));
                        if (elapsed >= time) {
                            return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CapturedVFX.prototype.lerpChainSpeed = function (time) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, elapsed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        elapsed = 0;
                        this._chainSpinSpeed = this._maxChainSpeed;
                        _a.label = 1;
                    case 1:
                        if (!(this._chainSpinSpeed !== this._minChainSpeed)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, utility_1.delay)(gameManager_1.default.DeltaTime)];
                    case 2:
                        _a.sent();
                        elapsed = (0, utility_1.clamp)(Date.now() - startTime, 0, time);
                        this._chainSpinSpeed = (0, utility_1.lerpNumber)(this._maxChainSpeed, this._minChainSpeed, utility_1.Easing.easeInCirc(elapsed / time));
                        if (elapsed >= time) {
                            return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CapturedVFX.prototype.fadeChainsIn = function (time) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, elapsed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        elapsed = 0;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, utility_1.delay)(gameManager_1.default.DeltaTime)];
                    case 2:
                        _a.sent();
                        elapsed = (0, utility_1.clamp)(Date.now() - startTime, 0, time);
                        this.setChainVisibility((0, utility_1.lerpNumber)(0, 1, utility_1.Easing.easeOutBounce(elapsed / time)));
                        if (elapsed >= time) {
                            return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CapturedVFX.prototype.punchFXOut = function (time) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, zero, one, elapsed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        zero = core_1.Vector3.Zero();
                        one = new core_1.Vector3(1, 1, 1);
                        elapsed = 0;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, utility_1.delay)(gameManager_1.default.DeltaTime)];
                    case 2:
                        _a.sent();
                        elapsed = (0, utility_1.clamp)(Date.now() - startTime, 0, time);
                        this.setScale(core_1.Vector3.Lerp(one, zero, utility_1.Easing.easeOutBounce(elapsed / time)));
                        if (elapsed >= time) {
                            return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CapturedVFX.prototype.setHaloScale = function (scale) {
        this._halo.scaling = scale;
    };
    CapturedVFX.prototype.setScale = function (scale) {
        this.scaling = scale;
    };
    CapturedVFX.prototype.setChainVisibility = function (vis) {
        this._center.visibility = this._innerChains.visibility = this._outerChains.visibility = vis;
    };
    /**
     * Called each frame.
     */
    CapturedVFX.prototype.onUpdate = function () {
        var _this = this;
        if (inputManager_1.default.getKey(13) && this.debugPlay) {
            this.debugPlay = false;
            this.stop();
            this.playCaptured();
            setTimeout(function () {
                _this.debugPlay = true;
            }, 2000);
        }
        if (inputManager_1.default.getKey(8) && this.debugRescue) {
            this.debugRescue = false;
            this.playRescued();
            setTimeout(function () {
                _this.debugRescue = true;
            }, 2000);
        }
        if (inputManager_1.default.getKey(32) && this.debugStop) {
            this.debugStop = false;
            this.stop();
            setTimeout(function () {
                _this.debugStop = true;
            }, 1000);
        }
        if (!this._play) {
            return;
        }
        this._innerChains.rotate(core_1.Vector3.Forward(), this._chainSpinSpeed * gameManager_1.default.DeltaTime);
        this._outerChains.rotate(core_1.Vector3.Forward(), -this._chainSpinSpeed * gameManager_1.default.DeltaTime);
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    CapturedVFX.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    CapturedVFX.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    __decorate([
        (0, decorators_1.fromChildren)('pumpkin')
    ], CapturedVFX.prototype, "_center", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('inner-chains')
    ], CapturedVFX.prototype, "_innerChains", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('outer-chains')
    ], CapturedVFX.prototype, "_outerChains", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('halo')
    ], CapturedVFX.prototype, "_halo", void 0);
    __decorate([
        (0, decorators_1.fromParticleSystems)('captured')
    ], CapturedVFX.prototype, "_particlesPrefab", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('emitter')
    ], CapturedVFX.prototype, "_emitter", void 0);
    return CapturedVFX;
}(core_1.Mesh));
exports.default = CapturedVFX;
//# sourceMappingURL=capturedVFX.js.map