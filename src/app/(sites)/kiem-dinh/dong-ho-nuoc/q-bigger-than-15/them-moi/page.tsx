"use client"

import Loading from '@/components/Loading';
import dynamic from 'next/dynamic';
const FormDongHoNuocQLonHon15 = dynamic(() => import('@/components/DongHoNuocForm'), { ssr: false });

export default function NewProcessQBiggerThan15() {
    return <FormDongHoNuocQLonHon15/>
}

