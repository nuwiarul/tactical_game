import {Link} from "react-router-dom";
import {Home, Layers2, LayoutDashboard, LogIn, Moon, Sun} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {useTheme} from "@/providers/ThemeProvider.tsx";
import {Button} from "@/components/ui/button.tsx";
import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {useIdentify} from "@/context/AuthProvider.tsx";
import {IMAGE_BASE_URL} from "@/utils/apiPaths.ts";
import Logo from "@/assets/tik.png";


const Navbar = ({isPublic = false, isOperasi = false, title}: { isPublic?: boolean, isOperasi?: boolean, title? : string }) => {

    const {setTheme} = useTheme();

    const identify = useIdentify();

    return (
        <nav
            className={`p-4 flex items-center ${isPublic ? "justify-end sm:justify-between" : "justify-between"} sticky top-0 z-30 bg-background border-b border-foreground/15 backdrop-blur-[2px]`}>
            {/* LEFT */}
            {!isPublic ? (<SidebarTrigger/>) : (
                <Link to="/">
                    <div className="hidden sm:flex items-center gap-1">
                        <img src={Logo} alt="logo" className="w-10 h-10"/>
                        <span className="text-sm">BIDTIK</span>
                    </div>
                </Link>
            )}

            {title && (<span>
                {title}
            </span>)}

            {/*<Button variant="outline" onClick={toggleSidebar}>
                Custom Button
            </Button>*/}
            {/* RIGHT */}

            <div className="flex items-center gap-4">

                {isPublic && isOperasi ? (
                    <Link to="/list/operasis"><Button variant="ghost" className="cursor-pointer"><Layers2/>List Operasi</Button></Link>) : (<></>)}

                {isPublic ?
                    identify.user ? (
                            <Link to={identify.user.user.role === "admin" ? "/admin" : "/user"}><Button variant="ghost"
                                                                                                        className="cursor-pointer"><LayoutDashboard/>Dashboard</Button></Link>) :
                        (
                            <Link to="/login"><Button variant="ghost" className="cursor-pointer"><LogIn/>Login</Button></Link>)
                    : (<Link to="/"><Button variant="ghost" className="cursor-pointer"><Home/>Home</Button></Link>)

                }
                {/*<Link to="/">Dashboard</Link>*/}
                {/* THEME MENU*/}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Sun
                                className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"/>
                            <Moon
                                className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"/>
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {identify.user && (
                    <Avatar>
                        <AvatarImage
                            src={identify?.user?.user?.profile_img ? `${IMAGE_BASE_URL}${identify?.user?.user?.profile_img}` : "https://github.com/shadcn.png"}/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                )}

                {/* USER MENU*/}
                {/*<DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png"/>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={10}>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="h-[1.2rem] w-[1.2rem] mr-2"/> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="h-[1.2rem] w-[1.2rem] mr-2"/>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                            <LogOut className="h-[1.2rem] w-[1.2rem] mr-2"/>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>*/}
            </div>
        </nav>
    );
};

export default Navbar;