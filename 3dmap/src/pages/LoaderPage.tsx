import {Spinner} from "@/components/ui/shadcn-io/spinner";


const UnAuthorized = () => {

    return (
        <div className="w-screen h-screen bg-background">
            <div className="flex items-center justify-center min-h-screen p-4">
                <Spinner size={64}/>
            </div>
        </div>
    );
};

export default UnAuthorized;