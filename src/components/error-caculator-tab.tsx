"use client"

import ErrorCaculatorForm from "@/components/dn-bigger-than-32/error-caculator-form";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ect from "@styles/scss/components/error-caculator-tab.module.scss"

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
        <div className={`row m-0 p-0 w-100 ${className ? className : ""}`}>
            <div className={`col-12 col-md-6 col-xl-4 p-2 ${ect['tab-form']}`}>
                <div className={`${ect['wrap-form']} w-100`}>
                    <label className={`w-100 ${ect['tab-radio']} ${selectedTabForm[(1 * tabIndex)] ? ect['active'] : ""}`}>
                        <span>Lần 1</span>
                        <FontAwesomeIcon icon={selectedTabForm[(1 * tabIndex)] ? faCaretDown : faCaretUp} className="d-md-none" />
                        <input type="radio" name={`process-tab-${tabIndex}`} className="form-check-input d-none d-md-flex" checked={selectedTabForm[(1 * tabIndex)]} onChange={() => toggleTabForm(1)} />
                    </label>
                    {!selectedTabForm[(1 * tabIndex)] && <div className={`w-100 d-none d-md-block ${ect['tab-cover']} ${!selectedTabForm[(1 * tabIndex)] ? ect['fade'] : ect['show']}`} onClick={() => toggleTabForm(1)}></div>}
                    <Form className={`w-100 ${!selectedTabForm[(1 * tabIndex)] ? 'd-none d-md-block' : ''}`} />
                </div>
            </div>
            <div className={`col-12 col-md-6 col-xl-4 p-2 ${ect['tab-form']}`}>
                <div className={`${ect['wrap-form']} w-100`}>
                    <label className={`w-100 ${ect['tab-radio']} ${selectedTabForm[(2 * tabIndex)] ? ect['active'] : ""}`}>
                        <span>Lần 2</span>
                        <FontAwesomeIcon icon={selectedTabForm[(2 * tabIndex)] ? faCaretDown : faCaretUp} className="d-md-none" />
                        <input type="radio" name={`process-tab-${tabIndex}`} className="form-check-input d-none d-md-flex" checked={selectedTabForm[(2 * tabIndex)]} onChange={() => toggleTabForm(2)} />
                    </label>
                    {!selectedTabForm[(2 * tabIndex)] && <div className={`w-100 d-none d-md-block ${ect['tab-cover']}`} onClick={() => toggleTabForm(2)}></div>}
                    <Form className={`w-100 ${!selectedTabForm[(2 * tabIndex)] ? 'd-none d-md-block' : ''}`} />
                </div>
            </div>
            <div className={`col-12 col-md-6 col-xl-4 p-2 ${ect['tab-form']}`}>
                <div className={`${ect['wrap-form']} w-100`}>
                    <label className={`w-100 ${ect['tab-radio']} ${selectedTabForm[(3 * tabIndex)] ? ect['active'] : ""}`}>
                        <span>Lần 3</span>
                        <FontAwesomeIcon icon={selectedTabForm[(3 * tabIndex)] ? faCaretDown : faCaretUp} className="d-md-none" />
                        <input type="radio" name={`process-tab-${tabIndex}`} className="form-check-input d-none d-md-flex" checked={selectedTabForm[(3 * tabIndex)]} onChange={() => toggleTabForm(3)} />
                    </label>
                    {!selectedTabForm[(3 * tabIndex)] && <div className={`w-100 d-none d-md-block ${ect['tab-cover']}`} onClick={() => toggleTabForm(3)}></div>}
                    <Form className={`w-100 ${!selectedTabForm[(3 * tabIndex)] ? 'd-none d-md-block' : ''}`} />
                </div>
            </div>
        </div>
    )
}