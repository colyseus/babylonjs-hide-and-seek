module BABYLON {
    /**
     * Babylon full rigidbody physics pro class (Native Bullet Physics 2.82)
     * @class RigidbodyPhysics - All rights reserved (c) 2020 Mackey Kinard
     */
    export class RigidbodyPhysics extends BABYLON.ScriptComponent {
        private static TempAmmoVector:any = null;
        private static TempAmmoVectorAux:any = null;
        private static TempCenterTransform:any = null;

        private _abstractMesh:BABYLON.AbstractMesh = null;
        private _isKinematic:boolean = false;
        private _maxCollisions:number = 4;
        private _isPhysicsReady:boolean = false;
        private _collisionObject:any = null;
        private _centerOfMass:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _tmpLinearFactor:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _tmpAngularFactor:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _tmpCenterOfMass:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _tmpCollisionContacts:CollisionContactInfo[] = null;
        public get isKinematic():boolean { return this._isKinematic; }
        public get centerOfMass():BABYLON.Vector3 { return this._centerOfMass; }
        /** Register handler that is triggered when the a collision contact has entered */
        public onCollisionEnterObservable = new BABYLON.Observable<BABYLON.AbstractMesh>();
        /** Register handler that is triggered when the a collision contact is active */
        public onCollisionStayObservable = new BABYLON.Observable<BABYLON.AbstractMesh>();
        /** Register handler that is triggered when the a collision contact has exited */
        public onCollisionExitObservable = new BABYLON.Observable<BABYLON.AbstractMesh>();

        protected m_physicsWorld:any = null;
        protected m_physicsEngine:BABYLON.IPhysicsEngine = null;
        protected m_raycastVehicle:any = null;

        protected awake(): void { this.awakeRigidbodyState(); }
        protected update() :void {  this.updateRigidbodyState(); }
        protected after() :void {  this.afterRigidbodyState(); }
        protected destroy(): void { this.destroyRigidbodyState(); }

        /////////////////////////////////////////////////
        // Protected Rigidbody Physics State Functions //
        /////////////////////////////////////////////////

        protected awakeRigidbodyState():void {
            this._abstractMesh = this.getAbstractMesh();
            this._isKinematic = this.getProperty("isKinematic", this._isKinematic);
            this.m_physicsWorld = BABYLON.SceneManager.GetPhysicsWorld(this.scene);
            this.m_physicsEngine = BABYLON.SceneManager.GetPhysicsEngine(this.scene);
            if (this.transform.metadata != null && this.transform.metadata.unity != null && this.transform.metadata.unity.physics != null) {
                this._centerOfMass = (this.transform.metadata.unity.physics.center != null) ? BABYLON.Utilities.ParseVector3(this.transform.metadata.unity.physics.center, this._centerOfMass) : this._centerOfMass;
            }
            //console.warn("Starting Rigidbody Physics For: " + this.transform.name);
            this.setMaxNotifications(this._maxCollisions);
            BABYLON.Utilities.ValidateTransformQuaternion(this.transform);
            this._isPhysicsReady = (this.m_physicsEngine != null && this._tmpCollisionContacts != null && this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null);
            const collisionGroup:number = (this._isKinematic === true) ? BABYLON.CollisionFilters.StaticFilter : BABYLON.CollisionFilters.DefaultFilter;
            const collisionMask:number = (this._isKinematic === true) ? BABYLON.CollisionFilters.AllFilter ^ BABYLON.CollisionFilters.StaticFilter : BABYLON.CollisionFilters.AllFilter;
            this.setCollisionFilterGroup(collisionGroup);
            this.setCollisionFilterMask(collisionMask);
            this.resetBodyCollisionContacts();
        }
        protected updateRigidbodyState():void {
            this.syncronizeVehicleController();
        }
        protected afterRigidbodyState():void {
            this.parseBodyCollisionContacts();
            this.resetBodyCollisionContacts();
        }
        protected destroyRigidbodyState():void {
            this.m_physicsWorld = null;
            this.m_physicsEngine = null;
            if (this.m_raycastVehicle != null) {
                if (this.m_raycastVehicle.dispose) {
                    this.m_raycastVehicle.dispose();
                }
                this.m_raycastVehicle = null;
            }
            this.onCollisionEnterObservable.clear();
            this.onCollisionEnterObservable = null;
            this.onCollisionStayObservable.clear();
            this.onCollisionStayObservable = null;
            this.onCollisionExitObservable.clear();
            this.onCollisionExitObservable = null;
            this._tmpCollisionContacts = null;
            this._collisionObject = null;
            this._abstractMesh = null;
        }

        //////////////////////////////////////////////////
        // Rigidbody Physics Life Cycle Event Functions //
        //////////////////////////////////////////////////

        protected syncronizeVehicleController():void {
            if (this.m_raycastVehicle != null) {
                if (this.m_raycastVehicle.updateWheelInformation) {
                    this.m_raycastVehicle.updateWheelInformation();
                }
            }
        }
        protected parseBodyCollisionContacts():void {
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
                    // Parse Overlapping Body Contact Objects
                    // ..
                    let collisionCount:number = 0;
                    if ((<any>this._abstractMesh.physicsImpostor).tmpCollisionObjects != null) {
                        const tmpCollisionObjectMap:any = (<any>this._abstractMesh.physicsImpostor).tmpCollisionObjects;
                        for (const contactKey in tmpCollisionObjectMap) {
                            let foundindex:number = -1;
                            const contactMesh:BABYLON.AbstractMesh = tmpCollisionObjectMap[contactKey];
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
                            collisionCount++;
                            if (collisionCount > this._maxCollisions) break;
                        }                        
                    }
                    // ..
                    // Dispatch Body Collision Contact State
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
        protected resetBodyCollisionContacts():void {
            if (this._isPhysicsReady === true) {
                const hasEnterObservers:boolean = this.onCollisionEnterObservable.hasObservers();
                const hasStayObservers:boolean = this.onCollisionStayObservable.hasObservers();
                const hasExitObservers:boolean = this.onCollisionExitObservable.hasObservers();
                if (hasEnterObservers || hasStayObservers || hasExitObservers) {
                    (<any>this._abstractMesh.physicsImpostor).tmpCollisionObjects = {};
                } else {
                    (<any>this._abstractMesh.physicsImpostor).tmpCollisionObjects = null;
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Gravity Advanced Helper Functions
        ////////////////////////////////////////////////////////////////////////////////////

        /** Sets entity gravity value using physics impostor body. */
        public setGravity(gravity:BABYLON.Vector3):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setGravity) {
                if (gravity != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(gravity.x, gravity.y, gravity.z);
                    this._abstractMesh.physicsImpostor.physicsBody.setGravity(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        }
        /** Gets entity gravity value using physics impostor body. */
        public getGravity():BABYLON.Nullable<BABYLON.Vector3> {
            const result:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
            this.getGravityToRef(result);
            return result;
        }
        /** Gets entity gravity value using physics impostor body. */
        public getGravityToRef(result:BABYLON.Vector3):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getGravity) {
                const gravity:any = this._abstractMesh.physicsImpostor.physicsBody.getGravity();
                BABYLON.Utilities.ConvertAmmoVector3ToRef(gravity, result);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Impostor Helper Functions -  TODO - Use Native Physics API - ???
        ////////////////////////////////////////////////////////////////////////////////////

        /** Gets mass of entity using physics impostor. */
        public getMass():number {
            let result:number = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.mass;
            }
            return result;
        }
        /** Sets mass to entity using physics impostor. */
        public setMass(mass:number):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (this._abstractMesh.physicsImpostor.mass !== mass) {
                    this._abstractMesh.physicsImpostor.mass = mass;
                }
            }
        }
        /** Gets entity friction level using physics impostor. */
        public getFriction():number {
            let result:number = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.friction;
            }
            return result;
        }
        /** Applies friction to entity using physics impostor. */
        public setFriction(friction:number):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (this._abstractMesh.physicsImpostor.friction !== friction) {
                    this._abstractMesh.physicsImpostor.friction = friction;
                }
            }
        }
        /** Gets restitution of entity using physics impostor. */
        public getRestitution():number {
            let result:number = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.restitution;
            }
            return result;
        }
        /** Sets restitution to entity using physics impostor. */
        public setRestitution(restitution:number):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (this._abstractMesh.physicsImpostor.restitution !== restitution) {
                    this._abstractMesh.physicsImpostor.restitution = restitution;
                }
            }
        }
        /** Gets entity linear velocity using physics impostor. */
        public getLinearVelocity():BABYLON.Nullable<BABYLON.Vector3> {
            let result:BABYLON.Vector3 = null;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.getLinearVelocity();
            }
            return result;
        }
        /** Sets entity linear velocity using physics impostor. */
        public setLinearVelocity(velocity:BABYLON.Vector3):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (velocity != null) this._abstractMesh.physicsImpostor.setLinearVelocity(velocity);
            }
        }
        /** Gets entity angular velocity using physics impostor. */
        public getAngularVelocity():BABYLON.Nullable<BABYLON.Vector3> {
            let result:BABYLON.Vector3 = null;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                result = this._abstractMesh.physicsImpostor.getAngularVelocity();
            }
            return result;
        }
        /** Sets entity angular velocity using physics impostor. */
        public setAngularVelocity(velocity:BABYLON.Vector3):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null) {
                if (velocity != null) this._abstractMesh.physicsImpostor.setAngularVelocity(velocity);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Transform Helper Functions
        ////////////////////////////////////////////////////////////////////////////////////

        /** Gets the native physics world transform object using physics impostor body. (Ammo.btTransform) */
        public getWorldTransform():any {
            let result:any = null;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null) this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null && this._collisionObject.getWorldTransform) {
                    result = this._collisionObject.getWorldTransform();
                }
            }
            return result;
        }
        /** sets the native physics world transform object using physics impostor body. (Ammo.btTransform) */
        public setWorldTransform(btTransform:any):any {
            let result:any = null;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null) this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null && this._collisionObject.setWorldTransform) {
                    this._collisionObject.setWorldTransform(btTransform);
                }
                if (this._abstractMesh.physicsImpostor.mass === 0 && this._abstractMesh.physicsImpostor.physicsBody.getMotionState) {
                    const motionState:any = this._abstractMesh.physicsImpostor.physicsBody.getMotionState();
                    if (motionState != null && motionState.setWorldTransform) {
                        motionState.setWorldTransform(btTransform);
                    }
                }
            }
            return result;
        }

        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Applied Physics Movement Functions
        ////////////////////////////////////////////////////////////////////////////////////

        public clearForces(): void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.clearForces) {
                this._abstractMesh.physicsImpostor.physicsBody.clearForces();
            }
        }

        ////////////////////////////////////////////////// 
        // TODO - Use Function Specific Temp Ammo Buffer //
        ////////////////////////////////////////////////// 

        public applyTorque(torque: BABYLON.Vector3): void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyTorque) {
                if (torque != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(torque.x, torque.y, torque.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyTorque(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        }
        public applyLocalTorque(torque: BABYLON.Vector3): void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyLocalTorque) {
                if (torque != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(torque.x, torque.y, torque.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyLocalTorque(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        }

        public applyImpulse(impulse: BABYLON.Vector3, rel_pos: BABYLON.Vector3): void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyImpulse) {
                if (impulse != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    if (BABYLON.RigidbodyPhysics.TempAmmoVectorAux == null) BABYLON.RigidbodyPhysics.TempAmmoVectorAux = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(impulse.x, impulse.y, impulse.z);
                    BABYLON.RigidbodyPhysics.TempAmmoVectorAux.setValue(rel_pos.x, rel_pos.y, rel_pos.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyImpulse(BABYLON.RigidbodyPhysics.TempAmmoVector, BABYLON.RigidbodyPhysics.TempAmmoVectorAux);
                }
            }
        }
        public applyCentralImpulse(impulse: BABYLON.Vector3): void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyCentralImpulse) {
                if (impulse != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(impulse.x, impulse.y, impulse.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyCentralImpulse(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        }
        public applyTorqueImpulse(torque: BABYLON.Vector3): void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyTorqueImpulse) {
                if (torque != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(torque.x, torque.y, torque.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyTorqueImpulse(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        }
        public applyForce(force: BABYLON.Vector3, rel_pos: BABYLON.Vector3): void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyForce) {
                if (force != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    if (BABYLON.RigidbodyPhysics.TempAmmoVectorAux == null) BABYLON.RigidbodyPhysics.TempAmmoVectorAux = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(force.x, force.y, force.z);
                    BABYLON.RigidbodyPhysics.TempAmmoVectorAux.setValue(rel_pos.x, rel_pos.y, rel_pos.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyForce(BABYLON.RigidbodyPhysics.TempAmmoVector, BABYLON.RigidbodyPhysics.TempAmmoVectorAux);
                }
            }
        }
        public applyCentralForce(force: BABYLON.Vector3): void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyCentralForce) {
                if (force != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(force.x, force.y, force.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyCentralForce(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        }
        public applyCentralLocalForce(force: BABYLON.Vector3): void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.applyCentralLocalForce) {
                if (force != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(force.x, force.y, force.z);
                    this._abstractMesh.physicsImpostor.physicsBody.applyCentralLocalForce(BABYLON.RigidbodyPhysics.TempAmmoVector);
                }
            }
        }
        /** gets rigidbody center of mass */
        public getCenterOfMassTransform():BABYLON.Vector3 {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getCenterOfMassTransform) {
                const bttransform:any = this._abstractMesh.physicsImpostor.physicsBody.getCenterOfMassTransform();
                const btposition:any = bttransform.getOrigin();
                this._tmpCenterOfMass.set(btposition.x(), btposition.y(), btposition.z());
            }
            return this._tmpCenterOfMass;
        }
        /** Sets rigidbody center of mass */
        public setCenterOfMassTransform(center: BABYLON.Vector3): void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setCenterOfMassTransform) {
                if (center != null) {
                    if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(center.x, center.y, center.z);
                    if (BABYLON.RigidbodyPhysics.TempCenterTransform == null) BABYLON.RigidbodyPhysics.TempCenterTransform = new Ammo.btTransform();
                    BABYLON.RigidbodyPhysics.TempCenterTransform.setIdentity();
                    BABYLON.RigidbodyPhysics.TempCenterTransform.setOrigin(BABYLON.RigidbodyPhysics.TempAmmoVector);
                    this._abstractMesh.physicsImpostor.physicsBody.setCenterOfMassTransform(BABYLON.RigidbodyPhysics.TempCenterTransform);
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Native Body Helper Functions
        ////////////////////////////////////////////////////////////////////////////////////

        /** Gets entity linear factor using physics impostor body. */
        public getLinearFactor():BABYLON.Vector3 {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getLinearFactor) {
                const linearFactor:any = this._abstractMesh.physicsImpostor.physicsBody.getLinearFactor();
                this._tmpLinearFactor.set(linearFactor.x(), linearFactor.y(), linearFactor.z());
            }
            return this._tmpLinearFactor;
        }
        /** Sets entity linear factor using physics impostor body. */
        public setLinearFactor(factor:BABYLON.Vector3):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setLinearFactor) {
                if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(factor.x, factor.y, factor.z);
                this._abstractMesh.physicsImpostor.physicsBody.setLinearFactor(BABYLON.RigidbodyPhysics.TempAmmoVector);
            }
        }
        /** Gets entity angular factor using physics impostor body. */
        public getAngularFactor():BABYLON.Vector3 {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getAngularFactor) {
                const angularFactor:any = this._abstractMesh.physicsImpostor.physicsBody.getAngularFactor();
                this._tmpAngularFactor.set(angularFactor.x(), angularFactor.y(), angularFactor.z());
            }
            return this._tmpAngularFactor;
        }
        /** Sets entity angular factor using physics impostor body. */
        public setAngularFactor(factor:BABYLON.Vector3):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setAngularFactor) {
                if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(factor.x, factor.y, factor.z);
                this._abstractMesh.physicsImpostor.physicsBody.setAngularFactor(BABYLON.RigidbodyPhysics.TempAmmoVector);
            }
        }
        /** Gets entity angular damping using physics impostor body. */
        public getAngularDamping():number {
            let result:number = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getAngularDamping) {
                result = this._abstractMesh.physicsImpostor.physicsBody.getAngularDamping();
            }
            return result;
        }
        /** Gets entity linear damping using physics impostor body. */
        public getLinearDamping():number {
            let result:number = 0;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getLinearDamping) {
                result = this._abstractMesh.physicsImpostor.physicsBody.getLinearDamping();
            }
            return result;
        }
        /** Sets entity drag damping using physics impostor body. */
        public setDamping(linear:number, angular:number):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setDamping) {
                this._abstractMesh.physicsImpostor.physicsBody.setDamping(linear, angular);
            }
        }
        /** Sets entity sleeping threshold using physics impostor body. */
        public setSleepingThresholds(linear:number, angular:number):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.setSleepingThresholds) {
                this._abstractMesh.physicsImpostor.physicsBody.setSleepingThresholds(linear, angular);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////
        // Rigidbody Physics Native Advanced Helper Functions
        ////////////////////////////////////////////////////////////////////////////////////
        
        /** Checks if rigidbody has wheel collider metadata for the entity. Note: Wheel collider metadata informaion is required for vehicle control. */
        public hasWheelColliders():boolean {
            return (this._isPhysicsReady === true && this._abstractMesh.metadata != null && this._abstractMesh.metadata.unity != null && this._abstractMesh.metadata.unity.wheels != null);
        }
        /** Sets the maximum number of simultaneous contact notfications to dispatch per frame. Defaults value is 4. (Advanved Use Only) */
        public setMaxNotifications(max:number): void {
            this._maxCollisions = max;
            this._tmpCollisionContacts = [];            
            for (let index = 0; index < this._maxCollisions; index++) {
                this._tmpCollisionContacts.push(new CollisionContactInfo());
            }
        }
        /** Sets entity collision activation state using physics impostor body. (Advanved Use Only) */
        public setActivationState(state:number):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null) this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null && this._collisionObject.setActivationState) {
                    this._collisionObject.setActivationState(state);
                }
            }
        }
        /** Gets entity collision filter group using physics impostor body. (Advanved Use Only) */
        public getCollisionFilterGroup():number {
            let result:number = -1;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy) {
                result = this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy().get_m_collisionFilterGroup();
            }
            return result;
        }
        /** Sets entity collision filter group using physics impostor body. (Advanved Use Only) */
        public setCollisionFilterGroup(group:number):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy) {
                this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy().set_m_collisionFilterGroup(group);
            }
        }
        /** Gets entity collision filter mask using physics impostor body. (Advanved Use Only) */
        public getCollisionFilterMask():number {
            let result:number = -1;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy) {
                result = this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy().get_m_collisionFilterMask();
            }
            return result;
        }
        /** Sets entity collision filter mask using physics impostor body. (Advanved Use Only) */
        public setCollisionFilterMask(mask:number):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null && this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy) {
                this._abstractMesh.physicsImpostor.physicsBody.getBroadphaseProxy().set_m_collisionFilterMask(mask);
            }
        }
        /** Gets the entity collision shape type using physics impostor body. (Advanved Use Only) */
        public getCollisionShapeType():number {
            let result:number = -1;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null) this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null) {
                    const collisionShape:any = this._collisionObject.getCollisionShape();
                    if (collisionShape != null && collisionShape.getShapeType) {
                        result = collisionShape.getShapeType();
                    }
                }
            }
            return result;
        }
        /** Gets the entity collision shape margin using physics impostor body. (Advanved Use Only) */
        public getCollisionShapeMargin():number {
            let result:number = -1;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null) this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null) {
                    const collisionShape:any = this._collisionObject.getCollisionShape();
                    if (collisionShape != null && collisionShape.getMargin) {
                        result = collisionShape.getMargin();
                    }
                }
            }
            return result;
        }
        /** Sets entity collision shape margin using physics impostor body. (Advanved Use Only) */
        public setCollisionShapeMargin(margin:number):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null) this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null) {
                    const collisionShape:any = this._collisionObject.getCollisionShape();
                    if (collisionShape != null && collisionShape.setMargin) {
                        collisionShape.setMargin(margin);
                    }
                }
            }
        }
        /** Gets the entity contact processing threshold using physics impostor body. (Advanved Use Only) */
        /* DEPRECIATED: TODO - Must Expose This Function In Ammo.idl
        public getContactProcessingThreshold():number {
            let result:number = -1;
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null) this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null && this._collisionObject.getContactProcessingThreshold) {
                    result = this._collisionObject.getContactProcessingThreshold();
                }
            }
            return result;
        }*/
        /** Sets entity contact processing threshold using physics impostor body. (Advanved Use Only) */
        public setContactProcessingThreshold(threshold:number):void {
            if (this._abstractMesh != null && this._abstractMesh.physicsImpostor != null && this._abstractMesh.physicsImpostor.physicsBody != null) {
                if (this._collisionObject == null) this._collisionObject = Ammo.castObject(this._abstractMesh.physicsImpostor.physicsBody, Ammo.btCollisionObject);
                if (this._collisionObject != null && this._collisionObject.setContactProcessingThreshold) {
                    this._collisionObject.setContactProcessingThreshold(threshold);
                }
            }
        }
        
        // ************************************ //
        // * Physics Physics Helper Functions * //
        // ************************************ //

        /** TODO */
        public static CreatePhysicsMetadata(mass:number, drag:number = 0.0, angularDrag:number = 0.05, centerMass:Vector3 = null): any {
            const center:BABYLON.Vector3 = (centerMass != null) ? centerMass : new BABYLON.Vector3(0,0,0);
            return {
                "type": "rigidbody",
                "mass": mass,
                "ldrag": drag,
                "adrag": angularDrag,
                "center": {
                    "x": center.x,
                    "y": center.y,
                    "z": center.z
                }
            }
        }
        /** TODO */
        public static CreateCollisionMetadata(type:string, trigger:boolean = false, convexmesh:boolean = false, restitution:number = 0.0, dynamicfriction:number = 0.6, staticfriction:number = 0.6): any {
            return {
                "type": type,
                "trigger": trigger,
                "convexmesh": convexmesh,
                "restitution": restitution,
                "dynamicfriction": dynamicfriction,
                "staticfriction": staticfriction,
                "wheelinformation": null
            }
        }
        /** TODO */
        public static CreatePhysicsProperties(mass:number, drag:number = 0.0, angularDrag:number = 0.05, useGravity:boolean = true, isKinematic:boolean = false): any {
            return {
                "mass": mass,
                "drag": drag,
                "angularDrag": angularDrag,
                "useGravity": useGravity,
                "isKinematic": isKinematic
            }
        }
        /** TODO */
        public static SetupPhysicsComponent(scene:BABYLON.Scene, entity: BABYLON.AbstractMesh): void {
            // console.warn("Setup Physics Component: " + entity.name);
            // console.log(entity);
            const metadata:any = (entity.metadata != null && entity.metadata.unity != null) ? entity.metadata.unity : null;
            if (metadata != null && (metadata.physics != null || metadata.collision != null)) {
                // Physics Metadata
                const hasphysics:boolean = (metadata.physics != null);
                const isroot:boolean = (metadata.physics != null && metadata.physics.root != null) ? metadata.physics.root : false;
                const mass:number = (metadata.physics != null && metadata.physics.mass != null) ? metadata.physics.mass : 0;
                const isstatic:boolean = (mass === 0);
                // Create Physics Impostor Node
                if (hasphysics === true) {
                    if (isroot) {
                        let fwheels:any[] = null;
                        let fdynamicfriction:number = 0;
                        let fstaticfriction:number = 0;
                        let frestitution:number = 0;
                        let ftrigger:boolean = false;
                        let fcount:number = 0;
                        // Note: Bullet Physics Center Mass Must Offset Meshes (No Working Set Center Mass Property Support)
                        const center:BABYLON.Vector3 = (metadata.physics != null && metadata.physics.center != null) ? BABYLON.Utilities.ParseVector3(metadata.physics.center, BABYLON.Vector3.Zero()) : BABYLON.Vector3.Zero();
                        let centernodes:BABYLON.TransformNode[] = entity.getChildren(null, true) as BABYLON.TransformNode[];
                        if (centernodes != null && centernodes.length > 0) {
                            centernodes.forEach((centernode:BABYLON.AbstractMesh) => { centernode.position.subtractInPlace(center); });
                        }
                        let childnodes:BABYLON.AbstractMesh[] = entity.getChildren(null, false) as BABYLON.AbstractMesh[];
                        if (childnodes != null && childnodes.length > 0) {
                            childnodes.forEach((childnode:BABYLON.AbstractMesh) => {
                                if (childnode.metadata != null && childnode.metadata.unity != null) {
                                    if (childnode.metadata.unity.collision != null) {
                                        const ccollision:any = childnode.metadata.unity.collision;
                                        const cwheelinformation:any = (ccollision.wheelinformation != null) ? ccollision.wheelinformation : null;
                                        if (cwheelinformation != null) {
                                            // Trace Wheel Collider
                                            // BABYLON.SceneManager.LogWarning(">>> Setup raycast wheel collider: " + childnode.name + " --> on to: " + entity.name);
                                            if (fwheels == null) fwheels = [];
                                            fwheels.push(cwheelinformation);
                                        } else {
                                            const cdynamicfriction:number = (ccollision.dynamicfriction != null) ? ccollision.dynamicfriction : 0.6;
                                            const cstaticfriction:number = (ccollision.staticfriction != null) ? ccollision.staticfriction : 0.6;
                                            const crestitution:number = (ccollision.restitution != null) ? ccollision.restitution : 0;
                                            const cistrigger:boolean = (ccollision.trigger != null) ? ccollision.trigger : false;
                                            const ccollider:string = (ccollision.type != null) ? ccollision.type : "BoxCollider";
                                            let cimpostortype:number = BABYLON.PhysicsImpostor.BoxImpostor;
                                            if (ccollider === "MeshCollider") {
                                                // Note: Always Force Convex Hull Impostor Usage
                                                cimpostortype = BABYLON.PhysicsImpostor.ConvexHullImpostor;
                                            } else if (ccollider === "CapsuleCollider") {
                                                cimpostortype = BABYLON.PhysicsImpostor.CapsuleImpostor;
                                            } else if (ccollider === "SphereCollider") {
                                                cimpostortype = BABYLON.PhysicsImpostor.SphereImpostor;
                                            } else {
                                                cimpostortype = BABYLON.PhysicsImpostor.BoxImpostor;
                                            }
                                            if (cdynamicfriction > fdynamicfriction) fdynamicfriction = cdynamicfriction;
                                            if (cstaticfriction > fstaticfriction) fstaticfriction = cstaticfriction;
                                            if (crestitution > frestitution) frestitution = crestitution;
                                            if (cistrigger == true) ftrigger = true;
                                            // Trace Compound Collider
                                            // BABYLON.SceneManager.LogWarning(">>> Setup " + BABYLON.SceneManager.GetPhysicsImposterType(cimpostortype).toLowerCase() + " compound imposter for: " + childnode.name);
                                            BABYLON.SceneManager.CreatePhysicsImpostor(scene, childnode, cimpostortype, { mass: 0, friction: 0, restitution: 0 });
                                            BABYLON.RigidbodyPhysics.ConfigRigidbodyPhysics(scene, childnode, true, false, metadata.physics);
                                            fcount++;
                                        }
                                    }
                                }
                            });
                        }
                        if (fcount > 0) {
                            // Trace Physics Root
                            // BABYLON.SceneManager.LogWarning(">>> Setup physics root no imposter for: " + entity.name);
                            BABYLON.SceneManager.CreatePhysicsImpostor(scene, entity, BABYLON.PhysicsImpostor.NoImpostor, { mass: mass, friction: fdynamicfriction, restitution: frestitution });
                            BABYLON.RigidbodyPhysics.ConfigRigidbodyPhysics(scene, entity, false, ftrigger, metadata.physics);
                        }
                        if (fwheels != null && fwheels.length > 0) {
                            if (entity.metadata == null) entity.metadata = {};
                            if (entity.metadata.unity == null) entity.metadata.unity = {};
                            entity.metadata.unity.wheels = fwheels;
                        }
                        childnodes = null;
                    } else if (metadata.collision != null) {
                        const collider:string = (metadata.collision.type != null) ? metadata.collision.type : "BoxCollider";
                        const convexmesh:boolean = (metadata.collision.convexmesh != null) ? metadata.collision.convexmesh : false;
                        const dynamicfriction:number = (metadata.collision.dynamicfriction != null) ? metadata.collision.dynamicfriction : 0.6;
                        const staticfriction:number = (metadata.collision.staticfriction != null) ? metadata.collision.staticfriction : 0.6;
                        const restitution:number = (metadata.collision.restitution != null) ? metadata.collision.restitution : 0;
                        const istrigger:boolean = (metadata.collision.trigger != null) ? metadata.collision.trigger : false;
                        let impostortype:number = BABYLON.PhysicsImpostor.BoxImpostor;
                        // Config Physics Impostor
                        if (collider === "MeshCollider") {
                            impostortype = (convexmesh === true) ? BABYLON.PhysicsImpostor.ConvexHullImpostor : BABYLON.PhysicsImpostor.MeshImpostor;
                        } else if (collider === "CapsuleCollider") {
                            impostortype = BABYLON.PhysicsImpostor.CapsuleImpostor;
                        } else if (collider === "SphereCollider") {
                            impostortype = BABYLON.PhysicsImpostor.SphereImpostor;
                        } else {
                            impostortype = BABYLON.PhysicsImpostor.BoxImpostor;
                        }
                        // Trace Physics Impostor
                        // BABYLON.SceneManager.LogWarning(">>> Setup " + BABYLON.SceneManager.GetPhysicsImposterType(impostortype).toLowerCase() + " physics impostor for: " + entity.name);
                        BABYLON.SceneManager.CreatePhysicsImpostor(scene, entity, impostortype, { mass: mass, friction: (isstatic) ? staticfriction : dynamicfriction, restitution: restitution });
                        BABYLON.RigidbodyPhysics.ConfigRigidbodyPhysics(scene, entity, false, istrigger, metadata.physics);
                    }
                }
            }
        }
        private static ConfigRigidbodyPhysics(scene:BABYLON.Scene, entity: BABYLON.AbstractMesh, child:boolean, trigger:boolean, physics:any):void {
            if (entity == null) return;
            if (entity.physicsImpostor != null) {
                entity.physicsImpostor.executeNativeFunction((word:any, body:any) => {
                    if (body.activate) body.activate();
                    const colobj:any = Ammo.castObject(body, Ammo.btCollisionObject);
                    colobj.entity = entity;
                    // ..
                    // Legacy Edge Contact (DEPRECIATED: KEEP FOR REFERENCE)
                    // ..
                    //const world:any = BABYLON.SceneManager.GetPhysicsWorld(scene);
                    //if (world != null && world.generateInternalEdgeInfo) {
                    //    const collisionShape:any = colobj.getCollisionShape();
                    //    if (collisionShape != null && collisionShape.getShapeType) {
                    //        const shapeType:number = collisionShape.getShapeType();
                    //        if (shapeType === 21) { // TRIANGLE_MESH_SHAPE_PROXYTYPE
                    //            const triangleShape:any = Ammo.castObject(collisionShape, Ammo.btBvhTriangleMeshShape);
                    //            if (triangleShape != null) {
                    //                colobj.triangleMapInfo = new Ammo.btTriangleInfoMap();
                    //                world.generateInternalEdgeInfo(triangleShape, colobj.triangleMapInfo);
                    //            }
                    //        }
                    //    }
                    //}
                    // ..
                    // Setup Main Gravity
                    // ..
                    const gravity:boolean = (physics != null && physics.gravity != null) ? physics.gravity : true;
                    if (gravity === false) {
                        if (body.setGravity) {
                            if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                            BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(0,0,0);
                            body.setGravity(BABYLON.RigidbodyPhysics.TempAmmoVector);
                        } else {
                            BABYLON.Tools.Warn("Physics engine set gravity override not supported for: " + entity.name);
                        }
                    }
                    // ..
                    // Setup Drag Damping
                    // ..
                    if (body.setDamping) {
                        const ldrag:number = (physics != null && physics.ldrag != null) ? physics.ldrag : 0;
                        const adrag:number = (physics != null && physics.adrag != null) ? physics.adrag : 0.05;
                        body.setDamping(ldrag, adrag);
                    } else {
                        BABYLON.Tools.Warn("Physics engine set drag damping not supported for: " + entity.name);
                    }
                    // ..
                    // Setup Collision Flags
                    // ..
                    if (body.setCollisionFlags && body.getCollisionFlags) {
                        // DEPRECIATED: if (trigger === true) body.setCollisionFlags(body.getCollisionFlags() | BABYLON.CollisionFlags.CF_NO_CONTACT_RESPONSE | BABYLON.CollisionFlags.CF_CUSTOM_MATERIAL_CALLBACK);
                        // DEPRECIATED: else body.setCollisionFlags(body.getCollisionFlags() | BABYLON.CollisionFlags.CF_CUSTOM_MATERIAL_CALLBACK);
                        // TODO: if (mass === 0) body.setCollisionFlags(body.getCollisionFlags() | BABYLON.CollisionFlags.CF_KINEMATIC_OBJECT); // STATIC_OBJECT
                        if (trigger === true) body.setCollisionFlags(body.getCollisionFlags() | BABYLON.CollisionFlags.CF_NO_CONTACT_RESPONSE); // TRIGGER_OBJECT
                        body.setCollisionFlags(body.getCollisionFlags() | BABYLON.CollisionFlags.CF_CUSTOM_MATERIAL_CALLBACK);                  // CUSTOM_MATERIAL
                    } else {
                        BABYLON.Tools.Warn("Physics engine set collision flags not supported for: " + entity.name);
                    }
                    // ..
                    // Setup Freeze Constraints
                    // ..
                    const freeze:any = (physics != null && physics.freeze != null) ? physics.freeze : null;
                    if (freeze != null) {
                        if (body.setLinearFactor) {
                            const freeze_pos_x:number = (freeze.positionx != null && freeze.positionx === true) ? 0 : 1;
                            const freeze_pos_y:number = (freeze.positiony != null && freeze.positiony === true) ? 0 : 1;
                            const freeze_pos_z:number = (freeze.positionz != null && freeze.positionz === true) ? 0 : 1;
                            if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                            BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(freeze_pos_x, freeze_pos_y, freeze_pos_z);
                            body.setLinearFactor(BABYLON.RigidbodyPhysics.TempAmmoVector);
                        } else {
                            BABYLON.Tools.Warn("Physics engine set linear factor not supported for: " + entity.name);
                        }
                        if (body.setAngularFactor) {
                            const freeze_rot_x:number = (freeze.rotationx != null && freeze.rotationx === true) ? 0 : 1;
                            const freeze_rot_y:number = (freeze.rotationy != null && freeze.rotationy === true) ? 0 : 1;
                            const freeze_rot_z:number = (freeze.rotationz != null && freeze.rotationz === true) ? 0 : 1;
                            if (BABYLON.RigidbodyPhysics.TempAmmoVector == null) BABYLON.RigidbodyPhysics.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                            BABYLON.RigidbodyPhysics.TempAmmoVector.setValue(freeze_rot_x, freeze_rot_y, freeze_rot_z);
                            body.setAngularFactor(BABYLON.RigidbodyPhysics.TempAmmoVector);
                        } else {
                            BABYLON.Tools.Warn("Physics engine set angular factor not supported for: " + entity.name);
                        }
                    }
                });
            } else {
                BABYLON.Tools.Warn("No valid physics impostor to setup for " + entity.name);
            }
        }
    }
    /**
     * Babylon collision contact info pro class (Native Bullet Physics 2.82)
     * @class CollisionContactInfo - All rights reserved (c) 2020 Mackey Kinard
     */
    export class CollisionContactInfo {
        public mesh:BABYLON.AbstractMesh = null;
        public state:number = 0;
        public reset:boolean = false;
    }    
}