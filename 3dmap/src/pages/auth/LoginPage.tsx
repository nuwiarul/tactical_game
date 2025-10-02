import AuthLayout from "@/layouts/AuthLayout.tsx";
import {z} from "zod";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {Card} from "@/components/ui/card.tsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Eye, EyeOff} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {useIdentify} from "@/context/AuthProvider.tsx";
import {consoleErrorApi} from "@/helpers/logs.ts";

const loginSchema = z.object({
    username: z.string().min(4, {message: "Username minimal character is 4"}),
    password: z.string().min(8, {message: "Password minimal character is 8"}),
})

type FormValues = z.infer<typeof loginSchema>;

const login = async ({username, password}: {username: string, password: string}) => {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {username, password});
    return response.data;
}

const LoginPage = () => {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const identify = useIdentify();

    const form = useForm<FormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: async (data) => {
            //localStorage.setItem(ACCESS_TOKEN, data?.data?.access_token);
            //localStorage.setItem(REFRESH_TOKEN, data?.data?.refresh_token);
            identify.setIdentify(data?.data);
            if(data?.data?.user?.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/user");
            }

        },
        onError: async error => {
            consoleErrorApi(error, "Login")
        }
    })

    function onSubmit(values: FormValues) {
        mutation.mutate({
            username: values.username,
            password: values.password,
        });
    }

    return (
        <AuthLayout>
            <div className="lg:w-[100%] h-3/4 md:h-full flex flex-col justify-center">
                <Card className="p-4">
                    <Form {...form}>
                        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center">
                                                <Input type={showPassword ? "text" : "password"} {...field}/>
                                                {showPassword ?
                                                    <Eye
                                                        onClick={() => setShowPassword(false)}
                                                        className="absolute right-2 cursor-pointer"
                                                    /> : <EyeOff
                                                        onClick={() => setShowPassword(true)}
                                                        className="absolute right-2 cursor-pointer"
                                                    />}
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center gap-4 mt-2">
                                <Link to={"/"} className=""><Button className="cursor-pointer flex-1">Cancel</Button></Link>
                                <Button type="submit" className="cursor-pointer">Login</Button>
                            </div>
                        </form>
                    </Form>
                </Card>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;