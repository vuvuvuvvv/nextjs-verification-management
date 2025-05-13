import { useDongHoList } from "@/context/ListDongHoContext";
import { Dayjs } from "dayjs";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import c_tbIDHInf from "@styles/scss/components/table-input-dongho-info.module.scss";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getDongHoExistsByInfo } from "@/app/api/dongho/route";
import { decode, getLastDayOfMonthInFuture } from "@lib/system-function";
import { TITLE_LUU_LUONG } from "@lib/system-constant";
import DatePickerField from "./ui/DatePickerTBDHInfo";
import { DongHo } from "@lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const ToggleSwitchButton = dynamic(() => import('@/components/ui/ToggleSwitchButton'));
const InputField = dynamic(() => import('@/components/ui//InputFieldTBDHInfo'));

interface TableDongHoInfoProps {
    className?: string,
    setLoading: (value: boolean) => void;
    isDHDienTu: boolean;
    isEditing: boolean;
    selectDongHo: (value: number) => void;
}

const InfoFieldTitle = {
    so_giay_chung_nhan: "Số GCN",
    serial: "Số",
    so_tem: "Số tem",
    k_factor: "Hệ số K",
    hieu_luc_bien_ban: "Hiệu lực biên bản",
    ket_qua_check_vo_ngoai: "Kết quả kiếm tra vỏ ngoài",
    ket_qua_check_do_kin: "Kết quả kiếm tra vỏ ngoài",
    ket_qua_check_do_on_dinh_chi_so: "Kết quả kiếm tra vỏ ngoài",
};

type InfoField = {
    so_giay_chung_nhan?: string;
    serial?: string;
    so_tem?: string;
    k_factor?: string;
    hieu_luc_bien_ban?: Date | null;
    ket_qua_check_vo_ngoai?: boolean;
    ket_qua_check_do_kin?: boolean;
    ket_qua_check_do_on_dinh_chi_so?: boolean;
};

const TableDongHoInfo: React.FC<TableDongHoInfoProps> = React.memo(({
    className,
    setLoading,
    isDHDienTu,
    isEditing,
    selectDongHo
}) => {
    const { dongHoList, setDongHoList, savedDongHoList, isHieuChuan } = useDongHoList();
    const [errorsList, setErrorsList] = useState<InfoField[]>([]);
    const debounceUpdateRef = React.useRef<NodeJS.Timeout | null>(null);
    const debounceDongHoRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleInputChange = React.useCallback((
        index: number,
        field: "so_giay_chung_nhan" | "serial" | "so_tem" | "hieu_luc_bien_ban",
        value: string | Date
    ) => {
        const updatedErrors = [...errorsList];
        const updatedDongHoList = [...dongHoList];

        if (field === "hieu_luc_bien_ban") {
            updatedDongHoList[index].hieu_luc_bien_ban = dayjs(value, 'DD-MM-YYYY').isValid()
                ? dayjs(value, 'DD-MM-YYYY').toDate()
                : null;

            if (debounceDongHoRef.current) clearTimeout(debounceDongHoRef.current);
            debounceDongHoRef.current = setTimeout(() => {
                setDongHoList([...updatedDongHoList]);
            }, 300);

        } else {
            updatedDongHoList[index][field] = value.toString();
            if (debounceDongHoRef.current) clearTimeout(debounceDongHoRef.current);
            debounceDongHoRef.current = setTimeout(() => {
                setDongHoList([...updatedDongHoList]);
            }, 300);
        }
    }, [dongHoList, errorsList, setLoading]);

    const handleRadioToggle = React.useCallback((
        index: number,
        field: "ket_qua_check_vo_ngoai" | "ket_qua_check_do_kin" | "ket_qua_check_do_on_dinh_chi_so",
        value: boolean | string
    ) => {
        if (typeof (value) == "boolean") {
            const updatedDongHoList = [...dongHoList];

            updatedDongHoList[index] = {
                ...updatedDongHoList[index],
                [field]: value
            };

            setDongHoList(updatedDongHoList);
        }
    },
        [dongHoList, errorsList]
    );

    return (
        <div className={`w-100 m-0 mb-3 p-0 ${c_tbIDHInf['wrap-process-table']} ${className ? className : ""}`}>
            <table className={`table table-bordered mb-0 table-hover ${c_tbIDHInf['process-table']}`}>
                <thead className="shadow border">
                    <tr className={`${c_tbIDHInf['table-header']}`}>
                        <th>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                STT
                            </div>
                        </th>

                        <th>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                <span>
                                    Số
                                </span>
                            </div>
                        </th>
                        {/* <th>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                <span>
                                    Trạng thái
                                </span>
                            </div>
                        </th> */}

                        {!isHieuChuan &&
                            <>
                                <th>
                                    <div className={`${c_tbIDHInf['table-label']}`}>
                                        <span>
                                            Vỏ ngoài
                                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className={`${c_tbIDHInf['table-label']}`}>
                                        <span>
                                            Độ kín
                                        </span>
                                    </div>
                                </th>
                                <th>
                                    <div className={`${c_tbIDHInf['table-label']}`}>
                                        <span>
                                            Độ ổn định chỉ số
                                        </span>
                                    </div>
                                </th>
                            </>}

                        <th>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                <span>
                                    Số giấy CN
                                </span>
                            </div>
                        </th>
                        <th>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                <span>
                                    Số Tem
                                </span>
                            </div>
                        </th>
                    </tr>

                </thead>
                <tbody>
                    {(() => {
                        const rows = [];
                        for (let index = 0; index < dongHoList.length; index++) {
                            const dongHo = dongHoList[index];
                            rows.push(
                                <tr key={index}>

                                    <td style={{ cursor: "pointer" }} onClick={() => {
                                        selectDongHo(index)
                                    }}>
                                        <span>{dongHo.index}</span>
                                        <span><FontAwesomeIcon icon={faEdit} className="text-blue"></FontAwesomeIcon></span>
                                    </td>
                                    <td>
                                        <InputField
                                            index={index}
                                            value={dongHo.serial ?? ""}
                                            onChange={(value) => handleInputChange(index, "serial", value)}
                                            disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                            error={errorsList[index]?.serial}
                                            name={`serial`}
                                        />
                                    </td>

                                    {!isHieuChuan &&
                                        <>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <span style={{ fontSize: "14px" }} className={`me-2 ${dongHo.ket_qua_check_vo_ngoai && "text-secondary"}`}>Không</span>
                                                    <ToggleSwitchButton
                                                        value={dongHo.ket_qua_check_vo_ngoai ?? false}
                                                        onChange={(value: boolean) => handleRadioToggle(index, "ket_qua_check_vo_ngoai", value)}
                                                        disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                    />
                                                    <span style={{ fontSize: "14px" }} className={`ms-2 ${!dongHo.ket_qua_check_vo_ngoai && "text-secondary"}`}>Đạt</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <span style={{ fontSize: "14px" }} className={`me-2 ${dongHo.ket_qua_check_do_kin && "text-secondary"}`}>Không</span>
                                                    <ToggleSwitchButton
                                                        value={dongHo.ket_qua_check_do_kin ?? false}
                                                        onChange={(value: boolean) => handleRadioToggle(index, "ket_qua_check_do_kin", value)}
                                                        disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                    />
                                                    <span style={{ fontSize: "14px" }} className={`ms-2 ${!dongHo.ket_qua_check_do_kin && "text-secondary"}`}>Đạt</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <span style={{ fontSize: "14px" }} className={`me-2 ${dongHo.ket_qua_check_do_on_dinh_chi_so && "text-secondary"}`}>Không</span>
                                                    <ToggleSwitchButton
                                                        value={dongHo.ket_qua_check_do_on_dinh_chi_so ?? false}
                                                        onChange={(value: boolean) => handleRadioToggle(index, "ket_qua_check_do_on_dinh_chi_so", value)}
                                                        disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                    />
                                                    <span style={{ fontSize: "14px" }} className={`ms-2 ${!dongHo.ket_qua_check_do_on_dinh_chi_so && "text-secondary"}`}>Đạt</span>
                                                </div>
                                            </td>
                                        </>
                                    }
                                    <td>
                                        <InputField
                                            index={index}
                                            onChange={(value) => handleInputChange(index, "so_giay_chung_nhan", value)}
                                            // disabled={status == null || (status != null && !status) || savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                            disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                            error={errorsList[index]?.so_giay_chung_nhan}
                                            name={`so_giay_chung_nhan`}
                                        />
                                    </td>
                                    <td>
                                        <InputField
                                            index={index}
                                            onChange={(value) => handleInputChange(index, "so_tem", value)}
                                            // disabled={status == null || (status != null && !status) || savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                            disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                            error={errorsList[index]?.so_tem}
                                            name={`so_tem`}
                                        />
                                    </td>
                                </tr>
                            );
                        }

                        return rows;
                    })()}
                </tbody>
            </table>
        </div>
    );
});

export default TableDongHoInfo;
