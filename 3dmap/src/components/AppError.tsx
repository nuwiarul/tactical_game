import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {OctagonAlertIcon} from "lucide-react";

const AppError = ({error}: { error: Error | null }) => {
    return (

            <div className="w-[400px] mx-auto mt-10">
                {error && (
                    <Alert variant="destructive">
                        <OctagonAlertIcon/>
                        <AlertTitle>{error.name}</AlertTitle>
                        <AlertDescription>
                            <p>{error.message}</p>
                        </AlertDescription>
                    </Alert>
                )}

            </div>
    );
};

export default AppError;