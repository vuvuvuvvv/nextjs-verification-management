"use client";

import React from "react";
import {
    MenuItem,
    Autocomplete,
    TextField
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

type AutocompleteMUIProps = {
    arrString: string[];
    selectedString: string[];
    onChange: (selected: string[]) => void;
    isMultiple?: boolean;
};

const AutocompleteMUI: React.FC<AutocompleteMUIProps> = ({
    arrString,
    selectedString,
    onChange,
    isMultiple = false
}) => {
    return (
        <Autocomplete
            sx={{ m: 1, width: 500 }}
            multiple={isMultiple}
            id="multiple-autocomplete"
            options={arrString}
            value={selectedString}
            getOptionLabel={(option) => option}
            disableCloseOnSelect
            onChange={(_event, value) =>
                onChange(
                    Array.isArray(value)
                        ? value
                        : value !== null && value !== undefined
                        ? [value]
                        : []
                )
            }
            renderOption={(props, option, { selected }) => (
                <MenuItem
                    value={option}
                    sx={{ justifyContent: "space-between" }}
                    {...props}
                >
                    {option}
                    {selected ? <CheckIcon color="info" /> : null}
                </MenuItem>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Multiple Autocomplete"
                    placeholder="Favorites"
                />
            )}
        />
    );
};

export default AutocompleteMUI;
