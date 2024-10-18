"use client"

const WaterMeterManagement = dynamic(() => import("@/components/quan-ly/kiem-dinh/DongHoNuocMng"), { ssr: false});
import Loading from "@/components/Loading";
import dynamic from "next/dynamic";

export default function DNBiggerThan32() {
    return <div className="w-100 m-0 p-2 overflow-x-hidden">
        <WaterMeterManagement isBiggerThan15={true}></WaterMeterManagement>
    </div>
}
