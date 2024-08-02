'use client'


import Link from "next/link";
import { usePathname } from "next/navigation"

export default function PDM() {

    const pathname = usePathname();

    return <>
        PDM
        <Link href={pathname + "/new-pdm"} className="btn btn-success">
            Thêm PDM
        </Link>
    </>
}