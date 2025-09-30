import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {consoleErrorApi} from "@/helpers/logs.ts";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {toast} from "sonner";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

interface EditGeomSheetProps {
    open: boolean;
    posX: number;
    posY: number;
    rotX: number;
    rotY: number;
    rotZ: number;
    id: string;
    close: () => void;
}

const EditGeomSheet = ({open, posX, posY, rotX, rotY, rotZ, close, id}: EditGeomSheetProps) => {

    const onUpdate = async () => {
        try {
            await axiosInstance.put(API_PATHS.MARKERS.UPDATE_GEOM(id), {
                pos_x: posX,
                pos_y: posY,
                rot_x: rotX,
                rot_y: rotY,
                rot_z: rotZ,
            });
            toast.success("Rotasi & Posisi berhasil diupdate");
            close();
        } catch (error) {
            consoleErrorApi(error, "Update Geom");
        }
    }
    return (
        <Sheet open={open}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="mb-4">Edit Posisi & Rotasi</SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="max-h-full">
                    <div className="p-4 mb-25 flex flex-col gap-8">
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="pos_x">Latitude</Label>
                            <Input disabled type="text" id="pos_x" value={posX}/>
                        </div>
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="pos_y">Longitude</Label>
                            <Input disabled type="text" id="pos_y" value={posY}/>
                        </div>
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="rot_x">Rotasi X</Label>
                            <Input disabled type="text" id="rot_x" value={rotX}/>
                        </div>
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="rot_y">Rotasi Y</Label>
                            <Input disabled type="text" id="rot_y" value={rotY}/>
                        </div>
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="rot_z">Rotasi Z</Label>
                            <Input disabled type="text" id="rot_z" value={rotZ}/>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={onUpdate}>Update</Button>
                            <Button onClick={close}>Close</Button>
                        </div>

                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default EditGeomSheet;