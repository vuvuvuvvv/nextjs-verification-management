import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from "next/dynamic";
const ToggleSwitchButton = dynamic(() => import('@/components/ui/ToggleSwitchButton'));
import { Modal, Button, Form } from 'react-bootstrap';

import '@styles/scss/ui/general-modal.scss';
import c_tbKD from "@styles/scss/components/table-kiem-dinh.module.scss";
import Swal from "sweetalert2";

import { useDongHoList } from '@/context/ListDongHoContext';
import InputField from '../ui/InputFieldTBDHInfo';
import { useKiemDinh } from '@/context/KiemDinhContext';
import { DuLieuCacLanChay, DuLieuMotLanChay } from '@/lib/types';
import { getHieuSaiSo, getSaiSoDongHo } from '@/lib/system-function';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCogs, faRemove, faSave } from '@fortawesome/free-solid-svg-icons';
import ModalInputSoLuongDongHo from '../ui/ModalInputSoLuongDongHo';
import { ACCESS_LINKS } from '@/lib/system-constant';
import TableKetQuaKiemDinh from './TableKetQuaKiemDinh';
import NavTab from '../ui/NavTab';
interface ModalKiemDinhProps {
    show: boolean;
    isEditing?: boolean;
    handleClose: () => void;
}

type ActiveLL = { title: string; value: string } | null;

export default function ModalKiemDinh({ show, isEditing = false, handleClose }: ModalKiemDinhProps) {
    const [showModal, setShowModal] = useState(show);
    const [showModalNhapSoLuong, setShowModalNhapSoLuong] = useState(false);
    const { luuLuong, getDuLieuChayCuaLuuLuong, updateLuuLuong, themLanChayCuaLuuLuong, xoaLanChayCuaLuuLuong } = useKiemDinh();
    const {
        createListDongHo,
        dongHoList,
        getDongHoChuaKiemDinh,
        savedDongHoList,
    } = useDongHoList();
    const [isUsingBinhChuan, setUsingBinhChuan] = useState(false);
    const [usingBinhChuanFlag, setUsingBinhChuanFlag] = useState(false);

    const [activeLL, setActiveLL] = useState<ActiveLL | null>(null);

    useEffect(() => {
        if (luuLuong && activeLL == null) {
            setActiveLL(luuLuong.q3Orn)
        }
    }, [luuLuong])

    useEffect(() => {
        setShowModal(show);
    }, [show]);

    const handleSwitchLL = (ll: ActiveLL) => {
        if (ll) setActiveLL(ll);
    };

    const debounceRef = useRef<NodeJS.Timeout | null>(null)
    const debounceFlagUsingBinhChuanRef = useRef<NodeJS.Timeout | null>(null)

    const handleFlagBinhChuan = () => {
        if (debounceFlagUsingBinhChuanRef.current) {
            clearTimeout(debounceFlagUsingBinhChuanRef.current);
        }

        debounceFlagUsingBinhChuanRef.current = setTimeout(() => {
            setUsingBinhChuanFlag(true);
            setUsingBinhChuan(true);
        }, 300);

    }

    const handleChange = (
        soLan: number,
        indexDongHo: number,
        newDL: DuLieuMotLanChay,
        field: keyof DuLieuMotLanChay
    ) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (!isUsingBinhChuan) {
            const vc1 = newDL.Vc1 ? parseFloat(newDL.Vc1.toString()) : null;
            const vc2 = newDL.Vc2 ? parseFloat(newDL.Vc2.toString()) : null;

            newDL = {
                ...newDL,
                Vc: (vc1 && vc2 && vc2 > vc1 ? parseFloat((vc2 - vc1).toFixed(4)) : 0)
            }
        } else {
            newDL = {
                ...newDL,
                Vc1: "0",
                Vc2: "0"
            }
        }

        if (activeLL) {
            const oldDL = getDuLieuChayCuaLuuLuong(activeLL, indexDongHo);
            // Tạo 1 bản sao để cập nhật lần chạy hiện tại
            let updatedDL: DuLieuCacLanChay = { ...oldDL, [soLan]: newDL };
            const nextSoLan = soLan + 1;
            if (oldDL[nextSoLan]) {
                if (field === "V2") {
                    updatedDL[nextSoLan] = {
                        ...oldDL[nextSoLan],
                        // Cập nhật V1 của lần chạy tiếp theo
                        V1: parseFloat(newDL.V2.toString())
                    };
                }
                if (field === "Vc2") {
                    updatedDL[nextSoLan] = {
                        ...oldDL[nextSoLan],
                        // Cập nhật Vc1 của lần chạy tiếp theo
                        Vc1: parseFloat((newDL.Vc2 ?? 0).toString())
                    };
                }
            }
            updateLuuLuong(activeLL, updatedDL, indexDongHo);



            // updateLuuLuong(activeLL, { ...oldDL, [soLan]: newDL }, indexDongHo)
        }
    }

    const handleSaveAllDongHo = () => {
        const dongHoChuaKiemDinh = getDongHoChuaKiemDinh(dongHoList);
        const dongHoDaKiemDinhCount = dongHoList.length - dongHoChuaKiemDinh.length;
        if (dongHoChuaKiemDinh.length === 0) {
            // All dongHo are verified
            Swal.fire({
                title: 'Xác nhận!',
                text: 'Xác nhận lưu toàn bộ?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Hủy',
                confirmButtonText: 'Lưu',
                reverseButtons: true
            }).then((rs) => {
                if (rs.isConfirmed) {
                    const dongHoToSave = dongHoList.filter(dongHo => !savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)));
                    Swal.fire({
                        title: 'Đang lưu đồng hồ',
                        html: 'Đang chuẩn bị...',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                            // createListDongHo(dongHoToSave).then((isSuccessful) => {
                            //     if (isSuccessful) {
                            //         window.location.href = ACCESS_LINKS.DHN.src;
                            //     }
                            // });
                        }
                    });
                }
            });
        } else if (dongHoDaKiemDinhCount === 0 || (dongHoChuaKiemDinh.length == dongHoList.length - savedDongHoList.length)) {
            // No dongHo are verified
            Swal.fire({
                title: 'Chú ý!',
                text: 'Chưa có đồng hồ nào được kiểm định, hãy kiểm tra lại.',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
            });
        } else if (dongHoList.length == savedDongHoList.length) {
            
        } else {
            Swal.fire({
                title: 'Chú ý!',
                text: 'Đồng hồ ' + (
                    dongHoChuaKiemDinh.length > 3
                        ? dongHoChuaKiemDinh.slice(0, 3).map((dongHo, i) => (dongHoList.indexOf(dongHo) + 1)).join(', ') + ',...'
                        : dongHoChuaKiemDinh.map((dongHo, i) => (dongHoList.indexOf(dongHo) + 1)).join(', ')
                ) + ' chưa kiểm định xong.'
                ,
                icon: 'warning',
                cancelButtonColor: '#d33',
                reverseButtons: true
            })
        }
    }

    const tabContent = [
        {
            title: "Kiểm định",
            content: <>
                <div className='w-100 d-flex align-items-center justify-content-between gap-3 px-3 mb-3'>
                    <div className=' d-flex align-items-center gap-2'>
                        <ToggleSwitchButton
                            value={isUsingBinhChuan}
                            onChange={(value: boolean) => setUsingBinhChuan(value)}
                            disabled={savedDongHoList.length != 0}
                        /><span className={`${isUsingBinhChuan ? "text-dark" : "text-secondary"}`}>Sử dụng bình chuẩn</span>
                    </div>
                    <div className=' d-flex align-items-center gap-2'>
                        <button className='btn btn-secondary' onClick={() => { setShowModalNhapSoLuong(true); setShowModal(false) }}>
                            <FontAwesomeIcon icon={faCogs} className='me-1' />Số đồng hồ
                        </button>
                        <button className='btn btn-success' onClick={() => { if (activeLL) themLanChayCuaLuuLuong(activeLL) }}>
                            <FontAwesomeIcon icon={faAdd} className='me-1' />Thêm 1 lần
                        </button>
                        <button className='btn btn-secondary' onClick={() => { if (activeLL) xoaLanChayCuaLuuLuong(activeLL) }}>
                            <FontAwesomeIcon icon={faRemove} className='me-1' />Xóa 1 lần
                        </button>
                    </div>
                </div>
                <div className={`${c_tbKD['group-switch-button']}`} >
                    <button
                        type="button"
                        className={`btn ${activeLL && activeLL === (luuLuong && luuLuong.q3Orn ? luuLuong.q3Orn : null) ? c_tbKD['active'] : ""}`}
                        onClick={() => handleSwitchLL(luuLuong?.q3Orn ?? null)}
                    >
                        {luuLuong && luuLuong.q3Orn ? luuLuong.q3Orn.title : ""}
                    </button>
                    <button
                        type="button"
                        className={`btn ${activeLL && activeLL === (luuLuong && luuLuong.q2Ort ? luuLuong.q2Ort : null) ? c_tbKD['active'] : ""}`}
                        onClick={() => handleSwitchLL(luuLuong?.q2Ort ?? null)}
                    >
                        {luuLuong && luuLuong.q2Ort ? luuLuong.q2Ort.title : ""}
                    </button>
                    <button
                        type="button"
                        className={`btn ${activeLL && activeLL === (luuLuong && luuLuong.q1Ormin ? luuLuong.q1Ormin : null) ? c_tbKD['active'] : ""}`}
                        onClick={() => handleSwitchLL(luuLuong?.q1Ormin ?? null)}
                    >
                        {luuLuong && luuLuong.q1Ormin ? luuLuong.q1Ormin.title : ""}
                    </button>
                </div>
                <div className={`w-100 m-0 px-1 ${c_tbKD['wrap-process-table']} `}>

                    <table className={`table table-bordered mb-0 ${c_tbKD['process-table']}`}>
                        <thead className="">
                            <tr>
                                <th colSpan={2} rowSpan={2}>Q={activeLL?.value}<br /><span>(m<sup>3</sup>/h)</span></th>
                                <th colSpan={4}>Số chỉ trên đồng hồ</th>
                                <th colSpan={!isUsingBinhChuan ? 4 : 2}>Số chỉ trên chuẩn</th>
                                <th rowSpan={2}>δ</th>
                                <th rowSpan={2} style={{ maxWidth: "75px" }}>Hiệu sai số</th>
                            </tr>
                            <tr>
                                <th>V<sub>1</sub></th>
                                <th>V<sub>2</sub></th>
                                <th>V<sub>đh</sub></th>
                                <th>T</th>
                                {!isUsingBinhChuan && <>
                                    <th>V<sub>c1</sub></th>
                                    <th>V<sub>c2</sub></th>
                                </>}
                                <th>V<sub>c</sub></th>
                                <th>T</th>
                            </tr>
                            <tr>
                                <th>STT</th>
                                <th>Lần</th>
                                <td>Lít</td>
                                <td>Lít</td>
                                <td>Lít</td>
                                <td>°C</td>

                                {!isUsingBinhChuan && <>
                                    <td>Lít</td>
                                    <td>Lít</td>
                                </>}
                                <td>Lít</td>
                                <td>°C</td>
                                <td>%</td>
                                <td>%</td>
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

                                        if (isEditing && !usingBinhChuanFlag && (!dl.Vc1 && !dl.Vc2 || dl.Vc2 == 0 && dl.Vc1 == 0)) {
                                            handleFlagBinhChuan();
                                        }

                                        rows.push(
                                            <tr key={indexDongHo + "_" + i}>
                                                {i == 0 && <td rowSpan={Object.keys(duLieuCacLanChay).length} style={{ padding: "10px" }}>
                                                    <span>ĐH {dongHo.index}</span>
                                                </td>}
                                                <td>
                                                    {i + 1}
                                                </td>
                                                <td>
                                                    <InputField
                                                        index={rowIndex}
                                                        isNumber={true}
                                                        value={dl.V1.toString()}
                                                        // onChange={(value) => handleInputChange(index, "serial", value)}
                                                        onChange={(value) => { handleChange((i + 1), indexDongHo, { ...dl, V1: Number(value) }, "V1") }}
                                                        disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                        // error={errorsList[index]?.serial}
                                                        name={`v1`}
                                                    />
                                                </td>
                                                <td>
                                                    <InputField
                                                        index={rowIndex}
                                                        isNumber={true}
                                                        value={dl.V2.toString()}
                                                        onChange={(value) => { handleChange((i + 1), indexDongHo, { ...dl, V2: Number(value) }, "V2") }}
                                                        disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                        // error={errorsList[index]?.serial}
                                                        name={`v2`}
                                                    />
                                                </td>
                                                <td>
                                                    <InputField
                                                        index={rowIndex}
                                                        isNumber={true}
                                                        className={`${(dl.V2 > dl.V1) ? "" : "bg-danger text-white"}`}
                                                        value={(dl.V2 > dl.V1) ? Number((dl.V2 - dl.V1).toFixed(4)).toString() : "0"}
                                                        // onChange={(value) => handleInputChange(index, "serial", value)}
                                                        disabled={true}
                                                        // error={errorsList[index]?.serial}
                                                        name={`vdh`}
                                                    />
                                                </td>
                                                <td>
                                                    <InputField
                                                        index={rowIndex}
                                                        isNumber={true}
                                                        value={dl.Tdh.toString()}
                                                        // onChange={(value) => handleInputChange(index, "serial", value)}
                                                        onChange={(value) => { handleChange((i + 1), indexDongHo, { ...dl, Tdh: Number(value) }, "Tdh") }}
                                                        disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                        // error={errorsList[index]?.serial}
                                                        name={`tdh`}
                                                    />
                                                </td>

                                                {!isUsingBinhChuan && <>
                                                    <td>
                                                        <InputField
                                                            index={rowIndex}
                                                            isNumber={true}
                                                            value={(dl.Vc1 ? dl.Vc1 : 0).toString()}
                                                            // onChange={(value) => handleInputChange(index, "serial", value)}
                                                            onChange={(value) => { handleChange((i + 1), indexDongHo, { ...dl, Vc1: value }, "Vc1") }}
                                                            disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                            // error={errorsList[index]?.serial}
                                                            name={`vc1`}
                                                        />
                                                    </td>
                                                    <td>
                                                        <InputField
                                                            index={rowIndex}
                                                            isNumber={true}
                                                            value={(dl.Vc2 ? dl.Vc2 : 0).toString()}
                                                            // onChange={(value) => handleInputChange(index, "serial", value)}
                                                            onChange={(value) => { handleChange((i + 1), indexDongHo, { ...dl, Vc2: value }, "Vc2") }}
                                                            disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                            // error={errorsList[index]?.serial}
                                                            name={`vc2`}
                                                        />
                                                    </td>
                                                </>}
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
                                                    <InputField
                                                        index={rowIndex}
                                                        isNumber={true}
                                                        value={dl.Tc.toString()}
                                                        // onChange={(value) => handleInputChange(index, "serial", value)}
                                                        onChange={(value) => { handleChange((i + 1), indexDongHo, { ...dl, Tc: Number(value) }, "Tc") }}
                                                        disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                        // error={errorsList[index]?.serial}
                                                        name={`tc`}
                                                    />
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
        },
        {
            title: "Kết quả",
            content: <TableKetQuaKiemDinh activeLL={activeLL} isEditing={isEditing} />
        }
    ]

    return (
        <>
            <ModalInputSoLuongDongHo show={showModalNhapSoLuong} handleClose={
                () => {
                    setShowModalNhapSoLuong(false);
                    setShowModal(true);
                }
            } />
            <Modal show={showModal} dialogClassName={`modal-kiem-dinh`} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Kiểm định</Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-0 overflow-hidden'>

                    <NavTab tabContent={tabContent} className="bg-white" />
                    
                </Modal.Body>
                <Modal.Footer className={`d-flex align-items-center justify-content-end`}>
                    <button
                        type="button"
                        className={`btn btn-success`}
                        onClick={handleSaveAllDongHo}
                    >
                        <FontAwesomeIcon icon={faSave} className='me-2' />
                        Lưu
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
