"use client"

const WaterMeterManagement = dynamic(() => import("@/components/quan-ly/kiem-dinh/dong-ho-nuoc"), { ssr: false, loading: () => <Loading /> });
import Loading from "@/components/loading";
import dynamic from "next/dynamic";

export default function DNBiggerThan32() {
    return <div className="w-100 m-0 p-2">
        <WaterMeterManagement></WaterMeterManagement>
    </div>
}
