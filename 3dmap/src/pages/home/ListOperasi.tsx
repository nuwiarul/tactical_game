import PublicLayout from "@/layouts/PublicLayout.tsx";
import {useEffect, useState} from "react";
import {Card} from "@/components/ui/card.tsx";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {Link} from "react-router-dom";

export interface IHomeOperasi {
    name: string;
    operasi_id: string;
    skenario: {
        skenario_id: string;
        name: string;
    }[];
}

const ListOperasi = () => {

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
        <PublicLayout>
            <div className="w-screen h-full p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {rows.map((row) => (
                        <Card key={row.operasi_id} className="p-4 hover:scale-[1.02] transition">
                            <h3 className="text-lg font-semibold mb-2">{row.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {row.skenario.map((skenario) => (
                                    <Link key={skenario.skenario_id} to={`/preview/${row.operasi_id}/${skenario.skenario_id}`} className="cursor-pointer border px-2 py-1 rounded-lg">
                                        {skenario.name}
                                    </Link>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
};

export default ListOperasi;