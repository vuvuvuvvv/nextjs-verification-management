"use client"

import dynamic from "next/dynamic";

import { Suspense, useEffect, useState } from "react";
import uiDNSm from "@/styles/scss/ui/dn-smt-15.module.scss";
import Loading from "@/components/loading";

const DongHoListProvider = dynamic(() => import("@/context/list-dong-ho").then(mod => mod.DongHoListProvider), { ssr: false, loading: () => <Loading /> });
const FormDongHoNuocDNNhoHon15 = dynamic(() => import("@/components/nhieu-dong-ho-nuoc-form"), { ssr: false });
interface NewProcessDNSmallerThan15Props {
    className?: string,
}

export default function NewProcessDNSmallerThan15({ className }: NewProcessDNSmallerThan15Props) {
    const [amount, setAmount] = useState<number | null>(null);
    const [isModalOpen, setModalOpen] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorSerial, setErrorSerial] = useState<string | null>(null);
    const [serialNumbers, setSerialNumbers] = useState<string[]>([]); // State để lưu serial numbers
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null); // State để lưu timeout
    const [isTypingSerial, setTypingSerial] = useState(false);

    const handleNumberChange = (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/,/g, '.');
        if (/^\d*\.?\d*$/.test(value)) {
            if (value === "") {
                setTypingSerial(false);
            }
            if (Number(value) > 100) {
                setAmount(100);
                setError("Tối đa 100.");
                setTimeout(() => {
                    setError(null);
                }, 3000);
            } else {
                setter(Number(value));
            }
            setError(null);
        }
    };

    useEffect(() => {
        if (isTypingSerial && amount !== null) {
            setSerialNumbers(Array.from({ length: amount }, () => ""))
        }
    }, [amount]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleRenderSerialInput();
        }
    };

    const handleKeyPressConfirm = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleConfirm();
        }
    };

    const handleRenderSerialInput = () => {
        if (amount !== null && amount > 0 && amount <= 100) {
            setSerialNumbers(Array.from({ length: amount }, () => "")); // Khởi tạo mảng serial numbers
        } else if (amount !== null && amount > 100) {
            setAmount(100); // Khởi tạo mảng serial numbers
            setError("Tối đa 100.");
            setTimeout(() => {
                setError(null);
            }, 3000);
        } else {
            setAmount(1);
        }
        setTypingSerial(true);
    };

    const handleConfirm = () => {
        if (isTypingSerial) {
            if (serialNumbers.every(serial => serial.trim() !== "")) {
                setModalOpen(false); // Đóng modal nếu tất cả serial không rỗng
            } else {
                setErrorSerial("Vui lòng nhập tất cả các số serial!"); // Thông báo lỗi nếu có trường rỗng
            }
        } else {
            handleRenderSerialInput();
        }
    };

    const handleSerialChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSerialNumbers = [...serialNumbers];
        newSerialNumbers[index] = e.target.value;
        setSerialNumbers(newSerialNumbers);
        debounceCheckSerial(newSerialNumbers[index]); // Gọi hàm kiểm tra serial
    };


    // TODO: Check if serial exists
    const debounceCheckSerial = (serial: string) => {
        if (timeoutId) {
            clearTimeout(timeoutId); // Xóa timeout cũ nếu có
        }
        const id = setTimeout(() => {
            // TODO: Call API để kiểm tra serial number
            console.log(`Checking if serial ${serial} exists...`);
            // Thực hiện API call ở đây
        }, 500); // Thay đổi thời gian debounce nếu cần
        setTimeoutId(id); // Lưu timeout ID
    };

    if (isModalOpen) {
        return (
            <Suspense fallback={<Loading />}>
                <div className={`${uiDNSm['wraper-modal']}`}>
                    <div className={`${uiDNSm['modal']}`}>
                        <h5 className="modal-title mb-2">Nhập số lượng đồng hồ:</h5>
                        <input
                            type="text"
                            className="form-control mb-2"
                            id="amount"
                            placeholder="Số lượng đồng hồ"
                            value={amount || ""}
                            onChange={handleNumberChange(setAmount)}
                            onKeyPress={handleKeyPress}
                            autoComplete="off"
                            pattern="\d*"
                        />
                        {error && <div className="text-danger mb-2">{error}</div>}
                        {isTypingSerial &&
                            <>
                                <h5 className="modal-title mb-2">Nhập Serial đồng hồ:</h5>
                                <div className={`${uiDNSm['serial-group-input']}`}>
                                    {serialNumbers.map((serial, index) => (
                                        <div key={index} className="mb-2">
                                            <label className="form-label">Đồng hồ {index + 1}:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                style={{ boxShadow: "none" }}
                                                placeholder={`Serial đồng hồ ${index + 1}`}
                                                onKeyPress={handleKeyPressConfirm}
                                                value={serial}
                                                onChange={handleSerialChange(index)}
                                            />
                                            {/* Hiển thị lỗi dưới input */}
                                        </div>
                                    ))}
                                </div>
                            </>
                        }
                        {errorSerial && <div className="text-danger">{errorSerial}</div>}
                        <div className="modal-footer">
                            <button aria-label="Xác nhận" type="button" className="btn btn-primary" onClick={() => handleConfirm()}>
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </Suspense>
        );
    }

    return (
        <DongHoListProvider serialNumbers={serialNumbers || []}>
            <FormDongHoNuocDNNhoHon15 />
        </DongHoListProvider>
    );
}