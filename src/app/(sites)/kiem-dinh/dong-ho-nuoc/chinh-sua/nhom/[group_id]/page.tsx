"use client"
const EditKiemDinhDongHo = dynamic(() => import('@/components/quan-ly/kiem-dinh/EditKiemDinhDongHo'));
import dynamic from "next/dynamic";


export default function EditNhomDongHoPage({ params }: { params: { group_id: string } }) {
    return <EditKiemDinhDongHo groupId={params.group_id}></EditKiemDinhDongHo>
}