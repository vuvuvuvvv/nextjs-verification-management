"use client"
import Loading from "@/components/Loading"
import dynamic from "next/dynamic";

const NhomDongHoNuocManagement = dynamic(() => import("@/components/quan-ly/kiem-dinh/NhomDongHoNuocMng"), { ssr: false, loading: () => <Loading className="bg-transparent" /> })
const WaterMeterManagement = dynamic(() => import("@/components/quan-ly/kiem-dinh/DongHoNuocMng"), { ssr: false, loading: () => <Loading className="bg-transparent" /> })
const DongHoPermissionsManagement = dynamic(() => import("@/components/quan-ly/phan-quyen/DongHoPermissionsMng"), { ssr: false })

import { useEffect, useRef, useState } from "react";
import { DongHo } from "@lib/types";
import Swal from "sweetalert2";
import NavTab from "@/components/ui/NavTab";
import { getDongHoByGroupId } from "@/app/api/dongho/route";
import React from "react";

const PhanQuyenPage = React.memo(() => {
    const [dongHoSelected, setDongHo] = useState<DongHo | null>(null);
    const [groupIdSelected, setGroupId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState<boolean>(true);
    const [dataListDongHo, setDataListDongHo] = useState<DongHo[]>([]);

    const fetchData = async (groupId: string) => {
        try {
            const res = await getDongHoByGroupId(groupId);
            setDataListDongHo(res?.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (groupIdSelected) {
            fetchData(groupIdSelected);
        }
    }, [groupIdSelected])

    const clearNDHData = () => {
        setDataListDongHo([]);
        setGroupId("");
    }

    const tabContent = [
        {
            title: "Phần quyền nhóm",
            content: <>
                {dataListDongHo.length > 0 ?
                    <WaterMeterManagement dataList={dataListDongHo} clearNDHPropData={clearNDHData} setSelectedDongHo={setDongHo} isAuthorizing={true} /> :
                    <NhomDongHoNuocManagement setSelectedGroupId={setGroupId} isAuthorizing={true} />
                }
            </>
        },
        {
            title: "Phần quyền đồng hồ",
            content: <WaterMeterManagement setSelectedDongHo={setDongHo} isAuthorizing={true} />
        }
    ]
    // Func: Set err
    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: error,
                showClass: {
                    popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                  `
                },
                hideClass: {
                    popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                  `
                },
                confirmButtonColor: "#0980de",
                confirmButtonText: "OK"
            }).then(() => {
                setError("");
            });
        }
    }, [error]);

    return <div className={`w-100 p-3 position-relative`} style={{ minHeight: "80vh" }}>
        <DongHoPermissionsManagement className={dongHoSelected ? "show" : "d-none"} dongHoSelected={dongHoSelected} setSelectedDongHo={setDongHo} />

        <NavTab tabContent={tabContent} className={`${dongHoSelected ? "d-none" : ""} bg-white`} />
    </div>
});
export default PhanQuyenPage;