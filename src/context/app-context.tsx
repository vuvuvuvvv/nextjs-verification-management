"use client"

// context/user-context.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { logout } from '@/app/api/auth/logout/route';
import Swal from 'sweetalert2';
import { User } from '@lib/types';

// Define user type

// Define context type
export type AppContextType = {
    user: User | null;
    loading: boolean;
    updateUser: (updatedUser: User | null) => void;
    logoutUser: () => void;
    isAdmin: boolean;
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider : React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

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
        if (res?.status == 200) {
            window.location.href = '/login';
        } else if (res?.status == 401) {
            Swal.fire({
                icon: "error",
                title: res?.msg || "Phiên đăng nhập hết hạn!",
                text: "Mời đăng nhập lại.",
                showClass: {
                    popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                  `
                },
                hideClass: {
                    popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                  `
                },
                confirmButtonColor: "#0980de",
                confirmButtonText: "OK"
            }).then(() => {
                window.location.href = '/login';
            });
        }
    };
    
    return (loading) ? (
        <div>Đang lấy dữ liệu người dùng...</div>
    ) : (
        <AppContext.Provider value={{ user, loading, updateUser, logoutUser, isAdmin }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use AppContext
export const useUser = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a AppProvider ');
    }
    return context;
};