"use client"

import { useEffect, useState, useCallback, Suspense } from "react";
import c_vfml from "@styles/scss/components/verification-management-layout.module.scss";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import { viVN } from "@mui/x-date-pickers/locales";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faEye, faTrash, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import React from "react";

import Select, { GroupBase } from 'react-select';
import Pagination from "@/components/pagination";
import { PDMData, PDMFilterParameters } from "@lib/types";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { pdmStatusOptions, limitOptions } from "@lib/system-constant";
import api from "@/app/api/route";
import { deletePDM, getPDMByFilter } from "@/app/api/pdm/route";
import Swal from "sweetalert2";

const Loading = React.lazy(() => import("@/components/loading"));


interface PDMManagementProps {
    data: PDMData[],
    className?: string,
}

export default function PDMManagement({ data, className }: PDMManagementProps) {
    const [rootData, setRootData] = useState(data);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | 'default' } | null>(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [limit, setLimit] = useState(5);
    const [error, setError] = useState("");

    const path = usePathname();

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


    const [filterForm, setFilterForm] = useState<PDMFilterParameters>({
        ma_tim_dong_ho_pdm: "",
        so_qd_pdm: "",
        tinh_trang: "",
        ngay_qd_pdm_from: null,
        ngay_qd_pdm_to: null,
    });
    const [currentPage, setCurrentPage] = useState(1);

    const resetTotalPage = () => {
        setCurrentPage(1);
        if (rootData.length <= limit) {
            return 1;
        }
        return Math.ceil(rootData.length / limit);
    }

    const [totalPage, setTotalPage] = useState(resetTotalPage);

    useEffect(() => {
        setTotalPage(resetTotalPage);
    }, [rootData, limit])

    const sortData = useCallback((key: string) => {
        if (!loading) {
            setLoading(true);
            let direction: 'asc' | 'desc' = 'asc';

            if (sortConfig && sortConfig.key === key) {
                direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
            }

            const sortedData = [...rootData].sort((a, b) => {
                if (key === 'createdAt' || key === 'updatedAt') {
                    const dateA = dayjs(a[key as keyof typeof a], 'DD-MM-YYYY');
                    const dateB = dayjs(b[key as keyof typeof b], 'DD-MM-YYYY');
                    return direction === 'asc' ? dateA.diff(dateB) : dateB.diff(dateA);
                } else {
                    return direction === 'asc'
                        ? a[key as keyof typeof a] < b[key as keyof typeof a] ? -1 : 1
                        : a[key as keyof typeof a] > b[key as keyof typeof a] ? -1 : 1;
                }
            });

            setRootData(sortedData);
            setSortConfig({ key, direction });
            setLoading(false);
        }
    }, [rootData, sortConfig]);

    useEffect(() => {

        setLoading(true);
        const debounce = setTimeout(async () => {
            try {
                const res = await getPDMByFilter(filterForm);
                if (res.status === 200) {
                    setRootData(res.data);
                } else {
                    console.error(res.msg);
                    setError("Có lỗi đã xảy ra!");
                }
            } catch (error) {
                console.error('Error fetching PDM data:', error);
                setError("Có lỗi đã xảy ra!");
            } finally {
                setLoading(false);
            }
        }, 700);

        return () => clearTimeout(debounce);

    }, [filterForm]);

    const handleFilterChange = (key: keyof PDMFilterParameters, value: any) => {
        setFilterForm(prevForm => ({
            ...prevForm,
            [key]: value
        }));
    };

    const handleDelete = (ma_tim_dong_ho_pdm: string) => {
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
                setLoading(true);
                try {
                    const res = await deletePDM(ma_tim_dong_ho_pdm);
                    if (res.status === 200) {
                        setRootData(prevData => prevData.filter(item => item.ma_tim_dong_ho_pdm !== ma_tim_dong_ho_pdm));
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
                    setLoading(false);
                }
            }
        });
    };

    const hanldeResetFilter = () => {
        setFilterForm({
            ma_tim_dong_ho_pdm: "",
            so_qd_pdm: "",
            ngay_qd_pdm_from: null,
            ngay_qd_pdm_to: null,
            tinh_trang: "",
        });
        setSelectedStatus("");
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const paginatedData = rootData.slice((currentPage - 1) * limit, currentPage * limit);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            <div className={`${className ? className : ""} mb-3 p-0 w-100`}>
                <div className={`${c_vfml['wraper']} py-3 w-100`}>

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
                                    value={filterForm.PDMId}
                                    onChange={(e) => handleFilterChange('PDMId', e.target.value)}
                                />
                            </label>
                        </div> */}

                            <div className="col-12 mb-3 col-md-6 col-xl-4 d-flex">
                                <label className={`${c_vfml['form-label']}`} htmlFor="ma_tim_dong_ho_pdm">
                                    Mã tìm đồng hồ PDM:
                                    <input
                                        type="text"
                                        id="ma_tim_dong_ho_pdm"
                                        className="form-control"
                                        placeholder="Nhập mã tìm đồng hồ"
                                        value={filterForm.ma_tim_dong_ho_pdm || ""}
                                        onChange={(e) => handleFilterChange('ma_tim_dong_ho_pdm', e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="col-12 mb-3 col-md-6 col-xl-4">
                                <label className={`${c_vfml['form-label']}`} htmlFor="so_qd_pdm">
                                    Số quyết định PDM:
                                    <input
                                        type="text"
                                        id="so_qd_pdm"
                                        className="form-control"
                                        placeholder="Nhập tên đồng hồ"
                                        value={filterForm.so_qd_pdm || ""}
                                        onChange={(e) => handleFilterChange('so_qd_pdm', e.target.value)}
                                    />
                                </label>
                            </div>


                            <div className="col-12 mb-3 col-md-6 col-xl-4">
                                <label className={`${c_vfml['form-label']}`}>
                                    Trạng thái:
                                    <Select
                                        // isMulti
                                        name="status"
                                        options={pdmStatusOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        isClearable
                                        value={selectedStatus}
                                        onChange={(selectedOptions: any) => {
                                            if (selectedOptions) {
                                                // const values = selectedOptions.map((option: { value: string }) => option.value);
                                                const values = selectedOptions.value;

                                                setSelectedStatus(selectedOptions);
                                                handleFilterChange('tinh_trang', values);
                                            } else {
                                                setSelectedStatus('');
                                                handleFilterChange('tinh_trang', "");
                                            }
                                        }}
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
                                            indicatorsContainer: (provided) => ({
                                                ...provided,
                                                height: '42px'
                                            })
                                        }}
                                    />
                                </label>
                            </div>

                            {/* <div className="col-12 mb-3 col-md-6 col-xl-4">
                            <label className={`${c_vfml['form-label']}`}>
                                Kiểu:
                                <Select
                                    name="type"
                                    options={typeOptions as unknown as readonly GroupBase<never>[]}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    isClearable
                                    value={typeOptions.find(option => option.value === filterForm.type) || null}
                                    onChange={(selectedOptions: any) => handleFilterChange('type', selectedOptions ? selectedOptions.value : null)}
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
                                        indicatorsContainer: (provided) => ({
                                            ...provided,
                                            height: '42px'
                                        })
                                    }}
                                />
                            </label>
                        </div> */}

                            {/* <div className="col-12 mb-3 col-md-6 col-xl-4">
                            <label className={`${c_vfml['form-label']}`}>
                                Cấp chính xác:
                                <Select
                                    name="ccx"
                                    options={ccxOptions as unknown as readonly GroupBase<never>[]}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    isClearable
                                    value={ccxOptions.find(option => option.value === filterForm.ccx) || null}
                                    onChange={(selectedOptions: any) => handleFilterChange('ccx', selectedOptions ? selectedOptions.value : null)}
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
                                        indicatorsContainer: (provided) => ({
                                            ...provided,
                                            height: '42px'
                                        })
                                    }}
                                />
                            </label>
                        </div> */}
                            <div className="col-12 mb-3 col-md-6 col-xl-4">
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
                                    Ngày quyết định PDM:
                                </label>
                                <div className={`col-12 row m-0 mt-2 p-0 ${c_vfml['pick-created-date']}`}>
                                    <div className={`col-12 col-md-6 mb-3 mb-md-0 ${c_vfml['picker-field']}`}>
                                        <label>Từ:</label>

                                        <DatePicker
                                            className={`${c_vfml['date-picker']}`}
                                            value={filterForm.ngay_qd_pdm_from ? dayjs(filterForm.ngay_qd_pdm_from) : null}
                                            format="DD-MM-YYYY"

                                            onChange={(newValue: Dayjs | null) => handleFilterChange('ngay_qd_pdm_from', newValue ? newValue.format("YYYY-MM-DD HH:mm:ss") : null)}
                                            slotProps={{ textField: { fullWidth: true } }}
                                            maxDate={filterForm.ngay_qd_pdm_to ? dayjs(filterForm.ngay_qd_pdm_to).subtract(1, 'day') : dayjs().endOf('day').subtract(1, 'day')}
                                        />
                                    </div>

                                    <div className={`col-12 col-md-6 ${c_vfml['picker-field']}`}>
                                        <label>Đến:</label>
                                        <DatePicker
                                            className={`${c_vfml['date-picker']}`}
                                            value={filterForm.ngay_qd_pdm_to ? dayjs(filterForm.ngay_qd_pdm_to) : undefined}
                                            format="DD-MM-YYYY"
                                            minDate={filterForm.ngay_qd_pdm_from ? dayjs(filterForm.ngay_qd_pdm_from).add(1, 'day') : undefined}

                                            maxDate={dayjs().endOf('day')}
                                            onChange={(newValue: Dayjs | null) => handleFilterChange('ngay_qd_pdm_to', newValue ? newValue.format("YYYY-MM-DD HH:mm:ss") : null)}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={`col-12 m-0 my-2 d-flex align-items-center justify-content-between`}>
                                <button type="button" className={`btn bg-main-blue text-white`} onClick={hanldeResetFilter}>
                                    Xóa bộ lọc
                                </button>
                                <Link
                                    href={path + "/them-moi"}
                                    className="btn bg-main-green text-white"
                                >
                                    Thêm mới
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white w-100 shadow-sm rounded overflow-hidden">

                        <div className={`m-0 p-0 w-100 w-100 mt-4 bg-white position-relative ${c_vfml['wrap-process-table']}`}>
                            {loading && <Loading />}
                            {paginatedData.length > 0 ? (
                                <table className={`table table-striped table-bordered table-hover ${c_vfml['process-table']}`}>
                                    <thead>
                                        <tr className={`${c_vfml['table-header']}`}>
                                            <th onClick={() => sortData('id')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Mã tìm đồng hồ PDM
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'id' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'id' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Tên đồng hồ
                                                    </span>
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('createdBy')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Số QĐ-PDM
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'createdBy' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'createdBy' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('ngay_qd_pdm')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Ngày quyết định PDM
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'ngay_qd_pdm' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'ngay_qd_pdm' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('ngay_het_han')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Ngày hết hạn
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'ngay_het_han' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'ngay_het_han' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Tình trạng
                                                    </span>
                                                </div>
                                            </th>
                                            {/* <th onClick={() => sortData('updatedAt')}>
                                            <div className={`${c_vfml['table-label']}`}>
                                                <span>
                                                    Cập nhật cuối
                                                </span>
                                                {sortConfig && sortConfig.key === 'updatedAt' && sortConfig.direction === 'asc' && (
                                                    <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                )}
                                                {sortConfig && sortConfig.key === 'updatedAt' && sortConfig.direction === 'desc' && (
                                                    <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                )}
                                            </div>
                                        </th> */}
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.map((item, index) => (
                                            <tr key={index}>
                                                {/* <td>{item.id}</td> */}
                                                <td>{item.ma_tim_dong_ho_pdm}</td>
                                                <td>{item.ten_dong_ho}</td>
                                                <td>{item.so_qd_pdm}</td>
                                                <td>{dayjs(item.ngay_qd_pdm).format('DD-MM-YYYY')}</td>
                                                <td>{dayjs(item.ngay_het_han).format('DD-MM-YYYY')}</td>
                                                <td>
                                                    {new Date(item.ngay_het_han) > new Date() ? 'Còn hiệu lực' : 'Hết hạn'}
                                                </td>
                                                <td>
                                                    <div className={`dropdown ${c_vfml['action']}`}>
                                                        <button className={`${c_vfml['action-button']}`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <FontAwesomeIcon icon={faEllipsisH}></FontAwesomeIcon>
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <Link target="blank" href={path + "/chi-tiet/" + item.ma_tim_dong_ho_pdm} className={`btn w-100`}>
                                                                    Xem chi tiết
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <button type="button" onClick={() => handleDelete(item.ma_tim_dong_ho_pdm)} className={`btn w-100`}>
                                                                    Xóa
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center w-100">Không có dữ liệu</p>
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