// "use client"

// import { useEffect, useState, useCallback, useRef } from "react";
// import c_vfml from "@styles/scss/components/verification-management-layout.module.scss";

// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs, { Dayjs } from "dayjs";
// import { viVN } from "@mui/x-date-pickers/locales";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEdit, faCircleArrowRight, faArrowLeft, faSearch, faRefresh, faEye } from "@fortawesome/free-solid-svg-icons";
// import React from "react";
// import { DongHo, DongHoFilterParameters } from "@lib/types";

// import Pagination from "@/components/Pagination";
// // import { usePathname } from "next/navigation";
// import Link from "next/link";

// import {
//     ACCESS_LINKS,
//     //  limitOptions 
// } from "@lib/system-constant";
// import Swal from "sweetalert2";
// import { getHieuChuanDongHoByFilter } from "@/app/api/dongho/route";
// import { decode } from "@lib/system-function";
// import { useUser } from "@/context/AppContext";

// const Loading = React.lazy(() => import("@/components/Loading"));


// interface HieuChuanDongHoNuocMngProps {
//     className?: string,
//     setSelectedDongHo?: React.Dispatch<React.SetStateAction<DongHo | null>>;
//     clearNDHPropData?: () => void;
//     dataList?: DongHo[]
// }

// export default function HieuChuanDongHoNuocMng({ className, setSelectedDongHo, clearNDHPropData, dataList = [] }: HieuChuanDongHoNuocMngProps) {
//     const { user, isViewer, isSuperAdmin, getCurrentRole } = useUser();
//     const [data, setRootData] = useState<DongHo[]>([]);
//     const rootData = useRef<DongHo[]>([]);
//     const [filterLoading, setFilterLoading] = useState(true);
//     const [limit, setLimit] = useState(10);
//     const [error, setError] = useState("");
//     const fetchedRef = useRef(false);
//     const isEditing = useRef<boolean>(false);
//     // const perSelected = useRef<DongHoPermission | null>(null);
//     const [isShow, setIsShow] = useState<boolean | null>(null);

//     // Func: Set err
//     useEffect(() => {
//         if (error) {
//             Swal.fire({
//                 icon: "error",
//                 title: "Lỗi",
//                 text: error,
//                 showClass: {
//                     popup: `
//                     animate__animated
//                     animate__fadeInUp
//                     animate__faster
//                   `
//                 },
//                 hideClass: {
//                     popup: `
//                     animate__animated
//                     animate__fadeOutDown
//                     animate__faster
//                   `
//                 },
//                 confirmButtonColor: "#0980de",
//                 confirmButtonText: "OK"
//             }).then(() => {
//                 setError("");
//             });
//         }
//     }, [error]);

//     // const path = usePathname();

//     const [filterForm, setFilterForm] = useState<DongHoFilterParameters>({
//         so_giay_chung_nhan: "",
//         seri_sensor: "",
//         type: "",
//         ccx: "",
//         nguoi_thuc_hien: "",
//         ten_khach_hang: "",
//         status: "",
//         ngay_kiem_dinh_from: null,
//         ngay_kiem_dinh_to: null,
//         limit: limit,
//         last_seen: ""
//     });
//     const [currentPage, setCurrentPage] = useState(1);

//     const [totalRecords, setTotalRecords] = useState(0);
//     const totalRecordsRef = useRef(totalRecords);
//     const [totalPage, setTotalPage] = useState(1);
//     const totalPageRef = useRef(totalPage);

//     const _fetchDongHo = async (filterFormProps?: DongHoFilterParameters) => {
//         setFilterLoading(true);
//         if (dataList.length > 0) {
//             setRootData(dataList);
//             rootData.current = dataList;
//             setFilterLoading(false);
//         } else {
//             try {
//                 const res = await getHieuChuanDongHoByFilter(filterFormProps ? filterFormProps : filterForm);
//                 if (res.status === 200 || res.status === 201) {
//                     setRootData(res.data.donghos || []);
//                     if (totalPageRef.current != res.data.total_page) {
//                         setTotalPage(res.data.total_page || 1)
//                         totalPageRef.current = res.data.total_page || 1;
//                     }
//                     if (totalRecordsRef.current != res.data.total_records) {
//                         setTotalRecords(res.data.total_records || 0)
//                         totalRecordsRef.current = res.data.total_records || 0;
//                     }
//                     if (filterFormProps) {
//                         setFilterForm(filterFormProps);
//                     }
//                     rootData.current = res.data.donghos || [];
//                 } else {
//                     console.error(res.msg);
//                     setError("Có lỗi đã xảy ra!");
//                 }
//             } catch (error) {
//                 console.error('Error fetching PDM data:', error);
//                 setError("Có lỗi đã xảy ra!");
//             } finally {
//                 setFilterLoading(false);
//             }
//         }
//     }

//     useEffect(() => {
//         if (!fetchedRef.current) {
//             _fetchDongHo();
//             fetchedRef.current = true;
//         }
//     }, []);


//     // useEffect(() => {
//     //     const filteredData = rootData.current ? [...rootData.current].filter(_per => {
//     //         // Trim filter values once to avoid repeated operations
//     //         const trimmedFilters = {
//     //             so_giay_chung_nhan: filterForm.so_giay_chung_nhan?.trim().toLowerCase() || '',
//     //             seri_sensor: filterForm.seri_sensor?.trim().toLowerCase() || '',
//     //             ten_khach_hang: filterForm.ten_khach_hang?.trim().toLowerCase() || '',
//     //             nguoi_thuc_hien: filterForm.nguoi_thuc_hien?.trim().toLowerCase() || '',
//     //             ccx: filterForm.ccx?.trim().toLowerCase() || '',
//     //         };

//     //         // Skip filtering if all filter values are empty
//     //         if (!Object.values(trimmedFilters).some(value => value !== '') &&
//     //             !filterForm.ngay_kiem_dinh_from &&
//     //             !filterForm.ngay_kiem_dinh_to) {
//     //             return true;
//     //         }

//     //         const isSoGiayChungNhanMatch = !trimmedFilters.so_giay_chung_nhan ||
//     //             (_per.so_giay_chung_nhan?.trim().toLowerCase() || '').includes(trimmedFilters.so_giay_chung_nhan);

//     //         const isSeriSensorMatch = !trimmedFilters.seri_sensor ||
//     //             (_per.seri_sensor?.trim().toLowerCase() || '').includes(trimmedFilters.seri_sensor);

//     //         const isTenKhachHangMatch = !trimmedFilters.ten_khach_hang ||
//     //             (_per.ten_khach_hang?.trim().toLowerCase() || '').includes(trimmedFilters.ten_khach_hang);

//     //         const isnguoiThucHienMatch = !trimmedFilters.nguoi_thuc_hien ||
//     //             (_per.nguoi_thuc_hien?.trim().toLowerCase() || '').includes(trimmedFilters.nguoi_thuc_hien);

//     //         const isNgayKiemDinhFromMatch = !filterForm.ngay_kiem_dinh_from ||
//     //             (_per.ngay_thuc_hien && new Date(_per.ngay_thuc_hien) >= new Date(filterForm.ngay_kiem_dinh_from));

//     //         const isNgayKiemDinhToMatch = !filterForm.ngay_kiem_dinh_to ||
//     //             (_per.ngay_thuc_hien && new Date(_per.ngay_thuc_hien) <= new Date(filterForm.ngay_kiem_dinh_to));

//     //         const isCcxMatch = !trimmedFilters.ccx ||
//     //             (_per.ccx?.trim().toLowerCase() || '').includes(trimmedFilters.ccx);

//     //         return isSoGiayChungNhanMatch &&
//     //             isSeriSensorMatch &&
//     //             isTenKhachHangMatch &&
//     //             isnguoiThucHienMatch &&
//     //             isNgayKiemDinhFromMatch &&
//     //             isNgayKiemDinhToMatch &&
//     //             isCcxMatch;
//     //     }) : [];

//     //     setRootData(filteredData);
//     // }, [filterForm, rootData]);

//     const handleFilterChange = (key: keyof DongHoFilterParameters, value: any) => {
//         setFilterForm(prevForm => ({
//             ...prevForm,
//             [key]: value
//         }));
//     };

//     const handleResetFilter = () => {
//         const blankFilterForm: DongHoFilterParameters = {
//             so_giay_chung_nhan: "",
//             seri_sensor: "",
//             type: "",
//             ccx: "",
//             nguoi_thuc_hien: "",
//             ten_khach_hang: "",
//             status: "",
//             ngay_kiem_dinh_from: null,
//             ngay_kiem_dinh_to: null,
//             last_seen: "",
//             next_from: "",
//             prev_from: "",
//             limit: limit
//         };
//         _fetchDongHo(blankFilterForm);
//         setCurrentPage(1);
//     }

//     const handleSearch = () => {
//         setCurrentPage(1);
//         _fetchDongHo({ ...filterForm, last_seen: "", next_from: "", prev_from: "" })
//     }

//     const handlePageChange = (newPage: number) => {
//         if (currentPage > newPage) {
//             const newFilterForm: DongHoFilterParameters = {
//                 ...filterForm,
//                 last_seen: "",
//                 prev_from: data && data[0].id ? data[0].id || "" : "",
//                 next_from: ""
//             }
//             _fetchDongHo(newFilterForm);
//         } else if (currentPage < newPage) {
//             const newFilterForm: DongHoFilterParameters = {
//                 ...filterForm,
//                 last_seen: "",
//                 prev_from: "",
//                 next_from: data[data.length - 1] && data[data.length - 1].id ? data[data.length - 1].id || "" : ""
//             }
//             _fetchDongHo(newFilterForm);
//         }
//         setCurrentPage(newPage);
//     };

//     const paginatedData = data || [];

//     return (
//         <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
//             <div className={`${className ? className : ""} m-0 w-100`}>
//                 <div className={`${c_vfml['wraper']} w-100`}>

//                     <div className="bg-white w-100 shadow-sm mb-2 rounded pt-3 pb-1">
//                         <div className={`row m-0 px-md-3 w-100 mb-3 ${c_vfml['search-process']}`}>

//                             <div className="col-12 mb-3 col-md-6 col-lg-4 d-flex">
//                                 <label className={`${c_vfml['form-label']}`} htmlFor="so_giay_chung_nhan">
//                                     Số giấy chứng nhận:
//                                     <input
//                                         type="text"
//                                         id="so_giay_chung_nhan"
//                                         className="form-control"
//                                         placeholder="Nhập số giấy"
//                                         value={filterForm.so_giay_chung_nhan}
//                                         onChange={(e) => handleFilterChange('so_giay_chung_nhan', e.target.value)}
//                                     />
//                                 </label>
//                             </div>
//                             <div className="col-12 mb-3 col-md-6 col-lg-4">
//                                 <label className={`${c_vfml['form-label']}`} htmlFor="ten_khach_hang">
//                                     Tên khách hàng:
//                                     <input
//                                         type="text"
//                                         id="ten_khach_hang"
//                                         className="form-control"
//                                         placeholder="Nhập tên khách hàng"
//                                         value={filterForm.ten_khach_hang}
//                                         onChange={(e) => handleFilterChange('ten_khach_hang', e.target.value)}
//                                     />
//                                 </label>
//                             </div>
//                             <div className="col-12 d-md-none d-lg-flex mb-3 col-md-6 col-lg-4">
//                                 <label className={`${c_vfml['form-label']}`} htmlFor="nguoi_thuc_hien">
//                                     Người thực hiện:
//                                     <input
//                                         type="text"
//                                         id="nguoi_thuc_hien"
//                                         className="form-control"
//                                         placeholder="Nhập tên người thực hiện"
//                                         value={filterForm.nguoi_thuc_hien}
//                                         onChange={(e) => handleFilterChange('nguoi_thuc_hien', e.target.value)}
//                                     />
//                                 </label>
//                             </div>

//                             <div className={`col-12 col-lg-8 mb-3 m-0 row p-0 ${c_vfml['search-created-date']}`}>
//                                 <label className={`${c_vfml['form-label']} col-12`}>
//                                     Ngày thực hiện:
//                                 </label>
//                                 <div className={`col-12 row m-0 mt-2 p-0 ${c_vfml['pick-created-date']}`}>
//                                     <div className={`col-12 col-md-6 mb-3 mb-md-0 ${c_vfml['picker-field']}`}>
//                                         <label>Từ:</label>

//                                         <DatePicker
//                                             className={`${c_vfml['date-picker']}`}
//                                             value={filterForm.ngay_kiem_dinh_from ? dayjs(filterForm.ngay_kiem_dinh_from) : null}
//                                             format="DD-MM-YYYY"

//                                             onChange={(newValue: Dayjs | null) => handleFilterChange('ngay_kiem_dinh_from', newValue ? newValue.toDate() : null)}
//                                             slotProps={{ textField: { fullWidth: true } }}
//                                             maxDate={filterForm.ngay_kiem_dinh_to ? dayjs(filterForm.ngay_kiem_dinh_to).subtract(1, 'day') : dayjs().endOf('day').subtract(1, 'day')}
//                                         />
//                                     </div>

//                                     <div className={`col-12 col-md-6 ${c_vfml['picker-field']}`}>
//                                         <label>Đến:</label>
//                                         <DatePicker
//                                             className={`${c_vfml['date-picker']}`}
//                                             value={filterForm.ngay_kiem_dinh_to ? dayjs(filterForm.ngay_kiem_dinh_to) : undefined}
//                                             format="DD-MM-YYYY"
//                                             minDate={filterForm.ngay_kiem_dinh_from ? dayjs(filterForm.ngay_kiem_dinh_from).add(1, 'day') : undefined}

//                                             maxDate={dayjs().endOf('day')}
//                                             onChange={(newValue: Dayjs | null) => handleFilterChange('ngay_kiem_dinh_to', newValue ? newValue.toDate() : undefined)}
//                                             slotProps={{ textField: { fullWidth: true } }}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="col-12 d-none d-md-flex d-lg-none mb-3 col-md-6 col-lg-4">
//                                 <label className={`${c_vfml['form-label']}`} htmlFor="nguoi_thuc_hien">
//                                     Người hiệu chuẩn:
//                                     <input
//                                         type="text"
//                                         id="nguoi_thuc_hien"
//                                         className="form-control"
//                                         placeholder="Nhập tên người hiệu chuẩn"
//                                         value={filterForm.nguoi_thuc_hien}
//                                         onChange={(e) => handleFilterChange('nguoi_thuc_hien', e.target.value)}
//                                     />
//                                 </label>
//                             </div>
//                             <div className={`col-12 align-items-end pb-2 col-md-6 col-lg-4 m-0 my-2 d-flex justify-content-between`}>
//                                 <div className="d-flex gap-2">
//                                     <button aria-label="Tìm kiếm" type="button" className={`btn bg-main-blue text-white`} onClick={handleSearch}>
//                                         <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon> Tìm
//                                     </button>
//                                     <button aria-label="Làm mới" type="button" className={`btn bg-grey text-white`} onClick={handleResetFilter}>
//                                         <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon>
//                                     </button>
//                                 </div>
//                                 {!isViewer &&
//                                     <Link
//                                         style={{ minHeight: "42px" }}
//                                         href={ACCESS_LINKS.HC_DHN_ADD.src}
//                                         className="btn bg-main-green text-white"
//                                     >
//                                         Thêm mới
//                                     </Link>
//                                 }
//                             </div>

//                         </div>
//                     </div>

//                     {dataList.length > 0 &&
//                         <div className="alert alert-warning alert-dismissible shadow-sm mb-2 d-flex justify-content-end justify-content-sm-center position-relative px-3 px-md-4" role="alert">
//                             <h5 className="m-0 text-center"></h5>
//                             <button style={{ top: "50%", left: "20px", transform: "translateY(-50%)" }} className={`btn m-0 py-0 px-0 text-blue position-absolute d-flex align-items-center gap-1 border-0 shadow-0`} onClick={() => clearNDHPropData?.()}>
//                                 <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: "22px" }}></FontAwesomeIcon> Quay lại
//                             </button>
//                             <span className={`fs-5 fw-bold d-none d-sm-block`} style={{ maxWidth: "calc(100% - 195px)", overflow: "hidden", WebkitLineClamp: "1", whiteSpace: "no-wrap", textOverflow: "ellipsis" }}>{dataList[0].group_id}</span>
//                             <span className={`fs-5 fw-bold d-sm-none`} style={{ maxWidth: "calc(100% - 115px)", overflow: "hidden", WebkitLineClamp: "1", whiteSpace: "no-wrap", textOverflow: "ellipsis" }}>{dataList[0].group_id}</span>
//                         </div>}

//                     <div className="bg-white w-100 shadow-sm position-relative rounded overflow-hidden">
//                         {filterLoading && <Loading />}
//                         <div className={`m-0 p-0 w-100 w-100 position-relative ${c_vfml['wrap-process-table']}`}>
//                             {data && data.length > 0 ? (
//                                 <table className={`table table-striped table-bordered table-hover ${c_vfml['process-table']}`}>
//                                     <thead>
//                                         <tr className={`${c_vfml['table-header']}`}>
//                                             <th className="text-center">
//                                                 ID
//                                             </th>

//                                             <th>
//                                                 <div>
//                                                     <span>
//                                                         Số giấy CN
//                                                     </span>
//                                                 </div>
//                                             </th>
//                                             <th>
//                                                 <div>
//                                                     <span>
//                                                         Tên khách hàng
//                                                     </span>
//                                                 </div>
//                                             </th>
//                                             <th>
//                                                 <div>
//                                                     <span>
//                                                         Người hiệu chuẩn
//                                                     </span>
//                                                 </div>
//                                             </th>
//                                             <th>
//                                                 <div>
//                                                     <span>
//                                                         Ngày thực hiện
//                                                     </span>
//                                                 </div>
//                                             </th>
//                                             <th>
//                                                 <div>
//                                                     <span>
//                                                         Trạng thái
//                                                     </span>
//                                                 </div>
//                                             </th>
//                                             <th></th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {/* {data.map((dongHo, index) => { */}
//                                         {paginatedData.map((dongHo, index) => {
//                                             const duLieuKiemDinhJSON = dongHo.du_lieu_kiem_dinh;
//                                             const duLieuKiemDinh = duLieuKiemDinhJSON ?
//                                                 ((typeof duLieuKiemDinhJSON != 'string') ?
//                                                     duLieuKiemDinhJSON : JSON.parse(duLieuKiemDinhJSON)
//                                                 ) : null;
//                                             const ketQua = duLieuKiemDinh?.ket_qua;
//                                             const redirectLink = `${ACCESS_LINKS.HC_DHN_DETAIL_DH.src}/${dongHo.id}`;

//                                             return (
//                                                 <tr
//                                                     key={index}
//                                                     style={{ cursor: 'pointer' }}
//                                                 >
//                                                     <td className="text-center">{decode(dongHo.id || "")}</td>
//                                                     <td>{dongHo.so_giay_chung_nhan}</td>
//                                                     <td>{dongHo.ten_khach_hang}</td>
//                                                     <td>{dongHo.nguoi_thuc_hien}</td>
//                                                     <td>{dayjs(dongHo.ngay_thuc_hien).format('DD-MM-YYYY')}</td>
//                                                     <td>
//                                                         {ketQua != null ? (ketQua ? "Đạt" : "Không đạt") : "Chưa hiệu chuẩn"}
//                                                     </td>
//                                                     <td style={{ width: "90px" }}>
//                                                         <div className="w-100 m-0 p-0 d-flex align-items-center justify-content-center">
//                                                             <Link aria-label="Xem" href={redirectLink} target="_blank" className={`btn p-1 w-100 text-blue shadow-0`}>
//                                                                 <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
//                                                             </Link>
//                                                             <Link aria-label="Chỉnh sửa" href={ACCESS_LINKS.HC_DHN_EDIT_DH.src + "/" + dongHo.id} className={`btn p-1 w-100 text-blue shadow-0`}>
//                                                                 <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
//                                                             </Link>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             )
//                                         })}
//                                     </tbody>
//                                 </table>
//                             ) : (
//                                 <p className="text-center py-3 m-0 w-100">Không có dữ liệu</p>
//                             )}
//                         </div>
//                         <div className="w-100 m-0 p-3 d-flex align-items-center justify-content-center">
//                             <Pagination currentPage={currentPage} totalPage={totalPage} totalRecords={totalRecords} handlePageChange={handlePageChange}></Pagination>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </LocalizationProvider>
//     )
// }