import { useEffect, useRef, useState } from "react";
import ecf from "@styles/scss/components/tinh-sai-so-form.module.scss";
import { getSaiSoDongHo } from "@lib/system-function";
import { useDongHoList } from "@/context/ListDongHo";

interface CaculatorFormProps {
    className?: string;
    formValue: {
        V1: number;
        V2: number;
        Tdh: number;
        Vc1: number;
        Vc2: number;
        Tc: number;
        Mf?: number;
    };
    readOnly?: boolean,
    onFormChange: (field: string, value: string) => void;
    d?: string;
    isDisable?: boolean
    tabFormName: string;
}
export default function TinhSaiSoForm({ tabFormName, className, formValue, readOnly = false, onFormChange, d, isDisable }: CaculatorFormProps) {
    const { isHieuChuan } = useDongHoList();
    const [formState, setFormState] = useState({
        V1: formValue.V1.toString() || "0",
        V2: formValue.V2.toString() || "0",
        Vc1: formValue.Vc1 ? formValue.Vc1.toString() : "0",
        Vc2: formValue.Vc2 ? formValue.Vc2.toString() : "0",
        Tdh: formValue.Tdh ? formValue.Tdh.toString() : "0",
        Tc: formValue.Tc ? formValue.Tc.toString() : "0",
        Mf: formValue.Mf ? formValue.Mf.toString() : "-",
    });
    const [saiSo, setSaiSo] = useState<string>("0%");
    const prevFormValuesRef = useRef(formValue);


    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
        name: string,
    ) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                const prevIndex = index - 1;
                if (prevIndex >= 0) {
                    const prevInput = document.querySelector(`input[name="${name}-${prevIndex}"]`) as HTMLInputElement;
                    if (prevInput) {
                        prevInput.focus();
                    }
                }
            } else {
                const nextIndex = index + 1;
                if (nextIndex < 4) {
                    const nextInput = document.querySelector(`input[name="${name}-${nextIndex}"]`) as HTMLInputElement;
                    if (nextInput) {
                        nextInput.focus();
                    }
                }
            }
        }
    };

    const [numericInputTimeout, setNumericInputTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setFormState({
            V1: formValue.V1.toString() ?? 0,
            V2: formValue.V2.toString() ?? 0,
            Vc1: formValue.Vc1.toString() ?? 0,
            Vc2: formValue.Vc2.toString() ?? 0,
            Tdh: formValue.Tdh.toString() ?? 0,
            Tc: formValue.Tc.toString() ?? 0,
            Mf: formValue.Mf ? formValue.Mf.toString() : "-",
        });
        setSaiSo((getSaiSoDongHo(formValue) ?? 0).toString());
    }, [formValue]);

    const handleInputChange = (field: string, value: string) => {
        setFormState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
        onFormChange(field, value);
    };

    const getDecimalPlaces = () => {
        if (!d) return null;
        const parts = d.split(".");
        return parts.length > 1 ? parts[1].length : 0;
    };

    const handleNumericInput = (field: string) => {
        const decimalPlaces = getDecimalPlaces() || 0;

        return (e: React.FormEvent<HTMLInputElement>) => {
            let rawValue = e.currentTarget.value.replace(/[^0-9]/g, '');

            if (rawValue.length >= decimalPlaces + 2) {
                rawValue = rawValue.replace(/^0+/, '');
            }

            let formattedValue = '';

            if (rawValue.length <= decimalPlaces) {
                formattedValue = decimalPlaces ? `0.${rawValue.padStart(decimalPlaces, '0')}` : rawValue;
            } else {
                const integerPart = rawValue.slice(0, rawValue.length - decimalPlaces);
                const decimalPart = rawValue.slice(rawValue.length - decimalPlaces);
                formattedValue = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
            }

            handleInputChange(field, formattedValue);

            if (numericInputTimeout) {
                clearTimeout(numericInputTimeout);
            }

            const timeout = setTimeout(() => {
                onFormChange(field, formattedValue);
            }, 300);
            setNumericInputTimeout(timeout);
        };
    };

    const [numberChangeTimeout, setNumberChangeTimeout] = useState<NodeJS.Timeout | null>(null);
    const handleNumberChange = (field: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            let value = e.target.value;
            value = value.replace(/,/g, '.');
            if (/^\d*\.?\d*$/.test(value)) {
                if (value.includes('.')) {
                    value = value.replace(/^0+(?=\d)/, '');
                } else {
                    value = value.replace(/^0+/, '');
                }

                if (value === "") {
                    value = "0";
                }
                handleInputChange(field, value);

                if (numberChangeTimeout) {
                    clearTimeout(numberChangeTimeout);
                }
                const timeout = setTimeout(() => onFormChange(field, value), 500);
                setNumberChangeTimeout(timeout);
            }
        };
    };

    const handleReset = () => {
        const resetValues = {
            V1: "0",
            V2: "0",
            Vc1: "0",
            Vc2: "0",
            Tdh: "0",
            Tc: "0",
            Mf: "-",
        };
        setFormState(resetValues);
        Object.keys(resetValues).forEach((key) => onFormChange(key, "0"));
    };

    return (
        <div className={`${className ? className : ""}`}>
            <form className={`w-100 row m-0 px-0 ${ecf["wrap-form"]}`}>
                <div className="col-12 col-md-6">
                    <h5 className="mb-1">Đồng hồ công tác:</h5>
                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="firstNum" className="form-label">Số đầu</label>
                        <input
                            onKeyDown={(e) => handleEnterKey(e, 1, tabFormName)}
                            tabIndex={1}
                            readOnly={readOnly ? true : false}
                            type="text"
                            className="form-control"
                            id="firstNum"
                            value={formState.V1 || "0"}
                            onChange={handleNumericInput("V1")}
                            disabled={isDisable}
                            autoComplete="off"
                            name={tabFormName + "-1"}
                        />
                    </div>

                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="lastNum" className="form-label">Số cuối</label>
                        <input
                            onKeyDown={(e) => handleEnterKey(e, 2, tabFormName)}
                            tabIndex={3}
                            readOnly={readOnly ? true : false}
                            type="text"
                            className="form-control"
                            id="lastNum"
                            value={formState.V2 || "0"}
                            onChange={handleNumericInput("V2")}
                            disabled={isDisable}
                            autoComplete="off"
                            name={tabFormName + "-2"}
                        />
                    </div>

                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="tdh" className="form-label">Nhiệt độ (℃)</label>
                        <input
                            onKeyDown={(e) => handleEnterKey(e, 3, tabFormName)}
                            tabIndex={5}
                            readOnly={readOnly ? true : false}
                            type="text"
                            className="form-control"
                            id="tdh"
                            value={formState.Tdh || "0"}
                            onChange={handleNumberChange("Tdh")}
                            disabled={isDisable}
                            autoComplete="off"
                            name={tabFormName + "-3"}
                        />
                    </div>

                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="tc" className="form-label">V<sub>đh</sub></label>
                        <input
                            type="text"
                            className="form-control"
                            value={Math.round((Number(formState.V2) - Number(formState.V1)) * 1000000) / 1000000}
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <h5 className="mb-1">Đồng hồ chuẩn:</h5>
                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="firstNum" className="form-label">Số đầu</label>
                        <input
                            onKeyDown={(e) => handleEnterKey(e, 1, tabFormName + "-c")}
                            tabIndex={2}
                            readOnly={readOnly ? true : false}
                            type="text"
                            className="form-control"
                            id="firstNum"
                            value={formState.Vc1 || "0"}
                            onChange={handleNumberChange("Vc1")}
                            disabled={isDisable}
                            autoComplete="off"
                            name={tabFormName + "-c-1"}
                        />
                    </div>
                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="lastNum" className="form-label">Số cuối</label>
                        <input
                            onKeyDown={(e) => handleEnterKey(e, 2, tabFormName + "-c")}
                            tabIndex={4}
                            readOnly={readOnly ? true : false}
                            type="text"
                            className="form-control"
                            id="lastNum"
                            value={formState.Vc2 || "0"}
                            onChange={handleNumberChange("Vc2")}
                            disabled={isDisable}
                            autoComplete="off"
                            name={tabFormName + "-c-2"}
                        />
                    </div>

                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="tc" className="form-label">Nhiệt độ (℃)</label>
                        <input
                            onKeyDown={(e) => handleEnterKey(e, 3, tabFormName + "-c")}
                            tabIndex={6}
                            readOnly={readOnly ? true : false}
                            type="text"
                            className="form-control"
                            id="tc"
                            value={formState.Tc || "0"}
                            onChange={handleNumberChange("Tc")}
                            disabled={isDisable}
                            autoComplete="off"
                            name={tabFormName + "-c-3"}
                        />
                    </div>

                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="tc" className="form-label">V<sub>c</sub></label>
                        <input
                            type="text"
                            className="form-control"
                            value={Math.round((Number(formState.Vc2) - Number(formState.Vc1)) * 1000000) / 1000000}
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="w-100">
                    <div className={`${ecf["box-input-form"]}`}>
                        <h5 className="mb-2">Sai số:</h5>
                        <input type="text" className="form-control p-3" id={ecf["errNum"]} value={saiSo || "0%"} disabled />
                    </div>
                    <div className=" d-flex justify-content-end">
                        <button aria-label="Nhập lại" type="reset" onClick={handleReset} className="btn mt-2 py-2 btn-secondary">
                            Nhập lại
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}