module BABYLON {
    /**
     * Babylon animation state pro class (Unity Style Mechanim Animation System)
     * @class AnimationState - All rights reserved (c) 2020 Mackey Kinard
     */
    export class AnimationState extends BABYLON.ScriptComponent {
        private static FPS:number = 30;
        private static EXIT:string = "[EXIT]";
        private static TIME:number = 1;             // Note: Must Be One Second Normalized Time
        private static SPEED:number = 1.025;        // Note: Animation State Blend Speed Factor

        private _frametime:number = 0;
        private _layercount:number = 0;
        private _updatemode:number = 0;             // Note: 0 - Transform Node | 1 - Chacracter Controller | 2 - Unscaled Time ???
        private _hasrootmotion:boolean = false;
        private _animationplaying:boolean = false;
        private _initialtargetblending:boolean = false;
        private _hastransformhierarchy:boolean = false;
        private _leftfeetbottomheight:number = 0;
        private _rightfeetbottomheight:number = 0;
        private _initialRootBonePosition:BABYLON.Vector3 = null;
        private _initialRootBoneRotation:BABYLON.Vector3 = null;
        private _runtimecontroller:string = null;
        private _executed:boolean = false;
        private _checkers:BABYLON.TransitionCheck = new BABYLON.TransitionCheck();
        private _source:string = "";
        private _machine:any = null;

        private _deltaPosition:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _deltaRotation:BABYLON.Quaternion = new BABYLON.Quaternion(0,0,0,1);
        private _positionWeight:boolean = false;
        private _rootBoneWeight:boolean = false;
        private _rotationWeight:boolean = false;
        private _rootQuatWeight:boolean = false;
        private _angularVelocity:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _positionHolder:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _rootBoneHolder:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _rotationHolder:BABYLON.Quaternion = new BABYLON.Quaternion(0,0,0,1);
        private _rootQuatHolder:BABYLON.Quaternion = new BABYLON.Quaternion(0,0,0,1);
        private _rootMotionMatrix:BABYLON.Matrix = BABYLON.Matrix.Zero();
        private _rootMotionScaling:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _rootMotionRotation:BABYLON.Quaternion = new BABYLON.Quaternion(0,0,0,1);
        private _rootMotionPosition:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _lastMotionRotation:BABYLON.Quaternion = new BABYLON.Quaternion(0,0,0,1);
        private _lastMotionPosition:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _deltaPositionFixed:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _deltaPositionMatrix:BABYLON.Matrix = new BABYLON.Matrix();
        private _saveDeltaPosition:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _saveDeltaRotation:BABYLON.Quaternion = new BABYLON.Quaternion(0,0,0,1);
        private _dirtyMotionMatrix:any = null;
        private _dirtyBlenderMatrix:any = null;
        //private _bodyOrientationAngleY:number = 0;

        //private transformForwardVector:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        //private transformRightVector:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        //private desiredForwardVector:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        //private desiredRightVector:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);

        private _targetPosition:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _targetRotation:BABYLON.Quaternion = new BABYLON.Quaternion(0,0,0,1);
        private _targetScaling:BABYLON.Vector3 = new BABYLON.Vector3(1,1,1);
        private _updateMatrix:BABYLON.Matrix = BABYLON.Matrix.Zero();
        private _blenderMatrix:BABYLON.Matrix = BABYLON.Matrix.Zero();
        private _blendWeights:BABYLON.BlendingWeights = new BABYLON.BlendingWeights();
        private _emptyScaling:BABYLON.Vector3 = new BABYLON.Vector3(1,1,1);
        private _emptyPosition:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _emptyRotation:BABYLON.Quaternion = new BABYLON.Quaternion(0,0,0,1);
        private _ikFrameEanbled:boolean = false;

        private _data:Map<string, BABYLON.MachineState> = new Map<string, BABYLON.MachineState>();
        private _anims:Map<string, BABYLON.AnimationGroup> = new Map<string, BABYLON.AnimationGroup>();
        private _numbers:Map<string, number> = new Map();
        private _booleans:Map<string, boolean> = new Map();
        private _triggers:Map<string, boolean> = new Map();
        private _parameters:Map<string, BABYLON.AnimatorParameterType> = new Map<string, BABYLON.AnimatorParameterType>();
        
        public speedRatio:number = 1.0;
        public applyRootMotion = false;
        public delayUpdateUntilReady = true;
        public enableAnimation:boolean = true;
        public updateRootMotionPosition = false;
        public updateRootMotionRotation = false;
        public hasRootMotion():boolean { return this._hasrootmotion }
        public ikFrameEnabled():boolean { return this._ikFrameEanbled; }
        public getAnimationTime():number { return this._frametime; }
        public getAnimationPlaying():boolean { return this._animationplaying; }
        public getRootMotionAngle():number { return this._angularVelocity.y; }
        public getRootMotionSpeed():number { return this._deltaPosition.length(); }
        public getRootMotionPosition():BABYLON.Vector3 { return this._deltaPositionFixed; }
        public getRootMotionRotation():BABYLON.Quaternion { return this._deltaRotation; }
        public getCharacterController():BABYLON.CharacterController { return this.m_characterController; }
        public getRuntimeController():string { return this._runtimecontroller; }
        /** Register handler that is triggered when the animation ik setup has been triggered */
        public onAnimationIKObservable = new BABYLON.Observable<number>();
        /** Register handler that is triggered when the animation end has been triggered */
        public onAnimationEndObservable = new BABYLON.Observable<number>();
        /** Register handler that is triggered when the animation loop has been triggered */
        public onAnimationLoopObservable = new BABYLON.Observable<number>();
        /** Register handler that is triggered when the animation event has been triggered */
        public onAnimationEventObservable = new BABYLON.Observable<BABYLON.IAnimatorEvent>();
        /** Register handler that is triggered when the animation frame has been updated */
        public onAnimationUpdateObservable = new BABYLON.Observable<BABYLON.TransformNode>();

        protected m_defaultGroup:BABYLON.AnimationGroup = null;
        protected m_animationTargets:BABYLON.TargetedAnimation[] = null;
        protected m_characterController:BABYLON.CharacterController = null;
        
        protected awake(): void { this.awakeStateMachine(); }
        protected update(): void { this.updateStateMachine(); }
        protected destroy(): void { this.destroyStateMachine(); }

        /////////////////////////////////////////////////////////////////////////////////////
        // State Machine Functions
        /////////////////////////////////////////////////////////////////////////////////////
        
        public playAnimation(state:string, transitionDuration:number = 0, animationLayer:number = 0, frameRate:number = null):boolean {
            let result:boolean = false;
            if (this._machine.layers != null && this._machine.layers.length > animationLayer) {
                const layer:BABYLON.IAnimationLayer = this._machine.layers[animationLayer];
                const blendFrameRate:number = (layer.animationStateMachine != null) ? (layer.animationStateMachine.rate || BABYLON.AnimationState.FPS) : BABYLON.AnimationState.FPS;
                const blendingSpeed:number = (transitionDuration > 0) ? BABYLON.Utilities.ComputeBlendingSpeed(frameRate || blendFrameRate, transitionDuration) : 0;
                this.playCurrentAnimationState(layer, state, blendingSpeed);
                result = true;
            } else {
                BABYLON.Tools.Warn("No animation state layers on " + this.transform.name);
            }
            return result;
        }
        public stopAnimation(animationLayer:number = 0):boolean {
            let result:boolean = false;
            if (this._machine.layers != null && this._machine.layers.length > animationLayer) {
                const layer:BABYLON.IAnimationLayer = this._machine.layers[animationLayer];
                this.stopCurrentAnimationState(layer);
                result = true;
            } else {
                BABYLON.Tools.Warn("No animation state layers on " + this.transform.name);
            }
            return result;
        }

        /////////////////////////////////////////////////////////////////////////////////////
        // State Machine Functions
        /////////////////////////////////////////////////////////////////////////////////////

        public getBool(name:string):boolean {
            return this._booleans.get(name) || false;
        }
        public setBool(name:string, value:boolean):void {
            this._booleans.set(name, value);
        }
        public getFloat(name:string):float {
            return this._numbers.get(name) || 0;
        }
        public setFloat(name:string, value:float):void {
            this._numbers.set(name, value);
        }
        public getInteger(name:string):int {
            return this._numbers.get(name) || 0;
        }
        public setInteger(name:string, value:int):void {
            this._numbers.set(name, value);
        }
        public getTrigger(name:string):boolean {
            return this._triggers.get(name) || false;
        }
        public setTrigger(name:string):void {
            this._triggers.set(name, true);
        }
        public resetTrigger(name:string):void {
            this._triggers.set(name, false);
        }
        public setSmoothFloat(name:string, targetValue:float, dampTime:number, deltaTime:number):void {
            const currentValue:number = this.getFloat(name);
            const gradientValue:number = BABYLON.Scalar.Lerp(currentValue, targetValue, (dampTime * deltaTime));
            this._numbers.set(name, gradientValue);
        }
        public setSmoothInteger(name:string, targetValue:int, dampTime:number, deltaTime:number):void {
            const currentValue:number = this.getInteger(name);
            const gradientValue:number = BABYLON.Scalar.Lerp(currentValue, targetValue, (dampTime * deltaTime));
            this._numbers.set(name, gradientValue);
        }
        private getMachineState(name:string):BABYLON.MachineState {
            return this._data.get(name);
        }
        private setMachineState(name:string, value:BABYLON.MachineState):void {
            this._data.set(name, value);
        }
        public getCurrentState(layer:number):BABYLON.MachineState {
            return (this._machine.layers != null && this._machine.layers.length > layer) ? this._machine.layers[layer].animationStateMachine : null;
        }
        public getAnimationGroup(name:string):BABYLON.AnimationGroup {
            return this._anims.get(name);
        }
        public getAnimationGroups():Map<string, BABYLON.AnimationGroup>{
            return this._anims;
        }        
        public setAnimationGroups(groups:BABYLON.AnimationGroup[], remapTargets:boolean = false):void {
            // ..
            // TODO - Handle Remap Animation Targets
            // ..
            if (groups != null && groups.length > 0) {
                this._anims = new Map<string, BABYLON.AnimationGroup>();
                this.m_animationTargets = [];
                this.m_defaultGroup = groups[0];
                groups.forEach((group:BABYLON.AnimationGroup) => {
                    const agroup:any = group;
                    try { group.stop(); } catch {}
                    if (group.targetedAnimations != null && group.targetedAnimations.length > 0) {
                        group.targetedAnimations.forEach((targetedAnimation) => {
                            // Note: For Loop Faster Than IndexOf
                            let indexOfTarget:number = -1;
                            for (let i = 0; i < this.m_animationTargets.length; i++) {
                                if (this.m_animationTargets[i].target === targetedAnimation.target) {
                                    indexOfTarget = i;
                                    break
                                }
                            }
                            if (indexOfTarget < 0) {
                                this.m_animationTargets.push(targetedAnimation);
                                if (targetedAnimation.target.metadata == null) targetedAnimation.target.metadata = {};

                                if (targetedAnimation.target instanceof BABYLON.TransformNode) {
                                    BABYLON.Utilities.ValidateTransformQuaternion(targetedAnimation.target);
                                    const layerMixers:BABYLON.AnimationMixer[] = [];
                                    for (let index = 0; index < this._layercount; index++) {
                                        const layerMixer:BABYLON.AnimationMixer = new BABYLON.AnimationMixer();
                                        layerMixer.positionBuffer = null;
                                        layerMixer.rotationBuffer = null;
                                        layerMixer.scalingBuffer = null;
                                        layerMixer.originalMatrix = null;
                                        layerMixer.blendingFactor = 0;
                                        layerMixer.blendingSpeed = 0;
                                        layerMixer.rootPosition = null;
                                        layerMixer.rootRotation = null;
                                        layerMixers.push(layerMixer);
                                    }
                                    targetedAnimation.target.metadata.mixer = layerMixers;
                                } else if (targetedAnimation.target instanceof BABYLON.MorphTarget) {
                                    const morphLayerMixers:BABYLON.AnimationMixer[] = [];
                                    for (let index = 0; index < this._layercount; index++) {
                                        const morphLayerMixer:BABYLON.AnimationMixer = new BABYLON.AnimationMixer();
                                        morphLayerMixer.influenceBuffer = null;
                                        morphLayerMixers.push(morphLayerMixer);
                                    }
                                    (<any>targetedAnimation.target).metadata.mixer = morphLayerMixers;
                                }
                            }
                        });
                    }
                    if (agroup != null && agroup.metadata != null && agroup.metadata.unity != null && agroup.metadata.unity.clip != null && agroup.metadata.unity.clip !== "") {
                        this._anims.set(agroup.metadata.unity.clip, group);
                    }
                });
            }
        }

        /* Animation Controller State Machine Functions */
        
        private awakeStateMachine():void {
            BABYLON.Utilities.ValidateTransformQuaternion(this.transform);
            this.m_animationTargets = [];
            this.m_defaultGroup = null;
            this.m_characterController = this.getComponent("BABYLON.CharacterController");
            // ..
            this._source = (this.transform.metadata != null && this.transform.metadata.unity != null && this.transform.metadata.unity.animator != null && this.transform.metadata.unity.animator !== "") ? this.transform.metadata.unity.animator : null;
            this._machine = this.getProperty("machine", this._machine);
            this._updatemode = this.getProperty("updatemode", this._updatemode);
            this._hasrootmotion = this.getProperty("hasrootmotion", this._hasrootmotion);
            this._runtimecontroller = this.getProperty("runtimecontroller", this._runtimecontroller);
            this._hastransformhierarchy = this.getProperty("hastransformhierarchy", this._hastransformhierarchy);
            this._leftfeetbottomheight = this.getProperty("leftfeetbottomheight", this._leftfeetbottomheight);
            this._rightfeetbottomheight = this.getProperty("rightfeetbottomheight", this._rightfeetbottomheight);
            this.applyRootMotion = this.getProperty("applyrootmotion", this.applyRootMotion);
            // ..
            if (this._machine != null) {
                if (this._machine.speed != null) {
                    this.speedRatio = this._machine.speed;
                }
                if (this._machine.parameters != null && this._machine.parameters.length > 0) {
                    const plist:any[] = this._machine.parameters;
                    plist.forEach((parameter) => {
                        const name:string = parameter.name;
                        const type:BABYLON.AnimatorParameterType = parameter.type;
                        const curve:boolean = parameter.curve;
                        const defaultFloat:number = parameter.defaultFloat;
                        const defaultBool:boolean = parameter.defaultBool;
                        const defaultInt:number = parameter.defaultInt;
                        this._parameters.set(name, type);
                        if (type === BABYLON.AnimatorParameterType.Bool) {
                            this.setBool(name, defaultBool);
                        } else if (type === BABYLON.AnimatorParameterType.Float) {
                            this.setFloat(name, defaultFloat);
                        } else if (type === BABYLON.AnimatorParameterType.Int) {
                            this.setInteger(name, defaultInt);
                        } else if (type === BABYLON.AnimatorParameterType.Trigger) {
                            this.resetTrigger(name);
                        }
                    });
                }
                // ..
                // Process Machine State Layers
                // ..
                if (this._machine.layers != null && this._machine.layers.length > 0) {
                    this._layercount = this._machine.layers.length;
                    // Sort In Ascending Order
                    this._machine.layers.sort((left, right): number => {
                        if (left.index < right.index) return -1;
                        if (left.index > right.index) return 1;
                        return 0;
                    });
                    // Parse State Machine Layers
                    this._machine.layers.forEach((layer:BABYLON.IAnimationLayer) => {
                        // Set Layer Avatar Mask Transform Path
                        layer.animationMaskMap = new Map<string, number>();
                        if (layer.avatarMask != null && layer.avatarMask.transformPaths != null && layer.avatarMask.transformPaths.length > 0) {
                            for (let i = 0; i < layer.avatarMask.transformPaths.length; i++) {
                                layer.animationMaskMap.set(layer.avatarMask.transformPaths[i], i);
                            }
                        }
                    });
                }
            }
            if (this._source != null && this._source !== "" && this.scene.animationGroups != null) {
                let sourceanims:BABYLON.AnimationGroup[] = null;
                // ..
                // TODO - Optimize Searching Global Animation Groups - ???
                // ..
                this.scene.animationGroups.forEach((group:BABYLON.AnimationGroup) => {
                    const agroup:any = group;
                    if (agroup != null && agroup.metadata != null && agroup.metadata.unity != null && agroup.metadata.unity.source != null && agroup.metadata.unity.source !== "") {
                        if (agroup.metadata.unity.source === this._source) {
                            if (sourceanims == null) sourceanims = [];
                            sourceanims.push(group);
                        }
                    }
                });
                if (sourceanims != null && sourceanims.length > 0) {
                    this.setAnimationGroups(sourceanims);
                }
            }
            // ..
            // Map State Machine Tracks (Animation Groups)
            // ..
            if (this._machine != null && this._machine.states != null && this._machine.states.length > 0) {
                this._machine.states.forEach((state:BABYLON.MachineState) => {
                    if (state != null && state.name != null ) {
                        // Set Custom Animation Curves
                        if (state.ccurves != null && state.ccurves.length > 0) {
                            state.ccurves.forEach((curve:BABYLON.IUnityCurve) => {
                                if (curve.animation != null) {
                                    const anim:BABYLON.Animation = BABYLON.Animation.Parse(curve.animation);
                                    if (anim != null) {
                                        if (state.tcurves == null) state.tcurves = [];
                                        state.tcurves.push(anim);
                                    }
                                }
                            });
                        }
                        // Setup Animation State Machines
                        this.setupTreeBranches(state.blendtree);
                        this.setMachineState(state.name, state);
                    }
                });
            }
            // .. 
            // console.warn("Animation State Mahine: " + this.transform.name);
            // console.log(this);
            // SM.SetWindowState(this.transform.name, this);
        }

        private updateStateMachine(deltaTime:number = null):void {
            if (this.delayUpdateUntilReady === false || (this.delayUpdateUntilReady === true && this.getReadyState() === true)) {
                if (this._executed === false) {
                    this._executed = true;
                    if (this._machine.layers != null && this._machine.layers.length > 0) {
                        this._machine.layers.forEach((layer:BABYLON.IAnimationLayer) => {
                            this.playCurrentAnimationState(layer, layer.entry, 0);
                        });
                    }
                }
                if (this.enableAnimation === true) {
                    const frameDeltaTime:number = deltaTime || this.getDeltaSeconds();
                    this.updateAnimationState(frameDeltaTime);
                    this.updateAnimationTargets(frameDeltaTime);
                    if (this.onAnimationUpdateObservable.hasObservers() === true) {
                        this.onAnimationUpdateObservable.notifyObservers(this.transform);
                    }
                }
            }
        }
        private destroyStateMachine():void {
            this._data = null;
            this._anims = null;
            this._numbers = null;
            this._booleans = null;
            this._triggers = null;
            this._parameters = null;
            this._checkers = null;
            this._machine = null;
            this.onAnimationIKObservable.clear();
            this.onAnimationIKObservable = null;
            this.onAnimationEndObservable.clear();
            this.onAnimationEndObservable = null;
            this.onAnimationLoopObservable.clear();
            this.onAnimationLoopObservable = null;
            this.onAnimationEventObservable.clear();
            this.onAnimationEventObservable = null;
            this.onAnimationUpdateObservable.clear();
            this.onAnimationUpdateObservable = null;
        }

        /* Animation Controller Private Update Functions */

        private updateAnimationState(deltaTime:number):void {
            if (this._machine.layers != null && this._machine.layers.length > 0) {
                this._machine.layers.forEach((layer:BABYLON.IAnimationLayer) => {
                    this.checkStateMachine(layer, deltaTime);
                });
            }
        }
        
        private updateAnimationTargets(deltaTime:number) :void {
            this._ikFrameEanbled = false;   // Reset Current Inverse Kinematics
            this._animationplaying = false; // Reset Current Animation Is Playing
            //this._bodyOrientationAngleY = 0;
            if (this.transform.rotationQuaternion != null) {
                //this._bodyOrientationAngleY = this.transform.rotationQuaternion.toEulerAngles().y; // TODO - OPTIMIZE THIS
            } else if (this.transform.rotation != null) {
                //this._bodyOrientationAngleY = this.transform.rotation.y;
            }
            if (this._machine.layers != null && this._machine.layers.length > 0) {
                this._machine.layers.forEach((layer:BABYLON.IAnimationLayer) => {
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (layer.index === 0) this._frametime = layer.animationTime;   // Note: Update Master Animation Frame Time
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (layer.animationStateMachine != null && layer.animationStateMachine.blendtree != null) {
                        if (layer.iKPass === true) {
                            if (layer.animationStateMachine.iKOnFeet === true) {
                                this._ikFrameEanbled = true;
                            }
                            if (this.onAnimationIKObservable.hasObservers() === true) {
                                this.onAnimationIKObservable.notifyObservers(layer.index);
                            }
                        }
                        const layerState:BABYLON.MachineState = layer.animationStateMachine;
                        if (layerState.type === BABYLON.MotionType.Clip && layerState.played !== -1) layerState.played += deltaTime;
                        if (layerState.blendtree.children != null && layerState.blendtree.children.length > 0) {
                            const primaryBlendTree:BABYLON.IBlendTreeChild = layerState.blendtree.children[0];
                            if (primaryBlendTree != null) {
                                if (layerState.blendtree.blendType == BABYLON.BlendTreeType.Clip) {
                                    const animationTrack:BABYLON.AnimationGroup = primaryBlendTree.track;
                                    if (animationTrack != null) {
                                        const frameRatio:number = (BABYLON.AnimationState.TIME / animationTrack.to);
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Motion Clip Animation Delta Time
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        layer.animationTime += (deltaTime * frameRatio * Math.abs(layerState.speed) * Math.abs(this.speedRatio) * BABYLON.AnimationState.SPEED);
                                        if (layer.animationTime > BABYLON.AnimationState.TIME) layer.animationTime = BABYLON.AnimationState.TIME;
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Motion Clip Animation Normalized Time
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        layer.animationNormal = (layer.animationTime / BABYLON.AnimationState.TIME);        // Note: Normalize Layer Frame Time
                                        const validateTime:number = (layer.animationNormal > 0.99) ? 1 : layer.animationNormal;
                                        const formattedTime:number = Math.round(validateTime * 100) / 100;
                                        if (layerState.speed < 0) layer.animationNormal = (1 - layer.animationNormal);      // Note: Reverse Normalized Frame Time
                                        const animationFrameTime:number = (animationTrack.to * layer.animationNormal);      // Note: Denormalize Animation Frame Time
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // let additivereferenceposeclip:number = 0;
                                        // let additivereferenceposetime:number = 0.0;
                                        // let hasadditivereferencepose:boolean = false;
                                        // let starttime:number = 0.0;
                                        // let stoptime:number = 0.0;
                                        // let mirror:boolean = false;
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        let level:number = 0.0;
                                        let xspeed:number = 0.0;
                                        let zspeed:number = 0.0;
                                        let looptime:boolean = false;
                                        //let loopblend:boolean = false;
                                        //let cycleoffset:number = 0.0;
                                        //let heightfromfeet:boolean = false;
                                        let orientationoffsety:number = 0.0;
                                        //let keeporiginalorientation:boolean = true;
                                        //let keeporiginalpositiony:boolean = true;
                                        //let keeporiginalpositionxz:boolean = true;
                                        let loopblendorientation:boolean = true;
                                        let loopblendpositiony:boolean = true;
                                        let loopblendpositionxz:boolean = true;
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        const agroup:any = animationTrack;
                                        if (agroup.metadata != null && agroup.metadata.unity != null) {
                                            if (agroup.metadata.unity.averagespeed != null) {
                                                xspeed = (agroup.metadata.unity.averagespeed.x != null) ? agroup.metadata.unity.averagespeed.x : 0;
                                                zspeed = (agroup.metadata.unity.averagespeed.z != null) ? agroup.metadata.unity.averagespeed.z : 0;
                                            }
                                            if (agroup.metadata.unity.settings != null) {
                                                level = (agroup.metadata.unity.settings.level != null) ? agroup.metadata.unity.settings.level : 0;
                                                looptime = (agroup.metadata.unity.settings.looptime != null) ? agroup.metadata.unity.settings.looptime : false;
                                                // DEPRECIATED: loopblend = (agroup.metadata.unity.settings.loopblend != null) ? agroup.metadata.unity.settings.loopblend : false;
                                                // DEPRECIATED: cycleoffset = (agroup.metadata.unity.settings.cycleoffset != null) ? agroup.metadata.unity.settings.cycleoffset : 0;
                                                // DEPRECIATED: heightfromfeet = (agroup.metadata.unity.settings.heightfromfeet != null) ? agroup.metadata.unity.settings.heightfromfeet : false;
                                                orientationoffsety = (agroup.metadata.unity.settings.orientationoffsety != null) ? agroup.metadata.unity.settings.orientationoffsety : 0;
                                                // DEPRECIATED: keeporiginalorientation = (agroup.metadata.unity.settings.keeporiginalorientation != null) ? agroup.metadata.unity.settings.keeporiginalorientation : true;
                                                // DEPRECIATED: keeporiginalpositiony = (agroup.metadata.unity.settings.keeporiginalpositiony != null) ? agroup.metadata.unity.settings.keeporiginalpositiony : true;
                                                // DEPRECIATED: keeporiginalpositionxz = (agroup.metadata.unity.settings.keeporiginalpositionxz != null) ? agroup.metadata.unity.settings.keeporiginalpositionxz : true;
                                                loopblendorientation = (agroup.metadata.unity.settings.loopblendorientation != null) ? agroup.metadata.unity.settings.loopblendorientation : true;
                                                loopblendpositiony = (agroup.metadata.unity.settings.loopblendpositiony != null) ? agroup.metadata.unity.settings.loopblendpositiony : true;
                                                loopblendpositionxz = (agroup.metadata.unity.settings.loopblendpositionxz != null) ? agroup.metadata.unity.settings.loopblendpositionxz : true;
                                            }
                                        }
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Unity Inverts Root Motion Animation Offsets
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        orientationoffsety = BABYLON.Tools.ToRadians(orientationoffsety);
                                        // DEPRECIATED: orientationoffsety *= -1;
                                        xspeed = Math.abs(xspeed);
                                        zspeed = Math.abs(zspeed);
                                        level *= -1;
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        if (layer.animationTime >= BABYLON.AnimationState.TIME) {
                                            layer.animationFirstRun = false;
                                            layer.animationLoopFrame = true;
                                            if (looptime === true) {
                                                layer.animationLoopCount++;
                                                if (this.onAnimationLoopObservable.hasObservers() === true) {
                                                    this.onAnimationLoopObservable.notifyObservers(layer.index);
                                                }
                                            } else {
                                                if (layer.animationEndFrame === false) {
                                                    layer.animationEndFrame = true;
                                                    if (this.onAnimationEndObservable.hasObservers() === true) {
                                                        this.onAnimationEndObservable.notifyObservers(layer.index);
                                                    }
                                                }
                                            }
                                        }
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        if (layer.animationFirstRun === true || looptime === true) {
                                            this._animationplaying = true;
                                            animationTrack.targetedAnimations.forEach((targetedAnim:BABYLON.TargetedAnimation) => {
                                                if (targetedAnim.target instanceof BABYLON.TransformNode) {
                                                    const clipTarget:BABYLON.TransformNode = targetedAnim.target;
                                                    if (layer.index === 0 || layer.avatarMask == null || this.filterTargetAvatarMask(layer, clipTarget)) {
                                                        const targetRootBone:boolean = (clipTarget.metadata != null && clipTarget.metadata.unity != null && clipTarget.metadata.unity.rootbone != null) ? clipTarget.metadata.unity.rootbone : false;
                                                        if (targetRootBone === true) {
                                                            if (this._initialRootBonePosition == null) {
                                                                const targetRootPos:number[] = (clipTarget.metadata != null && clipTarget.metadata.unity != null && clipTarget.metadata.unity.rootpos != null) ? clipTarget.metadata.unity.rootpos : null;
                                                                if (targetRootPos != null) this._initialRootBonePosition = BABYLON.Vector3.FromArray(targetRootPos);
                                                                if (this._initialRootBonePosition == null) this._initialRootBonePosition = new BABYLON.Vector3(0,0,0);                                                            
                                                                // console.warn("A - Init Root Bone Position: " + clipTarget.name);
                                                                // console.log(this._initialRootBonePosition);
                                                            }
                                                            if (this._initialRootBoneRotation == null) {
                                                                const targetRootRot:number[] = (clipTarget.metadata != null && clipTarget.metadata.unity != null && clipTarget.metadata.unity.rootrot != null) ? clipTarget.metadata.unity.rootrot : null;
                                                                if (targetRootRot != null) {
                                                                    const quat:BABYLON.Quaternion = BABYLON.Quaternion.FromArray(targetRootRot);
                                                                    this._initialRootBoneRotation = quat.toEulerAngles();
                                                                }
                                                                if (this._initialRootBoneRotation == null) this._initialRootBoneRotation = new BABYLON.Vector3(0,0,0);                                                            
                                                                // console.warn("A - Init Root Bone Rotation: " + clipTarget.name);
                                                                // console.log(this._initialRootBoneRotation);
                                                            }
                                                        }
                                                        if (clipTarget.metadata != null && clipTarget.metadata.mixer != null) {
                                                            const clipTargetMixer:BABYLON.AnimationMixer = clipTarget.metadata.mixer[layer.index];
                                                            if (clipTargetMixer != null) {
                                                                if (targetedAnim.animation.targetProperty === "position") {
                                                                    this._targetPosition = BABYLON.Utilities.SampleAnimationVector3(targetedAnim.animation, animationFrameTime);
                                                                    // ..
                                                                    // Handle Root Motion (Position)
                                                                    // ..
                                                                    if (targetRootBone === true && this._initialRootBonePosition != null) {
                                                                        this._positionWeight = true;
                                                                        this._positionHolder.copyFrom(this._initialRootBonePosition);
                                                                        this._rootBoneWeight = false;
                                                                        this._rootBoneHolder.set(0,0,0);
                                                                        // ..
                                                                        // Apply Root Motion
                                                                        // ..
                                                                        if (this.applyRootMotion === true) {
                                                                            if (loopblendpositiony === true && loopblendpositionxz === true) {
                                                                                this._positionWeight = true;        // Bake XYZ Into Pose
                                                                                this._positionHolder.set(this._targetPosition.x, (this._targetPosition.y + level), this._targetPosition.z);
                                                                            } else if (loopblendpositiony === false && loopblendpositionxz === false) {
                                                                                this._rootBoneWeight = true;        // Use XYZ As Root Motion
                                                                                this._rootBoneHolder.set(this._targetPosition.x, (this._targetPosition.y + level), this._targetPosition.z);
                                                                            } else if (loopblendpositiony === true && loopblendpositionxz === false) {
                                                                                this._positionWeight = true;        // Bake Y Into Pose 
                                                                                this._positionHolder.set(this._initialRootBonePosition.x, (this._targetPosition.y + level), this._initialRootBonePosition.z);
                                                                                this._rootBoneWeight = true;        // Use XZ As Root Motion
                                                                                this._rootBoneHolder.set(this._targetPosition.x, 0, this._targetPosition.z); // MAYBE: Use this.transform.position.y - ???
                                                                            } else if (loopblendpositionxz === true && loopblendpositiony === false) {
                                                                                this._positionWeight = true;        // Bake XZ Into Pose
                                                                                this._positionHolder.set(this._targetPosition.x, this._initialRootBonePosition.y, this._targetPosition.z);
                                                                                this._rootBoneWeight = true;        // Use Y As Root Motion
                                                                                this._rootBoneHolder.set(0, (this._targetPosition.y + level), 0); // MAYBE: Use this.transform.position.xz - ???
                                                                            }
                                                                        } else {
                                                                            this._positionWeight = true;            // Bake XYZ Original Motion
                                                                            this._positionHolder.set(this._targetPosition.x, (this._targetPosition.y + level), this._targetPosition.z);
                                                                        }
                                                                        // Bake Position Holder
                                                                        if (this._positionWeight === true) {
                                                                            if (clipTargetMixer.positionBuffer == null) clipTargetMixer.positionBuffer = new BABYLON.Vector3(0,0,0);
                                                                            BABYLON.Utilities.BlendVector3Value(clipTargetMixer.positionBuffer, this._positionHolder, 1.0);
                                                                        }
                                                                        // Bake Root Bone Holder
                                                                        if (this._rootBoneWeight === true) {
                                                                            if (clipTargetMixer.rootPosition == null) clipTargetMixer.rootPosition = new BABYLON.Vector3(0,0,0);
                                                                            BABYLON.Utilities.BlendVector3Value(clipTargetMixer.rootPosition, this._rootBoneHolder, 1.0);
                                                                        }
                                                                    } else {
                                                                        // Bake Normal Pose Position
                                                                        if (clipTargetMixer.positionBuffer == null) clipTargetMixer.positionBuffer = new BABYLON.Vector3(0,0,0);
                                                                        BABYLON.Utilities.BlendVector3Value(clipTargetMixer.positionBuffer, this._targetPosition, 1.0);
                                                                    }
                                                                } else if (targetedAnim.animation.targetProperty === "rotationQuaternion") {
                                                                    this._targetRotation = BABYLON.Utilities.SampleAnimationQuaternion(targetedAnim.animation, animationFrameTime);
                                                                    // ..
                                                                    // Handle Root Motion (Rotation)
                                                                    // ..
                                                                    if (targetRootBone === true) {
                                                                        this._rotationWeight = false;
                                                                        this._rotationHolder.set(0,0,0,0);
                                                                        this._rootQuatWeight = false;
                                                                        this._rootQuatHolder.set(0,0,0,0);
                                                                        // TODO - OPTIMIZE TO EULER ANGLES
                                                                        const eulerAngle:BABYLON.Vector3 = this._targetRotation.toEulerAngles();
                                                                        const orientationAngleY:number = eulerAngle.y; //(keeporiginalorientation === true) ? eulerAngle.y : this._bodyOrientationAngleY;
                                                                        // ..
                                                                        // Apply Root Motion
                                                                        // ..
                                                                        if (this.applyRootMotion === true) {
                                                                            if (loopblendorientation === true) {
                                                                                this._rotationWeight = true;        // Bake XYZ Into Pose
                                                                                BABYLON.Quaternion.FromEulerAnglesToRef(eulerAngle.x, (orientationAngleY + orientationoffsety), eulerAngle.z, this._rotationHolder);
                                                                            } else {
                                                                                this._rotationWeight = true;        // Bake XZ Into Pose
                                                                                BABYLON.Quaternion.FromEulerAnglesToRef(eulerAngle.x, this._initialRootBoneRotation.y, eulerAngle.z, this._rotationHolder);
                                                                                this._rootQuatWeight = true;        // Use Y As Root Motion
                                                                                BABYLON.Quaternion.FromEulerAnglesToRef(0, (orientationAngleY + orientationoffsety), 0, this._rootQuatHolder); // MAYBE: Use this.transform.rotation.xz - ???
                                                                            }
                                                                        } else {
                                                                            this._rotationWeight = true;            // Bake XYZ Into Pose
                                                                            BABYLON.Quaternion.FromEulerAnglesToRef(eulerAngle.x, (orientationAngleY + orientationoffsety), eulerAngle.z, this._rotationHolder);
                                                                        }
                                                                        // Bake Rotation Holder
                                                                        if (this._rotationWeight === true) {
                                                                            if (clipTargetMixer.rotationBuffer == null) clipTargetMixer.rotationBuffer = new BABYLON.Quaternion(0,0,0,1);
                                                                            BABYLON.Utilities.BlendQuaternionValue(clipTargetMixer.rotationBuffer, this._rotationHolder, 1.0);
                                                                        }
                                                                        // Bake Root Bone Rotation
                                                                        if (this._rootQuatWeight === true) {
                                                                            if (clipTargetMixer.rootRotation == null) clipTargetMixer.rootRotation = new BABYLON.Quaternion(0,0,0,1);
                                                                            BABYLON.Utilities.BlendQuaternionValue(clipTargetMixer.rootRotation, this._rootQuatHolder, 1.0);
                                                                        }
                                                                    } else {
                                                                        // Bake Normal Pose Rotation
                                                                        if (clipTargetMixer.rotationBuffer == null) clipTargetMixer.rotationBuffer = new BABYLON.Quaternion(0,0,0,1);
                                                                        BABYLON.Utilities.BlendQuaternionValue(clipTargetMixer.rotationBuffer, this._targetRotation, 1.0);
                                                                    }
                                                                } else if (targetedAnim.animation.targetProperty === "scaling") {
                                                                    this._targetScaling = BABYLON.Utilities.SampleAnimationVector3(targetedAnim.animation, animationFrameTime);
                                                                    if (clipTargetMixer.scalingBuffer == null) clipTargetMixer.scalingBuffer = new BABYLON.Vector3(1,1,1);
                                                                    BABYLON.Utilities.BlendVector3Value(clipTargetMixer.scalingBuffer, this._targetScaling, 1.0);
                                                                }
                                                            }
                                                        }
                                                    }
                                                } else if (targetedAnim.target instanceof BABYLON.MorphTarget) {
                                                    const morphTarget:any = targetedAnim.target;
                                                    if (morphTarget.metadata != null && morphTarget.metadata.mixer != null) {
                                                        const morphTargetMixer:BABYLON.AnimationMixer = morphTarget.metadata.mixer[layer.index];
                                                        if (targetedAnim.animation.targetProperty === "influence") {
                                                            const floatValue = BABYLON.Utilities.SampleAnimationFloat(targetedAnim.animation, animationFrameTime);
                                                            if (morphTargetMixer.influenceBuffer == null) morphTargetMixer.influenceBuffer = 0;
                                                            morphTargetMixer.influenceBuffer = BABYLON.Utilities.BlendFloatValue(morphTargetMixer.influenceBuffer, floatValue, 1.0);
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Parse Layer Animation Curves
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        if (layer.animationStateMachine.tcurves != null && layer.animationStateMachine.tcurves.length > 0) {
                                            layer.animationStateMachine.tcurves.forEach((animation:BABYLON.Animation) => {
                                                if (animation.targetProperty != null && animation.targetProperty !== "") {
                                                    const sample:number = BABYLON.Utilities.SampleAnimationFloat(animation, layer.animationNormal);
                                                    this.setFloat(animation.targetProperty, sample);
                                                }
                                            });
                                        }
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Validate Layer Animation Events (TODO - Pass Layer Index Properties To Observers)
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        if (layer.animationStateMachine.events != null && layer.animationStateMachine.events.length > 0) {
                                            layer.animationStateMachine.events.forEach((animatorEvent:BABYLON.IAnimatorEvent) => {
                                                if (animatorEvent.time === formattedTime) {
                                                    const animEventKey:string = animatorEvent.function + "_" + animatorEvent.time;
                                                    if (layer.animationLoopEvents == null) layer.animationLoopEvents = {};
                                                    if (!layer.animationLoopEvents[animEventKey]) {
                                                        layer.animationLoopEvents[animEventKey] = true;
                                                        // console.log("Blend Tree Animation Event: " + animatorEvent.time + " >> " + animatorEvent.clip + " >> " + animatorEvent.function);
                                                        if (this.onAnimationEventObservable.hasObservers() === true) {
                                                            this.onAnimationEventObservable.notifyObservers(animatorEvent);
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        // Step Motion Clip Animation Time
                                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                        if (layer.animationLoopFrame === true) {
                                            layer.animationTime = 0;
                                            layer.animationNormal = 0;
                                            layer.animationLoopFrame = false;
                                            layer.animationLoopEvents = null;
                                        }
                                    } else {
                                        // console.warn(">>> No Motion Clip Animation Track Found For: " + this.transform.name);
                                    }
                                } else {
                                    this._animationplaying = true; // Note: Blend Tree Are Always Playing
                                    // this._blendMessage = "";
                                    this._blendWeights.primary = null;
                                    this._blendWeights.secondary = null;
                                    const scaledWeightList:BABYLON.IBlendTreeChild[] = [];
                                    const primaryBlendTree:BABYLON.IBlendTree = layerState.blendtree;
                                    this.parseTreeBranches(layer, primaryBlendTree, 1.0, scaledWeightList);
                                    const frameRatio:number = this.computeWeightedFrameRatio(scaledWeightList);
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // Blend Tree Animation Delta Time
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    layer.animationTime += (deltaTime * frameRatio * Math.abs(layerState.speed) * Math.abs(this.speedRatio) * BABYLON.AnimationState.SPEED);
                                    if (layer.animationTime > BABYLON.AnimationState.TIME) layer.animationTime = BABYLON.AnimationState.TIME;
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // Blend Tree Animation Normalized Time
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    layer.animationNormal = (layer.animationTime / BABYLON.AnimationState.TIME);        // Note: Normalize Layer Frame Time
                                    const validateTime:number = (layer.animationNormal > 0.99) ? 1 : layer.animationNormal;
                                    const formattedTime:number = Math.round(validateTime * 100) / 100;
                                    if (layerState.speed < 0) layer.animationNormal = (1 - layer.animationNormal);      // Note: Reverse Normalized Frame Time
                                    const blendingNormalTime:number = layer.animationNormal;                            // Note: Denormalize Animation Frame Time
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    if (layer.animationTime >= BABYLON.AnimationState.TIME) {
                                        layer.animationFirstRun = false;
                                        layer.animationLoopFrame = true; // Note: No Loop Or End Events For Blend Trees - ???
                                        layer.animationLoopCount++;
                                    }
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    const masterAnimationTrack:BABYLON.AnimationGroup = (scaledWeightList != null && scaledWeightList.length > 0 && scaledWeightList[0].track != null) ? scaledWeightList[0].track : null;
                                    if (masterAnimationTrack != null) {
                                        const targetCount:number = masterAnimationTrack.targetedAnimations.length;
                                        for (let targetIndex:number = 0; targetIndex < targetCount; targetIndex++) {
                                            const masterAnimimation:BABYLON.TargetedAnimation = masterAnimationTrack.targetedAnimations[targetIndex];
                                            if (masterAnimimation.target instanceof BABYLON.TransformNode) {
                                                const blendTarget:BABYLON.TransformNode = masterAnimimation.target;
                                                if (layer.index === 0 || layer.avatarMask == null || this.filterTargetAvatarMask(layer, blendTarget)) {
                                                    const targetRootBone:boolean = (blendTarget.metadata != null && blendTarget.metadata.unity != null && blendTarget.metadata.unity.rootbone != null) ? blendTarget.metadata.unity.rootbone : false;
                                                    if (targetRootBone === true) {
                                                        if (this._initialRootBonePosition == null) {
                                                            const targetRootPos:number[] = (blendTarget.metadata != null && blendTarget.metadata.unity != null && blendTarget.metadata.unity.rootpos != null) ? blendTarget.metadata.unity.rootpos : null;
                                                            if (targetRootPos != null) this._initialRootBonePosition = BABYLON.Vector3.FromArray(targetRootPos);
                                                            if (this._initialRootBonePosition == null) this._initialRootBonePosition = new BABYLON.Vector3(0,0,0);                                                            
                                                            // console.warn("B - Init Root Bone Position: " + blendTarget.name);
                                                            // console.log(this._initialRootBonePosition);
                                                        }
                                                        if (this._initialRootBoneRotation == null) {
                                                            const targetRootRot:number[] = (blendTarget.metadata != null && blendTarget.metadata.unity != null && blendTarget.metadata.unity.rootrot != null) ? blendTarget.metadata.unity.rootrot : null;
                                                            if (targetRootRot != null) {
                                                                const quat:BABYLON.Quaternion = BABYLON.Quaternion.FromArray(targetRootRot);
                                                                this._initialRootBoneRotation = quat.toEulerAngles();
                                                            }
                                                            if (this._initialRootBoneRotation == null) this._initialRootBoneRotation = new BABYLON.Vector3(0,0,0);                                                            
                                                            // console.warn("B - Init Root Bone Rotation: " + blendTarget.name);
                                                            // console.log(this._initialRootBoneRotation);
                                                        }
                                                    }
                                                    if (blendTarget.metadata != null && blendTarget.metadata.mixer != null) {
                                                        this._initialtargetblending = true; // Note: Reset First Target Blending Buffer
                                                        const blendTargetMixer:BABYLON.AnimationMixer = blendTarget.metadata.mixer[layer.index];
                                                        this.updateBlendableTargets(deltaTime, layer, primaryBlendTree, masterAnimimation, targetIndex, blendTargetMixer, blendingNormalTime, targetRootBone, blendTarget);
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        // console.warn(">>> No Blend Tree Master Animation Track Found For: " + this.transform.name);
                                    }
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // Parse Layer Animation Curves
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    if (layer.animationStateMachine.tcurves != null && layer.animationStateMachine.tcurves.length > 0) {
                                        layer.animationStateMachine.tcurves.forEach((animation:BABYLON.Animation) => {
                                            if (animation.targetProperty != null && animation.targetProperty !== "") {
                                                const sample:number = BABYLON.Utilities.SampleAnimationFloat(animation, layer.animationNormal);
                                                this.setFloat(animation.targetProperty, sample);
                                            }
                                        });
                                    }
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // Validate Layer Animation Events (TODO - Pass Layer Index And Clip Blended Weight Properties To Observers)
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    if (layer.animationStateMachine.events != null && layer.animationStateMachine.events.length > 0) {
                                        layer.animationStateMachine.events.forEach((animatorEvent:BABYLON.IAnimatorEvent) => {
                                            if (animatorEvent.time === formattedTime) {
                                                const animEventKey:string = animatorEvent.function + "_" + animatorEvent.time;
                                                if (layer.animationLoopEvents == null) layer.animationLoopEvents = {};
                                                if (!layer.animationLoopEvents[animEventKey]) {
                                                    layer.animationLoopEvents[animEventKey] = true;
                                                    // console.log("Blend Tree Animation Event: " + animatorEvent.time + " >> " + animatorEvent.clip + " >> " + animatorEvent.function);
                                                    if (this.onAnimationEventObservable.hasObservers() === true) {
                                                        this.onAnimationEventObservable.notifyObservers(animatorEvent);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // Step Blend Tree Animation Time
                                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    if (layer.animationLoopFrame === true) {
                                        layer.animationTime = 0;
                                        layer.animationNormal = 0;
                                        layer.animationLoopFrame = false;
                                        layer.animationLoopEvents = null;
                                    }
                                }
                            }
                        }
                    }
                });
            }
            this.finalizeAnimationTargets();
        }

        // private _blendMessage:string = "";
        private updateBlendableTargets(deltaTime:number, layer:BABYLON.IAnimationLayer, tree:BABYLON.IBlendTree, masterAnimation:BABYLON.TargetedAnimation, targetIndex:number, targetMixer:BABYLON.AnimationMixer, normalizedFrameTime:number, targetRootBone:boolean, blendTarget:BABYLON.TransformNode):void {
            if (targetMixer != null && tree.children != null && tree.children.length > 0) {
                for (let index = 0; index < tree.children.length; index++) {
                    const child:BABYLON.IBlendTreeChild = tree.children[index];
                    if (child.weight > 0) {
                        if (child.type === BABYLON.MotionType.Clip) {
                            if (child.track != null) {
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                // let additivereferenceposeclip:number = 0;
                                // let additivereferenceposetime:number = 0.0;
                                // let hasadditivereferencepose:boolean = false;
                                // let starttime:number = 0.0;
                                // let stoptime:number = 0.0;
                                // let mirror:boolean = false;
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                // let looptime:boolean = true;
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                let level:number = 0.0;
                                let xspeed:number = 0.0;
                                let zspeed:number = 0.0;
                                //let loopblend:boolean = false;
                                //let cycleoffset:number = 0.0;
                                //let heightfromfeet:boolean = false;
                                let orientationoffsety:number = 0.0;
                                //let keeporiginalorientation:boolean = true;
                                //let keeporiginalpositiony:boolean = true;
                                //let keeporiginalpositionxz:boolean = true;
                                let loopblendorientation:boolean = true;
                                let loopblendpositiony:boolean = true;
                                let loopblendpositionxz:boolean = true;
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                const agroup:any = child.track;
                                if (agroup.metadata != null && agroup.metadata.unity != null) {
                                    if (agroup.metadata.unity.averagespeed != null) {
                                        xspeed = (agroup.metadata.unity.averagespeed.x != null) ? agroup.metadata.unity.averagespeed.x : 0;
                                        zspeed = (agroup.metadata.unity.averagespeed.z != null) ? agroup.metadata.unity.averagespeed.z : 0;
                                    }
                                    if (agroup.metadata.unity.settings != null) {
                                        level = (agroup.metadata.unity.settings.level != null) ? agroup.metadata.unity.settings.level : 0;
                                        // DEPRECIATED: loopblend = (agroup.metadata.unity.settings.loopblend != null) ? agroup.metadata.unity.settings.loopblend : false;
                                        // DEPRECIATED: cycleoffset = (agroup.metadata.unity.settings.cycleoffset != null) ? agroup.metadata.unity.settings.cycleoffset : 0;
                                        // DEPRECIATED: heightfromfeet = (agroup.metadata.unity.settings.heightfromfeet != null) ? agroup.metadata.unity.settings.heightfromfeet : false;
                                        orientationoffsety = (agroup.metadata.unity.settings.orientationoffsety != null) ? agroup.metadata.unity.settings.orientationoffsety : 0;
                                        // DEPRECIATED: keeporiginalorientation = (agroup.metadata.unity.settings.keeporiginalorientation != null) ? agroup.metadata.unity.settings.keeporiginalorientation : true;
                                        // DEPRECIATED: keeporiginalpositiony = (agroup.metadata.unity.settings.keeporiginalpositiony != null) ? agroup.metadata.unity.settings.keeporiginalpositiony : true;
                                        // DEPRECIATED: keeporiginalpositionxz = (agroup.metadata.unity.settings.keeporiginalpositionxz != null) ? agroup.metadata.unity.settings.keeporiginalpositionxz : true;
                                        loopblendorientation = (agroup.metadata.unity.settings.loopblendorientation != null) ? agroup.metadata.unity.settings.loopblendorientation : true;
                                        loopblendpositiony = (agroup.metadata.unity.settings.loopblendpositiony != null) ? agroup.metadata.unity.settings.loopblendpositiony : true;
                                        loopblendpositionxz = (agroup.metadata.unity.settings.loopblendpositionxz != null) ? agroup.metadata.unity.settings.loopblendpositionxz : true;
                                    }
                                }
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                // Unity Inverts Root Motion Animation Offsets
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                orientationoffsety = BABYLON.Tools.ToRadians(orientationoffsety);
                                // DEPRECIATED: orientationoffsety *= -1;
                                xspeed = Math.abs(xspeed);
                                zspeed = Math.abs(zspeed);
                                level *= -1;
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                // this._blendMessage += (" >>> " + child.motion + ": " + child.weight.toFixed(2));
                                //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                
                                // TODO - Get blendable animation from target map - ???
                                const blendableAnim:BABYLON.TargetedAnimation = child.track.targetedAnimations[targetIndex];
                                const blendableWeight:number = (this._initialtargetblending === true) ? 1.0 : parseFloat(child.weight.toFixed(2));
                                this._initialtargetblending = false; // Note: Clear First Target Blending Buffer
                                if (blendableAnim.target === masterAnimation.target && blendableAnim.animation.targetProperty === masterAnimation.animation.targetProperty ) {
                                    let adjustedFrameTime:number = normalizedFrameTime;                     // Note: Adjust Normalized Frame Time
                                    if (child.timescale < 0) adjustedFrameTime = (1 - adjustedFrameTime);   // Note: Reverse Normalized Frame Time
                                    const animationFrameTime:number = (child.track.to * adjustedFrameTime); // Note: Denormalize Animation Frame Time
                                    //const animationFrameTime:number = (Math.round((child.track.to * adjustedFrameTime) * 100) / 100);  // Note: Denormalize Animation Frame Time
                                    if (masterAnimation.animation.targetProperty === "position") {
                                        this._targetPosition = BABYLON.Utilities.SampleAnimationVector3(blendableAnim.animation, animationFrameTime);
                                        // ..
                                        // Root Transform Position
                                        // ..
                                        if (targetRootBone === true && this._initialRootBonePosition != null) {
                                            this._positionWeight = true;
                                            this._positionHolder.copyFrom(this._initialRootBonePosition);
                                            this._rootBoneWeight = false;
                                            this._rootBoneHolder.set(0,0,0);
                                            // ..
                                            // Apply Root Motion
                                            // ..
                                            if (this.applyRootMotion === true) {
                                                if (loopblendpositiony === true && loopblendpositionxz === true) {
                                                    this._positionWeight = true;        // Bake XYZ Into Pose
                                                    this._positionHolder.set(this._targetPosition.x, (this._targetPosition.y + level), this._targetPosition.z);
                                                } else if (loopblendpositiony === false && loopblendpositionxz === false) {
                                                    this._rootBoneWeight = true;        // Use XYZ As Root Motion
                                                    this._rootBoneHolder.set(this._targetPosition.x, (this._targetPosition.y + level), this._targetPosition.z);
                                                } else if (loopblendpositiony === true && loopblendpositionxz === false) {
                                                    this._positionWeight = true;        // Bake Y Into Pose 
                                                    this._positionHolder.set(this._initialRootBonePosition.x, (this._targetPosition.y + level), this._initialRootBonePosition.z);
                                                    this._rootBoneWeight = true;        // Use XZ As Root Motion
                                                    this._rootBoneHolder.set(this._targetPosition.x, 0, this._targetPosition.z); // MAYBE: Use this.transform.position.y - ???
                                                } else if (loopblendpositionxz === true && loopblendpositiony === false) {
                                                    this._positionWeight = true;        // Bake XZ Into Pose
                                                    this._positionHolder.set(this._targetPosition.x, this._initialRootBonePosition.y, this._targetPosition.z);
                                                    this._rootBoneWeight = true;        // Use Y As Root Motion
                                                    this._rootBoneHolder.set(0, (this._targetPosition.y + level), 0); // MAYBE: Use this.transform.position.xz - ???
                                                }
                                            } else {
                                                this._positionWeight = true;        // Bake XYZ Original Motion
                                                this._positionHolder.set(this._targetPosition.x, (this._targetPosition.y + level), this._targetPosition.z);
                                            }
                                            // Bake Position Holder
                                            if (this._positionWeight === true) {
                                                if (targetMixer.positionBuffer == null) targetMixer.positionBuffer = new BABYLON.Vector3(0,0,0);
                                                BABYLON.Utilities.BlendVector3Value(targetMixer.positionBuffer, this._positionHolder, blendableWeight);
                                            }
                                            // Bake Root Bone Holder
                                            if (this._rootBoneWeight === true) {
                                                if (targetMixer.rootPosition == null) targetMixer.rootPosition = new BABYLON.Vector3(0,0,0);
                                                BABYLON.Utilities.BlendVector3Value(targetMixer.rootPosition, this._rootBoneHolder, blendableWeight);
                                            }
                                        } else {
                                            // Bake Normal Pose Position
                                            if (targetMixer.positionBuffer == null) targetMixer.positionBuffer = new BABYLON.Vector3(0,0,0);
                                            BABYLON.Utilities.BlendVector3Value(targetMixer.positionBuffer, this._targetPosition, blendableWeight);
                                        }
                                    } else if (masterAnimation.animation.targetProperty === "rotationQuaternion") {
                                        this._targetRotation = BABYLON.Utilities.SampleAnimationQuaternion(blendableAnim.animation, animationFrameTime);
                                        // ..
                                        // Root Transform Rotation
                                        // ..
                                        if (targetRootBone === true) {
                                            this._rotationWeight = false;
                                            this._rotationHolder.set(0,0,0,0);
                                            this._rootQuatWeight = false;
                                            this._rootQuatHolder.set(0,0,0,0);
                                            const eulerAngle:BABYLON.Vector3 = this._targetRotation.toEulerAngles();
                                            const orientationAngleY:number = eulerAngle.y; //(keeporiginalorientation === true) ? eulerAngle.y : this._bodyOrientationAngleY;
                                            // ..
                                            // Apply Root Motion
                                            // ..
                                            if (this.applyRootMotion === true) {
                                                if (loopblendorientation === true) {
                                                    this._rotationWeight = true;        // Bake XYZ Into Pose
                                                    BABYLON.Quaternion.FromEulerAnglesToRef(eulerAngle.x, (orientationAngleY + orientationoffsety), eulerAngle.z, this._rotationHolder);
                                                } else {
                                                    this._rotationWeight = true;        // Bake XZ Into Pose
                                                    BABYLON.Quaternion.FromEulerAnglesToRef(eulerAngle.x, this._initialRootBoneRotation.y, eulerAngle.z, this._rotationHolder);
                                                    this._rootQuatWeight = true;        // Use Y As Root Motion
                                                    BABYLON.Quaternion.FromEulerAnglesToRef(0, (orientationAngleY + orientationoffsety), 0, this._rootQuatHolder); // MAYBE: Use this.transform.rotation.xz - ???
                                                }
                                            } else {
                                                this._rotationWeight = true;            // Bake XYZ Into Pose
                                                BABYLON.Quaternion.FromEulerAnglesToRef(eulerAngle.x, (orientationAngleY + orientationoffsety), eulerAngle.z, this._rotationHolder);
                                            }
                                            // Bake Rotation Holder
                                            if (this._rotationWeight === true) {
                                                if (targetMixer.rotationBuffer == null) targetMixer.rotationBuffer = new BABYLON.Quaternion(0,0,0,1);
                                                BABYLON.Utilities.BlendQuaternionValue(targetMixer.rotationBuffer, this._rotationHolder, blendableWeight);
                                            }
                                            // Bake Root Bone Rotation
                                            if (this._rootQuatWeight === true) {
                                                if (targetMixer.rootRotation == null) targetMixer.rootRotation = new BABYLON.Quaternion(0,0,0,1);
                                                BABYLON.Utilities.BlendQuaternionValue(targetMixer.rootRotation, this._rootQuatHolder, blendableWeight);
                                            }
                                        } else {
                                            // Bake Normal Pose Rotation
                                            if (targetMixer.rotationBuffer == null) targetMixer.rotationBuffer = new BABYLON.Quaternion(0,0,0,1);
                                            BABYLON.Utilities.BlendQuaternionValue(targetMixer.rotationBuffer, this._targetRotation, blendableWeight);
                                        }
                                    } else if (masterAnimation.animation.targetProperty === "scaling") {
                                        this._targetScaling = BABYLON.Utilities.SampleAnimationVector3(blendableAnim.animation, animationFrameTime);
                                        if (targetMixer.scalingBuffer == null) targetMixer.scalingBuffer = new BABYLON.Vector3(1,1,1);
                                        BABYLON.Utilities.BlendVector3Value(targetMixer.scalingBuffer, this._targetScaling, blendableWeight);
                                    }
                                } else {
                                    BABYLON.Tools.Warn(tree.name + " - " + child.track.name  + " blend tree mismatch (" + targetIndex + "): " + masterAnimation.target.name + " >>> " + blendableAnim.target.name);
                                }
                            }
                        } else if (child.type === BABYLON.MotionType.Tree) {
                            this.updateBlendableTargets(deltaTime, layer, child.subtree, masterAnimation, targetIndex, targetMixer, normalizedFrameTime, targetRootBone, blendTarget);
                        }
                    }
                }
            }
            //if (targetIndex === 0) BABYLON.Utilities.PrintToScreen(this._blendMessage, "red");
        }

        private finalizeAnimationTargets():void {
            this._deltaPosition.set(0,0,0);
            this._deltaRotation.set(0,0,0,1);
            this._deltaPositionFixed.set(0,0,0);
            this._dirtyMotionMatrix = null;
            if (this.m_animationTargets != null && this.m_animationTargets.length > 0) {
                this.m_animationTargets.forEach((targetedAnim:BABYLON.TargetedAnimation) => {
                    const animationTarget:any = targetedAnim.target;
                    // ..
                    // Update Direct Transform Targets For Each Layer
                    // ..
                    if (animationTarget.metadata != null && animationTarget.metadata.mixer != null) {
                        if (this._machine.layers != null && this._machine.layers.length > 0) {
                            this._blenderMatrix.reset();                        
                            this._dirtyBlenderMatrix = null;
                            this._machine.layers.forEach((layer:BABYLON.IAnimationLayer) => {
                                const animationTargetMixer:BABYLON.AnimationMixer = animationTarget.metadata.mixer[layer.index];
                                if (animationTargetMixer != null) {
                                    if (animationTarget instanceof BABYLON.TransformNode) {
                                        // ..
                                        // Update Dirty Transform Matrix
                                        // ..
                                        if (animationTargetMixer.positionBuffer != null || animationTargetMixer.rotationBuffer != null || animationTargetMixer.scalingBuffer != null) {
                                            BABYLON.Matrix.ComposeToRef(
                                                (animationTargetMixer.scalingBuffer || animationTarget.scaling),
                                                (animationTargetMixer.rotationBuffer || animationTarget.rotationQuaternion),
                                                (animationTargetMixer.positionBuffer || animationTarget.position),
                                                this._updateMatrix
                                            );
                                            if (animationTargetMixer.blendingSpeed > 0.0) {
                                                if (animationTargetMixer.blendingFactor <= 1.0 && animationTargetMixer.originalMatrix == null) {
                                                    animationTargetMixer.originalMatrix = BABYLON.Matrix.Compose(
                                                        (animationTarget.scaling),
                                                        (animationTarget.rotationQuaternion),
                                                        (animationTarget.position)
                                                    );
                                                }
                                                if (animationTargetMixer.blendingFactor <= 1.0 && animationTargetMixer.originalMatrix != null) {
                                                    BABYLON.Utilities.FastMatrixSlerp(animationTargetMixer.originalMatrix, this._updateMatrix, animationTargetMixer.blendingFactor, this._updateMatrix);
                                                    animationTargetMixer.blendingFactor += animationTargetMixer.blendingSpeed;
                                                }
                                            }
                                            BABYLON.Utilities.FastMatrixSlerp(this._blenderMatrix, this._updateMatrix, layer.defaultWeight, this._blenderMatrix);
                                            this._dirtyBlenderMatrix = true;
                                            animationTargetMixer.positionBuffer = null;
                                            animationTargetMixer.rotationBuffer = null;
                                            animationTargetMixer.scalingBuffer = null;
                                        }
                                        // ..
                                        // Update Dirty Root Motion Matrix
                                        // ..
                                        if (animationTargetMixer.rootPosition != null || animationTargetMixer.rootRotation != null) {
                                            BABYLON.Matrix.ComposeToRef(
                                                (this._emptyScaling),
                                                (animationTargetMixer.rootRotation || this._emptyRotation),
                                                (animationTargetMixer.rootPosition || this._emptyPosition),
                                                this._updateMatrix
                                            );
                                            // ..
                                            // TODO - May Need Seperate Blending Speed Properties
                                            // Note: Might Fix Large Root Motion Delta Issue - ???
                                            // ..
                                            /*
                                            if (animationTargetMixer.blendingSpeed > 0.0) {
                                                if (animationTargetMixer.blendingFactor <= 1.0 && animationTargetMixer.originalMatrix == null) {
                                                    animationTargetMixer.originalMatrix = BABYLON.Matrix.Compose(
                                                        (this.transform.scaling),
                                                        (this.transform.rotationQuaternion),
                                                        (this.transform.position)
                                                    );
                                                }
                                                if (animationTargetMixer.blendingFactor <= 1.0 && animationTargetMixer.originalMatrix != null) {
                                                    BABYLON.Utilities.FastMatrixSlerp(animationTargetMixer.originalMatrix, this._updateMatrix, animationTargetMixer.blendingFactor, this._updateMatrix);
                                                    animationTargetMixer.blendingFactor += animationTargetMixer.blendingSpeed;
                                                }
                                            }
                                            */
                                            BABYLON.Utilities.FastMatrixSlerp(this._rootMotionMatrix, this._updateMatrix, layer.defaultWeight, this._rootMotionMatrix);
                                            this._dirtyMotionMatrix = true;
                                            animationTargetMixer.rootPosition = null;
                                            animationTargetMixer.rootRotation = null;
                                        }
                                    } else if (animationTarget instanceof BABYLON.MorphTarget) {
                                        if (animationTargetMixer.influenceBuffer != null) {
                                            animationTarget.influence = BABYLON.Scalar.Lerp(animationTarget.influence, animationTargetMixer.influenceBuffer, layer.defaultWeight);
                                            animationTargetMixer.influenceBuffer = null;
                                        }
                                    }
                                }
                            });
                            if (this._dirtyBlenderMatrix != null) {
                                this._blenderMatrix.decompose(animationTarget.scaling, animationTarget.rotationQuaternion, animationTarget.position);
                            }
                        }
                    }
                });
            }
            // ..
            if (this.applyRootMotion === true) {
                if (this._dirtyMotionMatrix != null) {
                    this._rootMotionMatrix.decompose(this._rootMotionScaling, this._rootMotionRotation, this._rootMotionPosition);
                    if (this._frametime === 0) { 
                        this._lastMotionPosition.copyFrom(this._rootMotionPosition);
                        this._lastMotionRotation.copyFrom(this._rootMotionRotation);
                    }
                    // ..
                    // Update Current Delta Position
                    // ..
                    this._rootMotionPosition.subtractToRef(this._lastMotionPosition, this._deltaPosition);
                    // ..
                    // Update Current Delta Rotation
                    // ..
                    BABYLON.Utilities.QuaternionDiffToRef(this._rootMotionRotation, this._lastMotionRotation, this._deltaRotation);
                    this._deltaRotation.toEulerAnglesToRef(this._angularVelocity);
                    // ..
                    // Update Last Root Motion Deltas
                    // ..
                    this._saveDeltaPosition.copyFrom(this._deltaPosition);
                    this._saveDeltaRotation.copyFrom(this._deltaRotation);
                    this._lastMotionPosition.addInPlace(this._deltaPosition);
                    this._lastMotionRotation.multiplyInPlace(this._deltaRotation);
                    // ..
                    // Update Root Motion Transformation
                    // ..
                    this.transform.rotationQuaternion.toRotationMatrix(this._deltaPositionMatrix); // TODO: Optimize Rotation Matrix Is Dirty - ???
                    BABYLON.Vector3.TransformCoordinatesToRef(this._deltaPosition, this._deltaPositionMatrix, this._deltaPositionFixed);
                }
                // ..
                // Update Transform Delta Rotation
                // ..
                if (this.updateRootMotionRotation === true) {
                    this.transform.addRotation(0, this._angularVelocity.y, 0); // Note: Always Rotate The Transform Node
                }
                // ..
                // Update Transform Delta Position
                // ..
                if (this.updateRootMotionPosition === true) {
                    if (this._updatemode === 1 && this.m_characterController != null) {
                        // TODO: Use Character Controller To Move Entity - ???
                    } else {
                        if (this.m_characterController != null) {
                            // TODO: Set Character Controller Update Position And Sync With Transform (If Exists)
                        }
                        this.transform.position.addInPlace(this._deltaPositionFixed);
                    }
                }
            }
        }

        private checkStateMachine(layer:BABYLON.IAnimationLayer, deltaTime:number):void {
            this._checkers.result = null;
            this._checkers.offest = 0;
            this._checkers.blending = 0;
            this._checkers.triggered = [];
            // ..
            // Check Animation State Transitions
            // ..
            if (layer.animationStateMachine != null) {
                layer.animationStateMachine.time += deltaTime; // Update State Timer
                // Check Local Transition Conditions
                this.checkStateTransitions(layer, layer.animationStateMachine.transitions);
                // Check Any State Transition Conditions
                if (this._checkers.result == null && this._machine.transitions != null) {
                    this.checkStateTransitions(layer, this._machine.transitions);
                }
            }
            // ..
            // Reset Transition Condition Triggers
            // ..
            if (this._checkers.triggered != null && this._checkers.triggered.length > 0) {
                this._checkers.triggered.forEach((trigger) => { this.resetTrigger(trigger); });
                this._checkers.triggered = null;
            }
            // ..
            // Set Current Machine State Result
            // ..
            if (this._checkers.result != null) {
                this.playCurrentAnimationState(layer, this._checkers.result, this._checkers.blending, this._checkers.offest);
            }
        }
        private checkStateTransitions(layer:BABYLON.IAnimationLayer, transitions:BABYLON.ITransition[]):any {
            let currentAnimationRate:number = layer.animationStateMachine.rate;
            let currentAnimationLength:number = layer.animationStateMachine.length;
            if (transitions != null && transitions.length > 0) {
                let i:number = 0; let ii:number = 0; let solo:number = -1;
                // ..
                // Check Has Solo Transitions
                // ..
                for(i = 0; i < transitions.length; i++ ) {
                    if (transitions[i].solo === true && transitions[i].mute === false) {
                        solo = i;
                        break;
                    }
                }
                // ..
                // Check State Machine Transitions
                // ..
                for(i = 0; i < transitions.length; i++ ) {
                    const transition:BABYLON.ITransition = transitions[i];
                    if (transition.layerIndex !== layer.index) continue;
                    if (transition.mute === true) continue;
                    if (solo >= 0 && solo !== i) continue;
                    let transitionOk:boolean = false;
                    // ..
                    // Check Has Transition Exit Time
                    // ..
                    let exitTimeSecs:number = 0;
                    let exitTimeExpired:boolean = true;
                    if (transition.exitTime > 0) {
                        exitTimeSecs = (currentAnimationLength * transition.exitTime); // Note: Is Normalized Transition Exit Time
                        exitTimeExpired = (transition.hasExitTime === true) ? (layer.animationStateMachine.time >= exitTimeSecs) : true;
                    }
                    if (transition.hasExitTime === true && transition.intSource == BABYLON.InterruptionSource.None && exitTimeExpired === false) continue;
                    // ..
                    // Check All Transition Conditions
                    // ..
                    if (transition.conditions != null && transition.conditions.length > 0) {
                        let passed:number = 0; let checks:number = transition.conditions.length;
                        transition.conditions.forEach((condition) => {
                            const ptype:BABYLON.AnimatorParameterType = this._parameters.get(condition.parameter);
                            if (ptype != null) {
                                if (ptype == BABYLON.AnimatorParameterType.Float || ptype == BABYLON.AnimatorParameterType.Int) {
                                    const numValue:number = parseFloat(this.getFloat(condition.parameter).toFixed(2));
                                    if (condition.mode === BABYLON.ConditionMode.Greater && numValue > condition.threshold) {
                                        passed++;
                                    } else if (condition.mode === BABYLON.ConditionMode.Less && numValue < condition.threshold) {
                                        passed++;
                                    } else if (condition.mode === BABYLON.ConditionMode.Equals && numValue === condition.threshold) {
                                        passed++;
                                    } else if (condition.mode === BABYLON.ConditionMode.NotEqual && numValue !== condition.threshold) {
                                        passed++;
                                    }
                                } else if (ptype == BABYLON.AnimatorParameterType.Bool) {
                                    const boolValue:boolean = this.getBool(condition.parameter);
                                    if (condition.mode === BABYLON.ConditionMode.If && boolValue === true) {
                                        passed++;
                                    } else if (condition.mode === BABYLON.ConditionMode.IfNot && boolValue === false) {
                                        passed++;
                                    }
                                } else if (ptype == BABYLON.AnimatorParameterType.Trigger) {
                                    const triggerValue:boolean = this.getTrigger(condition.parameter);
                                    if (triggerValue === true) {
                                        passed++;
                                        // Note: For Loop Faster Than IndexOf
                                        let indexOfTrigger:number = -1;
                                        for (let i = 0; i < this._checkers.triggered.length; i++) {
                                            if (this._checkers.triggered[i] === condition.parameter) {
                                                indexOfTrigger = i;
                                                break
                                            }
                                        }
                                        if (indexOfTrigger < 0) {
                                            this._checkers.triggered.push(condition.parameter);
                                        }
                                    }
                                }
                            }
                        });
                        if (transition.hasExitTime === true) {
                            // ..
                            // TODO - CHECK TRANSITION INTERUPTION SOURCE STATUS
                            // ..
                            // Validate Transition Has Exit Time And All Conditions Passed
                            transitionOk = (exitTimeExpired === true && passed === checks);
                        } else {
                            // Validate All Transition Conditions Passed
                            transitionOk = (passed === checks);
                        }
                    } else {
                        // Validate Transition Has Expired Exit Time Only
                        transitionOk = (transition.hasExitTime === true && exitTimeExpired === true);
                    }
                    // Validate Current Transition Destination Change
                    if (transitionOk === true) {
                        const blendRate:number = (currentAnimationRate > 0) ? currentAnimationRate : BABYLON.AnimationState.FPS;
                        const destState:string = (transition.isExit === false) ? transition.destination : BABYLON.AnimationState.EXIT;
                        const durationSecs:number = (transition.fixedDuration === true) ? transition.duration : BABYLON.Scalar.Denormalize(transition.duration, 0, currentAnimationLength);
                        const blendingSpeed:number = BABYLON.Utilities.ComputeBlendingSpeed(blendRate, durationSecs);
                        const normalizedOffset:number = transition.offset;  // Note: Is Normalized Transition Offset Time
                        this._checkers.result = destState;
                        this._checkers.offest = normalizedOffset;
                        this._checkers.blending = blendingSpeed;
                        break;
                    }
                }
            }
        }
        private playCurrentAnimationState(layer:BABYLON.IAnimationLayer, name:string, blending:number, normalizedOffset:number = 0):void {
            if (layer == null) return;
            if (name == null || name === "" || name === BABYLON.AnimationState.EXIT) return;
            if (layer.animationStateMachine != null && layer.animationStateMachine.name === name) return;
            const state:BABYLON.MachineState = this.getMachineState(name);
            // ..
            // Reset Animation Target Mixers
            // ..
            if (this.m_animationTargets != null && this.m_animationTargets.length > 0) {
                this.m_animationTargets.forEach((targetedAnim:BABYLON.TargetedAnimation) => {
                    const animationTarget:any = targetedAnim.target;
                    if (animationTarget.metadata != null && animationTarget.metadata.mixer != null) {
                        const animationTargetMixer:BABYLON.AnimationMixer = animationTarget.metadata.mixer[layer.index];
                        if (animationTargetMixer != null) {
                            animationTargetMixer.originalMatrix = null;
                            animationTargetMixer.blendingFactor = 0;
                            animationTargetMixer.blendingSpeed = blending;
                        }
                    }
                });
            }
            // ..
            // Play Current Layer Animation State
            // ..
            if (state != null && state.layerIndex === layer.index) {
                state.time = 0;
                state.played = 0;
                state.interrupted = false;
                layer.animationTime = BABYLON.Scalar.Clamp(normalizedOffset);
                layer.animationNormal = 0;
                layer.animationFirstRun = true;
                layer.animationEndFrame = false;
                layer.animationLoopFrame = false;
                layer.animationLoopCount = 0;
                layer.animationLoopEvents = null;
                layer.animationStateMachine = state;
                // console.warn(">>> Play Animation State: " + this.transform.name + " --> " + name + " --> Foot IK: " + layer.animationStateMachine.iKOnFeet);
            }
        }
        private stopCurrentAnimationState(layer:BABYLON.IAnimationLayer):void {
            if (layer == null) return;
            // ..
            // Reset Animation Target Mixers
            // ..
            if (this.m_animationTargets != null && this.m_animationTargets.length > 0) {
                this.m_animationTargets.forEach((targetedAnim:BABYLON.TargetedAnimation) => {
                    const animationTarget:any = targetedAnim.target;
                    if (animationTarget.metadata != null && animationTarget.metadata.mixer != null) {
                        const animationTargetMixer:BABYLON.AnimationMixer = animationTarget.metadata.mixer[layer.index];
                        if (animationTargetMixer != null) {
                            animationTargetMixer.originalMatrix = null;
                            animationTargetMixer.blendingFactor = 0;
                            animationTargetMixer.blendingSpeed = 0;
                        }
                    }
                });
            }
            // ..
            // Stop Current Layer Animation State
            // ..
            layer.animationTime = 0;
            layer.animationNormal = 0;
            layer.animationFirstRun = true;
            layer.animationEndFrame = false;
            layer.animationLoopFrame = false;
            layer.animationLoopCount = 0;
            layer.animationLoopEvents = null;
            layer.animationStateMachine = null;
        }
        private checkAvatarTransformPath(layer:BABYLON.IAnimationLayer, transformPath:string):boolean {
            let result:boolean = false;
            if (layer.animationMaskMap != null) {
                const transformIndex:number = layer.animationMaskMap.get(transformPath);
                if (transformIndex != null && transformIndex >= 0) {
                    result = true;
                }
            }
            return result;
        }
        private filterTargetAvatarMask(layer:BABYLON.IAnimationLayer, target:BABYLON.TransformNode):boolean {
            let result:boolean = false;
            if (target.metadata != null && target.metadata.unity != null && target.metadata.unity.bone != null && target.metadata.unity.bone !== "") {
                const transformPath:string = target.metadata.unity.bone;
                result = this.checkAvatarTransformPath(layer, transformPath);
            }
            return result;
        }
        private sortWeightedBlendingList(weightList:BABYLON.IBlendTreeChild[]):void {
            if (weightList != null && weightList.length > 0) {
                // Sort In Descending Order
                weightList.sort((left, right): number => {
                    if (left.weight < right.weight) return 1;
                    if (left.weight > right.weight) return -1;
                    return 0;
                });
            }
        }
        private computeWeightedFrameRatio(weightList:BABYLON.IBlendTreeChild[]):number {
            let result:number = 1.0;
            if (weightList != null && weightList.length > 0) {
                this.sortWeightedBlendingList(weightList);
                this._blendWeights.primary = weightList[0];
                const primaryWeight:number = this._blendWeights.primary.weight;
                if (primaryWeight < 1.0 && weightList.length > 1) {
                    this._blendWeights.secondary = weightList[1];
                }
                // ..
                if (this._blendWeights.primary != null && this._blendWeights.secondary != null) {
                    const frameWeightDelta:number = BABYLON.Scalar.Clamp(this._blendWeights.primary.weight);
                    result = BABYLON.Scalar.Lerp(this._blendWeights.secondary.ratio, this._blendWeights.primary.ratio, frameWeightDelta);
                } else if (this._blendWeights.primary != null && this._blendWeights.secondary == null) {
                    result = this._blendWeights.primary.ratio;
                }
            }
            return result;
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////
        // Blend Tree Branches -  Helper Functions
        ///////////////////////////////////////////////////////////////////////////////////////////////

        private setupTreeBranches(tree:BABYLON.IBlendTree):void {
            if (tree != null && tree.children != null && tree.children.length > 0) {
                tree.children.forEach((child) => {
                    if (child.type === BABYLON.MotionType.Tree) {
                        this.setupTreeBranches(child.subtree);
                    } else if (child.type === BABYLON.MotionType.Clip) {
                        if (child.motion != null && child.motion !== "") {
                            child.weight = 0;
                            child.ratio = 0;
                            child.track = this.getAnimationGroup(child.motion);
                            if (child.track != null) child.ratio = (BABYLON.AnimationState.TIME / child.track.to);
                        }
                    }
                });
            }
        }
        private parseTreeBranches(layer:BABYLON.IAnimationLayer, tree:BABYLON.IBlendTree, parentWeight:number, weightList:BABYLON.IBlendTreeChild[]):void {
            if (tree != null) {
                tree.valueParameterX = (tree.blendParameterX != null) ? parseFloat(this.getFloat(tree.blendParameterX).toFixed(2)) : 0;
                tree.valueParameterY = (tree.blendParameterY != null) ? parseFloat(this.getFloat(tree.blendParameterY).toFixed(2)) : 0;
                switch(tree.blendType) {
                    case BABYLON.BlendTreeType.Simple1D:
                        this.parse1DSimpleTreeBranches(layer, tree, parentWeight, weightList);
                        break;
                    case BABYLON.BlendTreeType.SimpleDirectional2D:
                        this.parse2DSimpleDirectionalTreeBranches(layer, tree, parentWeight, weightList);
                        break;
                    case BABYLON.BlendTreeType.FreeformDirectional2D:
                        this.parse2DFreeformDirectionalTreeBranches(layer, tree, parentWeight, weightList);
                        break;
                    case BABYLON.BlendTreeType.FreeformCartesian2D:
                        this.parse2DFreeformCartesianTreeBranches(layer, tree, parentWeight, weightList);
                        break;
                }
            }
        }
        private parse1DSimpleTreeBranches(layer:BABYLON.IAnimationLayer, tree:BABYLON.IBlendTree, parentWeight:number, weightList:BABYLON.IBlendTreeChild[]):void {
            if (tree != null && tree.children != null && tree.children.length > 0) {
                const blendTreeArray : BABYLON.BlendTreeValue[] = [];
                tree.children.forEach((child:BABYLON.IBlendTreeChild) => {
                    child.weight = 0; // Note: Reset Weight Value
                    const item = {
                        source: child,
                        motion: child.motion,
                        posX: child.threshold,
                        posY: child.threshold,
                        weight: child.weight
                    };
                    blendTreeArray.push(item);
                });
                BABYLON.BlendTreeSystem.Calculate1DSimpleBlendTree(tree.valueParameterX, blendTreeArray);
                blendTreeArray.forEach((element:BABYLON.BlendTreeValue) => {
                    if (element.source != null) {
                        element.source.weight = element.weight;
                    }
                });
                tree.children.forEach((child:BABYLON.IBlendTreeChild) => {
                    child.weight *= parentWeight; // Note: Scale Weight Value
                    if (child.type === BABYLON.MotionType.Clip) {
                        if (child.weight > 0) {
                            weightList.push(child);
                        }
                    }
                    if (child.type === BABYLON.MotionType.Tree) {
                        this.parseTreeBranches(layer, child.subtree, child.weight, weightList);
                    }
                });
            }
        }
        private parse2DSimpleDirectionalTreeBranches(layer:BABYLON.IAnimationLayer, tree:BABYLON.IBlendTree, parentWeight:number, weightList:BABYLON.IBlendTreeChild[]):void {
            if (tree != null && tree.children != null && tree.children.length > 0) {
                const blendTreeArray : BABYLON.BlendTreeValue[] = [];
                tree.children.forEach((child:BABYLON.IBlendTreeChild) => {
                    child.weight = 0; // Note: Reset Weight Value
                    const item = {
                        source: child,
                        motion: child.motion,
                        posX: child.positionX,
                        posY: child.positionY,
                        weight: child.weight
                    };
                    blendTreeArray.push(item);
                });
                BABYLON.BlendTreeSystem.Calculate2DFreeformDirectional(tree.valueParameterX, tree.valueParameterY, blendTreeArray);
                blendTreeArray.forEach((element:BABYLON.BlendTreeValue) => {
                    if (element.source != null) {
                        element.source.weight = element.weight;
                    }
                });
                tree.children.forEach((child:BABYLON.IBlendTreeChild) => {
                    child.weight *= parentWeight; // Note: Scale Weight Value
                    if (child.type === BABYLON.MotionType.Clip) {
                        if (child.weight > 0) {
                            weightList.push(child);
                        }
                    }
                    if (child.type === BABYLON.MotionType.Tree) {
                        this.parseTreeBranches(layer, child.subtree, child.weight, weightList);
                    }
                });
            }
        }
        private parse2DFreeformDirectionalTreeBranches(layer:BABYLON.IAnimationLayer, tree:BABYLON.IBlendTree, parentWeight:number, weightList:BABYLON.IBlendTreeChild[]):void {
            if (tree != null && tree.children != null && tree.children.length > 0) {
                const blendTreeArray : BABYLON.BlendTreeValue[] = [];
                tree.children.forEach((child:BABYLON.IBlendTreeChild) => {
                    child.weight = 0; // Note: Reset Weight Value
                    const item = {
                        source: child,
                        motion: child.motion,
                        posX: child.positionX,
                        posY: child.positionY,
                        weight: child.weight
                    };
                    blendTreeArray.push(item);
                });
                BABYLON.BlendTreeSystem.Calculate2DFreeformDirectional(tree.valueParameterX, tree.valueParameterY, blendTreeArray);
                blendTreeArray.forEach((element:BABYLON.BlendTreeValue) => {
                    if (element.source != null) {
                        element.source.weight = element.weight;
                    }
                });
                tree.children.forEach((child:BABYLON.IBlendTreeChild) => {
                    child.weight *= parentWeight; // Note: Scale Weight Value
                    if (child.type === BABYLON.MotionType.Clip) {
                        if (child.weight > 0) {
                            weightList.push(child);
                        }
                    }
                    if (child.type === BABYLON.MotionType.Tree) {
                        this.parseTreeBranches(layer, child.subtree, child.weight, weightList);
                    }
                });
            }
        }
        private parse2DFreeformCartesianTreeBranches(layer:BABYLON.IAnimationLayer, tree:BABYLON.IBlendTree, parentWeight:number, weightList:BABYLON.IBlendTreeChild[]):void {
            if (tree != null && tree.children != null && tree.children.length > 0) {
                const blendTreeArray : BABYLON.BlendTreeValue[] = [];
                tree.children.forEach((child:BABYLON.IBlendTreeChild) => {
                    child.weight = 0; // Note: Reset Weight Value
                    const item = {
                        source: child,
                        motion: child.motion,
                        posX: child.positionX,
                        posY: child.positionY,
                        weight: child.weight
                    };
                    blendTreeArray.push(item);
                });
                BABYLON.BlendTreeSystem.Calculate2DFreeformCartesian(tree.valueParameterX, tree.valueParameterY, blendTreeArray);
                blendTreeArray.forEach((element:BABYLON.BlendTreeValue) => {
                    if (element.source != null) {
                        element.source.weight = element.weight;
                    }
                });
                tree.children.forEach((child:BABYLON.IBlendTreeChild) => {
                    child.weight *= parentWeight; // Note: Scale Weight Value
                    if (child.type === BABYLON.MotionType.Clip) {
                        if (child.weight > 0) {
                            weightList.push(child);
                        }
                    }
                    if (child.type === BABYLON.MotionType.Tree) {
                        this.parseTreeBranches(layer, child.subtree, child.weight, weightList);
                    }
                });
            }
        }
    }

    ///////////////////////////////////////////
    // Support Classes, Blend Tree Utilities
    ///////////////////////////////////////////

    export class BlendTreeValue {
        public source:BABYLON.IBlendTreeChild;
        public motion: string;
        public posX: number;
        public posY: number;
        public weight: number;
        constructor(config: { source: BABYLON.IBlendTreeChild, motion: string, posX?: number, posY?: number, weight?: number }) {
            this.source = config.source;
            this.motion = config.motion;
            this.posX = config.posX || 0;
            this.posY = config.posY || 0;
            this.weight = config.weight || 0;
        }
    }
    export class BlendTreeUtils {
        public static ClampValue(num: number, min: number, max: number):number {
            return num <= min ? min : num >= max ? max : num;
        }
        public static GetSignedAngle(a: BABYLON.Vector2, b: BABYLON.Vector2):number {
            return Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);
        }
        public static GetLinearInterpolation(x0: number, y0: number, x1: number, y1: number, x: number):number {
            return y0 + (x - x0) * ((y1 - y0) / (x1 - x0));
        }
        public static GetRightNeighbourIndex(inputX: number, blendTreeArray: BABYLON.BlendTreeValue[]): number {
            blendTreeArray.sort((a: BABYLON.BlendTreeValue, b: BABYLON.BlendTreeValue) => { return (a.posX - b.posX); });
            for (let i = 0; i < blendTreeArray.length; ++i) {
                if (blendTreeArray[i].posX > inputX) {
                    return i;
                }
            }
            return -1;
        }
    }
    export class BlendTreeSystem {
        public static Calculate1DSimpleBlendTree(inputX: number, blendTreeArray: BABYLON.BlendTreeValue[]):void {
            const firstBlendTree:BABYLON.BlendTreeValue = blendTreeArray[0];
            const lastBlendTree:BABYLON.BlendTreeValue = blendTreeArray[blendTreeArray.length - 1];
            if (inputX <= firstBlendTree.posX) {
                firstBlendTree.weight = 1;
            } else if (inputX >= lastBlendTree.posX) {
                lastBlendTree.weight = 1;
            } else {
                const rightNeighbourBlendTreeIndex:number = BABYLON.BlendTreeUtils.GetRightNeighbourIndex(inputX, blendTreeArray);
                const leftNeighbour:BABYLON.BlendTreeValue = blendTreeArray[rightNeighbourBlendTreeIndex - 1];
                const rightNeighbour:BABYLON.BlendTreeValue = blendTreeArray[rightNeighbourBlendTreeIndex];
                const interpolatedValue:number = BABYLON.BlendTreeUtils.GetLinearInterpolation(leftNeighbour.posX, 1, rightNeighbour.posX, 0, inputX);
                leftNeighbour.weight = interpolatedValue;
                rightNeighbour.weight = 1 - leftNeighbour.weight;
            }
        }
        public static Calculate2DFreeformDirectional(inputX: number, inputY: number, blendTreeArray: BABYLON.BlendTreeValue[]):void {
            BABYLON.BlendTreeSystem.TempVector2_IP.set(inputX, inputY);
            BABYLON.BlendTreeSystem.TempVector2_POSI.set(0,0);
            BABYLON.BlendTreeSystem.TempVector2_POSJ.set(0,0);
            BABYLON.BlendTreeSystem.TempVector2_POSIP.set(0,0);
            BABYLON.BlendTreeSystem.TempVector2_POSIJ.set(0,0);
            const kDirScale:number = 2;
            let totalWeight:number = 0;
            let inputLength:number = BABYLON.BlendTreeSystem.TempVector2_IP.length();
            for (let i = 0; i < blendTreeArray.length; ++i) {
                const blendTree:BABYLON.BlendTreeValue = blendTreeArray[i];
                BABYLON.BlendTreeSystem.TempVector2_POSI.set(blendTree.posX, blendTree.posY);
                const posILength:number = BABYLON.BlendTreeSystem.TempVector2_POSI.length();
                const inputToPosILength:number = (inputLength - posILength);
                const posIToInputAngle:number = BABYLON.BlendTreeUtils.GetSignedAngle(BABYLON.BlendTreeSystem.TempVector2_POSI, BABYLON.BlendTreeSystem.TempVector2_IP);
                let weight:number = 1;
                for (let j = 0; j < blendTreeArray.length; ++j) {
                    if (j === i) {
                        continue;
                    } else {
                        BABYLON.BlendTreeSystem.TempVector2_POSJ.set(blendTreeArray[j].posX, blendTreeArray[j].posY);
                        const posJLength:number = BABYLON.BlendTreeSystem.TempVector2_POSJ.length();
                        const averageLengthOfIJ:number = (posILength + posJLength) / 2;
                        const magOfPosIToInputPos:number = (inputToPosILength / averageLengthOfIJ);
                        const magOfIJ:number = (posJLength - posILength) / averageLengthOfIJ;
                        const angleIJ:number = BABYLON.BlendTreeUtils.GetSignedAngle(BABYLON.BlendTreeSystem.TempVector2_POSI, BABYLON.BlendTreeSystem.TempVector2_POSJ);
                        BABYLON.BlendTreeSystem.TempVector2_POSIP.set(magOfPosIToInputPos, posIToInputAngle * kDirScale);   
                        BABYLON.BlendTreeSystem.TempVector2_POSIJ.set(magOfIJ, angleIJ * kDirScale);
                        const lenSqIJ:number = BABYLON.BlendTreeSystem.TempVector2_POSIJ.lengthSquared();
                        let newWeight:number = BABYLON.Vector2.Dot(BABYLON.BlendTreeSystem.TempVector2_POSIP, BABYLON.BlendTreeSystem.TempVector2_POSIJ) / lenSqIJ;
                        newWeight = 1 - newWeight;
                        newWeight = BABYLON.BlendTreeUtils.ClampValue(newWeight, 0, 1);
                        weight = Math.min(newWeight, weight);
                    }
                }
                blendTree.weight = weight;
                totalWeight += weight;
            }
            for (const blendTree of blendTreeArray) {
                blendTree.weight /= totalWeight;
            }
        }
        public static Calculate2DFreeformCartesian(inputX: number, inputY: number, blendTreeArray: BABYLON.BlendTreeValue[]):void {
            BABYLON.BlendTreeSystem.TempVector2_IP.set(inputX, inputY);
            BABYLON.BlendTreeSystem.TempVector2_POSI.set(0,0);
            BABYLON.BlendTreeSystem.TempVector2_POSJ.set(0,0);
            BABYLON.BlendTreeSystem.TempVector2_POSIP.set(0,0);
            BABYLON.BlendTreeSystem.TempVector2_POSIJ.set(0,0);
            let totalWeight:number = 0;
            for (let i = 0; i < blendTreeArray.length; ++i) {
                const blendTree:BABYLON.BlendTreeValue = blendTreeArray[i];
                BABYLON.BlendTreeSystem.TempVector2_POSI.set(blendTree.posX, blendTree.posY);
                BABYLON.BlendTreeSystem.TempVector2_IP.subtractToRef(BABYLON.BlendTreeSystem.TempVector2_POSI, BABYLON.BlendTreeSystem.TempVector2_POSIP);
                let weight:number = 1;
                for (let j = 0; j < blendTreeArray.length; ++j) {
                    if (j === i) {
                        continue;
                    } else {
                        BABYLON.BlendTreeSystem.TempVector2_POSJ.set(blendTreeArray[j].posX, blendTreeArray[j].posY);
                        BABYLON.BlendTreeSystem.TempVector2_POSJ.subtractToRef(BABYLON.BlendTreeSystem.TempVector2_POSI, BABYLON.BlendTreeSystem.TempVector2_POSIJ);
                        const lenSqIJ:number = BABYLON.BlendTreeSystem.TempVector2_POSIJ.lengthSquared();
                        let newWeight:number = BABYLON.Vector2.Dot(BABYLON.BlendTreeSystem.TempVector2_POSIP, BABYLON.BlendTreeSystem.TempVector2_POSIJ) / lenSqIJ;
                        newWeight = 1 - newWeight;
                        newWeight = BABYLON.BlendTreeUtils.ClampValue(newWeight, 0, 1);
                        weight = Math.min(weight, newWeight);
                    }
                }
                blendTree.weight = weight;
                totalWeight += weight;
            }
            for (const blendTree of blendTreeArray) {
                blendTree.weight /= totalWeight;
            }
        }
        private static TempVector2_IP:BABYLON.Vector2 = new BABYLON.Vector2(0,0);
        private static TempVector2_POSI:BABYLON.Vector2 = new BABYLON.Vector2(0,0);
        private static TempVector2_POSJ:BABYLON.Vector2 = new BABYLON.Vector2(0,0);
        private static TempVector2_POSIP:BABYLON.Vector2 = new BABYLON.Vector2(0,0);
        private static TempVector2_POSIJ:BABYLON.Vector2 = new BABYLON.Vector2(0,0);
    }

    ///////////////////////////////////////////
    // Support Classes, Enums And Interfaces
    ///////////////////////////////////////////

    export class MachineState {
        public hash:number;
        public name:string;
        public tag:string;
        public time:number;
        public type:BABYLON.MotionType;
        public rate:number;
        public length:number;
        public layer:string;
        public layerIndex:number;
        public played:number;
        public machine:string;
        public motionid:number;
        public interrupted:boolean;
        public apparentSpeed:number;
        public averageAngularSpeed:number;
        public averageDuration:number;
        public averageSpeed:number[];
        public cycleOffset:number;
        public cycleOffsetParameter:string;
        public cycleOffsetParameterActive:boolean;
        public iKOnFeet:boolean;
        public mirror:boolean;
        public mirrorParameter:string;
        public mirrorParameterActive:boolean;
        public speed:number;
        public speedParameter:string;
        public speedParameterActive:boolean;
        public blendtree:BABYLON.IBlendTree;
        public transitions:BABYLON.ITransition[];
        public behaviours:BABYLON.IBehaviour[];
        public events:BABYLON.IAnimatorEvent[];
        public ccurves:BABYLON.IUnityCurve[];
        public tcurves:BABYLON.Animation[];
        public constructor() {}
    }
    export class TransitionCheck {
        public result:string;
        public offest:number;
        public blending:number;
        public triggered:string[];
    }
    export class AnimationMixer {
        public influenceBuffer:number;
        public positionBuffer:BABYLON.Vector3;
        public rotationBuffer:BABYLON.Quaternion;
        public scalingBuffer:BABYLON.Vector3;
        public originalMatrix:BABYLON.Matrix;
        public blendingFactor:number;
        public blendingSpeed:number;
        public rootPosition:BABYLON.Vector3;
        public rootRotation:BABYLON.Quaternion;
    }
    export class BlendingWeights {
        public primary:BABYLON.IBlendTreeChild;
        public secondary:BABYLON.IBlendTreeChild;
    }
    export enum MotionType {
        Clip = 0,
        Tree = 1
    }
    export enum ConditionMode {
        If = 1,
        IfNot = 2,
        Greater = 3,
        Less = 4,
        Equals = 6,
        NotEqual = 7
    }
    export enum InterruptionSource {
        None = 0,
        Source = 1,
        Destination = 2,
        SourceThenDestination = 3,
        DestinationThenSource = 4
    }
    export enum BlendTreeType {
        Simple1D = 0,
        SimpleDirectional2D = 1,
        FreeformDirectional2D = 2,
        FreeformCartesian2D = 3,
        Direct = 4,
        Clip = 5
    }
    export enum BlendTreePosition {
        Lower = 0,
        Upper = 1,
    }
    export enum AnimatorParameterType {
        Float = 1,
        Int = 3,
        Bool = 4,
        Trigger = 9
    }
    export interface IAnimatorEvent {
        id: number;
        clip: string;
        time: number;
        function: string;
        intParameter: number;
        floatParameter: number;
        stringParameter: string;
        objectIdParameter: string;
        objectNameParameter: string;
    }    
    export interface IAvatarMask {
        hash:number;
        maskName:string;
        maskType:string;
        transformCount:number;
        transformPaths:string[];
    }
    export interface IAnimationLayer {
        hash:number;
        name:string;
        index:number;
        entry:string;
        machine:string;
        iKPass:boolean;
        avatarMask:BABYLON.IAvatarMask;
        blendingMode:number;
        defaultWeight:number;
        syncedLayerIndex:number;
        syncedLayerAffectsTiming:boolean;
        animationTime:number;
        animationNormal:number;
        animationMaskMap:Map<string, number>;
        animationFirstRun:boolean;
        animationEndFrame:boolean;
        animationLoopFrame:boolean;
        animationLoopCount:number;        
        animationLoopEvents:any;
        animationStateMachine:BABYLON.MachineState;
    }
    export interface IAnimationCurve {
        length:number;
        preWrapMode:string;
        postWrapMode:string;
        keyframes:BABYLON.IAnimationKeyframe[];
    }
    export interface IAnimationKeyframe {
        time:number;
        value:number;
        inTangent:number;
        outTangent:number;
        tangentMode:number;
    }
    export interface IBehaviour {
        hash:number;
        name:string;
        layerIndex:number;
        properties:any;
    }
    export interface ITransition {
        hash:number;
        anyState:boolean;
        layerIndex:number;
        machineLayer:string;        
        machineName:string;        
        canTransitionToSelf:boolean;
        destination:string;
        duration:number;
        exitTime:number;
        hasExitTime:boolean;
        fixedDuration:boolean;
        intSource:BABYLON.InterruptionSource;
        isExit:boolean;
        mute:boolean;
        name:string;
        offset:number;
        orderedInt:boolean;
        solo:boolean;
        conditions:BABYLON.ICondition[];
    }
    export interface ICondition {
        hash:number;
        mode:BABYLON.ConditionMode;
        parameter:string;
        threshold:number;
    }
    export interface IBlendTree {
        hash:number;
        name:string;
        state:string;
        children:BABYLON.IBlendTreeChild[];
        layerIndex:number;
        apparentSpeed:number;
        averageAngularSpeed:number;
        averageDuration:number;
        averageSpeed:number[];
        blendParameterX:string;
        blendParameterY:string;
        blendType:BABYLON.BlendTreeType;
        isAnimatorMotion:boolean;
        isHumanMotion:boolean;
        isLooping:boolean;
        minThreshold:number;
        maxThreshold:number;
        useAutomaticThresholds:boolean;
        valueParameterX:number;
        valueParameterY:number;
    }
    export interface IBlendTreeChild {
        hash:number;
        layerIndex:number;
        cycleOffset:number;
        directBlendParameter:string;
        apparentSpeed:number;
        averageAngularSpeed:number;
        averageDuration:number;
        averageSpeed:number[];
        mirror:boolean;
        type:BABYLON.MotionType;
        motion:string;
        positionX:number;
        positionY:number;
        threshold:number;
        timescale:number;
        subtree: BABYLON.IBlendTree;
        weight:number;
        ratio:number;
        track:BABYLON.AnimationGroup;
    }
}