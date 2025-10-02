import React, {createContext, useContext, useEffect, useState} from "react";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "@/utils/constants.ts";
import axiosInstance from "@/utils/axiosInstance.ts";
import {API_PATHS} from "@/utils/apiPaths.ts";
import {useNavigate} from "react-router-dom";
import type {IBaseModel} from "@/utils/items.ts";

interface User {
    user: {
        id: string;
        name: string;
        username: string;
        role: string;
        profile_img: string;
        created_at: string;
        updated_at: string;
        units: IBaseModel[]
    };
    access_token: string
    refresh_token: string
    access_token_expires_at: string
    refresh_token_expires_at: string;
}

interface UserContextType {
    user: User | null;
    setIdentify: (userData: User) => void;
    logout: () => void;
    loading: boolean;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setIdentify: () =>{},
    logout: () => {},
    loading: true,
});

const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // New state to track loading

    const navigate = useNavigate();

    useEffect(() => {
        if (user) return;
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        //console.log("accessToken", accessToken);
        if(!accessToken) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.PROFILE.IDENTIFY);
                //console.log(response.data?.data);
                setUser(response.data?.data);
            } catch (err) {
                console.error(err);
                logout();
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [])

    const setIdentify = (userData: User) => {
        setUser(userData);
        localStorage.setItem(ACCESS_TOKEN, userData.access_token);
        localStorage.setItem(REFRESH_TOKEN, userData.refresh_token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        navigate("/login");
    }

    return (
        <UserContext.Provider value={{user, loading, setIdentify, logout}}>
            {children}
        </UserContext.Provider>
    );

}
export default AuthProvider;

export const useIdentify = () => {
    return useContext(UserContext)
}