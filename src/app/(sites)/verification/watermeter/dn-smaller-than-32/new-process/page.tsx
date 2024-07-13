"use client"

import ErrorCaculatorTab from "@/components/error-caculator-tab";
import ErrorCaculatorForm from "@/components/dn-smaller-than-32/error-caculator-form";
import wm from "@styles/scss/ui/vrf-watermeter.module.scss"

import { useState } from "react";

interface WaterMeterProps {
    className?: string,
}

interface TabState {
    [key: number | string]: boolean;
};

export default function WaterMeter({ className }: WaterMeterProps) {
    const [selectedTab, setSelectedTab] = useState<TabState>({ [1]: true });

    const toggleTab = (tab: number) => {
        if (!selectedTab[tab]) {
            setSelectedTab((prev) => ({
                [tab]: !prev[tab]
            }))
        }
    };

    return (
        <div className={`${className ? className : ""} ${wm['wraper']} container-fluid p-0 px-2 py-3 w-100`}>
            <div className={`container mb-3 p-3 w-100 bg-white sr-cover`}>
                <div className={`form-control border-0 ${wm['search-seri']}`}>
                    <label htmlFor="seriNumber" className={`form-label fs-3 fw-bold`}>Số seri:</label>
                    <input type="text" id="seriNumber" className={`form-control`} placeholder="Nhập số seri" />
                </div>
            </div>

            <div className={`m-0 mb-3 p-0 w-100 w-100 bg-white sr-cover`}>
                <div className={`m-0 p-0 w-100 nav nav-tabs w-100`} id={wm['process-tab']}>
                    <button type="button" className={`${wm['nav-link']} ${selectedTab[1] ? wm['active'] : ''} sr-cover`} onClick={() => toggleTab(1)}>
                        Q<sub>3</sub> (Q<sub>max</sub>)
                    </button>
                    <button type="button" className={`${wm['nav-link']} ${selectedTab[2] ? wm['active'] : ''} sr-cover`} onClick={() => toggleTab(2)}>
                        Q<sub>2</sub> (Q<sub>t</sub>)
                    </button>
                    <button type="button" className={`${wm['nav-link']} ${selectedTab[3] ? wm['active'] : ''} sr-cover`} onClick={() => toggleTab(3)}>
                        Q<sub>1</sub> (Q<sub>min</sub>)
                    </button>
                </div>
                <div className={`m-0 py-3 px-2 w-100`} id={wm['process-tab-content']}>
                    <ErrorCaculatorTab tabIndex={1} className={`${selectedTab[1] ? wm['show'] : 'd-none'}`} form={ErrorCaculatorForm} />
                    <ErrorCaculatorTab tabIndex={2} className={`${selectedTab[2] ? wm['show'] : 'd-none'}`} form={ErrorCaculatorForm} />
                    <ErrorCaculatorTab tabIndex={3} className={`${selectedTab[3] ? wm['show'] : 'd-none'}`} form={ErrorCaculatorForm} />
                </div>
            </div>
        </div>
    )
}