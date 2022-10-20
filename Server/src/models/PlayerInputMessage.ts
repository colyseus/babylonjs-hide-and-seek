export class PlayerInputMessage {
	public readonly direction: number[];
	public readonly position: number[];
	public readonly timestamp: number;

	constructor(direction: number[], position: number[]) {
		this.direction = direction;
		this.position = position;
		this.timestamp = Date.now();
	}
}
