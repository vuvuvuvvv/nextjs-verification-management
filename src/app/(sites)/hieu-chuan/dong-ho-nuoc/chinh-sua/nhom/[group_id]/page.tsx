"use client"
const EditHieuChuanDongHo = dynamic(() => import('@/components/quan-ly/hieu-chuan/EditHieuChuanDongHo'));
import dynamic from "next/dynamic";


export default function EditNhomDongHoPage({ params }: { params: { group_id: string } }) {
    return <EditHieuChuanDongHo groupId={params.group_id}></EditHieuChuanDongHo>
}