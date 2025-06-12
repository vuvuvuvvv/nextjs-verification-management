"use client"
const EditHieuChuanDongHo = dynamic(() => import('@/components/quan-ly/hieu-chuan/EditHieuChuanDongHo'));
import dynamic from "next/dynamic";


export default function EditDongHoPage({ params }: { params: { id: string } }) {
    return <EditHieuChuanDongHo id={params.id}></EditHieuChuanDongHo>
}