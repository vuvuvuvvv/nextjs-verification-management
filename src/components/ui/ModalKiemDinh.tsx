import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from "next/dynamic";
const ToggleSwitchButton = dynamic(() => import('@/components/ui/ToggleSwitchButton'));
import { Modal, Button, Form } from 'react-bootstrap';

import '@styles/scss/ui/modal-kiem-dinh.scss';
import c_tbKD from "@styles/scss/components/table-kiem-dinh.module.scss";

import { useDongHoList } from '@/context/ListDongHoContext';
import InputField from './InputFieldTBDHInfo';
interface ModalKiemDinhProps {
    show: boolean;
    handleClose: () => void;
}

export default function ModalKiemDinh({ show, handleClose }: ModalKiemDinhProps) {
    const { dongHoList, savedDongHoList } = useDongHoList();
    const [isUsingBinhChuan, setUsingBinhChuan] = useState(false);

    return (
        <Modal show={show} dialogClassName={`modal-kiem-dinh`} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Kiểm định</Modal.Title>
            </Modal.Header>
            <Modal.Body className='px-0'>
                <div className='w-100 d-flex align-items-center gap-3 px-3 mb-3'>
                    <ToggleSwitchButton
                        value={isUsingBinhChuan}
                        onChange={(value: boolean) => setUsingBinhChuan(value)}
                        disabled={savedDongHoList.length != 0}
                    /><span className={`${isUsingBinhChuan ? "text-dark" : "text-secondary"}`}>Sử dụng bình chuẩn</span>
                </div>
                <div className={`w-100 m-0 mb-3 px-1 ${c_tbKD['wrap-process-table']} `}>

                    <table className={`table table-bordered mb-0 ${c_tbKD['process-table']}`}>
                        <thead className="">
                            <tr>
                                <th colSpan={2} rowSpan={2}>Q= <br /><span>(m<sup>3</sup>/h)</span></th>
                                <th colSpan={4}>Số chỉ trên đồng hồ</th>
                                <th colSpan={!isUsingBinhChuan ? 4 : 2}>Số chỉ trên chuẩn</th>
                                <th rowSpan={2}>δ</th>
                                <th rowSpan={2} style={{ maxWidth: "50px" }}>Hiệu sai số</th>
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
                            {(() => {
                                const rows = [];
                                for (let index = 0; index < dongHoList.length; index++) {
                                    const dongHo = dongHoList[index];

                                    const duLieuKiemDinhJSON = dongHo.du_lieu_kiem_dinh;
                                    const duLieuKiemDinh = duLieuKiemDinhJSON ?
                                        ((typeof duLieuKiemDinhJSON != 'string') ?
                                            duLieuKiemDinhJSON : JSON.parse(duLieuKiemDinhJSON)
                                        ) : null;
                                    // console.log(index,": ", duLieuKiemDinh);
                                    // const status = duLieuKiemDinh ? duLieuKiemDinh.ket_qua : null;
                                    // const objHss = duLieuKiemDinh ? duLieuKiemDinh.hieu_sai_so : null;
                                    // const objMf = duLieuKiemDinh ? duLieuKiemDinh.mf : null;

                                    // const isDHDienTu = Boolean((dongHo.ccx && ["1", "2"].includes(dongHo.ccx)) || dongHo.kieu_thiet_bi == "Điện tử");

                                    rows.push(
                                        <tr key={index}>
                                            {/* Check so lan => rowS */}
                                            <td rowSpan={1} style={{ padding: "10px" }} onClick={() => {
                                                // selectDongHo(index)
                                            }}>
                                                <span>ĐH {dongHo.index}</span>
                                            </td>
                                            <td>
                                                {/* so lan */}
                                                1
                                            </td>
                                            <td>
                                                <InputField
                                                    index={index}
                                                    isNumber={true}
                                                    value={dongHo.serial ?? ""}
                                                    // onChange={(value) => handleInputChange(index, "serial", value)}
                                                    onChange={(value) => { }}
                                                    disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                    // error={errorsList[index]?.serial}
                                                    name={`v1`}
                                                />
                                            </td>
                                            <td>
                                                <InputField
                                                    index={index}
                                                    isNumber={true}
                                                    value={dongHo.serial ?? ""}
                                                    // onChange={(value) => handleInputChange(index, "serial", value)}
                                                    onChange={(value) => { }}
                                                    disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                    // error={errorsList[index]?.serial}
                                                    name={`v2`}
                                                />
                                            </td>
                                            <td>
                                                <InputField
                                                    index={index}
                                                    isNumber={true}
                                                    value={dongHo.serial ?? ""}
                                                    // onChange={(value) => handleInputChange(index, "serial", value)}
                                                    onChange={(value) => { }}
                                                    disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                    // error={errorsList[index]?.serial}
                                                    name={`vdh`}
                                                />
                                            </td>
                                            <td>
                                                <InputField
                                                    index={index}
                                                    isNumber={true}
                                                    value={dongHo.serial ?? ""}
                                                    // onChange={(value) => handleInputChange(index, "serial", value)}
                                                    onChange={(value) => { }}
                                                    disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                    // error={errorsList[index]?.serial}
                                                    name={`tdh`}
                                                />
                                            </td>

                                            {!isUsingBinhChuan && <>
                                                <td>
                                                    <InputField
                                                        index={index}
                                                        isNumber={true}
                                                        value={dongHo.serial ?? ""}
                                                        // onChange={(value) => handleInputChange(index, "serial", value)}
                                                        onChange={(value) => { }}
                                                        disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                        // error={errorsList[index]?.serial}
                                                        name={`vc1`}
                                                    />
                                                </td>
                                                <td>
                                                    <InputField
                                                        index={index}
                                                        isNumber={true}
                                                        value={dongHo.serial ?? ""}
                                                        // onChange={(value) => handleInputChange(index, "serial", value)}
                                                        onChange={(value) => { }}
                                                        disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                        // error={errorsList[index]?.serial}
                                                        name={`vc2`}
                                                    />
                                                </td>
                                            </>}
                                            <td>
                                                <InputField
                                                    index={index}
                                                    isNumber={true}
                                                    value={dongHo.serial ?? ""}
                                                    // onChange={(value) => handleInputChange(index, "serial", value)}
                                                    onChange={(value) => { }}
                                                    disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                    // error={errorsList[index]?.serial}
                                                    name={`vc`}
                                                />
                                            </td>
                                            <td>
                                                <InputField
                                                    index={index}
                                                    isNumber={true}
                                                    value={dongHo.serial ?? ""}
                                                    // onChange={(value) => handleInputChange(index, "serial", value)}
                                                    onChange={(value) => { }}
                                                    disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                    // error={errorsList[index]?.serial}
                                                    name={`tc`}
                                                />
                                            </td>
                                            <td style={{ width: "50px" }}>1</td>
                                            <td style={{ width: "50px" }}>1</td>
                                        </tr>
                                    );
                                }

                                return rows;
                            })()}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer className={`d-flex align-items-center justify-content-end`}>

            </Modal.Footer>
        </Modal>
    );
}
