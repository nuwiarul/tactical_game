import {useEffect, useRef, useState} from "react";
import {Map, control, DrawTool, GLTFLayer, GLTFMarker} from "maptalks-gl";
import 'maptalks-gl/dist/maptalks-gl.css';
import '@maptalks/transcoders.draco';
import {useParams} from "react-router-dom";
import {config} from "@/utils/constants.ts";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {consoleErrorApi} from "@/helpers/logs.ts";
import MainLayout from "@/layouts/MainLayout.tsx";
import {
    createBaseLayerSwitcher,
    createCompassControl, createGroupGltfLayer,
    createMap, createMapEventModelControl,
    createSatelliteLayer,
    createStreetLayer, getGltfLayerWithGroup
} from "@/helpers/maps.ts";
import SkenarioSettingsSheet from "@/pages/skenarios/SkenarioSettingsSheet.tsx";
import AddUnitSheet from "@/pages/skenarios/AddUnitSheet.tsx";
import type {IUnit} from "@/helpers/type.data.ts";
import {createBaseObject, getUnit} from "@/helpers/objects.ts";
import {createModelControl} from "@/helpers/controls.ts";
import EditGeomSheet from "@/pages/skenarios/EditGeomSheet.tsx";
import EditPropertiesSheet from "@/pages/skenarios/EditPropertiesSheet.tsx";
import {toast} from "sonner";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import {ModelControl} from '@/lib/modelcontrol.js';

const SkenarioPlotPage = () => {

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map>(null);
    const initialized = useRef(false);
    const drawToolInstance = useRef<DrawTool | null>(null);
    const modelControlInstance = useRef<ModelControl | null>(null);

    const {id} = useParams();


    const [centerX, setCenterX] = useState(config.center[0]);
    const [centerY, setCenterY] = useState(config.center[1]);
    const [zoom, setZoom] = useState(14);
    const [pitch, setPitch] = useState(0);
    const [openMapSetting, setOpenMapSetting] = useState(false);
    const [openAddUnit, setOpenAddUnit] = useState(false);
    const [operasiId, setOperasiId] = useState("");
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);
    const [rotX, setRotX] = useState(0);
    const [rotY, setRotY] = useState(0);
    const [rotZ, setRotZ] = useState(0);
    const [unitJumlah, setUnitJumlah] = useState(1);
    const [unitName, setUnitName] = useState("");
    const [unitKeterangan, setUnitKeterangan] = useState("");
    const [unitId, setUnitId] = useState("");
    const [openEditGeom, setOpenEditGeom] = useState(false);
    const [openEditProperties, setOpenEditProperties] = useState(false);
    const [currentUnit, setCurrentUnit] = useState<GLTFMarker>(null);
    const [shareUrl, setShareUrl] = useState("");
    const [shareTitle, setShareTitle] = useState("");

    const initMap = (valName: string, valOperasiName: string, valOperasiId: string, valCenterX:number, valCenterY: number, valZoom: number, valPitch: number) => {
        if (!initialized.current && mapRef.current) {
            initialized.current = true;
            const streetLayer = createStreetLayer();
            const satelliteLayer = createSatelliteLayer();
            mapInstance.current = createMap(mapRef.current, streetLayer, [valCenterX, valCenterY], valZoom, valPitch, config.maxZoom);
            createCompassControl(mapInstance.current);
            createBaseLayerSwitcher(mapInstance.current, streetLayer, satelliteLayer);
            console.log(valName);
            const textPanel = new control.Panel({
                'position'      : {'top': 20, 'left': 60},
                'draggable'     : false,
                'custom'        : true,
                'content'       : `<div class="flex flex-col gap-0"><a href="/skenarios/${valOperasiId}" class="text-sm font-bold text-red-400">${valOperasiName}</a><span class="text-xs font-bold text-red-400">${valName}</span></div>`,
                'closeButton'   : false
            });
            mapInstance.current.addControl(textPanel);
            new control.Toolbar({
                position: {top: 80, right: 20},
                items: [{
                    item: '<svg class="w-6 h-6 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">\n' +
                        '  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z"/>\n' +
                        '  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>\n' +
                        '</svg>\n',
                    click: function() {
                        setOpenMapSetting(true)
                    }
                }]
            }).addTo(mapInstance.current)

            mapInstance.current.on('moving moveend zooming zoomend pitch pitchend', (param) => {
                if (param) {
                    if (param.type === 'zooming' || param.type === 'zoomend') {
                        setZoom(param.to);
                    } else if (param.type === 'pitch' || param.type === 'pitchend') {
                        if (mapInstance.current) {
                            setPitch(mapInstance?.current?.getPitch());
                        }
                    } else if (param.type === 'moving' || param.type === 'moveend') {
                        if (mapInstance.current) {
                            const center = mapInstance?.current?.getCenter();
                            setCenterX(center.x);
                            setCenterY(center.y);
                        }
                    }
                }
            });

            drawToolInstance.current = new DrawTool({
                mode: 'Point',
            }).addTo(mapInstance.current).disable();

            drawToolInstance.current?.on('drawend', function (param) {
                console.log(param);
                if (param) {
                    setPosX(param.coordinate.x);
                    setPosY(param.coordinate.y);
                    setOpenAddUnit(true);
                }

                drawToolInstance.current?.disable();
            });

            new control.Toolbar({
                'vertical': true,
                'position': {'top': 120, 'left': 20},
                'items': [{
                    item: 'Buat Unit',
                    click: function () {
                        drawToolInstance.current?.enable();
                    }
                }]
            }).addTo(mapInstance.current);

            const gltfLayer = new GLTFLayer('gltf');
            const iconlayer = new GLTFLayer('icon');
            createGroupGltfLayer(mapInstance.current, [gltfLayer, iconlayer]);
            modelControlInstance.current = createModelControl(mapInstance.current);
            createMapEventModelControl(mapInstance.current, modelControlInstance.current);
            getMarkers();
            setShareUrl(`https://twg.jagradewata.id/preview/${valOperasiId as string}/${id}`);
            setShareTitle(`${valOperasiName} - ${valName}`)

            //Create Three Group


        }
    }

    const reloadMarkers = (listUnits: IUnit[]) => {
        if (mapInstance.current) {
            const gltfLayer = getGltfLayerWithGroup(mapInstance.current, 'gltf');
            const iconlayer = getGltfLayerWithGroup(mapInstance.current, 'icon');
            if (gltfLayer) {

                listUnits.forEach((item) => {
                    const baseModel = getUnit(item.kategori, item.unit_id)
                    if (baseModel) {
                        createBaseObject(gltfLayer, iconlayer, modelControlInstance.current, {
                            url: baseModel.modelUrl,
                            center: [item.pos_x, item.pos_y],
                            rotation: { x: item.rot_x, y: item.rot_y, z: item.rot_z },
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
                            editGeom: editGeom,
                            editProperties: editProperties,
                            deleteObject: deleteObject,
                        })
                    }
                })
            }
        }
    }

    const getMarkers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.MARKERS.LIST(id as string))
            if (response.data.data) {
                reloadMarkers(response.data.data)
            }
        } catch (error) {
            consoleErrorApi(error, "Unit");
        }
    }

   /* const reloadMap = (valName: string, valOperasiName: string, valOperasiId: string, valCenterX:number, valCenterY: number, valZoom: number, valPitch: number) => {
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
        }
    }*/


    const getSkenario = async (id: string | undefined) => {
        try {
            const response = await axiosInstance.get(API_PATHS.SKENARIOS.GET(id as string))
            if (response.data.data) {

                setOperasiId(response.data.data.operasi.id);
                setCenterX(response.data.data.center_x);
                setCenterY(response.data.data.center_y);
                setZoom(response.data.data.zoom);
                setPitch(response.data.data.pitch);
                if (!initialized.current) {
                    initMap(response.data.data.name,
                        response.data.data.operasi.name,
                        response.data.data.operasi.id,
                        response.data.data.center_x,
                        response.data.data.center_y,
                        response.data.data.zoom,
                        response.data.data.pitch
                    );
                }

            }

        } catch (error) {
            consoleErrorApi(error, "Operasi");
        }

    }

    useEffect(() => {
        getSkenario(id);
    }, []);

    const editGeom =  (marker: GLTFMarker, id: string) => {
        const coord = marker.getCoordinates();
        const rot = marker.getRotation();
        setPosX(coord.x);
        setPosY(coord.y);
        setRotX(rot[0]);
        setRotY(rot[1]);
        setRotZ(rot[2]);
        setUnitId(id);
        setOpenEditGeom(true);
    }

    const editProperties = (id: string, jumlah: number, name: string, keterangan: string, marker: GLTFMarker) => {
        setUnitId(id)
        setUnitJumlah(jumlah)
        setUnitName(name)
        setUnitKeterangan(keterangan)
        setCurrentUnit(marker)
        setOpenEditProperties(true);
    }

    const deleteObject = async (id: string, marker: GLTFMarker) => {
        const confirm = window.confirm("Yakin ingin menghapus unit ini?");
        if (confirm) {
            try {
                await axiosInstance.delete(API_PATHS.MARKERS.DELETE(id as string))
                marker.remove();
                toast.success("Unit berhasil dihapus");
            } catch (error) {
                consoleErrorApi(error, "Delete Unit");
            }
        }
    }

    const handleAddUnit = (addUnit: IUnit) => {
        setOpenAddUnit(false);
        if (mapInstance.current) {
            const gltfLayer = getGltfLayerWithGroup(mapInstance.current, 'gltf');
            const iconlayer = getGltfLayerWithGroup(mapInstance.current, 'icon');
            if (gltfLayer) {
                const baseModel = getUnit(addUnit.kategori, addUnit.unit_id)
                if (baseModel) {
                    createBaseObject(gltfLayer, iconlayer, modelControlInstance.current, {
                        url: baseModel.modelUrl,
                        center: [addUnit.pos_x, addUnit.pos_y],
                        rotation: { x: addUnit.rot_x, y: addUnit.rot_y, z: addUnit.rot_z },
                        height: baseModel.height,
                        animation: baseModel.animation,
                        id: addUnit.id,
                        unit_id: addUnit.unit_id,
                        name: addUnit.name,
                        icon: baseModel.icon,
                        description: `Jumlah ${addUnit.jumlah}<br/>${addUnit.keterangan}`,
                        child: baseModel.child,
                        keterangan: addUnit.keterangan,
                        jumlah: addUnit.jumlah,
                        editGeom: editGeom,
                        editProperties: editProperties,
                        deleteObject: deleteObject,
                    })
                }
            }
        }
    }

    const handleUpdatePropertiesUnit = (name: string, jumlah: number, keterangan: string) => {
        setOpenEditProperties(false);
        if (currentUnit) {
            currentUnit.removeInfoWindow();
            currentUnit.setInfoWindow({
                title: `<span style="color: grey;">${name}<span>`,
                content: `<span style="color: grey;">Jumlah ${jumlah}<br/>${keterangan}<span>`,
            });
        }
    }


    return (
        <MainLayout activeMenu="operasis" title="Plot Skenario" share={{url: shareUrl, title: shareTitle}}>
            <div ref={mapRef} className="w-full h-full"></div>
            <SkenarioSettingsSheet
                open={openMapSetting}
                centerX={centerX}
                centerY={centerY}
                zoom={zoom}
                pitch={pitch}
                id={id as string}
                close={() => setOpenMapSetting(false)}
            />
            <AddUnitSheet
                open={openAddUnit}
                posX={posX}
                posY={posY}
                skenarioId={id as string}
                operasiId={operasiId} close={() => setOpenAddUnit(false)}
                addUnit={handleAddUnit}
            />
            <EditGeomSheet
                open={openEditGeom}
                posX={posX}
                posY={posY}
                rotX={rotX}
                rotY={rotY}
                rotZ={rotZ}
                id={unitId}
                close={() => setOpenEditGeom(false)}
            />
            <EditPropertiesSheet
                open={openEditProperties}
                jumlah={unitJumlah}
                keterangan={unitKeterangan}
                name={unitName}
                setName={(value) => setUnitName(value)}
                setJumlah={(value) => setUnitJumlah(value)}
                setKeterangan={(value) => setUnitKeterangan(value)}
                id={unitId}
                close={() => setOpenEditProperties(false)}
                handlePropsChange={handleUpdatePropertiesUnit}
            />
        </MainLayout>
    );
};

export default SkenarioPlotPage;