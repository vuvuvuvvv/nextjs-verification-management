"use client"

import { getDongHoById } from "@lib/api/dongho";
const Loading = dynamic(() => import('@/components/Loading'));
import { DongHo } from "@/lib/types";
import {  useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import DetailKiemDinhDongHo from "@/components/quan-ly/kiem-dinh/DetailKiemDinhDongHo";

export default function DongHoDetailPage({ params }: { params: { id: string } }) {
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
                console.error("Error fetching data!");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (loading || !dongHoData) {
        return <Loading></Loading>;
    }

    return <DetailKiemDinhDongHo dongHo={dongHoData}></DetailKiemDinhDongHo>
}