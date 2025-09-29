import {type FC} from "react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar.tsx";
import {cn} from "@/lib/utils.ts";
import {Link} from "react-router-dom";

interface AppSidebarMenuProps {
    title: string;
    items: {
        title: string;
        url: string;
        icon: FC<{ className?: string }>;
        active: string;
        key: string;
    }[]
}


const AppSidebarMenu = ({items, activeMenu} : {items:AppSidebarMenuProps[], activeMenu:string;}) => {
    return items.map(menu => (
        <SidebarGroup className="-mt-6" key={menu.title}>
            <SidebarGroupLabel>{menu.title}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {menu.items.map((item) => (
                        <SidebarMenuItem key={item.key}>
                            <SidebarMenuButton asChild className={cn(activeMenu === item.active && 'bg-sidebar-accent')}>
                                <Link to={item.url}>
                                    <item.icon/>
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    ));
};

export default AppSidebarMenu;