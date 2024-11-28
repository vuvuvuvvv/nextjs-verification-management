"use client"
const DongHoEditPage = dynamic(() => import('@/components/EditDongHo'));
import dynamic from "next/dynamic";


export default function EditNhomDongHoPage({ params }: { params: { group_id: string } }) {
    return <DongHoEditPage groupId={params.group_id}></DongHoEditPage>
}