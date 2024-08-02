import { useState } from "react"

import ecf from "@styles/scss/components/error-caculator-form.module.scss"

interface CaculatorFormProps {
    className?: string,
}

export default function ErrorCaculatorForm({ className }: CaculatorFormProps) {
    const [firstnum, setFirstNum] = useState(0);
    const [lastNum, setLastNum] = useState(0);
    const [vdhc, setVdhc] = useState(0);
    const [errorNum, setErrorNum] = useState<BigInt>(BigInt("0"));

    const [operator, setOperator] = useState("");


    // Function to handle numeric input
    const handleNumericInput = (e: React.FormEvent<HTMLInputElement>, setValue: React.Dispatch<React.SetStateAction<number>>) => {
        const value = e.currentTarget.value.replace(/[^0-9]/g, '');
        setValue(Number(value));
    };

    const handleReset = () => {
        setFirstNum(0);
        setLastNum(0);
        setVdhc(0);
        setErrorNum(BigInt("0"));
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(firstnum, lastNum, vdhc, errorNum);
    }

    return (
        <div className={`${className ? className : ""}`}>
            <form className={`w-100 ${ecf['wrap-form']}`} onSubmit={handleSubmit}>

                <div className={`mb-3 ${ecf['box-input-form']}`}>
                    <label htmlFor="firstNum" className="form-label">Số đầu</label>
                    <input type="text" className="form-control" id="firstNum" placeholder="Nhập số đầu" value={firstnum} onChange={(e) => handleNumericInput(e, setFirstNum)} />
                </div>

                <div className={`mb-3 ${ecf['box-input-form']}`}>
                    <label htmlFor="lastNum" className="form-label">Số cuối</label>
                    <input type="text" className="form-control" id="lastNum" placeholder="Nhập số cuối" value={lastNum} onChange={(e) => handleNumericInput(e, setLastNum)} />
                </div>

                <div className="mb-3">
                    <label className="mb-1">Số chỉ đồng hồ chuẩn:</label>
                    <div className={`${ecf['box-input-form']}`}>
                        <label htmlFor="vdhc" className="form-label">V<span>ĐHC</span></label>
                        <input type="text" className="form-control" id="vdhc" placeholder="Nhập số chỉ đồng hồ chuẩn" value={vdhc} onChange={(e) => handleNumericInput(e, setVdhc)} />
                    </div>
                </div>

                <div className="mb-3">
                    <div className={`${ecf['box-input-form']}`}>
                        <h5 className="mb-2">Sai số:</h5>
                        <input type="text" className="form-control p-3" id={ecf["errNum"]} value={errorNum.toString()} disabled readOnly/>
                    </div>
                </div>

                <div className={`${ecf['box-button']}`}>
                    <button type="submit" className="btn btn-primary">Tính sai số</button>
                    <button type="reset" onClick={handleReset} className="btn btn-secondary">Nhập lại</button>
                </div>
            </form>
        </div>
    )
}