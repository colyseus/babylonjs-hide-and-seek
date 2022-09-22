import { Scene } from '@babylonjs/core';
import { UIController } from './uiController';
export declare class LobbyUI extends UIController {
    private _playerList;
    private _playerEntryTemplate;
    private _header;
    private _playerCount;
    private _roomCode;
    private _gameOverCountdown;
    private _playAgainBtn;
    private _leaveBtn;
    private _playerEntries;
    constructor(scene: Scene, layer: number);
    protected initialize(): Promise<void>;
    private setUpControls;
    private registerControlHandlers;
    setVisible(visible: boolean): void;
    clearPlayerList(): void;
    updateCountdown(countdown: number): void;
    private updateHeader;
    private updatePlayerCount;
    private onPlayerAdded;
    private onPlayerRemoved;
    private onPlayerPlayAgain;
    private returnToTitle;
    private playAgain;
    private addPlayerEntry;
}
