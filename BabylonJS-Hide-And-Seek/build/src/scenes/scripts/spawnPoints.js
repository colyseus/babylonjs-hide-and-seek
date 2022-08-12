"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnPoints = void 0;
var SpawnPoints = /** @class */ (function () {
    function SpawnPoints(spawnPoints) {
        this._spawnPoints = null;
        this._seekerPoint = null;
        this._availablePoints = null;
        this._spawnPoints = spawnPoints;
        this.initializeSpawnPoints();
    }
    SpawnPoints.prototype.initializeSpawnPoints = function () {
        var _this = this;
        this._availablePoints = [];
        this._spawnPoints.forEach(function (point) {
            if (point.name.includes('Seeker')) {
                _this._seekerPoint = point;
            }
            else {
                _this._availablePoints.push(point);
            }
        });
        console.log("Found Seeker Point: ".concat(this._seekerPoint !== null, " - Found ").concat(this._availablePoints.length, " Hider Points"));
    };
    SpawnPoints.prototype.getSpawnPoint = function (playerState) {
        if (playerState.isSeeker) {
            return this._seekerPoint;
        }
        var index = playerState.spawnPoint;
        if (index < 0 || index > this._availablePoints.length - 1 || !this._availablePoints[index]) {
            console.error("Spawn point index ".concat(index, " is not valid: %o"), this._availablePoints);
            return null;
        }
        var point = this._availablePoints[index];
        this._availablePoints[index] = null;
        return point;
    };
    return SpawnPoints;
}());
exports.SpawnPoints = SpawnPoints;
//# sourceMappingURL=spawnPoints.js.map