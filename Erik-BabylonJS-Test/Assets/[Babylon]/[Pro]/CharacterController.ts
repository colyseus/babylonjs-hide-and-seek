module BABYLON {
    /**
     * Babylon kinematic character controller pro class (Native Bullet Physics 2.82)
     * @class CharacterController - All rights reserved (c) 2020 Mackey Kinard
     */
    export class CharacterController extends BABYLON.ScriptComponent {
        private _abstractMesh:BABYLON.AbstractMesh = null;
        private _avatarRadius:number = 0.5;
        private _avatarHeight:number = 2;
        private _centerOffset:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _slopeLimit:number = 45;
        private _skinWidth:number = 0.08;
        private _stepOffset:number = 0.3;   // See https://discourse.threejs.org/t/ammo-js-with-three-js/12530/47 (Works Best With 0.535 and Box Or Cylinder Shape - ???)
        private _capsuleSegments:number = 16;
        private _minMoveDistance:number = 0.001;
        private _isPhysicsReady:boolean = false;
        private _maxCollisions:number = 4;
        private _createCylinderShape:boolean = false;
        private _movementVelocity:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _tmpPositionBuffer:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _tmpCollisionContacts:CollisionContactInfo[] = null;

        public updatePosition:boolean = true;
        public syncGhostToTransform:boolean = true;
        public preCreateCylinderShape():void { this._createCylinderShape = true; }
        public getInternalCharacter():any { return this.m_character; }
        public getCollisionShape():any { return this.m_ghostShape; }
        public getAvatarRadius():number { return this._avatarRadius; }
        public getAvatarHeight():number { return this._avatarHeight; }
        public getSkinWidth():number { return this._skinWidth; }
        public getStepOffset():number { return this._stepOffset; }
        public getCenterOffset():BABYLON.Vector3 { return this._centerOffset; }
        public getCapsuleSize():BABYLON.Vector3 { return this.m_capsuleSize; }
        public getMinMoveDistance():number { return this._minMoveDistance; }
        public setMinMoveDistance(distance:number):void { this._minMoveDistance = distance; }
        public getVerticalVelocity():number { return (this.m_character != null && this.m_character.getVerticalVelocity) ? this.m_character.getVerticalVelocity() : 0; } // Note: Toolkit Addon Function
        public getAddedMargin():number { return (this.m_character != null && this.m_character.getAddedMargin) ? this.m_character.getAddedMargin() : 0; } // Note: Toolkit Addon Function
        public setAddedMargin(margin:number):void { if (this.m_character != null && this.m_character.getAddedMargin) this.m_character.setAddedMargin(margin); } // Note: Toolkit Addon Function
        public setMaxJumpHeight(maxJumpHeight:number):void { if (this.m_character != null) this.m_character.setMaxJumpHeight(maxJumpHeight); }
        public setFallingSpeed(fallSpeed:number):void { if (this.m_character != null) this.m_character.setFallSpeed(fallSpeed); }
        public getSlopeLimit():number { return (this.m_character != null) ? this.m_character.getMaxSlope() : 0; }
        public setSlopeLimit(slopeRadians:number):void { if (this.m_character != null) this.m_character.setMaxSlope(slopeRadians); }
        public setUpAxis(axis:number):void { if (this.m_character != null) this.m_character.setUpAxis(axis); }
        public getGravity():number { return (this.m_character != null) ? this.m_character.getGravity() : 0; }
        public setGravity(gravity:number):void { if (this.m_character != null) this.m_character.setGravity(gravity); }
        public isGrounded():boolean { return (this.m_character != null) ? this.m_character.onGround() : false; }
        public isReady():boolean { return (this.m_character != null); }
        public canJump():boolean { return (this.m_character != null) ? this.m_character.canJump() : false; }

        /** Register handler that is triggered when the transform position has been updated */
        public onUpdatePositionObservable = new BABYLON.Observable<BABYLON.TransformNode>();
        /** Register handler that is triggered when the a collision contact has entered */
        public onCollisionEnterObservable = new BABYLON.Observable<BABYLON.AbstractMesh>();
        /** Register handler that is triggered when the a collision contact is active */
        public onCollisionStayObservable = new BABYLON.Observable<BABYLON.AbstractMesh>();
        /** Register handler that is triggered when the a collision contact has exited */
        public onCollisionExitObservable = new BABYLON.Observable<BABYLON.AbstractMesh>();

        protected m_character:any = null;
        protected m_ghostShape:any = null;
        protected m_ghostObject:any = null;
        protected m_ghostCollision:any = null;
        protected m_ghostTransform:any = null;
        protected m_ghostPosition:any = null;
        protected m_startPosition:any = null;
        protected m_startTransform:any = null;
        protected m_walkDirection:any = null;
        protected m_warpPosition:any = null;
        protected m_turningRate:number = 0;
        protected m_moveDeltaX:number = 0;
        protected m_moveDeltaZ:number = 0;
        protected m_capsuleSize:BABYLON.Vector3 = BABYLON.Vector3.Zero();
        protected m_physicsEngine:BABYLON.IPhysicsEngine = null;
        protected m_characterPosition:BABYLON.Vector3 = BABYLON.Vector3.Zero();
        protected internalWarp(position:any):void { if (this.m_character != null) this.m_character.warp(position); } // Position: Ammo.btVector3
        protected internalJump():void { if (this.m_character != null) this.m_character.jump(); }
        protected internalSetJumpSpeed(speed:number):void { if (this.m_character != null) this.m_character.setJumpSpeed(speed); }
        protected internalSetWalkDirection(direction:any):void { if (this.m_character != null) this.m_character.setWalkDirection(direction); } // Direction: Ammo.btVector3
        protected internalSetVelocityForTimeInterval(velocity:any, interval:number): void { if (this.m_character != null) this.m_character.setVelocityForTimeInterval(velocity, interval); } // Velocity: Ammo.btVector3

        protected awake():void { this.awakeMovementState(); }
        protected start():void { this.startMovementState(); }
        protected update() :void {  this.updateMovementState(); }
        protected destroy(): void { this.destroyMovementState(); }

        //////////////////////////////////////////////////
        // Protected Character Movement State Functions //
        //////////////////////////////////////////////////
        protected awakeMovementState():void {
            this._abstractMesh = this.getAbstractMesh();
            this._avatarRadius = this.getProperty("avatarRadius", this._avatarRadius);
            this._avatarHeight = this.getProperty("avatarHeight", this._avatarHeight);
            this._slopeLimit = this.getProperty("slopeLimit", this._slopeLimit);
            this._skinWidth = this.getProperty("skinWidth", this._skinWidth);
            this._stepOffset = this.getProperty("stepOffset", this._stepOffset);
            this._minMoveDistance = this.getProperty("minMoveDistance", this._minMoveDistance);
            this._capsuleSegments = this.getProperty("capsuleSegments", this._capsuleSegments);
            this.m_warpPosition = new Ammo.btVector3(0, 0, 0);
            this.m_walkDirection = new Ammo.btVector3(0, 0, 0);
            this.m_physicsEngine = BABYLON.SceneManager.GetPhysicsEngine(this.scene);
            const centerOffsetData:BABYLON.IUnityVector3 = this.getProperty("centerOffset");
            if (centerOffsetData != null) this._centerOffset = BABYLON.Utilities.ParseVector3(centerOffsetData);
        }

        protected startMovementState():void {
            this.setupMovementState();
            this.updateMovementState();
        }
        protected setupMovementState():void {
            this.setMaxNotifications(this._maxCollisions);
            const world:any = BABYLON.SceneManager.GetPhysicsWorld(this.scene);
            if (world != null) {
                const startingPos:BABYLON.Vector3 = BABYLON.Utilities.GetAbsolutePosition(this.transform, this._centerOffset);
                this.m_startPosition = new Ammo.btVector3(startingPos.x, startingPos.y, startingPos.z);
                this.m_startTransform = new Ammo.btTransform();
                this.m_startTransform.setIdentity();
                this.m_startTransform.setOrigin(this.m_startPosition);
                // ..
                const capsuleSize:BABYLON.Vector3 = new BABYLON.Vector3(this._avatarRadius, this._avatarHeight, 1);
                capsuleSize.x *= Math.max(Math.abs(this.transform.scaling.x), Math.abs(this.transform.scaling.z));
                capsuleSize.y *= this.transform.scaling.y;
                this.m_capsuleSize.copyFrom(capsuleSize);
                // ..
                // Create a debug collision shape
                // ..
                const showDebugColliders:boolean = BABYLON.Utilities.ShowDebugColliders();
                const colliderVisibility:number = BABYLON.Utilities.ColliderVisibility();
                const colliderRenderGroup:number = BABYLON.Utilities.ColliderRenderGroup();
                if (showDebugColliders === true && (<any>this.transform)._debugCollider == null) {
                    const debugName:string = this.transform.name + ".Debug"
                    // ELLIPSE: const debugCapsule:BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere(debugName, { segments: 16, diameterX: (capsuleSize.x * 2), diameterY: (capsuleSize.y * 1), diameterZ: (capsuleSize.x * 2) }, this.scene);
                    let debugCapsule:BABYLON.Mesh = null;
                    if (this._createCylinderShape === true) {
                        debugCapsule = BABYLON.MeshBuilder.CreateCylinder(debugName, { tessellation:this._capsuleSegments, subdivisions: 8, height: capsuleSize.y, diameter: (capsuleSize.x * 2) }, this.scene);
                    } else {
                        debugCapsule = BABYLON.MeshBuilder.CreateCapsule(debugName, { tessellation:this._capsuleSegments, subdivisions: 8, capSubdivisions: 8, height: capsuleSize.y, radius: capsuleSize.x }, this.scene);                    
                    }
                    debugCapsule.position.set(0,0,0);
                    debugCapsule.rotationQuaternion = this.transform.rotationQuaternion.clone();
                    debugCapsule.setParent(this.transform);
                    debugCapsule.position.copyFrom(this._centerOffset);
                    debugCapsule.visibility = colliderVisibility;
                    debugCapsule.renderingGroupId = colliderRenderGroup;
                    debugCapsule.material = BABYLON.Utilities.GetColliderMaterial(this.scene);
                    debugCapsule.checkCollisions = false;
                    debugCapsule.isPickable = false;
                    (<any>this.transform)._debugCollider = debugCapsule;
                }
                // ELLIPSE: this.m_ghostShape = BABYLON.SceneManager.CreatePhysicsEllipsoidShape(new Ammo.btVector3(this._avatarRadius, (this._avatarHeight * 0.5), this._avatarRadius));
                if (this._createCylinderShape === true) {
                    this.m_ghostShape = new Ammo.btCylinderShape(new Ammo.btVector3(this._avatarRadius, (this._avatarHeight * 0.5), this._avatarRadius));
                } else {
                    this.m_ghostShape = new Ammo.btCapsuleShape(this._avatarRadius, (this._avatarHeight * 0.5));                
                }
                // Set ghost shape margin size
                this.m_ghostShape.setMargin(this._skinWidth);
                // Create a ghost collision object
                this.m_ghostObject = new Ammo.btPairCachingGhostObject();
                this.m_ghostObject.setWorldTransform(this.m_startTransform);
                this.m_ghostObject.setCollisionShape(this.m_ghostShape);
                this.m_ghostObject.setCollisionFlags(BABYLON.CollisionFlags.CF_CHARACTER_OBJECT);
                this.m_ghostObject.setActivationState(4)
                this.m_ghostObject.activate(true);                
                // Create a ghost collision casting
                this.m_ghostCollision = Ammo.castObject(this.m_ghostObject, Ammo.btCollisionObject);
                this.m_ghostCollision.entity = this._abstractMesh;
                // Create kinematic character controller
                this.m_character = new Ammo.btKinematicCharacterController(this.m_ghostObject, this.m_ghostShape, this._stepOffset);
                this.m_character.setUseGhostSweepTest(true);
                this.m_character.setUpInterpolate(true);
                this.m_character.setGravity(BABYLON.System.Gravity3G);
                this.m_character.setMaxSlope(BABYLON.Tools.ToRadians(this._slopeLimit + 1));
                // Add ghost object and character to world
                world.addCollisionObject(this.m_ghostObject, BABYLON.CollisionFilters.CharacterFilter, BABYLON.CollisionFilters.StaticFilter | BABYLON.CollisionFilters.DefaultFilter | BABYLON.CollisionFilters.CharacterFilter);
                world.addAction(this.m_character);
            } else {
                BABYLON.Tools.Warn("Null physics world detected. Failed to create character controller: " + this.transform.name);
            }
            this._isPhysicsReady = (this.m_physicsEngine != null && this._tmpCollisionContacts != null && this.m_ghostObject != null && this._abstractMesh != null);
        }
        protected syncMovementState():void {
            if (this._isPhysicsReady === true) {
                this.m_ghostTransform = this.m_ghostObject.getWorldTransform();
                if (this.m_ghostTransform != null) {
                    this.m_ghostPosition = this.m_ghostTransform.getOrigin();
                } else {
                    this.m_ghostPosition = null;
                }
            }
        }
        protected updateMovementState():void {
            this.syncMovementState();
            if (this._isPhysicsReady === true) {
                if (this.m_ghostPosition != null) {
                    if (this.updatePosition === true) {
                        // DEPRECIATED: this.transform.position.set(this.m_ghostPosition.x(), this.m_ghostPosition.y(), this.m_ghostPosition.z());
                        this.m_characterPosition.set(this.m_ghostPosition.x(), this.m_ghostPosition.y(), this.m_ghostPosition.z());
                        if (this._centerOffset != null) {
                            // Note: Subtract Character Controller Center Offset
                            this.m_characterPosition.subtractInPlace(this._centerOffset); 
                        }
                        this.transform.position.copyFrom(this.m_characterPosition);
                    } else {
                        if (this.syncGhostToTransform === true) {
                            this.setGhostWorldPosition(this.transform.position);
                        }
                    }
                    if (this.onUpdatePositionObservable.hasObservers() === true) {
                        this.onUpdatePositionObservable.notifyObservers(this.transform);
                    }
                }
            }
            this.parseGhostCollisionContacts();
        }
        protected parseGhostCollisionContacts():void {
            if (this._isPhysicsReady === true) {
                const hasEnterObservers:boolean = this.onCollisionEnterObservable.hasObservers();
                const hasStayObservers:boolean = this.onCollisionStayObservable.hasObservers();
                const hasExitObservers:boolean = this.onCollisionExitObservable.hasObservers();
                if (hasEnterObservers || hasStayObservers || hasExitObservers) {
                    let index = 0; // Note: Flag All Collision List Items For End Contact State
                    for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                        this._tmpCollisionContacts[index].reset = true; 
                    }
                    // ..
                    // Parse Overlapping Ghost Contact Objects
                    // ..
                    let contacts:number = this.m_ghostObject.getNumOverlappingObjects();
                    if (contacts > this._maxCollisions) contacts = this._maxCollisions;
                    if (contacts > 0) {
                        for (index = 0; index < contacts; index++) {
                            const contactObject:any = this.m_ghostObject.getOverlappingObject(index);
                            if (contactObject != null) {
                                const contactBody:any = Ammo.castObject(contactObject, Ammo.btCollisionObject);
                                if (contactBody != null && contactBody.entity != null && contactBody.isActive()) {
                                    let foundindex:number = -1;
                                    const contactMesh:BABYLON.AbstractMesh = contactBody.entity as BABYLON.AbstractMesh;
                                    for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                                        const check:BABYLON.CollisionContactInfo = this._tmpCollisionContacts[index];
                                        if (check.mesh != null && check.mesh === contactMesh) {
                                            check.state = 1;
                                            check.reset = false;
                                            foundindex = index;
                                            break;
                                        }
                                    }
                                    if (foundindex === -1) {
                                        for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                                            const insert:BABYLON.CollisionContactInfo = this._tmpCollisionContacts[index];
                                            if (insert.mesh == null) {
                                                insert.mesh = contactMesh;
                                                insert.state = 0;
                                                insert.reset = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // ..
                    // Dispatch Ghost Collision Contact State
                    // ..
                    for (index = 0; index < this._tmpCollisionContacts.length; index++) {
                        const info:BABYLON.CollisionContactInfo = this._tmpCollisionContacts[index];
                        if (info.reset === true) {
                            // Dispatch On Collision Exit Event
                            if (hasExitObservers && info.mesh != null) {
                                this.onCollisionExitObservable.notifyObservers(info.mesh);
                            }
                            // Reset Collision Contact Info Item
                            info.mesh = null;
                            info.state = 0;
                            info.reset = false;
                        } else {
                            if (info.state === 0) {
                                // Dispatch On Collision Enter Event
                                if (hasEnterObservers && info.mesh != null) {
                                    this.onCollisionEnterObservable.notifyObservers(info.mesh);
                                }
                            } else {
                                // Dispatch On Collision Stay Event
                                if (hasStayObservers && info.mesh != null) {
                                    this.onCollisionStayObservable.notifyObservers(info.mesh);
                                }
                            }
                        }
                    }
                }
            }
        }
        protected destroyMovementState():void {
            this.m_physicsEngine = null;
            if (this.m_character != null) {
                Ammo.destroy(this.m_character);
                this.m_character = null;
            }
            if (this.m_ghostObject != null) {
                Ammo.destroy(this.m_ghostObject);
                this.m_ghostObject = null;
            }
            if (this.m_ghostShape != null) {
                Ammo.destroy(this.m_ghostShape);
                this.m_ghostShape = null;
            }
            if (this.m_ghostCollision != null) {
                Ammo.destroy(this.m_ghostCollision); // ???
                this.m_ghostCollision = null;
            }
            if (this.m_ghostPosition != null) {
                Ammo.destroy(this.m_ghostPosition); // ???
                this.m_ghostPosition = null;
            }
            if (this.m_ghostTransform != null) {
                Ammo.destroy(this.m_ghostTransform); // ???
                this.m_ghostTransform = null;
            }
            if (this.m_startPosition != null) {
                Ammo.destroy(this.m_startPosition);
                this.m_startPosition = null;
            }
            if (this.m_startTransform != null) {
                Ammo.destroy(this.m_startTransform);
                this.m_startTransform = null;
            }
            if (this.m_warpPosition != null) {
                Ammo.destroy(this.m_warpPosition);
                this.m_warpPosition = null;
            }
            if (this.m_walkDirection != null) {
                Ammo.destroy(this.m_walkDirection);
                this.m_walkDirection = null;
            }
            this.onUpdatePositionObservable.clear();
            this.onUpdatePositionObservable = null;
            this.onCollisionEnterObservable.clear();
            this.onCollisionEnterObservable = null;
            this.onCollisionStayObservable.clear();
            this.onCollisionStayObservable = null;
            this.onCollisionExitObservable.clear();
            this.onCollisionExitObservable = null;
            this._tmpCollisionContacts = null;
            this._tmpPositionBuffer = null;
            this._abstractMesh = null;
        }

        ////////////////////////////////////////////////////
        // Character Controller Advanced Helper Functions //
        ////////////////////////////////////////////////////

        /** Gets the ghost collision shape margin value. (Advanved Use Only) */
        public getGhostMargin():number {
            let result:number = 0;
            if (this.m_ghostShape != null && this.m_ghostShape.getMargin) {
                result = this.m_ghostShape.getMargin();
            }
            return result;
        }
        /** Sets ghost collision shape margin value. (Advanved Use Only) */
        public setGhostMargin(margin:number):void {
            if (this.m_ghostShape != null && this.m_ghostShape.setMargin) {
                this.m_ghostShape.setMargin(margin);
            }
        }
        /** Gets character slope slide patch state using physics ghost object. (Advanved Use Only) */
        public getUseSlopeSlidePatch():boolean {
            let result:boolean = false;
            if (this.m_character != null && this.m_character.get_m_useSlopeSlidePatch) {
                result = this.m_character.get_m_useSlopeSlidePatch();
            }
            return result;
        }
        /** Sets character slope slide patch state using physics ghost object. (Advanved Use Only) */
        public setUseSlopeSlidePatch(use:boolean):void {
            if (this.m_character != null && this.m_character.set_m_useSlopeSlidePatch) {
                this.m_character.set_m_useSlopeSlidePatch(use);
            }
        }
        /** Sets the maximum number of simultaneous contact notfications to dispatch per frame. Defaults value is 4. (Advanved Use Only) */
        public setMaxNotifications(max:number): void {
            this._maxCollisions = max;
            this._tmpCollisionContacts = [];            
            for (let index = 0; index < this._maxCollisions; index++) {
                this._tmpCollisionContacts.push(new CollisionContactInfo());
            }
        }
        /** Sets character collision activation state using physics ghost object. (Advanved Use Only) */
        public setActivationState(state:number):void {
            if (this.m_ghostCollision != null && this.m_ghostCollision.setActivationState) {
                this.m_ghostCollision.setActivationState(state);
            }
        }
        /** Gets character collision group filter using physics ghost object. (Advanved Use Only) */
        public getCollisionFilterGroup():number {
            let result:number = -1;
            if (this.m_ghostCollision != null && this.m_ghostCollision.getBroadphaseHandle) {
                result = this.m_ghostCollision.getBroadphaseHandle().get_m_collisionFilterGroup();
            }
            return result;
        }
        /** Sets character collision group filter using physics ghost object. (Advanved Use Only) */
        public setCollisionFilterGroup(group:number):void {
            if (this.m_ghostCollision != null && this.m_ghostCollision.getBroadphaseHandle) {
                this.m_ghostCollision.getBroadphaseHandle().set_m_collisionFilterGroup(group);
            }
        }
        /** Gets character collision mask filter using physics ghost object. (Advanved Use Only) */
        public getCollisionFilterMask():number {
            let result:number = -1;
            if (this.m_ghostCollision != null && this.m_ghostCollision.getBroadphaseHandle) {
                result = this.m_ghostCollision.getBroadphaseHandle().get_m_collisionFilterMask();
            }
            return result;
        }
        /** Sets the character collision mask filter using physics ghost object. (Advanved Use Only) */
        public setCollisionFilterMask(mask:number):void {
            if (this.m_ghostCollision != null && this.m_ghostCollision.getBroadphaseHandle) {
                this.m_ghostCollision.getBroadphaseHandle().set_m_collisionFilterMask(mask);
            }
        }
        /** Gets the chracter contact processing threshold using physics ghost object. (Advanved Use Only) */
        public getContactProcessingThreshold():number {
            let result:number = -1;
            if (this.m_ghostCollision != null && this.m_ghostCollision.getContactProcessingThreshold) {
                result = this.m_ghostCollision.getContactProcessingThreshold();
            }
            return result;
        }
        /** Sets character contact processing threshold using physics ghost object. (Advanved Use Only) */
        public setContactProcessingThreshold(threshold:number):void {
            if (this.m_ghostCollision != null && this.m_ghostCollision.setContactProcessingThreshold) {
                this.m_ghostCollision.setContactProcessingThreshold(threshold);
            }
        }
        /** Get the current position of the physics ghost object world transform. (Advanved Use Only) */
        public getGhostWorldPosition():BABYLON.Vector3 {
            const result:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
            if (this.m_ghostPosition != null) {
                result.set(this.m_ghostPosition.x(), this.m_ghostPosition.y(), this.m_ghostPosition.z());
            }
            return result;
        }
        /** Get the current position of the physics ghost object world transform. (Advanved Use Only) */
        public getGhostWorldPositionToRef(result:BABYLON.Vector3):void {
            if (this.m_ghostPosition != null && result != null) {
                result.set(this.m_ghostPosition.x(), this.m_ghostPosition.y(), this.m_ghostPosition.z());
            }
        }
        /** Manually set the position of the physics ghost object world transform. (Advanved Use Only) */
        public setGhostWorldPosition(position:BABYLON.Nullable<BABYLON.Vector3>):void {
            if (this.m_ghostObject != null && this.m_ghostTransform != null) {
                if (this.m_ghostPosition != null && position != null) {
                    this.m_ghostPosition.setValue(position.x, position.y, position.z);
                    this.m_ghostTransform.setOrigin(this.m_ghostPosition);
                }
                this.m_ghostObject.setWorldTransform(this.m_ghostTransform);
            }
        }
        /** Set ghost collision shape local scaling. (Advanved Use Only) */
        public scaleGhostCollisionShape(x:number, y:number, z:number):void {
            this.m_ghostShape.setLocalScaling(new Ammo.btVector3(x, y, z));
            if ((<any>this.transform)._debugCollider != null && (<any>this.transform)._debugCollider.scaling != null) {
                (<any>this.transform)._debugCollider.scaling.set(x, y, z);              
            }
        }

        ////////////////////////////////////////////////////
        // Public Character Controller Movement Functions //
        ////////////////////////////////////////////////////

        /** Sets the kinematic character position to the specified location. */
        public set(x:number, y:number, z:number):void {
            this._tmpPositionBuffer.set(x,y,z);
            this.setGhostWorldPosition(this._tmpPositionBuffer);
        }
        /** Translates the kinematic character with the specfied velocity. */
        public move(velocity:BABYLON.Vector3):void {
            if (velocity != null) {
                this.m_moveDeltaX = velocity.x;
                this.m_moveDeltaZ = velocity.z;
                if (Math.abs(velocity.x) < this._minMoveDistance) {
                    if (velocity.x > 0) {
                        this.m_moveDeltaX = this._minMoveDistance;
                    } else if (velocity.x < 0) {
                        this.m_moveDeltaX = -this._minMoveDistance;
                    }
                }
                if (Math.abs(velocity.z) < this._minMoveDistance) {
                    if (velocity.z > 0) {
                        this.m_moveDeltaZ = this._minMoveDistance;
                    } else if (velocity.z < 0) {
                        this.m_moveDeltaZ = -this._minMoveDistance;
                    }
                }
                if (this.m_walkDirection != null) {
                    this._movementVelocity.set(this.m_moveDeltaX, 0, this.m_moveDeltaZ);
                    this.m_walkDirection.setValue(this._movementVelocity.x, this._movementVelocity.y, this._movementVelocity.z);
                    this.internalSetWalkDirection(this.m_walkDirection);
                }
            }
        }
        /** Jumps the kinematic chacracter with the specified speed. */
        public jump(speed:number):void {
            this.internalSetJumpSpeed(speed);
            this.internalJump();
        }
        /** Warps the kinematic chacracter to the specified position. */
        public warp(position:BABYLON.Vector3):void {
            if (this.m_warpPosition != null) {
                this.m_warpPosition.setValue(position.x, position.y, position.z);
                this.internalWarp(this.m_warpPosition);
            }
        }
    }
}