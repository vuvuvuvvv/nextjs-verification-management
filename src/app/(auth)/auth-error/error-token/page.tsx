"use client"
import { ACCESS_LINKS } from "@lib/system-constant";
import Link from "next/link";

export default function ErrorToken() {
    return <>
        <h5 className="text-center text-uppercase">Mã xác thực không có hiệu lực</h5>
        <div className="mt-3 d-flex justify-content-center">
            <Link href={ACCESS_LINKS.AUTH_LOGIN.src} className='btn m-0 p-0 '>
                Quay lại đăng nhập
            </Link>
        </div>
    </>
}