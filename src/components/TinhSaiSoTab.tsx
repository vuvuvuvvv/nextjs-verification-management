"use client";

import { useKiemDinh } from "@/context/KiemDinh";
import { useDongHoList } from "@/context/ListDongHo";
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
    isDHDienTu?: boolean | null
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
    isDisable?: boolean;
    tabFormName: string
}

export default function TinhSaiSoTab({ className, tabIndex, d, q, Form, onFormHSSChange, isDisable, isDHDienTu = null }: TinhSaiSoTabProps) {
    const {
        duLieuKiemDinhCacLuuLuong,
        getDuLieuChayCuaLuuLuong,
        themLanChayCuaLuuLuong,
        updateLuuLuong,
        xoaLanChayCuaLuuLuong,
        resetLanChay,
        updateSoDongHoChuan,
        lanChayMoi,
        formMf,
        formHieuSaiSo,
        setFormMf
    } = useKiemDinh();
    const { isHieuChuan } = useDongHoList();

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
            updateLuuLuong(q, getDuLieuChayCuaLuuLuong(q) || lanChayMoi);
            qRef.current = q
        }
    }, [q]);

    useEffect(() => {
        if (JSON.stringify(prevFormValuesRef.current) !== JSON.stringify(getDuLieuChayCuaLuuLuong(q))) {
            setFormValues(getDuLieuChayCuaLuuLuong(q));
            prevFormValuesRef.current = getDuLieuChayCuaLuuLuong(q);
        }
    }, [duLieuKiemDinhCacLuuLuong]);

    useEffect(() => {
        if (JSON.stringify(prevFormValuesRef.current) !== JSON.stringify(formValues)) {
            setSelectedTabForm({
                ...Object.keys(initialTabFormState).reduce((prevTabState, key) => {
                    prevTabState[Number(key)] = false;
                    return prevTabState;
                }, {} as TabFormState),
                [(Object.keys(formValues).includes((activeTab / tabIndex).toString()) && selectedTabForm[activeTab]) ? activeTab : parseInt(Object.keys(selectedTabForm)[0])]: true
            });
            onFormHSSChange(getHieuSaiSo(formValues as TinhSaiSoValueTabs));

            if (isHieuChuan) {
                let totalMf = 0;
                let count = 0;

                Object.values(formValues).forEach(({ V1, V2, Vc1, Vc2 }) => {
                    const Vdh = V2 ? parseFloat(V2.toString()) : 0 - V1 ? parseFloat(V1.toString()) : 0;
                    const Vc = parseFloat(Vc2.toString()) - parseFloat(Vc1.toString());
                    if (Vdh > 0 && Vc > 0) {
                        const mf = parseFloat((Vc / Vdh).toFixed(4));
                        totalMf += mf;
                        count += 1;
                    }
                });

                const avgMf = count > 0 ? parseFloat((totalMf / count).toFixed(4)) : null;

                const newFormMf = [...formMf];
                newFormMf[tabIndex - 1] = { mf: avgMf };
                setFormMf(newFormMf);
            }

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
        if (field == "Vc1" || field == "Vc2") {
            updateSoDongHoChuan(q, index, field, value);
        }

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
            if (field == "Vc2") {
                const nextIndex = index + 1;
                if (newFormValues[nextIndex]) {
                    newFormValues[nextIndex] = { ...newFormValues[nextIndex], Vc1: parseFloat(value) };
                }
            }

            return newFormValues;
        });
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
        // themLanChayCuaLuuLuong(q)
        updateFormValuesAndSelectedTabForm(themLanChayCuaLuuLuong(q));
    };

    const handleReset = () => {
        Swal.fire({
            title: `Reset toàn bộ lần chạy của ${q.title}?`,
            text: "Không thể hồi phục dữ liệu đã reset!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Reset"
        }).then((result) => {
            if (result.isConfirmed) {
                updateFormValuesAndSelectedTabForm(resetLanChay(q));
            }
        });
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
                                <input
                                    type="radio"
                                    name={`process-tab-${key}-${tabIndex}`}
                                    className="d-none"
                                    checked={selectedTabForm[Number(key) * tabIndex] ?? false}
                                    onChange={() => toggleTabForm(Number(key))}
                                />
                                {index != 0 &&
                                    <button aria-label={`Xóa lần ${key}`} type="button" className={`btn border-0 btn-light text-main-color ${isDisable ? "d-none" : ""}`} onClick={() => handleDelete(key)}>
                                        <FontAwesomeIcon icon={faTimes} className="me-1" /> Xóa
                                    </button>
                                }
                            </label>
                            {!selectedTabForm[Number(key) * tabIndex] && (
                                <div
                                    className={`w-100 d-none rounded ${c_ect["tab-cover"]} ${!selectedTabForm[Number(key) * tabIndex] ? c_ect["fade"] : c_ect["show"]}`}
                                    onClick={() => toggleTabForm(Number(key))}
                                ></div>
                            )}
                            <Form
                                isDisable={isDisable}
                                tabFormName={q.title + "-" + (Number(key) * tabIndex)}
                                className={`w-100 ${!selectedTabForm[Number(key) * tabIndex] ? "d-none" : ""}`}
                                formValue={formVal || {}}
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
            <div className="w-100 m-0 p-0">
                <div className={`w-100 pt-2 row m-0 ${c_ect['info']}`}>
                    <div className={`col-12 col-lg-6 col-xxl-5 mb-2 p-0 px-2`}>
                        <h5 className="w-100">Lưu lượng:</h5>
                        <div className="w-100 px-3 pe-lg-2  d-flex align-items-center justify-content-between gap-3">
                            <label className={`form-label m-0 fs-5 fw-bold d-block`}>Q:</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className={`form-control text-start`}
                                    disabled
                                    value={((q.title == TITLE_LUU_LUONG.q3 && isDHDienTu != null && isDHDienTu) ? parseFloat(q.value) * 0.3 : q.value) || ""}
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
                                    value={(getVToiThieu((q.title == TITLE_LUU_LUONG.q3 && isDHDienTu != null && isDHDienTu) ? parseFloat(Number(q.value).toString()) * 0.3 : q.value, d)) || ""}
                                />
                                <span className="input-group-text">lít</span>
                            </div>
                        </div>
                    </div>
                    <div className={`col-12 col-lg-6 col-xxl-5 mb-2 p-0 px-2`}>
                        <h5 className="w-100">Hiệu sai số:</h5>
                        <div className="w-100 px-3 pe-lg-2  d-flex align-items-center justify-content-between gap-3">
                            <label className={`form-label m-0 fs-5 fw-bold d-block`}>SS:</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className={`form-control text-start`}
                                    disabled
                                    value={formHieuSaiSo[tabIndex - 1].hss ?? "-"}
                                />
                                <span className="input-group-text">%</span>
                            </div>
                        </div>
                    </div>
                    <div className={`col-12 col-lg-6 col-xxl-5 mb-2 p-0 px-2`}>
                        <h5 className="w-100">Mf:</h5>
                        <div className="w-100 px-3 pe-lg-2  d-flex align-items-center justify-content-between gap-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className={`form-control text-start`}
                                    disabled
                                    value={formMf[tabIndex - 1].mf ?? "-"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-100 d-flex px-1 align-items-center justify-content-between">
                <h5 className="m-0">Lần thực hiện:</h5>
                <button aria-label="Reset lần chạy" className={`btn px-3 py-2 me-2 btn-secondary ${isDisable ? "d-none" : ""}`} onClick={() => handleReset()}>
                    <FontAwesomeIcon icon={faUndo} className="me-2"></FontAwesomeIcon>Reset
                </button>
            </div>
            {renderTabTinhSaiSo()}
            <div className={`w-100 d-flex justify-content-center mt-1 ${isDisable ? "d-none" : ""}`}>
                <button aria-label="Thêm lần chạy" className="btn px-3 py-2 btn-success" onClick={() => handleAdd()}>
                    <FontAwesomeIcon icon={faAdd} className="me-2"></FontAwesomeIcon>Thêm lần
                </button>
            </div>
        </div>
    );
}