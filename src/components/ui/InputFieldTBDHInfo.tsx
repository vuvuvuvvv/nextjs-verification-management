import { useDongHoList } from "@/context/ListDongHo";
import { DongHo } from "@lib/types";
import React, { useEffect, useState } from "react";

const InputField: React.FC<{
    onChange: (val: string) => void;
    disabled: boolean;
    error?: string;
    name: string;
    index: number;
    value?: string;
}> = React.memo(({ onChange, disabled, error, name, index, value }) => {
    const { dongHoList } = useDongHoList();
    const [val, setValue] = useState<string>(value || "");

    useEffect(() => {
        setValue(value || "");
    }, [value]);

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
        field: "so_giay_chung_nhan" | "seri_sensor" | "seri_chi_thi" | "so_tem",
    ) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                const prevIndex = index - 1;
                if (prevIndex >= 0) {
                    const prevInput = document.querySelector(`input[name="${field}-${prevIndex}"]`) as HTMLInputElement;
                    if (prevInput) {
                        prevInput.focus();
                    }
                }
            } else {
                const nextIndex = index + 1;
                if (nextIndex < dongHoList.length) {
                    const nextInput = document.querySelector(`input[name="${field}-${nextIndex}"]`) as HTMLInputElement;
                    if (nextInput) {
                        nextInput.focus();
                    }
                }
            }
        }
    };
    // todo

    return (
        <div>
            <input
                onKeyDown={(e) => handleEnterKey(e, index, name as "so_giay_chung_nhan" | "seri_sensor" | "seri_chi_thi" | "so_tem")}
                autoComplete="off"
                type="text"
                value={val}
                disabled={disabled}
                onChange={(e) => {
                    onChange(e.target.value);
                    setValue(e.target.value);
                }}
                className="form-control"
                style={{ width: "100%", minWidth: "130px" }}
                name={name + "-" + index}
            />
            {error && (
                <small className="w-100 text-center text-danger">
                    {error}
                </small>
            )}
        </div>
    );
});

export default InputField;