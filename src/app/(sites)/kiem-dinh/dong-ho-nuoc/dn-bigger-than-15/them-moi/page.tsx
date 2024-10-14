"use client"

import Loading from '@/components/loading';
import dynamic from 'next/dynamic';
const FormDongHoNuocDNLonHon15 = dynamic(() => import('@/components/dong-ho-nuoc-form'), { ssr: false, loading: () => <Loading /> });

export default function NewProcessDNBiggerThan15() {
    return <FormDongHoNuocDNLonHon15/>
}

