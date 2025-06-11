// "use client"

// import { useEffect, useState, useCallback, useRef } from "react";
// import c_vfml from "@styles/scss/components/verification-management-layout.module.scss";

// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs, { Dayjs } from "dayjs";
// import { viVN } from "@mui/x-date-pickers/locales";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronDown, faChevronUp, faCircleArrowRight, faEdit, faEye, faRefresh, faSearch } from "@fortawesome/free-solid-svg-icons";
// import React from "react";

// import Select, { GroupBase } from 'react-select';
// import { NhomDongHoFilterParameters, NhomDongHo, PDMData } from "@lib/types";

// import Link from "next/link";

// import { ACCESS_LINKS, BASE_API_URL } from "@lib/system-constant";
// import Swal from "sweetalert2";
// import { getHieuChuanNhomDongHoByFilter } from "@lib/api/dongho";
// import api from "@/lib/api/instance";
// import dynamic from "next/dynamic";
// import Pagination from "@/components/Pagination";
// import { useUser } from "@/context/AppContext";

// const Loading = dynamic(() => import("@/components/Loading"), { ssr: false });


// interface HieuChuanNhomDongHoNuocMngProps {
//     className?: string,
//     setSelectedGroupId?: React.Dispatch<React.SetStateAction<string | null>>;
// }

// export default function HieuChuanNhomDongHoNuocMng({ className, setSelectedGroupId }: HieuChuanNhomDongHoNuocMngProps) {
//     const { isViewer } = useUser();
//     const [data, setRootData] = useState<NhomDongHo[]>([]);
//     const rootData = useRef<NhomDongHo[]>([]);

//     const [filterLoading, setFilterLoading] = useState(true);
//     const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | 'default' } | null>(null);
//     const [limit, setLimit] = useState(10);
//     const [error, setError] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);

//     const fetchDHNameCalled = useRef(false);
//     const [selectedTenDHOption, setSelectedTenDHOption] = useState('');
//     const [DHNameOptions, setDHNameOptions] = useState<{ value: string, label: string }[]>([]);
//     const fetchedRef = useRef(false);

//     // Query dongho name
//     useEffect(() => {
//         // if (fetchDHNameCalled.current) return;
//         // fetchDHNameCalled.current = true;

//         // const fetchData = async () => {
//         //     try {
//         //         const res = await api.get(`${BASE_API_URL}/dongho/get-distinct-names-and-locations`);
//         //         const listNames: string[] = res.data.ten_dong_ho ?? [];
//         //         const uniqueNames = listNames.filter((value, index, self) => self.indexOf(value) === index);
//         //         const sortedNames = uniqueNames.sort((a, b) => a.localeCompare(b));
//         //         setDHNameOptions(sortedNames && sortedNames.length > 0 ? [
//         //             ...sortedNames
//         //                 .filter(name => name && name.trim() !== "")
//         //                 .map((name) => ({ value: name, label: name }))
//         //         ] : []);
//         //     } catch (error) {
//         //         setError("Đã có lỗi xảy ra! Hãy thử lại sau.");
//         //     }
//         // };

//         // fetchData();
//     }, []);

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

//     const [filterForm, setFilterForm] = useState<NhomDongHoFilterParameters>({
//         ten_dong_ho: "",
//         ten_khach_hang: "",
//         nguoi_thuc_hien: "",
//         ngay_kiem_dinh_from: null,
//         ngay_kiem_dinh_to: null,
//         limit: limit,
//         page: 1
//     });

//     const [totalRecords, setTotalRecords] = useState(0);
//     const totalRecordsRef = useRef(totalRecords);
//     const [totalPage, setTotalPage] = useState(1);
//     const totalPageRef = useRef(totalPage);

//     // const resetTotalPage = () => {
//     //     setCurrentPage(1);
//     //     if (!data || data.length <= (limit ? limit : 1)) {
//     //         return 1;
//     //     }
//     //     return Math.ceil(data.length / (limit ? limit : 1));
//     // }

//     // const [totalPage, setTotalPage] = useState(resetTotalPage);

//     // useEffect(() => {
//     //     setTotalPage(resetTotalPage);
//     // }, [data, limit])

//     const sortData = useCallback((key: keyof NhomDongHo) => {
//         if (!filterLoading) {
//             setFilterLoading(true);
//             let direction: 'asc' | 'desc' = 'asc';

//             if (sortConfig && sortConfig.key === key) {
//                 direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
//             }

//             const sortedData = data ? [...data].sort((a, b) => {
//                 if (key === 'ngay_thuc_hien') {
//                     const dateA = dayjs(a[key] as Date);
//                     const dateB = dayjs(b[key] as Date);
//                     return direction === 'asc' ? dateA.diff(dateB) : dateB.diff(dateA);
//                 } else {
//                     return direction === 'asc'
//                         ? (a[key] as string | number) < (b[key] as string | number) ? -1 : 1
//                         : (a[key] as string | number) > (b[key] as string | number) ? -1 : 1;
//                 }
//             }) : [];

//             setRootData(sortedData);
//             setSortConfig({ key, direction });
//             setFilterLoading(false);
//         }
//     }, [data, sortConfig, filterLoading]);

//     const _fetchNhomDongHo = async (filterFormProps?: NhomDongHoFilterParameters) => {
//         setFilterLoading(true);
//         try {
//             const res = await getHieuChuanNhomDongHoByFilter(filterFormProps ? filterFormProps : filterForm);
//             if (res.status === 200 || res.status === 201) {
//                 setRootData(res.data.groups || []);
//                 if (totalPageRef.current != res.data.total_page) {
//                     setTotalPage(res.data.total_page || 1)
//                     totalPageRef.current = res.data.total_page || 1;
//                 }
//                 if (totalRecordsRef.current != res.data.total_records) {
//                     setTotalRecords(res.data.total_records || 0)
//                     totalRecordsRef.current = res.data.total_records || 0;
//                 }
//                 if (filterFormProps) {
//                     setFilterForm(filterFormProps);
//                 }
//                 rootData.current = res.data.groups || [];
//             } else {
//                 console.error(res.msg);
//                 setError("Có lỗi đã xảy ra!");
//             }
//         } catch (error) {
//             console.error('Error fetching PDM data:', error);
//             setError("Có lỗi đã xảy ra!");
//         } finally {
//             setFilterLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (!fetchedRef.current) {
//             _fetchNhomDongHo();
//             fetchedRef.current = true;
//         }
//     }, [])

//     // useEffect(() => {
//     //     const filteredData = rootData.current ? [...rootData.current].filter(_ndh => {
//     //         // Trim filter values once to avoid repeated operations
//     //         const trimmedFilters = {
//     //             ten_dong_ho: filterForm.ten_dong_ho?.trim().toLowerCase() || '',
//     //             ten_khach_hang: filterForm.ten_khach_hang?.trim().toLowerCase() || '',
//     //             nguoi_thuc_hien: filterForm.nguoi_thuc_hien?.trim().toLowerCase() || '',
//     //         };

//     //         // Skip filtering if all filter values are empty
//     //         if (!Object.values(trimmedFilters).some(value => value !== '') &&
//     //             !filterForm.ngay_kiem_dinh_from &&
//     //             !filterForm.ngay_kiem_dinh_to) {
//     //             return true;
//     //         }

//     //         const isSoGiayChungNhanMatch = !trimmedFilters.ten_dong_ho ||
//     //             (_ndh.ten_dong_ho?.trim().toLowerCase() || '').includes(trimmedFilters.ten_dong_ho);

//     //         const isTenKhachHangMatch = !trimmedFilters.ten_khach_hang ||
//     //             (_ndh.ten_khach_hang?.trim().toLowerCase() || '').includes(trimmedFilters.ten_khach_hang);

//     //         const isnguoiThucHienMatch = !trimmedFilters.nguoi_thuc_hien ||
//     //             (_ndh.nguoi_thuc_hien?.trim().toLowerCase() || '').includes(trimmedFilters.nguoi_thuc_hien);

//     //         const isNgayKiemDinhFromMatch = !filterForm.ngay_kiem_dinh_from ||
//     //             (_ndh.ngay_thuc_hien && new Date(_ndh.ngay_thuc_hien) >= new Date(filterForm.ngay_kiem_dinh_from));

//     //         const isNgayKiemDinhToMatch = !filterForm.ngay_kiem_dinh_to ||
//     //             (_ndh.ngay_thuc_hien && new Date(_ndh.ngay_thuc_hien) <= new Date(filterForm.ngay_kiem_dinh_to));


//     //         return isSoGiayChungNhanMatch &&
//     //             isTenKhachHangMatch &&
//     //             isnguoiThucHienMatch &&
//     //             isNgayKiemDinhFromMatch &&
//     //             isNgayKiemDinhToMatch
//     //     }) : [];

//     //     setRootData(filteredData);
//     // }, [filterForm, rootData]);

//     const handleFilterChange = (key: keyof NhomDongHoFilterParameters, value: any) => {
//         setFilterForm(prevForm => ({
//             ...prevForm,
//             [key]: value
//         }));
//     };

//     const handleResetFilter = () => {
//         setSelectedTenDHOption("");
//         _fetchNhomDongHo({
//             ten_dong_ho: "",
//             ten_khach_hang: "",
//             nguoi_thuc_hien: "",
//             ngay_kiem_dinh_from: null,
//             ngay_kiem_dinh_to: null,
//             limit: limit,
//             page: 1
//         });
//     }

//     // const handleUpdatePaymentStatus = (group_id: string, current_payment_status: boolean) => {
//     //     if (group_id) {
//     //         Swal.fire({
//     //             title: `Xác nhận!`,
//     //             text: !current_payment_status ? "Đã hoàn tất thanh toán?" : "Hủy hoàn tất thanh toán?",
//     //             icon: "warning",
//     //             showCancelButton: true,
//     //             cancelButtonColor: "#d33",
//     //             confirmButtonText: "Xác nhận",
//     //             cancelButtonText: "Hủy",
//     //         }).then(async (result) => {
//     //             if (result.isConfirmed) {
//     //                 try {
//     //                     const res = await updatePaymentStatus(group_id, !current_payment_status, user?.fullname || "");
//     //                     if (res.status == 200 || res.status == 201) {
//     //                         _fetchNhomDongHo(filterForm);
//     //                     } else {
//     //                         setError("Đã có lỗi xảy ra! Hãy thử lại sau.");
//     //                     }
//     //                 } catch (error) {
//     //                     setError("Đã có lỗi xảy ra! Hãy thử lại sau.");
//     //                 }
//     //             }
//     //         });
//     //     }
//     // }

//     const handleSearch = () => {
//         setCurrentPage(1);
//         _fetchNhomDongHo({ ...filterForm, page: 1 });
//     }

//     const handlePageChange = (newPage: number) => {
//         _fetchNhomDongHo({ ...filterForm, page: newPage });
//         setCurrentPage(newPage);
//     };


//     const paginatedData = data || [];

//     return (
//         <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
//             <div className={`${className ? className : ""} m-0 w-100`}>
//                 <div className={`${c_vfml['wraper']} w-100`}>


//                     <div className="bg-white w-100 shadow-sm mb-2 rounded pb-2 pt-4">
//                         <div className={`row m-0 px-md-3 w-100 mb-3 ${c_vfml['search-process']}`}>
//                             {/* <div className="col-12 mb-3 col-md-6 col-xl-4 d-flex">
//                             <label className={`${c_vfml['form-label']}`} htmlFor="process-id">
//                                 ID:
//                                 <input
//                                     type="text"
//                                     id="process-id"
//                                     className="form-control"
//                                     placeholder="Nhập ID"
//                                     value={filterForm.waterMeterId}
//                                     onChange={(e) => handleFilterChange('waterMeterId', e.target.value)}
//                                 />
//                             </label>
//                         </div> */}

//                             <div className="col-12 col-sm-6 mb-3 col-lg-4 d-flex">
//                                 <label className={`${c_vfml['form-label']}`} htmlFor="ten_dong_ho">
//                                     Tên đồng hồ:
//                                     <Select
//                                         options={DHNameOptions as unknown as readonly GroupBase<never>[]}
//                                         className="basic-multi-select mt-2"
//                                         placeholder="Tên đồng hồ"
//                                         classNamePrefix="select"
//                                         isClearable
//                                         id="ten_dong_ho"
//                                         value={selectedTenDHOption}
//                                         isSearchable
//                                         onChange={(selectedOptions: any) => {
//                                             if (selectedOptions) {
//                                                 const values = selectedOptions.value;

//                                                 setSelectedTenDHOption(selectedOptions);
//                                                 handleFilterChange('ten_dong_ho', values);
//                                             } else {
//                                                 setSelectedTenDHOption('');
//                                                 handleFilterChange('ten_dong_ho', "");
//                                             }
//                                         }}
//                                         styles={{
//                                             control: (provided) => ({
//                                                 ...provided,
//                                                 height: '42px',
//                                                 minHeight: '42px',
//                                                 borderColor: '#dee2e6 !important',
//                                                 boxShadow: 'none !important',
//                                                 backgroundColor: "white",
//                                             }),
//                                             valueContainer: (provided) => ({
//                                                 ...provided,
//                                                 height: '42px',
//                                                 padding: '0 8px'
//                                             }),
//                                             input: (provided) => ({
//                                                 ...provided,
//                                                 margin: '0',
//                                                 padding: '0'
//                                             }),
//                                             indicatorsContainer: (provided) => ({
//                                                 ...provided,
//                                                 height: '42px',
//                                                 display: DHNameOptions.length == 0 ? "none" : "flex",
//                                             }),
//                                             menu: (provided) => ({
//                                                 ...provided,
//                                                 display: DHNameOptions.length == 0 ? "none" : "",
//                                                 maxHeight: "250px",
//                                                 zIndex: 777
//                                             }),
//                                             menuList: (provided) => ({
//                                                 ...provided,
//                                                 maxHeight: "250px",
//                                             }),
//                                             singleValue: (provided, state) => ({
//                                                 ...provided,
//                                                 color: state.isDisabled ? '#000' : provided.color,
//                                             })
//                                         }}
//                                     />
//                                 </label>
//                             </div>
//                             <div className="col-12 col-sm-6 mb-3 col-lg-4">
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
//                             {/* <div className={`col-12 col-sm-6 col-md-6 col-lg-4 mb-3 m-0 p-0 row`}>
//                                 <label className={`${c_vfml['form-label']}`}>
//                                     Số lượng bản ghi:
//                                     <Select
//                                         name="limit"
//                                         options={limitOptions as unknown as readonly GroupBase<never>[]}
//                                         className="basic-multi-select"
//                                         classNamePrefix="select"
//                                         value={limitOptions.find(option => option.value === limit) || 10}
//                                         onChange={(selectedOptions: any) => setLimit(selectedOptions ? selectedOptions.value : 10)}
//                                         styles={{
//                                             control: (provided) => ({
//                                                 ...provided,
//                                                 height: '42px',
//                                                 minHeight: '42px',
//                                                 marginTop: '0.5rem',
//                                                 borderColor: '#dee2e6 !important',
//                                                 boxShadow: 'none !important'
//                                             }),
//                                             valueContainer: (provided) => ({
//                                                 ...provided,
//                                                 height: '42px',
//                                                 padding: '0 8px'
//                                             }),
//                                             input: (provided) => ({
//                                                 ...provided,
//                                                 margin: '0',
//                                                 padding: '0'
//                                             }),
//                                             menu: (provided) => ({
//                                                 ...provided,
//                                                 zIndex: 777
//                                             }),
//                                             indicatorsContainer: (provided) => ({
//                                                 ...provided,
//                                                 height: '42px'
//                                             })
//                                         }}
//                                     />
//                                 </label>
//                             </div> */}

//                             <div className="col-12 col-sm-6 mb-3 col-lg-4 d-none d-lg-flex">
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
//                                     <div className={`col-12 col-sm-6 mb-3 mb-sm-0 ${c_vfml['picker-field']}`}>
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

//                                     <div className={`col-12 col-sm-6 ${c_vfml['picker-field']}`}>
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
//                             <div className="col-12 col-sm-6 mb-3 col-lg-4 d-lg-none">
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

//                             <div className={`col-12 col-sm-6 col-lg-4 align-items-end pb-2 m-0 my-2 d-flex justify-content-between`}>
//                                 <div className="d-flex gap-2">
//                                     <button aria-label="Tìm kiếm" type="button" className={`btn bg-main-blue text-white`} onClick={handleSearch}>
//                                         <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon> Tìm
//                                     </button>
//                                     <button aria-label="Làm mới" type="button" className={`btn bg-grey text-white`} onClick={handleResetFilter}>
//                                         <FontAwesomeIcon icon={faRefresh}></FontAwesomeIcon>
//                                     </button>
//                                 </div>
//                                 {!isViewer && <Link
//                                     style={{ minHeight: "42px" }}
//                                     href={ACCESS_LINKS.HC_DHN_ADD.src}
//                                     className="btn bg-main-green text-white"
//                                 >
//                                     Thêm mới
//                                 </Link>}

//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white w-100 shadow-sm rounded position-relative overflow-hidden">
//                         {filterLoading && <Loading />}
//                         <div className={`m-0 p-0 w-100 w-100 position-relative ${c_vfml['wrap-process-table']}`}>
//                             {/* {paginatedData.length > 0 ? ( */}
//                             {paginatedData && paginatedData.length > 0 ? (
//                                 <table className={`table table-striped table-bordered table-hover ${c_vfml['process-table']}`}>
//                                     <thead>
//                                         <tr className={`${c_vfml['table-header']}`}>
//                                             <th className="text-center">
//                                                 STT
//                                             </th>
//                                             <th className="text-center">
//                                                 Mã nhóm
//                                             </th>
//                                             <th onClick={() => sortData('ten_dong_ho')}>
//                                                 <div className={`${c_vfml['table-label']}`}>
//                                                     <span>
//                                                         Tên đồng hồ
//                                                     </span>
//                                                     {sortConfig && sortConfig.key === 'ten_dong_ho' && sortConfig.direction === 'asc' && (
//                                                         <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
//                                                     )}
//                                                     {sortConfig && sortConfig.key === 'ten_dong_ho' && sortConfig.direction === 'desc' && (
//                                                         <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
//                                                     )}
//                                                 </div>
//                                             </th>
//                                             <th onClick={() => sortData('so_luong')}>
//                                                 <div className={`${c_vfml['table-label']}`}>
//                                                     <span>
//                                                         Số lượng
//                                                     </span>
//                                                     {sortConfig && sortConfig.key === 'so_luong' && sortConfig.direction === 'asc' && (
//                                                         <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
//                                                     )}
//                                                     {sortConfig && sortConfig.key === 'so_luong' && sortConfig.direction === 'desc' && (
//                                                         <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
//                                                     )}
//                                                 </div>
//                                             </th>
//                                             {/* {!isAuthorizing && <> */}
//                                             <th onClick={() => sortData('ten_khach_hang')}>
//                                                 <div className={`${c_vfml['table-label']}`}>
//                                                     <span>
//                                                         Tên khách hàng
//                                                     </span>
//                                                     {sortConfig && sortConfig.key === 'ten_khach_hang' && sortConfig.direction === 'asc' && (
//                                                         <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
//                                                     )}
//                                                     {sortConfig && sortConfig.key === 'ten_khach_hang' && sortConfig.direction === 'desc' && (
//                                                         <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
//                                                     )}
//                                                 </div>
//                                             </th>
//                                             <th onClick={() => sortData('nguoi_thuc_hien')}>
//                                                 <div className={`${c_vfml['table-label']}`}>
//                                                     <span>
//                                                         Người thực hiện
//                                                     </span>
//                                                     {sortConfig && sortConfig.key === 'nguoi_thuc_hien' && sortConfig.direction === 'asc' && (
//                                                         <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
//                                                     )}
//                                                     {sortConfig && sortConfig.key === 'nguoi_thuc_hien' && sortConfig.direction === 'desc' && (
//                                                         <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
//                                                     )}
//                                                 </div>
//                                             </th>
//                                             {/* </>} */}
//                                             <th onClick={() => sortData('ngay_thuc_hien')}>
//                                                 <div className={`${c_vfml['table-label']}`}>
//                                                     <span>
//                                                         Ngày thực hiện
//                                                     </span>
//                                                     {sortConfig && sortConfig.key === 'ngay_thuc_hien' && sortConfig.direction === 'asc' && (
//                                                         <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
//                                                     )}
//                                                     {sortConfig && sortConfig.key === 'ngay_thuc_hien' && sortConfig.direction === 'desc' && (
//                                                         <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
//                                                     )}
//                                                 </div>
//                                             </th>

//                                             {/* {(isAdmin && !isAuthorizing) && <th>
//                                                 <div className={`${c_vfml['table-label']} p-0`} style={{ minWidth: "96px" }}>
//                                                     Đã thu tiền
//                                                 </div>
//                                             </th>} */}
//                                             <th></th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {/* {paginatedData.map((item, index) => ( */}
//                                         {data.map((item, index) => {
//                                             const redirectLink = `${ACCESS_LINKS.HC_DHN_DETAIL_NDH.src}/${item.group_id}`;

//                                             let handleClick = () => window.open(redirectLink);

//                                             return (
//                                                 <tr
//                                                     key={index}
//                                                     style={{ cursor: 'pointer' }}
//                                                 >
//                                                     <td className="text-center">{(limit * (currentPage - 1)) + Number(data.indexOf(item) + 1)}</td>
//                                                     <td>{item.group_id}</td>
//                                                     <td>{item.ten_dong_ho}</td>
//                                                     <td>{item.so_luong}</td>
//                                                     <td>{item.ten_khach_hang}</td>
//                                                     <td>{item.nguoi_thuc_hien}</td>
//                                                     <td>{dayjs(item.ngay_thuc_hien).format('DD-MM-YYYY')}</td>
//                                                     {/* {(isAdmin && !isAuthorizing) && <td>
//                                                         <div className="w-100 d-flex justify-content-center" onClick={() => handleUpdatePaymentStatus(item?.group_id || "", item?.is_paid ?? false)}>
//                                                             <Form.Check
//                                                                 type="checkbox"
//                                                                 style={{ width: "100px" }}
//                                                                 className="d-flex justify-content-center"
//                                                                 label={
//                                                                     <span className="ms-1" style={{ color: 'black', cursor: 'pointer' }}>{(item?.is_paid ?? false) ? "Đã thu" : "Chưa thu"}</span>
//                                                                 }
//                                                                 checked={item?.is_paid ?? false}
//                                                                 onChange={() => handleUpdatePaymentStatus(item?.group_id || "", item?.is_paid ?? false)}
//                                                             />
//                                                         </div>
//                                                     </td>} */}
//                                                     <td style={{ width: "90px" }}>
//                                                         <div className="w-100 m-0 p-0 d-flex align-items-center justify-content-center">
//                                                             <button aria-label="Xem" onClick={handleClick} className={`btn p-1 w-100 text-blue shadow-0`}>
//                                                                 <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
//                                                             </button>
//                                                             <Link aria-label="Chỉnh sửa" href={ACCESS_LINKS.HC_DHN_EDIT_NDH.src + "/" + item.group_id} className={`btn w-100 text-blue shadow-0`}>
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