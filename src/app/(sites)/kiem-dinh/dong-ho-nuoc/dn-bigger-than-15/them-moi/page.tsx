"use client"

import dynamic from 'next/dynamic';

const FormDongHoNuocDNLonHon15 = dynamic(() => import('@/components/dong-ho-nuoc-form'));


interface NewProcessDNBiggerThan15Props {
    className?: string,
}

export default function NewProcessDNBiggerThan15({ className }: NewProcessDNBiggerThan15Props) {
    return <FormDongHoNuocDNLonHon15/>
}

