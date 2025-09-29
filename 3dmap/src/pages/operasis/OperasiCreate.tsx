import MainLayout from "@/layouts/MainLayout.tsx";
import AppBreadcum from "@/components/AppBreadcum.tsx";
import {Home, Layers2} from "lucide-react";
import OperasiForm from "@/pages/operasis/OperasiForm.tsx";

const OperasiCreate = () => {
    return (
        <MainLayout activeMenu="operasis">
            <div className="p-4">
                <AppBreadcum breadcums={[
                    {title: "Dashboard", href: "/admin", icon: Home},
                    {title: "Operasis", href: "/operasis", icon: Layers2},
                    {title: "Create", href: "#"},
                ]}/>
                <OperasiForm/>
            </div>
        </MainLayout>
    );
};

export default OperasiCreate;