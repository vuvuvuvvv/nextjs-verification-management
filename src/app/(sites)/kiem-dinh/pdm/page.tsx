"use client"

import dynamic from "next/dynamic";
import { PDMData } from "@lib/types";
import { useState, useEffect, useRef } from "react";
import api from "@/app/api/route";
import { BASE_API_URL } from "@lib/system-constant";
import Loading from "@/components/loading";

const PDMManagement = dynamic(() => import("@/components/quan-ly/kiem-dinh/pdm"), { ssr: true });

interface PDMProps {
    className?: string,
}

export default function PDM({ className }: PDMProps) {
    const [reportData, setReportData] = useState<PDMData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const fetchCalled = useRef(false);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await api.get(`${BASE_API_URL}/pdm`);
                setReportData(res.data);
            } catch (error) {
                console.error("Error fetching data:", error);
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
            <PDMManagement data={reportData}></PDMManagement>
        </div>
    );
}