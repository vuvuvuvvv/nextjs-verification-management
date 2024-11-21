import { useDongHoList } from "@/context/ListDongHo";
import { DongHo } from "@lib/types";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import c_tbIDHInf from "@styles/scss/components/table-input-dongho-info.module.scss";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getDongHoExistsByInfo } from "@/app/api/dongho/route";

interface TableDongHoInfoProps {
    // dongHoList: DongHo[],
    className?: string,
    setIsErrorInfoExists?: React.Dispatch<React.SetStateAction<boolean | null>>
}


const InfoFieldTitle = {
    so_giay_chung_nhan: "Số GCN",
    seri_sensor: "Serial sensor",
    seri_chi_thi: "Serial chỉ thị",
    so_tem: "Số tem"
};

type InfoField = {
    so_giay_chung_nhan?: string;
    seri_sensor?: string;
    seri_chi_thi?: string;
    so_tem?: string,
};

const TableDongHoInfo: React.FC<TableDongHoInfoProps> = ({
    // dongHoList, 
    className,
    setIsErrorInfoExists
}) => {
    const { dongHoList, setDongHoList } = useDongHoList();
    const [errorsList, setErrorsList] = useState<InfoField[]>([]);
    const [tempValues, setTempValues] = useState<InfoField[]>([]);

    const handleInputChange = (
        index: number,
        field: "so_giay_chung_nhan" | "seri_sensor" | "seri_chi_thi" | "so_tem",
        value: string
    ) => {
        const updatedErrors = [...errorsList];

        const updatedTMP = [...tempValues];
        updatedTMP[index] = { ...(updatedTMP[index] || {}), [field]: value };
        setTempValues(updatedTMP);

        if (value) {
            const handler = setTimeout(async () => {
                const title = InfoFieldTitle[field as keyof InfoField];
                if (!updatedErrors[index]) updatedErrors[index] = {};

                const res = await getDongHoExistsByInfo(value);
                if (res?.status === 200 || res?.status === 201) {
                    updatedErrors[index][field] = title + " đã tồn tại!";
                } else if (res?.status === 404) {
                    updatedErrors[index] = {};
                } else {
                    updatedErrors[index][field] = "Có lỗi xảy ra khi kiểm tra " + title + "!";
                }
                setErrorsList(updatedErrors);

                const updatedDongHoList = [...dongHoList];
                updatedDongHoList[index][field as keyof InfoField] = value;
                setDongHoList(updatedDongHoList);
            }, 2000);

            return () => {
                clearTimeout(handler);
            };
        }
    };

    return (
        <div className={`w-100 m-0 mb-3 p-0 ${c_tbIDHInf['wrap-process-table']} ${className ? className : ""}`}>
            <table className={`table table-striped table-bordered table-hover ${c_tbIDHInf['process-table']}`}>
                <thead className="shadow">
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
                                    Kết quả
                                </span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {dongHoList.map((dongho, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <input
                                    type="text"
                                    value={tempValues[index]?.so_giay_chung_nhan || ""}
                                    onChange={(e) => handleInputChange(index, "so_giay_chung_nhan", e.target.value)}
                                    className="form-control"
                                    style={{ width: "100%", minWidth: "170px" }}
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
                                    value={tempValues[index]?.so_tem || ""}
                                    onChange={(e) => handleInputChange(index, "so_tem", e.target.value)}
                                    className="form-control"
                                    style={{ width: "100%", minWidth: "170px" }}
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
                                    value={tempValues[index]?.seri_sensor || ""}
                                    onChange={(e) => handleInputChange(index, "seri_sensor", e.target.value)}
                                    className="form-control"
                                    style={{ width: "100%", minWidth: "170px" }}
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
                                    value={tempValues[index]?.seri_chi_thi || ""}
                                    onChange={(e) => handleInputChange(index, "seri_chi_thi", e.target.value)}
                                    className="form-control"
                                    style={{ width: "100%", minWidth: "170px" }}
                                />
                                {errorsList[index]?.seri_chi_thi && (
                                    <small className="w-100 text-center text-danger">
                                        {errorsList[index].seri_chi_thi}
                                    </small>
                                )}
                            </td>
                            <td>
                                <DatePicker
                                    className={`bg-white ${c_tbIDHInf['date-picker']}`}
                                    // value={ tempValues[index]?.xx || dayjs(hieuLucBienBan) || null}
                                    format="DD-MM-YYYY"
                                    // maxDate={dayjs().endOf('day')}
                                    // disabled={isDHSaved != null && isDHSaved}
                                    minDate={dayjs().endOf('day')}
                                    // onChange={(newValue: Dayjs | null) => setHieuLucBienBan(newValue ? newValue.toDate() : null)}
                                    slotProps={{ textField: { fullWidth: true, style: { minWidth: '175px' } } }}
                                />
                            </td>
                            <td>
                                <p className="m-0 p-0" style={{ width: "140px" }}>Chưa kiểm định</p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableDongHoInfo;
