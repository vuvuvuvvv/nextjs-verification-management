import { useEffect, useState } from "react";
import ecf from "@styles/scss/components/tinh-sai-so-form.module.scss";
import { getSaiSoDongHo } from "@lib/system-function";

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
    onFormChange: (field: string, value: number) => void;
    d?: string;
}

export default function DNBT30TinhSaiSoForm({ className, formValue, onFormChange, d }: CaculatorFormProps) {
    const [Vc1, setVc1] = useState<string>("0");
    const [Vc2, setVc2] = useState<string>("0");
    const [Tdh, setTdh] = useState<string>("0");
    const [Tc, setTc] = useState<string>("0");
    const [saiSo, setSaiSo] = useState<string>("0%");

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
        onFormChange("V1", 0);
        onFormChange("V2", 0);
        onFormChange("Vc1", 0);
        onFormChange("Vc2", 0);
        onFormChange("Tdh", 0);
        onFormChange("Tc", 0);
        setVc1("0");
        setVc2("0");
        setTdh("0");
        setTc("0");
    };

    useEffect(() => {
        setSaiSo(getSaiSoDongHo(formValue).toString() + "%");
    }, [formValue.Vc2, formValue.V2, formValue.Vc1, formValue.V1]);

    return (
        <div className={`${className ? className : ""}`}>
            <form className={`w-100 row m-0 px-0 ${ecf["wrap-form"]}`}>
                <div className="col-12 col-md-6">
                    <h5 className="mb-1">Đồng hồ công tác:</h5>
                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="firstNum" className="form-label">Số đầu</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstNum"
                            value={formValue.V1.toFixed(decimalPlaces)}
                            onChange={(e) => handleNumericInput(e, "V1")}
                            autoComplete="off"
                        />
                    </div>

                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="lastNum" className="form-label">Số cuối</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastNum"
                            value={formValue.V2.toFixed(decimalPlaces)}
                            onChange={(e) => handleNumericInput(e, "V2")}
                            autoComplete="off"
                        />
                    </div>

                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="tdh" className="form-label">Nhiệt độ (℃)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="tdh"
                            value={Tdh}
                            onChange={(e) => handleNumberChange(setTdh, "Tdh")}
                            autoComplete="off"
                        />
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <h5 className="mb-1">Đồng hồ chuẩn:</h5>
                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="firstNum" className="form-label">Số đầu</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstNum"
                            placeholder={`Nhập số đầu (0.${'0'.repeat(decimalPlaces)})`}
                            value={Vc1}
                            onChange={handleNumberChange(setVc1, "Vc1")}
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
                            value={Vc2}
                            onChange={handleNumberChange(setVc2, "Vc2")}
                            autoComplete="off"
                        />
                    </div>

                    <div className={`mb-3 ${ecf["box-input-form"]}`}>
                        <label htmlFor="tc" className="form-label">Nhiệt độ (℃)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="tc"
                            value={Tc}
                            onChange={(e) => handleNumberChange(setTc, "Tc")}
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
                <div className={`${ecf["box-button"]}`}>
                    <button type="button" className={`w-100 btn py-2 btn-success ${ecf["btn-save"]}`} disabled={saiSo === "0%"}>
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