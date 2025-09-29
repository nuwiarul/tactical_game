import type {IHomeOperasi} from "@/pages/home/ListOperasi.tsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {Button} from "@/components/ui/button.tsx";


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
                <div className="p-4 -mt-10 flex flex-col gap-8">
                    {operasi ? operasi.skenario.map(item => (
                        <Button key={item.skenario_id} onClick={() => handleSkenarioChange(item.skenario_id)}>{item.name}</Button>
                    )) : (<></>)}

                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ListSkenarioSheet;