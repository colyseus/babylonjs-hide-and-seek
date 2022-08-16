export declare class GameConfig {
    private _data;
    constructor(rawData?: any);
    get MinPlayers(): number;
    get MaxPlayers(): number;
    get PreRoundCountdown(): number;
    get CountdownJump(): number;
    get PrologueCountdown(): number;
    get PlayStartCountdown(): number;
    get HuntCountdown(): number;
    get SeekerWinCondition(): number;
    get GameOverCountdown(): number;
}