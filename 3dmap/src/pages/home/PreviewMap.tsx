import {useEffect, useRef, useState} from "react";
import {control, GLTFLayer, GLTFMarker, Map} from "maptalks-gl";
import {
    createBaseLayerSwitcher,
    createCompassControl, createGroupGltfLayer,
    createMap,
    createSatelliteLayer,
    createStreetLayer, getGltfLayerWithGroup
} from "@/helpers/maps.ts";
import {config} from "@/utils/constants.ts";
import PublicLayout from "@/layouts/PublicLayout.tsx";
import {useParams} from "react-router-dom";
import {createHomeBaseObject, getUnit, type IObjectProperties} from "@/helpers/objects.ts";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {consoleErrorApi} from "@/helpers/logs.ts";
import type {IUnit} from "@/helpers/type.data.ts";
import type {IHomeOperasi} from "@/pages/home/ListOperasi.tsx";
import ListSkenarioSheet from "@/components/ListSkenarioSheet.tsx";


const PreviewMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map>(null);
    const initialized = useRef(false);
    const isFirst = useRef(false);
    const textPanel = useRef<control.Panel | null>(null);
    const markerInstance = useRef<GLTFMarker[]>([])
    const skenarioIdInstance = useRef("");

    const {operasi_id, skenario_id} = useParams();


    const [openListSkenario, setOpenListSkenario] = useState(false);
    const [homeOperasis, setHomeOperasis] = useState<IHomeOperasi | null>(null)

    const removeGltfMarkers = (id: string) => {
        if (mapInstance.current) {

            markerInstance.current.forEach(marker => {
                const properties = marker.getProperties() as IObjectProperties;
                if (properties.icon) {
                    properties.icon.remove();
                }
                if (properties.child) {
                    properties.child.remove();
                }
                marker.remove();

            });

            getMarkers(id);
        }
    }

    const reloadMarkers = (listUnits: IUnit[]) => {
        if (mapInstance.current) {
            const gltfLayer = getGltfLayerWithGroup(mapInstance.current, 'gltf');
            const iconlayer = getGltfLayerWithGroup(mapInstance.current, 'icon');
            if (gltfLayer) {
                const units: GLTFMarker[] = [];
                listUnits.forEach((item) => {
                    const baseModel = getUnit(item.kategori, item.unit_id)
                    if (baseModel) {
                        const unit = createHomeBaseObject(gltfLayer, iconlayer, {
                            url: baseModel.modelUrl,
                            center: [item.pos_x, item.pos_y],
                            rotation: {x: item.rot_x, y: item.rot_y, z: item.rot_z},
                            height: baseModel.height,
                            animation: baseModel.animation,
                            id: item.id,
                            unit_id: item.unit_id,
                            name: item.name,
                            icon: baseModel.icon,
                            description: `Jumlah ${item.jumlah}<br/>${item.keterangan}`,
                            child: baseModel.child,
                            keterangan: item.keterangan,
                            jumlah: item.jumlah,
                        })
                        units.push(unit)
                    }
                });
                markerInstance.current = units
            }
        }
    }

    const getMarkers = async (id: string) => {
        try {
            const response = await axiosInstance.get(API_PATHS.MARKERS.LIST(id))
            if (response.data.data) {
                reloadMarkers(response.data.data)
            }
        } catch (error) {
            consoleErrorApi(error, "Unit");
        }
    }

    const initMap = (valName: string, valOperasiName: string, valCenterX: number, valCenterY: number, valZoom: number, valPitch: number) => {
        if (!initialized.current && mapRef.current) {
            initialized.current = true;
            const streetLayer = createStreetLayer();
            const satelliteLayer = createSatelliteLayer();
            mapInstance.current = createMap(mapRef.current, streetLayer, [valCenterX, valCenterY], valZoom, valPitch, config.maxZoom);
            createCompassControl(mapInstance.current);
            createBaseLayerSwitcher(mapInstance.current, streetLayer, satelliteLayer);
            console.log(valName);
            textPanel.current = new control.Panel({
                'position': {'top': 20, 'left': 60},
                'draggable': false,
                'custom': true,
                'content': `<div class="flex flex-col gap-0"><span class="text-sm font-bold text-red-400">${valOperasiName}</span><span class="text-xs font-bold text-red-400">${valName}</span></div>`,
                'closeButton': false
            });
            mapInstance.current.addControl(textPanel.current);

            const gltfLayer = new GLTFLayer('gltf');
            const iconlayer = new GLTFLayer('icon');
            createGroupGltfLayer(mapInstance.current, [gltfLayer, iconlayer]);
            new control.Toolbar({
                position: {top: 80, right: 20},
                vertical: true,
                items: [{
                    item: 'List Skenario',
                    click: function () {
                        setOpenListSkenario(true)
                    }
                }, {
                    item: 'Last Positions',
                    click: function () {
                        getLastPositions();
                    },

                },{
                    item: 'Export Image',
                    click: function() {
                        if (mapInstance.current) {
                            mapInstance.current.toDataURL({
                                'mimeType' : 'image/jpeg', // or 'image/png'
                                'save' : true,             // to pop a save dialog
                                'fileName' : 'map'         // file name
                            });
                        }
                    },

                }]
            }).addTo(mapInstance.current)
            isFirst.current = true;
            removeGltfMarkers(skenario_id as string);
        }
    }

    const reloadMap = (id: string, valName: string, valOperasiName: string, valCenterX: number, valCenterY: number, valZoom: number, valPitch: number) => {
        if (mapInstance.current) {
            mapInstance.current.flyTo({
                zoom: valZoom,
                center: [valCenterX, valCenterY],
                pitch: valPitch,
            }, {
                duration: 1000,
                easing: 'out'
            }, function (frame) {
                if (frame.state.playState === 'finished') {
                    console.log('animation finished');
                }
            });
            if (textPanel.current) {
                mapInstance.current.removeControl(textPanel.current);
                textPanel.current = new control.Panel({
                    'position': {'top': 20, 'left': 60},
                    'draggable': false,
                    'custom': true,
                    'content': `<div class="flex flex-col gap-0"><span class="text-sm font-bold text-red-400">${valOperasiName}</span><span class="text-xs font-bold text-red-400">${valName}</span></div>`,
                    'closeButton': false
                });
                mapInstance.current.addControl(textPanel.current);
            }
            removeGltfMarkers(id);
        }
    }

    const getSkenario = async (id: string | undefined) => {
        skenarioIdInstance.current = id as string;
        try {
            const response = await axiosInstance.get(API_PATHS.SKENARIOS.GET(id as string))
            if (response.data.data) {
                if (!initialized.current) {
                    initMap(response.data.data.name,
                        response.data.data.operasi.name,
                        response.data.data.center_x,
                        response.data.data.center_y,
                        response.data.data.zoom,
                        response.data.data.pitch
                    );
                } else {
                    if (!isFirst.current) {
                        reloadMap(
                            id as string,
                            response.data.data.name,
                            response.data.data.operasi.name,
                            response.data.data.center_x,
                            response.data.data.center_y,
                            response.data.data.zoom,
                            response.data.data.pitch
                        );
                    }
                }
            }

        } catch (error) {
            consoleErrorApi(error, "Operasi");
        }

    }

    useEffect(() => {
        getSkenario(skenario_id);
    }, [skenario_id]);

    const getOperasi = async (id: string) => {
        try {
            const response = await axiosInstance.get(API_PATHS.OPERASIS.PREVIEW(id as string))
            if (response.data.data) {
                setHomeOperasis(response.data.data);
            }

        } catch (error) {
            consoleErrorApi(error, "Operasi");
        }
    }

    useEffect(() => {
        getOperasi(operasi_id as string);
    }, []);

    const handleSkenarioChange = (id: string) => {
        isFirst.current = false;
        setOpenListSkenario(false)
        getSkenario(id);
    }

    const getLastPositions = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.LAST_POSITIONS(skenarioIdInstance.current));
            if (response.data.data) {
                if (response.data.data.last_map) {
                    if (mapInstance.current) {
                        if (response.data.data.last_map.center_x !== 0 || response.data.data.last_map.center_y !== 0) {
                            mapInstance.current.flyTo({
                                zoom: response.data.data.last_map.zoom,
                                center: [response.data.data.last_map.center_x, response.data.data.last_map.center_y],
                                pitch: response.data.data.last_map.pitch,
                                bearing: response.data.data.last_map.bearing,
                            }, {
                                duration: 1000,
                                easing: 'out'
                            }, function (frame) {
                                if (frame.state.playState === 'finished') {
                                    console.log('animation finished');
                                }
                            });
                        }
                    }
                }

                if (response.data.data.last_position) {

                    if (mapInstance.current) {
                        if (response.data.data.last_position.length > 0) {
                            for (let i = 0; i < response.data.data.last_position.length; i++) {
                                const lastPosition = response.data.data.last_position[i];
                                const marker = getMarker(lastPosition.marker_id)
                                if (marker) {
                                    marker.setCoordinates([lastPosition.pos_x, lastPosition.pos_y]);
                                    marker.setRotation(lastPosition.rot_x, lastPosition.rot_y, lastPosition.rot_z);
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            consoleErrorApi(error, "getLastPositions");
        }
    }

    const getMarker = (marker_id: string) => {

        for (let i = 0; i < markerInstance.current.length; i++) {
            const marker = markerInstance.current[i] as GLTFMarker;
            const properties = marker.getProperties() as IObjectProperties;
            if (properties.id === marker_id) {
                return marker;
            }
        }

        return null;
    }

    return (
        <PublicLayout>
            <div ref={mapRef} className="w-screen h-full"></div>
            <ListSkenarioSheet open={openListSkenario} operasi={homeOperasis} setOpen={setOpenListSkenario}
                               handleSkenarioChange={handleSkenarioChange}/>
        </PublicLayout>
    )
};

export default PreviewMap;