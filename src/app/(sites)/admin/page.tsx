'use client'

import Link from "next/link";
import AdminLayout from "./layout";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();

    return <AdminLayout>
        <h2>hello Admin Page</h2><br></br>
        <Link href="/">Link to Trang chủ page!</Link>
        <br></br>Or<br></br>
        <button type="button" onClick={() => router.push("/")}>Back to Trang chủ</button>
    </AdminLayout>;
}

export default Page;