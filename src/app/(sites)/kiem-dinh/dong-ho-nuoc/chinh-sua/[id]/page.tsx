"use client"
const DongHoEditPage = dynamic(() => import('@/components/EditDongHo'));
import dynamic from "next/dynamic";


export default function EditDongHoPage({ params }: { params: { id: string } }) {
    return <DongHoEditPage id={params.id}></DongHoEditPage>
}