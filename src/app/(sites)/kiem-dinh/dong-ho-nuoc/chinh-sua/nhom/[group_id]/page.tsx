"use client"

import { getNhomDongHoByGroupId } from "@/app/api/dongho/route";
const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });
import { DongHo } from "@lib/types";
import {  useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import DetailNhomDongHo from "@/components/DetailNhomDongHo";

export default function EditNhomDongHoPage({ params }: { params: { group_id: string } }) {
    const [nhomDongHo, setNhomDongHoData] = useState<DongHo[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const fetchCalled = useRef(false);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await getNhomDongHoByGroupId(params.group_id);
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

    return <DetailNhomDongHo nhomDongHo={nhomDongHo}></DetailNhomDongHo>
}