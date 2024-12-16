"use client"

import { useEffect, useState, useCallback, useRef } from "react";
import c_vfml from "@styles/scss/components/verification-management-layout.module.scss";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { viVN } from "@mui/x-date-pickers/locales";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronDown, faChevronUp, faTrash, faUserEdit } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { DongHo, DongHoPermission, User } from "@lib/types";

import Swal from "sweetalert2";
import { deleteDongHoPermission, getUserPermissionWithDongHo } from "@/app/api/dongho/route";
import { getAvailableRolesOptions, getFullSoGiayCN, getNameOfRole } from "@lib/system-function";
import Select, { GroupBase } from 'react-select';
import { useUser } from "@/context/AppContext";

const Loading = React.lazy(() => import("@/components/Loading"));
const NavTab = React.lazy(() => import("@/components/ui/NavTab"));
const ModalDongHoPermissionMng = React.lazy(() => import("@/components/ui/ModalDongHoPermissionMng"));


interface DongHoPermissionsManagementProps {
    className?: string,
    dongHoSelected: DongHo | null;
    setSelectedDongHo?: React.Dispatch<React.SetStateAction<DongHo | null>>;
}

interface DongHoPermissionsFilterForm {
    username: "",
    fullname: "",
    email: "",
    role: "",
}

interface DongHoPermissionsFilterForm {
    username: "",
    fullname: "",
    email: "",
    role: "",
}

export default function DongHoPermissionsManagement({ className, dongHoSelected, setSelectedDongHo }: DongHoPermissionsManagementProps) {
    const { isSuperAdmin, getCurrentRole } = useUser();
    const [data, setRootData] = useState<DongHoPermission[]>([]);
    const rootData = useRef<DongHoPermission[]>([]);
    const [filterLoading, setFilterLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | 'default' } | null>(null);
    const [error, setError] = useState("");
    const [selectedRoleOption, setSelectedRoleOption] = useState('');
    const dongHoSelectedPrev = useRef<DongHo | null>(null);
    const isEditing = useRef<boolean>(false);
    const perSelected = useRef<DongHoPermission | null>(null);
    const [isShow, setIsShow] = useState<boolean | null>(null);

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

    const [filterForm, setFilterForm] = useState<DongHoPermissionsFilterForm>({
        username: "",
        fullname: "",
        email: "",
        role: "",
    });

    const getUserPermissions = async (dongHo: DongHo) => {
        setFilterLoading(true);
        try {
            const res = await getUserPermissionWithDongHo(dongHo);
            if (res.status === 200 || res.status === 201) {
                const resData = res.data as { id: string, role: string, user: User }[];
                const tmpData = resData.map(p_data => ({
                    id: p_data?.id || "",
                    role: p_data?.role,
                    fullname: p_data?.user.fullname,
                    username: p_data?.user.username,
                    email: p_data?.user.email
                }))

                setRootData(tmpData);
                rootData.current = tmpData;
            } else {
                setError("Có lỗi đã xảy ra!");
            }
        } catch (error) {
            setError("Có lỗi đã xảy ra!");
        } finally {
            setFilterLoading(false);
        }
    }

    useEffect(() => {
        if (dongHoSelected) {
            if (dongHoSelectedPrev.current != dongHoSelected) {
                getUserPermissions(dongHoSelected);
                dongHoSelectedPrev.current = dongHoSelected;
            } else {
                setRootData(rootData.current);
            }
        }
    }, [dongHoSelected]);

    const sortData = useCallback((key: keyof DongHoPermissionsFilterForm) => {
        if (!filterLoading) {
            setFilterLoading(true);
            let direction: 'asc' | 'desc' = 'asc';

            if (sortConfig && sortConfig.key === key) {
                direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
            }

            const sortedData = rootData.current ? [...rootData.current].sort((a, b) => {
                return direction === 'asc'
                    ? (a[key] as string) < (b[key] as string) ? -1 : 1
                    : (a[key] as string) > (b[key] as string) ? -1 : 1;

            }) : [];

            setRootData(sortedData);
            setSortConfig({ key, direction });
            setFilterLoading(false);
        }
    }, [sortConfig, filterLoading]);


    useEffect(() => {
        const filteredData = rootData.current ? [...rootData.current].filter(_per => {
            return (
                (!_per.fullname || _per.fullname.toLowerCase().includes(filterForm.fullname.toLowerCase())) &&
                (!_per.username || _per.username.toLowerCase().includes(filterForm.username.toLowerCase())) &&
                (!_per.email || _per.email.toLowerCase().includes(filterForm.email.toLowerCase())) &&
                (!_per.role || _per.role.toLowerCase().includes(filterForm.role.toLowerCase()))
            );
        }) : []

        setRootData(filteredData);
    }, [filterForm]);

    const handleFilterChange = (key: keyof DongHoPermissionsFilterForm, value: any) => {
        setFilterForm(prevForm => ({
            ...prevForm,
            [key]: value
        }));
    };

    const handleResetFilter = () => {
        setFilterForm({
            username: "",
            fullname: "",
            email: "",
            role: "",
        });
        setSelectedRoleOption("");
        if (dongHoSelected) getUserPermissions(dongHoSelected);
    }

    const tabContent = [
        {
            title: "Tìm kiếm",
            content:
                <div className={`row m-0 pt-2 w-100 ${c_vfml['search-process']}`}>
                    <div className="col-12 mb-3 col-md-6 col-xxl-3 d-flex">
                        <label className={`${c_vfml['form-label']}`} htmlFor="fullname">
                            Tên đầy đủ:
                            <input
                                type="text"
                                id="fullname"
                                className="form-control"
                                placeholder="Họ và tên"
                                value={filterForm.fullname}
                                onChange={(e) => handleFilterChange('fullname', e.target.value)}
                            />
                        </label>
                    </div>

                    <div className="col-12 mb-3 col-md-6 col-xxl-3 d-flex">
                        <label className={`${c_vfml['form-label']}`} htmlFor="username">
                            Tên người dùng:
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                placeholder="Username"
                                value={filterForm.username}
                                onChange={(e) => handleFilterChange('username', e.target.value)}
                            />
                        </label>
                    </div>

                    <div className="col-12 mb-3 col-md-6 col-xxl-3 d-flex">
                        <label className={`${c_vfml['form-label']}`} htmlFor="email">
                            Email:
                            <input
                                type="text"
                                id="email"
                                className="form-control"
                                placeholder="example@gmail.com"
                                value={filterForm.email}
                                onChange={(e) => handleFilterChange('email', e.target.value)}
                            />
                        </label>
                    </div>
                    <div className="col-12 mb-3 col-md-6 col-xxl-3">
                        <label className={`${c_vfml['form-label']}`} htmlFor="role">
                            Vai trò:
                            <Select
                                options={getAvailableRolesOptions() as unknown as readonly GroupBase<never>[]}
                                className="basic-multi-select mt-2"
                                placeholder="--"
                                classNamePrefix="select"
                                isClearable
                                id="role"
                                value={selectedRoleOption}
                                isSearchable
                                onChange={(selectedOptions: any) => {
                                    if (selectedOptions) {
                                        const values = selectedOptions.value;

                                        setSelectedRoleOption(selectedOptions);
                                        handleFilterChange('role', values);
                                    } else {
                                        setSelectedRoleOption('');
                                        handleFilterChange('role', "");
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
                                        display: getAvailableRolesOptions().length == 0 ? "none" : "flex",
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        display: getAvailableRolesOptions().length == 0 ? "none" : "",
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

                    <div className={`col-12 pb-2 m-0 my-2 gap-1 d-flex align-items-end justify-content-between`}>
                        <button aria-label="Làm mới" type="button" className={`btn bg-main-blue text-white`} onClick={() => handleResetFilter()}>
                            Xóa tìm kiếm
                        </button>
                        <button
                            onClick={() => handleAddPermission()}
                            className="btn bg-main-green text-white"
                        >
                            Thêm mới
                        </button>
                    </div>

                </div>
        },
        {
            title: "Thông tin đồng hồ",
            content: dongHoSelected ? <div className={`row m-0 px-2 pt-2 w-100 ${c_vfml['search-process']}`}>
                <div className="row">
                    <div className="col-12">
                        <p>Số giấy chứng nhận: <b>{dongHoSelected.so_giay_chung_nhan && dongHoSelected.ngay_thuc_hien ? getFullSoGiayCN(dongHoSelected.so_giay_chung_nhan, dongHoSelected.ngay_thuc_hien) : "Chưa có số giấy chứng nhận"}</b></p>
                    </div>
                    <div className="col-12">
                        <p>Số tem: <b>{dongHoSelected.so_tem ? dongHoSelected.so_tem : "Chưa có số tem"}</b></p>
                    </div>
                    <div className="col-12">
                        <p>Tên đồng hồ: <b>{dongHoSelected.ten_dong_ho || "Chưa có tên đồng hồ"}</b></p>
                    </div>
                    <div className="col-12">
                        <p>Tên phương tiện đo: <b>{dongHoSelected.phuong_tien_do || "Chưa có tên phương tiện đo"}</b></p>
                    </div>
                    <div className="col-12">
                        <p>Nơi sản xuất: <b>{dongHoSelected.co_so_san_xuat || "Chưa có nơi sản xuất"}</b></p>
                    </div>
                    {(dongHoSelected.kieu_sensor || dongHoSelected.seri_sensor || dongHoSelected.kieu_chi_thi || dongHoSelected.seri_chi_thi)
                        && <div className="col-12 mb-3">
                            <p className="m-0">Kiểu sản xuất:</p>
                            <div className="w-100 row m-0 px-3">
                                <div className="col-12 col-md-6 m-0 p-0">{(dongHoSelected.kieu_sensor) && <>Kiểu sensor: <b>{dongHoSelected.kieu_sensor}</b></>}</div>
                                <div className="col-12 col-md-6 m-0 p-0">{(dongHoSelected.seri_sensor) && <>Serial sensor: <b>{dongHoSelected.seri_sensor}</b></>}</div>
                                <div className="col-12 col-md-6 m-0 p-0">{(dongHoSelected.kieu_chi_thi) && <>Kiểu chỉ thị: <b>{dongHoSelected.kieu_chi_thi}</b></>}</div>
                                <div className="col-12 col-md-6 m-0 p-0">{(dongHoSelected.seri_chi_thi) && <>Serial chỉ thị: <b>{dongHoSelected.seri_chi_thi}</b></>}</div>
                            </div>
                        </div>
                    }
                </div>
                <div className="row mb-3">
                    <div className="col-12 col-md-4">
                        <span>Đặc trưng kỹ thuật đo lường:</span>
                    </div>
                    <div className="col-12 col-md-8 px-4 px-md-0">
                        <ul className="list-unstyled m-0 p-0">
                            <li>- Đường kính danh định: <b>DN ={dongHoSelected.dn || 0}</b> mm</li>
                            <li>- Lưu lượng danh định: {dongHoSelected.q3 ? <b>Q3= {dongHoSelected.q3 || 0}</b> : <b>Qn= {dongHoSelected.qn || 0}</b>} m<sup>3</sup>/h</li>
                            <li>- Cấp chính xác: <b>{dongHoSelected.ccx || "Chưa có cấp chính xác"}</b></li>
                            <li>- Ký hiệu PDM / Số quyết định: <b>{dongHoSelected.so_qd_pdm || "Chưa có số quyết định"}</b></li>
                        </ul>
                    </div>
                </div>
            </div> : <></>
        },
    ]

    const handleAddPermission = () => {
        setIsShow(true);
        isEditing.current = false;
    }

    const handleEditPermission = (per: DongHoPermission) => {
        setIsShow(true);
        isEditing.current = true;
        perSelected.current = per;
    }

    const handleDeletePermision = (per: DongHoPermission) => {
        Swal.fire({
            title: "Xác nhận xóa?",
            text: "Sau khi xóa sẽ không thể hoàn tác dữ liệu này!",
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
                    const res = await deleteDongHoPermission(per?.id || "");
                    if (res?.status === 200) {
                        if (dongHoSelected) getUserPermissions(dongHoSelected);
                        Swal.fire({
                            text: "Xóa thành công!",
                            icon: "success",
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "Có",
                        });
                    } else {
                        setError("Có lỗi đã xảy ra!");
                    }
                } catch (error) {
                    setError("Có lỗi đã xảy ra!");
                } finally {
                    setFilterLoading(false);
                }
            }
        });
    }

    const handleCloseModal = () => {
        setIsShow(false);
    }

    if (dongHoSelected == null) {
        return <></>
    }

    const handleBackPage = () => {
        handleResetFilter();
        setSelectedDongHo?.(null)
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            <ModalDongHoPermissionMng
                show={isShow != null ? isShow : false}
                selectedDongHo={dongHoSelected}
                handleClose={handleCloseModal}
                isEditing={isEditing.current}
                currentPer={perSelected.current}
                refreshData={handleResetFilter}
            ></ModalDongHoPermissionMng>
            <div className={`${className ? className : ""} m-0 w-100`}>
                <div className={`${c_vfml['wraper']} w-100`}>

                    <div className="bg-white w-100 shadow-sm mb-2 rounded">
                        <NavTab tabContent={tabContent} />
                    </div>

                    {/* TODO */}
                    <div className="alert alert-warning alert-dismissible shadow-sm mb-2 d-flex justify-content-end justify-content-sm-center position-relative px-3 px-md-4" role="alert">
                        <button style={{top: "50%", left: "20px",transform:"translateY(-50%)"}} className={`btn m-0 py-0 px-0 text-blue position-absolute d-flex align-items-center gap-1 border-0 shadow-0`} onClick={() => handleBackPage()}>
                            <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: "22px" }}></FontAwesomeIcon> Quay lại
                        </button>
                        <span>Vai trò: <strong>{getNameOfRole(isSuperAdmin ? getCurrentRole() : (dongHoSelected?.current_permission || ""))}</strong></span>
                    </div>
                    <div className="bg-white w-100 shadow-sm position-relative rounded overflow-hidden">
                        {filterLoading && <Loading />}

                        <div className={`m-0 p-0 w-100 position-relative ${c_vfml['wrap-process-table']}`}>
                            <div className={`w-100 p-2`}>
                                <p className="text-center fw-bold text-uppercase fs-5 m-0 w-100">BẢNG PHÂN QUYỀN</p>
                            </div>
                            {data && data.length > 0 ? (
                                <table className={`table table-striped table-bordered table-hover ${c_vfml['process-table']}`}>
                                    <thead>
                                        <tr className={`${c_vfml['table-header']}`}>
                                            <th className="text-center">
                                                STT
                                            </th>
                                            <th onClick={() => sortData('fullname')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Tên đầy đủ
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'fullname' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'fullname' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('username')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Tên người dùng
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'username' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'username' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th onClick={() => sortData('email')}>
                                                <div className={`${c_vfml['table-label']}`}>
                                                    <span>
                                                        Email
                                                    </span>
                                                    {sortConfig && sortConfig.key === 'email' && sortConfig.direction === 'asc' && (
                                                        <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                                                    )}
                                                    {sortConfig && sortConfig.key === 'email' && sortConfig.direction === 'desc' && (
                                                        <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
                                                    )}
                                                </div>
                                            </th>
                                            <th>Vai trò người dùng</th>
                                            <th className="text-center" colSpan={2}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((per_data, index) => {

                                            return (
                                                <tr
                                                    key={index}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <td className="text-center">{data.indexOf(per_data) + 1}</td>
                                                    <td>{per_data.fullname}</td>
                                                    <td>{per_data.username}</td>
                                                    <td>{per_data.email}</td>
                                                    <td>{getNameOfRole(per_data.role)}</td>
                                                    <td>
                                                        <button className="btn border-0 shadow-0 w-100 text-blue" aria-label="Chỉnh sửa phân quyền" onClick={() => handleEditPermission(per_data)}>
                                                            <FontAwesomeIcon icon={faUserEdit}></FontAwesomeIcon>
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className="btn border-0 shadow-0 w-100 text-danger" aria-label="Xóa phân quyền" onClick={() => handleDeletePermision(per_data)}>
                                                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                                        </button>
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