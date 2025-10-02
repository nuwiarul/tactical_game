import {useEffect, useRef, useState} from "react";
import {control, GLTFLayer, GLTFMarker, Map} from "maptalks-gl";
import {
    createBaseLayerSwitcher, createBearingControl,
    createCompassControl, createGroupGltfLayer,
    createMap, createMapEventModelControl, createPitchControl,
    createSatelliteLayer,
    createStreetLayer, createThreeLayer, createZoomControl, getGltfLayerWithGroup
} from "@/helpers/maps.ts";
import {CHANNEL, config} from "@/utils/constants.ts";
import {useParams} from "react-router-dom";
import {createBaseObject, getUnit, type IObjectProperties} from "@/helpers/objects.ts";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS, CENTRIFUGO_URL} from "@/utils/apiPaths.ts";
import {consoleErrorApi} from "@/helpers/logs.ts";
import type {IAlur, IUnit} from "@/helpers/type.data.ts";
import type {IHomeOperasi} from "@/pages/home/ListOperasi.tsx";
import ListSkenarioSheet from "@/components/ListSkenarioSheet.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {ModelControl} from "@/lib/modelcontrol";
import {createModelControl} from "@/helpers/controls.ts";
import {toast} from "sonner";
import {checkMove, getAlurs, removeBuildings, removeGltfMarkersHelper} from "@/helpers/games.ts";
import type {ThreeLayer} from "maptalks.three";
import type ExtrudePolygon from "maptalks.three/dist/ExtrudePolygon";
import AlurSheet from "@/components/AlurSheet.tsx";
import {useIdentify} from "@/context/AuthProvider.tsx";
import type {IBaseModel} from "@/utils/items.ts";
import {useEffectOnce} from "react-use";
import {Centrifuge} from "centrifuge";


const PreviewGame = ({isRecord}: { isRecord: number }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map>(null);
    const initialized = useRef(false);
    const isFirst = useRef(false);
    const textPanel = useRef<control.Panel | null>(null);
    const modelControlInstance = useRef<ModelControl | null>(null);
    const skenarioIdInstance = useRef("");
    const lastCommandInstance = useRef("");
    const markerInstance = useRef<GLTFMarker[]>([])
    const threeLayerInstance = useRef<ThreeLayer>(null);
    const buildingInstance = useRef<ExtrudePolygon[]>([]);
    const unitsInstance = useRef<IBaseModel[]>([]);
    const unitRoleInstance = useRef("admin");


    const {operasi_id, skenario_id} = useParams();

    const [openListSkenario, setOpenListSkenario] = useState(false);
    const [homeOperasis, setHomeOperasis] = useState<IHomeOperasi | null>(null)
    const [shareUrl, setShareUrl] = useState("");
    const [shareTitle, setShareTitle] = useState("");

    const [openAlur, setOpenAlur] = useState(false);
    const [listAlurs, setListAlurs] = useState<IAlur[]>([]);

    const user = useIdentify();

    const removeGltfMarkers = (id: string) => {

        const callbackRemoveGltf = () => {
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
                            rotation: {x: item.rot_x, y: item.rot_y, z: item.rot_z},
                            height: baseModel.height,
                            animation: baseModel.animation,
                            id: item.id,
                            unit_id: item.unit_id,
                            name: item.name,
                            icon: baseModel.icon,
                            description: `${item.kategori !== "bangunan" ? `Jumlah ${item.jumlah}<br/>` : ""}${item.keterangan}`,
                            child: baseModel.child,
                            keterangan: item.keterangan,
                            jumlah: item.jumlah,
                            callbackinfo: callbackInfoWindow,
                            dragable: true,
                            callbackdrag: callbackDrag,
                            isMove: item.kategori !== "bangunan" ? checkMove(item.unit_id, unitsInstance.current, unitRoleInstance.current) : false,
                            scale: item.scale,

                        })
                        units.push(unit)
                    }
                });
                markerInstance.current = units
            }
        }
    }




    const callbackInfoWindow = (id: string, command: string) => {
        publish(command, JSON.stringify({
            command: command,
            marker_id: id
        }), operasi_id as string, skenarioIdInstance.current, id, isRecord);
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

    const initMap = (valName: string, valOperasiName: string, valCenterX: number, valCenterY: number, valZoom: number, valPitch: number) => {
        if (!initialized.current && mapRef.current) {
            initialized.current = true;
            const streetLayer = createStreetLayer();
            const satelliteLayer = createSatelliteLayer();
            mapInstance.current = createMap(mapRef.current, streetLayer, [valCenterX, valCenterY], valZoom, valPitch, config.maxZoom);
            createCompassControl(mapInstance.current);
            createZoomControl(mapInstance.current);
            createBearingControl(mapInstance.current);
            createPitchControl(mapInstance.current);
            createBaseLayerSwitcher(mapInstance.current, streetLayer, satelliteLayer, callbackLayerSwitcher);
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
            const groupGlLayer = createGroupGltfLayer(mapInstance.current, [gltfLayer, iconlayer]);

            const menus = [{
                item: 'List Skenario',
                click: function () {
                    setOpenListSkenario(true)
                },

            }, {
                item: 'List Alur',
                click: function () {
                    setOpenAlur(true);
                    publish("OPEN_ALUR", JSON.stringify({alur: "open"}), operasi_id as string, skenario_id as string, "open_alur", 0)
                },

            }, {
                item: 'Last Command',
                click: function () {
                    publishLastCommand();
                },

            }]

            if (isRecord === 1) {
                menus.push({
                    item: 'Last Positions',
                    click: function () {
                        getLastPositions();
                    },

                })
            }

            menus.push({
                item: 'Export Image',
                click: function () {
                    if (mapInstance.current) {
                        mapInstance.current.toDataURL({
                            'mimeType': 'image/jpeg', // or 'image/png'
                            'save': true,             // to pop a save dialog
                            'fileName': 'map'         // file name
                        });
                    }
                },

            });


            new control.Toolbar({
                position: {top: 80, right: 20},
                'vertical': true,
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
                    if (unitRoleInstance.current === "admin") {
                        publish("ZOOM", JSON.stringify({
                            center: center,
                            zoom: zoom,
                            pitch: pitch,
                            bearing: bearing
                        }), operasi_id as string, skenarioIdInstance.current, "4cfb8599-62ee-41dc-ad34-f13706547840", isRecord);
                    }

                }
            });
            if (unitRoleInstance.current === "admin") {
                publish("RELOAD", JSON.stringify({reload: true}), operasi_id as string, skenario_id as string, "reload", 0)
            }

        }
    }

    const callbackInfoWindowBuilding = (id: string, command: string) => {
        console.log(command)
        publish(`${command}_BUIlDING`, JSON.stringify({
            command: command,
            building_id: id
        }), operasi_id as string, skenarioIdInstance.current, id, isRecord);
    }

    const callbackRemoveBuilding = (buildings: ExtrudePolygon[]) => {
        buildingInstance.current = buildings;
    }

    const callbackLayerSwitcher = (layer: string) => {
        publish("CHANGE", JSON.stringify({layer: layer}), operasi_id as string, skenario_id as string, "reload", 0)
    }

    const reloadMap = (id: string, valName: string, valOperasiName: string, valCenterX: number, valCenterY: number, valZoom: number, valPitch: number) => {
        if (mapInstance.current) {
            if (unitRoleInstance.current === "admin") {
                publish("RELOAD", JSON.stringify({reload: true}), operasi_id as string, id as string, "reload", 0);
            }

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

                await getAlurs(id as string, (rows: IAlur[]) => {
                    setListAlurs(rows);
                });
            }

        } catch (error) {
            consoleErrorApi(error, "Operasi");
        }

    }




    useEffect(() => {
        //console.log(user.user?.user);
        if (user) {
            //console.log(user.user?.user);
            unitsInstance.current = user.user?.user.units as IBaseModel[]
            if (user.user?.user.units[0].id === "all") {
                unitRoleInstance.current = "admin"
            } else {
                unitRoleInstance.current = "user"
            }
            getSkenario(skenario_id);
        }

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

    const onCloseAlurSheet = (value: boolean) => {
        setOpenAlur(value);
        if (!value) {
            publish("CLOSE_ALUR", JSON.stringify({alur: "close"}), operasi_id as string, skenario_id as string, "close_alur", 0)
        }
    }

    const zoom = (data: string) => {
        if (mapInstance.current) {
            const geom = JSON.parse(data)
            mapInstance.current.flyTo({
                zoom : geom.zoom,
                center : [geom.center.x, geom.center.y],
                pitch : geom.pitch,
                bearing: geom.bearing,
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



    useEffectOnce(() => {

        let centrifuge = null;
        let sub = null;

        if (user) {
            centrifuge = new Centrifuge(CENTRIFUGO_URL);

            // 2. Tambahkan event listener
            centrifuge.on('connected', (ctx) => {
                console.log('Connected to Centrifugo', ctx);
            });

            centrifuge.on('disconnected', (ctx) => {
                console.log('Disconnected from Centrifugo', ctx);
            });

            // 3. Langganan (Subscribe) ke sebuah channel
            sub = centrifuge.newSubscription(CHANNEL);

            // 4. Tambahkan event listener untuk channel
            sub.on('publication', (ctx) => {
                const data = ctx.data;
                //console.log('Publication received', data);
                if (data.command === "RELOAD") {
                    //getSkenario(data.skenario_id as string);
                    if (unitRoleInstance.current === "user") {
                        getSkenario(data.skenario_id as string);
                    }
                } else if (data.command === "MOVE") {
                    //move(data.data, data.marker_id);
                } else if (data.command === "ROT") {
                    //rot(data.data, data.marker_id);
                } else if (data.command === "ZOOM") {
                    //zoom(data.data);
                    if (unitRoleInstance.current === "user") {
                        zoom(data.data);
                    }
                }
            });

            sub.on('subscribing', (ctx) => {
                console.log('Subscribing to channel', ctx);
            });

            sub.on('subscribed', (ctx) => {
                console.log('Successfully subscribed', ctx);
            });

            // 5. Connect ke Centrifugo
            sub.subscribe();
            centrifuge.connect();
        }



        // 6. Cleanup function
        // Penting: Putuskan koneksi saat komponen di-unmount
        return () => {
            if (sub) {
                sub.unsubscribe();
            }

            if (centrifuge) {
                centrifuge.disconnect();
            }


        };
    });


    return (
        <MainLayout activeMenu={isRecord ? "games" : "latihans"} title={isRecord ? "Tactical Game" : "Latihan"}
                    share={{url: shareUrl, title: shareTitle}}>
            <div ref={mapRef} className="w-full h-full"></div>
            <ListSkenarioSheet open={openListSkenario} operasi={homeOperasis} setOpen={setOpenListSkenario}
                               handleSkenarioChange={handleSkenarioChange}/>
            <AlurSheet open={openAlur} setOpen={onCloseAlurSheet} rows={listAlurs}/>
        </MainLayout>
    )
};

export default PreviewGame;