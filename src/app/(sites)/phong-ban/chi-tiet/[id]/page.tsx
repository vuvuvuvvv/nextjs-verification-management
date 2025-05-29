"use client"

import { getPhongBanById } from "@/app/api/phongban/route";
const Loading = dynamic(() => import('@/components/Loading'));
import { PhongBan } from "@lib/types";
import {  useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

export default function DetailPhongBanPage({ params }: { params: { id: number } }) {
    const [phongBanData, setPhongBanData] = useState<PhongBan>();
    const [loading, setLoading] = useState<boolean>(true);
    const fetchCalled = useRef(false);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await getPhongBanById(params.id);
                console.log(res.data);
                setPhongBanData(res?.data);
            } catch (error) {
                console.error("Error fetching data!");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (loading || !phongBanData) {
        return <Loading></Loading>;
    }

    return <>

    </>
}