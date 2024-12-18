"use client"
import Loading from "@/components/Loading"
import dynamic from "next/dynamic";

const WaterMeterManagement = dynamic(() => import("@/components/quan-ly/kiem-dinh/DongHoNuocMng"), { ssr: false, loading: () => <Loading /> })
const DongHoPermissionsManagement = dynamic(() => import("@/components/quan-ly/phan-quyen/DongHoPermissionsMng"), { ssr: false })

import { useUser } from "@/context/AppContext"
import { useEffect, useState } from "react";
import { DongHo } from "@lib/types";
import Swal from "sweetalert2";
import { getNameOfRole } from "@lib/system-function";

export default function PhanQuyenPage() {
    const { user } = useUser();
    const [dongHoSelected, setDongHo] = useState<DongHo | null>(null);
    const [error, setError] = useState("");

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

    

    return <div className={`w-100 p-3 position-relative`} style={{minHeight: "80vh"}}>
        <DongHoPermissionsManagement className={dongHoSelected ? "show" : "d-none"} dongHoSelected={dongHoSelected} setSelectedDongHo={setDongHo} />
        <WaterMeterManagement className={dongHoSelected ? "d-none" : ""} setSelectedDongHo={setDongHo} isAutorizing={true} />
    </div>
}