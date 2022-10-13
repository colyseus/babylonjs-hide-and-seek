"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnPoints = void 0;
var SpawnPoints = /** @class */ (function () {
    function SpawnPoints(spawnPoints) {
        this._spawnPoints = null;
        this._seekerPoint = null;
        this._availablePoints = null;
        this._usedPoints = null;
        this._spawnPoints = spawnPoints;
        this._usedPoints = new Map();
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
            // Enforce the meshes to not be pickable
            point.getChildMeshes().forEach(function (mesh) {
                mesh.isPickable = false;
            });
        });
        // console.log(`Found Seeker Point: ${this._seekerPoint !== null} - Found ${this._availablePoints.length} Hider Points`);
    };
    SpawnPoints.prototype.getSpawnPoint = function (playerState) {
        var point = null;
        var index = playerState.spawnPoint;
        if (playerState.isSeeker) {
            if (!this._seekerPoint) {
                console.error("Seeker spawn point has already been used!");
                return null;
            }
            point = this._seekerPoint;
            this._seekerPoint = null;
        }
        else {
            if (index < 0 || index > this._availablePoints.length - 1 || !this._availablePoints[index]) {
                console.error("Hider spawn point index ".concat(index, " is not valid: %o"), this._availablePoints);
                return null;
            }
            point = this._availablePoints[index];
            this._availablePoints[index] = null;
        }
        // Add the point to the used collection
        this._usedPoints.set(playerState.id, point);
        return point;
    };
    SpawnPoints.prototype.freeUpSpawnPoint = function (playerState) {
        var spawnPointIndex = playerState.spawnPoint;
        var spawnPoint = null;
        if (playerState.isSeeker) {
            // Restore the seeker spawn point
            spawnPoint = this._usedPoints.get(playerState.id);
            if (spawnPoint) {
                this._seekerPoint = spawnPoint;
            }
        }
        else {
            // Restore the hider spawn point
            spawnPoint = this._availablePoints[spawnPointIndex] = this._usedPoints.get(playerState.id);
        }
        if (spawnPoint) {
            this._usedPoints.delete(playerState.id);
        }
    };
    return SpawnPoints;
}());
exports.SpawnPoints = SpawnPoints;
//# sourceMappingURL=spawnPoints.js.map