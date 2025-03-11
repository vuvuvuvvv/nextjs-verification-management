"use client"

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import api from "@/app/api/route";
import { BASE_API_URL } from "@lib/system-constant";
const Loading = dynamic(() => import("@/components/Loading"));
import Swal from "sweetalert2";

const PDMManagement = dynamic(() => import("@/components/quan-ly/PDMMng"), { ssr: true });

interface PDMProps {
    className?: string,
}

export default function PDM({ className }: PDMProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [listDHNamesExist, setDHNameOptions] = useState<string[]>([]);
    const fetchCalled = useRef(false);
    const [error, setError] = useState("");

    // Func: Set err
    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: error,
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
                setError("");
            });
        }
    }, [error]);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await api.get(`${BASE_API_URL}/dongho/get-distinct-names-and-locations`);
                const listNames: string[] = res.data.ten_dong_ho
                const uniqueNames = listNames.filter((value, index, self) => self.indexOf(value) === index);
                const sortedNames = uniqueNames.sort((a, b) => a.localeCompare(b));
                setDHNameOptions(sortedNames || []);
            } catch (error) {
                setError("Có lỗi xảy ra khi lấy tên đồng hồ! Hãy thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading></Loading>;
    }
    
    return (
        <div className={`m-0 w-100 p-2`}>
            <PDMManagement listDHNamesExist={listDHNamesExist}></PDMManagement>
        </div>
    );
}