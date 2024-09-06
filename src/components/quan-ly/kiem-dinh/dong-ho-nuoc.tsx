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
import { WaterMeterData } from "@lib/types";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { statusOptions, typeOptions, ccxOptions, limitOptions } from "@lib/system-constant";

const Loading = React.lazy(() => import("@/components/loading"));


interface WaterMeterManagementProps {
    data: WaterMeterData[],
    className?: string,
}

interface FilterForm {
    waterMeterId: string;
    serialNumber: string;
    type: string;
    ccx: string;
    implementer: string;
    status: string | number;
    fromDate: Date | null;
    toDate: Date | null;
}

export default function WaterMeterManagement({ data, className }: WaterMeterManagementProps) {
    const [rootData, setRootData] = useState(data);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | 'default' } | null>(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [limit, setLimit] = useState(5);

    const path = usePathname();

    const [filterForm, setFilterForm] = useState<FilterForm>({
        waterMeterId: "",
        serialNumber: "",
        type: "",
        ccx: "",
        implementer: "",
        status: "",
        fromDate: null,
        toDate: null
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
        const debounce = setTimeout(() => {
            let filteredData = data;

            if (filterForm.waterMeterId) {
                filteredData = filteredData.filter(item => {
                    const keywords = filterForm.waterMeterId.trim().toLowerCase().replace(/[^\d]/g, '').split(' ').filter(Boolean);
                    const itemId = item.id;
                    return keywords.some(keyword => itemId.toString().includes(keyword));
                });
            }

            if (filterForm.serialNumber) {
                filteredData = filteredData.filter(item => {
                    const keyword = filterForm.serialNumber.trim().toLowerCase();
                    const itemSerial = item.serialNumber.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');
                    return itemSerial.includes(keyword);
                });
            }

            if (filterForm.implementer) {
                filteredData = filteredData.filter(item => {
                    const keywords = filterForm.implementer.trim().toLowerCase().split(' ').filter(Boolean);
                    const itemImplementer = item.createdBy.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');
                    return keywords.some(keyword => itemImplementer.includes(keyword));
                });
            }

            if (filterForm.status) {
                filteredData = filteredData.filter(item => {
                    const itemStatus = item.status;
                    return  filterForm.status == itemStatus;
                });
            }

            if (filterForm.type) {
                filteredData = filteredData.filter(item => item.type === filterForm.type);
            }

            if (filterForm.ccx) {
                filteredData = filteredData.filter(item => item.ccx === filterForm.ccx);
            }

            if (filterForm.fromDate || filterForm.toDate) {
                const now = new Date();
                filteredData = filteredData.filter(item => {
                    const itemDate = new Date(item.createdAt.split('-').reverse().join('-'));
                    if (filterForm.fromDate && filterForm.toDate) {
                        return itemDate >= filterForm.fromDate && itemDate <= filterForm.toDate;
                    } else if (filterForm.fromDate) {
                        return itemDate >= filterForm.fromDate && itemDate <= now;
                    } else if (filterForm.toDate) {
                        return itemDate <= filterForm.toDate;
                    }
                });
            }

            setRootData(filteredData);
            setSortConfig(null);
            setLoading(false);
        }, 500);
        return () => clearTimeout(debounce);
    }, [filterForm]);

    const handleFilterChange = (key: keyof FilterForm, value: any) => {
        setFilterForm(prevForm => ({
            ...prevForm,
            [key]: value
        }));
    };

    const hanldeResetFilter = () => {
        setFilterForm({
            waterMeterId: "",
            serialNumber: "",
            type: "",
            ccx: "",
            implementer: "",
            status: "",
            fromDate: null,
            toDate: null
        });
        setSelectedStatus(null);
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const paginatedData = rootData.slice((currentPage - 1) * limit, currentPage * limit);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            <div className={`${className ? className : ""} m-0 mb-3 w-100`}>
                <div className={`${c_vfml['wraper']} pb-3 w-100`}>


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
                                <label className={`${c_vfml['form-label']}`} htmlFor="serial-number">
                                    Serial number:
                                    <input
                                        type="text"
                                        id="serial-number"
                                        className="form-control"
                                        placeholder="Nhập số seri"
                                        value={filterForm.serialNumber}
                                        onChange={(e) => handleFilterChange('serialNumber', e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="col-12 mb-3 col-md-6 col-xl-4">
                                <label className={`${c_vfml['form-label']}`} htmlFor="implementer">
                                    Người kiểm định:
                                    <input
                                        type="text"
                                        id="implementer"
                                        className="form-control"
                                        placeholder="Nhập tên người kiểm định"
                                        value={filterForm.implementer}
                                        onChange={(e) => handleFilterChange('implementer', e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="col-12 mb-3 col-md-6 col-xl-4">
                                <label className={`${c_vfml['form-label']}`}>
                                    Trạng thái:
                                    <Select
                                        // isMulti
                                        name="status"
                                        options={statusOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        isClearable
                                        value={selectedStatus}
                                        onChange={(selectedOptions: any) => {
                                            if (selectedOptions) {
                                                // const values = selectedOptions.map((option: { value: string }) => option.value);
                                                const values = selectedOptions.value;

                                                setSelectedStatus(selectedOptions);
                                                handleFilterChange('status', values);
                                            } else {
                                                setSelectedStatus(null);
                                                handleFilterChange('status', []);
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

                            <div className={`col-12 col-md-8 mb-3 m-0 row p-0 ${c_vfml['search-created-date']}`}>
                                <label className={`${c_vfml['form-label']} col-12`}>
                                    Cập nhật cuối:
                                </label>
                                <div className={`col-12 row m-0 mt-2 p-0 ${c_vfml['pick-created-date']}`}>
                                    <div className={`col-12 col-md-6 mb-3 mb-md-0 ${c_vfml['picker-field']}`}>
                                        <label>Từ:</label>

                                        <DatePicker
                                            className={`${c_vfml['date-picker']}`}
                                            value={filterForm.fromDate ? dayjs(filterForm.fromDate) : null}
                                            format="DD-MM-YYYY"

                                            onChange={(newValue: Dayjs | null) => handleFilterChange('fromDate', newValue ? newValue.toDate() : null)}
                                            slotProps={{ textField: { fullWidth: true } }}
                                            maxDate={filterForm.toDate ? dayjs(filterForm.toDate).subtract(1, 'day') : dayjs().endOf('day').subtract(1, 'day')}
                                        />
                                    </div>

                                    <div className={`col-12 col-md-6 ${c_vfml['picker-field']}`}>
                                        <label>Đến:</label>
                                        <DatePicker
                                            className={`${c_vfml['date-picker']}`}
                                            value={filterForm.toDate ? dayjs(filterForm.toDate) : undefined}
                                            format="DD-MM-YYYY"
                                            minDate={filterForm.fromDate ? dayjs(filterForm.fromDate).add(1, 'day') : undefined}

                                            maxDate={dayjs().endOf('day')}
                                            onChange={(newValue: Dayjs | null) => handleFilterChange('toDate', newValue ? newValue.toDate() : undefined)}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-12 col-md-4 mb-3 m-0 p-0 row`}>
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
                        <div className={`m-0 p-0 w-100 w-100 position-relative ${c_vfml['wrap-process-table']}`}>
                            {loading && <Loading />}
                            {paginatedData.length > 0 ? (
                                <table className={`table table-hover ${c_vfml['process-table']}`}>
                                    <thead>
                                        <tr className={`${c_vfml['table-header']}`}>
                                            {/* <th onClick={() => sortData('id')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        ID
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'id' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'id' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th> */}
                                            <th>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Serial Number
                                                    </span>
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('createdBy')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Người kiểm định
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'createdBy' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'createdBy' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('type')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Kiểu
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'type' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'type' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('ccx')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Cấp chính xác
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'ccx' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'ccx' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('status')}>
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
                                            </th>
                                            <th onClick={() => sortData('updatedAt')}>
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
                                            </th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.map((item, index) => (
                                            <tr key={index}>
                                                {/* <td>{item.id}</td> */}
                                                <td>{item.serialNumber}</td>
                                                <td>{item.createdBy}</td>
                                                <td>{item.type}</td>
                                                <td>{item.ccx}</td>
                                                <td>{statusOptions.find(option => option.value == item.status)?.label || "Khôngggg hoạt động"}</td>
                                                <td>{item.updatedAt}</td>
                                                <td>
                                                    <div className={`dropdown ${c_vfml['action']}`}>
                                                        <button className={`${c_vfml['action-button']}`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <FontAwesomeIcon icon={faEllipsisH}></FontAwesomeIcon>
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <Link href={path + "/chi-tiet/" + item.id} className={`btn w-100`}>
                                                                    Xem chi tiết
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <button type="button" className={`btn w-100`}>
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