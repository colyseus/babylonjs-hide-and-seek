import { Scene } from '@babylonjs/core';
import { UIController } from './uiController';
export declare class LobbyUI extends UIController {
    private _playerList;
    private _playerEntryTemplate;
    private _header;
    private _playerCount;
    private _backBtn;
    private _playerEntries;
    constructor(scene: Scene, layer: number);
    protected initialize(): Promise<void>;
    private setUpControls;
    setVisible(visible: boolean): void;
    private updateHeader;
    private updatePlayerCount;
    private onPlayerAdded;
    private onPlayerRemoved;
    private returnToTitle;
    private addPlayerEntry;
}
