"use client"

// context/user-context.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { logout } from '@/app/api/auth/logout/route';
import Swal from 'sweetalert2';
import { User } from '@lib/types';
import Loading from '@/components/Loading';
import { ACCESS_LINKS, PERMISSIONS } from '@lib/system-constant';

// Define user type

// Define context type
export type AppContextType = {
    user: User | null;
    loading: boolean;
    updateUser: (updatedUser: User | null) => void;
    logoutUser: () => void;
    isSuperAdmin: boolean;
    isAdmin: boolean;
    isDirector: boolean;
    isManager: boolean;
    isViewer: boolean;
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const isSuperAdmin = user?.role === PERMISSIONS.SUPERADMIN;

    const isAdmin = user?.role === PERMISSIONS.ADMIN;

    const isManager = user?.role === PERMISSIONS.MANAGER;

    const isDirector = user?.role === PERMISSIONS.DIRECTOR;

    const isViewer = user?.role === PERMISSIONS.VIEWER;

    useEffect(() => {
        const getUserFromCookie = Cookies.get('user');
        if (getUserFromCookie) {
            try {
                const cookieUser: User = JSON.parse(getUserFromCookie);
                setUser(cookieUser);
                setLoading(false);
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Phiên đăng nhập hết hạn!",
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
                    logoutUser();
                });
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Phiên đăng nhập hết hạn!",
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
                logoutUser();
            });
        }
    }, [Cookies.get('user')]);

    const updateUser = (updatedUser: User | null) => {
        setUser(updatedUser);
    };

    const logoutUser = async () => {
        const allCookies = Cookies.get();
        for (let cookie in allCookies) {
            Cookies.remove(cookie);
        }
        window.location.href = ACCESS_LINKS.AUTH_LOGIN.src;
    };

    return (loading) ? (
        <Loading></Loading>
    ) : (
        <AppContext.Provider value={{
            user,
            loading,
            updateUser,
            logoutUser,
            isSuperAdmin,
            isAdmin,
            isDirector,
            isManager,
            isViewer
        }}>
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