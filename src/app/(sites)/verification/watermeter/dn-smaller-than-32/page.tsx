"use client"

import WaterMeterManagement from "@/components/verification-management/watermeter";
import React from "react";
const Loading = React.lazy(() => import("@/components/loading"));

import { sampleWaterMeterData, sampleReportData } from "@lib/sample-data";

interface DNSmallerThan32Props {
    className?: string,
}

export default function DNSmallerThan32({ className }: DNSmallerThan32Props) {
    return <WaterMeterManagement data={sampleWaterMeterData}></WaterMeterManagement>
}