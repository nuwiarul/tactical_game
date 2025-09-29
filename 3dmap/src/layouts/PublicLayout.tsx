import React from 'react';
import Navbar from "@/components/Navbar.tsx";

const PublicLayout = ({children}: Readonly<{ children: React.ReactNode }>) => {
    return (
        <div className="flex">
            <div className="flex flex-col h-screen">
                <Navbar  isPublic={true} isOperasi={true}/>
                <div className="flex-1 w-full relative">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PublicLayout;