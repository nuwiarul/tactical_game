import {useEffect, useRef} from "react";
import {
    Map,
    GLTFLayer,
} from 'maptalks-gl';
import '@maptalks/transcoders.draco';
import 'maptalks-gl/dist/maptalks-gl.css';
import {
    createBaseLayerSwitcher,
    createCompassControl, createGroupGltfLayer,
    createMap, createMapEventModelControl,
    createSatelliteLayer,
    createStreetLayer,
} from "@/helpers/maps.ts";
import {config} from "@/utils/constants.ts";
import {UNITS, KENDARAANS, STACKHOLDERS, PEOPLES, TOOLS, BANGUNANS} from "@/utils/items.ts";
import {createModelControl} from "@/helpers/controls.ts";
import {createBaseObject} from "@/helpers/objects.ts";
import MainLayout from "@/layouts/MainLayout.tsx";


const MapsIndex = () => {

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map>(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current && mapRef.current) {
            initialized.current = true;
            const streetLayer = createStreetLayer();
            const satelliteLayer = createSatelliteLayer();
            mapInstance.current = createMap(mapRef.current, streetLayer, config.center, 18, 56, config.maxZoom);
            createCompassControl(mapInstance.current);
            createBaseLayerSwitcher(mapInstance.current, streetLayer, satelliteLayer, onHandleBaseLayerChange);

            const gltfLayer = new GLTFLayer('gltf');
            const iconlayer = new GLTFLayer('icon');
            createGroupGltfLayer(mapInstance.current, [gltfLayer, iconlayer]);

            const modelControl = createModelControl(mapInstance.current);

            let coordinateX = 115.22444022581556;
            let coordinateY = -8.649107454211848;
            UNITS.map(baseModel => {
                createBaseObject(gltfLayer, iconlayer, modelControl, {
                    url: baseModel.modelUrl,
                    center: [coordinateX, coordinateY],
                    rotation: baseModel.rotation,
                    height: baseModel.height,
                    animation: baseModel.animation,
                    id: baseModel.id,
                    name: baseModel.name,
                    icon: baseModel.icon,
                    description: "Jumlah 1",
                    child: baseModel.child,
                })
                coordinateY -= 0.0005;
            });

            coordinateX -= 0.0003
            coordinateY = -8.649107454211848;

            STACKHOLDERS.map(baseModel => {
                createBaseObject(gltfLayer, iconlayer, modelControl, {
                    url: baseModel.modelUrl,
                    center: [coordinateX, coordinateY],
                    rotation: baseModel.rotation,
                    height: baseModel.height,
                    animation: baseModel.animation,
                    id: baseModel.id,
                    name: baseModel.name,
                    icon: baseModel.icon,
                    description: "Jumlah 1",
                    child: baseModel.child,
                })
                coordinateY -= 0.0005;
            });

            coordinateX -= 0.0003
            coordinateY = -8.649107454211848;

            PEOPLES.map(baseModel => {
                createBaseObject(gltfLayer, iconlayer, modelControl, {
                    url: baseModel.modelUrl,
                    center: [coordinateX, coordinateY],
                    rotation: baseModel.rotation,
                    height: baseModel.height,
                    animation: baseModel.animation,
                    id: baseModel.id,
                    name: baseModel.name,
                    icon: baseModel.icon,
                    description: "Jumlah 1",
                    child: baseModel.child,
                })
                coordinateY -= 0.0005;
            });

            coordinateX -= 0.0003
            coordinateY = -8.649107454211848;

            TOOLS.map(baseModel => {
                createBaseObject(gltfLayer, iconlayer, modelControl, {
                    url: baseModel.modelUrl,
                    center: [coordinateX, coordinateY],
                    rotation: baseModel.rotation,
                    height: baseModel.height,
                    animation: baseModel.animation,
                    id: baseModel.id,
                    name: baseModel.name,
                    icon: baseModel.icon,
                    description: "Jumlah 1",
                    child: baseModel.child,
                })
                coordinateY -= 0.0005;
            });

            coordinateX -= 0.0009
            coordinateY = -8.649107454211848;

            KENDARAANS.map(baseModel => {
                createBaseObject(gltfLayer, iconlayer, modelControl, {
                    url: baseModel.modelUrl,
                    center: [coordinateX, coordinateY],
                    rotation: baseModel.rotation,
                    height: baseModel.height,
                    animation: baseModel.animation,
                    id: baseModel.id,
                    name: baseModel.name,
                    icon: baseModel.icon,
                    description: "Jumlah 1",
                    child: baseModel.child,
                })
                coordinateY -= 0.0005;
            });

            coordinateX -= 0.0009
            coordinateY = -8.649107454211848;

            BANGUNANS.map(baseModel => {
                createBaseObject(gltfLayer, iconlayer, modelControl, {
                    url: baseModel.modelUrl,
                    center: [coordinateX, coordinateY],
                    rotation: baseModel.rotation,
                    height: baseModel.height,
                    animation: baseModel.animation,
                    id: baseModel.id,
                    name: baseModel.name,
                    icon: baseModel.icon,
                    description: "Jumlah 1",
                    child: baseModel.child,
                })
                coordinateY -= 0.0015;
            });

            createMapEventModelControl(mapInstance.current, modelControl);
        }
    }, []);

    const onHandleBaseLayerChange = (id: string) => {
        console.log(id);
    }
    return (
        <MainLayout activeMenu="maps">
            <div ref={mapRef} className="w-full h-full"></div>
        </MainLayout>
    );
};

export default MapsIndex;