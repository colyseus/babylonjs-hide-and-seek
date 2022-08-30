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
exports.TitleUI = void 0;
var uiController_1 = require("./uiController");
var TitleUI = /** @class */ (function (_super) {
    __extends(TitleUI, _super);
    function TitleUI(scene, layer) {
        var _this = _super.call(this, 'Title', scene, layer) || this;
        _this.handleQuickPlay = _this.handleQuickPlay.bind(_this);
        _this.handleJoin = _this.handleJoin.bind(_this);
        _this.handleJoinSubmit = _this.handleJoinSubmit.bind(_this);
        _this.handleCancleJoin = _this.handleCancleJoin.bind(_this);
        _this.initialize();
        return _this;
    }
    TitleUI.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.initialize.call(this)];
                    case 1:
                        _a.sent();
                        this.setUpControls();
                        return [2 /*return*/];
                }
            });
        });
    };
    TitleUI.prototype.setUpControls = function () {
        this._quickPlayBtn = this.getControl('QuickPlayBtn');
        this._joinBtn = this.getControl('JoinBtn');
        this._gameOptions = this.getControl('GameOptions');
        this._joinUI = this.getControl('JoinRoom');
        this._joinInput = this.getControl('JoinInput');
        this._joinSubmit = this.getControl('JoinSubmit');
        this._joinErrorText = this.getControl('JoinErrorText');
        this._cancelJoin = this.getControl('CancelJoin');
        this._joinUI.isVisible = false;
        this._joinErrorText.text = '';
        this.registerControlHandlers();
    };
    TitleUI.prototype.registerControlHandlers = function () {
        this._quickPlayBtn.onPointerClickObservable.add(this.handleQuickPlay);
        this._joinBtn.onPointerClickObservable.add(this.handleJoin);
        this._joinSubmit.onPointerClickObservable.add(this.handleJoinSubmit);
        this._cancelJoin.onPointerClickObservable.add(this.handleCancleJoin);
    };
    TitleUI.prototype.setVisible = function (visible) {
        _super.prototype.setVisible.call(this, visible);
        if (visible) {
            this.handleCancleJoin();
        }
    };
    TitleUI.prototype.handleQuickPlay = function () {
        this.emit('joinRoom');
    };
    TitleUI.prototype.joinFailed = function (error) {
        this._joinErrorText.text = error;
    };
    TitleUI.prototype.setJoinUIEnabled = function (enabled) {
        this._joinInput.isEnabled = enabled;
        this._joinSubmit.isEnabled = enabled;
        this._cancelJoin.isEnabled = enabled;
        this._quickPlayBtn.isEnabled = enabled;
        this._joinBtn.isEnabled = enabled;
    };
    TitleUI.prototype.handleJoin = function () {
        this._joinErrorText.text = '';
        this._joinInput.text = '';
        this._joinUI.isVisible = true;
        this._gameOptions.isVisible = false;
    };
    TitleUI.prototype.handleJoinSubmit = function () {
        this._joinErrorText.text = '';
        var roomCode = this._joinInput.text.trim();
        if (!roomCode || roomCode.length === 0) {
            this._joinErrorText.text = 'Invalid room code';
            return;
        }
        this.emit('joinRoom', roomCode);
    };
    TitleUI.prototype.handleCancleJoin = function () {
        this._joinUI.isVisible = false;
        this._gameOptions.isVisible = true;
    };
    return TitleUI;
}(uiController_1.UIController));
exports.TitleUI = TitleUI;
//# sourceMappingURL=titleUI.js.map