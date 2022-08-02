module BABYLON {
    /**
     * Babylon audio source manager pro class
     * @class AudioSource - All rights reserved (c) 2020 Mackey Kinard
     */
    export class AudioSource extends BABYLON.ScriptComponent implements BABYLON.IAssetPreloader {
        private _audio:BABYLON.Sound = null;
        private _name:string = null;
        private _loop:boolean = false;
        private _mute:boolean = false;
        private _pitch:number = 1;
        private _volume:number = 1;
        private _preload:boolean = false;
        private _priority:number = 128;
        private _panstereo:number = 0;
        private _mindistance:number = 1;
        private _maxdistance:number = 50;
        private _rolloffmode:string = "linear";
        private _rollofffactor:number = 1;
        private _playonawake:boolean = true;
        private _spatialblend:number = 0;
        private _preloaderUrl:string = null;
        private _reverbzonemix:number = 1;
        private _lastmutedvolume:number = null;
        private _bypasseffects:boolean = false;
        private _bypassreverbzones:boolean = false;
        private _bypasslistenereffects:boolean = false;
        private _initializedReadyInstance:boolean = false;
        public getSoundClip():BABYLON.Sound { return this._audio; }
        public getAudioElement():HTMLAudioElement { return (this._audio != null) ? (<any>this._audio)._htmlAudioElement : null }
        /** Register handler that is triggered when the audio clip is ready */
        public onReadyObservable = new BABYLON.Observable<BABYLON.Sound>();

        protected awake():void { this.awakeAudioSource(); }
        protected destroy(): void { this.destroyAudioSource(); }
        
        protected awakeAudioSource():void {
            this._name = this.getProperty("name", this._name);
            this._loop = this.getProperty("loop", this._loop);
            this._mute = this.getProperty("mute", this._mute);
            this._pitch = this.getProperty("pitch", this._pitch);
            this._volume = this.getProperty("volume", this._volume);
            this._preload = this.getProperty("preload", this._preload);
            this._priority = this.getProperty("priority", this._priority);
            this._panstereo = this.getProperty("panstereo", this._panstereo);
            this._playonawake = this.getProperty("playonawake", this._playonawake);
            this._mindistance = this.getProperty("mindistance", this._mindistance);
            this._maxdistance = this.getProperty("maxdistance", this._maxdistance);
            this._rolloffmode = this.getProperty("rolloffmode", this._rolloffmode);
            this._rollofffactor = this.getProperty("rollofffactor", this._rollofffactor);
            this._spatialblend = this.getProperty("spatialblend", this._spatialblend);
            this._reverbzonemix = this.getProperty("reverbzonemix", this._reverbzonemix);
            this._bypasseffects = this.getProperty("bypasseffects", this._bypasseffects);
            this._bypassreverbzones = this.getProperty("bypassreverbzones", this._bypassreverbzones);
            this._bypasslistenereffects = this.getProperty("bypasslistenereffects", this._bypasslistenereffects);
            if (this._name == null || this._name === "") this._name = "Unknown";
            // ..
            const filename:string = this.getProperty("file");
            if (filename != null && filename !== "") {
                const rootUrl:string = BABYLON.SceneManager.GetRootUrl(this.scene);
                const playUrl = (rootUrl + filename);
                if (playUrl != null && playUrl !== "") {
                    if (this._preload === true) {
                        this._preloaderUrl = playUrl;
                    } else {
                        this.setDataSource(playUrl);
                    }
                }
            }
        }
        protected destroyAudioSource():void {
            this.onReadyObservable.clear();
            this.onReadyObservable = null;
            if (this._audio != null) {
                this._audio.dispose();
                this._audio = null;
            }
        }
        /**
         * Gets the ready status for track
         */
        public isReady():boolean {
            let result:boolean = false;
            if (this._audio != null) {
                result = this._audio.isReady();
            }
            return result;
        }
        /**
         * Gets the playing status for track
         */
        public isPlaying():boolean {
            let result:boolean = false;
            if (this._audio != null) {
                result = this._audio.isPlaying;
            }
            return result;
        }
        /**
         * Gets the paused status for track
         */
        public isPaused():boolean {
            let result:boolean = false;
            if (this._audio != null) {
                result = this._audio.isPaused;
            }
            return result;
        }
        /**
         * Play the sound track
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         * @param offset (optional) Start the sound at a specific time in seconds
         * @param length (optional) Sound duration (in seconds)
         */
        public play(time?: number, offset?: number, length?: number):boolean {
            if (BABYLON.SceneManager.HasAudioContext()) {
                this.internalPlay(time, offset, length);
            } else {
                BABYLON.Engine.audioEngine.onAudioUnlockedObservable.addOnce(()=>{ this.internalPlay(time, offset, length); });
            }
            return true;
        }
        private internalPlay(time?: number, offset?: number, length?: number):void {
            if (this._audio != null) {
                if (this._initializedReadyInstance === true) {
                    this._audio.play(time, offset, length);
                } else {
                    this.onReadyObservable.addOnce(()=>{ this._audio.play(time, offset, length); });
                }
            }
        }
        /**
         * Pause the sound track
         */
        public pause():boolean {
            let result:boolean = false;
            if (this._audio != null) {
                this._audio.pause();
                result = true;
            }
            return result;
        }
        /**
         * Stop the sound track
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        public stop(time?: number):boolean {
            let result:boolean = false;
            if (this._audio != null) {
                this._audio.stop(time);
                result = true;
            }
            return result;
        }
        /**
         * Mute the sound track
         * @param time (optional) Mute the sound after X seconds. Start immediately (0) by default.
         */
        public mute(time?: number):boolean {
            let result:boolean = false;
            if (this._audio != null) {
                this._lastmutedvolume = this._audio.getVolume();
                this._audio.setVolume(0, time);
            }
            return result;
        }
        /**
         * Unmute the sound track
         * @param time (optional) Unmute the sound after X seconds. Start immediately (0) by default.
         */
        public unmute(time?: number):boolean {
            let result:boolean = false;
            if (this._audio != null) {
                if (this._lastmutedvolume != null) {
                    this._audio.setVolume(this._lastmutedvolume, time);
                    this._lastmutedvolume = null;
                }
            }
            return result;
        }
        /**
         * Gets the volume of the track
         */
        public getVolume(): number {
            let result:number = 0;
            if (this._audio != null) {
                result = this._audio.getVolume();
            } else {
                result = this._volume;
            }
            return result;
        }
        /**
         * Sets the volume of the track
         * @param volume Define the new volume of the sound
         * @param time Define time for gradual change to new volume
         */
        public setVolume(volume: number, time?: number): boolean {
            let result:boolean = false;
            this._volume = volume;
            if (this._audio != null) {
                this._audio.setVolume(this._volume, time);
            }
            result = true;
            return result;
        }
        /**
         * Gets the spatial sound option of the track
         */
        public getSpatialSound(): boolean {
            let result:boolean = false;
            if (this._audio != null) {
                result = this._audio.spatialSound;
            }
            return result;
        }
        /**
         * Gets the spatial sound option of the track
         * @param value Define the value of the spatial sound
         */
        public setSpatialSound(value:boolean): void {
            if (this._audio != null) {
                this._audio.spatialSound = value;
            }
        }
        /**
         * Sets the sound track playback speed
         * @param rate the audio playback rate
         */
        public setPlaybackSpeed(rate: number):void {
            if (this._audio != null) {
                this._audio.setPlaybackRate(rate);
            }
        }
        /**
         * Gets the current time of the track
         */
        public getCurrentTrackTime(): number {
            let result:number = 0;
            if (this._audio != null) {
                result = this._audio.currentTime;
            }
            return result;
        }
        /** Set audio data source */
        public setDataSource(source:string|ArrayBuffer|MediaStream):void {
            if (this._audio != null) {
                this._audio.dispose();
                this._audio = null;
            }
            const spatialBlend:boolean = (this._spatialblend >= 0.1);
            const distanceModel:string = (this._rolloffmode === "logarithmic") ? "exponential" : "linear";
            const htmlAudioElementRequired:boolean = (this.transform.metadata != null && this.transform.metadata.vtt != null && this.transform.metadata.vtt === true);
            this._initializedReadyInstance = false;
            this._audio = new BABYLON.Sound(this._name, source, this.scene, () => {
                this._lastmutedvolume = this._volume;
                this._audio.setVolume((this._mute === true) ? 0 : this._volume);
                this._audio.setPlaybackRate(this._pitch);
                this._initializedReadyInstance = true;                    
                if (this.onReadyObservable.hasObservers() === true) {
                    this.onReadyObservable.notifyObservers(this._audio);
                }
                // ..
                // Support Auto Play On Awake
                // ..
                if (this._playonawake === true) this.play();
            }, { 
                loop: this._loop, 
                autoplay: false, // Note: Never Auto Play Here 
                refDistance: this._mindistance, 
                maxDistance: this._maxdistance,
                rolloffFactor: this._rollofffactor,
                spatialSound: spatialBlend,
                distanceModel: distanceModel,
                streaming: htmlAudioElementRequired
            });
            this._audio.setPosition(this.transform.position.clone());
            if (spatialBlend === true) this._audio.attachToMesh(this.transform);
        }
        /** Add audio preloader asset tasks (https://doc.babylonjs.com/divingDeeper/importers/assetManager) */
        public addPreloaderTasks(assetsManager:BABYLON.PreloadAssetsManager):void {
            if (this._preload === true) {
                const assetTask:BABYLON.BinaryFileAssetTask = assetsManager.addBinaryFileTask((this.transform.name + ".AudioTask"), this._preloaderUrl);
                assetTask.onSuccess = (task:BABYLON.BinaryFileAssetTask) => { this.setDataSource(task.data); };
                assetTask.onError = (task: BABYLON.BinaryFileAssetTask, message?: string, exception?: any) => { console.error(message, exception); };
            }
        }
    }
}