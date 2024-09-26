"use client"

import { getDongHoBySerinumber } from "@/app/api/dongho/route";
import FormDongHoNuocDNLonHon15 from "@/components/dong-ho-nuoc-form";
import Loading from "@/components/loading";
import { DongHo } from "@lib/types";
import { useEffect, useRef, useState } from "react";

export default function Page({ params }: { params: { serial_number: string } }) {
    const [dongHoData, setDongHoData] = useState<DongHo>();
    const [loading, setLoading] = useState<boolean>(true);
    const fetchCalled = useRef(false);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await getDongHoBySerinumber(params.serial_number);
                setDongHoData(res.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.serial_number]);

    if (loading) {
        return <Loading></Loading>;
    }

    // return <div className="w-100 m-0 p-2">
    //     <FormDongHoNuocDNLonHon15 dataDongHo={dongHoData}></FormDongHoNuocDNLonHon15>
    // </div>

    return <div className="w-100 m-0 p-2">
        <FormDongHoNuocDNLonHon15 dataDongHo={dongHoData}></FormDongHoNuocDNLonHon15>
    </div>
}