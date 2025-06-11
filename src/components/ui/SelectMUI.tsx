"use client";

import React from "react";
import {
    Stack,
    OutlinedInput,
    InputLabel,
    MenuItem,
    Chip,
    Select,
    FormControl,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

type SelectMUIProps = {
    names: string[];
    selectedNames: string[];
    onChange: (selected: string[]) => void;
    isMultiple?: boolean;
};

const SelectMUI: React.FC<SelectMUIProps> = ({
    names,
    selectedNames,
    onChange,
    isMultiple=false
}) => {
    const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        const value = e.target.value;
        onChange(typeof value === "string" ? value.split(",") : (value as string[]));
    };

    const handleDelete = (valueToDelete: string) => {
        onChange(selectedNames.filter((name) => name !== valueToDelete));
    };

    return (
        <FormControl sx={{ m: 1, width: 500 }}>
            <InputLabel>Multiple Select</InputLabel>
            <Select
                multiple={isMultiple}
                value={selectedNames}
                onChange={() => handleChange}
                input={<OutlinedInput label="Multiple Select" />}
                renderValue={(selected) => (
                    <Stack gap={1} direction="row" flexWrap="wrap">
                        {(selected as string[]).map((value) => (
                            <Chip
                                key={value}
                                label={value}
                                onDelete={() => handleDelete(value)}
                                deleteIcon={
                                    <CancelIcon
                                        onMouseDown={(event) => event.stopPropagation()}
                                    />
                                }
                            />
                        ))}
                    </Stack>
                )}
            >
                {names.map((name) => (
                    <MenuItem
                        key={name}
                        value={name}
                        sx={{ justifyContent: "space-between" }}
                    >
                        {name}
                        {selectedNames.includes(name) ? <CheckIcon color="info" /> : null}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SelectMUI;
