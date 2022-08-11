export class VelocityChangeMessage {
	public readonly clientId: string;
	public readonly velocity: number[];

	constructor(clientId: string, velocity: number[]) {
		this.clientId = clientId;
		this.velocity = velocity;
	}
}
