
const ProcessManagement = dynamic(() => import("@/components/verification-management/process"), { ssr: false })
const WaterMeterManagement = dynamic(() => import("@/components/verification-management/watermeter"), { ssr: false })

import vrfWm from "@styles/scss/ui/vfm.module.scss"

// Use getStaticProps
import { sampleReportData, sampleWaterMeterData } from "@lib/sample-data";
import dynamic from "next/dynamic";
import { ReportDataType } from "@lib/types";
import NavTab from "@/components/nav-tab";

interface DNSmallerThan32Props {
    className?: string,
    reportData: ReportDataType[]
}

// TODO: get data from API
function getReportData() {
    const reportData = sampleReportData;
    return reportData;
}


export default function DNSmallerThan32({ className }: DNSmallerThan32Props) {

    const reportData = getReportData();

    const tabContent = [
        {
            title: "Quản lý theo nhóm",
            content: <ProcessManagement data={reportData} />
        },
        {
            title: "Quản lý theo đồng hồ",
            content: <WaterMeterManagement data={sampleWaterMeterData} />
        }
    ]

    return (
        <div className={`${className ? className : ""} ${vrfWm['wraper']} m-0 p-0 w-100 px-lg-3 py-lg-2 p-xl-0 px-xxl-3 py-xxl-2`}>
            <NavTab tabContent={tabContent} />
        </div>
    )
}