import {
    ChevronUp,
    LayoutDashboard,
    User2,
    User, LogOut,

} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarSeparator
} from "@/components/ui/sidebar.tsx";
import {Link} from "react-router-dom";
import Logo from '@/assets/tik.png';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {cn} from "@/lib/utils.ts";
import {useIdentify} from "@/context/AuthProvider.tsx";
import AppSidebarMenu from "@/components/AppSidebarMenu.tsx";
import {adminItems, userItems} from "@/utils/menus.ts";




const AppSidebar = ({activeMenu}: { activeMenu: string; }) => {

    const identify = useIdentify();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to="/admin">
                                <img src={Logo} alt="logo" className="w-8 h-8"/>
                                <span>BIDTIK</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator className="mt-1 -ml-0"/>
            <SidebarContent>
                <SidebarGroup className="mt-10">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className={cn(activeMenu === "dashboard" && 'bg-sidebar-accent')}>
                                    <Link to={identify?.user?.user?.role === 'admin' ? '/admin' : '/user'}>
                                        <LayoutDashboard/>
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {identify?.user?.user?.role === "admin" ? <AppSidebarMenu items={adminItems} activeMenu={activeMenu} /> :
                    <AppSidebarMenu items={userItems} activeMenu={activeMenu} />
                }
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2/> {identify?.user?.user?.name} <ChevronUp className="ml-auto"/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><User className="h-[1.2rem] w-[1.2rem] mr-2"/> Profile</DropdownMenuItem>
                                <DropdownMenuItem variant="destructive" onClick={() => identify.logout()}><LogOut className="h-[1.2rem] w-[1.2rem] mr-2"/> Sign Out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSidebar;