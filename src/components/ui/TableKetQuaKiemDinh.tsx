import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from "next/dynamic";
const ToggleSwitchButton = dynamic(() => import('@/components/ui/ToggleSwitchButton'));
import { Modal, Button, Form } from 'react-bootstrap';

import '@styles/scss/ui/modal-kiem-dinh.scss';
import c_tbKD from "@styles/scss/components/table-kiem-dinh.module.scss";
import Swal from "sweetalert2";

import { useDongHoList } from '@/context/ListDongHoContext';
import InputField from './InputFieldTBDHInfo';
import { useKiemDinh } from '@/context/KiemDinhContext';
import { DuLieuCacLanChay, DuLieuChayDongHo, DuLieuMotLanChay } from '@lib/types';
import { getHieuSaiSo, getSaiSoDongHo, isDongHoDatTieuChuan } from '@lib/system-function';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCogs, faRemove, faSave } from '@fortawesome/free-solid-svg-icons';
import ModalInputSoLuongDongHo from './ModalInputSoLuongDongHo';
import { ACCESS_LINKS } from '@lib/system-constant';
interface ModalKiemDinhProps {
    show: boolean;
    isEditing?: boolean;
    handleClose: () => void;
}

type ActiveLL = { title: string; value: string } | null;

export default function TableKetQuaKiemDinh({ show, isEditing = false, handleClose }: ModalKiemDinhProps) {
    const [showModal, setShowModal] = useState(show);
    const { luuLuong, getDuLieuChayCuaLuuLuong } = useKiemDinh();
    const {
        dongHoList,
        savedDongHoList,
    } = useDongHoList();
    const [isUsingBinhChuan, setUsingBinhChuan] = useState(false);
    const [activeLL, setActiveLL] = useState<ActiveLL | null>(null);

    useEffect(() => {
        setShowModal(show);
    }, [show]);

    const handleChange = (
        soLan: number,
        indexDongHo: number,
        newDL: DuLieuMotLanChay,
        field: keyof DuLieuMotLanChay
    ) => {
    }

    return (
        luuLuong && <>
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
                            <th>{luuLuong.q3Orn?.title ?? <>Q<sub>III</sub></>}{luuLuong.q3Orn?.value ? " = " + luuLuong.q3Orn?.title : ""}</th>
                            <th>{luuLuong.q2Ort?.title ?? <>Q<sub>II</sub></>}{luuLuong.q2Ort?.value ? " = " + luuLuong.q2Ort?.title : ""}</th>
                            <th>{luuLuong.q1Ormin?.title ?? <>Q<sub>I</sub></>}{luuLuong.q1Ormin?.value ? " = " + luuLuong.q1Ormin?.title : ""}</th>
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
                                            {hieu_sai_so[0].hss}
                                        </td>
                                        <td>
                                            {hieu_sai_so[1].hss}
                                        </td>
                                        <td>
                                            {hieu_sai_so[2].hss}
                                        </td>
                                        <td>
                                            {ket_qua == null ? "Chưa kiểm định" : (ket_qua ? "Đạt" : "Không đạt")}
                                        </td>
                                        <td>
                                            <button
                                                className='btn btn-primary'
                                                disabled={ket_qua == null}
                                            >
                                                BB
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className='btn btn-primary'
                                                disabled={ket_qua == null}
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
