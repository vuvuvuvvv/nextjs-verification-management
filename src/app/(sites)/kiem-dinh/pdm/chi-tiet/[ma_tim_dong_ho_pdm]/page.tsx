"use client"

import { deletePDM, getPDMByMaTimDongHoPDM } from "@/app/api/pdm/route";
import Loading from "@/components/loading";
import { PDM } from "@lib/types";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/app-context";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { viVN } from "@mui/x-date-pickers/locales";
import dayjs, { Dayjs } from "dayjs";
import Select, { GroupBase } from 'react-select';
import { ccxOptions } from "@lib/system-constant";
import vrfWm from "@styles/scss/ui/vfm.module.scss";
import Link from "next/link";

export default function Page({ params }: { params: { ma_tim_dong_ho_pdm: string } }) {
    const [pdmData, setPDMData] = useState<PDM | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { isUser } = useUser();
    const router = useRouter();
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const fetchCalled = useRef(false);

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

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await getPDMByMaTimDongHoPDM(params.ma_tim_dong_ho_pdm);
                setPDMData(res.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Có lỗi đã xảy ra!");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.ma_tim_dong_ho_pdm]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPDMData((prevData) => prevData ? { ...prevData, [name]: value } : null);
    };

    const handleSelectChange = (name: string, selectedOption: any) => {
        setPDMData((prevData) => prevData ? { ...prevData, [name]: selectedOption ? selectedOption.value : "" } : null);
    };

    const handleDateChange = (name: string, newValue: Dayjs | null) => {
        setPDMData((prevData) => prevData ? { ...prevData, [name]: newValue ? newValue.toDate() : null } : null);
    };

    const handleSubmit = async () => {
        if (!pdmData) return;

        // try {
        //     const response = await updatePDM(pdmData);
        //     if (response.status === 200) {
        //         Swal.fire({
        //             icon: "success",
        //             title: "Success",
        //             text: "PDM updated successfully!",
        //             confirmButtonText: "OK"
        //         }).then(() => {
        //             router.push("/kiem-dinh/pdm");
        //         });
        //     } else {
        //         Swal.fire({
        //             icon: "error",
        //             title: "Error",
        //             text: response.msg,
        //             confirmButtonText: "OK"
        //         });
        //     }
        // } catch (err) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Error",
        //         text: "An error occurred. Please try again!",
        //         confirmButtonText: "OK"
        //     });
        // }
    };

    const handleDelete = () => {
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
                    const res = await deletePDM(params.ma_tim_dong_ho_pdm);
                    if (res.status === 200) {
                        Swal.fire({
                            text: "Xóa thành công!",
                            icon: "success",
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "Có",
                        }).then(() => {
                            router.push("/kiem-dinh/pdm")
                        });
                    } else {
                        setError("Có lỗi đã xảy ra!");
                    }
                } catch (error) {
                    setError("Có lỗi đã xảy ra!");
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            <div className={`${vrfWm['wraper']} container p-0 px-2 py-3 w-100`}>
                <div className="row m-0 mb-3 p-3 w-100 bg-white shadow-sm">
                    <div className="w-100 m-0 p-0 mb-3 position-relative">
                        <h3 className="text-uppercase fw-bolder text-center mt-3 mb-0">{isEditing ? "Chỉnh sửa phê duyệt mẫu" : "Chi tiết phê duyệt mẫu"}</h3>
                    </div>
                    {isEditing ? (
                        <div className="w-100 mt-2 p-0">
                            <form className="w-100">
                                <label className="w-100 fs-5 fw-bold">Thông tin thiết bị:</label>
                                <div className="row mx-0 w-100 mb-3">
                                    {pdmData?.ten_dong_ho && (
                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="ten_dong_ho" className="form-label">Tên đồng hồ:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="ten_dong_ho"
                                                name="ten_dong_ho"
                                                value={pdmData.ten_dong_ho}
                                                onChange={handleInputChange}
                                                readOnly={isUser}
                                                disabled={isUser}
                                            />
                                        </div>
                                    )}
                                    {pdmData?.noi_san_xuat && (
                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="noi_san_xuat" className="form-label">Cơ sở sản xuất:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="noi_san_xuat"
                                                name="noi_san_xuat"
                                                value={pdmData.noi_san_xuat}
                                                onChange={handleInputChange}
                                                readOnly={isUser}
                                                disabled={isUser}
                                            />
                                        </div>
                                    )}
                                </div>
                                <label className="w-100 fs-5 fw-bold">Đặc trưng kỹ thuật:</label>
                                <div className="row mx-0 w-100 mb-3">
                                    {pdmData?.ccx && (
                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="ccx" className="form-label">- Cấp chính xác:</label>
                                            <Select
                                                name="ccx"
                                                options={ccxOptions as unknown as readonly GroupBase<never>[]}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                placeholder="-- Chọn cấp --"
                                                isClearable
                                                value={ccxOptions.find(option => option.value.toString() === pdmData?.ccx?.replace('.0', '')) || null}
                                                onChange={(selectedOptions: any) => handleSelectChange("ccx", selectedOptions)}
                                                isDisabled={isUser}
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        height: '42px',
                                                        minHeight: '42px',
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
                                        </div>
                                    )}
                                    {pdmData?.dn && (
                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="DN" className="form-label">- Đường kính danh định (DN):</label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="dn"
                                                    name="dn"
                                                    placeholder="dn"
                                                    value={pdmData.dn.replace('.0', '')}
                                                    onChange={handleInputChange}
                                                    readOnly={isUser}
                                                    disabled={isUser}
                                                />
                                                <span className="input-group-text">mm</span>
                                            </div>
                                        </div>
                                    )}
                                    {pdmData?.q3 && (
                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="q3" className="form-label">- Q<sub>3</sub>:</label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="q3"
                                                    name="q3"
                                                    placeholder="Q3"
                                                    value={pdmData.q3.replace('.0', '')}
                                                    onChange={handleInputChange}
                                                    readOnly={isUser}
                                                    disabled={isUser}
                                                />
                                                <span className="input-group-text">m<sup>3</sup>/h</span>
                                            </div>
                                        </div>
                                    )}
                                    {pdmData?.r && (
                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="R" className="form-label">- Tỷ số Q<sub>3</sub>/Q<sub>1</sub> (R):</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="r"
                                                name="r"
                                                placeholder="Tỷ số Q3/Q1 (R)"
                                                value={pdmData.r.replace('.0', '')}
                                                onChange={handleInputChange}
                                                readOnly={isUser}
                                                disabled={isUser}
                                            />
                                        </div>
                                    )}
                                    {pdmData?.kieu_sensor && (
                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="kieu_sensor" className="form-label">- Kiểu sensor:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="kieu_sensor"
                                                name="kieu_sensor"
                                                placeholder="Kiểu sensor"
                                                value={pdmData.kieu_sensor}
                                                onChange={handleInputChange}
                                                readOnly={isUser}
                                                disabled={isUser}
                                            />
                                        </div>
                                    )}
                                    {pdmData?.transmitter && (
                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="transmitter" className="form-label">- Kiểu chỉ thị:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="transmitter"
                                                name="transmitter"
                                                placeholder="Kiểu chỉ thị"
                                                value={pdmData.transmitter}
                                                onChange={handleInputChange}
                                                readOnly={isUser}
                                                disabled={isUser}
                                            />
                                        </div>
                                    )}
                                </div>
                                <label className="w-100 fs-5 fw-bold">Chi tiết:</label>
                                <div className="row mx-0 w-100 mb-3">
                                    {pdmData?.don_vi_pdm && (
                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="don_vi_pdm" className="form-label">Đơn vị phê duyệt:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="don_vi_pdm"
                                                name="don_vi_pdm"
                                                placeholder="Đơn vị"
                                                value={pdmData.don_vi_pdm}
                                                onChange={handleInputChange}
                                                readOnly={isUser}
                                                disabled={isUser}
                                            />
                                        </div>
                                    )}
                                    {pdmData?.dia_chi && (
                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="dia_chi" className="form-label">Địa chỉ:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="dia_chi"
                                                name="dia_chi"
                                                placeholder="Địa chỉ"
                                                value={pdmData.dia_chi}
                                                onChange={handleInputChange}
                                                readOnly={isUser}
                                                disabled={isUser}
                                            />
                                        </div>
                                    )}
                                    {pdmData?.so_qd_pdm && (
                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="so_qd_pdm" className="form-label">Ký hiệu PDM/Số quyết định PDM:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="so_qd_pdm"
                                                name="so_qd_pdm"
                                                placeholder="Ký hiệu PDM/Số quyết định PDM"
                                                value={pdmData.so_qd_pdm}
                                                onChange={handleInputChange}
                                                readOnly={isUser}
                                                disabled={isUser}
                                            />
                                        </div>
                                    )}
                                    {pdmData?.ngay_qd_pdm && (
                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="ngay_qd_pdm" className="form-label">Ngày quyết định:</label>
                                            <DatePicker
                                                className={`${vrfWm['date-picker']}`}
                                                value={dayjs(pdmData.ngay_qd_pdm)}
                                                format="DD-MM-YYYY"
                                                maxDate={dayjs(pdmData.ngay_het_han)}
                                                onChange={(newValue: Dayjs | null) => handleDateChange("ngay_qd_pdm", newValue)}
                                                slotProps={{ textField: { fullWidth: true } }}
                                                disabled={isUser}
                                            />
                                        </div>
                                    )}
                                    {pdmData?.ngay_het_han && (
                                        <div className="mb-3 col-12 col-md-6">
                                            <label htmlFor="ngay_het_han" className="form-label">Ngày hết hạn:</label>
                                            <DatePicker
                                                className={`${vrfWm['date-picker']}`}
                                                value={dayjs(pdmData.ngay_het_han)}
                                                format="DD-MM-YYYY"
                                                minDate={dayjs(pdmData.ngay_qd_pdm).add(1, 'day')}
                                                onChange={(newValue: Dayjs | null) => handleDateChange("ngay_het_han", newValue)}
                                                slotProps={{ textField: { fullWidth: true } }}
                                                disabled={isUser}
                                            />
                                        </div>
                                    )}
                                </div>
                                <label className="w-100 fs-5 fw-bold">Mã tìm đồng hồ:</label>
                                <div className="row mx-0 w-100 mb-3">
                                    <div className="mb-3 col-12 col-md-6">
                                        <input
                                            type="text"
                                            className="form-control bg-lighter-grey"
                                            id="ma_tim_dong_ho_pdm"
                                            name="ma_tim_dong_ho_pdm"
                                            placeholder="Mã"
                                            value={pdmData?.ma_tim_dong_ho_pdm || ""}
                                            readOnly={true}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </form>
                            <div className="w-100 mt-2 p-0 d-flex justify-content-end gap-3">
                                <button type="button" onClick={() => setIsEditing(!isEditing)} className="btn text-white bg-warning">
                                    Hủy
                                </button>
                                <button type="button" onClick={handleSubmit} className="btn text-white bg-main-green">
                                    Cập nhật PDM
                                </button>
                                <button type="button" onClick={handleDelete} className="btn text-white bg-danger">
                                    Xóa PDM
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-100 mt-2 p-3">
                                <label className="w-100 fs-5 fw-bold">Mã tìm đồng hồ:</label>
                                <div className="row mx-0 w-100 mb-3">
                                    <div className="mb-3 col-12">
                                        <span className="fs-5 fw-light">{pdmData?.ma_tim_dong_ho_pdm || ""}</span>
                                    </div>
                                </div>
                                <label className="w-100 fs-5 fw-bold">Thông tin thiết bị:</label>
                                <div className="row mx-0 w-100 mb-3">
                                    {pdmData?.ten_dong_ho && (
                                        <div className="mb-3 col-12">
                                            <label className="form-label fw-bold me-3">Tên đồng hồ:</label>
                                            <span className="fs-5 fw-light">{pdmData.noi_san_xuat}</span>
                                        </div>
                                    )}
                                </div>
                                <label className="w-100 fs-5 fw-bold">Đặc trưng kỹ thuật:</label>
                                <div className="row mx-0 w-100 mb-3">
                                    {pdmData?.ccx && (
                                        <div className="mb-3 col-12 col-md-6 col-xl-4">
                                            <label className="form-label fw-bold me-3">- Cấp chính xác:</label>
                                            <span className="fs-5 fw-light">{pdmData.ccx.replace('.0', '')}</span>
                                        </div>
                                    )}
                                    {pdmData?.dn && (
                                        <div className="mb-3 col-12 col-md-6 col-xl-4">
                                            <label className="form-label fw-bold me-3">- Đường kính danh định (DN):</label>
                                            <span className="fs-5 fw-light">{pdmData.dn.replace('.0', '')} mm</span>
                                        </div>
                                    )}
                                    {pdmData?.q3 && (
                                        <div className="mb-3 col-12 col-md-6 col-xl-4">
                                            <label className="form-label fw-bold me-3">- Q<sub>3</sub>:</label>
                                            <span className="fs-5 fw-light">{pdmData.q3.replace('.0', '')} m<sup>3</sup>/h</span>
                                        </div>
                                    )}
                                    {pdmData?.r && (
                                        <div className="mb-3 col-12 col-md-6 col-xl-4">
                                            <label className="form-label fw-bold me-3">- Tỷ số Q<sub>3</sub>/Q<sub>1</sub> (R):</label>
                                            <span className="fs-5 fw-light">{pdmData.r.replace('.0', '')}</span>
                                        </div>
                                    )}
                                    {pdmData?.kieu_sensor && (
                                        <div className="mb-3 col-12 col-md-6 col-xl-4">
                                            <label className="form-label fw-bold me-3">- Kiểu sensor:</label>
                                            <span className="fs-5 fw-light">{pdmData.kieu_sensor}</span>
                                        </div>
                                    )}
                                    {pdmData?.transmitter && (
                                        <div className="mb-3 col-12 col-md-6 col-xl-4">
                                            <label className="form-label fw-bold me-3">- Kiểu chỉ thị:</label>
                                            <span className="fs-5 fw-light">{pdmData.transmitter}</span>
                                        </div>
                                    )}
                                </div>
                                <label className="w-100 fs-5 fw-bold">Chi tiết:</label>
                                <div className="row mx-0 w-100 mb-3">
                                    {pdmData?.don_vi_pdm && (
                                        <div className="mb-3 col-12 col-md-6 col-xl-4">
                                            <label className="form-label fw-bold me-3">Đơn vị phê duyệt:</label>
                                            <span className="fs-5 fw-light">{pdmData.don_vi_pdm}</span>
                                        </div>
                                    )}
                                    {pdmData?.dia_chi && (
                                        <div className="mb-3 col-12 col-md-6 col-xl-4">
                                            <label className="form-label fw-bold me-3">Địa chỉ:</label>
                                            <span className="fs-5 fw-light">{pdmData.dia_chi}</span>
                                        </div>
                                    )}
                                    {pdmData?.so_qd_pdm && (
                                        <div className="mb-3 col-12 col-md-6 col-xl-4">
                                            <label className="form-label fw-bold me-3">Ký hiệu PDM/Số quyết định PDM:</label>
                                            <span className="fs-5 fw-light">{pdmData.so_qd_pdm}</span>
                                        </div>
                                    )}
                                    {pdmData?.ngay_qd_pdm && (
                                        <div className="mb-3 col-12 col-md-6 col-xl-4">
                                            <label className="form-label fw-bold me-3">Ngày quyết định:</label>
                                            <span className="fs-5 fw-light">{dayjs(pdmData.ngay_qd_pdm).format("DD-MM-YYYY")}</span>
                                        </div>
                                    )}
                                    {pdmData?.ngay_het_han && (
                                        <div className="mb-3 col-12 col-md-6 col-xl-4">
                                            <label className="form-label fw-bold me-3">Ngày hết hạn:</label>
                                            <span className="fs-5 fw-light">{dayjs(pdmData.ngay_het_han).format("DD-MM-YYYY")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-100 mt-2 px-3 d-flex justify-content-end gap-3">

                                {!isUser && (
                                    <button type="button" onClick={() => setIsEditing(!isEditing)} className="btn text-white bg-warning">
                                        Chỉnh sửa
                                    </button>
                                )}
                                <Link href={"/kiem-dinh/pdm"} className="btn btn-primary">
                                    Quay lại
                                </Link>
                            </div>
                        </>
                    )
                    }
                </div>
            </div>
        </LocalizationProvider>
    );
}