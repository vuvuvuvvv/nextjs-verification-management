// lib/types.ts
export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    password: string;
    email: string;
}


export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}