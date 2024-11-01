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
    };
    readOnly?: boolean,
    onFormChange: (field: string, value: number) => void;
    d?: string;
    isDisable?: boolean
}

export default function DNBT30TinhSaiSoForm({ className, formValue, readOnly = false, onFormChange, d, isDisable }: CaculatorFormProps) {
    const [V1, setV1] = useState<string>(formValue.V1.toString() || "0");
    const [V2, setV2] = useState<string>(formValue.V2.toString() || "0");
    const [Vc1, setVc1] = useState<string>(formValue.Vc1 ? formValue.Vc1.toString() : "0");
    const [Vc2, setVc2] = useState<string>(formValue.Vc2 ? formValue.Vc2.toString() : "0");
    const [Tdh, setTdh] = useState<string>("0");
    const [Tc, setTc] = useState<string>("0");
    const [saiSo, setSaiSo] = useState<string>("0%");
    const { dongHoSelected } = useDongHoList();

    const dongHoSelectedRef = useRef(dongHoSelected);
    const prevFormValuesRef = useRef(formValue);

    useEffect(() => {
        if (prevFormValuesRef.current != formValue) {
            if (dongHoSelectedRef.current != dongHoSelected) {
                dongHoSelectedRef.current = dongHoSelected;
                setVc1(formValue.Vc1.toString());
                setVc2(formValue.Vc2.toString());
            } else {
                setVc1(Vc1);
                setVc2(Vc2);
            }

            setV1(formValue.V1.toString());
            setV2(formValue.V2.toString());
            setTdh(formValue.Tdh.toString());
            setTc(formValue.Tc.toString());

            prevFormValuesRef.current = formValue;
        }
    }, [formValue]);

    const [numericInputTimeout, setNumericInputTimeout] = useState<NodeJS.Timeout | null>(null);

    const getDecimalPlaces = () => {
        if (!d) return null;
        const parts = d.split(".");
        return parts.length > 1 ? parts[1].length : 0;
    };

    const handleNumericInput = (setter: (value: string) => void, field: string) => {
        const decimalPlaces = getDecimalPlaces() || 0;

        return (e: React.FormEvent<HTMLInputElement>) => {
            let rawValue = e.currentTarget.value.replace(/[^0-9]/g, '');

            // Remove leading zeros if rawValue length is greater than or equal to decimalPlaces + 2
            if (rawValue.length >= decimalPlaces + 2) {
                rawValue = rawValue.replace(/^0+/, '');
            }

            let formattedValue = '';

            if (rawValue.length <= decimalPlaces) {
                formattedValue = `0.${rawValue.padEnd(decimalPlaces, '0')}`;
            } else {
                const integerPart = rawValue.slice(0, rawValue.length - decimalPlaces);
                const decimalPart = rawValue.slice(rawValue.length - decimalPlaces);
                formattedValue = `${integerPart}.${decimalPart}`;
            }

            setter(formattedValue);

            if (numericInputTimeout) {
                clearTimeout(numericInputTimeout);
            }

            // Capture the numeric value before setting the timeout
            const numericValue = Number(formattedValue);

            const timeout = setTimeout(() => {
                onFormChange(field, numericValue);
            }, 0);
            setNumericInputTimeout(timeout);
        };
    };


    const [numberChangeTimeout, setNumberChangeTimeout] = useState<NodeJS.Timeout | null>(null);
    const handleNumberChange = (setter: (value: string) => void, field: string) => {
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
                setter(value);

                if (numberChangeTimeout) {
                    clearTimeout(numberChangeTimeout);
                }
                const timeout = setTimeout(() => onFormChange(field, parseFloat(value)), 500);
                setNumberChangeTimeout(timeout);
            }
        };
    };

    const handleReset = () => {
        onFormChange("V1", 0);
        onFormChange("V2", 0);
        onFormChange("Vc1", 0);
        onFormChange("Vc2", 0);
        onFormChange("Tdh", 0);
        onFormChange("Tc", 0);
        setV1("0");
        setV2("0");
        setVc1("0");
        setVc2("0");
        setTdh("0");
        setTc("0");
    };

    useEffect(() => {
        setSaiSo(getSaiSoDongHo(formValue) ? getSaiSoDongHo(formValue)?.toString() + "%" : "0%");
    }, [formValue.Vc2, formValue.V2, formValue.Vc1, formValue.V1]);

    return (
        <div className={`${className ? className : ""}`}>
            <form className={`w-100 row m-0 px-0 ${ecf["wrap-form"]}`}>
                <div className="col-12 col-md-6">
                    <h5 className="mb-1">Đồng hồ công tác:</h5>
                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="firstNum" className="form-label">Số đầu</label>
                        <input
                            readOnly={readOnly ? true : false}
                            type="text"
                            className="form-control"
                            id="firstNum"
                            value={V1}
                            onChange={handleNumericInput(setV1, "V1")}
                            disabled={isDisable}
                            autoComplete="off"
                        />
                    </div>

                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="lastNum" className="form-label">Số cuối</label>
                        <input
                            readOnly={readOnly ? true : false}
                            type="text"
                            className="form-control"
                            id="lastNum"
                            value={V2}
                            onChange={handleNumericInput(setV2, "V2")}
                            disabled={isDisable}
                            autoComplete="off"
                        />
                    </div>

                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="tdh" className="form-label">Nhiệt độ (℃)</label>
                        <input
                            readOnly={readOnly ? true : false}
                            type="text"
                            className="form-control"
                            id="tdh"
                            value={Tdh}
                            onChange={handleNumberChange(setTdh, "Tdh")}
                            disabled={isDisable}
                            autoComplete="off"
                        />
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <h5 className="mb-1">Đồng hồ chuẩn:</h5>
                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="firstNum" className="form-label">Số đầu</label>
                        <input
                            readOnly={readOnly ? true : false}
                            type="text"
                            className="form-control"
                            id="firstNum"
                            value={Vc1}
                            onChange={handleNumberChange(setVc1, "Vc1")}
                            disabled={isDisable}
                            autoComplete="off"
                        />
                    </div>
                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="lastNum" className="form-label">Số cuối</label>
                        <input
                            readOnly={readOnly ? true : false}
                            type="text"
                            className="form-control"
                            id="lastNum"
                            value={Vc2}
                            onChange={handleNumberChange(setVc2, "Vc2")}
                            disabled={isDisable}
                            autoComplete="off"
                        />
                    </div>

                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="tc" className="form-label">Nhiệt độ (℃)</label>
                        <input
                            readOnly={readOnly ? true : false}
                            type="text"
                            className="form-control"
                            id="tc"
                            value={Tc}
                            onChange={handleNumberChange(setTc, "Tc")}
                            disabled={isDisable}
                            autoComplete="off"
                        />
                    </div>
                </div>

                <div className="mb-3 w-100">
                    <div className={`${ecf["box-input-form"]}`}>
                        <h5 className="mb-2">Sai số:</h5>
                        <input type="text" className="form-control p-3" id={ecf["errNum"]} value={saiSo} disabled readOnly />
                    </div>
                </div>
                <div className={`${ecf["box-button"]} ${readOnly || isDisable ? "d-none" : ""}`}>
                    <button aria-label="Lưu kết quả" type="button" className={`w-100 btn py-2 d-none btn-success ${ecf["btn-save"]}`} disabled={saiSo === "0%"}>
                        Lưu kết quả
                    </button>
                    <button aria-label="Nhập lại" type="reset" onClick={handleReset} className="btn py-2 btn-secondary">
                        Nhập lại
                    </button>
                </div>
            </form>
        </div>
    );
}