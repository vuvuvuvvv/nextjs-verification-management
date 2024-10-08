"use client"

import dynamic from 'next/dynamic';

const Loading = dynamic(() => import('@/components/loading'), { ssr: false });
const FormDongHoNuocDNLonHon15 = dynamic(() => import('@/components/dong-ho-nuoc-form'), { ssr: false });


interface NewProcessDNBiggerThan15Props {
    className?: string,
}

export default function NewProcessDNBiggerThan15({ className }: NewProcessDNBiggerThan15Props) {
    return <FormDongHoNuocDNLonHon15/>
}

