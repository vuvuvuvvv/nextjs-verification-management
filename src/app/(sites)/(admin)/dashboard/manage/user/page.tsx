"use client"

import { useEffect, useState } from "react";
import api from "@/app/api/route";
import { logout } from "@/app/api/auth/logout/route";
import UserManagement from "./UserManagement";
import { User } from "@lib/types";
import Loading from "@/components/loading";

export default function UserManagementPage() {
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await api.get('/api/auth/users');
    //             setData(response.data);
    //         } catch (error: any) {
    //             if (error.response && error.response.status === 401) {
    //                 logout();
    //             } else {
    //                 console.error("Failed to fetch data:", error);
    //             }
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, []);

    if (loading) {
        return <Loading />;
    }

    return <UserManagement data={data} />;
}