"use client"

import WaterMeterManagement from "@/components/quan-ly/kiem-dinh/dong-ho-nuoc";
import React, { useEffect, useRef, useState } from "react";
const Loading = React.lazy(() => import("@/components/loading"));

import { BASE_API_URL } from "@lib/system-constant";
import api from "@/app/api/route";
import { DongHo } from "@lib/types";

interface DNBiggerThan32Props {
    className?: string,
}

export default function DNBiggerThan32({ className }: DNBiggerThan32Props) {

    return <div className="w-100 m-0 p-2">
        <WaterMeterManagement></WaterMeterManagement>
    </div>
}
