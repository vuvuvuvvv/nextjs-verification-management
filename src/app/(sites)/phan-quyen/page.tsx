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
import { getNhomDongHoByGroupId } from "@/app/api/dongho/route";

export default function PhanQuyenPage() {
    const [dongHoSelected, setDongHo] = useState<DongHo | null>(null);
    const [groupIdSelected, setGroupId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState<boolean>(true);
    const [dataListDongHo, setDataListDongHo] = useState<DongHo[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const fetchData = async (groupId: string) => {
        if (isMounted) {
            try {
                const res = await getNhomDongHoByGroupId(groupId);
                setDataListDongHo(res?.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (groupIdSelected) {
            fetchData(groupIdSelected);
        }
    }, [groupIdSelected])

    const tabContent = [
        dataListDongHo.length == 0 ? {
            title: "Phần quyền nhóm",
            content: <NhomDongHoNuocManagement setSelectedGroupId={setGroupId} isAuthorizing={true} />
        } : { title: null, content: null },
        {
            title: "Phần quyền đồng hồ",
            content: <WaterMeterManagement dataList={dataListDongHo} setDataList={setDataListDongHo} setSelectedDongHo={setDongHo} isAuthorizing={true} />
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
}