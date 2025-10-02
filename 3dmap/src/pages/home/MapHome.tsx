import PublicLayout from "@/layouts/PublicLayout.tsx";
import {useEffect, useRef, useState} from "react";
import {control, GLTFLayer, GLTFMarker, Map, type TileLayer} from "maptalks-gl";
import {
    createBaseLayerSwitcher,
    createCompassControl, createGroupGltfLayer,
    createMapDisable,
    createSatelliteLayer,
    createStreetLayer, createThreeLayer, getGltfLayerWithGroup
} from "@/helpers/maps.ts";
import {CHANNEL, config} from "@/utils/constants.ts";
import {Centrifuge} from "centrifuge";
import {API_PATHS, CENTRIFUGO_URL} from "@/utils/apiPaths";
import {useEffectOnce} from "react-use";
import {createHomeBaseObject, getUnit, type IBuildingProperties, type IObjectProperties} from "@/helpers/objects.ts";
import type {IAlur, IUnit} from "@/helpers/type.data.ts";
import axiosInstance from "@/utils/axiosInstance.ts";
import {consoleErrorApi} from "@/helpers/logs.ts";
import {formatRouteData, RoutePlayer} from "maptalks.routeplayer";
import {getAlurs, removeBuildings, removeGltfMarkersHelper} from "@/helpers/games.ts";
import type {ThreeLayer} from "maptalks.three";
import type ExtrudePolygon from "maptalks.three/dist/ExtrudePolygon";
import AlurSheet from "@/components/AlurSheet.tsx";


const HomeIndex = () => {

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map>(null);
    const initialized = useRef(false);
    const textPanel = useRef<control.Panel|null>(null);
    const markerInstance = useRef<GLTFMarker[]>([])
    const streetLayerInstance = useRef<TileLayer>(null);
    const satelliteLayerInstance = useRef<TileLayer>(null);
    const threeLayerInstance = useRef<ThreeLayer>(null);
    const buildingInstance = useRef<ExtrudePolygon[]>([]);

    const [openAlur, setOpenAlur] = useState(false);
    const [listAlurs, setListAlurs] = useState<IAlur[]>([]);

    useEffect(() => {
        if (!initialized.current && mapRef.current) {
            initialized.current = true;
            streetLayerInstance.current = createStreetLayer();
            satelliteLayerInstance.current = createSatelliteLayer();
            mapInstance.current = createMapDisable(mapRef.current, streetLayerInstance.current, config.center, config.zoom, config.pitch, config.maxZoom);
            createCompassControl(mapInstance.current);
            createBaseLayerSwitcher(mapInstance.current, streetLayerInstance.current, satelliteLayerInstance.current, onHandleBaseLayerChange);

            const gltfLayer = new GLTFLayer('gltf');
            const iconlayer = new GLTFLayer('icon');
            const groupGlLayer = createGroupGltfLayer(mapInstance.current, [gltfLayer, iconlayer]);

            //createModelControl(mapInstance.current);

            //reload building
            threeLayerInstance.current = createThreeLayer();
            groupGlLayer.addLayer(threeLayerInstance.current);
        }


    }, []);


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
                        const unit = createHomeBaseObject(gltfLayer, iconlayer, {
                            url: baseModel.modelUrl,
                            center: [item.pos_x, item.pos_y],
                            rotation: { x: item.rot_x, y: item.rot_y, z: item.rot_z },
                            height: baseModel.height,
                            animation: baseModel.animation,
                            id: item.id,
                            unit_id: item.unit_id,
                            name: item.name,
                            icon: baseModel.icon,
                            scale: item.scale,
                            description: `${item.kategori !== "bangunan" ? `Jumlah ${item.jumlah}<br/>` : "" }${item.keterangan}`,
                            child: baseModel.child,
                            keterangan: item.keterangan,
                            jumlah: item.jumlah,
                        })
                        units.push(unit)
                    }
                });
                markerInstance.current = units;
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

    const reloadMap = (id: string, valName: string, valOperasiName: string,  valCenterX:number, valCenterY: number, valZoom: number, valPitch: number) => {
        if (mapInstance.current) {
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
            } else {
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
            );
        }
    }

    const callbackRemoveBuilding = (buildings: ExtrudePolygon[])=> {
        buildingInstance.current = buildings;
    }


    const getSkenario = async (id: string | undefined) => {
        try {
            const response = await axiosInstance.get(API_PATHS.SKENARIOS.GET(id as string))
            if (response.data.data) {
                reloadMap(
                    id as string,
                    response.data.data.name,
                    response.data.data.operasi.name,
                    response.data.data.center_x,
                    response.data.data.center_y,
                    response.data.data.zoom,
                    response.data.data.pitch
                );

                await getAlurs(id as string, (rows: IAlur[]) => {
                    setListAlurs(rows);
                });

            }

        } catch (error) {
            consoleErrorApi(error, "Operasi");
        }

    }

    const move = (data: string, marker_id: string) => {

        for (let i = 0; i < markerInstance.current.length; i++) {
            const marker = markerInstance.current[i] as GLTFMarker;
            const properties = marker.getProperties() as IObjectProperties;
            if (properties.id === marker_id) {
                const geom = JSON.parse(data);
                const coord = marker.getCoordinates();
                const route = [{
                    coordinate: [coord.x, coord.y, 0],
                },
                    {
                        coordinate: [geom.x, geom.y, 0],
                    },
                    //other coordinates
                ];
                const dataCoordinates = formatRouteData(route, { duration: 10000 });

                const player = new RoutePlayer(dataCoordinates, { speed: 4, debug: false });
                player.on('playstart playing playend vertex pause', (e: { type?: string; coordinate?: object; }) => {
                    if (e.type === "playstart") {
                        marker.setCurrentAnimation("Idle|Walk")
                    } else if (e.type === "playend") {
                        marker.setCurrentAnimation("Idle|Idle")
                        player.finish();
                    } else if (e.type === "playing") {
                        const { coordinate } = e;
                        marker.setCoordinates(coordinate);
                    }
                })
                player.play();



                break;
            }
        }


    }

    const alur = (value: boolean) => {
        setOpenAlur(value);
    }

    const rot = (data: string, marker_id: string) => {

        for (let i = 0; i < markerInstance.current.length; i++) {
            const marker = markerInstance.current[i] as GLTFMarker;
            const properties = marker.getProperties() as IObjectProperties;
            if (properties.id === marker_id) {
                const geom = JSON.parse(data)
                marker.setRotation(geom.x, geom.y, geom.z)
                break;
            }
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

    const info = (command: string, marker_id: string) => {

        for (let i = 0; i < markerInstance.current.length; i++) {
            const marker = markerInstance.current[i] as GLTFMarker;
            const properties = marker.getProperties() as IObjectProperties;
            if (properties.id === marker_id) {

                if (command === "SHOWINFO") {
                    marker.openInfoWindow();
                } else if (command === "HIDEINFO") {
                    marker.closeInfoWindow();
                }
                break;
            }
        }


    }

    const infoBuilding = (command: string, building_id: string) => {
        console.log(command)
        console.log(building_id)
        for (let i = 0; i < buildingInstance.current.length; i++) {
            const building = buildingInstance.current[i] as ExtrudePolygon;
            const properties = building.getProperties() as IBuildingProperties;
            console.log(properties.id);
            if (properties.id === building_id) {

                if (command === "SHOWINFO_BUIlDING") {
                    building.openInfoWindow(building.getCenter());
                } else if (command === "HIDEINFO_BUILDING") {
                    building.closeInfoWindow();
                }
                break;
            }
        }


    }

    const changeLayer = (data: string) => {
        if (mapInstance.current) {
            const layer = JSON.parse(data);
            if (layer.layer === "satellite") {
                if (satelliteLayerInstance.current) {
                    mapInstance.current.setBaseLayer(satelliteLayerInstance.current);
                }

            } else if (layer.layer === "street") {
                if (streetLayerInstance.current) {
                    mapInstance.current.setBaseLayer(streetLayerInstance.current);
                }
            }
        }

    }




    useEffectOnce(() => {
        const centrifuge = new Centrifuge(CENTRIFUGO_URL);

        // 2. Tambahkan event listener
        centrifuge.on('connected', (ctx) => {
            console.log('Connected to Centrifugo', ctx);
        });

        centrifuge.on('disconnected', (ctx) => {
            console.log('Disconnected from Centrifugo', ctx);
        });

        // 3. Langganan (Subscribe) ke sebuah channel
        const sub = centrifuge.newSubscription(CHANNEL);

        // 4. Tambahkan event listener untuk channel
        sub.on('publication', (ctx) => {
            const data = ctx.data;
            //console.log('Publication received', data);
            if (data.command === "RELOAD") {
                getSkenario(data.skenario_id as string);
            } else if (data.command === "MOVE") {
                move(data.data, data.marker_id);
            } else if (data.command === "ROT") {
                rot(data.data, data.marker_id);
            } else if (data.command === "ZOOM") {
                zoom(data.data);
            } else if (data.command === "SHOWINFO" || data.command === "HIDEINFO") {
                info(data.command, data.marker_id);
            } else if (data.command === "SHOWINFO_BUIlDING" || data.command === "HIDEINFO_BUILDING") {
                console.log('Publication received', data);
                infoBuilding(data.command, data.marker_id);
            } else if (data.command === "CHANGE") {
                changeLayer(data.data);
            } else if (data.command === "OPEN_ALUR") {
                alur(true);
            } else if (data.command === "CLOSE_ALUR") {
                alur(false);
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

        // 6. Cleanup function
        // Penting: Putuskan koneksi saat komponen di-unmount
        return () => {
            sub.unsubscribe();
            centrifuge.disconnect();
        };
    });





    const onHandleBaseLayerChange = (id: string) => {
        console.log(id);
    }

    return (
        <PublicLayout>
            <div ref={mapRef} className="w-screen h-full"></div>
            <AlurSheet open={openAlur} setOpen={setOpenAlur} rows={listAlurs} />
        </PublicLayout>
    );
};

export default HomeIndex;