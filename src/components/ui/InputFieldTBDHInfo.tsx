import { useDongHoList } from "@/context/ListDongHoContext";
import { DongHo } from "@lib/types";
import React, { useEffect, useState } from "react";

const InputField: React.FC<{
    onChange: (val: string) => void;
    disabled: boolean;
    isNumber?: boolean;
    error?: string;
    name: string;
    index: number;
    value?: string;
    inputStyle?: React.CSSProperties; // ✅ thêm prop mới
}> = React.memo(({ onChange, disabled, error, name, index, value, inputStyle, isNumber }) => {
    const { dongHoList } = useDongHoList();
    const [val, setValue] = useState<string>(value || (isNumber ? "0" : ""));

    useEffect(() => {
        setValue(value || "");
    }, [value]);


    const handleNumericInput = (val: string) => {
        let rawValue = val.replace(/[^0-9.]/g, '');

        const parts = rawValue.split('.');
        if (parts.length > 2) {
            rawValue = parts[0] + '.' + parts.slice(1).join('');
        }

        if (rawValue.startsWith('.')) {
            rawValue = '0' + rawValue;
        }

        if (!rawValue.includes('.')) {
            rawValue = rawValue.replace(/^0+/, '') || '0';
        }

        setValue(rawValue);
    };


    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
        field: string,
    ) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                const prevIndex = index - 1;
                const prevInput = document.querySelector(`input[name="${field}-${prevIndex}"]`) as HTMLInputElement;
                if (prevInput) {
                    prevInput.focus();
                }
            } else {
                const nextIndex = index + 1;
                const nextInput = document.querySelector(`input[name="${field}-${nextIndex}"]`) as HTMLInputElement;
                if (nextInput) {
                    nextInput.focus();
                }
            }
        }
    };
    // todo

    return (
        <>
            <input
                onKeyDown={(e) => handleEnterKey(e, index, name)}
                autoComplete="off"
                type="text"
                value={val}
                disabled={disabled}
                onChange={(e) => {
                    if (isNumber) {
                        handleNumericInput(e.target.value)
                    } else {
                        setValue(e.target.value);
                    }
                    onChange(e.target.value);
                }}
                className="form-control"
                style={{ width: "100%", minWidth: "130px", ...inputStyle }}
                name={name + "-" + index}
            />
            {error && (
                <small className="w-100 text-center text-danger">
                    {error}
                </small>
            )}
        </>
    );
});

export default InputField;