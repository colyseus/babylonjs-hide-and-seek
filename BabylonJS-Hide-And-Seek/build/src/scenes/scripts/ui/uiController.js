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
exports.UIController = void 0;
var core_1 = require("@babylonjs/core");
var gui_1 = require("@babylonjs/gui");
var EventEmitter = require("events");
var UIController = /** @class */ (function (_super) {
    __extends(UIController, _super);
    function UIController(uiName, scene, layer) {
        var _this = _super.call(this) || this;
        _this._root = null;
        _this._uiName = uiName;
        _this._scene = scene;
        _this._uiLayer = layer;
        return _this;
    }
    UIController.prototype.loaded = function () {
        return this._root !== null;
    };
    UIController.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.loadGUI(this._uiName)];
                    case 1:
                        _a._uiTex = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UIController.prototype.loadGUI = function (guiName) {
        return __awaiter(this, void 0, void 0, function () {
            var uiTex, path, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        uiTex = gui_1.AdvancedDynamicTexture.CreateFullscreenUI("".concat(this._uiName, "-UI"), true, this._scene, core_1.Texture.TRILINEAR_SAMPLINGMODE, true);
                        uiTex.layer.layerMask = this._uiLayer;
                        path = "".concat(process.env.GUI_PATH).concat(guiName, ".gui");
                        return [4 /*yield*/, uiTex.parseFromURLAsync(path)];
                    case 1:
                        _a.sent();
                        // Get UI root component
                        this._root = uiTex.getControlByName('Root');
                        return [2 /*return*/, uiTex];
                    case 2:
                        error_1 = _a.sent();
                        console.log("Error loading ".concat(guiName, " UI: ").concat(error_1.stack));
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UIController.prototype.getControl = function (name) {
        return this._uiTex.getControlByName(name);
    };
    UIController.prototype.cloneControl = function (control) {
        var serialized = {};
        control.serialize(serialized);
        return gui_1.Grid.Parse(serialized, null);
    };
    UIController.prototype.getControlChild = function (control, childName) {
        return control.getDescendants(false, function (ctrl) { return ctrl.name === childName; })[0];
    };
    UIController.prototype.setVisible = function (visible) {
        if (!this._root) {
            console.error("".concat(this._uiName, " UI - can't setVisible - No \"Root\" defined"));
            return;
        }
        this._root.isVisible = visible;
    };
    return UIController;
}(EventEmitter));
exports.UIController = UIController;
//# sourceMappingURL=uiController.js.map