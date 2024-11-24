import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface DatePickerFieldProps {
    value: Dayjs | null;
    onChange: (newValue: Dayjs | null) => void;
    disabled: boolean;
    minDate?: Dayjs;
    className?: string;
    name: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = React.memo(({ value, onChange, disabled, minDate, className, name }) => {
    return (
        <DatePicker
            className={className}
            value={value}
            format="DD-MM-YYYY"
            disabled={disabled}
            minDate={minDate}
            onChange={onChange}
            slotProps={{
                textField: {
                    fullWidth: true,
                    style: {
                        minWidth: '175px',
                        backgroundColor: disabled ? "#e9ecef" : "white"
                    },
                    name: name
                }
            }}
        />
    );
});

export default DatePickerField;