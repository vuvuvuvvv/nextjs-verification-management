"use client"

import { getDongHoByGroupId } from "@lib/api/dongho";
const Loading = dynamic(() => import('@/components/Loading'));
import { DongHo } from "@/lib/types";
import {  useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import DetailKiemDinhNhomDongHo from "@/components/quan-ly/kiem-dinh/DetailKiemDinhNhomDongHo";

export default function NhomDongHoDetailPage({ params }: { params: { group_id: string } }) {
    const [nhomDongHo, setNhomDongHoData] = useState<DongHo[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const fetchCalled = useRef(false);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await getDongHoByGroupId(params.group_id);
                setNhomDongHoData(res?.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.group_id]);

    if (loading || !nhomDongHo) {
        return <Loading></Loading>;
    }

    return <DetailKiemDinhNhomDongHo nhomDongHo={nhomDongHo}></DetailKiemDinhNhomDongHo>
}