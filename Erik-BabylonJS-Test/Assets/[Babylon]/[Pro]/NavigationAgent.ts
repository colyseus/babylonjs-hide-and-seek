module BABYLON {
    /**
     * Babylon navigation agent pro class (Unity Style Navigation Agent System)
     * @class NavigationAgent - All rights reserved (c) 2020 Mackey Kinard
     */
    export class NavigationAgent extends BABYLON.ScriptComponent {
        private static TARGET_ANGLE_FACTOR:number = (Math.PI * 0.5);
        private static ANGULAR_SPEED_RATIO:number = 0.05;
        private type: number;
        private speed: number
        private baseOffset: number;
        private avoidRadius: number;
        private avoidHeight: number;
        private acceleration: number;
        private areaMask: number;
        private autoRepath: boolean;
        private autoBraking: boolean;
        private autoTraverseOffMeshLink: boolean;
        private avoidancePriority: number;
        private obstacleAvoidanceType: number;
        private distanceToTarget:number = 0;
        private teleporting:boolean = false;
        private moveDirection:BABYLON.Vector3 = new BABYLON.Vector3(0.0, 0.0, 0.0);
        private resetPosition:BABYLON.Vector3 = new BABYLON.Vector3(0.0, 0.0, 0.0);
        private lastPosition:BABYLON.Vector3 = new BABYLON.Vector3(0.0, 0.0, 0.0);
        private distancePosition:BABYLON.Vector3 = new BABYLON.Vector3(0.0, 0.0, 0.0);
        private currentPosition:BABYLON.Vector3 = new BABYLON.Vector3(0.0, 0.0, 0.0);
        private currentRotation:BABYLON.Quaternion = new BABYLON.Quaternion(0.0, 0.0, 0.0, 1.0);
        private currentVelocity:BABYLON.Vector3 = new BABYLON.Vector3(0.0, 0.0, 0.0);
        private currentWaypoint:BABYLON.Vector3 = new BABYLON.Vector3(0.0, 0.0, 0.0);
        
        public heightOffset:number = 0;
        public angularSpeed: number = 0;
        public updatePosition:boolean = true;
        public updateRotation:boolean = true;
        public distanceEpsilon:number = 0.1;
        public velocityEpsilon:number = 1.1;
        public offMeshVelocity: number = 1.5;
        public stoppingDistance: number = 0;
        public isReady():boolean { return this.m_agentReady; }
        public isNavigating():boolean { return (this.m_agentDestination != null); }
        public isTeleporting():boolean { return this.teleporting; }
        public isOnOffMeshLink():boolean { return (this.m_agentState === BABYLON.CrowdAgentState.DT_CROWDAGENT_STATE_OFFMESH); }
        public getAgentType():number { return this.type; }
        public getAgentState():number { return this.m_agentState; }
        public getAgentIndex():number { return this.m_agentIndex; }
        public getAgentOffset():number { return this.baseOffset; }
        public getTargetDistance():number { return this.distanceToTarget; }
        public getCurrentPosition():BABYLON.Vector3 { return this.currentPosition; }
        public getCurrentRotation():BABYLON.Quaternion { return this.currentRotation; }
        public getCurrentVelocity():BABYLON.Vector3 { return this.currentVelocity; }
        public getAgentParameters():BABYLON.IAgentParameters { return this.m_agentParams; }
        public setAgentParameters(parameters:BABYLON.IAgentParameters):void { this.m_agentParams = parameters; this.updateAgentParameters(); }
        /** Register handler that is triggered when the agent is ready for navigation */
        public onReadyObservable = new BABYLON.Observable<BABYLON.TransformNode>();
        /** Register handler that is triggered before the navigation update */
        public onPreUpdateObservable = new BABYLON.Observable<BABYLON.TransformNode>();
        /** Register handler that is triggered after the navigation update */
        public onPostUpdateObservable = new BABYLON.Observable<BABYLON.TransformNode>();
        /** Register handler that is triggered when the navigation is complete */
        public onNavCompleteObservable = new BABYLON.Observable<BABYLON.TransformNode>();

        protected m_agentState:number = 0;
        protected m_agentIndex:number = -1;
        protected m_agentReady:boolean = false;
        protected m_agentGhost:BABYLON.TransformNode = null;
        protected m_agentParams:BABYLON.IAgentParameters = null;
        protected m_agentMovement:BABYLON.Vector3 = new BABYLON.Vector3(0.0, 0.0, 0.0);
        protected m_agentDirection:BABYLON.Vector3 = new BABYLON.Vector3(0.0, 0.0, 1.0);
        protected m_agentQuaternion:BABYLON.Quaternion = new BABYLON.Quaternion(0.0, 0.0, 0.0, 1.0);
        protected m_agentDestination:BABYLON.Vector3 = null;
        
        protected awake(): void { this.awakeNavigationAgent(); }
        protected update(): void { this.updateNavigationAgent(); }
        protected destroy(): void { this.destroyNavigationAgent(); }

        //////////////////////////////////////////////////////
        // Navigation Private Functions                     //
        //////////////////////////////////////////////////////

        private awakeNavigationAgent():void {
            this.type = this.getProperty("type", this.type);
            this.speed = this.getProperty("speed", this.speed);
            this.baseOffset = this.getProperty("offset", this.baseOffset);
            this.angularSpeed = this.getProperty("angularspeed", this.angularSpeed);
            this.acceleration = this.getProperty("acceleration", this.acceleration);
            this.stoppingDistance = this.getProperty("stoppingdistance", this.stoppingDistance);
            this.autoBraking = this.getProperty("autobraking", this.autoBraking);
            this.avoidRadius = this.getProperty("avoidradius", this.avoidRadius);
            this.avoidHeight = this.getProperty("avoidheight", this.avoidHeight);
            this.obstacleAvoidanceType = this.getProperty("avoidquality", this.obstacleAvoidanceType);
            this.avoidancePriority = this.getProperty("avoidpriority", this.avoidancePriority);
            this.autoTraverseOffMeshLink = this.getProperty("autotraverse", this.autoTraverseOffMeshLink);
            this.autoRepath = this.getProperty("autopepath", this.autoRepath);
            this.areaMask = this.getProperty("areamask", this.areaMask);
            // ..
            BABYLON.Utilities.ValidateTransformQuaternion(this.transform);
            // DEBUG: this.m_agentGhost = BABYLON.Mesh.CreateBox((this.transform.name + "Agent"), 1, this.scene);
            this.m_agentGhost = new BABYLON.TransformNode((this.transform.name + ".Agent"), this.scene);
            this.m_agentGhost.position = new BABYLON.Vector3(0.0, 0.0, 0.0);
            this.m_agentGhost.rotation = new BABYLON.Vector3(0.0, 0.0, 0.0);
            BABYLON.Utilities.ValidateTransformQuaternion(this.m_agentGhost);
            this.m_agentGhost.position.copyFrom(this.transform.position);
            this.lastPosition.copyFrom(this.transform.position);
        }

        private updateNavigationAgent():void {
            const crowd:BABYLON.ICrowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (crowd == null) return; // Note: No Detour Navigation Mesh Available Yet
            if (this.m_agentIndex < 0) {
                this.m_agentParams = {
                    radius: this.avoidRadius,
                    height: this.avoidHeight,
                    maxSpeed: this.speed,
                    maxAcceleration: this.acceleration,
                    collisionQueryRange: 2.0,
                    pathOptimizationRange: 20.0,
                    separationWeight: 1.0
                };
                BABYLON.Utilities.GetAbsolutePositionToRef(this.transform, this.resetPosition);
                this.m_agentIndex = crowd.addAgent(this.resetPosition, this.m_agentParams, this.m_agentGhost);
                if (this.m_agentIndex >= 0) {
                    this.m_agentReady = true;
                    if (this.onReadyObservable.hasObservers() === true) {
                        this.onReadyObservable.notifyObservers(this.transform);
                    }
                }
                return; // Note: Start Updating Navigation Agent Next Frame
            }
            // ..
            this.m_agentState = crowd.getAgentState(this.m_agentIndex);
            this.getAgentWaypointToRef(this.currentWaypoint);
            this.getAgentPositionToRef(this.currentPosition);
            this.distancePosition.copyFrom(this.currentPosition);
            if (this.isOnOffMeshLink()) {
                this.currentPosition.subtractToRef(this.lastPosition, this.currentVelocity);
                this.currentVelocity.scaleInPlace(this.speed * this.offMeshVelocity);
            } else {
                this.getAgentVelocityToRef(this.currentVelocity);
            }
            if (this.onPreUpdateObservable.hasObservers() === true) {
                this.onPreUpdateObservable.notifyObservers(this.transform);
            }
            this.currentPosition.y += (this.baseOffset + this.heightOffset);
            if (this.currentVelocity.length() >= this.velocityEpsilon) {
                this.currentVelocity.normalize();
                const rotateFactor:number = (this.angularSpeed * BABYLON.NavigationAgent.ANGULAR_SPEED_RATIO * this.getDeltaSeconds());
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // KEEP FOR REFERENCE: Compute Agent Orientation
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Note: Interpolate the rotation on Y to get a smoother orientation change
                // const desiredRotation:number = Math.atan2(this.currentVelocity.x, this.currentVelocity.z);
                // this.transform.rotation.y = this.transform.rotation.y + (desiredRotation - this.transform.rotation.y) * 0.05;
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (this.isOnOffMeshLink()) {
                    // Rotate Toward Velocity Direction
                    this.moveDirection.copyFrom(this.m_agentDirection);
                    this.m_agentDirection.set((this.moveDirection.x + (this.currentVelocity.x - this.moveDirection.x)), (this.moveDirection.y + (this.currentVelocity.y - this.moveDirection.y)), (this.moveDirection.z + (this.currentVelocity.z - this.moveDirection.z)));
                    this.m_agentDirection.normalize();
                    const targetAngle:number = (BABYLON.NavigationAgent.TARGET_ANGLE_FACTOR - Math.atan2(this.m_agentDirection.x, this.m_agentDirection.z));
                    BABYLON.Quaternion.FromEulerAnglesToRef(0.0, targetAngle, 0.0, this.currentRotation);
                    // Rotation Update
                    if (this.isNavigating() && this.updateRotation === true) {
                        BABYLON.Quaternion.SlerpToRef(this.transform.rotationQuaternion, this.currentRotation, rotateFactor, this.transform.rotationQuaternion);
                    }
                } else {
                    // Rotate Toward Next Target Waypoint
                    this.m_agentQuaternion.copyFrom(this.transform.rotationQuaternion);
                    if (this.isNavigating() && this.updateRotation === true) {
                        this.transform.lookAt(this.currentWaypoint);
                    }
                    // Correct Transform Look At Rotation
                    this.transform.rotationQuaternion.toEulerAnglesToRef(this.m_agentDirection);
                    BABYLON.Quaternion.FromEulerAnglesToRef(0.0, this.m_agentDirection.y, 0.0, this.currentRotation);
                    // Rotation Update
                    if (this.isNavigating() && this.updateRotation === true) {
                        BABYLON.Quaternion.SlerpToRef(this.m_agentQuaternion, this.currentRotation, rotateFactor, this.transform.rotationQuaternion);
                    }
                }
            }
            // Position Update
            if (this.isNavigating() && this.updatePosition === true) {
                this.transform.position.copyFrom(this.currentPosition);
            }
            // Target Distance
            if (this.isNavigating()) {
                this.distanceToTarget = BABYLON.Vector3.Distance(this.distancePosition, this.m_agentDestination);
                if (this.distanceToTarget <= Math.max(this.distanceEpsilon, this.stoppingDistance)) {
                    this.cancelNavigation();
                    if (this.onNavCompleteObservable.hasObservers() === true) {
                        this.onNavCompleteObservable.notifyObservers(this.transform);
                    }
                }
            } else {
                this.distanceToTarget = 0;                
            }
            // Final Post Update
            this.lastPosition.copyFrom(this.currentPosition);
            if (this.onPostUpdateObservable.hasObservers() === true) {
                this.onPostUpdateObservable.notifyObservers(this.transform);
            }
            // Reset Teleport Flag
            this.teleporting = false;
        }
        private updateAgentParameters():void {
            const crowd:BABYLON.ICrowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (crowd != null && this.m_agentIndex >= 0) crowd.updateAgentParameters(this.m_agentIndex, this.m_agentParams);
        }
        private destroyNavigationAgent():void {
            this.m_agentIndex = -1;
            this.m_agentReady = false;
            this.m_agentMovement = null;
            this.m_agentDirection = null;
            this.m_agentDestination = null;
            this.moveDirection = null;
            this.resetPosition = null;
            this.lastPosition = null;
            this.currentPosition = null;
            this.currentRotation = null;
            this.currentVelocity = null;
            this.currentWaypoint = null;
            this.onReadyObservable.clear();
            this.onReadyObservable = null;
            this.onPreUpdateObservable.clear();
            this.onPreUpdateObservable = null;
            this.onPostUpdateObservable.clear();
            this.onPostUpdateObservable = null;
            this.onNavCompleteObservable.clear();
            this.onNavCompleteObservable = null;
            if (this.m_agentGhost != null) {
                this.m_agentGhost.dispose();
                this.m_agentGhost = null;
            }
        }

        //////////////////////////////////////////////////////
        // Navigation Public Functions                      //
        //////////////////////////////////////////////////////

        /** Move agent relative to current position. */
        public move(offset: BABYLON.Vector3, closetPoint:boolean = true): void {
            const plugin:BABYLON.RecastJSPlugin = BABYLON.SceneManager.GetNavigationTools();
            const crowd:BABYLON.ICrowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (plugin != null && crowd != null) {
                crowd.getAgentPosition(this.m_agentIndex).addToRef(offset, this.m_agentMovement);
                if (closetPoint === true) this.m_agentDestination = plugin.getClosestPoint(this.m_agentMovement);
                else this.m_agentDestination = this.m_agentMovement.clone();
                if (this.m_agentIndex >= 0) crowd.agentGoto(this.m_agentIndex, this.m_agentDestination);
            } else {
                BABYLON.Tools.Warn("No recast navigation mesh or crowd interface data available!");
            }
        }
        /** Teleport agent to destination point. */
        public teleport(destination: BABYLON.Vector3, closetPoint:boolean = true): void {
            const plugin:BABYLON.RecastJSPlugin = BABYLON.SceneManager.GetNavigationTools();
            const crowd:BABYLON.ICrowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (plugin != null && crowd != null) {
                this.teleporting = true;
                if (closetPoint === true) this.m_agentDestination = plugin.getClosestPoint(destination);
                else this.m_agentDestination = destination.clone();
                if (this.m_agentIndex >= 0) crowd.agentTeleport(this.m_agentIndex, this.m_agentDestination);
            } else {
                BABYLON.Tools.Warn("No recast navigation mesh or crowd interface data available!");
            }
        }
        /** Sets agent current destination point. */
        public setDestination(destination: BABYLON.Vector3, closetPoint:boolean = true): void {
            const plugin:BABYLON.RecastJSPlugin = BABYLON.SceneManager.GetNavigationTools();
            const crowd:BABYLON.ICrowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (plugin != null && crowd != null) {
                if (closetPoint === true) this.m_agentDestination = plugin.getClosestPoint(destination);
                else this.m_agentDestination = destination.clone();
                if (this.m_agentIndex >= 0) crowd.agentGoto(this.m_agentIndex, this.m_agentDestination);
            } else {
                BABYLON.Tools.Warn("No recast navigation mesh or crowd interface data available!");
            }
        }
        /** Gets agent current world space velocity. */
        public getAgentVelocity(): BABYLON.Vector3 {
            const crowd:BABYLON.ICrowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            return (crowd != null && this.m_agentIndex >= 0) ? crowd.getAgentVelocity(this.m_agentIndex) : null;
        }
        /** Gets agent current world space velocity. */
        public getAgentVelocityToRef(result:BABYLON.Vector3): void {
            const crowd:BABYLON.ICrowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (crowd != null && this.m_agentIndex >= 0) crowd.getAgentVelocityToRef(this.m_agentIndex, result);
        }
        /** Gets agent current world space position. */
        public getAgentPosition(): BABYLON.Vector3 {
            const crowd:BABYLON.ICrowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            return (crowd != null && this.m_agentIndex >= 0) ? crowd.getAgentPosition(this.m_agentIndex) : null;
        }
        /** Gets agent current world space position. */
        public getAgentPositionToRef(result:BABYLON.Vector3): void {
            const crowd:BABYLON.ICrowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (crowd != null && this.m_agentIndex >= 0) crowd.getAgentPositionToRef(this.m_agentIndex, result);
        }
        /** Gets agent current waypoint position. */
        public getAgentWaypoint(): BABYLON.Vector3 {
            const crowd:BABYLON.ICrowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            return (crowd != null && this.m_agentIndex >= 0) ? crowd.getAgentNextTargetPath(this.m_agentIndex) : null;
        }
        /** Gets agent current waypoint position. */
        public getAgentWaypointToRef(result:BABYLON.Vector3): void {
            const crowd:BABYLON.ICrowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            if (crowd != null && this.m_agentIndex >= 0) crowd.getAgentNextTargetPathToRef(this.m_agentIndex, result);
        }
        /** Cancel current waypoint path navigation. */
        public cancelNavigation():void {
            this.m_agentDestination = null; // Note: Disable Auto Position Update
            const crowd:BABYLON.ICrowd = BABYLON.SceneManager.GetCrowdInterface(this.scene);
            const position:BABYLON.Vector3 = this.getAgentPosition();
            if (position != null && crowd != null && this.m_agentIndex >= 0) {
                crowd.agentTeleport(this.m_agentIndex, position);
                // DEPRECIATED: position.y += (this.baseOffset + this.heightOffset);
                // DEPRECIATED: this.transform.position.copyFrom(position);
            }
        }
    }
    /**
     *  Recast Detour Crowd Agent States
     */
    export enum CrowdAgentState {
        DT_CROWDAGENT_STATE_INVALID = 0,		///< The agent is not in a valid state.
        DT_CROWDAGENT_STATE_WALKING = 1,		///< The agent is traversing a normal navigation mesh polygon.
        DT_CROWDAGENT_STATE_OFFMESH = 2,		///< The agent is traversing an off-mesh connection.
    };
}