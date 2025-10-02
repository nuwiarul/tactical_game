import type {IBaseModel} from "@/utils/items.ts";
import {Button} from "@/components/ui/button.tsx";
import type {ColumnDef} from "@tanstack/react-table";
import {Trash} from "lucide-react";

export interface ColumUnitUserProps {
    onZoom: (modelUrl: string, name: string) => void,
    onRemove: (id: string) => void,
}

export const getColumnsUserUnit = ({onZoom, onRemove}: ColumUnitUserProps): ColumnDef<IBaseModel>[] => [
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
    {
        id: "action",
        header: () => <span className="font-bold text-[14px] flex items-center justify-center">Action</span>,
        cell: ({row}) => {
            return (
                <div className="flex items-center justify-center">
                    <Button className="cursor-pointer" variant="destructive" onClick={() => onRemove(row.original.id)}>
                        <Trash/>
                    </Button>
                </div>
            );
        },
    },
];