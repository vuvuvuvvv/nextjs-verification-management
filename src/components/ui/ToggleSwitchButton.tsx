"use client";

import { FC } from "react";

interface ToggleSwitchProps {
    value: boolean;
    onChange: (newValue: boolean) => void;
    disabled?: boolean; // Add the disabled prop
}

const ToggleSwitchButton: FC<ToggleSwitchProps> = ({ value, onChange, disabled = false }) => {
    return (
        <div className="d-flex align-items-center">
            <span style={{fontSize: "14px"}} className={`me-2 ${value && "text-secondary"}`}>Không</span>
            <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="toggleSwitch"
                    checked={value}
                    onChange={() => onChange(!value)}
                    disabled={disabled} 
                    style={{width: "55px", height: "30px"}}
                />
            </div>
            <span style={{fontSize: "14px"}} className={`ms-2 ${!value && "text-secondary"}`}>Đạt</span>
        </div>
    );
};

export default ToggleSwitchButton;