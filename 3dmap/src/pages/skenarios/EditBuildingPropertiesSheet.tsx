import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {Label} from "@/components/ui/label.tsx";
import {HexColorPicker} from "react-colorful";
import {Input} from "@/components/ui/input.tsx";
import {Slider} from "@/components/ui/slider.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {toast} from "sonner";
import {consoleErrorApi} from "@/helpers/logs.ts";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

interface EditBuildingPropertiesSheetProps {
    open: boolean;
    name: string;
    height: number;
    keterangan: string;
    color: string;
    id: string;
    close: () => void;
    setName: (value: string) => void;
    setHeight: (value: number) => void;
    setKeterangan: (value: string) => void;
    setColor: (value: string) => void;
    handlePropsChange?: (name: string, height: number, keterangan: string, color: string) => void;
}


const EditBuildingPropertiesSheet = (
    {
        open,
        name,
        height,
        color,
        keterangan,
        setKeterangan,
        setName,
        setHeight,
        setColor,
        close,
        id,
        handlePropsChange
    }: EditBuildingPropertiesSheetProps) => {

    const onUpdate = async () => {
        try {
            await axiosInstance.put(API_PATHS.BUILDINGS.UPDATE(id), {
                name: name,
                height: height,
                color: color,
                keterangan: keterangan,
            });
            toast.success("Properties berhasil diupdate");
            if (handlePropsChange) {
                handlePropsChange(name, height, keterangan, color);
            }
        } catch (error) {
            consoleErrorApi(error, "Update Properties");
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
                    <SheetTitle>Update Building</SheetTitle>
                    <SheetDescription></SheetDescription>
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
                            <Button onClick={onUpdate} className="cursor-pointer">Update</Button>
                            <Button onClick={close} className="cursor-pointer" variant="destructive">Cancel</Button>
                        </div>

                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default EditBuildingPropertiesSheet;