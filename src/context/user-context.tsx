"use client"

// context/user-context.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { logout } from '@/app/api/auth/logout/route';

// Define user type
export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

// Define context type
export type UserContextType = {
    user: User | null;
    loading: boolean;
    updateUser: (updatedUser: User | null) => void;
    logoutUser: () => void;
};

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserFromCookie = Cookies.get('user');
        if (getUserFromCookie) {
            try {
                const cookieUser: User = JSON.parse(getUserFromCookie);
                setUser(cookieUser);
                setLoading(false);
            } catch (error) {
                logoutUser();
            }
        } else {
            logoutUser();
        }
    }, []);

    const updateUser = (updatedUser: User | null) => {
        setUser(updatedUser);
    };

    const logoutUser = async () => {
        const res = await logout();
        if (typeof res !== 'object' || res.status !== 200) {
            console.log("error logout");
        }
    };
    return (loading) ? (
        <div>Đang lấy dữ liệu người dùng...</div>
    ) : (
        <UserContext.Provider value={{ user, loading, updateUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use UserContext
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};