import MainLayout from "@/layouts/MainLayout.tsx";
import type {ColumnDef} from "@tanstack/react-table";
import type {IBaseModel} from "@/utils/items.ts";
import {Button} from "@/components/ui/button.tsx";
import {Suspense, useEffect, useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Canvas} from "@react-three/fiber";
import {BaseModel, DisposableCanvas} from "@/components/DisposableCanvas.tsx";
import {OrbitControls, PerspectiveCamera, Stage} from "@react-three/drei";
import {DataTableUnit} from "@/pages/units/DataTableUnit.tsx";
import {useIdentify} from "@/context/AuthProvider.tsx";

interface DashboardUserUnitProps {
    onZoom: (modelUrl: string, name: string) => void,
}

const getDashboardUserUnit = ({onZoom}: DashboardUserUnitProps): ColumnDef<IBaseModel>[] => [
    {
        accessorKey: "name",
        header: () => <span className="font-bold text-[14px] flex items-center justify-center">Unit Name</span>,
        cell: ({row}) => <div className="px-4">{row.original.name}</div>
    },
    {
        id: "model",
        header: () => <span className="font-bold text-[14px] flex items-center justify-center">Model</span>,
        cell: ({row}) => {
            return (
                <div className="flex items-center justify-center">
                    <Button className="cursor-zoom-in" onClick={() => onZoom(row.original.modelUrl, row.original.name)}>Lihat Model</Button>
                </div>
            );
        },
    },
];


const UserDashboard = () => {

    const user = useIdentify();

    const [units, setUnits] = useState<IBaseModel[]>([]);
    const [open, setOpen] = useState(false);
    const [modelUrl, setModelUrl] = useState("");
    const [unitName, setUnitName] = useState("");

    const handleZoom = (valUrl: string, valName: string) => {
        setOpen(true);
        setUnitName(valName);
        setModelUrl(valUrl);
    }



    const columns = getDashboardUserUnit({
        onZoom: handleZoom,
    });

    useEffect(() => {
        //console.log(user.user?.user);
        if (user) {
            setUnits(user.user?.user.units as IBaseModel[]);
        }

    }, []);

    return (
        <MainLayout activeMenu="dashboard">
            <div className="p-4">
                <DataTableUnit columns={columns} data={units || []}/>
            </div>
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

export default UserDashboard;