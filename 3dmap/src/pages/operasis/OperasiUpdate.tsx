import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import AppLoading from "@/components/AppLoading.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";
import AppBreadcum from "@/components/AppBreadcum";
import {Home, Layers2} from "lucide-react";
import AppError from "@/components/AppError.tsx";
import OperasiForm from "@/pages/operasis/OperasiForm.tsx";

const getOperasi = async (id: string) => {
    const response = await axiosInstance.get(API_PATHS.OPERASIS.GET(id))
    return response.data.data;
}

const OperasiUpdate = () => {

    const {id} = useParams();

    const {isPending, error, data} = useQuery({
        queryKey: ["operasis/update", id],
        queryFn: () => getOperasi(id || ""),
    })

    return (
        <MainLayout activeMenu="operasis">
            <div className="p-4">
                <AppBreadcum breadcums={[
                    {title: "Dashboard", href: "/admin", icon: Home},
                    {title: "Operasis", href: "/operasis", icon: Layers2},
                    {title: "Update", href: "#"},
                ]}/>
                {isPending ? <AppLoading/> : error ? <AppError error={error}/> : (
                    <OperasiForm name={data.name} id={id}/>
                )}
            </div>

        </MainLayout>
    );
};

export default OperasiUpdate;