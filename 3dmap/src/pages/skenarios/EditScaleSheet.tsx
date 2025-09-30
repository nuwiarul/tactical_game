import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {toast} from "sonner";
import {consoleErrorApi} from "@/helpers/logs.ts";
import {Slider} from "@/components/ui/slider.tsx";

interface EditScaleSheetProps {
    open: boolean;
    scale: number;
    setScale: (value: number) => void;
    id: string;
    handleScaleChange: (value: number) => void;
    close: () => void;
}

const EditScaleSheet = ({open, scale, setScale, close, id, handleScaleChange}: EditScaleSheetProps) => {
    const onUpdate = async () => {
        try {
            await axiosInstance.put(API_PATHS.MARKERS.UPDATE_SCALE(id), {
                scale: scale,
            });
            toast.success("Scale berhasil diupdate");
            handleScaleChange(scale);
            //close();
        } catch (error) {
            consoleErrorApi(error, "Update Geom");
        }
    }

    return (
        <Sheet open={open}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="mb-4">Edit Scale</SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="max-h-full">
                    <div className="p-4 mb-25 flex flex-col gap-8">
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="scale">Scale</Label>
                            <Slider
                                defaultValue={[scale]}
                                max={4}
                                min={0.2}
                                step={0.05}
                                onValueChange={(value) => setScale(value[0])}
                            />
                            <span className="text-xs">{scale}</span>
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

export default EditScaleSheet;