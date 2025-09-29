import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {toast} from "sonner";
import {consoleErrorApi} from "@/helpers/logs.ts";

interface EditPropertiesSheetProps {
    open: boolean;
    name: string;
    jumlah: number;
    keterangan: string;
    id: string;
    close: () => void;
    setName: (value: string) => void;
    setJumlah: (value: number) => void;
    setKeterangan: (value: string) => void;
    handlePropsChange?: (name: string, jumlah: number, keterangan: string) => void;
}

const EditPropertiesSheet = ({open, name, jumlah, keterangan, setKeterangan, setName, setJumlah , close, id,  handlePropsChange} : EditPropertiesSheetProps) => {


    const onUpdate = async () => {
        try {
            await axiosInstance.put(API_PATHS.MARKERS.UPDATE_NAME(id), {
                name: name,
                jumlah: jumlah,
                keterangan: keterangan,
            });
            toast.success("Properties berhasil diupdate");
            if (handlePropsChange) {
                handlePropsChange(name, jumlah, keterangan);
            }
        } catch (error) {
            consoleErrorApi(error, "Update Properties");
        }
    }

    return (
        <Sheet open={open} >
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="mb-4">Edit Properties</SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                </SheetHeader>
                <div className="p-4 -mt-10 flex flex-col gap-8">
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="nama">Nama</Label>
                        <Input type="text" id="nama" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="jumlah">Jumlah</Label>
                        <Input type="number" id="nama" value={jumlah} onChange={(e) => setJumlah(parseInt(e.target.value))} />
                    </div>
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="keterangan">Keterangan</Label>
                        <Textarea onChange={(e) => setKeterangan(e.target.value)} value={keterangan} />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={onUpdate}>Update</Button>
                        <Button onClick={close}>Close</Button>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
};

export default EditPropertiesSheet;