"use client"

import ProcessManagement from "@/components/verification-management/process";
import vrfWm from "@styles/scss/ui/vrf-watermeter.module.scss"

import { useState } from "react";

import { sampleWaterMeterData, sampleReportData } from "@lib/sample-data";

interface DnBiggerThan32Props {
    className?: string,
}

interface TabState {
    [key: number | string]: boolean;
};
export default function DnBiggerThan32({ className }: DnBiggerThan32Props) {
    
    // Collapse tab
    const [selectedTab, setSelectedTab] = useState<TabState>({ [1]: true });
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const toggleTab = (tab: number) => {
        if (!selectedTab[tab]) {
            setSelectedTab((prev) => ({
                [tab]: !prev[tab]
            }))
        }
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
    // End collapse tab

    return (
        <div className={`${className ? className : ""} ${vrfWm['wraper']} container-fluid p-0 px-2 py-3 w-100`}>
            <div className={`m-0 mb-3 p-0 w-100 w-100 bg-white`}>
                <div className={`m-0 p-0 w-100 nav nav-tabs w-100`} id={vrfWm['process-tab']}>
                    <button type="button" className={`${vrfWm['nav-link']} ${selectedTab[1] ? vrfWm['active'] : ''} shadow`} onClick={() => toggleTab(1)}>
                        Quản lý theo mẻ
                    </button>
                    <button type="button" className={`${vrfWm['nav-link']} ${selectedTab[2] ? vrfWm['active'] : ''} shadow`} onClick={() => toggleTab(2)}>
                        Quản lý theo đồng hồ
                    </button>
                </div>
                <div className={`m-0 p-0 w-100`} id={vrfWm['process-tab-content']}>
                    <div tabIndex={1} className={`m-0 p-0 ${selectedTab[1] ? vrfWm['show'] : 'd-none'}`}>
                        <ProcessManagement data={sampleReportData} />
                    </div>
                    <div tabIndex={2} className={`${selectedTab[2] ? vrfWm['show'] : 'd-none'}`}>2</div>
                </div>
            </div>
        </div>
    )
}