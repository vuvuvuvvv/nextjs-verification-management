import { useState } from "react"

interface CaculatorFormProps {
    className?: string,
}

export default function ErrorCaculatorForm({ className }: CaculatorFormProps) {
    const [firstnum, setFirstNum] = useState(0);
    const [lastNum, setLastNum] = useState(0);

    const [vdhc, setVdhc] = useState(0);
    const [error, setError] = useState(0);

    const [operator, setOperator] = useState("");


    // Function to handle numeric input
    const handleNumericInput = (e: React.FormEvent<HTMLInputElement>, setValue: React.Dispatch<React.SetStateAction<number>>) => {
        const value = e.currentTarget.value.replace(/[^0-9]/g, '');
        setValue(Number(value));
    };

    return (
        <div className={`${className ? className : ""}`}>
            <form className="w-100">
                <input type="text" value={firstnum} onChange={(e) => handleNumericInput(e, setFirstNum)} />
                <input type="text" value={lastNum} onChange={(e) => handleNumericInput(e, setLastNum)} />
            </form>
        </div>
    )
}