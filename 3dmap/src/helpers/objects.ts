import {GLTFLayer, GLTFMarker, Polygon} from "maptalks-gl";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import type {ModelControl} from "@/lib/modelcontrol";
import {
    BANGUNANS,
    type IBaseChildModel,
    type IBaseModel,
    KENDARAANS,
    PEOPLES,
    STACKHOLDERS,
    TOOLS,
    UNITS
} from "@/utils/items.ts";
import type {ThreeLayer} from "maptalks.three";
import * as THREE from 'three';
import type ExtrudePolygon from "maptalks.three/dist/ExtrudePolygon";

export interface IObjectProperties {
    id: string;
    unit_id?: string;
    keterangan?: string;
    jumlah?: number;
    name: string;
    animation: boolean;
    icon?: GLTFMarker;
    child?: GLTFMarker;
    space?: number;
    originalHeight?: number;
}

export interface IBuildingProperties {
    id: string;
    keterangan: string;
    name: string;
}

export const createBaseObject = (
    gltfLayer: GLTFLayer, iconLayer: GLTFLayer, modelControl: ModelControl,
    {url, center, height, rotation, animation, name, id, unit_id, description, icon, child, keterangan, jumlah,
        editGeom, editProperties, deleteObject, isMove = true, callbackinfo, dragable = false, callbackdrag, scale = 1, editScale, editRotasi}:
    {
        url:string,
        center: number[],
        height: number,
        rotation: {x:number, y:number, z: number},
        animation: boolean,
        name: string,
        id: string,
        description?: string,
        icon?: string,
        child?: IBaseChildModel,
        unit_id?: string,
        keterangan?: string,
        jumlah?: number,
        scale?: number,
        editGeom?: (marker: GLTFMarker, id: string) => void,
        editScale?: (marker: GLTFMarker, id: string) => void,
        editRotasi?: (marker: GLTFMarker, id: string) => void,
        editProperties?: (id: string, jumlah: number, name: string, keterangan: string, marker: GLTFMarker) => void,
        deleteObject?: (id: string, marker: GLTFMarker) => void,
        isMove?: boolean,
        callbackinfo?: (id: string, command: string) => void,
        callbackdrag?: (id: string, command: string, data: string) => void,
        dragable?: boolean,
    }
) => {
    const gltfMarker = new GLTFMarker(center, {
        dragable: dragable,
        symbol: {
            url: url,
            modelHeight: height,
            //rotationX: 270,
            rotationZ: rotation.z,
            rotationX: rotation.x,
            animation: animation,
            loop: animation,
            animationName: "Idle|Idle",
            uniforms : {
                lightDirection : [1, 1, 1],
                materialShininess: 32,
                ambientStrength : 0.5,
                specularStrength : 1.0,
                lightAmbient: [1.0, 1.0, 1.0],
                lightDiffuse: [1.0, 1.0, 1.0],
                lightSpecular: [1.0, 1.0, 1.0]
            },
            bloom: false
        },
    });
    gltfMarker.addTo(gltfLayer);
    gltfMarker.setInfoWindow({
        title: `<span style="color: grey;">${name}<span>`,
        content: `<span style="color: grey;">${description}<span>`,
    });

    gltfMarker.setScale(scale, scale, scale)

    gltfMarker.getInfoWindow().on("showend hide", (e: { type: string; }) => {
        if (callbackinfo) {
            if (e.type === "showend") {
                callbackinfo(id, "SHOWINFO");
            } else if (e.type === "hide") {
                callbackinfo(id, "HIDEINFO");
            }
        }

    });

    gltfMarker.on('dragend', (e: { coordinate: { x: number; y: number; }; }) => {
        if (callbackdrag) {
            const data = {
                command: "move",
                x: e.coordinate.x,
                y: e.coordinate.y,
            }
            callbackdrag(id, "MOVE", JSON.stringify(data))
        }
    })


    const properties: IObjectProperties = {
        name: name,
        animation: animation,
        id: id,
        unit_id: unit_id,
        keterangan: keterangan,
        jumlah: jumlah,
        originalHeight: height,
    }

    const menus = [];

    if (isMove) {
        menus.push({ item: `Move & Rotate ${modelControl.isScale ? "& Scale" : ""}`, click: () => {

                const model = modelControl.getModel();
                if (model) {
                    //model.config('draggable', false);
                    if (model.getAnimations()) {
                        model.setCurrentAnimation("Idle|Idle");
                    }
                }

                gltfMarker.config('draggable', true);
                modelControl.setModel(gltfMarker);

                if (modelControl.isScale) {
                    modelControl.setOriginalScale(gltfMarker.getScale()[0]);
                }

                modelControl.enable();
                console.log(modelControl)
            }})
    }

    if (editGeom) {
        menus.push({ item: 'Edit Posisi dan Rotasi', click: () => {
                    editGeom(gltfMarker, id);
            }});

    }

    if (editScale) {
        menus.push({ item: 'Edit Scale', click: () => {
                editScale(gltfMarker, id);
            }});
    }

    if (editRotasi) {
        menus.push({ item: 'Edit Rotasi', click: () => {
                editRotasi(gltfMarker, id);
            }});
    }

    if (editProperties) {
        menus.push({ item: 'Edit Keterangan', click: () => {
            editProperties(id, jumlah || 0, name, keterangan || "", gltfMarker);
        }});
    }

    if (deleteObject) {
        menus.push({ item: 'Hapus', click: () => {
            deleteObject(id, gltfMarker);
        }});
    }

    if (menus.length > 0) {
        gltfMarker.setMenu({
            items: menus
        });
    }


    if (icon) {
        const iconMarker = new GLTFMarker([center[0], center[1], gltfMarker.getModelHeight()], {
            symbol : {
                url: icon,
                modelHeight: 7,
                rotationZ: rotation.z,
            }
        })
        iconMarker.addTo(iconLayer);
        properties.icon = iconMarker;
    }

    if (child) {
        const childMarker = new GLTFMarker([center[0] , center[1] + child.space], {
            symbol: {
                url: child.modelUrl,
                modelHeight: child.height,
                //rotationX: 270,
                rotationZ: child.rotation.z,
                animation: child.animation,
                loop: child.animation,
                animationName: "Idle|Idle",
                uniforms : {
                    lightDirection : [1, 1, 1],
                    materialShininess: 32,
                    ambientStrength : 0.5,
                    specularStrength : 1.0,
                    lightAmbient: [1.0, 1.0, 1.0],
                    lightDiffuse: [1.0, 1.0, 1.0],
                    lightSpecular: [1.0, 1.0, 1.0]
                },
                bloom: false
            },
        });
        childMarker.addTo(gltfLayer);
        properties.child = childMarker;
        properties.space = child.space;
    }



    gltfMarker.setProperties(properties)
    return gltfMarker
}

export const createHomeBaseObject = (
    gltfLayer: GLTFLayer, iconLayer: GLTFLayer,
    {url, center, height, rotation, animation, name, id, unit_id, description, icon, child, keterangan, jumlah, scale = 1}:
    {
        url:string,
        center: number[],
        height: number,
        rotation: {x:number, y:number, z: number},
        animation: boolean,
        name: string,
        id: string,
        description?: string,
        icon?: string,
        child?: IBaseChildModel,
        unit_id?: string,
        keterangan?: string,
        jumlah?: number,
        scale?: number,
        editGeom?: (marker: GLTFMarker, id: string) => void,
        editProperties?: (id: string, jumlah: number, name: string, keterangan: string, marker: GLTFMarker) => void,
        deleteObject?: (id: string, marker: GLTFMarker) => void,
        isMove?: boolean,
    }
) => {
    const gltfMarker = new GLTFMarker(center, {
        symbol: {
            url: url,
            modelHeight: height,
            //rotationX: 270,
            rotationZ: rotation.z,
            rotationX: rotation.x,
            animation: animation,
            loop: animation,
            animationName: "Idle|Idle",
            uniforms : {
                lightDirection : [1, 1, 1],
                materialShininess: 32,
                ambientStrength : 0.5,
                specularStrength : 1.0,
                lightAmbient: [1.0, 1.0, 1.0],
                lightDiffuse: [1.0, 1.0, 1.0],
                lightSpecular: [1.0, 1.0, 1.0]
            },
            bloom: false
        },
    });
    gltfMarker.addTo(gltfLayer);
    gltfMarker.setInfoWindow({
        title: `<span style="color: grey;">${name}<span>`,
        content: `<span style="color: grey;">${description}<span>`,
    });

    gltfMarker.setScale(scale, scale, scale)

    const properties: IObjectProperties = {
        name: name,
        animation: animation,
        id: id,
        unit_id: unit_id,
        keterangan: keterangan,
        jumlah: jumlah,
    }


    if (icon) {
        const iconMarker = new GLTFMarker([center[0], center[1], gltfMarker.getModelHeight()], {
            symbol : {
                url: icon,
                modelHeight: 7,
                rotationZ: rotation.z,
            }
        })
        iconMarker.addTo(iconLayer);
        properties.icon = iconMarker;
    }

    if (child) {
        const childMarker = new GLTFMarker([center[0] , center[1] + child.space], {
            symbol: {
                url: child.modelUrl,
                modelHeight: child.height,
                //rotationX: 270,
                rotationZ: child.rotation.z,
                animation: child.animation,
                loop: child.animation,
                animationName: "Idle|Idle",
                uniforms : {
                    lightDirection : [1, 1, 1],
                    materialShininess: 32,
                    ambientStrength : 0.5,
                    specularStrength : 1.0,
                    lightAmbient: [1.0, 1.0, 1.0],
                    lightDiffuse: [1.0, 1.0, 1.0],
                    lightSpecular: [1.0, 1.0, 1.0]
                },
                bloom: false
            },
        });
        childMarker.addTo(gltfLayer);
        properties.child = childMarker;
        properties.space = child.space;
    }

    gltfMarker.setProperties(properties)
    return gltfMarker
}


export const getUnit = (kategori: string, id: string) => {
    let units :  IBaseModel[] = [];
    if (kategori === 'unit') {
        units = UNITS;
    } else if (kategori === 'stackholder') {
        units = STACKHOLDERS
    } else if (kategori === 'ranmor') {
        units = KENDARAANS
    } else if (kategori === 'people') {
        units = PEOPLES
    } else if (kategori === 'alat') {
        units = TOOLS
    } else if (kategori === 'bangunan') {
        units = BANGUNANS
    }

    for (let i = 0; i < units.length; i++) {
        const item = units[i];
        if (item.id === id) {
           return item;
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const addBuildingContextMenu = (e, editProperties: () => void,
                                deleteObject: () => void, ) => {
    e.domEvent.preventDefault();


    const existingMenu = document.getElementById('model-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    const building = e.target as ExtrudePolygon;
    const contextMenu = document.createElement('div');
    contextMenu.id = 'model-context-menu';
    contextMenu.className = 'model-context-menu';
    contextMenu.style.left = e.domEvent.clientX + 'px';
    contextMenu.style.top = e.domEvent.clientY + 'px';
    const contextMenuTitle = document.createElement('span');
    const properties = building.getProperties() as IBuildingProperties;
    contextMenuTitle.innerHTML = properties.name;
    const contextMenuUl = document.createElement('ul');
    const contextMenuActionEdit = document.createElement('li');
    contextMenuActionEdit.innerHTML = 'Edit Keterangan';
    const contextMenuActionDelete = document.createElement('li');
    contextMenuActionDelete.innerHTML = 'Hapus';
    contextMenuUl.appendChild(contextMenuActionEdit);
    contextMenuUl.appendChild(contextMenuActionDelete);
    contextMenu.appendChild(contextMenuTitle);
    contextMenu.appendChild(contextMenuUl);


    contextMenuActionEdit.addEventListener('click', (e) => {
        e.preventDefault();
        editProperties()
        contextMenu.remove();
    })

    contextMenuActionDelete.addEventListener('click', (e) => {
        e.preventDefault();
        contextMenu.remove();
        deleteObject();
    })


    document.body.appendChild(contextMenu);

}

export const createBuilding = (layer: ThreeLayer, {
    id, name, keterangan, editProperties, deleteObject, height, coordinates, callbackinfo, color
}: {
    id: string,
    name: string,
    keterangan: string,
    height: number,
    color: string,
    coordinates: [],
    editProperties?: (id: string, name: string, keterangan: string, height: number, colot: string, building: ExtrudePolygon) => void,
    deleteObject?: (id: string, building: ExtrudePolygon) => void,
    callbackinfo?: (id: string, command: string) => void,
}) => {


    const polygon = new Polygon(coordinates);

    const material = new THREE.MeshPhongMaterial({ color: color });
    const mesh = layer.toExtrudePolygon(polygon, {height: height, topColor: color}, material);
    layer.addMesh(mesh);
    const properties: IBuildingProperties = {
        name: name,
        id: id,
        keterangan: keterangan,
    }
    mesh.setProperties(properties);
    mesh.setInfoWindow({
        title: `<span style="color: grey;">${name}<span>`,
        content: `<span style="color: grey;">${keterangan}<span>`,
    });

    mesh.getInfoWindow().on("showend hide", (e) => {
        if (callbackinfo) {
            if (e) {
                if (e.type === "showend") {
                    callbackinfo(id, "SHOWINFO");
                } else if (e.type === "hide") {
                    callbackinfo(id, "HIDEINFO");
                }
            }
        }
    });

    if (editProperties && deleteObject) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        mesh.on('contextmenu', function (e) {
            addBuildingContextMenu(e,  () => {
                editProperties(id, name, keterangan, height, color, mesh);
            },  () => {
                deleteObject(id, mesh)
            });
        })
    }

    return mesh


}