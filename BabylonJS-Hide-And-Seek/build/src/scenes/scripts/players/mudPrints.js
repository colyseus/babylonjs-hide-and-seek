"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MudPrints = void 0;
var core_1 = require("@babylonjs/core");
var utility_1 = require("../../utility");
var MudPrints = /** @class */ (function () {
    function MudPrints(playerVisual, printPrefab) {
        this._enabled = false;
        this._foot = 1;
        this._playerVisual = playerVisual;
        this._printPrefab = printPrefab;
        this._lastPos = new core_1.Vector3().copyFrom(this._playerVisual.position);
        this._pooledPrints = [];
        this._livePrints = new Map();
        this.stop = this.stop.bind(this);
        this.poolPrints();
    }
    MudPrints.prototype.start = function (runTime) {
        if (runTime === void 0) { runTime = -1; }
        this._enabled = true;
        // Update last position
        this._lastPos.copyFrom(this._playerVisual.position);
        // If a runtime is provided clear any existing timer and create a new timer that will stop mud prints from spawning
        if (runTime > 0) {
            if (this._delayStop) {
                clearTimeout(this._delayStop);
                this._delayStop = null;
            }
            this._delayStop = setTimeout(this.stop, runTime);
        }
    };
    MudPrints.prototype.stop = function () {
        this._enabled = false;
        if (this._delayStop) {
            clearTimeout(this._delayStop);
            this._delayStop = null;
        }
    };
    MudPrints.prototype.update = function () {
        this.updateLivePrints();
        if (!this._enabled) {
            return;
        }
        if (core_1.Vector3.Distance(this._playerVisual.position, this._lastPos) >= 1) {
            // Place a new mud print on the ground
            this.spawnMudPrint();
            this._lastPos.copyFrom(this._playerVisual.position);
        }
    };
    MudPrints.prototype.updateLivePrints = function () {
        var _this = this;
        if (this._livePrints.size === 0) {
            return;
        }
        var currTime = Date.now();
        this._livePrints.forEach(function (print, startTime) {
            var passedTime = currTime - startTime;
            // Set visibility over time
            print.visibility = 1 - utility_1.Easing.easeInExpo((0, utility_1.clamp)(passedTime, 0, 1000) / 1000);
            if (passedTime >= 1000) {
                _this._livePrints.delete(startTime);
                _this.despawnMudPrint(print);
            }
        });
    };
    MudPrints.prototype.poolPrints = function () {
        for (var i = 0; i < 10; i++) {
            var newPrint = this.createPrint();
            this._pooledPrints.push(newPrint);
        }
    };
    MudPrints.prototype.createPrint = function () {
        // Cone a new print
        var newPrint = this._printPrefab.clone('mud-print');
        newPrint.rotationQuaternion = new core_1.Quaternion();
        newPrint.setParent(null);
        newPrint.setEnabled(false);
        return newPrint;
    };
    MudPrints.prototype.getPrint = function () {
        var print;
        if (this._pooledPrints.length > 0) {
            print = this._pooledPrints.splice(0, 1)[0];
        }
        else {
            print = this.createPrint();
        }
        return print;
    };
    MudPrints.prototype.spawnMudPrint = function () {
        try {
            var print_1 = this.getPrint();
            // Set print position to that of the visual then set it just above the ground
            print_1.position.copyFrom(this._playerVisual.position);
            print_1.position.y = 0.1;
            // Copy the rotation of the visual
            print_1.rotationQuaternion.copyFrom(this._playerVisual.rotationQuaternion);
            // Rotate the print so it's facing upward
            print_1.rotate(core_1.Vector3.Right(), 1.570796);
            // Offset the print to alternate the foot position left/right
            print_1.position = print_1.position.add(print_1.right.scale(this._foot * 0.2));
            // Invert the foot value for the next print
            this._foot *= -1;
            // Ensure print starts with full visibility
            print_1.visibility = 1;
            print_1.setEnabled(true);
            // Add the print to the map of live prints to be updated
            this._livePrints.set(Date.now(), print_1);
        }
        catch (error) { }
    };
    MudPrints.prototype.despawnMudPrint = function (print) {
        print.setEnabled(false);
        print.visibility = 1;
        this._pooledPrints.push(print);
    };
    return MudPrints;
}());
exports.MudPrints = MudPrints;
//# sourceMappingURL=mudPrints.js.map