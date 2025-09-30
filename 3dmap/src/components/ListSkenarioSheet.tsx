import type {IHomeOperasi} from "@/pages/home/ListOperasi.tsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ScrollArea} from "./ui/scroll-area";

interface ListSkenarioSheetProps {
    open: boolean;
    operasi: IHomeOperasi | null;
    setOpen: (open: boolean) => void;
    handleSkenarioChange: (skenario_id: string) => void;
}

const ListSkenarioSheet = ({open, operasi, setOpen, handleSkenarioChange}: ListSkenarioSheetProps) => {
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="mb-4">List Skenario</SheetTitle>
                    <SheetDescription>

                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="max-h-full">
                    <div className="p-4 flex flex-col gap-2">
                        {operasi ? operasi.skenario.map(item => (
                            <Button key={item.skenario_id}
                                    onClick={() => handleSkenarioChange(item.skenario_id)}>{item.name}</Button>
                        )) : (<></>)}

                    </div>

                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default ListSkenarioSheet;