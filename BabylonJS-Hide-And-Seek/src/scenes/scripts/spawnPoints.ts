import { Node, TransformNode, Vector3 } from '@babylonjs/core';
import { PlayerState } from '../../../../Server/hide-and-seek/src/rooms/schema/PlayerState';

export class SpawnPoints {
	private _spawnPoints: TransformNode[] = null;

	private _seekerPoint: TransformNode = null;

	private _availablePoints: TransformNode[] = null;

	constructor(spawnPoints: TransformNode[]) {
		this._spawnPoints = spawnPoints;

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
		});

		console.log(`Found Seeker Point: ${this._seekerPoint !== null} - Found ${this._availablePoints.length} Hider Points`);
	}

	public getSpawnPoint(playerState: PlayerState): TransformNode {
		if (playerState.isSeeker) {
			return this._seekerPoint;
		}

		const index: number = playerState.spawnPoint;

		if (index < 0 || index > this._availablePoints.length - 1 || !this._availablePoints[index]) {
			console.error(`Spawn point index ${index} is not valid: %o`, this._availablePoints);
			return null;
		}

		const point: TransformNode = this._availablePoints[index];

		this._availablePoints[index] = null;

		return point;
	}
}
