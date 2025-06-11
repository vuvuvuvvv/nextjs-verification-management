"use client"

import { useEffect, useState, useRef } from "react";
import c_vfml from "@styles/scss/components/verification-management-layout.module.scss";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import { viVN } from "@mui/x-date-pickers/locales";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSearch, faRefresh, faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { PhongBan, PhongBanFilterParameters } from "@/lib/types";

import Pagination from "@/components/Pagination";
import Link from "next/link";

import {
    ACCESS_LINKS,
} from "@/lib/system-constant";
import Swal from "sweetalert2";
import { getAllPhongBanByFilter } from "@lib/api/phongban";
import { useUser } from "@/context/AppContext";
import { Modal } from "react-bootstrap";
import ModalAddPhongBan from "./ModalAddPhongBan";

const Loading = React.lazy(() => import("@/components/Loading"));


interface PhongBanMngProps {
    className?: string,
}

export default function PhongBanMng({ className }: PhongBanMngProps) {
    const [data, setRootData] = useState<PhongBan[]>([]);
    const rootData = useRef<PhongBan[]>([]);
    const [filterLoading, setFilterLoading] = useState(true);
    const [limit, setLimit] = useState(10);
    const [error, setError] = useState("");
    const fetchedRef = useRef(false);
    // const perSelected = useRef<DongHoPermission | null>(null);
    const [isShow, setIsShow] = useState<boolean | null>(null);

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

    // const path = usePathname();

    const [filterForm, setFilterForm] = useState<PhongBanFilterParameters>({
        ten_phong_ban: "",
        truong_phong: "",
        ngay_tao_from: null,
        ngay_tao_to: null,
        limit: limit,
        last_seen: "",
    });
    const [currentPage, setCurrentPage] = useState(1);

    const [totalRecords, setTotalRecords] = useState(0);
    const totalRecordsRef = useRef(totalRecords);
    const [totalPage, setTotalPage] = useState(1);
    const totalPageRef = useRef(totalPage);

    const _fetchPhongban = async (filterFormProps?: PhongBanFilterParameters) => {
        setFilterLoading(true);

        try {
            const res = await getAllPhongBanByFilter(filterFormProps ? filterFormProps : filterForm);
            if (res.status === 200 || res.status === 201) {
                // Ensure the data matches the PhongBan[] type
                const phongBanList: PhongBan[] = Array.isArray(res.data?.data)
                    ? res.data.data.map((item: any) => ({
                        id: item.id,
                        ten_phong_ban: item.ten_phong_ban,
                        truong_phong: item.truong_phong,
                        members: item.members,
                        ngay_tao: item.ngay_tao,
                        // add other properties as needed
                        ...item
                    }))
                    : [];
                setRootData(phongBanList);
                if (totalPageRef.current != res.data?.total_page) {
                    setTotalPage(res.data?.total_page || 1)
                    totalPageRef.current = res.data?.total_page || 1;
                }
                if (totalRecordsRef.current != res.data?.total_records) {
                    setTotalRecords(res.data?.total_records || 0)
                    totalRecordsRef.current = res.data?.total_records || 0;
                }
                if (filterFormProps) {
                    setFilterForm(filterFormProps);
                }
                rootData.current = phongBanList;
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
    }

    useEffect(() => {
        if (!fetchedRef.current) {
            _fetchPhongban();
            fetchedRef.current = true;
        }
    }, []);

    const handleFilterChange = (key: keyof PhongBanFilterParameters, value: any) => {
        setFilterForm(prevForm => ({
            ...prevForm,
            [key]: value
        }));
    };

    const handleResetFilter = () => {
        const blankFilterForm: PhongBanFilterParameters = {
            ten_phong_ban: "",
            truong_phong: "",
            ngay_tao_from: null,
            ngay_tao_to: null,
            last_seen: "",
            next_from: "",
            prev_from: "",
            limit: limit
        };
        _fetchPhongban(blankFilterForm);
        setCurrentPage(1);
    }

    const handleCloseModal = () => {
        setIsShow(false);
        _fetchPhongban(filterForm)
    }

    const handleSearch = () => {
        setCurrentPage(1);
        _fetchPhongban({ ...filterForm, last_seen: "", next_from: "", prev_from: "" })
    }

    const handlePageChange = (newPage: number) => {
        if (currentPage > newPage) {
            const newFilterForm: PhongBanFilterParameters = {
                ...filterForm,
                last_seen: "",
                prev_from: data && data[0].id ? String(data[0].id) || "" : "",
                next_from: ""
            }
            _fetchPhongban(newFilterForm);
        } else if (currentPage < newPage) {
            const newFilterForm: PhongBanFilterParameters = {
                ...filterForm,
                last_seen: "",
                prev_from: "",
                next_from: data[data.length - 1] && data[data.length - 1].id ? data[data.length - 1].id.toString() || "" : ""
            }
            _fetchPhongban(newFilterForm);
        }
        setCurrentPage(newPage);
    };

    const paginatedData = data || [];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            <ModalAddPhongBan show={isShow} handleClose={handleCloseModal} />
            <div className={`${className ? className : ""} p-3 m-0 w-100`}>
                <div className={`${c_vfml['wraper']} w-100`}>

                    <div className="bg-white w-100 shadow-sm mb-2 rounded pt-3 pb-1">
                        <div className={`row m-0 px-md-3 w-100 mb-3 ${c_vfml['search-process']}`}>

                            <div className="col-12 col-xl-8 row m-0 p-0">
                                <div className="col-12 mb-3 col-md-6">
                                    <label className={`${c_vfml['form-label']}`} htmlFor="kieu_moden">
                                        Tên phòng ban:
                                        <input
                                            type="text"
                                            id="kieu_moden"
                                            className="form-control"
                                            placeholder="Nhập tên khách hàng"
                                            value={filterForm.ten_phong_ban ?? ""}
                                            onChange={(e) => handleFilterChange('ten_phong_ban', e.target.value)}
                                        />
                                    </label>
                                </div>
                                <div className="col-12 mb-3 col-md-6 d-flex">
                                    <label className={`${c_vfml['form-label']}`} htmlFor="so_giay_chung_nhan">
                                        Tên trưởng phòng:
                                        <input
                                            type="text"
                                            id="truong_phong"
                                            className="form-control"
                                            placeholder="Nhập số giấy"
                                            value={filterForm.truong_phong ?? ""}
                                            onChange={(e) => handleFilterChange('truong_phong', e.target.value)}
                                        />
                                    </label>
                                </div>

                                <div className={`col-12 mb-3 m-0 row p-0 ${c_vfml['search-created-date']}`}>
                                    <label className={`${c_vfml['form-label']} col-12`}>
                                        Ngày tạo:
                                    </label>
                                    <div className={`col-12 row m-0 mt-2 p-0 ${c_vfml['pick-created-date']}`}>
                                        <div className={`col-12 col-md-6 mb-3 mb-md-0 ${c_vfml['picker-field']}`}>
                                            <label>Từ:</label>

                                            <DatePicker
                                                className={`${c_vfml['date-picker']}`}
                                                value={filterForm.ngay_tao_from ? dayjs(filterForm.ngay_tao_from) : null}
                                                format="DD-MM-YYYY"

                                                onChange={(newValue: Dayjs | null) => handleFilterChange('ngay_tao_from', newValue ? newValue.toDate() : null)}
                                                slotProps={{ textField: { fullWidth: true } }}
                                                maxDate={filterForm.ngay_tao_to ? dayjs(filterForm.ngay_tao_to).subtract(1, 'day') : dayjs().endOf('day').subtract(1, 'day')}
                                            />
                                        </div>

                                        <div className={`col-12 col-md-6 ${c_vfml['picker-field']}`}>
                                            <label>Đến:</label>
                                            <DatePicker
                                                className={`${c_vfml['date-picker']}`}
                                                value={filterForm.ngay_tao_to ? dayjs(filterForm.ngay_tao_to) : undefined}
                                                format="DD-MM-YYYY"
                                                minDate={filterForm.ngay_tao_from ? dayjs(filterForm.ngay_tao_from).add(1, 'day') : undefined}

                                                maxDate={dayjs().endOf('day')}
                                                onChange={(newValue: Dayjs | null) => handleFilterChange('ngay_tao_to', newValue ? newValue.toDate() : undefined)}
                                                slotProps={{ textField: { fullWidth: true } }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-xl-4 m-0 py-0 pt-lg-4 align-items-start pb-2 m-0 my-2 d-flex gap-2">
                                <div className="d-flex gap-2">
                                    <button aria-label="Tìm kiếm" type="button" className={`btn bg-main-blue text-white`} onClick={handleSearch}>
                                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon> Tìm
                                    </button>
                                    <button aria-label="Làm mới" type="button" className={`btn bg-grey text-white`} onClick={handleResetFilter}>
                                        <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon>
                                    </button>
                                </div>
                                <button
                                    style={{ minHeight: "42px" }}
                                    className="btn bg-main-green text-white"
                                    onClick={() => {
                                        setIsShow(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus} className="me-2"></FontAwesomeIcon>
                                    Thêm mới
                                </button>
                            </div>
                        </div>


                    </div>
                </div>

                <div className={`bg-white w-100 shadow-sm position-relative rounded overflow-hidden ${c_vfml['wraper']}`}>
                    {filterLoading && <Loading />}
                    <div className={`m-0 p-0 w-100 w-100 position-relative ${c_vfml['wrap-process-table']}`}>
                        {data && data.length > 0 ? (
                            <table className={`table table-striped table-bordered table-hover ${c_vfml['process-table']}`}>
                                <thead>
                                    <tr className={`${c_vfml['table-header']}`}>
                                        <th className="text-center">
                                            ID
                                        </th>

                                        <th>
                                            <div>
                                                <span>Tên phòng ban</span>
                                            </div>
                                        </th>
                                        <th>
                                            <div>
                                                <span>
                                                    Trưởng phòng ban
                                                </span>
                                            </div>
                                        </th>
                                        <th>
                                            <div>
                                                <span>
                                                    Số lượng nhân viên
                                                </span>
                                            </div>
                                        </th>
                                        <th>
                                            <div>
                                                <span>
                                                    Ngày tạo
                                                </span>
                                            </div>
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((phongBan, index) => {
                                        const redirectLink = `${ACCESS_LINKS.PB_DHN_DETAIL.src}/${phongBan.id}`;

                                        return (
                                            <tr
                                                key={index}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td className="text-center">{phongBan.id || ""}</td>

                                                <td>{phongBan.ten_phong_ban ?? ""}</td>
                                                <td>{phongBan.truong_phong?.fullname ?? ""}</td>
                                                <td>{phongBan.members?.length ?? ""}</td>
                                                <td>{dayjs(phongBan.ngay_tao).format('DD-MM-YYYY')}</td>
                                                <td style={{ width: "90px" }}>
                                                    <div className="w-100 m-0 p-0 d-flex align-items-center justify-content-center">
                                                        <Link aria-label="Xem" href={redirectLink} target="_blank" className={`btn p-1 w-100 text-blue shadow-0`}>
                                                            <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                                        </Link>
                                                        {/* <Link aria-label="Chỉnh sửa" href={ACCESS_LINKS.DHN_EDIT_DH.src + "/" + phongBan.id} className={`btn p-1 w-100 text-blue shadow-0`}>
                                                            <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                                                        </Link> */}
                                                    </div>
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
                        <Pagination currentPage={currentPage} totalPage={totalPage} totalRecords={totalRecords} handlePageChange={handlePageChange}></Pagination>
                    </div>
                </div>
            </div>
        </LocalizationProvider >
    )
}