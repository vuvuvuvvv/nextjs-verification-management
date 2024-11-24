import React from "react";

const InputField: React.FC<{
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
    error?: string;
    name: string;
}> = React.memo(({ value, onChange, disabled, error, name }) => {
    return (
        <div>
            <input
                autoComplete="off"
                type="text"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className="form-control"
                style={{ width: "100%", minWidth: "170px" }}
                name={name}
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