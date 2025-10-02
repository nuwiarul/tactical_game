import {control, GLTFLayer, GroupGLLayer, Map, TileLayer} from 'maptalks-gl';
import {ThreeLayer} from "maptalks.three";
import * as THREE from 'three';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {ModelControl} from '@/lib/modelcontrol.js';

export const createStreetLayer = () => {
    return new TileLayer('Street', {
        'urlTemplate': 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'subdomains': ['a', 'b', 'c'],
        'attribution': '&copy; <a href="http://www.osm.org" target="_blank">OpenStreetMap</a> contributors'

    });
}

export const createSatelliteLayer = () => {
    return new TileLayer('Satellite', {
        urlTemplate: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '\'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community\''
    })
}

export const createMap = (ref: HTMLDivElement, baseLayer: TileLayer, center: number[], zoom: number, pitch: number, maxZoom: number) => {
    const map = new Map(ref, {
        center: center,
        zoom: zoom,
        maxZoom: maxZoom,
        pitch: pitch,
        layerSwitcherControl: false,
        baseLayer: baseLayer,
        centerCross: true,
        doubleClickZoom: false,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    map.setLights( {
        ambient: {
            exposure: 10,
            hsv: [0, 1, -0.042],
            orientation: 0,
        },
        directional: {
            direction: [-0.1, 1, -1],
            color: [1, 1, 1],
        },
    });
    return map;
}

export const createMapDisable = (ref: HTMLDivElement, baseLayer: TileLayer, center: number[], zoom: number, pitch: number, maxZoom: number) => {
    const map = new Map(ref, {
        center: center,
        zoom: zoom,
        maxZoom: maxZoom,
        pitch: pitch,
        layerSwitcherControl: false,
        baseLayer: baseLayer,
        centerCross: true,
        draggable : false,        //disable drag
        dragPan : false,          //disable drag panning
        dragRotate : false,       //disable drag rotation
        dragPitch : false,        //disable drag pitch
        scrollWheelZoom : false,  //disable wheel zoom
        touchZoom : false,        //disable touchzoom
        doubleClickZoom : false,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    map.setLights( {
        ambient: {
            exposure: 10,
            hsv: [0, 1, -0.042],
            orientation: 0,
        },
        directional: {
            direction: [-0.1, 1, -1],
            color: [1, 1, 1],
        },
    });
    return map;
}

export const createCompassControl = (map: Map) => {
    const compass = new control.Compass({
        position: 'top-left',
    })
    map.addControl(compass);
}

export const createBaseLayerSwitcher = (map: Map, streetLayer: TileLayer, satelliteLayer: TileLayer, callback?: (id: string) => void) => {
    new control.Toolbar({
        'position': 'top-right',
        'items': [{
            item: 'Satellite',
            click: function () {
                map.setBaseLayer(satelliteLayer);
                if (callback) {
                    callback("satellite");
                }
            }
        }, {
            item: 'Street',
            click: function () {
                map.setBaseLayer(streetLayer);
                if (callback) {
                    callback("street");
                }
            }
        }]
    }).addTo(map);
}



export const createThreeLayer = (callback?: (threeLayer: ThreeLayer) => void) => {
    const threeLayer = new ThreeLayer('t', {
        forceRenderOnMoving: true,
        forceRenderOnRotating: true,
        forceRenderOnZooming: true,

    });



    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    threeLayer.prepareToDraw = function (gl, scene, camera) {
        const lightKiri = new THREE.DirectionalLight(0xffffff, 2);
        lightKiri.position.set(0, -10, 10).normalize();
        scene.add(lightKiri);


        const lightKanan = new THREE.DirectionalLight(0xffffff, 2);
        lightKanan.position.set(0, 10, 10).normalize();
        scene.add(lightKanan);

        const lightBelakang = new THREE.DirectionalLight(0xffffff, 2);
        lightBelakang.position.set(-10, 0, 10).normalize();
        scene.add(lightBelakang);



        const lightDepan = new THREE.DirectionalLight(0xffffff, 2);
        lightDepan.position.set(10, 0, 10).normalize();
        scene.add(lightDepan);

        //camera.add(new THREE.PointLight('#fff', 4));
        const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Adjust the intensity (0.3) as needed
        scene.add(ambientLight);
        if (callback) {
            callback(threeLayer);
        }

    }

    return threeLayer;
}

export const createThreeGroupGLLayer = (map: Map, threeLayer: ThreeLayer) => {
    const sceneConfig = {
        postProcess: {
            enable: true,
            antialias: { enable: true },
            bloom: {
                enable: false,
                threshold: 0,
                factor: 1,
                radius: 0.02,
            },
        }
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const groupLayer = new GroupGLLayer('groupThree', [threeLayer], {sceneConfig, onlyWebGL1: false});
    groupLayer.addTo(map);


}

export const createGroupGltfLayer = (map: Map, gltfLayers: GLTFLayer[]) => {
    const sceneConfig = {
        postProcess: {
            enable: true,
            antialias: { enable: true },
            bloom: {
                enable: true,
                threshold: 0,
                factor: 1,
                radius: 0.02,
            },
        },
        environment: {
            enable: true,
            mode: 1,
            level: 0,
            brightness: 1,
        },
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const groupLayer = new GroupGLLayer('groupGltf', gltfLayers, {sceneConfig, onlyWebGL1: false});
    groupLayer.addTo(map);
    return groupLayer;

}

export const getThreeLayerWithGroup= (map:Map) => {
    if (map) {
        const groupLayer = map.getLayer('groupThree') as GroupGLLayer;
        if (groupLayer.getLayers().length > 0) {
            return groupLayer.getLayers()[0] as ThreeLayer;
        }
    }

    return null;
}

export const getGltfLayerWithGroup= (map:Map, name: string) => {
    if (map) {
        const groupLayer = map.getLayer('groupGltf') as GroupGLLayer;
        if (groupLayer.getLayers().length > 0) {
            return groupLayer.getLayer(name) as GLTFLayer;
        }
    }

    return null;
}

export const getThreeLayer= (map:Map) => {
    if (map) {
        return map.getLayer('t') as ThreeLayer;
    }
    return null;
}

export const createMapEventModelControl = (map: Map, modelControl: ModelControl) => {
    map.on('click', () => {
        if (modelControl) {
            if (modelControl.isEnabled()) {
                const model = modelControl.getModel();
                if (model) {
                    //model.config('draggable', false);
                    if (model.getAnimations()) {
                        model.setCurrentAnimation("Idle|Idle");
                    }
                }
                modelControl.disable();
            }
        }
    })
}

export const createZoomControl = (map: Map) => {
    if (map) {
        const zoom = new control.Zoom({
            'position': {'top': 50, 'left': 20},
            'zoomLevel' : false
        });
        map.addControl(zoom);
    }
};

export const createBearingControl = (map: Map) => {
    if (map) {
        const zoom = new control.Toolbar({
            'position': {'top': 120, 'left': 20},
            'items': [{
                item: '<svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" fill="#0F0F0F"></path> </g></svg>',
                click: function () {
                    const bearing = map.getBearing();
                    map.setBearing(bearing - 10);
                    //drawToolInstance.current?.enable();
                }
            }, {
                item: '<svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                    '<g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>' +
                    '<g id="SVGRepo_iconCarrier"> <path d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z" fill="#0F0F0F"></path> </g>' +
                    '</svg>',
                click: function () {
                    const bearing = map.getBearing();
                    map.setBearing(bearing + 10);
                    //drawToolInstance.current?.enable();
                }
            }]
        });
        map.addControl(zoom);
    }
}

export const createPitchControl = (map: Map) => {
    if (map) {
        const zoom = new control.Toolbar({
            'position': {'top': 150, 'left': 20},
            vertical: true,
            'items': [{
                item: '<svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.2929 15.2893C18.6834 14.8988 18.6834 14.2656 18.2929 13.8751L13.4007 8.98766C12.6195 8.20726 11.3537 8.20757 10.5729 8.98835L5.68257 13.8787C5.29205 14.2692 5.29205 14.9024 5.68257 15.2929C6.0731 15.6835 6.70626 15.6835 7.09679 15.2929L11.2824 11.1073C11.673 10.7168 12.3061 10.7168 12.6966 11.1073L16.8787 15.2893C17.2692 15.6798 17.9024 15.6798 18.2929 15.2893Z" fill="#0F0F0F"></path> </g></svg>',
                click: function () {
                    const pitch = map.getPitch();
                    map.setPitch(pitch + 3);
                    //drawToolInstance.current?.enable();
                }
            }, {
                item: '<svg class="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 9L12 15L18 9" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
                click: function () {
                    const pitch = map.getPitch();
                    map.setPitch(pitch - 3);
                    //drawToolInstance.current?.enable();
                }
            }]
        });
        map.addControl(zoom);
    }
}

