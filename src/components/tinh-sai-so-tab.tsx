"use client";

import { useKiemDinh } from "@/context/kiem-dinh";
import { faAdd, faCaretDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getHieuSaiSo, getVToiThieu } from "@lib/system-function";
import { DuLieuCacLanChay, DuLieuMotLanChay, TinhSaiSoValueTabs } from "@lib/types";
import c_ect from "@styles/scss/components/tinh-sai-so-tab.module.scss";
import { useEffect, useRef, useState } from "react";

import React from "react";
import Button from '@mui/material/Button';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';

interface TinhSaiSoTabProps {
    className?: string;
    tabIndex: number;
    d: string;                             //Độ chia nhỏ nhất
    q: {
        title: string;
        value: string;
    }
    form: ({ className, d }: FormProps) => JSX.Element;
    onFormHSSChange: (value: number) => void;
}

interface TabFormState {
    [key: number]: boolean;
}

interface FormProps {
    className?: string;
    formValue: DuLieuMotLanChay;
    onFormChange: (field: string, value: number) => void;
    d?: string;
}

export default function TinhSaiSoTab({ className, tabIndex, d, q, form, onFormHSSChange }: TinhSaiSoTabProps) {

    const { lanChayMoi, getDuLieuChayCuaLuuLuong, themLanChayCuaLuuLuong, updateLuuLuong, duLieuKiemDinhCacLuuLuong } = useKiemDinh();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    if (!tabIndex || tabIndex <= 0) {
        return <></>;
    }

    // Cập nhật số tab
    const initialTabFormState: TabFormState = Object.keys(getDuLieuChayCuaLuuLuong(q)).reduce((prevTabState, key, index) => {
        prevTabState[Number(key) * tabIndex] = index === 0;
        return prevTabState;
    }, {} as TabFormState);

    const [selectedTabForm, setSelectedTabForm] = useState<TabFormState>(initialTabFormState);

    // Cập nhật lại số lượng form + tab sau khi update số lần
    useEffect(() => {
        setFormValues(getDuLieuChayCuaLuuLuong(q));
        // setSelectedTabForm(initialTabFormState);
    }, [duLieuKiemDinhCacLuuLuong]);

    useEffect(() => {
        updateLuuLuong(q);
    }, [q]);

    const [formValues, setFormValues] = useState<DuLieuCacLanChay>(getDuLieuChayCuaLuuLuong(q));

    const toggleTabForm = (tab: number) => {
        tab *= tabIndex;
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

    // useEffect(()=> {
    //     onFormHSSChange(getHieuSaiSo(formValues as TinhSaiSoValueTabs))
    // }, [formValues]);

    const handleFormChange = (index: number, field: keyof DuLieuMotLanChay, value: number) => {
        const newFormValues = { ...formValues };
        newFormValues[index][field] = value;
        if (field === "V2" && index < Object.entries(formValues).length - 1) {
            newFormValues[index + 1].V1 = value;
        }
        setFormValues(newFormValues);
        onFormHSSChange(getHieuSaiSo(formValues as TinhSaiSoValueTabs))
        console.log("dllc: ", getDuLieuChayCuaLuuLuong(q));
    };

    const Form = form;

    const handleClick = (key: string) => {
        enqueueSnackbar(`Xóa thành công lần ${key}!`, {
            variant: 'info',
            action: (snackbarId) => (
                <React.Fragment>
                    <Button className="text-white" size="small" onClick={() => handleUndo(snackbarId, key)}>
                        HOÀN TÁC
                    </Button>
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() => closeSnackbar(snackbarId)}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </IconButton>
                </React.Fragment>
            ),
        });
    };

    // const handleClick = (id: string) => () => {
    //     const key = enqueueSnackbar('This is a message with progress!', {
    //         variant: "default",
    //         persist: true, // Để Snackbar tồn tại cho đến khi bị đóng bằng tay
    //         action: (key) => (
    //             <>
    //                 <IconButton size="small" onClick={() => closeSnackbar(key)}>
    //                     <FontAwesomeIcon icon={faTimes} />
    //                 </IconButton>
    //             </>
    //         ),
    //     });

    //     let progress = 0;
    //     const interval = setInterval(() => {
    //         progress += 10;
    //         if (progress === 100) {
    //             clearInterval(interval);
    //             closeSnackbar(key); // Đóng Snackbar khi progress đạt 100%
    //         }
    //         const progressElement = document.getElementById(`progress-${key}`);
    //         if (progressElement) {
    //             progressElement.style.width = `${progress}%`;
    //         }
    //     }, 300); // Mỗi 300ms, progress sẽ tăng lên 10 đơn vị
    // };

    const handleUndo = (snackbarId: string | number, key: string) => {
        console.log(`Undo action for key: ${key}`);
        closeSnackbar(snackbarId);
    };

    const renderTabTinhSaiSo = () => {
        return Object.entries(formValues).map(([key, formVal], index) => {

            return (
                <div key={index * tabIndex} className={`col-12 px-1 ${key + "+" + (Number(key) * tabIndex)} pt-2 ${c_ect["tab-form"]}`}>
                    <div className={`${c_ect["wrap-form"]} rounded w-100`}>
                        <label className={`w-100 ${c_ect["tab-radio"]} ${selectedTabForm[Number(key) * tabIndex] ? c_ect["active"] : ""}`}>
                            <h5 className="m-0">Lần {key}</h5>
                            <input type="radio" name={`process-tab-${key}-${tabIndex}`} className="d-none" checked={selectedTabForm[Number(key) * tabIndex]} onChange={() => toggleTabForm(Number(key))} />
                            {/* <FontAwesomeIcon icon={faCaretDown} className="d-xxl-none" /> */}
                            <button type="button" className="btn border-0 btn-light text-main-color" onClick={() => handleClick(key)}>
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
                            className={`w-100 ${!selectedTabForm[Number(key) * tabIndex] ? "d-none" : ""}`}
                            formValue={formVal}
                            onFormChange={(field: string, value: number) => handleFormChange(Number(key), field as keyof DuLieuMotLanChay, value)}
                            d={d}
                        />
                    </div>
                </div>
            )
        });
    }

    return (
        <div className={`row m-0 p-0 w-100 justify-content-center ${className ? className : ""} ${c_ect['wrapper']}`}>
            <div className="w-100 m-0 mb-3 p-0">
                <div className={`w-100 py-2 row m-0 ${c_ect['info']}`}>
                    <div className={`col-12 col-lg-6 col-xxl-5 mb-2 p-0 px-2`}>
                        <h5 className="w-100">Lưu lượng:</h5>
                        <div className="w-100 px-3 pe-lg-2  d-flex align-items-center justify-content-between gap-3">
                            <label className={`form-label m-0 fs-5 fw-bold d-block`}>{q.title}:</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className={`form-control text-start`}
                                    disabled
                                    value={q.value}
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
                                    value={getVToiThieu((q.title == "Q3") ? parseFloat(q.value) * 0.35 : q.value, d)}
                                />
                                <span className="input-group-text">lít</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-100 d-flex align-items-center justify-content-between">
                <h5 className="m-0">Lần thực hiện:</h5>
                <button className="btn px-3 py-2 btn-success" onClick={() => themLanChayCuaLuuLuong(q)}>
                    <FontAwesomeIcon icon={faAdd} className="me-2"></FontAwesomeIcon>Thêm lần chạy
                </button>
            </div>

            {renderTabTinhSaiSo()}
        </div>
    );
}