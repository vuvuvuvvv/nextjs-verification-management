"use client"

import { useKiemDinh } from "@/context/kiem-dinh";
import nt from "@styles/scss/components/nav-tab.module.scss"

import { useState } from "react";

interface NavTabProps {
    className?: string,
    classNameGroupTab?: string,
    classNameContent?: string,
    tabContent: {
        title: string | React.ReactNode,
        content: React.ReactNode,
    }[]
}

interface TabState {
    [key: number | string]: boolean;
};
export default function NavTab({ className, classNameGroupTab, classNameContent, tabContent }: NavTabProps) {

    const {getDuLieuKiemDinhJSON} = useKiemDinh();

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

    const handleCheckDongHo = ()=> {
        getDuLieuKiemDinhJSON();
    };

    return (
        <div className={`${nt['wraper']} m-0 p-2 w-100 ${className ? className : ""}`}>
            <h5 className="mb-3">Nhóm lưu lượng:</h5>
            <div className={`m-0 w-100`} id={nt['process-tab']}>
                <div className={`${nt['group-tab']} ${classNameGroupTab ? classNameGroupTab : ""}`}>
                    {tabContent.map((val, index) => {
                        return (
                            <button type="button" style={{ minWidth: "80px" }} key={index + 1} className={`${nt['nav-link']} ${selectedTab[index + 1] ? nt['active'] : ''} fs-5 px-4`} onClick={() => toggleTab(index + 1)}>
                                {val.title}
                            </button>
                        )
                    })}
                </div>
            </div>
            <div className={`w-100 p-1 ${nt['wrap-process-tab']}`}>
                <div className={`m-0 p-0 w-100 ${classNameContent ? classNameContent : ""}`} id={nt['process-tab-content']}>
                    {tabContent.map((val, index) => {
                        return (
                            <div tabIndex={index + 1} key={index + 1} className={`m-0 p-0 ${selectedTab[index + 1] ? nt['show'] : 'd-none'}`}>
                                {val.content}
                                <div className="w-100 px-1 py-3 d-flex justify-content-between">
                                    {(0 == index) ? <span></span> : <button className="btn px-3 py-2 btn-primary" onClick={() => toggleTab(index)}>Quay lại ({tabContent[index - 1].title})</button>}

                                    {(tabContent.length - 1 == index) ? <button className="btn px-3 py-2 btn-danger" onClick={handleCheckDongHo}>Kết thúc</button> : <button type="button" className="btn px-3 py-2 btn-primary 1" onClick={() => toggleTab(index + 2)}>Tiếp ({tabContent[index + 1].title})</button>}

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="w-100">
                {/* TODO: check success  */}
            </div>
        </div>
    )
}