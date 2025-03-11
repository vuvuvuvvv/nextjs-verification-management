"use client"
const EditKiemDinhDongHo = dynamic(() => import('@/components/quan-ly/kiem-dinh/EditKiemDinhDongHo'));
import dynamic from "next/dynamic";


export default function EditDongHoPage({ params }: { params: { id: string } }) {
    return <EditKiemDinhDongHo id={params.id}></EditKiemDinhDongHo>
}