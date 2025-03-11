import Loading from "@/components/Loading"
import dynamic from "next/dynamic";

const HieuChuanNhomDongHoNuocMng = dynamic(() => import("@/components/quan-ly/hieu-chuan/HieuChuanNhomDongHoNuocMng"))
const HieuChuanDongHoNuocMng = dynamic(() => import("@/components/quan-ly/hieu-chuan/HieuChuanDongHoNuocMng"), { ssr: true })

import vrfWm from "@styles/scss/ui/vfm.module.scss"

import NavTab from "@/components/ui/NavTab";

interface DongHoNuocPageProps {
    className?: string
}


export default function DongHoNuocPage({ className }: DongHoNuocPageProps) {

    const tabContent = [
        {
            title: "Hiệu chuẩn theo nhóm",
            content: <HieuChuanNhomDongHoNuocMng />
        },
        {
            title: "Hiệu chuẩn theo đồng hồ",
            content: <HieuChuanDongHoNuocMng />
        }
    ]

    return (
        <div className={`${className ? className : ""} ${vrfWm['wraper']} m-0 w-100 p-2`}>
            <NavTab tabContent={tabContent} className="bg-white" />
        </div>
    )
}