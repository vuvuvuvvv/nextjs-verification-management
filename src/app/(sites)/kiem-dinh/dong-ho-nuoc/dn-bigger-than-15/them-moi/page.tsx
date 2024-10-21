"use client"

import Loading from '@/components/Loading';
import dynamic from 'next/dynamic';
const FormDongHoNuocDNLonHon15 = dynamic(() => import('@/components/DongHoNuocForm'), { ssr: false });

export default function NewProcessDNBiggerThan15() {
    return <FormDongHoNuocDNLonHon15/>
}

