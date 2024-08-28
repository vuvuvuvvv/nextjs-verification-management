"use client"

import nt from "@styles/scss/components/nav-tab.module.scss"

import { useState } from "react";

interface NavTabProps {
    className?: string,
    classNameGroupTab?: string,
    classNameContent?: string,
    tabContent: {
        title: string | React.ReactNode,
        content: React.ReactNode,
        q?: string
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
        <div className={`${nt['wraper']} m-0 p-2 w-100 ${className ? className : ""}`}>
            <h5 className="mb-3">Lưu lượng:</h5>
            <div className={`m-0 mb-3 px-2 w-100`} id={nt['process-tab']}>
                <div className={`${nt['group-tab']} shadow-sm rounded ${classNameGroupTab ? classNameGroupTab : ""}`}>
                    {tabContent.map((val, index) => {
                        return (
                            <button type="button" style={{ minWidth: "80px" }} key={index + 1} className={`${nt['nav-link']} ${selectedTab[index + 1] ? nt['active'] + ' rounded' : ''} fs-5 px-4`} onClick={() => toggleTab(index + 1)}>
                                {val.title}{val.q ? `: ${val.q}` : ""}{val.q && <span>m<sup>3</sup>/h</span>}
                            </button>
                        )
                    })}
                </div>
            </div>
            <h5>Thứ tự:</h5>
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