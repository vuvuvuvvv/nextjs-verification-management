"use client"

import { useKiemDinh } from "@/context/KiemDinh";
import nt from "@styles/scss/components/nav-tab.module.scss"

import { useEffect, useState } from "react";

interface NavTabProps {
    className?: string,
    classNameGroupTab?: string,
    classNameContent?: string,
    tabContent: {
        title: string | React.ReactNode,
        content: React.ReactNode,
    }[],
    buttonControl?: boolean,
    gotoFirstTab?:boolean,
}

interface TabState {
    [key: number | string]: boolean;
};
export default function NavTab({ className, classNameGroupTab, classNameContent, tabContent, buttonControl = false, gotoFirstTab = false }: NavTabProps) {

    const {getDuLieuKiemDinhJSON} = useKiemDinh();

    useEffect(() => {
        if(gotoFirstTab) {
            setSelectedTab({ [1]: true });
        }
    },[gotoFirstTab])

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
            {/* <h5 className="mb-3">Nhóm lưu lượng:</h5> */}
            <div className={`m-0 w-100`} id={nt['process-tab']}>
                <div className={`${nt['group-tab']} ${classNameGroupTab ? classNameGroupTab : ""}`}>
                    {tabContent.map((val, index) => {
                        return (
                            <button aria-label={`Tab ${index + 1}`} type="button" style={{ minWidth: "80px" }} key={index + 1} className={`${nt['nav-link']} ${selectedTab[index + 1] ? nt['active'] : ''} fs-6 px-4`} onClick={() => toggleTab(index + 1)}>
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
                                <div className={`w-100 px-1 py-3 d-flex justify-content-between ${buttonControl ? "" : "d-none"}`}>
                                    {(0 == index) ? <span></span> : <button aria-label={`Quay lại (${tabContent[index - 1].title})`} className="btn p-0 fw-bold text-dark-blue" onClick={() => toggleTab(index)}>Quay lại ({tabContent[index - 1].title})</button>}

                                    {(tabContent.length - 1 == index) ? "" : <button aria-label={`Tiếp (${tabContent[index + 1].title})`} type="button" className="btn p-0 fw-bold text-dark-blue" onClick={() => toggleTab(index + 2)}>Tiếp ({tabContent[index + 1].title})</button>}

                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}