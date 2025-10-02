import React from 'react';
import {Toaster} from "@/components/ui/sonner.tsx";
import BgLogin from '@/assets/login.png';
import LogoTik from "@/assets/tik.png";
import LogoOps from "@/assets/ops.png";
import LogoPoldaBali from "@/assets/polda_bali.png";


const AuthLayout = ({children}: Readonly<{ children: React.ReactNode }>) => {
    return (
        <div className="flex">
            <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 md:pb-[350px] pb-[300px]">
                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl font-medium">Tactical Wall Game</h2>
                    <h3 className="text-lg">Kepolisian Daerah Bali</h3>
                    <div className="flex items-center gap-4 h-auto mx-auto mt-10">
                        <img src={LogoPoldaBali} alt="LogoPoldaBali" className="h-16 md:h-24 lg:h-36"/>
                        <img src={LogoOps} alt="LogoPoldaBali" className="h-16 md:h-24 lg:h-36"/>
                        <img src={LogoTik} alt="LogoTik" className="h-16 md:h-24 lg:h-36"/>
                    </div>
                </div>
                {children}
            </div>
            <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-secondary">
                <img className="w-full h-full object-cover" src={BgLogin} alt="background login"/>
            </div>
            <Toaster position="top-center"/>
        </div>
    );
};

export default AuthLayout;