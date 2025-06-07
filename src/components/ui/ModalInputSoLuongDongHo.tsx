import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { DongHo, DuLieuChayDongHo } from '@/lib/types';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import { useDongHoList } from '@/context/ListDongHoContext';
import { useKiemDinh } from '@/context/KiemDinhContext';

interface ModalInputSoLuongDongHoProps {
    show: boolean;
    handleClose: () => void;
}

export default function ModalInputSoLuongDongHo({ show, handleClose }: ModalInputSoLuongDongHoProps) {
    const { dongHoList, amount } = useDongHoList();
    const { addMoreDongHo, removeMoreDongHo } = useKiemDinh();
    const [newAmount, setNewAmount] = useState<number>(amount);
    const newAmountRef = useRef(newAmount);
    const dongHoListRef = useRef(dongHoList);

    const handleNumberChange = (value: any) => {
        // Cho phép chuỗi rỗng hoặc các chữ số
        if (value === '' || /^\d*$/.test(value)) {
            if (value === '') {
                setNewAmount(value);
            } else {
                const numericValue = Number(value);
                if (numericValue > 100) {
                    setNewAmount(100);
                } else if (numericValue <= 0) {
                    setNewAmount(1);
                } else {
                    setNewAmount(numericValue);
                }
            }
        }
    };


    const handleUpdate = useCallback(async () => {
        if (newAmount != amount) {
            const parsedAmount = parseInt(newAmount.toString());

            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                Swal.fire("Lỗi", "Số lượng không hợp lệ", "error");
                return;
            }

            if (parsedAmount >= amount) {
                addMoreDongHo(parsedAmount);
                handleClose();
            } else {
                const soLuongXoa = amount - parsedAmount;
                const result = await Swal.fire({
                    title: "Xác nhận",
                    html: `Bạn sẽ <strong>xóa ${soLuongXoa}</strong> đồng hồ được thêm cuối cùng. <br/> <span style="color: red;">Dữ liệu đã xóa không thể khôi phục!</span>`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Xác nhận xoá",
                    cancelButtonText: "Huỷ",
                });

                if (result.isConfirmed) {
                    removeMoreDongHo(parsedAmount);
                    handleClose();
                }
            }
        }
    }, [newAmount, amount, handleClose]);

    useEffect(() => {
        if (show) {
            setNewAmount(amount);
            newAmountRef.current = amount;
            dongHoListRef.current = dongHoList;
        }
    }, [show]);

    return (
        <Modal show={show} className='pe-0' onHide={handleClose} centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Nhập số lượng đồng hồ</Modal.Title>
            </Modal.Header>
            <Modal.Body className='d-flex justify-content-center align-items-center'>
                <label className='w-100 px-2'>
                    <input
                        type="text"
                        className="form-control"
                        value={newAmount}
                        onChange={(e) => handleNumberChange(e.target.value)}
                    />
                </label>
                <Button style={{ width: "112px" }} variant="primary" onClick={handleUpdate}>
                    Cập nhật
                </Button>
            </Modal.Body>
        </Modal>
    );
}