import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {type IBaseModel, KENDARAANS, PEOPLES, STACKHOLDERS, TOOLS, UNITS} from "@/utils/items.ts";
import {Select, SelectContent, SelectItem, SelectValue} from "@/components/ui/select";
import {SelectTrigger} from "@/components/ui/select.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {consoleErrorApi} from "@/helpers/logs.ts";
import type {IUnit} from "@/helpers/type.data.ts";
import {toast} from "sonner";

interface AddUnitSheetProps {
    open: boolean;
    posX: number;
    posY: number;
    skenarioId: string;
    operasiId: string;
    close: () => void;
    addUnit: (unit: IUnit) => void;
}

const AddUnitSheet = ({open, posX, posY, skenarioId, operasiId, close, addUnit} : AddUnitSheetProps) => {

    const [units, setUnits] = useState<IBaseModel[]>([]);
    const [unit, setUnit] = useState<IBaseModel>();
    const [name, setName] = useState("");
    const [jumlah, setJumlah] = useState(1);
    const [keterangan, setKeterangan] = useState("");
    const [kategori, setKategori] = useState("");



    const onCreate = async () => {
        if (!unit) {
            alert("Pilih Unit");
            return;
        }

        if (jumlah == 0) {
            alert("Jumlah harus lebih dari 0");
            return;
        }

        if (name === "") {
            alert("Nama tidak boleh kosong");
            return;
        }

        try {
            const response = await axiosInstance.post(API_PATHS.MARKERS.CREATE,{
                name: name,
                jumlah: parseInt(jumlah.toString()),
                keterangan: keterangan,
                kategori: kategori,
                unit_id: unit.id,
                pos_x: posX,
                pos_y: posY,
                rot_x: unit.rotation.x,
                rot_y: unit.rotation.y,
                rot_z: unit.rotation.z,
                skenario_id: skenarioId,
                operasi_id: operasiId,
            });
            if (response.data.data) {
                toast.success("Marker Created");
                addUnit(response.data.data as IUnit);
            }
        } catch (error) {
            consoleErrorApi(error, "Marker");
        }
    }

    const onKategoriChange = (value: string) => {
        console.log(value);
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
        }

        setKategori(value);
    }

    const onUnitChange = (value: string) => {
        for (let i = 0; i < units.length; i++) {
            const item = units[i];
            if (item.id === value) {
                setUnit(item);
                setName(item.name);
                break;
            }
        }
    }

    return (
        <Sheet open={open} >
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="mb-4">Add Unit</SheetTitle>
                    <SheetDescription>
                    </SheetDescription>
                </SheetHeader>
                <div className="p-4 -mt-10 flex flex-col gap-8">
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="pos_x">Latitude</Label>
                        <Input disabled type="text" id="pos_x" value={posX} />
                    </div>
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="pos_y">Longitude</Label>
                        <Input disabled type="text" id="pos_y" value={posY} />
                    </div>
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="kategori">Kategori</Label>
                        <Select onValueChange={onKategoriChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pilih Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unit">Unit Polisi</SelectItem>
                                <SelectItem value="stackholder">Unit Stack Holder</SelectItem>
                                <SelectItem value="ranmor">Kendaran Bermotor</SelectItem>
                                <SelectItem value="people">Masyarakat</SelectItem>
                                <SelectItem value="alat">Peralatan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="unit">Unit</Label>
                        <Select onValueChange={onUnitChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pilih Unit" />
                            </SelectTrigger>
                            <SelectContent>
                                {units.map((unit) => (
                                    <SelectItem key={unit?.id} value={unit?.id}>{unit?.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="nama">Nama</Label>
                        <Input type="text" id="nama" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="jumlah">Jumlah</Label>
                        <Input type="number" id="nama" value={jumlah} onChange={(e) => setJumlah(parseInt(e.target.value))} />
                    </div>
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="keterangan">Keterangan</Label>
                        <Textarea onChange={(e) => setKeterangan(e.target.value)} value={keterangan} />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={onCreate}>Create</Button>
                        <Button onClick={close}>Close</Button>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
};

export default AddUnitSheet;