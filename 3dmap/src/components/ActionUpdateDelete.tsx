import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Edit2Icon, Trash} from "lucide-react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog.tsx";
import {Link} from "react-router-dom";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

interface ActionChildsProps {
    name?: string,
    href?: string,
}

interface ActionDeleteProps {
    title?: string,
    content?: string,
    href?: string,
    name?: string,
    id: string,
    items?: ActionChildsProps[],
    onDelete?: (id: string) => void
}

const ActionUpdateDelete = ({
                                title = "Are you absolutely sure?",
                                content = "This action cannot be undone. This will permanently delete this data.",
                                href,
                                name,
                                id,
                                onDelete,
                                items,
                            }: ActionDeleteProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="flex items-center justify-end gap-2">
            {href && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link to={`${href}`}>
                            <Button className="w-8 h-8 cursor-pointer">
                                <Edit2Icon/>
                            </Button>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        Edit {name}
                    </TooltipContent>
                </Tooltip>
            )}
            {items && items.map((item, i) => {
                return (
                    <Tooltip key={i}>
                        <TooltipTrigger asChild>
                            <Link to={`${item.href}`}>
                                <Button className="cursor-pointer">
                                    {item.name}
                                </Button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            {item.name}
                        </TooltipContent>
                    </Tooltip>
                );
            })}
            {onDelete && (
                <>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="destructive" className="w-8 h-8 cursor-pointer" onClick={() => setIsOpen(true)}>
                                <Trash/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Remove {name}
                        </TooltipContent>
                    </Tooltip>
                    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{title}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {content}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="cursor-pointer bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                                    onClick={() => {
                                        setIsOpen(false);
                                        onDelete(id);
                                    }}>Yes</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )}

        </div>
    )
}

export default ActionUpdateDelete;