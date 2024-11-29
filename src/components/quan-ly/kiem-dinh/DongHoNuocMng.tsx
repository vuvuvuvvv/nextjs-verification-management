"use client"

import { useEffect, useState, useCallback, useRef } from "react";
import c_vfml from "@styles/scss/components/verification-management-layout.module.scss";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import { viVN } from "@mui/x-date-pickers/locales";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import React from "react";

import Select, { GroupBase } from 'react-select';
import Pagination from "@/components/Pagination";
import { DongHo, DongHoFilterParameters, DuLieuChayDongHo } from "@lib/types";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { ACCESS_LINKS, limitOptions } from "@lib/system-constant";
import Swal from "sweetalert2";
import { deleteDongHo, getAllDongHo, getDongHoByFilter } from "@/app/api/dongho/route";

const Loading = React.lazy(() => import("@/components/Loading"));


interface WaterMeterManagementProps {
    className?: string,
    isBiggerThan15?: boolean
}

export default function WaterMeterManagement({ className, isBiggerThan15 = false }: WaterMeterManagementProps) {
    const [rootData, setRootData] = useState<DongHo[]>([]);
    const fetchCalled = useRef(false);

    const [filterLoading, setFilterLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | 'default' } | null>(null);
    const [limit, setLimit] = useState(5);
    const [error, setError] = useState("");

    // Func: Set err
    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: error,
                showClass: {
                    popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                  `
                },
                hideClass: {
                    popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                  `
                },
                confirmButtonColor: "#0980de",
                confirmButtonText: "OK"
            }).then(() => {
                setError("");
            });
        }
    }, [error]);

    const path = usePathname();

    const [filterForm, setFilterForm] = useState<DongHoFilterParameters>({
        is_bigger_than_15: isBiggerThan15,
        so_giay_chung_nhan: "",
        serial_number: "",
        type: "",
        ccx: "",
        nguoi_kiem_dinh: "",
        ten_khach_hang: "",
        status: "",
        ngay_kiem_dinh_from: null,
        ngay_kiem_dinh_to: null
    });
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await getAllDongHo();
                // console.log("dataDongHo: ", res.data)
                setRootData(res.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setFilterLoading(false);
            }
        };

        fetchData();
    }, []);

    const resetTotalPage = () => {
        setCurrentPage(1);
        if (!rootData || rootData.length <= limit) {
            return 1;
        }
        return Math.ceil(rootData.length / limit);
    }

    const [totalPage, setTotalPage] = useState(resetTotalPage);

    useEffect(() => {
        setTotalPage(resetTotalPage);
    }, [rootData, limit])

    const sortData = useCallback((key: keyof DongHo) => {
        if (!filterLoading) {
            setFilterLoading(true);
            let direction: 'asc' | 'desc' = 'asc';

            if (sortConfig && sortConfig.key === key) {
                direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
            }

            const sortedData = rootData ? [...rootData].sort((a, b) => {
                if (key === 'ngay_thuc_hien' || key === 'hieu_luc_bien_ban') {
                    const dateA = dayjs(a[key] as Date);
                    const dateB = dayjs(b[key] as Date);
                    return direction === 'asc' ? dateA.diff(dateB) : dateB.diff(dateA);
                } else {
                    return direction === 'asc'
                        ? (a[key] as string | number) < (b[key] as string | number) ? -1 : 1
                        : (a[key] as string | number) > (b[key] as string | number) ? -1 : 1;
                }
            }) : [];

            setRootData(sortedData);
            setSortConfig({ key, direction });
            setFilterLoading(false);
        }
    }, [rootData, sortConfig, filterLoading]);

    useEffect(() => {
        setFilterLoading(true);
        const debounce = setTimeout(async () => {
            try {
                const res = await getDongHoByFilter(filterForm);
                if (res.status === 200 || res.status === 201) {
                    setRootData(res.data);
                } else {
                    console.error(res.msg);
                    setError("Có lỗi đã xảy ra!");
                }
            } catch (error) {
                console.error('Error fetching PDM data:', error);
                setError("Có lỗi đã xảy ra!");
            } finally {
                setFilterLoading(false);
            }
        }, 500);

        return () => clearTimeout(debounce);
    }, [filterForm]);

    const handleFilterChange = (key: keyof DongHoFilterParameters, value: any) => {
        setFilterForm(prevForm => ({
            ...prevForm,
            [key]: value
        }));
    };

    const handleDelete = (id: string | null) => {
        if (id) {
            Swal.fire({
                title: "Xác nhận xóa?",
                text: "Bạn sẽ không thể hoàn tác dữ liệu này!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Có",
                cancelButtonText: "Không"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setFilterLoading(true);
                    try {
                        const res = await deleteDongHo(id);
                        if (res.status === 200 || res.status === 201) {
                            setRootData(prevData => prevData ? prevData.filter(item => item.id !== id) : []);
                            Swal.fire({
                                text: "Xóa thành công!",
                                icon: "success"
                            });
                        } else {
                            console.error(res.msg);
                            setError("Có lỗi đã xảy ra!");
                        }
                    } catch (error) {
                        console.error('Error deleting PDM:', error);
                        setError("Có lỗi đã xảy ra!");
                    } finally {
                        setFilterLoading(false);
                    }
                }
            });
        }
    };

    const hanldeResetFilter = () => {
        setFilterForm({
            so_giay_chung_nhan: "",
            serial_number: "",
            type: "",
            ccx: "",
            nguoi_kiem_dinh: "",
            ten_khach_hang: "",
            status: "",
            ngay_kiem_dinh_from: null,
            ngay_kiem_dinh_to: null
        });
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    // Function to process du_lieu
    const processDuLieu = (data: { du_lieu?: DuLieuChayDongHo }): string => {
        if (data.du_lieu) {
            let duLieuStr = "";
            Object.entries(data.du_lieu).map(([key, value]) => {
                if (value != null) {
                    const lastKey = value.lan_chay ? Object.keys(value.lan_chay).pop() : null; // Get the last key
                    duLieuStr += (lastKey ? `${key}: Lần ${lastKey}` : key) + ", ";
                }
            });
            return duLieuStr.substring(0, duLieuStr.length - 2);
        }
        return "";
    };

    const paginatedData = rootData ? rootData.slice((currentPage - 1) * limit, currentPage * limit) : [];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            <div className={`${className ? className : ""} m-0 w-100`}>
                <div className={`${c_vfml['wraper']} w-100`}>


                    <div className="bg-white w-100 shadow-sm mb-3 rounded pb-2 pt-4">
                        <div className={`row m-0 px-md-3 w-100 mb-3 ${c_vfml['search-process']}`}>
                            {/* <div className="col-12 mb-3 col-md-6 col-xl-4 d-flex">
                            <label className={`${c_vfml['form-label']}`} htmlFor="process-id">
                                ID:
                                <input
                                    type="text"
                                    id="process-id"
                                    className="form-control"
                                    placeholder="Nhập ID"
                                    value={filterForm.waterMeterId}
                                    onChange={(e) => handleFilterChange('waterMeterId', e.target.value)}
                                />
                            </label>
                        </div> */}

                            <div className="col-12 mb-3 col-md-6 col-xl-4 d-flex">
                                <label className={`${c_vfml['form-label']}`} htmlFor="so_giay_chung_nhan">
                                    Số giấy chứng nhận:
                                    <input
                                        type="text"
                                        id="so_giay_chung_nhan"
                                        className="form-control"
                                        placeholder="Nhập số giấy"
                                        value={filterForm.so_giay_chung_nhan}
                                        onChange={(e) => handleFilterChange('so_giay_chung_nhan', e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="col-12 mb-3 col-md-6 col-xl-4">
                                <label className={`${c_vfml['form-label']}`} htmlFor="ten_khach_hang">
                                    Tên khách hàng:
                                    <input
                                        type="text"
                                        id="ten_khach_hang"
                                        className="form-control"
                                        placeholder="Nhập tên khách hàng"
                                        value={filterForm.ten_khach_hang}
                                        onChange={(e) => handleFilterChange('ten_khach_hang', e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="col-12 mb-3 col-md-6 col-xl-4">
                                <label className={`${c_vfml['form-label']}`} htmlFor="nguoi_kiem_dinh">
                                    Người kiểm định:
                                    <input
                                        type="text"
                                        id="nguoi_kiem_dinh"
                                        className="form-control"
                                        placeholder="Nhập tên người kiểm định"
                                        value={filterForm.nguoi_kiem_dinh}
                                        onChange={(e) => handleFilterChange('nguoi_kiem_dinh', e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className={`col-12 col-md-6 col-xl-4 mb-3 m-0 p-0 row`}>
                                <label className={`${c_vfml['form-label']}`}>
                                    Số lượng bản ghi:
                                    <Select
                                        name="limit"
                                        options={limitOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        value={limitOptions.find(option => option.value === limit) || 5}
                                        onChange={(selectedOptions: any) => setLimit(selectedOptions ? selectedOptions.value : 5)}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                minHeight: '42px',
                                                marginTop: '0.5rem',
                                                borderColor: '#dee2e6 !important',
                                                boxShadow: 'none !important'
                                            }),
                                            valueContainer: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                padding: '0 8px'
                                            }),
                                            input: (provided) => ({
                                                ...provided,
                                                margin: '0',
                                                padding: '0'
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 777
                                            }),
                                            indicatorsContainer: (provided) => ({
                                                ...provided,
                                                height: '42px'
                                            })
                                        }}
                                    />
                                </label>
                            </div>

                            <div className={`col-12 col-xl-8 mb-3 m-0 row p-0 ${c_vfml['search-created-date']}`}>
                                <label className={`${c_vfml['form-label']} col-12`}>
                                    Ngày kiểm định:
                                </label>
                                <div className={`col-12 row m-0 mt-2 p-0 ${c_vfml['pick-created-date']}`}>
                                    <div className={`col-12 col-md-6 mb-3 mb-md-0 ${c_vfml['picker-field']}`}>
                                        <label>Từ:</label>

                                        <DatePicker
                                            className={`${c_vfml['date-picker']}`}
                                            value={filterForm.ngay_kiem_dinh_from ? dayjs(filterForm.ngay_kiem_dinh_from) : null}
                                            format="DD-MM-YYYY"

                                            onChange={(newValue: Dayjs | null) => handleFilterChange('ngay_kiem_dinh_from', newValue ? newValue.toDate() : null)}
                                            slotProps={{ textField: { fullWidth: true } }}
                                            maxDate={filterForm.ngay_kiem_dinh_to ? dayjs(filterForm.ngay_kiem_dinh_to).subtract(1, 'day') : dayjs().endOf('day').subtract(1, 'day')}
                                        />
                                    </div>

                                    <div className={`col-12 col-md-6 ${c_vfml['picker-field']}`}>
                                        <label>Đến:</label>
                                        <DatePicker
                                            className={`${c_vfml['date-picker']}`}
                                            value={filterForm.ngay_kiem_dinh_to ? dayjs(filterForm.ngay_kiem_dinh_to) : undefined}
                                            format="DD-MM-YYYY"
                                            minDate={filterForm.ngay_kiem_dinh_from ? dayjs(filterForm.ngay_kiem_dinh_from).add(1, 'day') : undefined}

                                            maxDate={dayjs().endOf('day')}
                                            onChange={(newValue: Dayjs | null) => handleFilterChange('ngay_kiem_dinh_to', newValue ? newValue.toDate() : undefined)}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={`col-12 m-0 my-2 d-flex align-items-center justify-content-between`}>
                                <button aria-label="Xóa bộ lọc" type="button" className={`btn bg-main-blue text-white`} onClick={hanldeResetFilter}>
                                    Xóa bộ lọc
                                </button>
                                <Link
                                    href={ACCESS_LINKS.DHN_ADD.src}
                                    className="btn bg-main-green text-white"
                                >
                                    Thêm mới
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white w-100 shadow-sm rounded overflow-hidden">
                        <div className={`m-0 p-0 w-100 w-100 position-relative ${c_vfml['wrap-process-table']}`}>
                            {filterLoading && <Loading />}
                            {paginatedData.length > 0 ? (
                                <table className={`table table-striped table-bordered table-hover ${c_vfml['process-table']}`}>
                                    <thead>
                                        <tr className={`${c_vfml['table-header']}`}>
                                            <th>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Số giấy CN
                                                    </span>
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('ten_khach_hang')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Tên khách hàng
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'ten_khach_hang' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'ten_khach_hang' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('nguoi_kiem_dinh')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Người kiểm định
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'nguoi_kiem_dinh' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'nguoi_kiem_dinh' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('ngay_thuc_hien')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Ngày thực hiện
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'ngay_thuc_hien' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'ngay_thuc_hien' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            {/* <th onClick={() => sortData('status')}>
                                    <div className={`${c_vfml['table-label']}`}>
                                        <span>
                                            Trạng thái
                                        </span>
                                        {sortConfig && sortConfig.key === 'status' && sortConfig.direction === 'asc' && (
                                            <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                        )}
                                        {sortConfig && sortConfig.key === 'status' && sortConfig.direction === 'desc' && (
                                            <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                        )}
                                    </div>
                                </th> */}
                                            <th>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Trạng thái
                                                    </span>
                                                </div>
                                            </th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.map((item, index) => (
                                            <tr
                                                key={index}
                                                onClick={() => window.open(`${ACCESS_LINKS.DHN_DETAIL.src}/${item.id}`, '_blank')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td>{item.so_giay_chung_nhan}</td>
                                                <td>{item.ten_khach_hang}</td>
                                                <td>{item.nguoi_kiem_dinh}</td>
                                                <td>{dayjs(item.ngay_thuc_hien).format('DD-MM-YYYY')}</td>
                                                <td>
                                                    {processDuLieu(item.du_lieu_kiem_dinh as { du_lieu?: DuLieuChayDongHo })}
                                                </td>
                                                <td
                                                    onClick={() => window.open(`${ACCESS_LINKS.DHN_EDIT_NDH.src + "/" + item.group_id}`)}
                                                >
                                                    {/* <Link target="_blank" aria-label="Xem chi tiết" href={ACCESS_LINKS.DHN_DETAIL.src + "/" + item.id} className={`btn w-100 text-blue`}>
                                                        <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                                    </Link> */}
                                                    <Link aria-label="Chỉnh sửa" href={ACCESS_LINKS.DHN_EDIT_DH.src + "/" + item.id} className={`btn w-100 text-blue shadow-0`}>
                                                        <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                                                    </Link>

                                                    {/* <div className={`dropdown ${c_vfml['action']}`}>
                                                        <button aria-label="Lựa chọn" className={`${c_vfml['action-button']}`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <FontAwesomeIcon icon={faEllipsisH}></FontAwesomeIcon>
                                                        </button>
                                                        <ul className={`dropdown-menu ${c_vfml['dropdown-menu']}`} style={{ zIndex: "777" }}>
                                                            <li>
                                                                <Link aria-label="Xem chi tiết" href={ACCESS_LINKS.DHN_DETAIL.src + "/"+ item.serial_number} className={`btn w-100`}>
                                                                    Xem chi tiết
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <button aria-label="Xóa" type="button" onClick={() => handleDelete(item.serial_number)} className={`btn w-100`}>
                                                                    Xóa
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div> */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center py-3 m-0 w-100">Không có dữ liệu</p>
                            )}
                        </div>
                        <div className="w-100 m-0 p-0 px-3 d-flex align-items-center justify-content-center">
                            <Pagination currentPage={currentPage} totalPage={totalPage} handlePageChange={handlePageChange}></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </LocalizationProvider>
    )
}