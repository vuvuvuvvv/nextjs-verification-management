import { useDongHoList } from "@/context/ListDongHo";
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
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleInputChange = React.useCallback((
        index: number,
        field: "so_giay_chung_nhan" | "serial" | "so_tem" | "hieu_luc_bien_ban" | "k_factor",
        value: string | Date
    ) => {
        const updatedErrors = [...errorsList];
        const updatedDongHoList = [...dongHoList];

        if (field == "hieu_luc_bien_ban") {
            updatedDongHoList[index].hieu_luc_bien_ban = dayjs(value, 'DD-MM-YYYY').isValid() ? dayjs(value, 'DD-MM-YYYY').toDate() : null;
            setDongHoList(updatedDongHoList);
        } else if (!["k_factor", "seri_chi_thi"].includes(field)) {
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
                    }

                } else {
                    updatedErrors[index][field] = "";
                }

                if (updatedDongHoList[index].so_giay_chung_nhan && updatedDongHoList[index].so_tem) {
                    const isDHDienTu = Boolean((dongHoList[index].ccx && ["1", "2"].includes(dongHoList[index].ccx ?? "")));
                    updatedDongHoList[index].hieu_luc_bien_ban = getLastDayOfMonthInFuture(isDHDienTu, updatedDongHoList[index].ngay_thuc_hien) || null;
                } else {
                    updatedDongHoList[index].hieu_luc_bien_ban = null;
                }

                updatedDongHoList[index][field] = value.toString();
                setErrorsList(updatedErrors);
            }, 500);

            setDebounceTimeout(handler);
            setErrorsList(updatedErrors);
        } else {
            updatedDongHoList[index][field] = value.toString();
        }

        setDongHoList(updatedDongHoList);
    },
        [dongHoList, errorsList, setLoading]
    );

    const handleOtherFieldChange = React.useCallback((
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

    useEffect(() => {
        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
        };
    }, [debounceTimeout]);

    // const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>,
    //     index: number,
    //     field: "so_giay_chung_nhan" | "serial" | "seri_chi_thi" | "so_tem",
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
    //             if (nextIndex < dongHoList.length)
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
                                    Trạng thái
                                </span>
                            </div>
                        </th>

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
                        {/* {dongHoList.length > 0 && ["Điện tử", "Cơ - Điện từ"].includes(dongHoList[0].kieu_thiet_bi ?? "xx") &&
                            <th>
                                <div className={`${c_tbIDHInf['table-label']}`}>
                                    <span>
                                        Hệ số K
                                    </span>
                                </div>
                            </th>
                        } */}
                        {isHieuChuan && <th>Mã quản lý</th>}
                        {/* <th>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                <span>
                                    Hiệu lực đến
                                </span>
                            </div>
                        </th> */}
                        <th colSpan={isHieuChuan ? 6 : 3}>
                            <div className={`${c_tbIDHInf['table-label']}`}>
                                <span>
                                    Sai số{isHieuChuan ? " & Mf" : ""}
                                </span>
                            </div>
                        </th>
                        <th>
                        </th>
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
                            // console.log(decode(dongHo.id), duLieuKiemDinh);
                            const status = duLieuKiemDinh ? duLieuKiemDinh.ket_qua : null;
                            const objHss = duLieuKiemDinh ? duLieuKiemDinh.hieu_sai_so : null;
                            const objMf = duLieuKiemDinh ? duLieuKiemDinh.mf : null;

                            // const isDHDienTu = Boolean((dongHo.ccx && ["1", "2"].includes(dongHo.ccx)) || dongHo.kieu_thiet_bi == "Điện tử");

                            rows.push(
                                <tr key={index}>

                                    <td style={{ cursor: "pointer" }} onClick={() => {
                                        selectDongHo(index)
                                    }}>
                                        <span>{dongHo.index}</span>
                                        <span><FontAwesomeIcon icon={faEdit} className="text-blue"></FontAwesomeIcon></span>
                                    </td>
                                    <td>
                                        <p className="m-0 p-0 text-center w-100" style={{ minWidth: "140px" }}>
                                            {status != null ?
                                                (status ? "Đạt" : "Không đạt") :
                                                objHss ?
                                                    (
                                                        objHss[0].hss == null &&
                                                            objHss[1].hss == null &&
                                                            objHss[2].hss == null ?
                                                            ("Chưa " + (isHieuChuan ? "hiệu chuẩn" : "kiểm định")) :
                                                            "Còn: " +
                                                            (objHss[0].hss == null ? (isDHDienTu ? TITLE_LUU_LUONG.q3 : TITLE_LUU_LUONG.qn) + " " : "") +
                                                            (objHss[1].hss == null ? (isDHDienTu ? TITLE_LUU_LUONG.q2 : TITLE_LUU_LUONG.qt) + " " : "") +
                                                            (objHss[2].hss == null ? (isDHDienTu ? TITLE_LUU_LUONG.q1 : TITLE_LUU_LUONG.qmin) : "")
                                                    ) :
                                                    ("Chưa " + (isHieuChuan ? "hiệu chuẩn" : "kiểm định"))
                                            }
                                        </p>
                                    </td>

                                    {!isHieuChuan &&
                                        <>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <span style={{ fontSize: "14px" }} className={`me-2 ${dongHo.ket_qua_check_vo_ngoai && "text-secondary"}`}>Không</span>
                                                    <ToggleSwitchButton
                                                        value={dongHo.ket_qua_check_vo_ngoai ?? false}
                                                        onChange={(value: boolean) => handleOtherFieldChange(index, "ket_qua_check_vo_ngoai", value)}
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
                                                        onChange={(value: boolean) => handleOtherFieldChange(index, "ket_qua_check_do_kin", value)}
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
                                                        onChange={(value: boolean) => handleOtherFieldChange(index, "ket_qua_check_do_on_dinh_chi_so", value)}
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
                                            onChange={(value) => handleInputChange(index, "serial", value)}
                                            disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                            error={errorsList[index]?.serial}
                                            name={`serial`}
                                        />
                                    </td>
                                    {/* {dongHoList.length > 0 && ["Điện tử", "Cơ - Điện từ"].includes(dongHoList[0].kieu_thiet_bi ?? "xx") &&
                                        <td>
                                            <InputField
                                                index={index}
                                                onChange={(value) => handleInputChange(index, "k_factor", value)}
                                                disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                name={`k_factor`}
                                            />
                                        </td>
                                    } */}

                                    {/* {isHieuChuan && <td>
                                        <InputField
                                            index={index}
                                            onChange={(value) => handleOtherFieldChange(index, "ma_quan_ly", value)}
                                            disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                            name={`ma_quan_ly`}
                                        />
                                    </td>} */}

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
                                    <td>
                                        {objHss && objHss[0] && objHss[0].hss != null ? objHss[0].hss + "%" : <span className="text-secondary">-</span>}
                                    </td>
                                    {isHieuChuan && <td>
                                        {objMf && objMf[0].mf != null ? objMf[0].mf : <span className="text-secondary">-</span>}
                                    </td>}

                                    <td>
                                        {objHss && objHss[1] && objHss[1].hss != null ? objHss[1].hss + "%" : <span className="text-secondary">-</span>}
                                    </td>
                                    {isHieuChuan && <td>
                                        {objMf && objMf[1].mf != null ? objMf[1].mf : <span className="text-secondary">-</span>}
                                    </td>}

                                    <td>
                                        {objHss && objHss[2] && objHss[2].hss != null ? objHss[2].hss + "%" : <span className="text-secondary">-</span>}
                                    </td>
                                    {isHieuChuan && <td>
                                        {objMf && objMf[2].mf != null ? objMf[2].mf : <span className="text-secondary">-</span>}
                                    </td>}

                                    <td>
                                        <button onClick={() => {
                                            selectDongHo(index)
                                        }} className={`btn`}>
                                            <FontAwesomeIcon icon={faEdit} className="text-blue"></FontAwesomeIcon>
                                        </button>
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
