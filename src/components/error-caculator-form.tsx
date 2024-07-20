import { useEffect, useState } from "react"

import ecf from "@styles/scss/components/error-caculator-form.module.scss"

interface CaculatorFormProps {
    className?: string,
}

export default function DNBT30ErrorCaculatorForm({ className }: CaculatorFormProps) {
    const [firstnumDHCT, setFirstNumDHCT] = useState(0);
    const [lastNumDHCT, setLastNumDHCT] = useState(0);
    const [firstnumDHC, setFirstNumDHC] = useState(0);
    const [lastNumDHC, setLastNumDHC] = useState(0);
    const [errorNum, setErrorNum] = useState<string>("0%");

    // Function to handle numeric input
    const handleNumericInput = (e: React.FormEvent<HTMLInputElement>, setValue: React.Dispatch<React.SetStateAction<number>>) => {
        const value = e.currentTarget.value.replace(/[^0-9]/g, '');
        setValue(Number(value));
    };

    const handleReset = () => {
        setFirstNumDHCT(0);
        setLastNumDHCT(0);
        setFirstNumDHC(0);
        setLastNumDHC(0);
    }
    

    useEffect(() => {
        if(lastNumDHC && lastNumDHCT && firstnumDHC && firstnumDHCT) {
            calculateError();
        } else {
            setErrorNum("0%");
        }
    }, [lastNumDHC, lastNumDHCT, firstnumDHC, firstnumDHCT])

    const calculateError = () => {
        const VDHCT = lastNumDHCT - firstnumDHCT;
        const VDHC = lastNumDHC - firstnumDHC;
        if (VDHC !== 0) {
            const error = ((VDHCT - VDHC) / VDHC) * 100;
            setErrorNum((Math.round(error * 10000) / 10000).toFixed(4) + "%");
        } else {
            setErrorNum("0%");
        }
    }

    return (
        <div className={`${className ? className : ""}`}>
            <form className={`w-100 ${ecf['wrap-form']}`}>

                <h5 className="mb-1">Đồng hồ công tác:</h5>
                <div className={`mb-3 ${ecf['box-input-form']}`}>
                    <label htmlFor="firstNum" className="form-label">Số đầu</label>
                    <input type="text" className="form-control" id="firstNum" placeholder="Nhập số đầu" value={firstnumDHCT} onChange={(e) => handleNumericInput(e, setFirstNumDHCT)} />
                </div>

                <div className={`mb-3 ${ecf['box-input-form']}`}>
                    <label htmlFor="lastNum" className="form-label">Số cuối</label>
                    <input type="text" className="form-control" id="lastNum" placeholder="Nhập số cuối" value={lastNumDHCT} onChange={(e) => handleNumericInput(e, setLastNumDHCT)} />
                </div>

                <h5 className="mb-1">Đồng hồ chuẩn:</h5>
                <div className={`mb-3 ${ecf['box-input-form']}`}>
                    <label htmlFor="firstNum" className="form-label">Số đầu</label>
                    <input type="text" className="form-control" id="firstNum" placeholder="Nhập số đầu" value={firstnumDHC} onChange={(e) => handleNumericInput(e, setFirstNumDHC)} />
                </div>

                <div className={`mb-3 ${ecf['box-input-form']}`}>
                    <label htmlFor="lastNum" className="form-label">Số cuối</label>
                    <input type="text" className="form-control" id="lastNum" placeholder="Nhập số cuối" value={lastNumDHC} onChange={(e) => handleNumericInput(e, setLastNumDHC)} />
                </div>

                <div className="mb-3">
                    <div className={`${ecf['box-input-form']}`}>
                        <h5 className="mb-2">Sai số:</h5>
                        <input type="text" className="form-control p-3" id={ecf["errNum"]} value={errorNum} disabled readOnly />
                    </div>
                </div>

                <button type="button" className={`w-100 btn py-2 btn-success ${ecf['btn-save']}`} disabled={errorNum === "0%"}>Lưu kết quả</button>
                <div className={`${ecf['box-button']}`}>
                    <button type="reset" onClick={handleReset} className="btn py-2 btn-secondary">Nhập lại</button>
                </div>

            </form>
        </div>
    )
}