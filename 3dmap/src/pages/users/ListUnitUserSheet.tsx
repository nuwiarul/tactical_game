import {BANGUNANS, type IBaseModel, KENDARAANS, PEOPLES, STACKHOLDERS, TOOLS, UNITS} from "@/utils/items.ts";
import {useState} from "react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";

interface ListUnitUserSheetProps {
    open: boolean;
    close: () => void;
    addUnit: (unit: IBaseModel) => void;
}

const ListUnitUserSheet = ({open, close, addUnit}: ListUnitUserSheetProps) => {

    const [units, setUnits] = useState<IBaseModel[]>([]);
    const [unit, setUnit] = useState<IBaseModel>();

    const onKategoriChange = (value: string) => {

        if (value === 'unit') {
            setUnits(UNITS);
        } else if (value === 'stackholder') {
            setUnits(STACKHOLDERS);
        } else if (value === 'ranmor') {
            setUnits(KENDARAANS);
        } else if (value === 'people') {
            setUnits(PEOPLES);
        } else if (value === 'alat') {
            setUnits(TOOLS);
        } else if (value === 'bangunan') {
            setUnits(BANGUNANS);
        }
    }

    const onUnitChange = (value: string) => {
        for (let i = 0; i < units.length; i++) {
            const item = units[i];
            if (item.id === value) {
                setUnit(item);
                break;
            }
        }
    }

    const onAdd = () => {
        if (unit) {
            addUnit(unit);
        }
    }

    return (
        <Sheet open={open}>
            <SheetContent className="[&>button:first-of-type]:hidden">
                <SheetHeader>
                    <SheetTitle>Add Unit</SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <ScrollArea className="max-h-full">
                    <div className="p-4 mb-25 flex flex-col gap-2">
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="kategori">Kategori</Label>
                            <Select onValueChange={onKategoriChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Pilih Kategori"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unit">Unit Polisi</SelectItem>
                                    <SelectItem value="stackholder">Unit Stack Holder</SelectItem>
                                    <SelectItem value="ranmor">Kendaran Bermotor</SelectItem>
                                    <SelectItem value="people">Masyarakat</SelectItem>
                                    <SelectItem value="alat">Peralatan</SelectItem>
                                    <SelectItem value="bangunan">Bangunan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid w-full items-center gap-3">
                            <Label htmlFor="unit">Unit</Label>
                            <Select onValueChange={onUnitChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Pilih Unit"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map((unit) => (
                                        <SelectItem key={unit?.id} value={unit?.id}>{unit?.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={onAdd} className="cursor-pointer">Tambah</Button>
                            <Button onClick={close} variant="destructive" className="cursor-pointer">Cancel</Button>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

export default ListUnitUserSheet;