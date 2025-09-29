import {z} from "zod";
import {API_PATHS} from "@/utils/apiPaths.ts";
import axiosInstance from "@/utils/axiosInstance.ts";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {consoleErrorApi} from "@/helpers/logs.ts";
import { Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription, FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

interface OperasiFormProps {
    id?: string;
    name?: string;
}

const operasiSchema = z.object({
    name: z
        .string().min(1, {message: "Operasi Name is required"}),
    icon: z.string().optional(),
})

type FormValues = z.infer<typeof operasiSchema>;

const createOperasi = async ({name}: OperasiFormProps) => {
    const response = await axiosInstance.post(API_PATHS.OPERASIS.CREATE, {
        name
    })
    return response.data;
}

const updateOperasi = async ({id, name}: OperasiFormProps) => {
    const response = await axiosInstance.put(API_PATHS.OPERASIS.UPDATE(id || ""), {
        name
    })
    return response.data;
}

const OperasiForm = ({id, name}: OperasiFormProps) => {

    const navigate = useNavigate();

    const form = useForm<FormValues>({
        resolver: zodResolver(operasiSchema),
        defaultValues: {
            name: name || "",
        },
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: id ? updateOperasi : createOperasi,
        onSuccess: async () => {
            if (id) {
                await queryClient.invalidateQueries({queryKey: ["operasis/update", id]});
                toast.success("Operasi Updated");

            } else {
                toast.success("Operasi Created");
            }
            setTimeout(() => navigate("/operasis"), 500)

        },
        onError: async error => {
            consoleErrorApi(error, id ? "Unit Update" : "Unit Create")
        }
    });

    function onSubmit(values: FormValues) {
        mutation.mutate({
            name: values.name,
            id: id
        });
    }

    return (
        <div className="mt-4">
            <Card className="p-4">
                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name Operasi</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is name of operasi.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="cursor-pointer mt-8">{id ? "Update" : "Create"}</Button>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default OperasiForm;