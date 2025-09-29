import React from 'react';
import {Toaster} from "@/components/ui/sonner.tsx";
import BgLogin from '@/assets/login.png';
import LogoTik from "@/assets/tik.png";

const AuthLayout = ({children}: Readonly<{ children: React.ReactNode }>) => {
    return (
        <div className="flex">
            <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-[300px]">
                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-medium">Tactical Wall Game</h2>
                    <h3 className="text-lg">Kepolisian Daerah Bali</h3>
                    <img src={LogoTik} alt="LogoTik" className="w-32 h-auto mx-auto"/>
                </div>
                {children}
            </div>
            <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-secondary">
                <img className="w-full h-full object-cover"  src={BgLogin} alt="background login"/>
            </div>
            <Toaster position="top-center"/>
        </div>
    );
};

export default AuthLayout;