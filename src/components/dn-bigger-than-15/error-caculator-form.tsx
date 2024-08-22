import { useState } from "react"

import ecf from "@styles/scss/components/error-caculator-form.module.scss"

interface CaculatorFormProps {
    className?: string,
}

export default function DNBT15ErrorCaculatorForm({ className }: CaculatorFormProps) {
    const [firstnumDHCT, setFirstNumDHCT] = useState(0);
    const [lastNumDHCT, setLastNumDHCT] = useState(0);
    const [firstnumDHC, setFirstNumDHC] = useState(0);
    const [lastNumDHC, setLastNumDHC] = useState(0);
    // const [vdhc, setVdhc] = useState(0);
    const [errorNum, setErrorNum] = useState<BigInt>(BigInt("0"));

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
        // setVdhc(0);
        setErrorNum(BigInt("0"));
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    return (
        <div className={`${className ? className : ""}`}>
            <form className={`w-100 ${ecf['wrap-form']}`} onSubmit={handleSubmit}>

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
                        <input type="text" className="form-control p-3" id={ecf["errNum"]} value={errorNum.toString()} disabled readOnly />
                    </div>
                </div>

                <div className={`${ecf['box-button']}`}>
                    <button type="submit" className="btn btn-primary">Tính sai số</button>
                    <button type="reset" onClick={handleReset} className="btn btn-secondary">Nhập lại</button>
                </div>
                <button className={`w-100 btn btn-success ${ecf['btn-save']}`}>Lưu kết quả</button>

            </form>
        </div>
    )
}