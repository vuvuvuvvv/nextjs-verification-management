import { useEffect, useState } from "react";
import ecf from "@styles/scss/components/error-caculator-form.module.scss";

interface CaculatorFormProps {
    className?: string;
    formValue: {
        firstnumDHCT: number;
        lastNumDHCT: number;
        firstnumDHC: number;
        lastNumDHC: number;
    };
    onFormChange: (field: string, value: number) => void;
    d?: string;
}

export default function DNBT30ErrorCaculatorForm({ className, formValue, onFormChange, d }: CaculatorFormProps) {
    const [firstnumDHC, setFirstNumDHC] = useState<string>("0");
    const [lastNumDHC, setLastNumDHC] = useState<string>("0");
    const [errorNum, setErrorNum] = useState<string>("0%");

    const getDecimalPlaces = (d: string) => {
        const parts = d.split(".");
        return parts.length > 1 ? parts[1].length : 0;
    };

    const decimalPlaces = d ? getDecimalPlaces(d) : 0;

    const handleNumericInput = (e: React.FormEvent<HTMLInputElement>, field: string) => {
        const value = e.currentTarget.value.replace(/[^0-9]/g, '');
        const numericValue = Number(value) / Math.pow(10, decimalPlaces);
        onFormChange(field, numericValue);
    };

    const handleNumberChange = (setter: (value: string) => void, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Replace commas with periods
        value = value.replace(/,/g, '.');
        // Allow only numbers and one decimal point
        if (/^\d*\.?\d*$/.test(value)) {
            // Remove leading and trailing zeros
            value = value.replace(/^0+|0+$/g, '');
            // If the value is empty after removing zeros, set it to "0"
            if (value === "") {
                value = "0";
            }
            setter(value);
            onFormChange(field, parseFloat(value));
        }
    };

    const handleReset = () => {
        onFormChange("firstnumDHCT", 0);
        onFormChange("lastNumDHCT", 0);
        onFormChange("firstnumDHC", 0);
        onFormChange("lastNumDHC", 0);
    };

    useEffect(() => {
        if (formValue.lastNumDHC && formValue.lastNumDHCT && formValue.firstnumDHC && formValue.firstnumDHCT) {
            calculateError();
        } else {
            setErrorNum("0%");
        }
    }, [formValue.lastNumDHC, formValue.lastNumDHCT, formValue.firstnumDHC, formValue.firstnumDHCT]);

    const calculateError = () => {
        const VDHCT = formValue.lastNumDHCT - formValue.firstnumDHCT;
        console.log("VDHCT: ", VDHCT);
        const VDHC = formValue.lastNumDHC - formValue.firstnumDHC;
        if (VDHC !== 0) {
            const error = ((VDHCT - VDHC) / VDHC) * 100;
            setErrorNum((Math.round(error * 10000) / 10000).toFixed(4) + "%");
        } else {
            setErrorNum("0%");
        }
    };

    return (
        <div className={`${className ? className : ""}`}>
            <form className={`w-100 ${ecf["wrap-form"]}`}>
                <h5 className="mb-1">Đồng hồ công tác:</h5>
                <div className={`mb-3 ${ecf["box-input-form"]}`}>
                    <label htmlFor="firstNum" className="form-label">Số đầu</label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstNum"
                        placeholder={`Nhập số đầu (0.${'0'.repeat(decimalPlaces)})`}
                        value={formValue.firstnumDHCT.toFixed(decimalPlaces)}
                        onChange={(e) => handleNumericInput(e, "firstnumDHCT")}
                    />
                </div>

                <div className={`mb-3 ${ecf["box-input-form"]}`}>
                    <label htmlFor="lastNum" className="form-label">Số cuối</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastNum"
                        placeholder={`Nhập số cuối (0.${'0'.repeat(decimalPlaces)})`}
                        value={formValue.lastNumDHCT.toFixed(decimalPlaces)}
                        onChange={(e) => handleNumericInput(e, "lastNumDHCT")}
                    />
                </div>

                <h5 className="mb-1">Đồng hồ chuẩn:</h5>
                <div className={`mb-3 ${ecf["box-input-form"]}`}>
                    <label htmlFor="firstNum" className="form-label">Số đầu</label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstNum"
                        placeholder={`Nhập số đầu (0.${'0'.repeat(decimalPlaces)})`}
                        value={firstnumDHC}
                        onChange={handleNumberChange(setFirstNumDHC, "firstnumDHC")}
                    />
                </div>

                <div className={`mb-3 ${ecf["box-input-form"]}`}>
                    <label htmlFor="lastNum" className="form-label">Số cuối</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastNum"
                        placeholder={`Nhập số cuối (0.${'0'.repeat(decimalPlaces)})`}
                        value={lastNumDHC}
                        onChange={handleNumberChange(setLastNumDHC, "lastNumDHC")}
                    />
                </div>

                <div className="mb-3">
                    <div className={`${ecf["box-input-form"]}`}>
                        <h5 className="mb-2">Sai số:</h5>
                        <input type="text" className="form-control p-3" id={ecf["errNum"]} value={errorNum} disabled readOnly />
                    </div>
                </div>

                <button type="button" className={`w-100 btn py-2 btn-success ${ecf["btn-save"]}`} disabled={errorNum === "0%"}>
                    Lưu kết quả
                </button>
                <div className={`${ecf["box-button"]}`}>
                    <button type="reset" onClick={handleReset} className="btn py-2 btn-secondary">
                        Nhập lại
                    </button>
                </div>
            </form>
        </div>
    );
}