import React, { useContext, useEffect, useState } from 'react';
import io from "socket.io-client";
import { useMemo } from "react";
import { useGetMyProfileQuery, type UserProfile } from '@/redux/api/authApi';
import { useAppSelector } from '@/redux/hooks';
import { API_BASE_URL } from '@/config/api';

type ContextUser = UserProfile & {
    _id?: string
    role?: string
    status?: string
}

interface UserContextType {
    user: ContextUser | null;
    socket: ReturnType<typeof io> | null;
    setUser: React.Dispatch<React.SetStateAction<ContextUser | null>>;
}

export const UserContext = React.createContext<UserContextType | null>(null);

export const useUser = () => {
    return useContext(UserContext)
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAppSelector((state) => state.auth)
    const { data: profile } = useGetMyProfileQuery(undefined, {
        skip: !isAuthenticated,
    })
    const [user, setUser] = useState<ContextUser | null>(null);
    const socket = useMemo(() => io(API_BASE_URL), []);


    useEffect(() => {
        const handleConnection = () => {
            console.log("Connected to socket server");
        };

        socket.on("connect", handleConnection);
        return () => {
            socket.off('connect', handleConnection);
        };

    }, [socket]);



    useEffect(() => {
        if (profile?.data) {
            setUser(profile.data);
        }
    }, [profile])


    return (
        <UserContext.Provider value={{ user, socket, setUser }}>
            {children}
        </UserContext.Provider>
    )
}