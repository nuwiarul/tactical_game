import {isAxiosError} from "axios";
import {toast} from "sonner";

export const consoleErrorApi = (error: unknown, message: string) => {
    if (isAxiosError(error)) {
        console.error(`${message} : `, error.response?.data?.message || error.message);
        toast.error(message, {
            description: error.response?.data?.message || error.message,
        });
    } else {
        console.error(error);
    }
}