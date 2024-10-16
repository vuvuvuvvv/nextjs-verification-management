import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { DongHo } from '@lib/types';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDongHoList } from '@/context/list-dong-ho';
import Swal from 'sweetalert2';

interface ModalSelectDongHoToSaveProps {
    dongHoList: DongHo[];
    show: boolean;
    handleClose: () => void;
}

export default function ModalSelectDongHoToSave({ dongHoList, show, handleClose }: ModalSelectDongHoToSaveProps) {
    const [selectedDongHo, setSelectedDongHo] = useState<DongHo[]>([]);

    const { getDongHoChuaKiemDinh } = useDongHoList();

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
        // onSave(selectedDongHo); // TODO: Save List DH
        const dongHoChuaKiemDinh = getDongHoChuaKiemDinh(selectedDongHo);
        if (dongHoChuaKiemDinh.length > 0) {
            document.querySelector('.modal')?.setAttribute('aria-hidden', 'true');
            // SweetAlert2
            Swal.fire({
                title: 'Chú ý!',
                text: 'Có ' + dongHoChuaKiemDinh.length + ' đồng hồ chưa kiểm định. Có muốn tiếp tục lưu?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Hủy',
                confirmButtonText: 'Lưu',
                reverseButtons: true
            }).then((rs) => {
                if (rs.isConfirmed) {
                    // TODO: Save List DH
                    // console.log(selectedDongHo);
                    handleClose();
                }
                document.querySelector('.modal')?.setAttribute('aria-hidden', 'false');
            });
        }
        // Close the modal after saving
    };

    const selectAllDongHo = () => {
        // console.log(dongHoList);
        setSelectedDongHo(dongHoList);
    };

    const deselectAllDongHo = () => {
        setSelectedDongHo([]);
    };

    return (
        <Modal show={show} className='pe-0' onHide={handleClose} centered scrollable>
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

                        return (
                            <li
                                key={index}
                                className='w-100 d-flex align-items-center'
                                style={{
                                    backgroundColor: selectedDongHo.includes(dongHo) ? '#e9ecef' : '#f8f9fa', // Change background if checked
                                    padding: '10px',
                                    borderRadius: '5px',
                                    marginBottom: '5px',
                                    cursor: 'pointer',
                                    height: '52px'
                                }}
                                onClick={() => toggleSelectDongHo(dongHo)}
                            >
                                <label className='w-100 d-flex align-items-center gap-3'>
                                    <Form.Check
                                        type="checkbox"
                                        label={"ĐH" + (index + 1) + ": "
                                            // + dongHo.ten_dong_ho
                                            + " - " + (duLieuKiemDinh.ket_qua != null ? (duLieuKiemDinh.ket_qua ? "Đạt" : "Không đạt") : "Chưa kiểm định")}
                                        checked={selectedDongHo.includes(dongHo)}
                                        onChange={() => toggleSelectDongHo(dongHo)}
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