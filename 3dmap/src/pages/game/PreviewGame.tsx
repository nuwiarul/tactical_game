import {useEffect, useRef, useState} from "react";
import {control, GLTFLayer, GLTFMarker, Map} from "maptalks-gl";
import {
    createBaseLayerSwitcher,
    createCompassControl, createGroupGltfLayer,
    createMap, createMapEventModelControl,
    createSatelliteLayer,
    createStreetLayer, createThreeLayer, getGltfLayerWithGroup
} from "@/helpers/maps.ts";
import {config} from "@/utils/constants.ts";
import {useParams} from "react-router-dom";
import {createBaseObject, getUnit, type IObjectProperties} from "@/helpers/objects.ts";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {consoleErrorApi} from "@/helpers/logs.ts";
import type {IUnit} from "@/helpers/type.data.ts";
import type {IHomeOperasi} from "@/pages/home/ListOperasi.tsx";
import ListSkenarioSheet from "@/components/ListSkenarioSheet.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {ModelControl} from "@/lib/modelcontrol";
import {createModelControl} from "@/helpers/controls.ts";
import {toast} from "sonner";
import {removeBuildings, removeGltfMarkersHelper} from "@/helpers/games.ts";
import type {ThreeLayer} from "maptalks.three";
import type ExtrudePolygon from "maptalks.three/dist/ExtrudePolygon";



const PreviewGame = ({isRecord}: {isRecord: number}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map>(null);
    const initialized = useRef(false);
    const isFirst = useRef(false);
    const textPanel = useRef<control.Panel|null>(null);
    const modelControlInstance = useRef<ModelControl | null>(null);
    const skenarioIdInstance = useRef("");
    const lastCommandInstance = useRef("");
    const markerInstance = useRef<GLTFMarker[]>([])
    const threeLayerInstance = useRef<ThreeLayer>(null);
    const buildingInstance = useRef<ExtrudePolygon[]>([]);

    const {operasi_id, skenario_id} = useParams();

    const [openListSkenario, setOpenListSkenario] = useState(false);
    const [homeOperasis, setHomeOperasis] = useState<IHomeOperasi | null>(null)
    const [shareUrl, setShareUrl] = useState("");
    const [shareTitle, setShareTitle] = useState("");

    const removeGltfMarkers = (id: string) => {

        const callbackRemoveGltf=  () => {
            getMarkers(id);
        }
        removeGltfMarkersHelper(mapInstance.current!, markerInstance.current, callbackRemoveGltf)

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
                        const unit = createBaseObject(gltfLayer, iconlayer, modelControlInstance.current, {
                            url: baseModel.modelUrl,
                            center: [item.pos_x, item.pos_y],
                            rotation: { x: item.rot_x, y: item.rot_y, z: item.rot_z },
                            height: baseModel.height,
                            animation: baseModel.animation,
                            id: item.id,
                            unit_id: item.unit_id,
                            name: item.name,
                            icon: baseModel.icon,
                            description: `${item.kategori !== "bangunan" ? `Jumlah ${item.jumlah}<br/>` : "" }${item.keterangan}`,
                            child: baseModel.child,
                            keterangan: item.keterangan,
                            jumlah: item.jumlah,
                            callbackinfo: callbackInfoWindow,
                            dragable: true,
                            callbackdrag: callbackDrag,
                            isMove: item.kategori !== "bangunan",

                        })
                        units.push(unit)
                    }
                });
                markerInstance.current = units
            }
        }
    }

    const callbackInfoWindow = (id: string, command: string) => {
        publish(command, JSON.stringify({command: command, marker_id: id}), operasi_id as string, skenarioIdInstance.current, id, isRecord);
    }



    const callbackDrag = (id: string, command: string, data: string) => {
        callbackModelControl(id, command, data);
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

    const initMap = (valName: string, valOperasiName: string, valCenterX:number, valCenterY: number, valZoom: number, valPitch: number) => {
        if (!initialized.current && mapRef.current) {
            initialized.current = true;
            const streetLayer = createStreetLayer();
            const satelliteLayer = createSatelliteLayer();
            mapInstance.current = createMap(mapRef.current, streetLayer, [valCenterX, valCenterY], valZoom, valPitch, config.maxZoom);
            createCompassControl(mapInstance.current);
            createBaseLayerSwitcher(mapInstance.current, streetLayer, satelliteLayer, callbackLayerSwitcher);
            console.log(valName);
            textPanel.current = new control.Panel({
                'position'      : {'top': 20, 'left': 60},
                'draggable'     : false,
                'custom'        : true,
                'content'       : `<div class="flex flex-col gap-0"><span class="text-sm font-bold text-red-400">${valOperasiName}</span><span class="text-xs font-bold text-red-400">${valName}</span></div>`,
                'closeButton'   : false
            });
            mapInstance.current.addControl(textPanel.current);

            const gltfLayer = new GLTFLayer('gltf');
            const iconlayer = new GLTFLayer('icon');
            const groupGlLayer = createGroupGltfLayer(mapInstance.current, [gltfLayer, iconlayer]);

            const menus = [{
                item: 'List Skenario',
                click: function() {
                    setOpenListSkenario(true)
                },

            }, {
                item: 'Last Command',
                click: function() {
                    publishLastCommand();
                },

            }]

            if (isRecord === 1) {
                menus.push({
                    item: 'Last Positions',
                    click: function() {
                        getLastPositions();
                    },

                })
            }

            menus.push({
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

            });


            new control.Toolbar({
                position: {top: 80, right: 20},
                'vertical' : true,
                items: menus
            }).addTo(mapInstance.current)
            modelControlInstance.current = createModelControl(mapInstance.current, callbackModelControl);
            createMapEventModelControl(mapInstance.current, modelControlInstance.current);
            isFirst.current = true;
            removeGltfMarkers(skenario_id as string);

            //reload building
            threeLayerInstance.current = createThreeLayer();
            groupGlLayer.addLayer(threeLayerInstance.current);

            removeBuildings(
                skenario_id as string,
                mapInstance.current as Map,
                threeLayerInstance.current as ThreeLayer,
                buildingInstance.current,
                callbackRemoveBuilding,
                callbackInfoWindowBuilding
                );


            mapInstance.current.on('moveend zoomend pitchend', (param) => {
                if (param) {
                    const center = mapInstance?.current?.getCenter();
                    const zoom = mapInstance.current?.getZoom();
                    const pitch = mapInstance.current?.getPitch();
                    const bearing = mapInstance.current?.getBearing();
                    publish("ZOOM", JSON.stringify({center: center, zoom: zoom, pitch: pitch, bearing: bearing}), operasi_id as string, skenarioIdInstance.current, "4cfb8599-62ee-41dc-ad34-f13706547840", isRecord);
                }
            });
            publish("RELOAD", JSON.stringify({reload: true}), operasi_id as string, skenario_id as string, "reload", 0)
        }
    }

    const callbackInfoWindowBuilding = (id: string, command: string) => {
        console.log(command)
        publish(`${command}_BUIlDING`, JSON.stringify({command: command, building_id: id}), operasi_id as string, skenarioIdInstance.current, id, isRecord);
    }

    const callbackRemoveBuilding = (buildings: ExtrudePolygon[])=> {
        buildingInstance.current = buildings;
    }

    const callbackLayerSwitcher = (layer: string) => {
        publish("CHANGE", JSON.stringify({layer: layer}), operasi_id as string, skenario_id as string, "reload", 0)
    }

    const reloadMap = (id: string, valName: string, valOperasiName: string,  valCenterX:number, valCenterY: number, valZoom: number, valPitch: number) => {
        if (mapInstance.current) {
            publish("RELOAD", JSON.stringify({reload: true}), operasi_id as string, id as string, "reload", 0)
            mapInstance.current.flyTo({
                zoom : valZoom,
                center : [valCenterX, valCenterY],
                pitch : valPitch,
            }, {
                duration : 1000,
                easing : 'out'
            }, function(frame) {
                if (frame.state.playState === 'finished') {
                    console.log('animation finished');
                }
            });
            if (textPanel.current) {
                mapInstance.current.removeControl(textPanel.current);
                textPanel.current = new control.Panel({
                    'position'      : {'top': 20, 'left': 60},
                    'draggable'     : false,
                    'custom'        : true,
                    'content'       : `<div class="flex flex-col gap-0"><span class="text-sm font-bold text-red-400">${valOperasiName}</span><span class="text-xs font-bold text-red-400">${valName}</span></div>`,
                    'closeButton'   : false
                });
                mapInstance.current.addControl(textPanel.current);
            }
            removeGltfMarkers(id);
            removeBuildings(
                id,
                mapInstance.current as Map,
                threeLayerInstance.current as ThreeLayer,
                buildingInstance.current,
                callbackRemoveBuilding,
                callbackInfoWindowBuilding
            );
        }
    }

    const getSkenario = async (id: string | undefined) => {
        skenarioIdInstance.current = id as string;
        setShareUrl(`https://twg.jagradewata.id/preview/${operasi_id as string}/${id}`);
        try {
            const response = await axiosInstance.get(API_PATHS.SKENARIOS.GET(id as string))
            if (response.data.data) {
                setShareTitle(`${response.data.data.operasi.name} - ${response.data.data.name}`)
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

    const callbackModelControl = (id: string, command: string, data: string) => {
        publish(command, data, operasi_id as string, skenarioIdInstance.current, id, isRecord);
    }

    const publishLastCommand = async () => {
        if (lastCommandInstance.current !== "") {
            const data = JSON.parse(lastCommandInstance.current);
            if (data.is_save === 1) {
                await axiosInstance.post(API_PATHS.PUBLISH, {
                    command: data.command,
                    data: data.data,
                    skenario_id: data.skenario_id,
                    operasi_id: data.operasi_id,
                    marker_id: data.marker_id,
                    is_save: data.is_save,
                });
                toast.success("Last Command berhasil di execute");
            }
        }
    }

    const publish = async (command: string, data: string, operasiId: string, skenarioId: string, markerId: string, isSave: number) => {
        lastCommandInstance.current = JSON.stringify({
            command,
            data,
            operasi_id: operasiId,
            skenario_id: skenarioId,
            marker_id: markerId,
            is_save: isSave,
        })
        await axiosInstance.post(API_PATHS.PUBLISH, {
            command: command,
            data: data,
            skenario_id: skenarioId,
            operasi_id: operasiId,
            marker_id: markerId,
            is_save: isSave
        });
    }

    const getLastPositions = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.LAST_POSITIONS(skenarioIdInstance.current));
            if (response.data.data) {
                if (response.data.data.last_map) {
                    console.log(response.data.data.last_map)
                    if (mapInstance.current) {
                        if (response.data.data.last_map.center_x !== 0 || response.data.data.last_map.center_y !== 0) {
                            mapInstance.current.flyTo({
                                zoom : response.data.data.last_map.zoom,
                                center : [response.data.data.last_map.center_x, response.data.data.last_map.center_y],
                                pitch : response.data.data.last_map.pitch,
                                bearing : response.data.data.last_map.bearing,
                            }, {
                                duration : 1000,
                                easing : 'out'
                            }, function(frame) {
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
        <MainLayout activeMenu={isRecord ? "games" : "latihans"} title={isRecord ? "Tactical Game" : "Latihan"} share={{url: shareUrl, title: shareTitle}}>
            <div ref={mapRef} className="w-full h-full"></div>
            <ListSkenarioSheet open={ openListSkenario } operasi={homeOperasis} setOpen={setOpenListSkenario} handleSkenarioChange={handleSkenarioChange} />
        </MainLayout>
    )
};

export default PreviewGame;