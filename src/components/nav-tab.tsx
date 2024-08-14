"use client"

import nt from "@styles/scss/components/nav-tab.module.scss"

import { useState } from "react";

interface NavTabProps {
    className?: string,
    classNameGroupTab?: string,
    classNameContent?: string,
    tabContent: {
        title: string | React.ReactNode,
        content: React.ReactNode
    }[]
}

interface TabState {
    [key: number | string]: boolean;
};
export default function NavTab({ className, classNameGroupTab, classNameContent, tabContent }: NavTabProps) {

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
        <div className={`${nt['wraper']} m-0 w-100 ${className ? className : ""}`}>
            <div className={`m-0 mb-3 w-100`} id={nt['process-tab']}>
                <div className={`${nt['group-tab']} p-2 shadow-sm rounded ${classNameGroupTab ? classNameGroupTab : ""}`}>
                    {tabContent.map((val, index) => {
                        return (
                            <button type="button" key={index + 1} className={`${nt['nav-link']} ${selectedTab[index + 1] ? nt['active'] + ' rounded' : ''}`} onClick={() => toggleTab(index + 1)}>
                                {val.title}
                            </button>
                        )
                    })}
                </div>
            </div>
            <div className={`m-0 p-0 w-100 ${classNameContent ? classNameContent : ""}`} id={nt['process-tab-content']}>
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