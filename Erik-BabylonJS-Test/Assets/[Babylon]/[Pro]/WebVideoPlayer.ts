module BABYLON {
    /**
     * Babylon web video player pro class (Unity Style Shuriken Particle System)
     * @class WebVideoPlayer - All rights reserved (c) 2020 Mackey Kinard
     */
    export class WebVideoPlayer extends BABYLON.ScriptComponent implements BABYLON.IAssetPreloader {
        private videoLoop:boolean = false;
        private videoMuted:boolean = false;
        private videoAlpha:boolean = false;
        private videoFaded:boolean = false;
        private videoPoster:string = null;
        private videoInvert:boolean = true;
        private videoSample:number = 3;
        private videoVolume:number = 1.0;
        private videoMipmaps:boolean = false;
        private videoPlayback:number = 1.0;
        private videoPlayOnAwake:boolean = true;
        private videoPreloaderUrl:string = null;
        private videoBlobUrl:string = null;
        private videoPreload:boolean = false;
        private _initializedReadyInstance:boolean = false;

        public getVideoMaterial():BABYLON.StandardMaterial { return this.m_videoMaterial; }
        public getVideoTexture():BABYLON.VideoTexture { return this.m_videoTexture; }
        public getVideoElement():HTMLVideoElement { return (this.m_videoTexture != null) ? this.m_videoTexture.video : null; }
        public getVideoScreen():BABYLON.AbstractMesh { return this.m_abstractMesh; }
        public getVideoBlobUrl():string { return this.videoBlobUrl; }
        /** Register handler that is triggered when the video clip is ready */
        public onReadyObservable = new BABYLON.Observable<BABYLON.VideoTexture>();

        protected m_abstractMesh:BABYLON.AbstractMesh = null;
        protected m_videoTexture:BABYLON.VideoTexture = null;
        protected m_videoMaterial:BABYLON.StandardMaterial = null;
        protected m_diffuseIntensity:number = 1.0;

        protected awake(): void { this.awakeWebVideoPlayer(); }
        protected destroy(): void { this.destroyWebVideoPlayer(); }

        protected awakeWebVideoPlayer():void {
            this.videoLoop = this.getProperty("looping", false);
            this.videoMuted = this.getProperty("muted", false);
            this.videoInvert = this.getProperty("inverty", true);
            this.videoSample = this.getProperty("sampling", 3);
            this.videoVolume = this.getProperty("volume", 1.0);
            this.videoMipmaps = this.getProperty("mipmaps", false);
            this.videoAlpha = this.getProperty("texturealpha", false);
            this.videoFaded = this.getProperty("diffusealpha", false);
            this.videoPlayback = this.getProperty("playbackspeed", 1.0);
            this.videoPlayOnAwake = this.getProperty("playonawake", true);
            this.videoPreload = this.getProperty("preload", this.videoPreload);
            this.m_diffuseIntensity = this.getProperty("intensity", 1.0);
            this.m_abstractMesh = this.getAbstractMesh();
            // ..
            const setPoster:boolean = this.getProperty("poster");
            if (setPoster === true && this.m_abstractMesh != null && this.m_abstractMesh.material != null) {
                if (this.m_abstractMesh.material instanceof BABYLON.PBRMaterial) {
                    if (this.m_abstractMesh.material.albedoTexture != null && (<any>this.m_abstractMesh.material.albedoTexture).url != null && (<any>this.m_abstractMesh.material.albedoTexture).url !== "") {    
                        this.videoPoster = (<any>this.m_abstractMesh.material.albedoTexture).url.replace("data:", "");
                    }
                } else if (this.m_abstractMesh.material instanceof BABYLON.StandardMaterial) {
                    if (this.m_abstractMesh.material.diffuseTexture != null && (<any>this.m_abstractMesh.material.diffuseTexture).url != null && (<any>this.m_abstractMesh.material.diffuseTexture).url !== "") {    
                        this.videoPoster = (<any>this.m_abstractMesh.material.diffuseTexture).url.replace("data:", "");
                    }
                }
            }
            // ..
            const videoUrl:string = this.getProperty("url", null);
            const videoSrc:BABYLON.IUnityVideoClip = this.getProperty("source", null);
            let playUrl:string = videoUrl;
            if (videoSrc != null && videoSrc.filename != null && videoSrc.filename !== "") {
                const rootUrl:string = BABYLON.SceneManager.GetRootUrl(this.scene);
                playUrl = (rootUrl + videoSrc.filename);
            }
            if (playUrl != null && playUrl !== "") {
                if (this.videoPreload === true) {
                    this.videoPreloaderUrl = playUrl;
                } else {
                    this.setDataSource(playUrl);
                }
            }
        }
        protected destroyWebVideoPlayer():void {
            this.m_abstractMesh = null;
            if (this.m_videoTexture != null) {
                this.m_videoTexture.dispose();
                this.m_videoTexture = null;
            }
            if (this.m_videoMaterial != null) {
                this.m_videoMaterial.dispose();
                this.m_videoMaterial = null;
            }
            this.revokeVideoBlobUrl();
        }
        /**
         * Gets the video ready status
         */
        public isReady():boolean {
            return (this.getVideoElement() != null);
        }
        /**
         * Gets the video playing status
         */
        public isPlaying():boolean {
            let result:boolean = false;
            const video:HTMLVideoElement = this.getVideoElement();
            if (video != null) {
                result = (video.paused === false);
            }
            return result;
        }
        /**
         * Gets the video paused status
         */
        public isPaused():boolean {
            let result:boolean = false;
            const video:HTMLVideoElement = this.getVideoElement();
            if (video != null) {
                result = (video.paused === true);
            }
            return result;
        }
        /**
         * Play the video track
         */
        public play():boolean {
            if (BABYLON.SceneManager.HasAudioContext()) {
                this.internalPlay();
            } else {
                BABYLON.Engine.audioEngine.onAudioUnlockedObservable.addOnce(()=>{ this.internalPlay(); });
            }
            return true;
        }
        private internalPlay():void {
            if (this._initializedReadyInstance === true) {
                this.checkedPlay();
            } else {
                this.onReadyObservable.addOnce(()=>{ this.checkedPlay(); });
            }
        }
        private checkedPlay():void {
            const video:HTMLVideoElement = this.getVideoElement();
            if (video != null) {
                video.play().then(()=>{
                    if (video.paused === true) {
                        this.checkedRePlay();
                    }
                });
            }
        }
        private checkedRePlay():void {
            const video:HTMLVideoElement = this.getVideoElement();
            if (video != null) {
                video.play().then(() => { /* Do Nothing */});
            }
        }
        /**
         * Pause the video track
         */
        public pause():boolean {
            let result:boolean = false;
            const video:HTMLVideoElement = this.getVideoElement();
            if (video != null) {
                video.pause();
                result = true;
            }
            return result;
        }
        /**
         * Mute the video track
         */
        public mute():boolean {
            let result:boolean = false;
            const video:HTMLVideoElement = this.getVideoElement();
            if (video != null) {
                video.muted = true;
                result = true;
            }
            return result;
        }
        /**
         * Unmute the video track
         */
        public unmute():boolean {
            let result:boolean = false;
            const video:HTMLVideoElement = this.getVideoElement();
            if (video != null) {
                video.muted = false;
                result = true;
            }
            return result;
        }
        /**
         * Gets the video volume
         */
        public getVolume():number {
            let result:number = 0;
            const video:HTMLVideoElement = this.getVideoElement();
            if (video != null) {
                result = video.volume;
            }
            return result;
        }
        /**
         * Sets the video volume
         * @param volume Define the new volume of the sound
         */
        public setVolume(volume:number):boolean {
            let result:boolean = false;
            const video:HTMLVideoElement = this.getVideoElement();
            if (video != null) {
                video.volume = volume;
                result = true;
            }
            return result;
        }
        /** Set video data source */
        public setDataSource(source:string|string[]|HTMLVideoElement):void {
            if (this.m_abstractMesh != null) {
                // ..
                // Create Video Material
                // ..
                if (this.m_videoMaterial == null) {
                    this.m_videoMaterial = new BABYLON.StandardMaterial(this.transform.name + ".VideoMat", this.scene);
                    this.m_videoMaterial.roughness = 1;
                    this.m_videoMaterial.diffuseColor = new BABYLON.Color3(1,1,1);
                    this.m_videoMaterial.emissiveColor = new BABYLON.Color3(1,1,1);
                    this.m_videoMaterial.useAlphaFromDiffuseTexture = this.videoFaded;
                    this.m_abstractMesh.material = this.m_videoMaterial;
                }
                // ..
                // Setup Video Texture
                // ..
                if (this.m_videoMaterial != null) {
                    this.m_videoMaterial.diffuseTexture = null;
                    if (this.m_videoTexture != null) {
                        this.m_videoTexture.dispose();
                        this.m_videoTexture = null;
                    }
                    this._initializedReadyInstance = false;
                    this.m_videoTexture = new BABYLON.VideoTexture(this.transform.name + ".VideoTex", source, this.scene, this.videoMipmaps, this.videoInvert, this.videoSample, { autoUpdateTexture: true, poster: this.videoPoster });
                    if (this.m_videoTexture != null) {
                        this.m_videoTexture.hasAlpha = this.videoAlpha;
                        if (this.m_videoTexture.video != null) {
                            this.m_videoTexture.video.loop = this.videoLoop;
                            this.m_videoTexture.video.muted = this.videoMuted;
                            this.m_videoTexture.video.volume = this.videoVolume;
                            this.m_videoTexture.video.playbackRate = this.videoPlayback;
                            this.m_videoTexture.video.addEventListener("loadeddata", () => {
                                this._initializedReadyInstance = true;
                                if (this.onReadyObservable.hasObservers() === true) {
                                    this.onReadyObservable.notifyObservers(this.m_videoTexture);
                                }
                                if (this.videoPlayOnAwake === true) {
                                    this.play();
                                }
                            });
                            this.m_videoTexture.video.load();
                        }
                    }
                    if (this.m_videoTexture != null) {
                        this.m_videoTexture.level = this.m_diffuseIntensity;
                        this.m_videoMaterial.diffuseTexture = this.m_videoTexture;
                    }
                } else {
                    BABYLON.Tools.Warn("No video mesh or material available for: " + this.transform.name);
                }
            }
        }
        /** Revokes the current video blob url and releases resouces */
        public revokeVideoBlobUrl():void {
            if (this.videoBlobUrl != null) {
                URL.revokeObjectURL(this.videoBlobUrl);
                this.videoBlobUrl = null;
            }
        }
        /** Add video preloader asset tasks (https://doc.babylonjs.com/divingDeeper/importers/assetManager) */
        public addPreloaderTasks(assetsManager:BABYLON.PreloadAssetsManager):void {
            if (this.videoPreload === true) {
                const assetTask:BABYLON.BinaryFileAssetTask = assetsManager.addBinaryFileTask((this.transform.name + ".VideoTask"), this.videoPreloaderUrl);
                assetTask.onSuccess = (task:BABYLON.BinaryFileAssetTask) => {
                    this.revokeVideoBlobUrl();
                    this.videoBlobUrl = URL.createObjectURL(new Blob([task.data]));
                    this.setDataSource(this.videoBlobUrl);
                };
                assetTask.onError = (task: BABYLON.BinaryFileAssetTask, message?: string, exception?: any) => { console.error(message, exception); };
            }
        }
    }
}