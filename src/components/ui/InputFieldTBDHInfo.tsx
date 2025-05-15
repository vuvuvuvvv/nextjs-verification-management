import React, { useEffect, useState } from "react";

interface InputFieldProps {
    onChange?: (val: number | string) => void;
    disabled: boolean;
    isNumber?: boolean;
    error?: string;
    name: string;
    index: number;
    value?: string;
    inputStyle?: React.CSSProperties;
    className?: string;
}

const InputField: React.FC<InputFieldProps> = React.memo(({
    onChange,
    disabled,
    error,
    name,
    index,
    value = "",
    inputStyle,
    isNumber,
    className,
}) => {
    const [val, setVal] = useState<string>(value);

    // Khi prop `value` thay đổi từ parent thì sync lại
    useEffect(() => {
        setVal(value);
    }, [value]);

    // Sanitize chỉ chứa số và dấu chấm
    const sanitizeNumber = (raw: string) => {
        let cleaned = raw.replace(/[^0-9.]/g, "");
        const parts = cleaned.split(".");
        if (parts.length > 2) {
            cleaned = parts[0] + "." + parts.slice(1).join("");
        }
        if (cleaned.startsWith(".")) cleaned = "0" + cleaned;
        if (!cleaned.includes(".")) cleaned = cleaned.replace(/^0+/, "") || "0";
        return cleaned;
    };

    // Gọi onChange khi user rời khỏi ô (onBlur)
    const handleBlur = () => {
        if (!onChange) return;
        const num = isNumber ? Number(val) : val;
        onChange(num);
    };

    // Nhấn Enter để focus lên/xuống
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        const offset = e.shiftKey ? -1 : 1;
        const nextName = `${name}-${index + offset}`;
        const nextInput = document.querySelector(
            `input[name="${nextName}"]`
        ) as HTMLInputElement;
        nextInput?.focus();
    };

    return (
        <>
            <input
                name={`${name}-${index}`}
                type="text"
                value={val}
                disabled={disabled}
                onChange={e => {
                    const next = isNumber
                        ? sanitizeNumber(e.target.value)
                        : e.target.value;
                    setVal(next);
                }}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`form-control ${className}`}
                style={{ width: "100%", minWidth: 130, ...inputStyle }}
                autoComplete="off"
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
