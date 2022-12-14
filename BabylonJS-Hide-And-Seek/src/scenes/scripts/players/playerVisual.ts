import { AbstractMesh, Axis, Mesh, ParticleSystem, Quaternion, Space, TransformNode, Vector3 } from '@babylonjs/core';
import { fromChildren, fromParticleSystems } from '../../decorators';
import { Quat, random, Vec3 } from '../../utility';
import CapturedVFX from '../effects/capturedVFX';
import GameManager from '../managers/gameManager';
import NetworkManager from '../managers/networkManager';
import CapturedTrigger from './capturedTrigger';
import { MudPrints } from './mudPrints';
import Player from './player';

export default class PlayerVisual extends Mesh {
	public player: Player;

	private _target: Player = null;
	private _targetLookDirection: Vector3;
	private _lerpSpeed: number = 10;

	private _prevDir: Vector3;
	private _currentDir: Vector3;

	@fromChildren('Captured')
	private _captured: CapturedVFX;
	@fromChildren('RescueMesh')
	public rescueMesh: Mesh;
	@fromChildren('CapturedTrigger')
	private _capturedTrigger: CapturedTrigger;
	@fromChildren('MudPrint')
	private _mudPrint: Mesh;

	private _mudPrints: MudPrints;
	private _visualMeshes: Mesh[];

	/**
	 * Override constructor.
	 * @warn do not fill.
	 */
	// @ts-ignore ignoring the super call as we don't want to re-init
	protected constructor() {}

	/**
	 * Called on the node is being initialized.
	 * This function is called immediatly after the constructor has been called.
	 */
	public onInitialize(): void {
		// ...
	}

	/**
	 * Called on the node has been fully initialized and is ready.
	 */
	public onInitialized(): void {
		// ...

		this._mudPrints = new MudPrints(this, this._mudPrint);
		this._visualMeshes = [];
	}

	/**
	 * Called on the scene starts.
	 */
	public onStart(): void {
		// ...
		this.setEnabled(false);
		// this.setCaptured(false);

		this._prevDir = this.forward;
		this._currentDir = this.forward;

		this._captured.setEnabled(true);
	}

	public playingCapturedVFX(): boolean {
		return this._captured.playingFX();
	}

	public setPlayerReference(player: Player) {
		this.player = player;

		this._capturedTrigger?.setPlayerReference(player);
	}

	public setVisual(visual: TransformNode) {
		visual.setParent(this);
		visual.position = Vector3.Zero();
		visual.rotation = Vector3.Zero();
		visual.setEnabled(true);

		this._visualMeshes = visual.getChildMeshes() as Mesh[];
		this._captured.stop();
	}

	public setTriggerSize(size: number) {
		this._capturedTrigger?.setTriggerSize(size);
	}

	public setTarget(player: Player) {
		this._target = player;
	}

	public setLookTargetDirection(direction: Vector3) {
		this._targetLookDirection = Vector3.Normalize(direction);
	}

	public setPickable(isPickable: boolean) {
		this.isPickable = isPickable;

		this.getChildMeshes().forEach((mesh: AbstractMesh) => {
			mesh.isPickable = isPickable;
		});
	}

	public setVisibility(visible: boolean) {
		this.isVisible = visible;

		this.getChildMeshes().forEach((mesh: AbstractMesh) => {
			if (mesh === this._capturedTrigger) {
				return;
			}

			mesh.isVisible = visible;
		});
	}

	public setCaptured(captured: boolean) {
		if (captured) {
			this._captured.playCaptured();
		} else {
			this._captured.playRescued();
		}

		this.updateVisibilityForCaptureState(captured);
	}

	private async updateVisibilityForCaptureState(captured: boolean) {
		for (let i = 0; i < this._visualMeshes.length; i++) {
			this._visualMeshes[i].visibility = captured ? 0.6 : 1;
		}
	}

	public registerPlayerMeshForIntersection(mesh: Mesh) {
		this._capturedTrigger.registerMeshForIntersection(mesh);
	}

	public toggleMudPrints(enabled: boolean, runTime: number = -1) {
		enabled ? this._mudPrints.start(runTime) : this._mudPrints.stop();
	}

	/**
	 * Called each frame.
	 */
	public onUpdate(): void {
		// ...
		// Position the visual with its target
		if (this._target) {
			this.setAbsolutePosition(this._target.getAbsolutePosition());
		}

		if (this._targetLookDirection) {
			this.rotateToTargetDirection();
		}

		this._mudPrints.update();
	}

	private rotateToTargetDirection() {
		// this.setDirection(this._targetLookDirection);

		let angle: number = Vec3.SignedAngle(this.forward, this._targetLookDirection, Vector3.Up());

		// console.log(`Angle between Forward (${this.forward.x}, ${this.forward.y}, ${this.forward.z}) and Target (${this._targetLookDirection.x}, ${this._targetLookDirection.y}, ${this._targetLookDirection.z}):  %o`, angle);

		let absAngle: number = Math.abs(angle);

		let turnDirection: number = 0;

		if (absAngle < 5) {
			this.setDirection(this._targetLookDirection);
		} else {
			// If the angle 180 randomize which direction the visual will rotate
			if (absAngle === 180) {
				turnDirection = random(1, 100) < 50 ? -1 : 1;
			} else {
				turnDirection = Math.sign(angle);
			}

			this.rotate(Vector3.Up(), GameManager.DeltaTime * this._lerpSpeed * turnDirection);
		}
	}

	/**
	 * Called on the object has been disposed.
	 * Object can be disposed manually or when the editor stops running the scene.
	 */
	public onStop(): void {
		// ...
	}

	/**
	 * Called on a message has been received and sent from a graph.
	 * @param message defines the name of the message sent from the graph.
	 * @param data defines the data sent in the message.
	 * @param sender defines the reference to the graph class that sent the message.
	 */
	public onMessage(name: string, data: any, sender: any): void {
		switch (name) {
			case 'myMessage':
				// Do something...
				break;
		}
	}
}
