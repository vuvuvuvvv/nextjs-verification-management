"use client"

import WaterMeterManagement from "@/components/quan-ly/kiem-dinh/dong-ho-nuoc";
import React, { useEffect, useRef, useState } from "react";
const Loading = React.lazy(() => import("@/components/loading"));

import { BASE_API_URL } from "@lib/system-constant";
import api from "@/app/api/route";
import { DongHo } from "@lib/types";

interface DNBiggerThan32Props {
    className?: string,
}

export default function DNBiggerThan32({ className }: DNBiggerThan32Props) {
    const [dongHoData, setDongHoData] = useState<DongHo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const fetchCalled = useRef(false);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await api.get(`${BASE_API_URL}/dongho`);
                setDongHoData(res.data);
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

    return <div className="w-100 m-0 p-2">
        <WaterMeterManagement data={dongHoData}></WaterMeterManagement>
    </div>
}
