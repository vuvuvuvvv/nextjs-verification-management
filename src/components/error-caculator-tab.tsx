"use client"

import ErrorCaculatorForm from "@/components/dn-bigger-than-15/error-caculator-form";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import c_ect from "@styles/scss/components/error-caculator-tab.module.scss"

import { useState } from "react";

interface ErrorCaculatorTabProps {
    className?: string,
    tabIndex: number,
    form: ({ className }: FormProps) => JSX.Element
}

interface TabFormState {
    [key: number | string]: boolean;
};

interface FormProps {
    className?: string
}

export default function ErrorCaculatorTab({ className, tabIndex, form }: ErrorCaculatorTabProps) {
    if (tabIndex <= 0) {
        return <>"tabIndex" is invalid</>
    }

    const initialTabFormState: TabFormState = {
        [(1 * tabIndex)]: true,
        [(2 * tabIndex)]: false,
        [(3 * tabIndex)]: false
    };

    const [selectedTabForm, setSelectedTabForm] = useState<TabFormState>(initialTabFormState);

    const toggleTabForm = (tab: number) => {
        tab *= tabIndex;
        if (!selectedTabForm[tab]) {
            setSelectedTabForm({
                [(1 * tabIndex)]: false,
                [(2 * tabIndex)]: false,
                [(3 * tabIndex)]: false,
                [tab]: true
            })
        }
    };

    const Form = form;

    return (
        <div className={`row m-0 p-0 w-100 justify-content-center ${className ? className : ""}`}>
            {[1, 2, 3].map((i) => (
                <div key={i} className={`col-12 col-md-6 col-xxl-4 p-2 ${c_ect['tab-form']}`}>
                    <div className={`${c_ect['wrap-form']} rounded w-100`}>
                        <label className={`w-100 ${c_ect['tab-radio']} ${selectedTabForm[(i * tabIndex)] ? c_ect['active'] : ""}`}>
                            <span>Lần {i}</span>
                            <FontAwesomeIcon icon={faCaretDown} className="d-md-none" />
                            <input type="radio" name={`process-tab-${tabIndex}`} className="form-check-input d-none d-md-flex" checked={selectedTabForm[(i * tabIndex)]} onChange={() => toggleTabForm(i)} />
                        </label>
                        {!selectedTabForm[(i * tabIndex)] && <div className={`w-100 d-none rounded d-md-block ${c_ect['tab-cover']} ${!selectedTabForm[(i * tabIndex)] ? c_ect['fade'] : c_ect['show']}`} onClick={() => toggleTabForm(i)}></div>}
                        <Form className={`w-100 ${!selectedTabForm[(i * tabIndex)] ? 'd-none d-md-block' : ''}`} />
                    </div>
                </div>
            ))}
        </div>
    )
}