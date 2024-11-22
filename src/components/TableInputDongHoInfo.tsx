import { useDongHoList } from "@/context/ListDongHo";
import { DongHo } from "@lib/types";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import c_tbIDHInf from "@styles/scss/components/table-input-dongho-info.module.scss";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getDongHoExistsByInfo } from "@/app/api/dongho/route";
import { stat } from "fs";
import { getLastDayOfMonthInFuture } from "@lib/system-function";
import { TITLE_LUU_LUONG } from "@lib/system-constant";

interface TableDongHoInfoProps {
    // dongHoList: DongHo[],
    className?: string,
    setIsErrorInfoExists: (value: boolean | null) => void;
    setLoading: (value: boolean) => void;
    isDHDienTu?: boolean
}


const InfoFieldTitle = {
    so_giay_chung_nhan: "Số GCN",
    seri_sensor: "Serial sensor",
    seri_chi_thi: "Serial chỉ thị",
    so_tem: "Số tem",
    hieu_luc_bien_ban: "Hiệu lực biên bản"
};

type InfoField = {
    so_giay_chung_nhan?: string,
    seri_sensor?: string,
    seri_chi_thi?: string,
    so_tem?: string,
    hieu_luc_bien_ban?: Date | null,
};

const TableDongHoInfo: React.FC<TableDongHoInfoProps> = ({
    className,
    setIsErrorInfoExists,
    setLoading,
    isDHDienTu
}) => {
    const { dongHoList, setDongHoList, savedDongHoList } = useDongHoList();
    const prevDongHoList = useRef(dongHoList);
    const [errorsList, setErrorsList] = useState<InfoField[]>([]);
    const [tempValues, setTempValues] = useState<InfoField[]>([]);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null); // Thêm state để lưu timeout

    useEffect(() => {
        if (prevDongHoList.current != dongHoList) {
            const handler = setTimeout(() => {
                const newTmp = dongHoList.map((dongHo) => {
                    return ({
                        so_giay_chung_nhan: dongHo.so_giay_chung_nhan || "",
                        seri_sensor: dongHo.seri_sensor || "",
                        seri_chi_thi: dongHo.seri_chi_thi || "",
                        so_tem: dongHo.so_tem || "",
                        hieu_luc_bien_ban: dongHo.hieu_luc_bien_ban || null,
                    })
                });
                setTempValues(() => {
                    return newTmp
                })
            }, 300);
            prevDongHoList.current = dongHoList;
            return () => {
                clearTimeout(handler);
            }
        }
    }, [dongHoList])

    const handleInputChange = (
        index: number,
        field: "so_giay_chung_nhan" | "seri_sensor" | "seri_chi_thi" | "so_tem" | "hieu_luc_bien_ban",
        value: string | Date
    ) => {
        const updatedErrors = [...errorsList];

        const updatedTMP = [...tempValues];
        updatedTMP[index] = { ...(updatedTMP[index] || {}), [field]: value };
        setTempValues(updatedTMP);

        if (field == "hieu_luc_bien_ban") {
            const updatedDongHoList = [...dongHoList];
            updatedDongHoList[index].hieu_luc_bien_ban = dayjs(value, 'DD-MM-YYYY').isValid() ? dayjs(value, 'DD-MM-YYYY').toDate() : null;
            setDongHoList(updatedDongHoList);
        } else {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            const handler = setTimeout(async () => {
                if (value) {
                    const title = InfoFieldTitle[field as keyof InfoField];
                    if (!updatedErrors[index]) updatedErrors[index] = {};
                    setLoading(true)
                    try {
                        const exists = dongHoList.some((dongHo, i) => {
                            return dongHo[field] === value && i !== index;
                        });
                        if (exists) {
                            updatedErrors[index][field] = title + " đã tồn tại!";
                        } else {
                            const res = await getDongHoExistsByInfo(value.toString());
                            if (res?.status === 200 || res?.status === 201) {
                                updatedErrors[index][field] = title + " đã tồn tại!";
                            } else if (res?.status === 404) {
                                updatedErrors[index] = {};
                            } else {
                                updatedErrors[index][field] = "Có lỗi xảy ra khi kiểm tra " + title + "!";
                            }
                        }
                    } catch (error) {
                        updatedErrors[index][field] = "Đã có lỗi xảy ra! Hãy thử lại sau.";
                    } finally {
                        setLoading(false);
                    }

                } else {
                    updatedErrors[index] = {};
                }

                const updatedDongHoList = [...dongHoList];

                if (updatedTMP[index].so_giay_chung_nhan && updatedTMP[index].so_tem) {
                    if (!updatedTMP[index].hieu_luc_bien_ban) {
                        const isDHDienTu = Boolean((dongHoList[index].ccx && ["1", "2"].includes(dongHoList[index].ccx)) || dongHoList[index].kieu_thiet_bi == "Điện tử");

                        updatedDongHoList[index].hieu_luc_bien_ban = getLastDayOfMonthInFuture(isDHDienTu) || null;
                    }
                } else {
                    updatedDongHoList[index].hieu_luc_bien_ban = null;
                }

                updatedDongHoList[index][field] = value.toString();
                setDongHoList(updatedDongHoList);

                const hasError = updatedErrors.some(error => Object.keys(error || {}).length > 0);
                setIsErrorInfoExists(hasError ? true : null);
            }, 300);

            setDebounceTimeout(handler);

            const hasError = updatedErrors.some(error => Object.keys(error || {}).length > 0);
            setIsErrorInfoExists(hasError ? true : null);

            setErrorsList(updatedErrors);
        }

    };

    useEffect(() => {
        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
        };
    }, [debounceTimeout]);

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

    return (
        <div className={`w-100 m-0 mb-3 p-0 ${c_tbIDHInf['wrap-process-table']} ${className ? className : ""}`}>
            <table className={`table table-bordered table-hover ${c_tbIDHInf['process-table']}`}>
                <thead className="shadow border">
                    <tr className={`${c_tbIDHInf['table-header']}`}>
                        <th>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                <span>
                                    Đồng hồ
                                </span>
                            </div>
                        </th>
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
                        <th>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                <span>
                                    Serial Sensor
                                </span>
                            </div>
                        </th>
                        <th>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                <span>
                                    Serial chỉ thị
                                </span>
                            </div>
                        </th>
                        <th>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                <span>
                                    Hiệu lực đến
                                </span>
                            </div>
                        </th>
                        <th>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                <span>
                                    Trạng thái
                                </span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {dongHoList.map((dongHo, index) => {

                        const duLieuKiemDinhJSON = dongHo.du_lieu_kiem_dinh;
                        const duLieuKiemDinh = duLieuKiemDinhJSON ? JSON.parse(duLieuKiemDinhJSON) : null;
                        const status = duLieuKiemDinh ? duLieuKiemDinh.ket_qua : null;
                        const objHss = duLieuKiemDinh ? duLieuKiemDinh.hieu_sai_so : null;
                        // console.log(index, objHss);

                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <input
                                        autoComplete="off"
                                        type="text"
                                        value={tempValues[index]?.so_giay_chung_nhan
                                            // || dongHo?.so_giay_chung_nhan 
                                            || ""}
                                        disabled={status == null || (status != null && !status) || savedDongHoList.includes(dongHo)}
                                        onChange={(e) => handleInputChange(index, "so_giay_chung_nhan", e.target.value)}
                                        className="form-control"
                                        style={{ width: "100%", minWidth: "170px" }}
                                        onKeyDown={(e) => handleEnterKey(e, index, "so_giay_chung_nhan")}
                                        name={`so_giay_chung_nhan-${index}`}
                                    />
                                    {errorsList[index]?.so_giay_chung_nhan && (
                                        <small className="w-100 text-center text-danger">
                                            {errorsList[index].so_giay_chung_nhan}
                                        </small>
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        value={tempValues[index]?.so_tem
                                            // || dongHo?.so_tem 
                                            || ""}
                                        disabled={status == null || (status != null && !status) || savedDongHoList.includes(dongHo)}
                                        onChange={(e) => handleInputChange(index, "so_tem", e.target.value)}
                                        className="form-control"
                                        style={{ width: "100%", minWidth: "170px" }}
                                        onKeyDown={(e) => handleEnterKey(e, index, "so_tem")}
                                        name={`so_tem-${index}`}
                                    />
                                    {errorsList[index]?.so_tem && (
                                        <small className="w-100 text-center text-danger">
                                            {errorsList[index].so_tem}
                                        </small>
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        value={tempValues[index]?.seri_sensor
                                            // || dongHo?.seri_sensor 
                                            || ""}
                                        disabled={savedDongHoList.includes(dongHo)}
                                        onChange={(e) => handleInputChange(index, "seri_sensor", e.target.value)}
                                        className="form-control"
                                        style={{ width: "100%", minWidth: "170px" }}
                                        onKeyDown={(e) => handleEnterKey(e, index, "seri_sensor")}
                                        name={`seri_sensor-${index}`}
                                    />
                                    {errorsList[index]?.seri_sensor && (
                                        <small className="w-100 text-center text-danger">
                                            {errorsList[index].seri_sensor}
                                        </small>
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        value={tempValues[index]?.seri_chi_thi
                                            // || dongHo?.seri_chi_thi 
                                            || ""}
                                        disabled={savedDongHoList.includes(dongHo)}
                                        onChange={(e) => handleInputChange(index, "seri_chi_thi", e.target.value)}
                                        className="form-control"
                                        style={{ width: "100%", minWidth: "170px" }}
                                        onKeyDown={(e) => handleEnterKey(e, index, "seri_chi_thi")}
                                        name={`seri_chi_thi-${index}`}
                                    />
                                    {errorsList[index]?.seri_chi_thi && (
                                        <small className="w-100 text-center text-danger">
                                            {errorsList[index].seri_chi_thi}
                                        </small>
                                    )}
                                </td>
                                <td>
                                    <DatePicker
                                        className={`${c_tbIDHInf['date-picker']}`}
                                        value={dayjs(tempValues[index]?.hieu_luc_bien_ban) || null}
                                        format="DD-MM-YYYY"
                                        disabled={
                                            status == null
                                            || (status != null && !status)
                                            || !(tempValues[index].so_giay_chung_nhan && tempValues[index].so_tem)
                                            || savedDongHoList.includes(dongHo)
                                        }
                                        minDate={dayjs().endOf('day')}
                                        onChange={(newValue: Dayjs | null) => handleInputChange(index, "hieu_luc_bien_ban", newValue ? newValue.format('DD-MM-YYYY') : '')}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                style: {
                                                    minWidth: '175px',
                                                    backgroundColor: (
                                                        status == null
                                                        || (status != null && !status)
                                                        || !(tempValues[index].so_giay_chung_nhan && tempValues[index].so_tem)
                                                        || savedDongHoList.includes(dongHo)
                                                    )
                                                        ? "#e9ecef"
                                                        : "white"
                                                }
                                            }
                                        }}
                                        name={"hieu_luc_bien_ban-" + index}
                                    />
                                </td>
                                <td>
                                    <p className="m-0 p-0" style={{ width: "140px" }}>
                                        {status != null ?
                                            (status ? "Đạt" : "Không đạt") :
                                            objHss ?
                                                (
                                                    objHss[0].hss == null &&
                                                        objHss[1].hss == null &&
                                                        objHss[2].hss == null ?
                                                        "Chưa kiểm định" :
                                                        "Còn: " +
                                                        (objHss[0].hss == null ? (isDHDienTu ? TITLE_LUU_LUONG.q3 : TITLE_LUU_LUONG.qn) + " " : "") +
                                                        (objHss[1].hss == null ? (isDHDienTu ? TITLE_LUU_LUONG.q2 : TITLE_LUU_LUONG.qt) + " " : "") +
                                                        (objHss[2].hss == null ? (isDHDienTu ? TITLE_LUU_LUONG.q1 : TITLE_LUU_LUONG.qmin) : "")
                                                ) :
                                                "Chưa kiểm định"
                                        }
                                    </p>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TableDongHoInfo;
