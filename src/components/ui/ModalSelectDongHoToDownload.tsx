import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { DongHo, DuLieuChayDongHo } from '@lib/types';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';

interface ModalSelectDongHoToDownloadProps {
    dongHoList: DongHo[];
    show: boolean;
    handleClose: () => void;
    handleSelectedDongHo: React.Dispatch<React.SetStateAction<DongHo[]>>;
    isDownloadGCN?:boolean
}

export default function ModalSelectDongHoToDownload({ dongHoList, show, handleClose, handleSelectedDongHo,isDownloadGCN}: ModalSelectDongHoToDownloadProps) {
    const [selectedDongHo, setSelectedDongHo] = useState<DongHo[]>([]);
    const [isShow, setIsShow] = useState<boolean | null>(null);
    const [isDongHoSelectableExists, setDongHoSelectableExits] = useState<boolean>(false);

    const toggleSelectDongHo = (dongHo: DongHo) => {
        setSelectedDongHo(prevSelected => {
            if (prevSelected.includes(dongHo)) {
                return prevSelected.filter(item => item !== dongHo);
            } else {
                return [...prevSelected, dongHo];
            }
        });
    };

    const handleDownload = () => {
        setIsShow(true);
        Swal.fire({
            html: 'Đang tải...',
            allowOutsideClick: false,
            didOpen: () => {
                setIsShow(null);
                Swal.showLoading();
                handleSelectedDongHo(selectedDongHo);
                setSelectedDongHo([])
            }
        }).then(() => {
            handleClose();
        });
    };

    const selectAllDongHo = () => {
        const selectableDongHo = dongHoList.filter(dongHo => {
            const duLieuKiemDinh = dongHo.du_lieu_kiem_dinh as { ket_qua?: boolean } | null;
            return duLieuKiemDinh && duLieuKiemDinh.ket_qua && dongHo.so_tem && dongHo.so_giay_chung_nhan
        });
        setSelectedDongHo(selectableDongHo);
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
                <ul className='w-100 m-0 list-unstyled px-1' style={{
                    overflowY: 'auto',
                    maxHeight: '300px'
                }}>
                    {dongHoList.map((dongHo, index) => {
                        const duLieuKiemDinh = dongHo.du_lieu_kiem_dinh as { ket_qua?: boolean } | null;
                        console.log("aaa: ", duLieuKiemDinh, duLieuKiemDinh?.ket_qua, dongHo.so_tem, dongHo.so_giay_chung_nhan)
                        const isSelectable = duLieuKiemDinh && duLieuKiemDinh.ket_qua && dongHo.so_tem && dongHo.so_giay_chung_nhan;
                        if (isSelectable) {
                            if (!isDongHoSelectableExists) {
                                setDongHoSelectableExits(true);
                            }
                            return (
                                <li
                                    key={index}
                                    className='w-100 d-flex align-items-center'
                                    style={{
                                        backgroundColor: selectedDongHo.includes(dongHo) ? '#e9ecef' : '#f8f9fa', // Change background if checked
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
                                                <span style={{ color: 'black' }}>{"Đồng hồ số " + (index + 1)}</span>
                                            }
                                            checked={selectedDongHo.includes(dongHo)}
                                            onChange={() => isSelectable && toggleSelectDongHo(dongHo)}
                                        />
                                    </label>
                                </li>
                            )
                        }
                    })}
                    {!isDongHoSelectableExists && <p className='p-0 m-0 text-center'><i>Không có đồng hồ hợp lệ!</i></p>}
                </ul>
                <div className={`${!isDongHoSelectableExists ? "d-none" : "d-flex"} mt-2 align-items-center justify-content-between`}>
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
            <Modal.Footer className={`d-flex align-items-center ${isDongHoSelectableExists ? "justify-content-between" : "justify-content-end"}`}>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                {isDongHoSelectableExists &&
                    <Button variant={selectedDongHo.length === 0 ? 'secondary' : 'success'} disabled={selectedDongHo.length === 0} onClick={handleDownload}>
                        Tải xuống
                    </Button>
                }

            </Modal.Footer>
        </Modal>
    );
}