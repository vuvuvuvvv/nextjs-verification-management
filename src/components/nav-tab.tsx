"use client"

import nt from "@styles/scss/components/nav-tab.module.scss"

import { useState } from "react";

interface NavTabProps {
    className?: string,
    tabContent: {
        title: string | React.ReactNode,
        content: React.ReactNode
    }[]
}

interface TabState {
    [key: number | string]: boolean;
};
export default function NavTab({ className, tabContent }: NavTabProps) {

    // Collapse tab
    const [selectedTab, setSelectedTab] = useState<TabState>({ [1]: true });
    const toggleTab = (tab: number) => {
        if (!selectedTab[tab]) {
            setSelectedTab((prev) => ({
                [tab]: !prev[tab]
            }))
        }
    };
    // End collapse tab

    return (
        <div className={`${nt['wraper']} bg-white m-0 p-0 w-100 ${className ? className : ""}`}>
            <div className={`m-0 p-0 w-100 nav nav-tabs w-100`} id={nt['process-tab']}>
                {tabContent.map((val, index) => {
                    return (
                        <button type="button" key={index + 1} className={`${nt['nav-link']} ${selectedTab[index + 1] ? nt['active'] : ''} shadow`} onClick={() => toggleTab(index + 1)}>
                            {val.title}
                        </button>
                    )
                })}

            </div>
            <div className={`m-0 p-0 w-100`} id={nt['process-tab-content']}>
                {tabContent.map((val, index) => {
                    return (
                        <div tabIndex={index + 1} key={index + 1} className={`m-0 p-0 ${selectedTab[index + 1] ? nt['show'] : 'd-none'}`}>
                            {val.content}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}