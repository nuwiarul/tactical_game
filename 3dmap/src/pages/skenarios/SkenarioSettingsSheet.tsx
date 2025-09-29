import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {toast} from "sonner";
import {consoleErrorApi} from "@/helpers/logs.ts";

interface SkenarioSettingsSheetProps {
    open: boolean;
    centerX: number;
    centerY: number;
    zoom: number;
    pitch: number;
    id: string;
    close: () => void;
}

const SkenarioSettingsSheet = ({open, centerX, centerY, zoom, pitch, id, close} : SkenarioSettingsSheetProps) => {


    const onUpdate = async () => {
        try {
            const response = await axiosInstance.put(API_PATHS.SKENARIOS.UPDATE(id),{
                center_x: centerX,
                center_y: centerY,
                zoom: zoom,
                pitch: pitch,
            });
            if (response.data.data) {
                toast.success("Map Updated");
                close();
            }
        } catch (error) {
            consoleErrorApi(error, "Skenario");
        }
    }



    return (
        <Sheet open={open} >
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="mb-4">Map Settings</SheetTitle>
                    <SheetDescription>

                    </SheetDescription>
                </SheetHeader>
                <div className="p-4 -mt-10 flex flex-col gap-8">
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="center_x">Titik Tengah Latitude</Label>
                        <Input disabled type="text" id="center_x" value={centerX} />
                    </div>
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="center_y">Titik Tengah Longitude</Label>
                        <Input disabled type="text" id="center_y" value={centerY} />
                    </div>
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="zoom">Zoom</Label>
                        <Input disabled type="text" id="zoom" value={zoom} />
                    </div>
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="pitch">Pitch</Label>
                        <Input disabled type="text" id="pitch" value={pitch} />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={onUpdate}>Save</Button>
                        <Button onClick={close}>Close</Button>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
};

export default SkenarioSettingsSheet;