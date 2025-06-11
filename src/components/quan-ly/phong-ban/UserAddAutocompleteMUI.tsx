"use client";

import React from "react";
import {
    MenuItem,
    Autocomplete,
    TextField,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { User, UserInPhongBan } from "@/lib/types";

type UserAddAutocompleteMUIProps = {
    users: UserInPhongBan[];
    value?: UserInPhongBan[]; // <== THÊM DÒNG NÀY
    onChange: (selectedIds: number[]) => void;
    isMultiple?: boolean;
    isDisabled?: boolean;
};

const UserAddAutocompleteMUI: React.FC<UserAddAutocompleteMUIProps> = ({
    users = [],
    value,
    onChange,
    isMultiple = false,
    isDisabled = false,
}) => {
    return (
        <Autocomplete
            value={
                isMultiple
                    ? value ?? []
                    : value && value.length > 0
                        ? value[0]
                        : null
            }
            multiple={isMultiple}
            disabled={isDisabled}
            id="user-autocomplete"
            options={users}
            getOptionLabel={(option) => {
                return (option.user?.fullname && option.user?.username) ? `${option.user?.fullname} (${option.user?.username})` : "Không rõ tên";
            }
            }
            isOptionEqualToValue={(option, value) =>
                option?.user?.username == value?.user?.username
            }
            ListboxProps={{
                sx: {
                    maxHeight: 240,
                    overflowY: 'auto',
                },
            }}
            disableCloseOnSelect={isMultiple}
            onChange={(_event, selectedValues) => {
                const values = Array.isArray(selectedValues)
                    ? selectedValues
                    : selectedValues
                        ? [selectedValues]
                        : [];
                const ids = values
                    .filter((v) => v.user?.id !== undefined)
                    .map((v) => v.user!.id);
                onChange(ids);
            }}
            renderOption={(props, option, { selected }) => {
                return (option?.user && option.user?.username) ? (
            
                    <MenuItem
                        {...props}
                        key={`${option.user?.id ?? option.user?.username ?? 'unknown'}-${option.phong_ban ?? ''}`}
                        className="w-100"
                        sx={{
                            display: "block",
                            gap: 1,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            height: option.is_manager != null ? "60px" : "48px", // optional: fixed height to keep rows aligned
                            position: "relative",
                        }}
                    >
                        <p style={{
                            margin: 0,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            maxWidth: "100%", // giới hạn từng phần tử
                        }}>
                            {option.user?.fullname} {option.user?.fullname && option.user?.username ? <small>({option.user?.username})</small> : ""}
                        </p>

                        <small style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            maxWidth: "100px",
                            color: "#555",
                        }}>
                            {option.is_manager != null ? (option.is_manager ? "Trưởng phòng" : "Nhân viên") : ""}
                        </small>
                        {option.is_manager != null && <small style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            maxWidth: "100px",
                            color: "#888",
                        }}> - {option.phong_ban || "Không rõ phòng ban"}
                        </small>}


                        {selected && (
                            <CheckIcon color="info" style={{
                                marginLeft: "auto",
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)"
                            }} />
                        )}
                    </MenuItem>

                ) : null
            }
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Chọn người dùng"
                    placeholder="Tìm kiếm..."
                />
            )}
        />
    );
};

export default UserAddAutocompleteMUI;
