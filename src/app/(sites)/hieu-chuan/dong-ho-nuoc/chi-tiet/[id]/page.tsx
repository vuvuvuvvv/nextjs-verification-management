"use client"

import { getHieuChuanDongHoById } from "@/app/api/dongho/route";
const Loading = dynamic(() => import('@/components/Loading'));
import { DongHo } from "@lib/types";
import {  useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import DetailHieuChuanDongHo from "@/components/quan-ly/hieu-chuan/DetailHieuChuanDongHo";

export default function DongHoDetailPage({ params }: { params: { id: string } }) {
    const [dongHoData, setDongHoData] = useState<DongHo>();
    const [loading, setLoading] = useState<boolean>(true);
    const fetchCalled = useRef(false);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await getHieuChuanDongHoById(params.id);
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

    return <DetailHieuChuanDongHo dongHo={dongHoData}></DetailHieuChuanDongHo>
}