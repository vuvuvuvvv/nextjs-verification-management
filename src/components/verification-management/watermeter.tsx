"use client"

import { useEffect, useState, useCallback, Suspense } from "react";
import vml from "@styles/scss/components/verification-management-layout.module.scss";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import { viVN } from "@mui/x-date-pickers/locales";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import React from "react";

import Select, { GroupBase } from 'react-select';
import Pagination from "@/components/pagination";
import { WaterMeterDataType } from "@lib/types";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { statusOptions, typeOptions, accuracyClassOptions, entryOptions } from "@lib/system-constant";

const Loading = React.lazy(() => import("@/components/loading"));


interface WaterMeterManagementProps {
    data: WaterMeterDataType[],
    className?: string,
}

interface FilterForm {
    waterMeterId: string;
    serialNumber: string;
    type: string;
    accuracyClass: string;
    implementer: string;
    status: string[];
    fromDate: Date | null;
    toDate: Date | null;
}

export default function WaterMeterManagement({ data, className }: WaterMeterManagementProps) {
    const [rootData, setRootData] = useState(data);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | 'default' } | null>(null);
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [entry, setEntry] = useState(5);

    const path = usePathname();

    const [filterForm, setFilterForm] = useState<FilterForm>({
        waterMeterId: "",
        serialNumber: "",
        type: "",
        accuracyClass: "",
        implementer: "",
        status: [],
        fromDate: null,
        toDate: null
    });
    const [currentPage, setCurrentPage] = useState(1);

    const resetTotalPage = () => {
        setCurrentPage(1);
        if (rootData.length <= entry) {
            return 1;
        }
        return Math.ceil(rootData.length / entry);
    }

    const [totalPage, setTotalPage] = useState(resetTotalPage);

    useEffect(() => {
        setTotalPage(resetTotalPage);
    }, [rootData, entry])

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

            if (filterForm.status.length > 0) {
                filteredData = filteredData.filter(item => {
                    const itemStatus = item.status.split(',');
                    return filterForm.status.every(s => itemStatus.includes(s));
                });
            }

            if (filterForm.type) {
                filteredData = filteredData.filter(item => item.type === filterForm.type);
            }

            if (filterForm.accuracyClass) {
                filteredData = filteredData.filter(item => item.accuracyClass === filterForm.accuracyClass);
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
            accuracyClass: "",
            implementer: "",
            status: [],
            fromDate: null,
            toDate: null
        });
        setSelectedStatus([]);
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const paginatedData = rootData.slice((currentPage - 1) * entry, currentPage * entry);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            {/* <div className={`${className ? className : ""} mb-3 container-fluid p-0 px-2 py-3 w-100`}> */}
            <div className={`${className ? className : ""} mb-3 p-0 w-100`}>
                {/* <div className={`${vml['wraper']} py-3 w-100 bg-white sr-cover`}> */}
                {/* <h3 className="px-3 pt-3 mb-0">Quản lý nhóm:</h3> */}
                <div className={`${vml['wraper']} py-3 w-100 bg-white`}>

                    <div className={`row m-0 px-md-3 w-100 mb-3 ${vml['search-process']}`}>
                        {/* <div className="col-12 mb-3 col-md-6 col-xl-4 d-flex">
                            <label className={`${vml['form-label']}`} htmlFor="process-id">
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
                            <label className={`${vml['form-label']}`} htmlFor="serial-number">
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
                            <label className={`${vml['form-label']}`} htmlFor="implementer">
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
                            <label className={`${vml['form-label']}`}>
                                Trạng thái:
                                <Select
                                    isMulti
                                    name="status"
                                    options={statusOptions as unknown as readonly GroupBase<never>[]}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    isClearable
                                    value={selectedStatus}
                                    onChange={(selectedOptions: any) => {
                                        if (selectedOptions) {
                                            const values = selectedOptions.map((option: { value: string }) => option.value);
                                            setSelectedStatus(selectedOptions);
                                            handleFilterChange('status', values);
                                        } else {
                                            setSelectedStatus([]);
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
                            <label className={`${vml['form-label']}`}>
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
                            <label className={`${vml['form-label']}`}>
                                Cấp chính xác:
                                <Select
                                    name="accuracyClass"
                                    options={accuracyClassOptions as unknown as readonly GroupBase<never>[]}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    isClearable
                                    value={accuracyClassOptions.find(option => option.value === filterForm.accuracyClass) || null}
                                    onChange={(selectedOptions: any) => handleFilterChange('accuracyClass', selectedOptions ? selectedOptions.value : null)}
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

                        <div className={`col-12 col-md-8 mb-3 m-0 row p-0 ${vml['search-created-date']}`}>
                            <label className={`${vml['form-label']} col-12`}>
                                Cập nhật cuối:
                            </label>
                            <div className={`col-12 row m-0 mt-2 p-0 ${vml['pick-created-date']}`}>
                                <div className={`col-12 col-md-6 mb-3 mb-md-0 ${vml['picker-field']}`}>
                                    <label>Từ:</label>

                                    <DatePicker
                                        className={`${vml['date-picker']}`}
                                        value={filterForm.fromDate ? dayjs(filterForm.fromDate) : null}
                                        format="DD-MM-YYYY"

                                        onChange={(newValue: Dayjs | null) => handleFilterChange('fromDate', newValue ? newValue.toDate() : null)}
                                        slotProps={{ textField: { fullWidth: true } }}
                                        maxDate={filterForm.toDate ? dayjs(filterForm.toDate).subtract(1, 'day') : dayjs().endOf('day').subtract(1, 'day')}
                                    />
                                </div>

                                <div className={`col-12 col-md-6 ${vml['picker-field']}`}>
                                    <label>Đến:</label>
                                    <DatePicker
                                        className={`${vml['date-picker']}`}
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
                            <label className={`${vml['form-label']}`}>
                                Số lượng bản ghi:
                                <Select
                                    name="entry"
                                    options={entryOptions as unknown as readonly GroupBase<never>[]}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    value={entryOptions.find(option => option.value === entry) || 5}
                                    onChange={(selectedOptions: any) => setEntry(selectedOptions ? selectedOptions.value : 5)}
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
                                href={path + "/new-process"}
                                className="btn bg-main-green text-white"
                            >
                                Thêm mới
                            </Link>
                        </div>
                    </div>

                    <div className={`m-0 p-0 w-100 w-100 mt-4 bg-white position-relative ${vml['wrap-process-table']}`}>
                        {loading && <Suspense fallback={<div>Loading...</div>}><Loading /></Suspense>}
                        {paginatedData.length > 0 ? (
                            <table className={`table table-striped table-bordered table-hover ${vml['process-table']}`}>
                                <thead>
                                    <tr className={`${vml['table-header']}`}>
                                        <th onClick={() => sortData('id')}>
                                            <div className={`${vml['table-label']}`}>
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
                                        </th>
                                        <th>
                                            <div className={`${vml['table-label']}`}>
                                                <span>
                                                    Serial Number
                                                </span>
                                            </div>
                                        </th>
                                        <th onClick={() => sortData('createdBy')}>
                                            <div className={`${vml['table-label']}`}>
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
                                            <div className={`${vml['table-label']}`}>
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
                                        <th onClick={() => sortData('accuracyClass')}>
                                            <div className={`${vml['table-label']}`}>
                                                <span>
                                                    Cấp chính xác
                                                </span>
                                                {sortConfig && sortConfig.key === 'accuracyClass' && sortConfig.direction === 'asc' && (
                                                    <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                )}
                                                {sortConfig && sortConfig.key === 'accuracyClass' && sortConfig.direction === 'desc' && (
                                                    <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                )}
                                            </div>
                                        </th>
                                        <th onClick={() => sortData('status')}>
                                            <div className={`${vml['table-label']}`}>
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
                                            <div className={`${vml['table-label']}`}>
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
                                            <td>{item.id}</td>
                                            <td>{item.serialNumber}</td>
                                            <td>{item.createdBy}</td>
                                            <td>{item.type}</td>
                                            <td>{item.accuracyClass}</td>
                                            <td>{item.status.split(',').map((s: string) => statusOptions.find(option => option.value === s)?.label).join(', ')}</td>
                                            <td>{item.updatedAt}</td>
                                            <td>
                                                <div className={`${vml['action']}`}>
                                                    <Link href={path + "/detail/" + item.id} className={`btn m-0 p-0`}>
                                                        <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                                    </Link>
                                                    <button type="button" className={`btn m-0 p-0`}>
                                                        <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                                    </button>
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
        </LocalizationProvider>
    )
}