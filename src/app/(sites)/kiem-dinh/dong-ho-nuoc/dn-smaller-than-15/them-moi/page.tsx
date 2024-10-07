"use client"

import { Suspense, useState } from "react";
import { DongHoListProvider } from "@/context/list-dong-ho";
import Loading from "@/components/loading";
import uiDNSm from "@/styles/scss/ui/dn-smt-15.module.scss";
import FormDongHoNuocDNNhoHon15 from "@/components/nhieu-dong-ho-nuoc-form";

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
            setter(Number(value));
            setError(null);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleConfirm();
        }
    };

    const handleConfirm = () => {
        if (isTypingSerial) {
            if (serialNumbers.every(serial => serial.trim() !== "")) {
                console.log(serialNumbers);
                setModalOpen(false); // Đóng modal nếu tất cả serial không rỗng
            } else {
                setErrorSerial("Vui lòng nhập tất cả các số serial!"); // Thông báo lỗi nếu có trường rỗng
            }
        } else {
            setTypingSerial(true);
            if (amount !== null && amount > 0) {
                setSerialNumbers(Array.from({ length: amount }, () => "")); // Khởi tạo mảng serial numbers
            } else {
                setError("Số lượng không hợp lệ!");
            }
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
        }, 700); // Thay đổi thời gian debounce nếu cần
        setTimeoutId(id); // Lưu timeout ID
    };

    if (isModalOpen) {
        return (
            <>
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
                                                style={{boxShadow:"none"}}
                                                placeholder={`Serial đồng hồ ${index + 1}`}
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
            </>
        );
    }

    return (
        <Suspense fallback={<Loading />}>
            <DongHoListProvider serialNumbers={serialNumbers || []}>
                <FormDongHoNuocDNNhoHon15 />
            </DongHoListProvider>
        </Suspense>
    );
}