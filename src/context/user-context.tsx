"use client"

// context/user-context.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define user type
export interface User {
    username: string;
    email: string;
    role: string;
}

// Define context type
export type UserContextType = {
    user: User | null;
    loading: boolean;
    updateUser: (updatedUser: User | null) => void;
};

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [user]);

    const updateUser = (updatedUser: User | null) => {
        setUser(updatedUser);
    };

    return (
        <UserContext.Provider value={{ user, loading, updateUser }}>
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
