import {OrbitControls, PerspectiveCamera, Stage} from "@react-three/drei";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {Canvas} from "@react-three/fiber";
import {Suspense, useState} from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {BANGUNANS, type IBaseModel, KENDARAANS, PEOPLES, STACKHOLDERS, TOOLS, UNITS} from "@/utils/items.ts";
import MainLayout from "@/layouts/MainLayout";
import {
    Building2,
    Car,
    Home,
    PersonStanding,
    Siren,
    SquareUser,
    TrafficCone,
    Users
} from "lucide-react";
import {DataTableUnit} from "@/pages/units/DataTableUnit.tsx";
import AppBreadcum from "@/components/AppBreadcum.tsx";
import {BaseModel, DisposableCanvas} from "@/components/DisposableCanvas.tsx";

interface ColumUnitProps {
    onZoom: (modelUrl: string, name: string) => void,
}

const getColumns = ({onZoom}: ColumUnitProps): ColumnDef<IBaseModel>[] => [
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



const UnitPage = () => {

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [modelUrl, setModelUrl] = useState("");
    const [units, setUnits] = useState<IBaseModel[]>(UNITS);
    const [unit, setUnit] = useState("unit");

    const classActive = "py-2 px-4 text-sm font-medium border-b-2 border-indigo-500 text-indigo-600";
    const classTab = "py-2 px-4 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer";

    const handleZoom = (valUrl: string, valName: string) => {
        setOpen(true);
        setName(valName);
        setModelUrl(valUrl);
    }

    const columns = getColumns({
        onZoom: handleZoom,
    });

    const handleTabChange = (value: string) => {
        setUnit(value);
        if (value === "unit") {
            setUnits(UNITS);
        } else if (value === "stackholder") {
            setUnits(STACKHOLDERS);
        } else if (value === "ranmor") {
            setUnits(KENDARAANS);
        } else if (value === "people") {
            setUnits(PEOPLES);
        } else if (value === "tool") {
            setUnits(TOOLS);
        } else if (value === "bangunan") {
            setUnits(BANGUNANS);
        }
    }

    return (
        <MainLayout activeMenu="personels">

            <div className="p-4">
                <AppBreadcum breadcums={[
                    {title: "Dashboard", href: "/admin", icon: Home},
                    {title: "Units", href: "#", icon: PersonStanding},
                ]}/>

                <div className="mt-2">
                    <div className="flex border-b border-gray-200">
                        <button onClick={() => handleTabChange("unit")}
                            className={unit === "unit" ? classActive : classTab}>
                            <div className="flex items-center gap-1 justify-center">
                                <Siren/>
                                <span className="hidden lg:block">Unit</span>
                            </div>

                        </button>

                        <button onClick={() => handleTabChange("stackholder")}
                            className={unit === "stackholder" ? classActive : classTab}>
                            <div className="flex items-center gap-1 justify-center">
                                <SquareUser/>
                                <span className="hidden lg:block">Stack Holder</span>
                            </div>
                        </button>

                        <button onClick={() => handleTabChange("ranmor")}
                            className={unit === "ranmor" ? classActive : classTab}>
                            <div className="flex items-center gap-1 justify-center">
                                <Car/>
                                <span className="hidden lg:block">Ranmor</span>
                            </div>
                        </button>
                        <button onClick={() => handleTabChange("people")}
                            className={unit === "people" ? classActive : classTab}>
                            <div className="flex items-center gap-1 justify-center">
                                <Users/>
                                <span className="hidden lg:block">Masyarakat</span>
                            </div>
                        </button>
                        <button onClick={() => handleTabChange("tool")}
                            className={unit === "tool" ? classActive : classTab}>
                            <div className="flex items-center gap-1 justify-center">
                                <TrafficCone/>
                                <span className="hidden lg:block">Perlengkapan</span>
                            </div>
                        </button>
                        <button onClick={() => handleTabChange("bangunan")}
                                className={unit === "bangunan" ? classActive : classTab}>
                            <div className="flex items-center gap-1 justify-center">
                                <Building2/>
                                <span className="hidden lg:block">Bangunan</span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                    <DataTableUnit columns={columns} data={units || []}/>

                </div>

            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <DialogDescription className="font-semibold text-lg">
                            {name}
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

export default UnitPage;