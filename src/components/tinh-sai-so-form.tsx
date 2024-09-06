import { useEffect, useState } from "react";
import ecf from "@styles/scss/components/tinh-sai-so-form.module.scss";
import { getTinhSaiSoValue } from "@lib/system-function";

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

export default function DNBT30TinhSaiSoForm({ className, formValue, onFormChange, d }: CaculatorFormProps) {
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
            onFormChange(field, parseFloat(value));
        }
    };

    const handleReset = () => {
        onFormChange("firstnumDHCT", 0);
        onFormChange("lastNumDHCT", 0);
        onFormChange("firstnumDHC", 0);
        onFormChange("lastNumDHC", 0);
        setFirstNumDHC("0");
        setLastNumDHC("0");
    };

    useEffect(() => {
        setErrorNum(getTinhSaiSoValue(formValue).toString() + "%");
    }, [formValue.lastNumDHC, formValue.lastNumDHCT, formValue.firstnumDHC, formValue.firstnumDHCT]);

    return (
        <div className={`${className ? className : ""}`}>
            <form className={`w-100 row m-0 px-0 ${ecf["wrap-form"]}`}>
                <div className="col-12 col-md-6 col-xxl-12">
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
                            autoComplete="off"
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
                            autoComplete="off"
                        />
                    </div>
                </div>

                <div className="col-12 col-md-6 col-xxl-12">
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
                            autoComplete="off"
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
                            autoComplete="off"
                        />
                    </div>
                </div>


                <div className="mb-3 w-100">
                    <div className={`${ecf["box-input-form"]}`}>
                        <h5 className="mb-2">Sai số:</h5>
                        <input type="text" className="form-control p-3" id={ecf["errNum"]} value={errorNum} disabled readOnly />
                    </div>
                </div>
                <div className={`${ecf["box-button"]}`}>
                    <button type="button" className={`w-100 btn py-2 btn-success ${ecf["btn-save"]}`} disabled={errorNum === "0%"}>
                        Lưu kết quả
                    </button>
                    <button type="reset" onClick={handleReset} className="btn py-2 btn-secondary">
                        Nhập lại
                    </button>
                </div>
            </form>
        </div>
    );
}