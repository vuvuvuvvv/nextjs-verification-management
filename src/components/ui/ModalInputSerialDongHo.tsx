import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { DongHo, DuLieuChayDongHo } from '@lib/types';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import { useDongHoList } from '@/context/ListDongHo';
import useDebounce from '@/hooks/useDebounce';

interface ModalInputSerialDongHoProps {
    show: boolean;
    handleClose: () => void;
}

export default function ModalInputSerialDongHo({ show, handleClose }: ModalInputSerialDongHoProps) {
    const { dongHoList, updateListDongHo, setDongHoList } = useDongHoList();
    const [arrSerial, setArrSerial] = useState<string[]>(dongHoList && dongHoList.length > 0 ? dongHoList.map((val) => (val.serial ?? "")) : []);
    const arrSerialRef = useRef(arrSerial);
    const dongHoListRef = useRef(dongHoList);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const handleFieldChange = useCallback((index: number, serial: string) => {
        const currentDongHo = dongHoList[index] ?? null;
        if (currentDongHo) {
            setArrSerial((prev) => prev.map((val, i) => (i === index ? serial : val)));
        }
    }, []);

    // Check mảng serial thay đổi => debounce 1s nhập gtri mới vào serial mảng ĐH
    useEffect(() => {
        if (show) {
            const newArraySerial = dongHoList.map((val) => val.serial ?? "");
            setArrSerial(newArraySerial);
            arrSerialRef.current = newArraySerial;
            dongHoListRef.current = dongHoList;
        }
    }, [show]);
    
    // Check mảng serial thay đổi => debounce 1s nhập gtri mới vào serial mảng ĐH
    useEffect(() => {
        if (arrSerialRef.current != arrSerial) {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = useDebounce(() => {
                const newDongHoList = dongHoList.map((dongHo, i) => {
                    return { ...dongHo, serial: arrSerial[i] };
                })
                setDongHoList(newDongHoList)
            }, 1000);

            arrSerialRef.current = arrSerial;
        }
    }, [arrSerial])

    return (
        <Modal show={show} className='pe-0' onHide={handleClose} centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Nhập Số đồng hồ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className='w-100 m-0 list-unstyled px-1' style={{
                    overflowY: 'auto',
                    maxHeight: '300px'
                }}>
                    {dongHoList.map((dongHo, index) => {
                        const item: DongHo = dongHo
                        return (
                            <li
                                key={index}
                                className='w-100 d-flex align-items-center'
                                style={{
                                    backgroundColor: '#e9ecef',  //'#f8f9fa', // Change background if checked
                                    borderRadius: '5px',
                                    marginBottom: '5px',
                                    minHeight: '52px'
                                }}
                            >
                                <label className='w-100 d-flex align-items-center gap-3 px-2'>
                                    <span style={{ width: "150px" }}>Đồng hồ {index + 1}</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={arrSerial[index] ?? ""}
                                        onChange={(e) => handleFieldChange(index, e.target.value)}
                                    />
                                </label>
                            </li>
                        )
                    })}
                </ul>
            </Modal.Body>
            <Modal.Footer className={`d-flex align-items-center justify-content-end`}>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>

            </Modal.Footer>
        </Modal>
    );
}