"use client"

import { useEffect, useState, useCallback, Suspense } from "react";
import c_vfml from "@styles/scss/components/verification-management-layout.module.scss"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import React from "react";

import Select, { GroupBase } from 'react-select';
import Pagination from "@/components/pagination";
import { User } from "@lib/types";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { limitOptions, statusOptions } from "@lib/system-constant";

const Loading = React.lazy(() => import("@/components/loading"));

interface UserManagementProps {
    data: User[],
    className?: string,
}

interface FilterForm {
    id: string;
    fullname: string;
    status: string[];
}

export default function UserManagement({ data, className }: UserManagementProps) {
    const [rootData, setRootData] = useState(data);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | 'default' } | null>(null);
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [limit, setLimit] = useState(5);

    const path = usePathname();

    const [filterForm, setFilterForm] = useState<FilterForm>({
        id: "",
        fullname: "",
        status: [],
    });
    const [currentPage, setCurrentPage] = useState(1);

    const resetTotalPage = () => {
        setCurrentPage(1);
        if (rootData.length == limit) {
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
                return direction === 'asc'
                    ? a[key as keyof typeof a] < b[key as keyof typeof a] ? -1 : 1
                    : a[key as keyof typeof a] > b[key as keyof typeof a] ? -1 : 1;
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

            if (filterForm.id) {
                filteredData = filteredData.filter(item => {
                    const keywords = filterForm.id.toLowerCase().replace(/[^\d]/g, '').split(' ').filter(Boolean);
                    const itemId = item.id;
                    return keywords.some(keyword => itemId.toString().includes(keyword));
                });
            }

            if (filterForm.fullname) {
                filteredData = filteredData.filter(item => {
                    const keywords = filterForm.fullname.toLowerCase().split(' ').filter(Boolean);
                    const itemFullname = item.fullname.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');
                    return keywords.some(keyword => itemFullname.includes(keyword));
                });
            }

            if (filterForm.status.length > 0) {
                filteredData = filteredData.filter(item => {
                    const itemStatus = item.status ? item.status.split(',') : [];
                    return filterForm.status.every(s => itemStatus.includes(s));
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
            id: "",
            fullname: "",
            status: [],
        });
        setSelectedStatus([]);
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const paginatedData = rootData.slice((currentPage - 1) * limit, currentPage * limit);

    return (
        <div className={`${className ? className : ""} m-0 mb-3 w-100`}>
            <div className={`${c_vfml['wraper']} pb-3 w-100`}>

                <div className="bg-white w-100 shadow-sm mb-3 rounded pb-2 pt-4">
                    <div className={`row m-0 px-md-3 w-100 mb-3 ${c_vfml['search-process']}`}>
                        <div className="col-12 mb-3 col-md-6 col-xl-4 d-flex">
                            <label className={`${c_vfml['form-label']}`} htmlFor="id">
                                ID:
                                <input
                                    type="text"
                                    id="id"
                                    className="form-control"
                                    placeholder="Nhập ID"
                                    value={filterForm.id}
                                    onChange={(e) => handleFilterChange('id', e.target.value)}
                                />
                            </label>
                        </div>
                        <div className="col-12 mb-3 col-md-6 col-xl-4">
                            <label className={`${c_vfml['form-label']}`} htmlFor="fullname">
                                Tên đầy đủ:
                                <input
                                    type="text"
                                    id="fullname"
                                    className="form-control"
                                    placeholder="Nhập tên đầy đủ"
                                    value={filterForm.fullname}
                                    onChange={(e) => handleFilterChange('fullname', e.target.value)}
                                />
                            </label>
                        </div>

                        <div className="col-12 mb-3 col-md-6 col-xl-4">
                            <label className={`${c_vfml['form-label']}`} htmlFor="status">
                                Trạng thái
                                <Select
                                    isMulti
                                    name="status"
                                    options={statusOptions as unknown as readonly GroupBase<never>[]}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
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
                                        indicatorsContainer: (provided) => ({
                                            ...provided,
                                            height: '42px'
                                        })
                                    }}
                                />
                            </label>
                        </div>

                        <div className={`col-12 m-0 my-2 d-flex align-items-center justify-content-between`}>
                            <button type="button" className={`btn p-2 px-3 bg-main-blue text-white`} onClick={hanldeResetFilter}>
                                Xóa bộ lọc
                            </button>
                            <Link
                                href={path + "/new-process"}
                                className="btn p-2 px-3 bg-main-green text-white"
                            >
                                Thêm nhóm
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
                                        <th onClick={() => sortData('id')}>
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
                                        </th>
                                        <th onClick={() => sortData('fullname')}>
                                            <div className={`${c_vfml['table-label']}`}>
                                                <span>
                                                    Tên đầy đủ
                                                </span>
                                                {sortConfig && sortConfig.key === 'fullname' && sortConfig.direction === 'asc' && (
                                                    <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                )}
                                                {sortConfig && sortConfig.key === 'fullname' && sortConfig.direction === 'desc' && (
                                                    <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                )}
                                            </div>
                                        </th>
                                        <th onClick={() => sortData('email')}>
                                            <div className={`${c_vfml['table-label']}`}>
                                                <span>Email
                                                </span>
                                                {sortConfig && sortConfig.key === 'email' && sortConfig.direction === 'asc' && (
                                                    <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                )}
                                                {sortConfig && sortConfig.key === 'email' && sortConfig.direction === 'desc' && (
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
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td>{item.fullname}</td>
                                            <td>{item.email}</td>
                                            <td>{item.status?.split(',').map((s: string) => statusOptions.find(option => option.value === s)?.label).join(', ')}</td>
                                            <td>
                                                <div className={`dropdown ${c_vfml['action']}`}>
                                                    <button className={`${c_vfml['action-button']}`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <FontAwesomeIcon icon={faEllipsisH}></FontAwesomeIcon>
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <Link href={path + "/detail/" + item.id} className={`btn w-100`}>
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
    )
}