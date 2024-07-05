"use client"

import ErrorCaculatorForm from "@/components/error-caculator-form";
import wm from "@styles/scss/ui/watermeter.module.scss"

import { useState, useEffect, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

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
        <div className={`${className ? className : ""} ${wm['wraper']} container p-0 py-3 py-md-4 w-100`}>
            <div className={`row m-0 mb-3 p-0 w-100 bg-white sr-cover`}>
                <div className={`form-control border-0 ${wm['search-seri']}`}>
                    <label htmlFor="seriNumber" className={`form-label`}>Số seri</label>
                    <input type="text" id="seriNumber" className={`form-control`} placeholder="Nhập số seri" />
                </div>
            </div>

            <div className={`m-0 mb-3 p-0 w-100 w-100 bg-white sr-cover`}>
                <div className={`m-0 mb-3 p-0 w-100 nav nav-tabs w-100`} id={wm['process-tab']} role="tablist">
                    <button className={`${wm['nav-link']} ${selectedTab[1] ? wm['active'] : ''}`} onClick={() => toggleTab(1)}>Home</button>
                    <button className={`${wm['nav-link']} ${selectedTab[2] ? wm['active'] : ''}`} onClick={() => toggleTab(2)}>Profile</button>
                    <button className={`${wm['nav-link']} ${selectedTab[3] ? wm['active'] : ''}`} onClick={() => toggleTab(3)}>Contact</button>
                </div>
                <div className={`row m-0 p-0 w-100 tab-content`} id={wm['process-tab-content']}>
                    <div className={`tab-pane fade w-100 m-0 p-0 ${wm['tab-content']} ${selectedTab[1] ? 'show active' : ''}`}>
                        1
                    </div>
                    <div className={`tab-pane fade w-100 m-0 p-0 ${wm['tab-content']} ${selectedTab[2] ? 'show active' : ''}`}>
                        2
                    </div>
                    <div className={`tab-pane fade w-100 m-0 p-0 ${wm['tab-content']} ${selectedTab[3] ? 'show active' : ''}`}>
                        3
                    </div>
                </div>
            </div>
        </div>
    )
}