import MainLayout from "@/layouts/MainLayout.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import AppBreadcum, {type IBreadcum} from "@/components/AppBreadcum.tsx";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {Home, Layers2} from "lucide-react";
import {consoleErrorApi} from "@/helpers/logs.ts";
import {config} from "@/utils/constants.ts";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {
    Map
} from 'maptalks-gl';
import 'maptalks-gl/dist/maptalks-gl.css';
import {
    createBaseLayerSwitcher,
    createCompassControl,
    createMap,
    createSatelliteLayer,
    createStreetLayer
} from "@/helpers/maps.ts";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";

const SkenarioMapCreate = () => {

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map>(null);
    const initialized = useRef(false);

    const {operasiId} = useParams();
    const navigate = useNavigate();
    const [breadcums, setBreadcums] = useState<IBreadcum[]>([]);

    const [name, setName] = useState("");
    const [centerX, setCenterX] = useState(config.center[0]);
    const [centerY, setCenterY] = useState(config.center[1]);
    const [zoom, setZoom] = useState(14);
    const [pitch, setPitch] = useState(0);


    const getOperasi = async (id: string | undefined) => {
        try {
            const response = await axiosInstance.get(API_PATHS.OPERASIS.GET(id as string))
            if (response.data.data) {
                const operasiName = response.data.data.name as string;
                setBreadcums([
                    {title: "Dashboard", href: "/admin", icon: Home},
                    {title: "Operasis", href: "/operasis", icon: Layers2},
                    {title: operasiName, href: `/skenarios/${operasiId}`},
                    {title: "New Skenario", href: "#"},
                ]);
            }

        } catch (error) {
            consoleErrorApi(error, "Operasi");
        }

    }

    useEffect(() => {
        getOperasi(operasiId);
    }, []);

    useEffect(() => {
        if (!initialized.current && mapRef.current) {
            initialized.current = true;
            const streetLayer = createStreetLayer();
            const satelliteLayer = createSatelliteLayer();
            mapInstance.current = createMap(mapRef.current, streetLayer, [centerX, centerY], zoom, pitch, config.maxZoom);
            createCompassControl(mapInstance.current);
            createBaseLayerSwitcher(mapInstance.current, streetLayer, satelliteLayer);

            mapInstance.current.on('click moving moveend zooming zoomend pitch pitchend', (param) => {
                if (param) {
                    if (param.type === 'click') {
                        setCenterX(param.coordinate.x);
                        setCenterY(param.coordinate.y);
                    } else if (param.type === 'zooming' || param.type === 'zoomend') {
                        setZoom(param.to);
                    } else if (param.type === 'pitch' || param.type === 'pitchend') {
                        if (mapInstance.current) {
                            setPitch(mapInstance?.current?.getPitch());
                        }
                    }
                }
            });

        }
    }, []);

    const onCreate = async () => {
        if (!name || name === "") {
            alert("Nama skenario harus diisi");
            return;
        }

        try {
            const response = await axiosInstance.post(API_PATHS.SKENARIOS.CREATE,{
                name: name,
                center_x: centerX,
                center_y: centerY,
                zoom: zoom,
                pitch: pitch,
                max_zoom: config.maxZoom,
                operasi_id: operasiId,
            });
            if (response.data.data) {
                toast.success("Skenario Created");
                setTimeout(() => navigate(`/skenarios/${operasiId}`), 500)
            }
        } catch (error) {
            consoleErrorApi(error, "Skenario");
        }

    }

    const onTest = () => {
        if (mapInstance.current) {
            mapInstance.current.flyTo({
                zoom : zoom,
                center : [centerX, centerY],
                pitch : pitch,
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
    return (
        <MainLayout activeMenu="operasis">
            <div className="p-4">
                <AppBreadcum breadcums={breadcums}/>
                <div className="mt-4">
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="name">Nama Skenario</Label>
                        <Input type="text" id="name" placeholder="Isi Nama Skenario" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="w-full">
                            <Label htmlFor="centerX">Titik Tengah Latitude</Label>
                            <Input disabled type="text" id="centerX" placeholder="Latitude" value={centerX}  className="mt-2"/>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="centerY">Titik Tengah Longitude</Label>
                            <Input disabled type="text" id="centerY" placeholder="Longitude" value={centerY}  className="mt-2"/>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="zoom">Posisi Zoom</Label>
                            <Input disabled type="text" id="zoom" placeholder="Zoom" value={zoom}  className="mt-2"/>
                        </div>
                        <div className="w-full">
                            <Label htmlFor="pitch">Pitch</Label>
                            <Input disabled type="text" id="pitch" placeholder="Pitch" value={pitch}  className="mt-2"/>
                        </div>
                    </div>
                    <div className="flex items-center mt-2 gap-4">
                        <Button onClick={onCreate}>Create Skenario</Button>
                        <Button onClick={onTest}>Test</Button>
                    </div>
                    <p className="text-xs mt-2">Untuk mendapatkan titik tengah latitude, longitude klik kiri di peta, untuk mendapatkan zoom scrool mouse,
                        untuk mendapatkan pitch tinggal pakai tahan mouse kanan, untuk test posisi klik tombol Test, kalau sudah tinggal klik create skenario</p>
                </div>
                <div className="w-full h-[400px] mt-4">
                    <div ref={mapRef} className="h-full"></div>
                </div>

            </div>
        </MainLayout>
    );
};

export default SkenarioMapCreate;