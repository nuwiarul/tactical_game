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

