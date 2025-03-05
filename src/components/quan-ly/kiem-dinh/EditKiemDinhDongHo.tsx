"use client"

import { getDongHoById, getDongHoByGroupId } from "@/app/api/dongho/route";
const Loading = dynamic(() => import('@/components/Loading'));
import { DongHo } from "@lib/types";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { ACCESS_LINKS } from "@lib/system-constant";
import { useDongHoList } from "@/context/ListDongHo";

const KiemDinhNhomDongHoNuocForm = dynamic(() => import("@/components/quan-ly/kiem-dinh/KiemDinhNhomDongHoNuocForm"), { ssr: false });

interface EditKiemDinhDongHo {
    id?: string;
    groupId?: string;
}

export default function EditKiemDinhDongHo({ id, groupId }: EditKiemDinhDongHo) {
    const { setDongHoList, setEditing } = useDongHoList();
    const [dongHoData, setDongHoData] = useState<DongHo>();
    const [loading, setLoading] = useState<boolean>(true);
    const fetchCalled = useRef(false);
    const router = useRouter();

    const fetchGetError = (msg: string) => {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: msg,
            showClass: {
                popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
            },
            hideClass: {
                popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
            },
            confirmButtonColor: "#0980de",
            confirmButtonText: "OK"
        }).then(() => {
            router.push(ACCESS_LINKS.DHN.src)
        });
    }

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                if (!groupId && !id) {
                    fetchGetError("Id không hợp lệ!")
                } else {
                    let res;
                    if (groupId) {
                        res = await getDongHoByGroupId(groupId);
                    } else if (id) {
                        res = await getDongHoById(id);
                    }
                    if (res?.status == 404) {
                        fetchGetError("Id không hợp lệ!")
                    } else if (res?.status == 200 || res?.status == 201) {
                        setEditing(true);
                        if (groupId) {
                            if (res?.data.length <= 0) {
                                fetchGetError("Có lỗi xảy ra trong quá trình truy vấn! Hãy thử lại sau.")
                            } else {
                                setDongHoData(res?.data[0]);
                                setDongHoList(res?.data);
                            }
                        } else if (id) {
                            setDongHoData(res?.data);
                            setDongHoList([res?.data]);
                        }
                    } else {
                        fetchGetError("Có lỗi xảy ra trong quá trình truy vấn! Hãy thử lại sau.")
                    }
                }
            } catch (error) {
                fetchGetError("Có lỗi xảy ra trong quá trình truy vấn! Hãy thử lại sau.")
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, groupId]);

    if (loading) {
        return <Loading></Loading>;
    }

    if (!dongHoData) {
        return <></>;
    }
    return (
        <>
            <KiemDinhNhomDongHoNuocForm generalInfoDongHo={dongHoData} isEditing={true} />
        </>
    );
}