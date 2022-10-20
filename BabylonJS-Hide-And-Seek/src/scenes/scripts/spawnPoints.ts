import { AbstractMesh, TransformNode } from '@babylonjs/core';
import type { PlayerState } from '../../../../Server/src/rooms/schema/PlayerState';

export class SpawnPoints {
	private _spawnPoints: TransformNode[] = null;

	private _seekerPoint: TransformNode = null;

	private _availablePoints: TransformNode[] = null;
	private _usedPoints: Map<string, TransformNode> = null;

	constructor(spawnPoints: TransformNode[]) {
		this._spawnPoints = spawnPoints;
		this._usedPoints = new Map<string, TransformNode>();

		this.initializeSpawnPoints();
	}

	private initializeSpawnPoints() {
		this._availablePoints = [];

		this._spawnPoints.forEach((point: TransformNode) => {
			if (point.name.includes('Seeker')) {
				this._seekerPoint = point;
			} else {
				this._availablePoints.push(point);
			}

			// Enforce the meshes to not be pickable
			point.getChildMeshes().forEach((mesh: AbstractMesh) => {
				mesh.isPickable = false;
			});
		});

		// console.log(`Found Seeker Point: ${this._seekerPoint !== null} - Found ${this._availablePoints.length} Hider Points`);
	}

	public getSpawnPoint(playerState: PlayerState): TransformNode {
		let point: TransformNode = null;
		const index: number = playerState.spawnPoint;

		if (playerState.isSeeker) {
			if (!this._seekerPoint) {
				console.error(`Seeker spawn point has already been used!`);
				return null;
			}

			point = this._seekerPoint;

			this._seekerPoint = null;
		} else {
			if (index < 0 || index > this._availablePoints.length - 1 || !this._availablePoints[index]) {
				console.error(`Hider spawn point index ${index} is not valid: %o`, this._availablePoints);
				return null;
			}

			point = this._availablePoints[index];

			this._availablePoints[index] = null;
		}

		// Add the point to the used collection
		this._usedPoints.set(playerState.id, point);

		return point;
	}

	public freeUpSpawnPoint(playerState: PlayerState) {
		const spawnPointIndex: number = playerState.spawnPoint;
		let spawnPoint: TransformNode = null;

		if (playerState.isSeeker) {
			// Restore the seeker spawn point
			spawnPoint = this._usedPoints.get(playerState.id);

			if (spawnPoint) {
				this._seekerPoint = spawnPoint;
			}
		} else {
			// Restore the hider spawn point
			spawnPoint = this._availablePoints[spawnPointIndex] = this._usedPoints.get(playerState.id);
		}

		if (spawnPoint) {
			this._usedPoints.delete(playerState.id);
		}
	}
}
