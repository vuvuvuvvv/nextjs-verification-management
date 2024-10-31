import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { DongHo } from '@lib/types';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDongHoList } from '@/context/ListDongHo';
import Swal from 'sweetalert2';

interface ModalSelectDongHoToSaveProps {
    dongHoList: DongHo[];
    show: boolean;
    handleClose: () => void;
    setExitsDHSaved: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalSelectDongHoToSave({ dongHoList, show, handleClose, setExitsDHSaved }: ModalSelectDongHoToSaveProps) {
    const [selectedDongHo, setSelectedDongHo] = useState<DongHo[]>([]);
    const [isShow, setIsShow] = useState<boolean | null>(null);

    const { getDongHoChuaKiemDinh, saveListDongHo, savedDongHoList } = useDongHoList();

    const toggleSelectDongHo = (dongHo: DongHo) => {
        setSelectedDongHo(prevSelected => {
            if (prevSelected.includes(dongHo)) {
                return prevSelected.filter(item => item !== dongHo);
            } else {
                return [...prevSelected, dongHo];
            }
        });
    };

    const handleSave = () => {
        setIsShow(true);
        Swal.fire({
            title: 'Đang lưu đồng hồ',
            html: 'Đang chuẩn bị...',
            allowOutsideClick: false,
            didOpen: () => {
                setIsShow(null);
                handleClose();
                Swal.showLoading();
                saveListDongHo(selectedDongHo);
                setSelectedDongHo([])
                setExitsDHSaved(true);
            }
        });
    };

    const selectAllDongHo = () => {
        const selectableDongHo = dongHoList.filter(dongHo => {
            if (!isDHSaved(dongHo)) {
                const duLieuKiemDinh = JSON.parse(dongHo.du_lieu_kiem_dinh || '{}');
                return duLieuKiemDinh.ket_qua && dongHo.so_tem && dongHo.so_giay_chung_nhan;
            }
        });
        setSelectedDongHo(selectableDongHo);
    };

    const isDHSaved = (dongHoSelected: DongHo) => {
        for (const dongHo of savedDongHoList) {
            if (dongHo.seri_sensor == dongHoSelected.seri_sensor && dongHo.seri_chi_thi == dongHoSelected.seri_chi_thi) {
                return true;
            }
        }
        return false;
    };

    const deselectAllDongHo = () => {
        setSelectedDongHo([]);
    };

    return (
        <Modal show={isShow != null ? isShow : show} className='pe-0' onHide={handleClose} centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Chọn đồng hồ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className='w-100 list-unstyled px-1' style={{
                    overflowY: 'auto',
                    maxHeight: '300px'
                }}>
                    {dongHoList.map((dongHo, index) => {
                        const duLieuKiemDinh = JSON.parse(dongHo.du_lieu_kiem_dinh || '{}');
                        const isSelectable = (duLieuKiemDinh.ket_qua === false || (duLieuKiemDinh.ket_qua && dongHo.so_tem && dongHo.so_giay_chung_nhan)) && !isDHSaved(dongHo);
                        return (
                            <li
                                key={index}
                                className='w-100 d-flex align-items-center'
                                style={{
                                    backgroundColor: selectedDongHo.includes(dongHo) && !isDHSaved(dongHo) ? '#e9ecef' : '#f8f9fa', // Change background if checked
                                    padding: '10px',
                                    borderRadius: '5px',
                                    marginBottom: '5px',
                                    cursor: isSelectable ? 'pointer' : 'unset',
                                    minHeight: '52px'
                                }}
                                onClick={() => isSelectable && toggleSelectDongHo(dongHo)}
                            >
                                <label className='w-100 d-flex align-items-center gap-3'>
                                    <Form.Check
                                        type="checkbox"
                                        label={
                                            <>
                                                <span style={{ color: 'black' }}>{"ĐH" + (index + 1) + ": "}</span>
                                                <span style={{
                                                    color: duLieuKiemDinh.ket_qua != null
                                                        ? (duLieuKiemDinh.ket_qua
                                                            ? (dongHo.so_tem && dongHo.so_giay_chung_nhan ? 'green' : 'orange') // Đạt nhưng thiếu điều kiện
                                                            : 'red') // Không đạt
                                                        : 'orange' // Chưa kiểm định
                                                }}>
                                                    {" - " + (!isDHSaved(dongHo) ? (duLieuKiemDinh.ket_qua != null ?
                                                        (duLieuKiemDinh.ket_qua ?
                                                            "Đạt - " + (dongHo.so_tem && dongHo.so_giay_chung_nhan
                                                                ? "Có thể lưu"
                                                                : "Không có " + (!dongHo.so_tem && !dongHo.so_giay_chung_nhan ?
                                                                    "Số tem và Số giấy chứng nhận"
                                                                    : (!dongHo.so_tem
                                                                        ? "Số tem"
                                                                        : "Số giấy chứng nhận")))
                                                            : "Không đạt")
                                                        : "Chưa kiểm định") : "Đã lưu")}
                                                </span>
                                            </>
                                        }
                                        checked={selectedDongHo.includes(dongHo)}
                                        onChange={() => isSelectable && toggleSelectDongHo(dongHo)}
                                        disabled={!isSelectable}
                                    />
                                </label>
                            </li>
                        )
                    })}
                </ul>
                <div className='d-flex align-items-center justify-content-between'>
                    <small>Chọn <b>{selectedDongHo.length} / {dongHoList.length}</b> đồng hồ</small>
                    <div className='d-flex align-items-center gap-2'>
                        <Button variant={selectedDongHo.length === 0 ? 'secondary' : 'danger'} disabled={selectedDongHo.length === 0} onClick={deselectAllDongHo}>
                            <FontAwesomeIcon className="me-2" icon={faTimes} /> Hủy
                        </Button>
                        <Button variant="primary" onClick={selectAllDongHo}>
                            <FontAwesomeIcon className="me-2" icon={faCheck} />Toàn bộ
                        </Button>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='d-flex align-items-center justify-content-between'>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant={selectedDongHo.length === 0 ? 'secondary' : 'success'} disabled={selectedDongHo.length === 0} onClick={handleSave}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );
}