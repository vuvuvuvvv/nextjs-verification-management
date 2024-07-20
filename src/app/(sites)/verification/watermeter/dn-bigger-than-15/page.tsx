"use client"

import WaterMeterManagement from "@/components/verification-management/watermeter";
import React from "react";
const Loading = React.lazy(() => import("@/components/loading"));

import { sampleWaterMeterData, sampleReportData } from "@lib/sample-data";

interface DNBiggerThan32Props {
    className?: string,
}

export default function DNBiggerThan32({ className }: DNBiggerThan32Props) {

    return <div className="w-100 m-0 px-lg-3 py-lg-2 p-xl-0 px-xxl-3 py-xxl-2">
        <WaterMeterManagement data={sampleWaterMeterData}></WaterMeterManagement>
    </div>
}
