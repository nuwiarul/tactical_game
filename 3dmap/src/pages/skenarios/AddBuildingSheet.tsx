import type {IBuilding} from "@/helpers/type.data.ts";
import {useState} from "react";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {HexColorPicker} from "react-colorful";
import {Slider} from "@/components/ui/slider.tsx";
import {toast} from "sonner";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {consoleErrorApi} from "@/helpers/logs.ts";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

interface AddBuildingSheetProps {
    open: boolean;
    geom: string,
    skenarioId: string;
    operasiId: string;
    close: () => void;
    addBuilding: (building: IBuilding) => void;
}


const AddBuildingSheet = ({open, geom, skenarioId, operasiId, close, addBuilding}: AddBuildingSheetProps) => {

    const [height, setHeight] = useState(40);
    const [keterangan, setKeterangan] = useState("");
    const [name, setName] = useState("");
    const [color, setColor] = useState("#C2A68C");

    const onCreate = async () => {
        if (name === "") {
            toast.error("Nama tidak boleh kosong");
            return;
        }

        try {
            const response = await axiosInstance.post(API_PATHS.BUILDINGS.CREATE, {
                name: name,
                height: height,
                keterangan: keterangan,
                color: color,
                geom: geom,
                skenario_id: skenarioId,
                operasi_id: operasiId,
            });
            if (response.data.data) {
                toast.success("Building Created");
                addBuilding(response.data.data as IBuilding);
            }
        } catch (error) {
            consoleErrorApi(error, "Marker");
        }
    }

    const handleChangeColor = (value: string) => {
        setColor(value);

    }

    const handleChangeHeight = (value: number) => {
        setHeight(value);
    }

    return (
        <Sheet open={open}>
            <SheetContent className="[&>button:first-of-type]:hidden">
                <SheetHeader>
                    <SheetTitle>Add Building</SheetTitle>
                </SheetHeader>
                <ScrollArea className="max-h-full">
                    <div className="p-4 mb-25 flex flex-col gap-2">
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="warna">Warna</Label>
                            <HexColorPicker color={color} onChange={handleChangeColor} className="flex-1"/>
                        </div>
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="nama">Nama</Label>
                            <Input type="text" id="nama" value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="height">Tinggi</Label>
                            <Slider
                                defaultValue={[height]}
                                max={200}
                                step={1}
                                onValueChange={(value) => handleChangeHeight(value[0])}
                            />
                            <span className="text-xs">{height}</span>
                        </div>
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="keterangan">Keterangan</Label>
                            <Textarea onChange={(e) => setKeterangan(e.target.value)} value={keterangan}/>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={onCreate} className="cursor-pointer">Create</Button>
                            <Button onClick={close} className="cursor-pointer" variant="destructive">Cancel</Button>
                        </div>

                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default AddBuildingSheet;