import type {ColumnDef} from "@tanstack/react-table";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import ActionUpdateDelete from "@/components/ActionUpdateDelete";
import {useState} from "react";
import {PAGE_SIZE} from "@/utils/constants.ts";
import {useQuery} from "@tanstack/react-query";
import {consoleErrorApi} from "@/helpers/logs.ts";
import MainLayout from "@/layouts/MainLayout.tsx";
import AppBreadcum from "@/components/AppBreadcum.tsx";
import {Home, Layers2, Plus} from "lucide-react";
import InputSearch from "@/components/InputSearch.tsx";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import AppLoading from "@/components/AppLoading.tsx";
import AppError from "@/components/AppError.tsx";
import {DataTable} from "@/components/DataTable.tsx";
import DataTablePagination from "@/components/DataTablePagination.tsx";

type IOperasi = {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
};


const paginateOperasis = async ({pageSize, pageNumber, search}: {
    pageSize: number,
    pageNumber: number,
    search: string
}) => {
    const res = await axiosInstance.get(API_PATHS.OPERASIS.PAGINATE({pageSize, pageNumber, search}));
    return res.data;
}


const getColumns = (onDelete: (id: string) => void): ColumnDef<IOperasi>[] => [
    {
        accessorKey: "name",
        header: "Nama Operasi"
    },
    {
        id: "actions",
        cell: ({row}) => <ActionUpdateDelete href={`/operasis/update/${row.original.id}`} id={row.original.id}
                                             onDelete={onDelete} name="Operasi" items={[
            {name: "Skenarios", href: `/skenarios/${row.original.id}`},
        ]}/>,
    }
];

const OperasiPage = () => {

    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [search, setSearch] = useState("");


    const {isPending, error, data, refetch} = useQuery({
        queryKey: ["operasis", pageSize, pageNumber, search],
        queryFn: () => paginateOperasis({pageSize, pageNumber, search}),

    });

    const handleDelete = async (id: string) => {
        try {
            await axiosInstance.delete(API_PATHS.OPERASIS.DELETE(id));
            await refetch();
        } catch (error) {
            consoleErrorApi(error, "Operasi");
        }

    }

    const columns = getColumns(handleDelete);

    const items: IOperasi[] = data?.data;
    const totalPage: number = Math.floor((data?.total + pageSize - 1) / pageSize) || 1;

    return (
        <MainLayout activeMenu="operasis">
            <div className="p-4">
                <AppBreadcum breadcums={[
                    {title: "Dashboard", href: "/admin", icon: Home},
                    {title: "Operasis", href: "#", icon: Layers2},
                ]}/>
                <div className="flex items-center justify-between mt-4">
                    <InputSearch setSearch={setSearch}/>
                    <Link to="/operasis/create">
                        <Button className="cursor-pointer">
                            <Plus/>
                            New
                        </Button>
                    </Link>

                </div>

                {isPending ? <AppLoading/> : error ? <AppError error={error}/> : (
                    <div className="mt-4 flex flex-col gap-4">
                        <DataTable columns={columns} data={items || []}/>
                        <DataTablePagination
                            pageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            totalPage={totalPage}
                        />
                    </div>
                )}

            </div>
        </MainLayout>
    );
};

export default OperasiPage;