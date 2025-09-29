import {OrbitControls, PerspectiveCamera, Stage, useGLTF} from "@react-three/drei";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {Canvas, useThree} from "@react-three/fiber";
import {type ReactNode, Suspense, useEffect, useState} from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {type IBaseModel, KENDARAANS, PEOPLES, STACKHOLDERS, TOOLS, UNITS} from "@/utils/items.ts";
import MainLayout from "@/layouts/MainLayout";
import {Home, PersonStanding} from "lucide-react";
import {DataTableUnit} from "@/pages/units/DataTableUnit.tsx";
import AppBreadcum from "@/components/AppBreadcum.tsx";

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

function BaseModel({url}: { url: string }) {
    const gltf = useGLTF(url);
    const model = gltf.scene;
    model.rotation.y = Math.PI / -2;
    return <primitive object={model}/>;

}

const DisposableCanvas = ({children}: {children: ReactNode}) => {
    const {gl} = useThree();
    useEffect(() => {
        return () => {
            gl.dispose();
        };
    }, [gl]);

    return <>{children}</>;
};

const UnitPage = () => {

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [modelUrl, setModelUrl] = useState("");
    const [units, setUnits] = useState<IBaseModel[]>(UNITS);
    const [unit, setUnit] = useState("unit");

    const classActive = "py-2 px-4 text-sm font-medium border-b-2 border-indigo-500 text-indigo-600 bg-white";
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
                            Unit Polisi
                        </button>

                        <button onClick={() => handleTabChange("stackholder")}
                            className={unit === "stackholder" ? classActive : classTab}>
                            Stack Holder
                        </button>

                        <button onClick={() => handleTabChange("ranmor")}
                            className={unit === "ranmor" ? classActive : classTab}>
                            Ranmor
                        </button>
                        <button onClick={() => handleTabChange("people")}
                            className={unit === "people" ? classActive : classTab}>
                            Masyarakat
                        </button>
                        <button onClick={() => handleTabChange("tool")}
                            className={unit === "tool" ? classActive : classTab}>
                            Perlengkapan
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