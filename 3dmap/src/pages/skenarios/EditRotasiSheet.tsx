import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {toast} from "sonner";
import {consoleErrorApi} from "@/helpers/logs.ts";
import {Slider} from "@/components/ui/slider.tsx";

interface EditRotasiSheetProps {
    open: boolean;
    rotasi: number;
    setRotasi: (value: number) => void;
    id: string;
    handleRotasiChange: (value: number) => void;
    close: () => void;
}

const EditRotasiSheet = ({open, rotasi, setRotasi, close, id, handleRotasiChange}: EditRotasiSheetProps) => {
    const onUpdate = async () => {
        try {
            await axiosInstance.put(API_PATHS.MARKERS.UPDATE_ROTASI(id), {
                rotasi: rotasi,
            });
            toast.success("Scale berhasil diupdate");
            handleRotasiChange(rotasi);
            //close();
        } catch (error) {
            consoleErrorApi(error, "Update Geom");
        }
    }

    return (
        <Sheet open={open}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="mb-4">Edit Rotasi</SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="max-h-full">
                    <div className="p-4 mb-25 flex flex-col gap-8">
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="rotasi">Rotasi</Label>
                            <Slider
                                defaultValue={[rotasi]}
                                max={360}
                                min={0}
                                step={1}
                                onValueChange={(value) => setRotasi(value[0])}
                            />
                            <span className="text-xs">{rotasi}</span>
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

export default EditRotasiSheet;