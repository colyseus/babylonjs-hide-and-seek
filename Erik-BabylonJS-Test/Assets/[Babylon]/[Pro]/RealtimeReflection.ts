module BABYLON {
    /**
     * Babylon realtime reflection system pro class (Unity Style Realtime Reflection Probes)
     * @class RealtimeReflection - All rights reserved (c) 2020 Mackey Kinard
     */
    export class RealtimeReflection extends BABYLON.ScriptComponent {
        private static SKYBOX_FLAG:number = 1;

        private renderList:BABYLON.AbstractMesh[] = null;
        private probeList:BABYLON.AbstractMesh[] = null;
        private refreshMode:number = 0;
        private cullingMask:number = 0;
        private clearFlags:number = 0;
        private probeid:number = 0;
        private useProbeList:boolean = false;
        private includeChildren:boolean = false;
        private resolution:number = 128;
        private boxPos:BABYLON.Vector3 = null;
        private boxSize:BABYLON.Vector3 = null;
        private boxProjection:boolean = false;

        public getProbeList():BABYLON.AbstractMesh[] { return this.probeList; }
        public getRenderList():BABYLON.AbstractMesh[] { return this.renderList; }

        protected awake(): void { this.awakeRealtimReflections(); }
        protected start(): void { this.startRealtimReflections(); }
        protected destroy(): void { this.destroyRealtimReflections(); }

        protected awakeRealtimReflections():void {
            this.probeid = this.getProperty("id", this.probeid);
            this.resolution = this.getProperty("resolution", this.resolution);
            this.cullingMask = this.getProperty("culling", this.cullingMask);
            this.clearFlags = this.getProperty("clearflags", this.clearFlags);
            this.refreshMode = this.getProperty("refreshmode", this.refreshMode);
            this.useProbeList = this.getProperty("useprobelist", this.useProbeList);
            this.includeChildren = this.getProperty("includechildren", this.includeChildren);
            this.boxProjection = this.getProperty("boxprojection", this.boxProjection);
            if (this.boxProjection === true) {
                const bbp:number[] = this.getProperty("boundingboxposition");
                if (bbp != null && bbp.length >= 3) {
                    this.boxPos = new BABYLON.Vector3(bbp[0], bbp[1], bbp[2]);
                }
                const bbz:number[] = this.getProperty("boundingboxsize");
                if (bbz != null && bbz.length >= 3) {
                    this.boxSize = new BABYLON.Vector3(bbz[0], bbz[1], bbz[2]);
                }
            }
        }

        protected startRealtimReflections():void {
            let index = 0;
            const quality:BABYLON.RenderQuality = BABYLON.SceneManager.GetRenderQuality();
            const allowReflections:boolean = (quality === BABYLON.RenderQuality.High);
            if (allowReflections === true) {
                if (this.cullingMask === 0) { // Nothing
                    if (this.clearFlags === BABYLON.RealtimeReflection.SKYBOX_FLAG) {
                        const skybox:BABYLON.AbstractMesh = BABYLON.SceneManager.GetAmbientSkybox(this.scene);
                        if (skybox != null) {
                            if (this.renderList == null) this.renderList = [];
                            this.renderList.push(skybox);
                        }
                    }
                } else if (this.cullingMask === -1) { // Everything
                    for (index = 0; index < this.scene.meshes.length; index++) {
                        let render:boolean = false;
                        const mesh:BABYLON.AbstractMesh = this.scene.meshes[index];
                        if (mesh != null) {
                            if (mesh.id === "Ambient Skybox") {
                                render = (this.clearFlags === BABYLON.RealtimeReflection.SKYBOX_FLAG);
                            } else {
                                render = true;
                            }
                            if (render === true) {
                                if (this.renderList == null) this.renderList = [];
                                this.renderList.push(mesh);
                            }
                        }
                    }
                } else { // Parse Render List Meta Data
                    const renderListData:string[] = this.getProperty("renderlist");
                    if (renderListData != null && renderListData.length > 0) {
                        for (index = 0; index < renderListData.length; index++) {
                            const renderId:string = renderListData[index];
                            const renderMesh:BABYLON.AbstractMesh = BABYLON.SceneManager.GetMeshByID(this.scene, renderId);
                            if (renderMesh != null) {
                                if (this.renderList == null) this.renderList = [];
                                const detailName:string = renderMesh.name + ".Detail";
                                const detailChildren:BABYLON.Node[] = renderMesh.getChildren((node:BABYLON.Node) => { return (node.name === detailName) }, true);
                                if (detailChildren != null && detailChildren.length > 0) {
                                    this.renderList.push(detailChildren[0] as BABYLON.AbstractMesh);
                                } else {
                                    this.renderList.push(renderMesh);
                                }
                            }
                        }
                    }
                    if (this.clearFlags === BABYLON.RealtimeReflection.SKYBOX_FLAG) {
                        const skybox:BABYLON.AbstractMesh = BABYLON.SceneManager.GetAmbientSkybox(this.scene);
                        if (skybox != null) {
                            if (this.renderList == null) this.renderList = [];
                            this.renderList.push(skybox);
                        }
                    }
                }
                // ..
                // Get Probe Render List
                // ..
                if (this.useProbeList === true) {
                    const probeListData:string[] = this.getProperty("probelist");
                    if (probeListData != null && probeListData.length > 0) {
                        for (index = 0; index < probeListData.length; index++) {
                            const probeId:string = probeListData[index];
                            const probeMesh:BABYLON.AbstractMesh = BABYLON.SceneManager.GetMeshByID(this.scene, probeId);
                            if (probeMesh != null) {
                                if (this.probeList == null) this.probeList = [];
                                this.probeList.push(probeMesh);
                                if (this.includeChildren === true) {
                                    const childMeshes:BABYLON.AbstractMesh[] = probeMesh.getChildMeshes(false);
                                    for (let ii = 0; ii < childMeshes.length; ii++) {
                                        const childMesh = childMeshes[ii];
                                        this.probeList.push(childMesh);
                                    }
                                }
                            }
                        }
                    }
                } else {
                    const probeTag = "PROBE_" + this.probeid.toFixed(0);
                    this.probeList = this.scene.getMeshesByTags(probeTag);
                }
                if (this.probeList != null && this.probeList.length > 0) {
                    const abstractMesh:BABYLON.AbstractMesh = this.getAbstractMesh();
                    for (index = 0; index < this.probeList.length; index++) {
                        const probemesh:BABYLON.AbstractMesh = this.probeList[index];
                        const reflectionProbe = new BABYLON.ReflectionProbe(probemesh.name + ".Probe", this.resolution, this.scene);
                        reflectionProbe.refreshRate = (this.refreshMode === 0) ? BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONCE : BABYLON.RenderTargetTexture.REFRESHRATE_RENDER_ONEVERYFRAME;
                        reflectionProbe.renderList.push(...this.renderList);
                        if (abstractMesh != null) reflectionProbe.attachToMesh(abstractMesh);
                        if (this.boxProjection === true) {
                            if (this.boxSize != null) {
                                reflectionProbe.cubeTexture.boundingBoxSize = this.boxSize;
                            }
                            if (this.boxPos != null) {
                                reflectionProbe.cubeTexture.boundingBoxPosition = this.boxPos;
                            }
                        }
                        if (probemesh.material instanceof BABYLON.MultiMaterial) {
                            const mmat1:BABYLON.MultiMaterial = probemesh.material.clone(probemesh.material.name + "." + probemesh.name);
                            for (let xx = 0; xx < mmat1.subMaterials.length; xx++) {
                                const smat1 = mmat1.subMaterials[xx];
                                const subMaterial:BABYLON.PBRMaterial = mmat1.subMaterials[xx].clone(mmat1.subMaterials[xx].name + "_" + probemesh.name) as BABYLON.PBRMaterial;
                                subMaterial.unfreeze();
                                subMaterial.reflectionTexture = reflectionProbe.cubeTexture;
                                mmat1.subMaterials[xx] = subMaterial;
                            }
                            probemesh.material = mmat1;
                        } else {
                            const meshMaterial:BABYLON.PBRMaterial = probemesh.material.clone(probemesh.material.name + "." + probemesh.name) as BABYLON.PBRMaterial;
                            meshMaterial.unfreeze();
                            meshMaterial.reflectionTexture = reflectionProbe.cubeTexture;
                            probemesh.material = meshMaterial;
                        }
                    }
                }
            }  
        }

        protected destroyRealtimReflections():void {
            this.probeList = null;
            this.renderList = null;
        }
    }
}
