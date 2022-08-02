module BABYLON {
    /**
     * Babylon raycast vehicle controller pro class (Native Bullet Physics 2.82)
     * @class RaycastVehicle - All rights reserved (c) 2020 Mackey Kinard
     */
    export class RaycastVehicle {
        private static TempAmmoVector:any = null;

        private _centerMass:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);
        private _chassisMesh:BABYLON.AbstractMesh = null;
        private _tempVectorPos:BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);

        public lockedWheelIndexes:number[] = null;
        public getCenterMassOffset():BABYLON.Vector3 { return this._centerMass; }
        public getInternalVehicle():any { return this.m_vehicle; }
        public getUpAxis():number { if (this.m_vehicle != null) return this.m_vehicle.getUpAxis(); }
        public getRightAxis():number { if (this.m_vehicle != null) return this.m_vehicle.getRightAxis(); }
        public getForwardAxis():number { if (this.m_vehicle != null) return this.m_vehicle.getForwardAxis(); }
        public getForwardVector():any { if (this.m_vehicle != null) return this.m_vehicle.getForwardVector(); }
        public getNumWheels():number { if (this.m_vehicle != null) return this.m_vehicle.getNumWheels(); }
        public getWheelInfo(wheel:number):any { if (this.m_vehicle != null) return this.m_vehicle.getWheelInfo(wheel); } // Ammo.btWheelInfo
        public resetSuspension():void { if (this.m_vehicle != null) this.m_vehicle.resetSuspension(); }
        public setPitchControl(pitch:number):void { if (this.m_vehicle != null) this.m_vehicle.setPitchControl(pitch); }
        public setEngineForce(power:number, wheel:number):void { if (this.m_vehicle != null) this.m_vehicle.applyEngineForce(power, wheel); }
        public setBrakingForce(brake:number, wheel:number):void { if (this.m_vehicle != null) this.m_vehicle.setBrake(brake, wheel); }
        public getWheelTransform(wheel:number):any { if (this.m_vehicle != null) return this.m_vehicle.getWheelTransformWS(wheel); } // Ammo.btTransform
        public updateWheelTransform(wheel:number, interpolate:boolean):void { if (this.m_vehicle != null) this.m_vehicle.updateWheelTransform(wheel, interpolate); }
        public getUserConstraintType():number { if (this.m_vehicle != null) return this.m_vehicle.getUserConstraintType(); }
        public setUserConstraintType(userConstraintType:number):void { if (this.m_vehicle != null) this.m_vehicle.setUserConstraintType(userConstraintType); }
        public setUserConstraintId(uid:number):void { if (this.m_vehicle != null) this.m_vehicle.setUserConstraintId(uid); }
        public getUserConstraintId():number { if (this.m_vehicle != null) return this.m_vehicle.getUserConstraintId(); }
        public getRawCurrentSpeedKph():number { if (this.m_vehicle != null) return this.m_vehicle.getCurrentSpeedKmHour(); }
        public getRawCurrentSpeedMph():number { if (this.m_vehicle != null) return this.m_vehicle.getCurrentSpeedKmHour() * BABYLON.System.Kph2Mph; }
        public getAbsCurrentSpeedKph():number { if (this.m_vehicle != null) return Math.abs(this.m_vehicle.getCurrentSpeedKmHour()); }
        public getAbsCurrentSpeedMph():number { if (this.m_vehicle != null) return Math.abs(this.m_vehicle.getCurrentSpeedKmHour()) * BABYLON.System.Kph2Mph; }
        public getVehicleTuningSystem():any { return this.m_vehicleTuning; } // Ammo.btVehicleTuning
        public getChassisWorldTransform():any { if (this.m_vehicle != null) return this.m_vehicle.getChassisWorldTransform(); } // Ammo.btTransform

        protected m_vehicle:any = null;
        protected m_vehicleTuning:any = null;
        protected m_vehicleRaycaster:any = null;
        protected m_vehicleColliders:any[] = null;
        protected m_tempTransform:any = null;
        protected m_tempPosition:any = null;
        protected m_wheelDirectionCS0:any = null;
        protected m_wheelAxleCS:any = null;
        public constructor(entity:BABYLON.AbstractMesh, world:any, center:BABYLON.Vector3, defaultAngularFactor:BABYLON.Vector3 = null) {
            this._chassisMesh = entity;
            this._centerMass = center;
            this.m_vehicleTuning = new Ammo.btVehicleTuning();
            this.m_vehicleRaycaster = (Ammo.btSmoothVehicleRaycaster != null) ? new Ammo.btSmoothVehicleRaycaster(world) : new Ammo.btDefaultVehicleRaycaster(world);
            this.m_vehicleColliders =  (this._chassisMesh.metadata != null && this._chassisMesh.metadata.unity != null && this._chassisMesh.metadata.unity.wheels != null) ? this._chassisMesh.metadata.unity.wheels : null;
            this.m_vehicle = new Ammo.btRaycastVehicle(this.m_vehicleTuning, this._chassisMesh.physicsImpostor.physicsBody, this.m_vehicleRaycaster);
            this.m_vehicle.setCoordinateSystem(0, 1, 2);                // Y-UP-AXIS
            this.m_wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0);    // Y-UP-AXIS
            this.m_wheelAxleCS = new Ammo.btVector3(-1, 0, 0);          // Y-UP-AXIS
            this.m_tempPosition = null;
            this.m_tempTransform = null;
            this.setupWheelInformation(defaultAngularFactor);
            world.addAction(this.m_vehicle);
        }
        public dispose():void {
            this.deleteWheelInformation();
            if (this.m_vehicle != null) {
                Ammo.destroy(this.m_vehicle);
                this.m_vehicle = null;
            }
            if (this.m_vehicleTuning != null) {
                Ammo.destroy(this.m_vehicleTuning);
                this.m_vehicleTuning = null;
            }
            if (this.m_vehicleRaycaster != null) {
                Ammo.destroy(this.m_vehicleRaycaster);
                this.m_vehicleRaycaster = null;
            }
            if (this.m_wheelDirectionCS0 != null) {
                Ammo.destroy(this.m_wheelDirectionCS0);
                this.m_wheelDirectionCS0 = null;
            }
            if (this.m_wheelAxleCS != null) {
                Ammo.destroy(this.m_wheelAxleCS);
                this.m_wheelAxleCS = null;
            }
            if (this.m_tempPosition != null) {
                this.m_tempPosition = null;
            }
            if (this.m_tempTransform != null) {
                this.m_tempTransform = null;
            }
            this.m_vehicleColliders = null;
        }

        ///////////////////////////////////////////////////////
        // Static Raycast Vehicle Instance Helper Functions
        ///////////////////////////////////////////////////////

        /** Gets the rigidbody raycast vehicle controller for the entity. Note: Wheel collider metadata informaion is required for raycast vehicle control. */
        public static GetInstance(scene:BABYLON.Scene, rigidbody:BABYLON.RigidbodyPhysics, defaultAngularFactor:BABYLON.Vector3 = null):BABYLON.RaycastVehicle {
            const anybody:any = rigidbody;
            if (anybody.m_raycastVehicle == null) {
                if (rigidbody.hasWheelColliders()) {
                    const rightHanded:boolean = BABYLON.SceneManager.GetRightHanded(scene);
                    if (rightHanded === true) BABYLON.Tools.Warn("Raycast vehicle not supported for right handed scene: " + anybody._abstractMesh.name);
                    anybody.m_raycastVehicle = new BABYLON.RaycastVehicle(anybody._abstractMesh, anybody.m_physicsWorld, anybody._centerOfMass, defaultAngularFactor);
                } else {
                    BABYLON.Tools.Warn("No wheel collider metadata found for: " + anybody._abstractMesh.name);
                }
            }
            return anybody.m_raycastVehicle;
        }

        ///////////////////////////////////////////////////////
        // Smooth Raycast Vehicle Advanced Helper Functions
        ///////////////////////////////////////////////////////

        /** Gets vehicle enable multi raycast flag using physics vehicle object. (Advanved Use Only) */
        public getEnableMultiRaycast():boolean {
            let result:boolean = false;
            if (this.m_vehicle != null && this.m_vehicle.get_m_enableMultiRaycast) {
                result = this.m_vehicle.get_m_enableMultiRaycast();
            }
            return result;
        }
        /** Sets vehicle enable multi raycast flag using physics vehicle object. (Advanved Use Only) */
        public setEnableMultiRaycast(flag:boolean):void {
            if (this.m_vehicle != null && this.m_vehicle.set_m_enableMultiRaycast) {
                this.m_vehicle.set_m_enableMultiRaycast(flag);
            }
        }
        /** Gets vehicle stable force using physics vehicle object. (Advanved Use Only) */
        public getStabilizingForce():number {
            let result:number = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_stabilizingForce) {
                result = this.m_vehicle.get_m_stabilizingForce();
            }
            return result;
        }
        /** Sets vehicle stable force using physics vehicle object. (Advanved Use Only) */
        public setStabilizingForce(force:number):void {
            if (this.m_vehicle != null && this.m_vehicle.set_m_stabilizingForce) {
                this.m_vehicle.set_m_stabilizingForce(force);
            }
        }
        /** Gets vehicle max stable force using physics vehicle object. (Advanved Use Only) */
        public getMaxImpulseForce():number {
            let result:number = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_maxImpulseForce) {
                result = this.m_vehicle.get_m_maxImpulseForce();
            }
            return result;
        }
        /** Sets vehicle max stable force using physics vehicle object. (Advanved Use Only) */
        public setMaxImpulseForce(force:number):void {
            if (this.m_vehicle != null && this.m_vehicle.set_m_maxImpulseForce) {
                this.m_vehicle.set_m_maxImpulseForce(force);
            }
        }
        /** Gets vehicle smooth flying impulse force using physics vehicle object. (Advanved Use Only) */
        public getSmoothFlyingImpulse():number {
            let result:number = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_smoothFlyingImpulse) {
                result = this.m_vehicle.get_m_smoothFlyingImpulse();
            }
            return result;
        }
        /** Sets vehicle smooth flying impulse using physics vehicle object. (Advanved Use Only) */
        public setSmoothFlyingImpulse(impulse:number):void {
            if (this.m_vehicle != null && this.m_vehicle.set_m_smoothFlyingImpulse) {
                this.m_vehicle.set_m_smoothFlyingImpulse(impulse);
            }
        }
        /** Gets vehicle track connection accel force using physics vehicle object. (Advanved Use Only) */
        public getTrackConnectionAccel():number {
            let result:number = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_trackConnectionAccel) {
                result = this.m_vehicle.get_m_trackConnectionAccel();
            }
            return result;
        }
        /** Sets vehicle track connection accel force using physics vehicle object. (Advanved Use Only) */
        public setTrackConnectionAccel(force:number):void {
            if (this.m_vehicle != null && this.m_vehicle.set_m_trackConnectionAccel) {
                this.m_vehicle.set_m_trackConnectionAccel(force);
            }
        }
        /** Gets vehicle min wheel contact count using physics vehicle object. (Advanved Use Only) */
        public getMinimumWheelContacts():number {
            let result:number = -1;
            if (this.m_vehicle != null && this.m_vehicle.get_m_minimumWheelContacts) {
                result = this.m_vehicle.get_m_minimumWheelContacts();
            }
            return result;
        }
        /** Sets vehicle min wheel contact count using physics vehicle object. (Advanved Use Only) */
        public setMinimumWheelContacts(force:number):void {
            if (this.m_vehicle != null && this.m_vehicle.set_m_minimumWheelContacts) {
                this.m_vehicle.set_m_minimumWheelContacts(force);
            }
        }
        /** Gets vehicle interpolate mesh normals flag using physics raycaster object. (Advanved Use Only) */
        public getInterpolateNormals():boolean {
            let result:boolean = false;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_interpolateNormals) {
                result = this.m_vehicleRaycaster.get_m_interpolateNormals();
            }
            return result;
        }
        /** Sets the vehicle interpolate mesh normals using physics raycaster object. (Advanved Use Only) */
        public setInterpolateNormals(flag:boolean):void {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_interpolateNormals) {
                this.m_vehicleRaycaster.set_m_interpolateNormals(flag);
            }
        }
        /** Gets vehicle shape testing mode using physics raycaster object. (Advanved Use Only) */
        public getShapeTestingMode():boolean {
            let result:boolean = false;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_shapeTestingMode) {
                result = this.m_vehicleRaycaster.get_m_shapeTestingMode();
            }
            return result;
        }
        /** Sets the vehicle shape testing mode using physics raycaster object. (Advanved Use Only) */
        public setShapeTestingMode(mode:boolean):void {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_shapeTestingMode) {
                this.m_vehicleRaycaster.set_m_shapeTestingMode(mode);
            }
        }
        /** Gets vehicle shape testing size using physics raycaster object. (Advanved Use Only) */
        public getShapeTestingSize():float {
            let result:number = 0;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_shapeTestingSize) {
                result = this.m_vehicleRaycaster.get_m_shapeTestingSize();
            }
            return result;
        }
        /** Sets the vehicle shape testing mode using physics raycaster object. (Advanved Use Only) */
        public setShapeTestingSize(size:float):void {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_shapeTestingSize) {
                this.m_vehicleRaycaster.set_m_shapeTestingSize(size);
            }
        }
        /** Gets vehicle shape test point count using physics raycaster object. (Advanved Use Only) */
        public getShapeTestingCount():float {
            let result:number = 0;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_testPointCount) {
                result = this.m_vehicleRaycaster.get_m_testPointCount();
            }
            return result;
        }
        /** Sets the vehicle shape test point count using physics raycaster object. (Advanved Use Only) */
        public setShapeTestingCount(count:float):void {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_testPointCount) {
                this.m_vehicleRaycaster.set_m_testPointCount(count);
            }
        }
        /** Gets vehicle sweep penetration amount using physics raycaster object. (Advanved Use Only) */
        public getSweepPenetration():float {
            let result:number = 0;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_sweepPenetration) {
                result = this.m_vehicleRaycaster.get_m_sweepPenetration();
            }
            return result;
        }
        /** Sets the vehicle sweep penetration amount using physics raycaster object. (Advanved Use Only) */
        public setSweepPenetration(amount:float):void {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_sweepPenetration) {
                this.m_vehicleRaycaster.set_m_sweepPenetration(amount);
            }
        }

        ///////////////////////////////////////////////////////
        // Smooth Raycast Vehicle Advanced Collision Functions
        ///////////////////////////////////////////////////////

        /** Gets vehicle collision group filter using physics raycaster object. (Advanved Use Only) */
        public getCollisionFilterGroup():number {
            let result:number = -1;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_collisionFilterGroup) {
                result = this.m_vehicleRaycaster.get_m_collisionFilterGroup();
            }
            return result;
        }
        /** Sets vehicle collision group filter using physics raycaster object. (Advanved Use Only) */
        public setCollisionFilterGroup(group:number):void {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_collisionFilterGroup) {
                this.m_vehicleRaycaster.set_m_collisionFilterGroup(group);
            }
        }
        /** Gets vehicle collision mask filter using physics raycaster object. (Advanved Use Only) */
        public getCollisionFilterMask():number {
            let result:number = -1;
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.get_m_collisionFilterMask) {
                result = this.m_vehicleRaycaster.get_m_collisionFilterMask();
            }
            return result;
        }
        /** Sets the vehicle collision mask filter using physics raycaster object. (Advanved Use Only) */
        public setCollisionFilterMask(mask:number):void {
            if (this.m_vehicleRaycaster != null && this.m_vehicleRaycaster.set_m_collisionFilterMask) {
                this.m_vehicleRaycaster.set_m_collisionFilterMask(mask);
            }
        }

        ///////////////////////////////////////////////////////
        // Raycast Vehicle Wheel Information Helper Funtions
        ///////////////////////////////////////////////////////

        /** Gets the internal wheel index by id string. */
        public getWheelIndexByID(id:string):number {
            let result = -1;
            if (this.m_vehicleColliders != null && this.m_vehicleColliders.length > 0) {
                for (let index = 0; index < this.m_vehicleColliders.length; index++) {
                    const wheel:any = this.m_vehicleColliders[index];
                    if (id.toLowerCase() === wheel.id.toLowerCase()) {
                        result = index;
                        break;
                    }
                }
            }
            return result;
        }
        /** Gets the internal wheel index by name string. */
        public getWheelIndexByName(name:string):number {
            let result = -1;
            if (this.m_vehicleColliders != null && this.m_vehicleColliders.length > 0) {
                for (let index = 0; index < this.m_vehicleColliders.length; index++) {
                    const wheel:any = this.m_vehicleColliders[index];
                    if (name.toLowerCase() === wheel.name.toLowerCase()) {
                        result = index;
                        break;
                    }
                }
            }
            return result;
        }
        /** Gets the internal wheel collider information. */
        public getWheelColliderInfo(wheel:number):number {
            let result = -1;
            if (this.m_vehicleColliders != null && this.m_vehicleColliders.length > 0 && this.m_vehicleColliders.length > wheel) {
                result = this.m_vehicleColliders[wheel];
            }
            return result;
        }
        /** Sets the internal wheel hub transform mesh by index. Used to rotate and bounce wheels. */
        public setWheelTransformMesh(wheel:number, transform:BABYLON.TransformNode):void {
            if (transform == null) return;
            const wheelinfo:any = this.getWheelInfo(wheel);
            if (wheelinfo != null) wheelinfo.transform = transform;
        }

        ///////////////////////////////////////////////////////
        // Smooth Raycast Vehicle Seering Helper Functions
        ///////////////////////////////////////////////////////

        public getVisualSteeringAngle(wheel:number):number {
            let result:number = 0;
            const wheelinfo:any = this.getWheelInfo(wheel);
            if (wheelinfo != null && wheelinfo.steeringAngle != null) {
                result = wheelinfo.steeringAngle; 
            }
            return result;
        }
        public setVisualSteeringAngle(angle:number, wheel:number):void {
            const wheelinfo:any = this.getWheelInfo(wheel);
            if (wheelinfo != null) {
                wheelinfo.steeringAngle = angle;
            }
        }
        public getPhysicsSteeringAngle(wheel:number):number {
            if (this.m_vehicle != null) {
                return Math.abs(this.m_vehicle.getSteeringValue(wheel));
            }
        }
        public setPhysicsSteeringAngle(angle:number, wheel:number):void {
            if (this.m_vehicle != null) {
                this.m_vehicle.setSteeringValue(angle, wheel);
            }
        }

        /////////////////////////////////////////////
        // Setup Wheel Information Helper Funtions //
        /////////////////////////////////////////////

        protected setupWheelInformation(defaultAngularFactor:BABYLON.Vector3 = null):void {
            if (this._chassisMesh != null && this._chassisMesh.physicsImpostor != null && this._chassisMesh.physicsImpostor.physicsBody != null) {
                if (defaultAngularFactor != null) {
                    // https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=8153
                    // prevent vehicle from flip over, by limit the rotation  on forward axis or limit angles for vehicle stablization
                    if (BABYLON.RaycastVehicle.TempAmmoVector == null) BABYLON.RaycastVehicle.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RaycastVehicle.TempAmmoVector.setValue(defaultAngularFactor.x, defaultAngularFactor.y, defaultAngularFactor.z);
                    this._chassisMesh.physicsImpostor.physicsBody.setAngularFactor(BABYLON.RaycastVehicle.TempAmmoVector);
                }
                this._chassisMesh.physicsImpostor.physicsBody.setActivationState(BABYLON.CollisionState.DISABLE_DEACTIVATION);
            }
            if (this.m_vehicle != null && this.m_vehicleColliders != null && this.m_vehicleColliders.length > 0) {
                let index = -1;
                for (index = 0; index < this.m_vehicleColliders.length; index++) {
                    const wheel:any = this.m_vehicleColliders[index];
                    const wheelName:string = (wheel.name != null) ? wheel.name : "Unknown";
                    const wheelRadius:number = (wheel.radius != null) ? wheel.radius : 0.35;
                    const wheelHalfTrack:number = (wheel.position != null && wheel.position.length >= 3) ? wheel.position[0] : 1;
                    const wheelAxisPosition:number = (wheel.position != null && wheel.position.length >= 3) ? wheel.position[2] : -1;
                    // ..
                    // Raycast Wheel Script Properties
                    // ..
                    const wheelConnectionPoint:number = (wheel.wheelconnectionpoint != null) ? wheel.wheelconnectionpoint : 0.5;
                    const suspensionRestLength:number = (wheel.suspensionrestlength != null) ? wheel.suspensionrestlength : 0.3;
                    const isfrontwheel:boolean = (wheel.frontwheel != null) ? true : (wheelName.toLowerCase().indexOf("front") >= 0);
                    const wheelposition:number = wheelAxisPosition;
                    const wheeltracking:number = wheelHalfTrack;
                    const centermassx:number = -this._centerMass.x;
                    const centermassz:number = -this._centerMass.z;

                    if (BABYLON.RaycastVehicle.TempAmmoVector == null) BABYLON.RaycastVehicle.TempAmmoVector = new Ammo.btVector3(0, 0, 0);
                    BABYLON.RaycastVehicle.TempAmmoVector.setValue((wheeltracking + centermassx), wheelConnectionPoint, (wheelposition + centermassz));
                    this.m_vehicle.addWheel(BABYLON.RaycastVehicle.TempAmmoVector, this.m_wheelDirectionCS0, this.m_wheelAxleCS, suspensionRestLength, wheelRadius, this.m_vehicleTuning, isfrontwheel);
                }
                if (this.m_vehicle.getNumWheels() === this.m_vehicleColliders.length) {
                    for (index = 0; index < this.m_vehicleColliders.length; index++) {
                        const wheel:any = this.m_vehicleColliders[index];
                        const defaultForce:number = (wheel.totalsuspensionforces != null) ? wheel.totalsuspensionforces : 25000;        // Bullet: 6000
                        const defaultTravel:number = (wheel.suspensiontravelcm != null) ? wheel.suspensiontravelcm : 100;               // Bullet: 500
                        const defaultRolling:number = (wheel.rollinfluence != null) ? wheel.rollinfluence : 0.2;                        // Bullet: 0.1
                        const defaultFriction:number = (wheel.frictionslip != null) ? wheel.frictionslip : 10;                          // Bullet: 10.5
                        const suspensionStiffness:number = (wheel.suspensionstiffness != null) ? wheel.suspensionstiffness : 50;        // Bullet: 5.88
                        const suspensionCompression:number = (wheel.dampingcompression != null) ? wheel.dampingcompression : 2.5;       // Bullet: 0.83
                        const suspensionDamping:number = (wheel.dampingrelaxation != null) ? wheel.dampingrelaxation : 4.5;             // Bullet: 0.88
                        const wheelinfo:any = this.m_vehicle.getWheelInfo(index);
                        if (wheelinfo != null) {
                            wheelinfo.steeringAngle = 0;
                            wheelinfo.rotationBoost = 0;
                            wheelinfo.defaultFriction = defaultFriction;
                            wheelinfo.set_m_frictionSlip(defaultFriction);
                            wheelinfo.set_m_rollInfluence(defaultRolling);
                            wheelinfo.set_m_maxSuspensionForce(defaultForce);
                            wheelinfo.set_m_maxSuspensionTravelCm(defaultTravel);
                            wheelinfo.set_m_suspensionStiffness(suspensionStiffness);
                            wheelinfo.set_m_wheelsDampingCompression(suspensionCompression);
                            wheelinfo.set_m_wheelsDampingRelaxation(suspensionDamping);
                        }
                    }
                } else {
                    BABYLON.Tools.Warn("Failed to create proper number of wheels for: " + this._chassisMesh.name);
                }
            }
        }
        protected updateWheelInformation():void {
            const wheels:number = this.getNumWheels();
            if (wheels > 0) {
                for (let index:number = 0; index < wheels; index++) {
                    const wheelinfo:any = this.getWheelInfo(index);
                    if (wheelinfo != null) {
                        const locked:boolean = this.lockedWheelInformation(index);
                        this.updateWheelTransform(index, false);
                        // Update Wheel Information Internals
                        this.m_tempTransform = this.getWheelTransform(index);
                        this.m_tempPosition = this.m_tempTransform.getOrigin();
                        // Sync Wheel Hub Transform To Raycast Wheel
                        if (wheelinfo.transform != null) {
                            const transform:BABYLON.TransformNode = wheelinfo.transform as BABYLON.TransformNode;
                            if (transform.parent != null) {
                                // Update Wheel Hub Position
                                BABYLON.Utilities.ConvertAmmoVector3ToRef(this.m_tempPosition, this._tempVectorPos);
                                BABYLON.Utilities.InverseTransformPointToRef(transform.parent as BABYLON.TransformNode, this._tempVectorPos, this._tempVectorPos);
                                transform.position.y = this._tempVectorPos.y;
                                // Update Wheel Hub Steering
                                let steeringAngle:number = (wheelinfo.steeringAngle != null) ? wheelinfo.steeringAngle : 0;
                                BABYLON.Quaternion.FromEulerAnglesToRef(0, steeringAngle, 0, transform.rotationQuaternion);
                                // Update Wheel Spinner Rotation
                                if (wheelinfo.spinner != null && wheelinfo.spinner.addRotation) {
                                    if (locked === false) {
                                        let wheelrotation:number = 0;
                                        let deltaRotation:number = (wheelinfo.get_m_deltaRotation != null) ? wheelinfo.get_m_deltaRotation() : 0;
                                        let rotationBoost:number = (wheelinfo.rotationBoost != null) ? wheelinfo.rotationBoost : 0;
                                        if (deltaRotation < 0) wheelrotation = (deltaRotation + -rotationBoost);
                                        else wheelrotation = (deltaRotation + rotationBoost);
                                        wheelinfo.spinner.addRotation(wheelrotation, 0, 0);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        protected lockedWheelInformation(wheel:number):boolean {
            let result:boolean = false;
            if (this.lockedWheelIndexes != null && this.lockedWheelIndexes.length > 0) {
                for (let index = 0; index < this.lockedWheelIndexes.length; index++) {
                    if (this.lockedWheelIndexes[index] === wheel) {
                        result = true;
                        break;
                    }
                }
            }
            return result;
        }
        protected deleteWheelInformation():void {
            const wheels:number = this.getNumWheels();
            if (wheels > 0) {
                for (let index:number = 0; index < wheels; index++) {
                    const info:any = this.getWheelInfo(index);
                    if (info != null) {
                        if (info.transform != null) {
                            delete info.transform;
                        }
                        if (info.spinner != null) {
                            delete info.spinner;
                        }
                        if (info.steeringAngle != null) {
                            delete info.steeringAngle;
                        }
                        if (info.rotationBoost != null) {
                            delete info.rotationBoost;
                        }
                        if (info.defaultFriction != null) {
                            delete info.defaultFriction;
                        }
                    }
                }
            }
        }
    }
}