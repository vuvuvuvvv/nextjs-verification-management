"use client"

import { useEffect, useReducer, useCallback, useRef, useMemo } from "react";
import c_vfml from "@styles/scss/components/verification-management-layout.module.scss";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import { viVN } from "@mui/x-date-pickers/locales";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faEye, faSearch, faRefresh } from "@fortawesome/free-solid-svg-icons";
import React from "react";

import Select, { GroupBase } from 'react-select';
import Pagination from "@/components/Pagination";
import { PDMData, PDMFilterParameters } from "@/lib/types";

import Link from "next/link";

import { pdmStatusOptions, limitOptions, ACCESS_LINKS } from "@/lib/system-constant";
import { getPDMByFilter } from "@lib/api/pdm";
import Swal from "sweetalert2";
import { useUser } from "@/context/AppContext";

const Loading = React.lazy(() => import("@/components/Loading"));

interface PDMManagementProps {
    className?: string,
    listDHNamesExist?: string[]
}

type State = {
    data: PDMData[];
    loading: boolean;
    sortConfig: { key: string, direction: 'asc' | 'desc' | 'default' } | null;
    selectedStatus: string;
    selectedTenDHOption: string;
    limit: number;
    error: string;
    DHNameOptions: { value: string, label: string }[];
    currentPage: number;
    totalRecords: number;
    totalPage: number;
    filterForm: PDMFilterParameters;
};

type Action =
    | { type: 'SET_DATA', payload: PDMData[] }
    | { type: 'SET_LOADING', payload: boolean }
    | { type: 'SET_SORT_CONFIG', payload: { key: string, direction: 'asc' | 'desc' | 'default' } | null }
    | { type: 'SET_SELECTED_STATUS', payload: string }
    | { type: 'SET_SELECTED_TEN_DH_OPTION', payload: string }
    | { type: 'SET_LIMIT', payload: number }
    | { type: 'SET_ERROR', payload: string }
    | { type: 'SET_DH_NAME_OPTIONS', payload: { value: string, label: string }[] }
    | { type: 'SET_CURRENT_PAGE', payload: number }
    | { type: 'SET_TOTAL_RECORDS', payload: number }
    | { type: 'SET_TOTAL_PAGE', payload: number }
    | { type: 'SET_FILTER_FORM', payload: PDMFilterParameters }
    | { type: 'SET_FIELD', field: keyof State, value: any }
    | { type: 'SET_MULTIPLE_FIELDS', fields: Partial<State> };

const initialState: State = {
    data: [],
    loading: false,
    sortConfig: null,
    selectedStatus: '',
    selectedTenDHOption: '',
    limit: 10,
    error: '',
    DHNameOptions: [],
    currentPage: 1,
    totalRecords: 0,
    totalPage: 1,
    filterForm: {
        ten_dong_ho: "",
        so_qd_pdm: "",
        tinh_trang: "",
        ngay_qd_pdm_from: null,
        ngay_qd_pdm_to: null,
        dn: "",
        limit: 10,
        last_seen: ""
    }
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, data: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_SORT_CONFIG':
            return { ...state, sortConfig: action.payload };
        case 'SET_SELECTED_STATUS':
            return { ...state, selectedStatus: action.payload };
        case 'SET_SELECTED_TEN_DH_OPTION':
            return { ...state, selectedTenDHOption: action.payload };
        case 'SET_LIMIT':
            return { ...state, limit: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_DH_NAME_OPTIONS':
            return { ...state, DHNameOptions: action.payload };
        case 'SET_CURRENT_PAGE':
            return { ...state, currentPage: action.payload };
        case 'SET_TOTAL_RECORDS':
            return { ...state, totalRecords: action.payload };
        case 'SET_TOTAL_PAGE':
            return { ...state, totalPage: action.payload };
        case 'SET_FILTER_FORM':
            return { ...state, filterForm: action.payload };
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'SET_MULTIPLE_FIELDS':
            return { ...state, ...action.fields };
        default:
            return state;
    }
}

export default React.memo(function PDMManagement({ className, listDHNamesExist }: PDMManagementProps) {
    const { permissions } = useUser();
    const [state, dispatch] = useReducer(reducer, initialState);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (state.error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: state.error,
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
                dispatch({ type: 'SET_ERROR', payload: "" });
            });
        }
    }, [state.error]);

    useEffect(() => {
        if (listDHNamesExist && listDHNamesExist.length > 0) {
            const options = listDHNamesExist.filter(name => name && name.trim() !== "")
                .map((name) => ({ value: name, label: name }));
            dispatch({ type: 'SET_DH_NAME_OPTIONS', payload: options });
        }
    }, [listDHNamesExist]);

    const _fetchPDM = useCallback(async (filterFormProps?: PDMFilterParameters) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await getPDMByFilter(filterFormProps ? filterFormProps : state.filterForm);
            if (res.status === 200 || res.status === 201) {

                dispatch({ type: 'SET_MULTIPLE_FIELDS', fields: {
                    data: res.data.data || [],
                    totalPage: res.data.total_page || 1,
                    totalRecords: res.data.total_records || 0
                } });

                if (filterFormProps) {
                    dispatch({ type: 'SET_FILTER_FORM', payload: filterFormProps });
                }
            } else {
                console.error(res.msg);
                dispatch({ type: 'SET_ERROR', payload: "Có lỗi đã xảy ra!" });
            }
        } catch (error) {
            console.error('Error fetching PDM data:', error);
            dispatch({ type: 'SET_ERROR', payload: "Có lỗi đã xảy ra!" });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [state.filterForm]);

    useEffect(() => {
        if (!fetchedRef.current) {
            _fetchPDM();
            fetchedRef.current = true;
        }
    })

    const handleFilterChange = (key: keyof PDMFilterParameters, value: any) => {
        dispatch({
            type: 'SET_FILTER_FORM',
            payload: { ...state.filterForm, [key]: value }
        });
    };

    const handleResetFilter = () => {
        const blankFilterForm: PDMFilterParameters = {
            ten_dong_ho: "",
            so_qd_pdm: "",
            ngay_qd_pdm_from: null,
            ngay_qd_pdm_to: null,
            tinh_trang: "",
            dn: "",
            limit: state.limit,
            last_seen: ""
        };
        _fetchPDM(blankFilterForm);
        dispatch({type: "SET_MULTIPLE_FIELDS", fields: {
            selectedTenDHOption: "",
            currentPage: 1
        }})
    };

    const handleSearch = () => {
        dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
        _fetchPDM({ ...state.filterForm, last_seen: "", next_from: "", prev_from: "" });
    };

    const handlePageChange = (newPage: number) => {
        if (state.currentPage > newPage) {
            const newFilterForm: PDMFilterParameters = {
                ...state.filterForm,
                last_seen: "",
                prev_from: state.data && state.data[0].id ? String(state.data[0].id) : "",
                next_from: ""
            };
            _fetchPDM(newFilterForm);
        } else if (state.currentPage < newPage) {
            const newFilterForm: PDMFilterParameters = {
                ...state.filterForm,
                last_seen: "",
                prev_from: "",
                next_from: state.data && state.data[state.data.length - 1].id ? String(state.data[state.data.length - 1].id) : ""
            };
            _fetchPDM(newFilterForm);
        }
        dispatch({ type: 'SET_CURRENT_PAGE', payload: newPage });
    };

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

                            {/* <div className="col-12 mb-3 col-md-6 col-xl-4 d-flex">
                                <label className={`${c_vfml['form-label']}`} htmlFor="ten_dong_ho">
                                    Tên đồng hồ
                                    <Select
                                        options={state.DHNameOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select mt-2"
                                        placeholder="Tên đồng hồ"
                                        classNamePrefix="select"
                                        isClearable
                                        id="ten_dong_ho"
                                        value={state.DHNameOptions.find(option => option.value === state.selectedTenDHOption)}
                                        isSearchable
                                        onChange={(selectedOption: any) => {
                                            if (selectedOption) {
                                                const value = selectedOption.value;
                                                dispatch({ type: 'SET_SELECTED_TEN_DH_OPTION', payload: value });
                                                handleFilterChange('ten_dong_ho', value);
                                            } else {
                                                dispatch({ type: 'SET_SELECTED_TEN_DH_OPTION', payload: '' });
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
                                                display: state.DHNameOptions.length === 0 ? "none" : "flex",
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                display: state.DHNameOptions.length === 0 ? "none" : "",
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
                            </div> */}

                            {/* <div className="col-12 mb-3 col-md-6 col-xl-4 d-flex">
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
                            </div> */}

                            <div className="col-12 mb-3 col-md-6 col-xl-4">
                                <label className={`${c_vfml['form-label']}`} htmlFor="sensor">
                                    Sensor:
                                    <input
                                        type="text"
                                        id="sensor"
                                        className="form-control"
                                        placeholder="Nhập sensor"
                                        value={state.filterForm.sensor || ""}
                                        onChange={(e) => handleFilterChange('sensor', e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="col-12 mb-3 col-md-6 col-xl-4">
                                <label className={`${c_vfml['form-label']}`} htmlFor="transmitter">
                                    Transmitter:
                                    <input
                                        type="text"
                                        id="transmitter"
                                        className="form-control"
                                        placeholder="Nhập transmitter"
                                        value={state.filterForm.transmitter || ""}
                                        onChange={(e) => handleFilterChange('transmitter', e.target.value)}
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
                                        placeholder="Nhập số quyết định"
                                        value={state.filterForm.so_qd_pdm || ""}
                                        onChange={(e) => handleFilterChange('so_qd_pdm', e.target.value)}
                                    />
                                </label>
                            </div>

                            <div className="col-12 mb-3 col-md-6 col-xl-4 d-flex">
                                <label className={`${c_vfml['form-label']}`} htmlFor="ma_tim_dong_ho_pdm">
                                    DN:
                                    <input
                                        type="text"
                                        id="ma_tim_dong_ho_pdm"
                                        className="form-control"
                                        placeholder="Nhập mã tìm đồng hồ"
                                        value={state.filterForm.dn || ""}
                                        onChange={(e) => handleFilterChange('dn', e.target.value)}
                                    />
                                </label>
                            </div>


                            {/* <div className="col-12 mb-3 col-md-6 col-xl-4">
                                <label className={`${c_vfml['form-label']}`}>
                                    Trạng thái:
                                    <Select
                                        // isMulti
                                        name="status"
                                        options={pdmStatusOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        isClearable
                                        value={state.selectedStatus}
                                        onChange={(selectedOptions: any) => {
                                            if (selectedOptions) {
                                                // const values = selectedOptions.map((option: { value: string }) => option.value);
                                                const values = selectedOptions.value;

                                                dispatch({ type: 'SET_SELECTED_STATUS', payload: values });
                                                handleFilterChange('tinh_trang', values);
                                            } else {
                                                dispatch({ type: 'SET_SELECTED_STATUS', payload: '' });
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

                            {/* <div className="col-12 mb-3 col-md-6 col-xl-4">
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
                                    Ngày quyết định PDM:
                                </label>
                                <div className={`col-12 row m-0 mt-2 p-0 ${c_vfml['pick-created-date']}`}>
                                    <div className={`col-12 col-md-6 mb-3 mb-md-0 ${c_vfml['picker-field']}`}>
                                        <label>Từ:</label>

                                        <DatePicker
                                            className={`${c_vfml['date-picker']}`}
                                            value={state.filterForm.ngay_qd_pdm_from ? dayjs(state.filterForm.ngay_qd_pdm_from) : null}
                                            format="DD-MM-YYYY"

                                            onChange={(newValue: Dayjs | null) => handleFilterChange('ngay_qd_pdm_from', newValue ? newValue.format("YYYY-MM-DD HH:mm:ss") : null)}
                                            slotProps={{ textField: { fullWidth: true } }}
                                            maxDate={state.filterForm.ngay_qd_pdm_to ? dayjs(state.filterForm.ngay_qd_pdm_to).subtract(1, 'day') : dayjs().endOf('day').subtract(1, 'day')}
                                        />
                                    </div>

                                    <div className={`col-12 col-md-6 ${c_vfml['picker-field']}`}>
                                        <label>Đến:</label>
                                        <DatePicker
                                            className={`${c_vfml['date-picker']}`}
                                            value={state.filterForm.ngay_qd_pdm_to ? dayjs(state.filterForm.ngay_qd_pdm_to) : undefined}
                                            format="DD-MM-YYYY"
                                            minDate={state.filterForm.ngay_qd_pdm_from ? dayjs(state.filterForm.ngay_qd_pdm_from).add(1, 'day') : undefined}

                                            maxDate={dayjs().endOf('day')}
                                            onChange={(newValue: Dayjs | null) => handleFilterChange('ngay_qd_pdm_to', newValue ? newValue.format("YYYY-MM-DD HH:mm:ss") : null)}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={`col-12 m-0 my-2 d-flex align-items-center justify-content-between`}>
                                <div className="d-flex gap-2">
                                    <button aria-label="Tìm kiếm" type="button" className={`btn bg-main-blue text-white`} onClick={handleSearch}>
                                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon> Tìm
                                    </button>
                                    <button aria-label="Làm mới" type="button" className={`btn bg-grey text-white`} onClick={handleResetFilter}>
                                        <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon>
                                    </button>
                                </div>
                                {!permissions.CAN_VIEW && <Link
                                    aria-label="Thêm mới"
                                    href={ACCESS_LINKS.PDM_ADD.src}
                                    className={`btn bg-main-green text-white`}
                                >
                                    Thêm mới
                                </Link>}

                            </div>
                        </div>
                    </div>

                    <div className="bg-white w-100 shadow-sm rounded position-relative overflow-hidden">
                        {state.loading && <Loading />}
                        <div className={`m-0 p-0 w-100 w-100 mt-4 bg-white position-relative ${c_vfml['wrap-process-table']}`}>
                            {state.data && state.data.length > 0 ? (
                                <table className={`table table-striped table-bordered table-hover ${c_vfml['process-table']}`}>
                                    <thead>
                                        <tr className={`${c_vfml['table-header']}`}>
                                            {/* <th onClick={() => sortData('id')}>
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
                                            </th> */}
                                            <th>
                                                ID
                                            </th>
                                            <th>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Tên đồng hồ
                                                    </span>
                                                </div>
                                            </th>
                                            <th>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        DN
                                                    </span>
                                                    {state.sortConfig && state.sortConfig.key === 'dn' && state.sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                    {state.sortConfig && state.sortConfig.key === 'dn' && state.sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        CCX
                                                    </span>
                                                    {state.sortConfig && state.sortConfig.key === 'ccx' && state.sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                    {state.sortConfig && state.sortConfig.key === 'ccx' && state.sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Kiểu Sensor
                                                    </span>
                                                </div>
                                            </th>
                                            <th>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Transmitter
                                                    </span>
                                                </div>
                                            </th>
                                            <th>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Q
                                                    </span>
                                                </div>
                                            </th>
                                            <th>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>R
                                                    </span>
                                                    {state.sortConfig && state.sortConfig.key === 'r' && state.sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                    {state.sortConfig && state.sortConfig.key === 'r' && state.sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                            // onClick={() => sortData('createdBy')}
                                            >
                                                {/* <div className={`${c_vfml['table-label']}`}>
                                                    <span> */}
                                                Số QĐ-PDM
                                                {/* </span>
                                                    {state.sortConfig && state.sortConfig.key === 'createdBy' && state.sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                    {state.sortConfig && state.sortConfig.key === 'createdBy' && state.sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                </div> */}
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
                                                {state.sortConfig && state.sortConfig.key === 'updatedAt' && state.sortConfig.direction === 'asc' && (
                                                    <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                )}
                                                {state.sortConfig && state.sortConfig.key === 'updatedAt' && state.sortConfig.direction === 'desc' && (
                                                    <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                )}
                                            </div>
                                        </th> */}
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {state.data.map((item, index) => (
                                            <tr key={index}
                                                onClick={() => window.open(`${ACCESS_LINKS.PDM_DETAIL.src}/${item.id}`, '_blank')}
                                                style={{ cursor: 'pointer' }} >
                                                {/* <td className="text-center">{data.indexOf(item) + 1}</td> */}
                                                <td className="text-center">{item.id}</td>
                                                <td>{item.ten_dong_ho}</td>
                                                <td>{item.dn}</td>
                                                <td>{item.ccx}</td>
                                                <td>{item.sensor}</td>
                                                <td>{item.transmitter}</td>
                                                <td>{item.q3 ? <>Q<sub>III</sub>= {item.q3}</> : <>Q<sub>n</sub>= {item.qn}</>}</td>
                                                <td>{item.r}</td>
                                                <td>{item.so_qd_pdm}-{dayjs(item.ngay_qd_pdm).format('YYYY')}</td>
                                                <td>
                                                    {new Date(item.ngay_het_han) > new Date() ? 'Còn hiệu lực' : 'Hết hạn'}
                                                </td>
                                                <td>
                                                    <Link target="_blank" aria-label="Xem chi tiết" href={ACCESS_LINKS.PDM_DETAIL.src + "/" + item.id} className={`btn border-0 shadow-0 w-100 text-blue`}>
                                                        <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center py-3 m-0 w-100">Không có dữ liệu</p>
                            )}
                        </div>
                        <div className="w-100 m-0 p-3 d-flex align-items-center justify-content-center">
                            <Pagination currentPage={state.currentPage} totalPage={state.totalPage} totalRecords={state.totalRecords} handlePageChange={handlePageChange}></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </LocalizationProvider>
    )
});