import Loading from "@/components/Loading"
import dynamic from "next/dynamic";

const PhongBanMng = dynamic(() => import("@/components/quan-ly/phong-ban/PhongBanMng"), { ssr: false, loading: () => <Loading className="bg-transparent" /> })

import React from "react";

const PhanQuyenPage = React.memo(() => {
    return <PhongBanMng />;
});
export default PhanQuyenPage;