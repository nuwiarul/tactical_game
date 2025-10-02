import type {IAlur} from "@/helpers/type.data.ts";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import AlurList from "@/components/AlurList.tsx";

interface AlurSheetProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    rows: IAlur[];
}

const AlurSheet = ({open, rows, setOpen}: AlurSheetProps) => {

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Alur</SheetTitle>
                    <SheetDescription>
                        ini adalah untuk alur skenario
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="max-h-full">
                    <div className="p-4 mb-25 flex flex-col gap-2">
                        {rows.map((row) => (
                            <AlurList
                                key={row.id}
                                isEdit={false}
                                id={row.id}
                                alur={row.alur}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default AlurSheet;