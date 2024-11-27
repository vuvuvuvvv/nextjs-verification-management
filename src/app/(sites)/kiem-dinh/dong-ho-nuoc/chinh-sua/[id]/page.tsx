"use client"

import { getDongHoById } from "@/app/api/dongho/route";
const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });
import { DongHo } from "@lib/types";
import {  useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import DetailDongHo from "@/components/DetailDongHo";

export default function EditDongHoPage({ params }: { params: { id: string } }) {
    const [dongHoData, setDongHoData] = useState<DongHo>();
    const [loading, setLoading] = useState<boolean>(true);
    const fetchCalled = useRef(false);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await getDongHoById(params.id);
                setDongHoData(res?.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (loading || !dongHoData) {
        return <Loading></Loading>;
    }

    return <DetailDongHo dongHo={dongHoData}></DetailDongHo>
}