import {BrushCleaning, Search, SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";


interface InputSearchProps {
    setSearch: (search: string) => void
}
const InputSearch = ({setSearch} : InputSearchProps) => {

    const [text, setText] = useState("");
    
    return (
        <div className="flex items-center justify-center gap-0">
            <div className="relative">
                <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search"
                    value={text}
                    onChange={(e) => {
                        if (e.target.value !== "") {
                            setText(e.target.value)
                        } else {
                            setText(e.target.value)
                            setSearch(e.target.value);
                        }

                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setSearch(text);
                        }
                    }}
                    className="pl-8 rounded-l-md rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>
            <Button
                className={cn(text && "rounded-l-none rounded-r-none", !text && "rounded-l-none rounded-r-lg")}
                onClick={() => setSearch(text)}
            >
                <Search />
            </Button>
            {text && (
                <Button variant="destructive" onClick={() => {
                    setText("");
                    setSearch("");
                }}
                        className="rounded-l-none rounded-r-lg"
                >
                    <BrushCleaning/>
                </Button>
            )}
        </div>
    );
};

export default InputSearch;