export declare class GameConfig {
    private _data;
    constructor(rawData?: any);
    get MinPlayers(): number;
    get MaxPlayers(): number;
    get PreRoundCountdown(): number;
    get CountdownJump(): number;
    get PrologueCountdown(): number;
    get InitializeCountdown(): number;
    get ScatterCountdown(): number;
    get HuntCountdown(): number;
    get SeekerWinCondition(): number;
    get GameOverCountdown(): number;
    get PlayerMovementSpeed(): number;
    get SeekerMovementBoost(): number;
    get RescueCount(): number;
    get SeekerCheckDistance(): number;
    get RescueTime(): number;
    get RescueDistance(): number;
    get SeekerFOV(): number;
    get SeekerGoal(): string;
    get HiderGoal(): string;
}
