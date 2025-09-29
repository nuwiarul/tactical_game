import React from 'react';
import AppSidebar from "@/components/AppSidebar.tsx";
import Navbar from "@/components/Navbar.tsx";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";

const MainLayout = ({children, activeMenu, title, share}: Readonly<{
    children: React.ReactNode, activeMenu: string, title?: string, share?: {url: string, title: string} }>) => {
    return (
        <div className="flex">
            <SidebarProvider>
                <AppSidebar activeMenu={activeMenu}/>
                <div className="flex flex-col h-screen w-full">
                    <Navbar title={title} share={share}/>
                    <div className="p-0 flex-1 w-full relative">
                        {children}
                    </div>
                </div>
            </SidebarProvider>
            <Toaster position="top-center"/>
        </div>
    );
};

export default MainLayout;