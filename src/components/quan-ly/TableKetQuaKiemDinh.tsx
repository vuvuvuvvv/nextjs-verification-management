import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from "next/dynamic";
const ToggleSwitchButton = dynamic(() => import('@/components/ui/ToggleSwitchButton'));

import '@styles/scss/ui/general-modal.scss';
import c_tbKD from "@styles/scss/components/table-kiem-dinh.module.scss";
import { useDongHoList } from '@/context/ListDongHoContext';
import { useKiemDinh } from '@/context/KiemDinhContext';
import { isDongHoDatTieuChuan } from '@/lib/system-function';
import { DongHo } from '@/lib/types';
import { getBBPreviewUrl, getGCNPreviewUrl } from '@/app/api/download/route';
import { PDFPreviewModal } from '../ui/ModalPDFReview';
interface ModalKiemDinhProps {
    activeLL?: ActiveLL;
    isEditing?: boolean;
}

type ActiveLL = { title: string; value: string } | null;

export default function TableKetQuaKiemDinh({ activeLL, isEditing = false }: ModalKiemDinhProps) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handlePreviewBB = async (dongHo: DongHo) => {
        const url = await getBBPreviewUrl(dongHo);
        if (url) {
            setPdfUrl(url);
            setIsPreviewOpen(true);
        } else {
            alert("Không thể tải xem trước biên bản.");
        }
    };

    const handlePreviewGCN = async (dongHo: DongHo) => {
        const url = await getGCNPreviewUrl(dongHo);
        if (url) {
            setPdfUrl(url);
            setIsPreviewOpen(true);
        } else {
            alert("Không thể tải xem trước biên bản.");
        }
    };

    const { luuLuong } = useKiemDinh();
    const {
        dongHoList,
    } = useDongHoList();

    return (
        luuLuong && <>
            <PDFPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => {
                    setIsPreviewOpen(false);
                    setPdfUrl(null);
                }}
                pdfUrl={pdfUrl}
            />
            <div className={`w-100 m-0 px-1 ${c_tbKD['wrap-process-table']} `}>

                <table className={`table table-bordered mb-0 ${c_tbKD['process-table']}`}>
                    <thead className="">
                        <tr>
                            <th rowSpan={2}>STT</th>
                            <th colSpan={3}>Hiệu sai số (%)</th>
                            <th rowSpan={2}>Kết quả</th>
                            <th colSpan={2}>Xem trước</th>
                        </tr>
                        <tr>
                            <th>{luuLuong.q3Orn?.title ?? <>Q<sub>III</sub></>}{luuLuong.q3Orn?.value ? " = " + luuLuong.q3Orn?.value : ""}</th>
                            <th>{luuLuong.q2Ort?.title ?? <>Q<sub>II</sub></>}{luuLuong.q2Ort?.value ? " = " + luuLuong.q2Ort?.value : ""}</th>
                            <th>{luuLuong.q1Ormin?.title ?? <>Q<sub>I</sub></>}{luuLuong.q1Ormin?.value ? " = " + luuLuong.q1Ormin?.value : ""}</th>
                            <th>Biên bản</th>
                            <th>Giấy chứng nhận</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeLL && (() => {
                            const rows: JSX.Element[] = [];
                            for (let indexDongHo = 0; indexDongHo < dongHoList.length; indexDongHo++) {
                                const dongHo = dongHoList[indexDongHo];

                                const duLieuKiemDinh = dongHo?.du_lieu_kiem_dinh ?
                                    ((isEditing && typeof dongHo?.du_lieu_kiem_dinh != 'string') ?
                                        dongHo?.du_lieu_kiem_dinh : JSON.parse(dongHo?.du_lieu_kiem_dinh)
                                    ) : null;

                                const hieu_sai_so = duLieuKiemDinh.hieu_sai_so;

                                const ket_qua = isDongHoDatTieuChuan(hieu_sai_so);

                                rows.push(
                                    <tr key={indexDongHo}>
                                        <td style={{ padding: "10px" }}>
                                            <span>ĐH {dongHo.index}</span>
                                        </td>
                                        <td>
                                            {hieu_sai_so[0].hss ?? "-"}
                                        </td>
                                        <td>
                                            {hieu_sai_so[1].hss ?? "-"}
                                        </td>
                                        <td>
                                            {hieu_sai_so[2].hss ?? "-"}
                                        </td>
                                        <td>
                                            {ket_qua == null ? "Chưa kiểm định" : (ket_qua ? "Đạt" : "Không đạt")}
                                        </td>
                                        <td>
                                            <button
                                                className='btn btn-primary'
                                                disabled={ket_qua == null}
                                                onClick={() => handlePreviewBB(dongHo)}
                                            >
                                                BB
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className='btn btn-primary'
                                                disabled={!ket_qua}
                                                onClick={() => handlePreviewGCN(dongHo)}
                                            >
                                                GCN
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }

                            return rows;
                        })()}
                    </tbody>
                </table>
            </div>
        </>
    );
}
