import Loading from "@/components/Loading"
import dynamic from "next/dynamic";

const NhomDongHoNuocManagement = dynamic(() => import("@/components/quan-ly/kiem-dinh/NhomDongHoNuocMng"), { ssr: false })
const WaterMeterManagement = dynamic(() => import("@/components/quan-ly/kiem-dinh/DongHoNuocMng"), { ssr: false, loading: () => <Loading /> })

import vrfWm from "@styles/scss/ui/vfm.module.scss"

import NavTab from "@/components/NavTab";

interface DNSmallerThan32Props {
    className?: string
}


export default function DNSmallerThan32({ className }: DNSmallerThan32Props) {

    const tabContent = [
        {
            title: "Quản lý theo nhóm",
            content: <NhomDongHoNuocManagement />
        },
        {
            title: "Quản lý theo đồng hồ",
            content: <WaterMeterManagement />
        }
    ]

    return (
        <div className={`${className ? className : ""} ${vrfWm['wraper']} m-0 w-100 p-2`}>
            <NavTab tabContent={tabContent} className="bg-white" />
        </div>
    )
}