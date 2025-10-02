import {GLTFMarker, Map} from "maptalks-gl";
import {createBuilding, type IObjectProperties} from "@/helpers/objects.ts";
import type {IAlur, IBuilding} from "@/helpers/type.data.ts";
import type {ThreeLayer} from "maptalks.three";
import type ExtrudePolygon from "maptalks.three/dist/ExtrudePolygon";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {consoleErrorApi} from "@/helpers/logs.ts";
import type {IBaseModel} from "@/utils/items.ts";


export const removeGltfMarkersHelper = (map: Map, markers: GLTFMarker[],  callback?: () => void) => {
    if(map) {
        markers.forEach((marker) => {
            const properties = marker.getProperties() as IObjectProperties;
            if (properties.icon) {
                properties.icon.remove();
            }
            if (properties.child) {
                properties.child.remove();
            }
            marker.remove();
        });

        if (callback) {
            callback();
        }
    }
}

export const removeBuildings = (
    id: string,
    map: Map,
    threeLayer: ThreeLayer,
    buildings: ExtrudePolygon[],
    callback?: (buildings: ExtrudePolygon[]) => void,
    callbackInfo?: (id: string, command: string) => void,
) => {
    if(map) {
        buildings.forEach((building) => {
            building.remove();
        });

        getBuildings(id, map, threeLayer, callback, callbackInfo)
    }
}

export const reloadBuildings = (
    map: Map,
    threeLayer: ThreeLayer,
    listBuildings: IBuilding[],
    callback?: (buildings: ExtrudePolygon[]) => void,
    callbackInfo?: (id: string, command: string) => void,
    editProperties?: (id: string, name: string, keterangan: string, height: number, color: string, mesh: ExtrudePolygon) => void,
    deleteObject?: (id: string, mesh: ExtrudePolygon) => void,

) => {
    if (map) {

        if (threeLayer) {
            const buildings: ExtrudePolygon[] = [];
            listBuildings.forEach((item) => {
                const building = createBuilding(threeLayer, {
                    height: item.height,
                    id: item.id,
                    color: item.color,
                    name: item.name,
                    coordinates: JSON.parse(item.geom),
                    keterangan: item.keterangan,
                    editProperties: editProperties,
                    deleteObject: deleteObject,
                    callbackinfo: callbackInfo,
                });
                buildings.push(building);
            });
            if (callback) {
                callback(buildings);
            }
        }
    }
}

export const getBuildings = async (
    id: string,
    map: Map,
    threeLayer: ThreeLayer,
    callback?: (buildings: ExtrudePolygon[]) => void,
    callbackInfo?: (id: string, command: string) => void,
    editProperties?: (id: string, name: string, keterangan: string, height: number, color: string, mesh: ExtrudePolygon) => void,
    deleteObject?: (id: string, mesh: ExtrudePolygon) => void,
    ) => {
    try {
        const response = await axiosInstance.get(API_PATHS.BUILDINGS.LIST(id))
        if (response.data.data) {
            //reloadbuildings(response.data.data)
            reloadBuildings(map, threeLayer, response.data.data, callback, callbackInfo, editProperties, deleteObject);
        }
    } catch (error) {
        consoleErrorApi(error, "Building");
    }
}

export const getAlurs = async (id: string, callback: (rows: IAlur[]) => void)=> {
    try {
        const response = await axiosInstance.get(API_PATHS.ALURS.LIST(id))
        if (response.data.data) {
            callback(response.data.data);
        } else {
            callback([])
        }
    } catch (error) {
        consoleErrorApi(error, "GetAlurs");
        callback([])
    }
}

export const checkMove = (id: string, items: IBaseModel[],  role: string) => {
    if (role === "admin") {
        return true;
    } else {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === id) {
                return true;
            }
        }
        return false;
    }
}

