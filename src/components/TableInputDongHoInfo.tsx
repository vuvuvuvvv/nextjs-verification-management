import { useDongHoList } from "@/context/ListDongHo";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import c_tbIDHInf from "@styles/scss/components/table-input-dongho-info.module.scss";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getDongHoExistsByInfo } from "@/app/api/dongho/route";
import { getLastDayOfMonthInFuture } from "@lib/system-function";
import { TITLE_LUU_LUONG } from "@lib/system-constant";
import DatePickerField from "./ui/DatePickerTBDHInfo";
import InputField from "./ui/InputFieldTBDHInfo";

interface TableDongHoInfoProps {
    className?: string,
    setLoading: (value: boolean) => void;
    isDHDienTu: boolean;
    isEditing: boolean;
}

const InfoFieldTitle = {
    so_giay_chung_nhan: "Số GCN",
    seri_sensor: "Serial sensor",
    seri_chi_thi: "Serial chỉ thị",
    so_tem: "Số tem",
    hieu_luc_bien_ban: "Hiệu lực biên bản",
    k_factor: "Hệ số K"
};

type InfoField = {
    so_giay_chung_nhan?: string,
    seri_sensor?: string,
    seri_chi_thi?: string,
    so_tem?: string,
    k_factor?: string,
    hieu_luc_bien_ban?: Date | null,
};

const TableDongHoInfo: React.FC<TableDongHoInfoProps> = React.memo(({
    className,
    setLoading,
    isDHDienTu,
    isEditing
}) => {
    const { dongHoList, setDongHoList, savedDongHoList } = useDongHoList();
    const [errorsList, setErrorsList] = useState<InfoField[]>([]);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    // useEffect(() => {
    //     console.log(errorsList);
    //     const hasError = errorsList.some(error => {
    //         console.log(error);
    //         Object.values(error).some(field => { console.log("f: ", field); return field !== "" })
    //     }
    //     );
    //     console.log(hasError);
    //     setIsErrorInfoExists(hasError);
    //     prevErrorList.current = errorsList;
    // }, [errorsList]);

    const handleInputChange = React.useCallback((
        index: number,
        field: "so_giay_chung_nhan" | "seri_sensor" | "seri_chi_thi" | "so_tem" | "hieu_luc_bien_ban" | "k_factor",
        value: string | Date
    ) => {
        const updatedErrors = [...errorsList];
        if (field == "hieu_luc_bien_ban") {
            const updatedDongHoList = [...dongHoList];
            updatedDongHoList[index].hieu_luc_bien_ban = dayjs(value, 'DD-MM-YYYY').isValid() ? dayjs(value, 'DD-MM-YYYY').toDate() : null;
            setDongHoList(updatedDongHoList);
        } else if (field != "k_factor") {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            const handler = setTimeout(async () => {
                if (value) {
                    const title = InfoFieldTitle[field as keyof InfoField];
                    if (!updatedErrors[index]) {
                        updatedErrors[index] = {}
                    };
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
                                updatedErrors[index][field] = "";
                            } else {
                                updatedErrors[index][field] = "Có lỗi xảy ra khi kiểm tra " + title + "!";
                            }
                        }
                    } catch (error) {
                        updatedErrors[index][field] = "Đã có lỗi xảy ra! Hãy thử lại sau.";
                    } finally {
                        setLoading(false);
                        const hasError = updatedErrors.some(error => { Object.values(error).some(field => field !== "") });
                    }

                } else {
                    updatedErrors[index][field] = "";
                }

                const updatedDongHoList = [...dongHoList];

                if (updatedDongHoList[index].so_giay_chung_nhan && updatedDongHoList[index].so_tem) {
                    const isDHDienTu = Boolean((dongHoList[index].ccx && ["1", "2"].includes(dongHoList[index].ccx)) || dongHoList[index].kieu_thiet_bi == "Điện tử");
                    updatedDongHoList[index].hieu_luc_bien_ban = getLastDayOfMonthInFuture(isDHDienTu, updatedDongHoList[index].ngay_thuc_hien) || null;
                } else {
                    updatedDongHoList[index].hieu_luc_bien_ban = null;
                }

                updatedDongHoList[index][field] = value.toString();
                setDongHoList(updatedDongHoList);

                const hasError = errorsList.some(error => { Object.values(error).some(field => field !== "") });
                setErrorsList(updatedErrors);
            }, 500);

            setDebounceTimeout(handler);

            const hasError = errorsList.some(error => { Object.values(error).some(field => field !== "") });
            setErrorsList(updatedErrors);
        }
    },
        [dongHoList, errorsList, setLoading]
    );

    useEffect(() => {
        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
        };
    }, [debounceTimeout]);

    // const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>,
    //     index: number,
    //     field: "so_giay_chung_nhan" | "seri_sensor" | "seri_chi_thi" | "so_tem",
    // ) => {
    //     if (e.key === 'Enter') {

    //         if (e.shiftKey) {
    //             const prevIndex = index - 1;
    //             if (prevIndex >= 0) {
    //                 const prevInput = document.querySelector(`input[name="${field}-${prevIndex}"]`) as HTMLInputElement;
    //                 if (prevInput) {
    //                     prevInput.focus();
    //                 }
    //             }
    //         } else {
    //             const nextIndex = index + 1;
    //             if (nextIndex < dongHoList.length) {
    //                 const nextInput = document.querySelector(`input[name="${field}-${nextIndex}"]`) as HTMLInputElement;
    //                 if (nextInput) {
    //                     nextInput.focus();
    //                 }
    //             }
    //         }
    //     }
    // };

    return (
        <div className={`w-100 m-0 mb-3 p-0 ${c_tbIDHInf['wrap-process-table']} ${className ? className : ""}`}>
            <table className={`table table-bordered table-hover ${c_tbIDHInf['process-table']}`}>
                <thead className="shadow border">
                    <tr className={`${c_tbIDHInf['table-header']}`}>
                        {dongHoList.length > 1 && <th>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                <span>
                                    Đồng hồ
                                </span>
                            </div>
                        </th>}
                        <th>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                <span>
                                    Trạng thái
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
                        {isDHDienTu &&
                            <th>
                                <div className={`${c_tbIDHInf['table-label']}`}>
                                    <span>
                                        Serial chỉ thị
                                    </span>
                                </div>
                            </th>
                        }
                        {["Điện tử", "Cơ - Điện từ"].includes(dongHoList[0].kieu_thiet_bi || "xx") &&
                            <th>
                                <div className={`${c_tbIDHInf['table-label']}`}>
                                    <span>
                                        Hệ số K
                                    </span>
                                </div>
                            </th>
                        }
                        {/* <th>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                <span>
                                    Hiệu lực đến
                                </span>
                            </div>
                        </th> */}
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                        const rows = [];
                        for (let index = 0; index < dongHoList.length; index++) {
                            const dongHo = dongHoList[index];

                            const duLieuKiemDinhJSON = dongHo.du_lieu_kiem_dinh;
                            const duLieuKiemDinh = duLieuKiemDinhJSON ?
                                ((isEditing && typeof duLieuKiemDinhJSON != 'string') ?
                                    duLieuKiemDinhJSON : JSON.parse(duLieuKiemDinhJSON)
                                ) : null;
                            const status = duLieuKiemDinh ? duLieuKiemDinh.ket_qua : null;
                            const objHss = duLieuKiemDinh ? duLieuKiemDinh.hieu_sai_so : null;
                            const isDHDienTu = Boolean((dongHo.ccx && ["1", "2"].includes(dongHo.ccx)) || dongHo.kieu_thiet_bi == "Điện tử");

                            rows.push(
                                <tr key={index}>
                                    {dongHoList.length > 1 &&
                                        <td>{index + 1}</td>}
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
                                    <td>
                                        <InputField
                                            index={index}
                                            onChange={(value) => handleInputChange(index, "so_giay_chung_nhan", value)}
                                            disabled={status == null || (status != null && !status) || savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                            error={errorsList[index]?.so_giay_chung_nhan}
                                            name={`so_giay_chung_nhan`}
                                        />
                                    </td>
                                    <td>
                                        <InputField
                                            index={index}
                                            onChange={(value) => handleInputChange(index, "so_tem", value)}
                                            disabled={status == null || (status != null && !status) || savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                            error={errorsList[index]?.so_tem}
                                            name={`so_tem`}
                                        />
                                    </td>
                                    <td>
                                        <InputField
                                            index={index}
                                            onChange={(value) => handleInputChange(index, "seri_sensor", value)}
                                            disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                            error={errorsList[index]?.seri_sensor}
                                            name={`seri_sensor`}
                                        />
                                    </td>
                                    {isDHDienTu &&
                                        <td>
                                            <InputField
                                                index={index}
                                                onChange={(value) => handleInputChange(index, "seri_chi_thi", value)}
                                                disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                error={errorsList[index]?.seri_chi_thi}
                                                name={`seri_chi_thi`}
                                            />
                                        </td>
                                    }
                                    {["Điện tử", "Cơ - Điện từ"].includes(dongHoList[0].kieu_thiet_bi || "xx") &&
                                        <td>
                                            <InputField
                                                index={index}
                                                onChange={(value) => handleInputChange(index, "k_factor", value)}
                                                disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                name={`k_factor`}
                                            />
                                        </td>
                                    }
                                    {/* <td> */}
                                    {/* {dayjs(dongHo.hieu_luc_bien_ban).format('DD-MM-YYYY').toString()} */}
                                    {/* {dongHo.hieu_luc_bien_ban?.toString() || ""} */}

                                    {/* <DatePickerField
                                            value={dayjs(dongHo.hieu_luc_bien_ban)}
                                            className={`${c_tbIDHInf['date-picker']}`}
                                            // disabled={status == null || (status != null && !status) || savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                            // onChange={(newValue: Dayjs | null) => handleInputChange(index, "hieu_luc_bien_ban", newValue ? newValue.format('DD-MM-YYYY') : '')}
                                            minDate={dayjs().endOf('day')}
                                            name={"hieu_luc_bien_ban"}
                                        /> */}
                                    {/* </td> */}
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
