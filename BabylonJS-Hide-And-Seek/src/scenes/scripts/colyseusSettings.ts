export class ColyseusSettings {
	public readonly colyseusServerAddress: string = 'localhost';
	public readonly colyseusServerPort: number = 2567;
	public readonly useSecureProtocol: boolean = false;

	constructor(address: string, port: number, secure: boolean) {
		this.colyseusServerAddress = address;
		this.colyseusServerPort = port;
		this.useSecureProtocol = secure;
	}
}
