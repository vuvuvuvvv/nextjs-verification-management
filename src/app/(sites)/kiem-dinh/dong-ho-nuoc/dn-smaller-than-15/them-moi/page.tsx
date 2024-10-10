"use client"

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import uiDNSm from "@/styles/scss/ui/dn-smt-15.module.scss";
import Loading from "@/components/loading";
import { getDongHoBySerinumber } from "@/app/api/dongho/route";

const DongHoListProvider = dynamic(() => import("@/context/list-dong-ho").then(mod => mod.DongHoListProvider), { ssr: false, loading: () => <Loading /> });
const FormDongHoNuocDNNhoHon15 = dynamic(() => import("@/components/nhieu-dong-ho-nuoc-form"), { ssr: false });

interface NewProcessDNSmallerThan15Props {
    className?: string,
}

export default function NewProcessDNSmallerThan15({ className }: NewProcessDNSmallerThan15Props) {
    const [amount, setAmount] = useState<number | null>(null);
    const [isModalOpen, setModalOpen] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorSerials, setErrorSerials] = useState<string[]>([]); // Array to store errors for each serial
    const [serialNumbers, setSerialNumbers] = useState<string[]>([]); // State to store serial numbers
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null); // State to store timeout
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
            setSerialNumbers(Array.from({ length: amount }, () => ""));
            setErrorSerials(Array.from({ length: amount }, () => "")); // Initialize error array
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
            setSerialNumbers(Array.from({ length: amount }, () => ""));
            setErrorSerials(Array.from({ length: amount }, () => "")); // Initialize error array
        } else if (amount !== null && amount > 100) {
            setAmount(100);
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
                setModalOpen(false);
            } else {
                setError("Vui lòng nhập tất cả các số serial!");
            }
        } else {
            handleRenderSerialInput();
        }
    };

    const handleSerialChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSerialNumbers = [...serialNumbers];
        newSerialNumbers[index] = e.target.value;
        setSerialNumbers(newSerialNumbers);
        debounceCheckSerial(newSerialNumbers[index], index);
    };

    const debounceCheckSerial = (serial: string, index: number) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const id = setTimeout(async () => {
            try {
                const result = await getDongHoBySerinumber(serial);
                const newErrorSerials = [...errorSerials];
                if (result?.status === 200 || result?.status === 201) {
                    newErrorSerials[index] = `Serial ${serial} đã tồn tại!`;
                } else if (result?.status === 404) {
                    newErrorSerials[index] = ""; // No error, serial number does not exist
                } else {
                    newErrorSerials[index] = 'Có lỗi xảy ra trong quá trình xác minh số Serial';
                }
                setErrorSerials(newErrorSerials);
            } catch (error) {
                const newErrorSerials = [...errorSerials];
                newErrorSerials[index] = 'Có lỗi xảy ra trong quá trình xác minh số Serial';
                setErrorSerials(newErrorSerials);
            }
        }, 1000); // Adjust debounce time if needed
        setTimeoutId(id); // Save timeout ID
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
                                                className={`form-control ${errorSerials[index] ? "is-invalid" : ""}`}
                                                style={{ boxShadow: "none" }}
                                                placeholder={`Serial đồng hồ ${index + 1}`}
                                                onKeyPress={handleKeyPressConfirm}
                                                value={serial}
                                                onChange={handleSerialChange(index)}
                                            />
                                            {/* Display error below each input */}
                                            {errorSerials[index] && <div className="text-danger">{errorSerials[index]}</div>}
                                        </div>
                                    ))}
                                </div>
                            </>
                        }
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