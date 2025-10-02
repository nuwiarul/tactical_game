import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {useEffect, useState} from "react";
import type {IAlur} from "@/helpers/type.data.ts";
import {consoleErrorApi} from "@/helpers/logs.ts";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";
import AlurList from "@/components/AlurList.tsx";

interface AddAlurSheetProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    skenarioId: string;
    operasiId: string;
}


const AddAlurSheet = ({open, skenarioId, operasiId, setOpen}: AddAlurSheetProps) => {

    const [rows, setRows] = useState<IAlur[]>([]);
    const [alur, setAlur] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [id, setId] = useState("");

    const getAlurs = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.ALURS.LIST(skenarioId));
            console.log(response.data.data);
            if (response.data.data) {

                setRows(response.data.data)
            } else {
                setRows([]);
            }
        } catch (error) {
            consoleErrorApi(error, "Tambah alur")
        }
    }

    const onSave = async () => {

        if (alur === "") {
            toast.error("Alur harus di isi");
            return
        }

        let response;
        if (isEdit) {
            if (id) {
                try {
                    response = await axiosInstance.put(API_PATHS.ALURS.UPDATE(id), {
                        alur: alur
                    });
                    if (response.data.data) {
                        toast.success("Alur berhasil di update");
                        reset();
                    }
                } catch (error) {
                    consoleErrorApi(error, "Update alur")
                }
            } else {
                toast.error("Anda belum menklik tombol edit");
            }

        } else {
            try {
                response = await axiosInstance.post(API_PATHS.ALURS.CREATE, {
                    alur: alur,
                    operasi_id: operasiId,
                    skenario_id: skenarioId,
                });
                if (response.data.data) {
                    toast.success("Alur berhasil di buat");
                    reset();
                }
            } catch (error) {
                consoleErrorApi(error, "Create alur")
            }
        }
    }

    const reset = () => {
        setId("")
        setIsEdit(false);
        setAlur("");
        getAlurs();
    }

    const onDelete = async (id: string) => {
        if (confirm("Are you sure remove alur?")) {
            try {
                await axiosInstance.delete(API_PATHS.ALURS.DELETE(id));
                toast.success("Alur berhasil di remove");
                reset();
            } catch (error) {
                consoleErrorApi(error, "Remove alur")
            }
        }
    }


    useEffect(() => {
        getAlurs();
    }, [])


    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Alur</SheetTitle>
                    <SheetDescription>
                        ini adalah untuk alur skenario
                    </SheetDescription>
                </SheetHeader>
                <div className="p-4 flex flex-col gap-2">
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="alur">Alur</Label>
                        <Textarea onChange={(e) => setAlur(e.target.value)} value={alur}/>
                    </div>
                    <Button onClick={onSave} className="cursor-pointer mt-2">{isEdit ? "Update" : "Create"}</Button>
                </div>
                <ScrollArea className="max-h-full">
                    <div className="p-4 mb-75 flex flex-col gap-2">
                        {rows.map((row) => (
                            <AlurList
                                key={row.id}
                                isEdit={true}
                                id={row.id}
                                alur={row.alur}
                                edit={(id: string, value: string) => {
                                    setId(id);
                                    setAlur(value);
                                    setIsEdit(true);
                                }}
                                remove={(id: string) => {onDelete(id)}}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default AddAlurSheet;