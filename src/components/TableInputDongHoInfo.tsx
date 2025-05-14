import { useDongHoList } from "@/context/ListDongHoContext";
import { Dayjs } from "dayjs";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import React, { useState, useReducer, useEffect, useRef } from "react";
import c_tbIDHInf from "@styles/scss/components/table-input-dongho-info.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faCogs} from "@fortawesome/free-solid-svg-icons";

const ToggleSwitchButton = dynamic(() => import('@/components/ui/ToggleSwitchButton'));
const InputField = dynamic(() => import('@/components/ui//InputFieldTBDHInfo'));

interface TableDongHoInfoProps {
    className?: string,
    setLoading: (value: boolean) => void;
    isDHDienTu: boolean;
    isEditing: boolean;
    selectDongHo: (value: number) => void;
}

type StateCheck = {
    ket_qua_check_vo_ngoai: boolean;
    ket_qua_check_do_kin: boolean;
    ket_qua_check_do_on_dinh_chi_so: boolean;
};

type Action =
    | { type: 'SET_KET_QUA_CHECK_VO_NGOAI'; payload: boolean }
    | { type: 'SET_KET_QUA_CHECK_DO_KIN'; payload: boolean }
    | { type: 'SET_KET_QUA_CHECK_DO_ON_DINH_CHI_SO'; payload: boolean };

const initialStateCheck: StateCheck = {
    ket_qua_check_vo_ngoai: false,
    ket_qua_check_do_kin: false,
    ket_qua_check_do_on_dinh_chi_so: false,
};


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
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const debounceDongHoRef = React.useRef<NodeJS.Timeout | null>(null);


    const kiemDinhReducer = (state: StateCheck, action: Action): StateCheck => {
        switch (action.type) {
            case 'SET_KET_QUA_CHECK_VO_NGOAI':
                return { ...state, ket_qua_check_vo_ngoai: action.payload };
            case 'SET_KET_QUA_CHECK_DO_KIN':
                return { ...state, ket_qua_check_do_kin: action.payload };
            case 'SET_KET_QUA_CHECK_DO_ON_DINH_CHI_SO':
                return { ...state, ket_qua_check_do_on_dinh_chi_so: action.payload };
            default:
                return state;
        }
    };

    const [stateCheck, dispatch] = useReducer(kiemDinhReducer, initialStateCheck);
    const isManualChangeRef = useRef(false);
    const prevStateRef = useRef<StateCheck>(stateCheck);
    const dongHoListRef = useRef(dongHoList);

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


    useEffect(() => {
        if (!isManualChangeRef.current && prevStateRef.current != stateCheck) {
            const prevState = prevStateRef.current;

            const changedKey = Object.keys(stateCheck).find((key) => {
                return stateCheck[key as keyof StateCheck] !== prevState[key as keyof StateCheck];
            });

            if (changedKey) {
                isManualChangeRef.current = false;
                const newValue = stateCheck[changedKey as keyof StateCheck];
                const newDHList = [
                    ...dongHoList.map((dh) => ({
                        ...dh,
                        [changedKey]: newValue
                    }))
                ];

                setDongHoList(newDHList);
            }
        } else if (JSON.stringify(dongHoListRef.current) !== JSON.stringify(dongHoList)) {

            const updates: Partial<StateCheck> = {};

            if (
                stateCheck.ket_qua_check_vo_ngoai &&
                dongHoList.some(dh => dh.ket_qua_check_vo_ngoai === false)
            ) {
                updates.ket_qua_check_vo_ngoai = false;
            }

            if (
                stateCheck.ket_qua_check_do_kin &&
                dongHoList.some(dh => dh.ket_qua_check_do_kin === false)
            ) {
                updates.ket_qua_check_do_kin = false;
            }

            if (
                stateCheck.ket_qua_check_do_on_dinh_chi_so &&
                dongHoList.some(dh => dh.ket_qua_check_do_on_dinh_chi_so === false)
            ) {
                updates.ket_qua_check_do_on_dinh_chi_so = false;
            }

            isManualChangeRef.current = false;
            // Chỉ dispatch khi có update
            if (Object.keys(updates).length > 0) {
                for (const [key, value] of Object.entries(updates)) {
                    if (stateCheck[key as keyof StateCheck]) {
                        isManualChangeRef.current = true;
                        dispatch({
                            type: `SET_${key.toUpperCase()}` as Action["type"],
                            payload: value as boolean,
                        });
                    }
                }
            }
        }
        // Cập nhật lại previous state sau mỗi render
        prevStateRef.current = stateCheck;
    }, [stateCheck, dongHoList]);

    return (
        <div className={`w-100 m-0 mb-3 p-0 ${className ? className : ""}`}>
            <div className="dropdown mb-3 d-flex justify-content-end">
                <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                    data-bs-toggle="dropdown"
                >
                    <FontAwesomeIcon icon={faCogs} className="me-2" />
                    Cài đặt tất cả
                </button>

                <div className={`dropdown-menu p-3 ${dropdownOpen ? "show" : ""}`} style={{ minWidth: "300px" }}>
                    <h6 className="dropdown-header">Cài đặt tất cả:</h6>
                    <div className="d-flex flex-column">
                        {/* 1. Vỏ ngoài */}
                        <div className="d-flex align-items-center px-2 py-1">
                            <p className="p-0 m-0 me-3">Vỏ ngoài:</p>
                            <span style={{ fontSize: "14px" }} className={`me-2 ${stateCheck.ket_qua_check_vo_ngoai && "text-secondary"}`}>Không</span>
                            <ToggleSwitchButton
                                value={stateCheck.ket_qua_check_vo_ngoai ?? false}
                                onChange={(value: boolean) => {
                                    dispatch({ type: 'SET_KET_QUA_CHECK_VO_NGOAI', payload: value });
                                }}
                            />
                            <span style={{ fontSize: "14px" }} className={`ms-2 ${!stateCheck.ket_qua_check_vo_ngoai && "text-secondary"}`}>Đạt</span>
                        </div>

                        {/* 2. Độ kín */}
                        <div className="d-flex align-items-center px-2 py-1">
                            <p className="p-0 m-0 me-3">Độ kín:</p>
                            <span style={{ fontSize: "14px" }} className={`me-2 ${stateCheck.ket_qua_check_do_kin && "text-secondary"}`}>Không</span>
                            <ToggleSwitchButton
                                value={stateCheck.ket_qua_check_do_kin ?? false}
                                onChange={(value: boolean) => {
                                    dispatch({ type: 'SET_KET_QUA_CHECK_DO_KIN', payload: value });
                                }}
                            />
                            <span style={{ fontSize: "14px" }} className={`ms-2 ${!stateCheck.ket_qua_check_do_kin && "text-secondary"}`}>Đạt</span>
                        </div>

                        {/* 3. Độ ổn định chỉ số */}
                        <div className="d-flex align-items-center px-2 py-1">
                            <p className="p-0 m-0 me-3">Độ ổn định chỉ số:</p>
                            <span style={{ fontSize: "14px" }} className={`me-2 ${stateCheck.ket_qua_check_do_on_dinh_chi_so && "text-secondary"}`}>Không</span>
                            <ToggleSwitchButton
                                value={stateCheck.ket_qua_check_do_on_dinh_chi_so ?? false}
                                onChange={(value: boolean) => {
                                    dispatch({ type: 'SET_KET_QUA_CHECK_DO_ON_DINH_CHI_SO', payload: value });
                                }}
                            />
                            <span style={{ fontSize: "14px" }} className={`ms-2 ${!stateCheck.ket_qua_check_do_on_dinh_chi_so && "text-secondary"}`}>Đạt</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`w-100 m-0 p-0 mb-3 ${c_tbIDHInf['wrap-process-table']}`}>
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
                                                onChange={(value) => handleInputChange(index, "serial", value.toString())}
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
                                                onChange={(value) => handleInputChange(index, "so_giay_chung_nhan", value.toString())}
                                                // disabled={status == null || (status != null && !status) || savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                disabled={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)) || savedDongHoList.length == dongHoList.length}
                                                error={errorsList[index]?.so_giay_chung_nhan}
                                                name={`so_giay_chung_nhan`}
                                            />
                                        </td>
                                        <td>
                                            <InputField
                                                index={index}
                                                onChange={(value) => handleInputChange(index, "so_tem", value.toString())}
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
        </div>
    );
});

export default TableDongHoInfo;