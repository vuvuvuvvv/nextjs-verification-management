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
import { NhomDongHoFilterParameters, NhomDongHo, PDMData } from "@lib/types";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { ACCESS_LINKS, BASE_API_URL, limitOptions } from "@lib/system-constant";
import Swal from "sweetalert2";
import { deleteNhomDongHo, getNhomDongHoByFilter, updatePaymentStatus } from "@/app/api/dongho/route";
import api from "@/app/api/route";
import dynamic from "next/dynamic";
import { Form } from "react-bootstrap";
import { useUser } from "@/context/AppContext";
import { updatePDM } from "@/app/api/pdm/route";

const Loading = dynamic(() => import("@/components/Loading"), { ssr: false });


interface NhomDongHoNuocManagementProps {
    className?: string,
}

export default function NhomDongHoNuocManagement({ className }: NhomDongHoNuocManagementProps) {
    const { user } = useUser();
    const [rootData, setRootData] = useState<NhomDongHo[]>([]);
    const fetchCalled = useRef(false);

    const [filterLoading, setFilterLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | 'default' } | null>(null);
    // const [limit, setLimit] = useState(10);
    const [error, setError] = useState("");

    const fetchDHNameCalled = useRef(false);
    const [selectedTenDHOption, setSelectedTenDHOption] = useState('');
    const [DHNameOptions, setDHNameOptions] = useState<{ value: string, label: string }[]>([]);

    // Query dongho name
    useEffect(() => {
        if (fetchDHNameCalled.current) return;
        fetchDHNameCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await api.get(`${BASE_API_URL}/pdm`);
                const listNames: string[] = [...res.data.map((pdm: PDMData) => pdm["ten_dong_ho"])]
                const uniqueNames = listNames.filter((value, index, self) => self.indexOf(value) === index);
                const sortedNames = uniqueNames.sort((a, b) => a.localeCompare(b));
                setDHNameOptions(sortedNames && sortedNames.length > 0 ? [
                    ...sortedNames
                        .filter(name => name && name.trim() !== "")
                        .map((name) => ({ value: name, label: name }))
                ] : []);
            } catch (error) {
                setError("Đã có lỗi xảy ra! Hãy thử lại sau.");
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await getNhomDongHoByFilter();
                setRootData(res.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setFilterLoading(false);
            }
        };

        fetchData();
    }, []);

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

    const [filterForm, setFilterForm] = useState<NhomDongHoFilterParameters>({
        ten_dong_ho: "",
        ten_khach_hang: "",
        nguoi_kiem_dinh: "",
        ngay_kiem_dinh_from: null,
        ngay_kiem_dinh_to: null
    });
    // const [currentPage, setCurrentPage] = useState(1);

    // const resetTotalPage = () => {
    //     setCurrentPage(1);
    //     if (!rootData || rootData.length <= (limit ? limit : 1)) {
    //         return 1;
    //     }
    //     return Math.ceil(rootData.length / (limit ? limit : 1));
    // }

    // const [totalPage, setTotalPage] = useState(resetTotalPage);

    // useEffect(() => {
    //     setTotalPage(resetTotalPage);
    // }, [rootData, limit])

    const sortData = useCallback((key: keyof NhomDongHo) => {
        if (!filterLoading) {
            setFilterLoading(true);
            let direction: 'asc' | 'desc' = 'asc';

            if (sortConfig && sortConfig.key === key) {
                direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
            }

            const sortedData = rootData ? [...rootData].sort((a, b) => {
                if (key === 'ngay_thuc_hien') {
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

    const _fetchNhomDongHo = () => {
        setFilterLoading(true);
        const debounce = setTimeout(async () => {
            try {
                const res = await getNhomDongHoByFilter(filterForm);
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
    }

    useEffect(() => {
        _fetchNhomDongHo();
    }, [filterForm]);

    const handleFilterChange = (key: keyof NhomDongHoFilterParameters, value: any) => {
        setFilterForm(prevForm => ({
            ...prevForm,
            [key]: value
        }));
    };

    const hanldeResetFilter = () => {
        setFilterForm({
            ten_dong_ho: "",
            ten_khach_hang: "",
            nguoi_kiem_dinh: "",
            ngay_kiem_dinh_from: null,
            ngay_kiem_dinh_to: null
        });
    }

    const handleUpdatePaymentStatus = (group_id: string, current_payment_status: boolean) => {
        if (group_id) {
            Swal.fire({
                title: `Xác nhận!`,
                text: !current_payment_status ? "Đã hoàn tất thanh toán?" : "Chưa hoàn tất thanh toán?",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#d33",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const res = await updatePaymentStatus(group_id, !current_payment_status, user?.fullname || "");
                        if (res.status == 200 || res.status == 201) {
                            _fetchNhomDongHo();
                        } else {
                            setError("Đã có lỗi xảy ra! Hãy thử lại sau.");
                        }
                    } catch (error) {
                        setError("Đã có lỗi xảy ra! Hãy thử lại sau.");
                    }
                }
            });
        }
    }

    // const handlePageChange = (newPage: number) => {
    //     setCurrentPage(newPage);
    // };

    // const paginatedData = rootData ? rootData.slice((currentPage - 1) * limit, currentPage * limit) : [];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            <div className={`${className ? className : ""} m-0 w-100`}>
                <div className={`${c_vfml['wraper']} w-100`}>


                    <div className="bg-white w-100 shadow-sm mb-2 rounded pb-2 pt-4">
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
                                <label className={`${c_vfml['form-label']}`} htmlFor="ten_dong_ho">
                                    Tên đồng hồ:
                                    <Select
                                        options={DHNameOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select mt-2"
                                        placeholder="Tên đồng hồ"
                                        classNamePrefix="select"
                                        isClearable
                                        id="ten_dong_ho"
                                        value={selectedTenDHOption}
                                        isSearchable
                                        onChange={(selectedOptions: any) => {
                                            if (selectedOptions) {
                                                const values = selectedOptions.value;

                                                setSelectedTenDHOption(selectedOptions);
                                                handleFilterChange('ten_dong_ho', values);
                                            } else {
                                                setSelectedTenDHOption('');
                                                handleFilterChange('ten_dong_ho', "");
                                            }
                                        }}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                minHeight: '42px',
                                                borderColor: '#dee2e6 !important',
                                                boxShadow: 'none !important',
                                                backgroundColor: "white",
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
                                            indicatorsContainer: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                display: DHNameOptions.length == 0 ? "none" : "flex",
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                display: DHNameOptions.length == 0 ? "none" : "",
                                                maxHeight: "250px",
                                                zIndex: 777
                                            }),
                                            menuList: (provided) => ({
                                                ...provided,
                                                maxHeight: "250px",
                                            }),
                                            singleValue: (provided, state) => ({
                                                ...provided,
                                                color: state.isDisabled ? '#000' : provided.color,
                                            })
                                        }}
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
                            {/* <div className={`col-12 col-md-6 col-xl-4 mb-3 m-0 p-0 row`}>
                                <label className={`${c_vfml['form-label']}`}>
                                    Số lượng bản ghi:
                                    <Select
                                        name="limit"
                                        options={limitOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        value={limitOptions.find(option => option.value === limit) || 10}
                                        onChange={(selectedOptions: any) => setLimit(selectedOptions ? selectedOptions.value : 10)}
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
                            </div> */}

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

                    <div className="bg-white w-100 shadow-sm rounded position-relative overflow-hidden">
                        {filterLoading && <Loading />}
                        <div className={`m-0 p-0 w-100 w-100 position-relative ${c_vfml['wrap-process-table']}`}>
                            {/* {paginatedData.length > 0 ? ( */}
                            {rootData.length > 0 ? (
                                <table className={`table table-striped table-bordered table-hover ${c_vfml['process-table']}`}>
                                    <thead>
                                        <tr className={`${c_vfml['table-header']}`}>
                                            <th className="text-center">
                                                STT
                                            </th>
                                            <th onClick={() => sortData('ten_dong_ho')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Tên đồng hồ
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'ten_dong_ho' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'ten_dong_ho' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('so_luong')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Số lượng
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'so_luong' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'so_luong' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('ten_khach_hang')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Tên khách hàng
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'ten_khach_hang' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'ten_khach_hang' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('nguoi_kiem_dinh')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Người kiểm định
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'nguoi_kiem_dinh' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'nguoi_kiem_dinh' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('ngay_thuc_hien')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Ngày thực hiện
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'ngay_thuc_hien' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'ngay_thuc_hien' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th>
                                                <div className={`${c_vfml['table-label']} p-0`} style={{ minWidth: "96px" }}>
                                                    Đã thu tiền
                                                </div>
                                            </th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {paginatedData.map((item, index) => ( */}
                                        {rootData.map((item, index) => {
                                            const redirectLink = `${ACCESS_LINKS.DHN_DETAIL_NDH.src}/${item.group_id}`;
                                            return (
                                                <tr
                                                    key={index}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <td onClick={() => window.open(redirectLink)} className="text-center">{rootData.indexOf(item) + 1}</td>
                                                    <td onClick={() => window.open(redirectLink)}>{item.ten_dong_ho}</td>
                                                    <td onClick={() => window.open(redirectLink)}>{item.so_luong}</td>
                                                    <td onClick={() => window.open(redirectLink)}>{item.ten_khach_hang}</td>
                                                    <td onClick={() => window.open(redirectLink)}>{item.nguoi_kiem_dinh}</td>
                                                    <td onClick={() => window.open(redirectLink)}>{dayjs(item.ngay_thuc_hien).format('DD-MM-YYYY')}</td>
                                                    <td>
                                                        <div className="w-100 d-flex justify-content-center" onClick={() => handleUpdatePaymentStatus(item?.group_id || "", item?.is_paid ?? false)}>
                                                            <Form.Check
                                                                type="checkbox"
                                                                style={{ width: "100px" }}
                                                                className="d-flex justify-content-center"
                                                                label={
                                                                    <span className="ms-1" style={{ color: 'black', cursor: 'pointer' }}>{(item?.is_paid ?? false) ? "Đã thu" : "Chưa thu"}</span>
                                                                }
                                                                checked={item?.is_paid ?? false}
                                                                onChange={() => handleUpdatePaymentStatus(item?.group_id || "", item?.is_paid ?? false)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td
                                                        onClick={() => window.open(`${ACCESS_LINKS.DHN_EDIT_NDH.src + "/" + item.group_id}`)}
                                                    >
                                                        {/* <Link target="_blank" aria-label="Xem chi tiết" href={ACCESS_LINKS.DHN_DETAIL_NDH.src + "/nhom/" + item.group_id} className={`btn w-100 text-blue`}>
                                                            <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                                        </Link> */}
                                                        <Link aria-label="Chỉnh sửa" href={ACCESS_LINKS.DHN_EDIT_NDH.src + "/" + item.group_id} className={`btn w-100 text-blue shadow-0`}>
                                                            <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center py-3 m-0 w-100">Không có dữ liệu</p>
                            )}
                        </div>
                        <div className="w-100 m-0 p-3 d-flex align-items-center justify-content-center">
                            {/* <Pagination currentPage={currentPage} totalPage={totalPage} handlePageChange={handlePageChange}></Pagination> */}
                        </div>
                    </div>
                </div>
            </div>
        </LocalizationProvider>
    )
}