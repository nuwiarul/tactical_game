import AppBreadcum from "@/components/AppBreadcum.tsx";
import {Home, Layers2,} from "lucide-react";
import MainLayout from "@/layouts/MainLayout.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Suspense, useEffect, useState} from "react";
import type {IBaseModel} from "@/utils/items.ts";
import {Button} from "@/components/ui/button.tsx";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Canvas} from "@react-three/fiber";
import {BaseModel, DisposableCanvas} from "@/components/DisposableCanvas.tsx";
import {OrbitControls, PerspectiveCamera, Stage} from "@react-three/drei";
import {DataTableUnit} from "@/pages/units/DataTableUnit.tsx";
import ListUnitUserSheet from "@/pages/users/ListUnitUserSheet.tsx";
import {getColumnsUserUnit} from "@/pages/users/colums.tsx";
import {toast} from "sonner";
import {consoleErrorApi} from "@/helpers/logs.ts";
import {useNavigate, useParams} from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";



const UsersUpdate = () => {

    const {id} = useParams();
    

    const [units, setUnits] = useState<IBaseModel[]>([]);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [modelUrl, setModelUrl] = useState("");
    const [unitName, setUnitName] = useState("");
    const [openAddUnit, setOpenAddUnit] = useState(false);

    const navigate = useNavigate();

    const handleZoom = (valUrl: string, valName: string) => {
        setOpen(true);
        setUnitName(valName);
        setModelUrl(valUrl);
    }

    const handleRemove = (id: string) => {
        const updatedUnits = units.filter(unit => unit.id !== id);
        setUnits(updatedUnits);
    }

    const columns = getColumnsUserUnit({
        onZoom: handleZoom,
        onRemove: handleRemove,
    });

    const onCreate = async () => {
        if(name === "") {
            toast.error("Name is required");
            return;
        }


        if (units.length === 0) {
            toast.error("Unit belum di tambahkan");
            return;
        }


        try {
            const response = await axiosInstance.put(API_PATHS.USERS.UPDATE(id as string),{
                name: name,
                units: JSON.stringify(units),
            });
            if (response.data.data) {
                toast.success("User berhasil di update");
                navigate("/users");
            }
        } catch (error) {
            consoleErrorApi(error, "User Update")
        }
    }
    


    const onAddUnit = (valUnit: IBaseModel) => {

        if (valUnit) {
            if (!unitExist(valUnit.id)) {
                setUnits((prevState) => [...prevState, valUnit]);
            }
        }

        setOpenAddUnit(false);
    }

    const unitExist = (id: string) => {
        for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            if (unit.id === id) {
                return true;
            }
        }

        return false;
    }

    const getUser = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET(id as string));
            if (response.data.data) {
                setName(response.data.data.name);
                setUnits(JSON.parse(response.data.data.units));
            } else {
                toast.error("User doesn;t exist");
            }
        } catch (error) {
            consoleErrorApi(error, "User does not exist");
        }
    }

    useEffect(() => {
        getUser()
    }, []);


    return (
        <MainLayout activeMenu="users">
            <div className="p-4">
                <AppBreadcum breadcums={[
                    {title: "Dashboard", href: "/admin", icon: Home},
                    {title: "Users", href: "/users", icon: Layers2},
                    {title: "Update", href: "#"},
                ]}/>
                <div className="mt-4 flex flex-col gap-2">
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="nama">Nama</Label>
                        <Input type="text" id="nama" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={onCreate} className="cursor-pointer">Update</Button>
                    </div>
                </div>
                <div className="flex items-center justify-end mt-2 mb-2">
                    <Button onClick={() => setOpenAddUnit(true)} className="cursor-pointer">Tambah Units</Button>
                </div>
                <DataTableUnit columns={columns} data={units || []}/>
            </div>
            <ListUnitUserSheet open={openAddUnit} close={() => setOpenAddUnit(false)} addUnit={onAddUnit} />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription className="font-semibold text-lg">
                            {unitName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="w-full h-150 flex items-center justify-center bg-gray-100 rounded-lg p-1">
                        <Canvas>
                            <Suspense fallback="loading...">
                                <DisposableCanvas>
                                    <Stage environment="studio" intensity={0.5}>
                                        <BaseModel url={modelUrl!}/>
                                    </Stage>
                                    <OrbitControls enableZoom={false} autoRotate/>
                                    <PerspectiveCamera position={[-1, 0, 1.8]} zoom={1} makeDefault/>
                                </DisposableCanvas>
                            </Suspense>
                        </Canvas>
                    </div>


                </DialogContent>
            </Dialog>
        </MainLayout>
    );
};

export default UsersUpdate;