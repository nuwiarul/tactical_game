import {Link, useParams} from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import type {ColumnDef} from "@tanstack/react-table";
import ActionUpdateDelete from "@/components/ActionUpdateDelete.tsx";
import {useQuery} from "@tanstack/react-query";
import {consoleErrorApi} from "@/helpers/logs.ts";
import MainLayout from "@/layouts/MainLayout.tsx";
import AppBreadcum, {type IBreadcum} from "@/components/AppBreadcum.tsx";
import {Home, Layers2, Plus} from "lucide-react";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {DataTable} from "@/components/DataTable.tsx";
import AppLoading from "@/components/AppLoading.tsx";
import AppError from "@/components/AppError.tsx";
import {useIdentify} from "@/context/AuthProvider.tsx";

type ISkenario = {
    id: string;
    name: string;
    operasi: {
        id: string;
        name: string;
        created_at: string;
        updated_at: string;
    };
    center_x: number;
    center_y: number;
    zoom: number;
    max_zoom: number;
    pitch: number;
    icon: string;
    created_at: string;
    updated_at: string;
};

const listSkenarios = async (operasiId: string) => {
    const res = await axiosInstance.get(API_PATHS.SKENARIOS.LIST(operasiId));
    return res.data;
}

const getColumnsAdmin = (onDelete: (id: string) => void): ColumnDef<ISkenario>[] => [
    {
        accessorKey: "name",
        header: "Nama Skenario"
    },
    {
        id: "actions",
        cell: ({row}) => <ActionUpdateDelete id={row.original.id}
                                             onDelete={onDelete} items={[{
            name: "Plot Skenario",
            href: `/skenarios/plot/${row.original.id}`
        }]}/>,
    }
];

const getColumns = (): ColumnDef<ISkenario>[] => [
    {
        accessorKey: "name",
        header: "Nama Skenario"
    },
    {
        id: "actions",
        cell: ({row}) => <ActionUpdateDelete id={row.original.id}
                                             items={[{
                                                 name: "Plot Skenario",
                                                 href: `/skenarios/plot/${row.original.id}`
                                             }]}/>,
    }
];

const SkenarioPage = () => {

    const user = useIdentify();

    const {operasiId} = useParams();
    const [breadcums, setBreadcums] = useState<IBreadcum[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);


    const getOperasi = async (id: string | undefined) => {
        try {
            const response = await axiosInstance.get(API_PATHS.OPERASIS.GET(id as string))
            if (response.data.data) {
                const operasiName = response.data.data.name as string;
                setBreadcums([
                    {title: "Dashboard", href: "/admin", icon: Home},
                    {title: "Operasis", href: "/operasis", icon: Layers2},
                    {title: operasiName, href: "#"},
                ]);
            }

        } catch (error) {
            consoleErrorApi(error, "Operasi");
        }

    }


    useEffect(() => {
        if (user) {
            if (user.user?.user.role === "admin") {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        }
        getOperasi(operasiId);
    }, []);


    const {isPending, error, data, refetch} = useQuery({
        queryKey: ["skenarios", operasiId],
        queryFn: () => listSkenarios(operasiId as string),

    });

    const handleDelete = async (id: string) => {
        try {
            await axiosInstance.delete(API_PATHS.SKENARIOS.DELETE(id));
            await refetch();
        } catch (error) {
            consoleErrorApi(error, "Skenario");
        }

    }

    const columnsAdmin = getColumnsAdmin(handleDelete);
    const columns = getColumns();

    const items: ISkenario[] = data?.data;


    return (
        <MainLayout activeMenu="operasis">
            <div className="p-4">
                <AppBreadcum breadcums={breadcums}/>

                <div className="flex items-center justify-between mt-4">
                    {isAdmin && (
                        <Link to={`/skenarios/create/${operasiId}`}>
                            <Button className="cursor-pointer">
                                <Plus/>
                                New Skenario
                            </Button>
                        </Link>
                    )}


                </div>
                {isPending ? <AppLoading/> : error ? <AppError error={error}/> : (
                    <div className="mt-4 flex flex-col gap-4">
                        <DataTable columns={isAdmin ? columnsAdmin : columns} data={items || []}/>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default SkenarioPage;