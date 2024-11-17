"use client";

import { useKiemDinh } from "@/context/KiemDinh";
import { faAdd, faTimes, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TITLE_LUU_LUONG } from "@lib/system-constant";
import { getHieuSaiSo, getVToiThieu } from "@lib/system-function";
import { DuLieuCacLanChay, DuLieuMotLanChay, TinhSaiSoValueTabs } from "@lib/types";
import c_ect from "@styles/scss/components/tinh-sai-so-tab.module.scss";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

interface TinhSaiSoTabProps {
    className?: string;
    tabIndex: number;
    readOnly?: boolean,
    d: string;                             //Độ chia nhỏ nhất
    q: {
        title: string;
        value: string;
    }
    Form: ({ className, d }: FormProps) => JSX.Element;
    onFormHSSChange: (value: number | null) => void;
    isDisable?: boolean;
    isDHDienTu?: boolean
}

interface TabFormState {
    [key: number]: boolean;
}

interface FormProps {
    className?: string;
    formValue: DuLieuMotLanChay;
    readOnly?: boolean,
    onFormChange: (field: string, value: string) => void;
    d?: string;
    isDisable?: boolean
}

export default function TinhSaiSoTab({ className, tabIndex, d, q, Form, onFormHSSChange, isDisable, isDHDienTu }: TinhSaiSoTabProps) {
    const {
        duLieuKiemDinhCacLuuLuong,
        getDuLieuChayCuaLuuLuong,
        themLanChayCuaLuuLuong,
        updateLuuLuong,
        xoaLanChayCuaLuuLuong,
        resetLanChay,
        updateSoDongHoChuan,
        lanChayMoi
    } = useKiemDinh();

    if (!tabIndex || tabIndex <= 0) {
        return <></>;
    }

    // Cập nhật số tab
    const initialTabFormState: TabFormState = Object.keys(getDuLieuChayCuaLuuLuong(q)).reduce((prevTabState, key, index) => {
        prevTabState[Number(key) * tabIndex] = index === 0;
        return prevTabState;
    }, {} as TabFormState);

    const [selectedTabForm, setSelectedTabForm] = useState<TabFormState>(initialTabFormState);

    //Func: Lấy ra tab đang active
    const getActiveTab = (): number => {
        for (const key in selectedTabForm) {
            if (selectedTabForm[key]) {
                return Number(key);
            }
        }
        return parseInt(Object.keys(selectedTabForm)[0]);
    };

    const [activeTab, setActiveTab] = useState<number>(getActiveTab())

    // Hook: Cập nhật lại số lượng form + tab sau khi update số lần
    const [formValues, setFormValues] = useState<DuLieuCacLanChay>(getDuLieuChayCuaLuuLuong(q));
    const prevFormValuesRef = useRef<DuLieuCacLanChay>(formValues);
    const qRef = useRef<{ title: string; value: string; }>(q);

    useEffect(() => {
        if (qRef.current.value != q.value) {
            // console.log("Run by q!: ", q);
            updateLuuLuong(q, getDuLieuChayCuaLuuLuong(q) || lanChayMoi);
            qRef.current = q
        }
    }, [q]);

    useEffect(() => {
        if (JSON.stringify(prevFormValuesRef.current) !== JSON.stringify(getDuLieuChayCuaLuuLuong(q))) {
            setFormValues(getDuLieuChayCuaLuuLuong(q));
            // prevFormValuesRef.current = getDuLieuChayCuaLuuLuong(q);
        }
    }, [duLieuKiemDinhCacLuuLuong]);

    // TODO: Check formValues
    useEffect(() => {
        if (JSON.stringify(prevFormValuesRef.current) !== JSON.stringify(formValues)) {
            // console.log("Run by form: ", q, formValues);
            setSelectedTabForm({
                ...Object.keys(initialTabFormState).reduce((prevTabState, key) => {
                    prevTabState[Number(key)] = false;
                    return prevTabState;
                }, {} as TabFormState),
                [(selectedTabForm[activeTab] ? activeTab : parseInt(Object.keys(selectedTabForm)[0]))]: true
            });
            onFormHSSChange(getHieuSaiSo(formValues as TinhSaiSoValueTabs));
            updateLuuLuong(q, formValues);
            prevFormValuesRef.current = formValues;
        }
    }, [formValues]);

    // Func: toggel tab select
    const toggleTabForm = (tab: number) => {
        tab *= tabIndex;
        setActiveTab(tab);
        if (!selectedTabForm[tab]) {
            setSelectedTabForm({
                ...Object.keys(selectedTabForm).reduce((prevTabState, key) => {
                    prevTabState[Number(key)] = false;
                    return prevTabState;
                }, {} as TabFormState),
                [tab]: true,
            });
        }
    };

    // Form: change thì đổi hiệu sai số
    const handleFormChange = (index: number, field: keyof DuLieuMotLanChay, value: string) => {
        setFormValues(prevFormValues => {
            const newFormValues = { ...prevFormValues };
            newFormValues[index] = { ...newFormValues[index], [field]: value };

            // Nếu field là "V2", cập nhật V1 của tab tiếp theo
            if (field === "V2") {
                const nextIndex = index + 1;
                if (newFormValues[nextIndex]) {
                    newFormValues[nextIndex] = { ...newFormValues[nextIndex], V1: parseFloat(value) };
                }
            }

            //TODO: update vchuan
            return newFormValues;
        });
        if (field == "Vc1" || field == "Vc2") {
            updateSoDongHoChuan(q, index, field, value);
        }
    };

    const handleDelete = (key: string) => {
        Swal.fire({
            title: `Xóa ${q.title} lần ${key}?`,
            text: "Không thể hồi phục dữ liệu đã xóa!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xóa"
        }).then((result) => {
            if (result.isConfirmed) {
                updateFormValuesAndSelectedTabForm(xoaLanChayCuaLuuLuong(q, key));
            }
        });
    }

    const handleAdd = () => {
        updateFormValuesAndSelectedTabForm(themLanChayCuaLuuLuong(q));
    };

    const handleReset = () => {
        updateFormValuesAndSelectedTabForm(resetLanChay(q));
    }

    const updateFormValuesAndSelectedTabForm = (newFormValues: DuLieuCacLanChay) => {
        setFormValues(newFormValues);
        const newTabIndex = Object.keys(newFormValues).length * tabIndex;
        setSelectedTabForm({
            ...Object.keys(selectedTabForm).reduce((prevTabState, key) => {
                prevTabState[Number(key)] = false;
                return prevTabState;
            }, {} as TabFormState),
            [newTabIndex]: true,
        });
        setActiveTab(newTabIndex);
    }

    //
    const renderTabTinhSaiSo = () => {
        if (formValues) {
            return Object.entries(formValues).map(([key, formVal], index) => {
                return (
                    <div
                        key={index * tabIndex}
                        className={`col-12 px-1 ${key + "+" + (Number(key) * tabIndex)} pt-2 ${c_ect["tab-form"]}`}
                    >
                        <div className={`${c_ect["wrap-form"]} rounded w-100`}>
                            <label className={`w-100 ${c_ect["tab-radio"]} ${selectedTabForm[Number(key) * tabIndex] ? c_ect["active"] : ""}`}>
                                <h5 className="m-0">Lần {key}</h5>
                                <input type="radio" name={`process-tab-${key}-${tabIndex}`} className="d-none" checked={selectedTabForm[Number(key) * tabIndex]} onChange={() => toggleTabForm(Number(key))} />
                                <button aria-label={`Xóa lần ${key}`} type="button" className={`btn border-0 btn-light text-main-color`} onClick={() => handleDelete(key)}>
                                    <FontAwesomeIcon icon={faTimes} className="me-1" /> Xóa
                                </button>
                            </label>
                            {!selectedTabForm[Number(key) * tabIndex] && (
                                <div
                                    className={`w-100 d-none rounded ${c_ect["tab-cover"]} ${!selectedTabForm[Number(key) * tabIndex] ? c_ect["fade"] : c_ect["show"]}`}
                                    onClick={() => toggleTabForm(Number(key))}
                                ></div>
                            )}
                            <Form
                                isDisable={isDisable}
                                className={`w-100 ${!selectedTabForm[Number(key) * tabIndex] ? "d-none" : ""}`}
                                formValue={formVal}
                                onFormChange={(field: string, value: string) => handleFormChange(Number(key), field as keyof DuLieuMotLanChay, value)}
                                d={d}
                            />
                        </div>
                    </div>
                );
            });
        } else {
            console.error("Error formValues!");
        }
    };


    return (
        <div className={`row m-0 p-0 w-100 justify-content-center ${className ? className : ""} ${c_ect['wrapper']}`}>
            <div className="w-100 m-0 mb-3 p-0">
                <div className={`w-100 py-2 row m-0 ${c_ect['info']}`}>
                    <div className={`col-12 col-lg-6 col-xxl-5 mb-2 p-0 px-1`}>
                        <h5 className="w-100">Lưu lượng:</h5>
                        <div className="w-100 px-3 pe-lg-2  d-flex align-items-center justify-content-between gap-3">
                            <label className={`form-label m-0 fs-5 fw-bold d-block`}>{q.title}:</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className={`form-control text-start`}
                                    disabled
                                    value={q.value || ""}
                                />
                                <span className="input-group-text">m<sup>3</sup>/h</span>
                            </div>
                        </div>
                    </div>
                    <div className={`col-12 col-lg-6 col-xxl-5 mb-2 p-0 px-2`}>
                        <h5 className="w-100">Thể tích tối thiểu:</h5>
                        <div className="w-100 px-3 pe-lg-2  d-flex align-items-center justify-content-between gap-3">
                            <label className={`form-label m-0 fs-5 fw-bold d-block`}>V<sub>tt</sub>:</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className={`form-control text-start`}
                                    disabled
                                    value={getVToiThieu((q.title == TITLE_LUU_LUONG.q3 && isDHDienTu) ? parseFloat(q.value) * 0.35 : q.value, d)}
                                />
                                <span className="input-group-text">lít</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-100 d-flex px-1 align-items-center justify-content-between">
                <h5 className="m-0">Lần thực hiện:</h5>
                <div className={`justify-content-between gap-2 ${isDisable ? "d-none" : ""}`}>

                    <button aria-label="Reset lần chạy" className="btn px-3 py-2 me-2 btn-secondary" onClick={() => handleReset()}>
                        <FontAwesomeIcon icon={faUndo} className="me-2"></FontAwesomeIcon>Reset
                    </button>
                    <button aria-label="Thêm lần chạy" className="btn px-3 py-2 btn-success" onClick={() => handleAdd()}>
                        <FontAwesomeIcon icon={faAdd} className="me-2"></FontAwesomeIcon>Thêm lần chạy
                    </button>
                </div>
            </div>
            {renderTabTinhSaiSo()}
        </div>
    );
}

function useListDongHo(): { dongHoSelected: any; } {
    throw new Error("Function not implemented.");
}
