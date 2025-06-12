import Loading from "@/components/Loading"
import dynamic from "next/dynamic";

const HieuChuanNhomDongHoNuocManagement = dynamic(() => import("@/components/quan-ly/hieu-chuan/NhomDongHoNuocMng"))
const DongHoNuocMng = dynamic(() => import("@/components/quan-ly/hieu-chuan/DongHoNuocMng"), { ssr: true })

import vrfWm from "@styles/scss/ui/vfm.module.scss"

import NavTab from "@/components/ui/NavTab";


export default function DongHoNuocPage() {

    const tabContent = [
        {
            title: "Hiệu chuẩn theo nhóm",
            content: <HieuChuanNhomDongHoNuocManagement />
        },
        {
            title: "Hiệu chuẩn theo đồng hồ",
            content: <DongHoNuocMng />
        }
    ]

    return (
        <div className={`${vrfWm['wraper']} m-0 w-100 p-2`}>
            <NavTab tabContent={tabContent} className="bg-white" />
        </div>
    )
}