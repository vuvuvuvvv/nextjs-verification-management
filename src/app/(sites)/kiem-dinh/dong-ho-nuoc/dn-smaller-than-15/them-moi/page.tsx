"use client"

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import uiDNSm from "@/styles/scss/ui/dn-smt-15.module.scss";
import Loading from "@/components/Loading";
// import { getDongHoBySerinumber } from "@/app/api/dongho/route";

const DongHoListProvider = dynamic(() => import("@/context/ListDongHo").then(mod => mod.DongHoListProvider), { ssr: false, loading: () => <Loading /> });
const FormDongHoNuocDNNhoHon15 = dynamic(() => import("@/components/NhomDongHoNuocForm"), { ssr: false });

interface NewProcessDNSmallerThan15Props {
    className?: string,
}

export default function NewProcessDNSmallerThan15({ className }: NewProcessDNSmallerThan15Props) {
    const [amount, setAmount] = useState<number | null>(null);
    const [isModalOpen, setModalOpen] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleNumberChange = (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/,/g, '.');
        if (/^\d*\.?\d*$/.test(value)) {
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
        
    }, [amount]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleConfirm();
        }
    };

    const handleConfirm = () => {
        setModalOpen(false);
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
        <DongHoListProvider amount={amount || 1}>
            <FormDongHoNuocDNNhoHon15 />
        </DongHoListProvider>
    );
}