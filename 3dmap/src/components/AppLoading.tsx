import {Spinner} from "@/components/ui/shadcn-io/spinner";

const AppLoading = () => {
    return (

            <div className="flex items-center justify-center w-full h-[400px]">
                <Spinner size={32}/>
            </div>

    );
};

export default AppLoading;