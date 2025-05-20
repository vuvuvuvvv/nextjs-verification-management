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
import { DuLieuCacLanChay, DuLieuMotLanChay } from '@lib/types';
import { getHieuSaiSo, getSaiSoDongHo } from '@lib/system-function';
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
                            <th rowSpan={2}>Lần</th>
                            <th colSpan={2}>{luuLuong.q3Orn?.title ?? <>Q<sub>III</sub></>}{luuLuong.q3Orn?.value ? " = " + luuLuong.q3Orn?.title : ""}</th>
                            <th colSpan={2}>{luuLuong.q2Ort?.title ?? <>Q<sub>II</sub></>}{luuLuong.q2Ort?.value ? " = " + luuLuong.q2Ort?.title : ""}</th>
                            <th colSpan={2}>{luuLuong.q1Ormin?.title ?? <>Q<sub>I</sub></>}{luuLuong.q1Ormin?.value ? " = " + luuLuong.q1Ormin?.title : ""}</th>
                            <th rowSpan={2}>Kết quả</th>
                        </tr>
                        <tr>                            
                            <th>δ (%)</th>
                            <th style={{ maxWidth: "75px" }}>Hiệu sai số (%)</th>
                            <th>δ (%)</th>
                            <th style={{ maxWidth: "75px" }}>Hiệu sai số (%)</th>
                            <th>δ (%)</th>
                            <th style={{ maxWidth: "75px" }}>Hiệu sai số (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeLL && (() => {
                            const rows: JSX.Element[] = [];
                            for (let indexDongHo = 0; indexDongHo < dongHoList.length; indexDongHo++) {
                                const dongHo = dongHoList[indexDongHo];

                                const duLieuCacLanChay = getDuLieuChayCuaLuuLuong(activeLL, indexDongHo);

                                const hss = getHieuSaiSo(duLieuCacLanChay);

                                Object.entries(duLieuCacLanChay).map(([key, dl], i) => {
                                    const rowIndex = indexDongHo * Object.keys(duLieuCacLanChay).length + i;
                                    const ss = parseFloat((getSaiSoDongHo(dl) ?? 0).toFixed(2));

                                    rows.push(
                                        <tr key={indexDongHo + "_" + i}>
                                            {i == 0 && <td rowSpan={Object.keys(duLieuCacLanChay).length} style={{ padding: "10px" }}>
                                                <span>ĐH {dongHo.index}</span>
                                            </td>}
                                            <td>
                                                {i + 1}
                                            </td>
                                            <td>
                                                {(dl.V2 > dl.V1) ? Number((dl.V2 - dl.V1).toFixed(4)).toString() : "0"}
                                            </td>
                                            <td>
                                                <InputField
                                                    index={rowIndex}
                                                    isNumber={true}
                                                    value={(dl.Vc ? dl.Vc : 0).toString()}
                                                    className={`${(isUsingBinhChuan || dl.Vc2 && dl.Vc1 && dl.Vc2 > dl.Vc1) ? "" : "bg-danger text-white"}`}
                                                    onChange={(value) => { handleChange((i + 1), indexDongHo, { ...dl, Vc: value }, "Vc") }}
                                                    disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length || !isUsingBinhChuan}
                                                    // error={errorsList[index]?.serial}
                                                    name={`vc`}
                                                />
                                            </td>
                                            <td>
                                                {dl.Tc.toString()}
                                            </td>
                                            <td style={{ width: "50px", padding: "6px" }}>{ss}</td>
                                            {i == 0 && <td rowSpan={Object.keys(duLieuCacLanChay).length} style={{ width: "50px", padding: "6px" }}>
                                                {parseFloat((hss ?? 0).toFixed(2))}
                                            </td>}
                                        </tr>
                                    );
                                });

                            }

                            return rows;
                        })()}
                    </tbody>
                </table>
            </div>
        </>
    );
}
