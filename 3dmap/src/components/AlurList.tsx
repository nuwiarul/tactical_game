import {Card} from "@/components/ui/card.tsx";
import {Edit2Icon, Trash} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

interface AlurListProps {
    isEdit: boolean,
    edit?: (id: string, value: string) => void,
    remove?: (id: string) => void,
    id: string,
    alur: string
}

const AlurList = ({isEdit, edit, remove, id, alur}: AlurListProps) => {

    const empty = () => {
        console.log("empty");
    }

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between gap-4">
                <label htmlFor={id} className="text-sm text-muted-foreground">{alur}</label>
                {isEdit ? (
                    <div className="flex items-center gap-2">
                        <Button className="w-8 h-8 cursor-pointer" onClick={() => edit ? edit(id, alur) : empty()}>
                            <Edit2Icon/>
                        </Button>
                        <Button variant="destructive" className="w-8 h-8 cursor-pointer" onClick={() => remove ? remove(id) : empty()}>
                            <Trash/>
                        </Button>
                    </div>
                ) : (<></>)}

            </div>
        </Card>
    );
};

export default AlurList;