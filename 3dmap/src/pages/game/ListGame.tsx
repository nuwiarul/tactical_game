import {useEffect, useState} from "react";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import type {IHomeOperasi} from "@/pages/home/ListOperasi.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Link} from "react-router-dom";
import {Home, Joystick, Map} from "lucide-react";
import AppBreadcum from "@/components/AppBreadcum.tsx";

const ListGame = ({isRecord} : {isRecord: number}) => {

    const [rows, setRows] = useState<IHomeOperasi[]>([]);


    const getHomeOperasis = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.OPERASIS.HOME);
            setRows(response.data.data);
        } catch (error) {
            console.error("Failed to fetch operasis:", error);
        }
    }

    useEffect(() => {
        getHomeOperasis()
    }, []);

    return (
        <MainLayout activeMenu={isRecord ? "games" : "latihans"}>
            <div className="p-4">
                <AppBreadcum breadcums={[
                    {title: "Dashboard", href: "/admin", icon: Home},
                    {title: isRecord ? "Tactical Games" : "Latihan", href: "#", icon: isRecord ? Map : Joystick},
                ]}/>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {rows.map((row) => (
                        <Card key={row.operasi_id} className="p-4 hover:scale-[1.02] transition">
                            <h3 className="text-lg font-semibold mb-2">{row.name}</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {row.skenario.map((skenario) => (
                                    <Link key={skenario.skenario_id} to={`/${isRecord ? "game" : "latihan"}/${row.operasi_id}/${skenario.skenario_id}`} className="cursor-pointer border px-2 py-1 rounded-lg">
                                        {skenario.name}
                                    </Link>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
};

export default ListGame;