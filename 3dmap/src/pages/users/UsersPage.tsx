import type {ColumnDef} from "@tanstack/react-table";
import ActionUpdateDelete from "@/components/ActionUpdateDelete.tsx";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {useEffect, useState} from "react";
import {consoleErrorApi} from "@/helpers/logs.ts";
import AppBreadcum from "@/components/AppBreadcum.tsx";
import {Home, Layers2, Plus} from "lucide-react";
import {DataTable} from "@/components/DataTable.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";

export type IUserUnit = {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
};


const getColumns = (onDelete: (id: string) => void): ColumnDef<IUserUnit>[] => [
    {
        accessorKey: "name",
        header: "Nama"
    },
    {
        accessorKey: "username",
        header: "Username"
    },
    {
        id: "actions",
        cell: ({row}) => <ActionUpdateDelete href={`/users/update/${row.original.id}`} id={row.original.id}
                                             onDelete={onDelete}/>,
    }
];

const UsersPage = () => {

    const [rows, setRows] = useState<IUserUnit[]>([]);


    const getUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.LIST);
            if (response.data.data) {
                setRows(response.data.data);
            } else {
                setRows([]);
            }
        } catch (error) {
            consoleErrorApi(error, "List Users")
        }
    }

    useEffect(() => {
        getUsers();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await axiosInstance.delete(API_PATHS.USERS.DELETE(id));
            toast.success("User deleted");
            getUsers()
        } catch (error) {
            consoleErrorApi(error, "Users");
        }

    }

    const columns = getColumns(handleDelete);

    return (
        <MainLayout activeMenu="users">
            <div className="p-4">
                <AppBreadcum breadcums={[
                    {title: "Dashboard", href: "/admin", icon: Home},
                    {title: "Users", href: "#", icon: Layers2},
                ]}/>
                <div className="flex items-center justify-between mt-4">
                    <Link to="/users/create">
                        <Button className="cursor-pointer">
                            <Plus/>
                            New Users
                        </Button>
                    </Link>

                </div>
                <div className="mt-4 flex flex-col gap-4">
                    <DataTable columns={columns} data={rows || []}/>

                </div>
            </div>
        </MainLayout>
    );
};

export default UsersPage;