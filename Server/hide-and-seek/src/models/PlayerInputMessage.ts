export class PlayerInputMessage {
	// public readonly clientId: string;
	// public readonly velocity: number[];
	public readonly position: number[];
	public readonly timestamp: number;

	constructor(/*clientId: string, velocity: number[],*/ position: number[]) {
		// this.clientId = clientId;
		// this.velocity = velocity;
		this.position = position;
		this.timestamp = Date.now();
	}
}
