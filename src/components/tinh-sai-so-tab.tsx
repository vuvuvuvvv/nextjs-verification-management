"use client";

import { useKiemDinh } from "@/context/kiem-dinh";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getHieuSaiSo, getVToiThieu } from "@lib/system-function";
import { DuLieuMotLanChay, DuLieuCacLanChay, TinhSaiSoValueTabs } from "@lib/types";
import c_ect from "@styles/scss/components/tinh-sai-so-tab.module.scss";
import { useEffect, useState } from "react";

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

export default function TinhSaiSoTab({ className, tabIndex, d, q, form, onFormHSSChange}: TinhSaiSoTabProps) {

    const {duLieuLanChay} = useKiemDinh();

    if (!tabIndex || tabIndex <= 0) {
        return <></>;
    }

    const initialTabFormState: TabFormState = Object.keys(duLieuLanChay).reduce((prevTabState, key, index) => {
        prevTabState[Number(key) * tabIndex] = index === 0;
        return prevTabState;
    }, {} as TabFormState);

    const [selectedTabForm, setSelectedTabForm] = useState<TabFormState>(initialTabFormState);

    const [formValues, setFormValues] = useState<DuLieuCacLanChay>(duLieuLanChay);

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

    // useEffect(()=>{
    //     onFormHSSChange(getHieuSaiSo(formValues as TinhSaiSoValueTabs))
    // }, [formValues]);

    const handleFormChange = (index: number, field: keyof DuLieuMotLanChay, value: number) => {
        const newFormValues = {...formValues};
        newFormValues[index][field] = value;
        if (field === "V2" && index < Object.entries(formValues).length - 1) {
            newFormValues[index + 1].V1 = value;
        }
        setFormValues(newFormValues);
        onFormHSSChange(getHieuSaiSo(formValues as TinhSaiSoValueTabs))
        console.log("dllc: ", duLieuLanChay);
    };

    const Form = form;

    // TODO: tính hiệu sai số 

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
            <h5 className="p-2">Lần thực hiện:</h5>
            {Object.entries(formValues).map(([key, formVal], index) => {
                // console.log(`Key: ${key}, Value:`, formVal); // Console log key và value

                return (
                    <div key={index * tabIndex} className={`col-12 col-xxl-4 px-1 pt-2 ${c_ect["tab-form"]}`}>
                        <div className={`${c_ect["wrap-form"]} rounded w-100`}>
                            <label className={`w-100 ${c_ect["tab-radio"]} ${selectedTabForm[Number(key) * tabIndex] ? c_ect["active"] : ""}`}>
                                <h5 className="m-0">Lần {key}</h5>
                                <input type="radio" name={`process-tab-${key}-${tabIndex}`} className="d-none" checked={selectedTabForm[Number(key) * tabIndex]} onChange={() => toggleTabForm(Number(key) * tabIndex)} />
                                <FontAwesomeIcon icon={faCaretDown} className="d-xxl-none" />
                            </label>
                            {!selectedTabForm[Number(key) * tabIndex] && (
                                <div
                                    className={`w-100 d-none rounded d-xxl-block ${c_ect["tab-cover"]} ${!selectedTabForm[Number(key) * tabIndex] ? c_ect["fade"] : c_ect["show"]}`}
                                    onClick={() => toggleTabForm(Number(key) * tabIndex)}
                                ></div>
                            )}
                            <Form
                                className={`w-100 ${!selectedTabForm[Number(key) * tabIndex] ? "d-none d-xxl-block" : ""}`}
                                formValue={formVal}
                                onFormChange={(field: string, value: number) => handleFormChange(Number(key), field as keyof DuLieuMotLanChay, value)}
                                d={d}
                            />
                        </div>
                    </div>
                )
            })}
            {/* HSS  */}
        </div>
    );
}