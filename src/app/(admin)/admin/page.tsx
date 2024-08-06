'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    return <>
        <h2>hello Admin Page</h2><br></br>
        <Link href="/">Link to Trang chủ page!</Link>
        <br></br>Or<br></br>
        <button type="button" onClick={() => router.push("/")}>Back to Trang chủ</button>
    </>;
}
