"use client"

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import uiQSm from "@/styles/scss/ui/q-smt-15.module.scss";
import Loading from "@/components/Loading";
import { useDongHoList } from "@/context/ListDongHo";
import Swal from "sweetalert2";
import { DongHo } from "@lib/types";
import { deleteDongHoDataFromIndexedDB, getDongHoDataExistsFromIndexedDB } from "@lib/system-function";
import { useUser } from "@/context/AppContext";

const NhomDongHoNuocForm = dynamic(() => import("@/components/NhomDongHoNuocForm"), { ssr: false });

interface AddNewDongHoNuocProps {
    className?: string,
}

export default function AddNewDongHoNuoc({ className }: AddNewDongHoNuocProps) {
    const { user } = useUser();
    const { setAmount, setDongHoList } = useDongHoList();

    const [oldDongHoData, setOldDongHoData] = useState<DongHo[]>([]);
    const [qnt, setQnt] = useState<number | null>(null);
    const [isModalOpen, setModalOpen] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasShownModal = useRef(false);

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

    const deleteOldData = () => {
        if (user && user.username) {
            deleteDongHoDataFromIndexedDB(user.username);
            setOldDongHoData([]);
        }
    }


    useEffect(() => {
        const fetchDongHoData = async () => {
            if (user && user.username) {
                try {
                    const data = await getDongHoDataExistsFromIndexedDB(user.username);
                    if (data) {
                        // console.log("data: ", data);
                        setOldDongHoData(data?.dongHoList || []);
                    } else {
                        setOldDongHoData([]);
                    }
                } catch (error) {
                    console.error("Error fetching Dong Ho data:", error);
                }
            }
        };

        fetchDongHoData();
    }, [user]);

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
        if (isModalOpen && oldDongHoData.length > 0 && !hasShownModal.current) {
            hasShownModal.current = true;
            Swal.fire({
                title: 'Công việc chưa hoàn thành',
                text: 'Bạn có muốn tiếp tục?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không',
                allowOutsideClick: false 
            }).then((result) => {
                if (result.isConfirmed) {
                    setDongHoList(oldDongHoData);
                    setModalOpen(false);
                } else {
                    deleteOldData();
                }
            });
        }

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
        <NhomDongHoNuocForm generalInfoDongHo={oldDongHoData[0]}/>
    );
}