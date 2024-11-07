"use client"

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import uiQSm from "@/styles/scss/ui/q-smt-15.module.scss";
import Loading from "@/components/Loading";
import { useDongHoList } from "@/context/ListDongHo";
// import { getDongHoBySerinumber } from "@/app/api/dongho/route";

const DongHoListProvider = dynamic(() => import("@/context/ListDongHo").then(mod => mod.DongHoListProvider), { ssr: false });
const FormDongHoNuocQNhoHon15 = dynamic(() => import("@/components/NhomDongHoNuocForm"), { ssr: false });

interface NewProcessQSmallerThan15Props {
    className?: string,
}

export default function NewProcessQSmallerThan15({ className }: NewProcessQSmallerThan15Props) {
    const {setAmount} = useDongHoList();
    const [qnt, setQnt] = useState<number | null>(null);
    const [isModalOpen, setModalOpen] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleNumberChange = (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/,/g, '.');
        if (/^\d*\.?\d*$/.test(value)) {
            if (Number(value) > 100) {
                setQnt(100);
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

    }, [qnt]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleConfirm();
        }
    };

    const handleConfirm = () => {
        setAmount(qnt || 1)
        setModalOpen(false);
    };

    if (isModalOpen) {
        return (
            <Suspense fallback={<Loading />}>
                <div className={`${uiQSm['wraper-modal']}`}>
                    <div className={`${uiQSm['modal']}`}>
                        <h5 className="modal-title mb-2">Nhập số lượng đồng hồ:</h5>
                        <input
                            type="text"
                            className="form-control mb-2"
                            id="qnt"
                            placeholder="Số lượng đồng hồ"
                            value={qnt || ""}
                            onChange={handleNumberChange(setQnt)}
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
        <FormDongHoNuocQNhoHon15 />
    );
}