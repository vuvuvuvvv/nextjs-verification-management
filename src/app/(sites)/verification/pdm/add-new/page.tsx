"use client"

import ErrorCaculatorTab from "@/components/error-caculator-tab";
import ErrorCaculatorForm from "@/components/error-caculator-form";
import vrfWm from "@styles/scss/ui/vfm.module.scss"
import loading from "@styles/scss/components/loading.module.scss"
import { Suspense, useEffect, useState } from "react";


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { viVN } from "@mui/x-date-pickers/locales";

import dayjs, { Dayjs } from "dayjs";

import { accuracyClassOptions, measureInstrumentNameOptions, typeOptions } from "@lib/system-constant";

import Select, { GroupBase } from 'react-select';
import { PDM } from "@lib/types";
import Swal from "sweetalert2";
import { createPDM, getPDMBySoQDPDM } from "@/app/api/pdm/route";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";


interface AddNewPDMProps {
    className?: string,
}

interface TabState {
    [key: number | string]: boolean;
};

export default function AddNewPDM({ className }: AddNewPDMProps) {

    const [deviceName, setDeviceName] = useState<string>("");                               // Tên phương tiện đo
    const [tenDongHo, setTenDongHo] = useState<string>("");                                 // Tên đồng hồ
    const [kieuChiThi, setKieuChiThi] = useState<string>("");                               // Kiểu chỉ thị
    const [kieuSensor, setKieuSensor] = useState<string>("");                               // Kiểu sensor
    const [manufacturer, setManufacturer] = useState<string>("");                           // Cơ sở sản xuất
    const [address, setAddress] = useState<string>("");                                     // Cơ sở sản xuất
    const [DN, setDN] = useState<string>("");                                               // Đường kính danh định

    const [CCX, setCCX] = useState<string | null>(null);                // Cấp chính xác
    const [q3, setQ3] = useState<string>("");                                               // Q3
    const [R, setR] = useState<string>("");                                         // Tỷ số Q3/Q1 (R)
    const [qn, setQN] = useState<string>("");                                               // QN

    const [donViPDM, setDonViPDM] = useState<string>("");                                     // QN
    const [soQDPDM, setSoQDPDM] = useState<string>("");                                     // K hiệu PDM/Số quyết định PDM
    const [ngayQuyetDinh, setNgayQuyetDinh] = useState<Date | null>(null);                  // Ngày thực hiện
    const [ngayHetHan, setNgayHetHan] = useState<Date | null>(null);                        // Ngày thực hiện
    const [maTimDongHoPDM, setMaTimDongHoPDM] = useState<string>("");                                               // QN

    const [isDHDienTu, setDHDienTu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errorSoQDPDM, setErrorSoQDPDM] = useState("");
    const router = useRouter();

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
        const formatString = (str: string) => str.replace(/\s+/g, '').toUpperCase();
        const newMaTimDongHoPDM = [
            tenDongHo,
            DN,
            CCX,
            kieuSensor,
            kieuChiThi,
            qn,
            q3,
            R
        ].map((value) => formatString(value || '')).join('');
        setMaTimDongHoPDM(newMaTimDongHoPDM);
    }, [tenDongHo, DN, CCX, kieuSensor, kieuChiThi, qn, q3, R]);

    // useEffect(() => {
    //     if (soQDPDM) {
    //         // setLoading(true);
    //         const debounce = setTimeout(async () => {
    //             try {
    //                 const res = await getPDMBySoQDPDM(soQDPDM);
    //                 if (res.status == 200) {
    //                     setErrorSoQDPDM("Số quyết định PDM đã tồn tại!")
    //                 } else if (res.status == 404) {
    //                     setErrorSoQDPDM("");
    //                 } else {
    //                     console.error(res);
    //                     setError("Có lỗi đã xảy ra!");
    //                 }
    //             } catch (error) {
    //                 console.error('Error fetching PDM data:', error);
    //                 setError("Có lỗi đã xảy ra!");
    //             } finally {
    //                 // setLoading(false);
    //             }
    //         }, 1200);
    //         return () => clearTimeout(debounce);
    //     }
    // }, [soQDPDM]);

    // truyền setter vào để lưu giá trị vào state
    const handleNumberChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setter(value);
        }
    };

    const handleSubmit = async () => {
        const pdm: PDM = {
            ma_tim_dong_ho_pdm: maTimDongHoPDM,
            ten_dong_ho: tenDongHo,
            noi_san_xuat: manufacturer,
            dn: DN,
            ccx: CCX,
            kieu_sensor: kieuSensor,
            transmitter: kieuChiThi,
            qn: qn,
            q3: q3,
            r: R,
            don_vi_pdm: donViPDM,
            dia_chi: address,
            so_qd_pdm: soQDPDM,
            ngay_qd_pdm: ngayQuyetDinh,
            ngay_het_han: ngayHetHan,
            anh_pdm: null,
        };

        try {
            const response = await createPDM(pdm);
            if (response.status == 201) {
                Swal.fire({
                    icon: "success",
                    showClass: {
                        popup: `
                          animate__animated
                          animate__fadeInUp
                          animate__faster
                        `
                    },
                    html: "Tạo phê duyệt mẫu thành công!",
                    timer: 1500,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                        Swal.showLoading();
                        router.push("/verification/pdm");
                    }
                });
            } else {
                console.log(response)
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: response.msg,
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
                    confirmButtonText: "OK",
                    showCancelButton: true,
                    cancelButtonText: 'Xem chi tiết',
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        cancelButton: 'btn btn-warning me-2'
                    },
                    buttonsStyling: false,
                    reverseButtons: true,
                }).then((result) => {
                    if (result.isDismissed) {
                        window.open('/verification/pdm/detail/' + response.data.ma_tim_dong_ho_pdm, '_blank');
                    }
                    setError("");
                });
            }
        } catch (err) {
            setError("Đã có lỗi xảy ra. Vui lòng thử lại!");
        }
    }

    useEffect(() => {
        setQ3("");
        setR("");
        setQN("");
        setKieuSensor("");
        setKieuChiThi("");
        setDHDienTu(deviceName !== "" && measureInstrumentNameOptions.find(option => option.label == deviceName)?.value == "1");
    }, [CCX, deviceName]);


    const renderCCXFields = () => {
        // Check có phải đồng hồ đtu hay không : value: "1"
        if ((CCX && (CCX == "1" || CCX == "2")) || isDHDienTu) {
            return <>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="q3" className="form-label">- Q<sub>3</sub>:</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            id="q3"
                            placeholder="Q3"
                            value={q3}
                            onChange={handleNumberChange(setQ3)}
                            pattern="\d*"
                        />
                        <span className="input-group-text" id="basic-addon2">m<sup>3</sup>/h</span>
                    </div>
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="R" className="form-label">- Tỷ số Q<sub>3</sub>/Q<sub>1</sub> (R):</label>
                    <input
                        type="text"
                        className="form-control"
                        id="R"
                        placeholder="Tỷ số Q3/Q1 (R)"
                        value={R}
                        onChange={handleNumberChange(setR)}
                        pattern="\d*"
                    />
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="kieuChiThi" className="form-label">- Kiểu chỉ thị:</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            id="kieuChiThi"
                            placeholder="Kiểu chỉ thị"
                            value={kieuChiThi}
                            onChange={(e) => setKieuChiThi(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mb-3 col-12 col-md-6">
                    <label htmlFor="kieuSensor" className="form-label">-  Kiểu sensor:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="kieuSensor"
                        placeholder="Kiểu sensor"
                        value={kieuSensor}
                        onChange={(e) => setKieuSensor(e.target.value)}
                    />
                </div>
            </>
        }

        return <>
            <div className="mb-3 col-12 col-md-6">
                <label htmlFor="qn" className="form-label">- Q<sub>n</sub>:</label>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        id="qn"
                        placeholder="Qn"
                        value={qn}
                        onChange={handleNumberChange(setQN)}
                        pattern="\d*"
                    />
                    <span className="input-group-text" id="basic-addon2">m<sup>3</sup>/h</span>
                </div>
            </div>
            <div className="mb-3 col-12 col-md-6">
                <label htmlFor="kieuSensor" className="form-label">- Kiểu sensor:</label>
                <input
                    type="text"
                    className="form-control"
                    id="kieuSensor"
                    placeholder="Kiểu sensor"
                    value={kieuSensor}
                    onChange={(e) => setKieuSensor(e.target.value)}
                />
            </div>
        </>
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            <div className={`${className ? className : ""} ${vrfWm['wraper']} container p-0 px-2 py-3 w-100`}>
                {loading && <Suspense fallback={<div>Loading...</div>}><Loading /></Suspense>}
                <div className={`row m-0 mb-3 p-3 w-100 bg-white shadow-sm`}>
                    <div className="w-100 m-0 p-0 mb-3 position-relative">
                        <h3 className="text-uppercase fw-bolder text-center mt-3 mb-0">thêm mới phê duyệt mẫu</h3>
                    </div>
                    <div className={`w-100 mt-2 p-0`}>
                        <form className="w-100">
                            <label className="w-100 fs-5 fw-bold">Thông tin thiết bị:</label>
                            <div className="row mx-0 w-100 mb-3">
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="tenDongHo" className="form-label">Tên đồng hồ:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tenDongHo"
                                        placeholder="Tên đồng hồ"
                                        value={tenDongHo}
                                        onChange={(e) => setTenDongHo(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="manufacturer" className="form-label">Cơ sở sản xuất:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="manufacturer"
                                        placeholder="Cơ sở sản xuất"
                                        value={manufacturer}
                                        onChange={(e) => setManufacturer(e.target.value)}
                                    />
                                </div>
                            </div>
                            <label className="w-100 fs-5 fw-bold">Đặc trưng kỹ thuật:</label>

                            <div className="row mx-0 w-100 mb-3">
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="deviceName" className="form-label">Tên phương tiện đo:</label>
                                    <Select
                                        name="deviceName"
                                        options={measureInstrumentNameOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="-- Chọn tên --"
                                        isClearable
                                        value={measureInstrumentNameOptions.find(option => option.label == deviceName) || null}
                                        onChange={(selectedOptions: any) => setDeviceName(selectedOptions ? selectedOptions.label : "")}
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
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="CCX" className="form-label">- Cấp chính xác:</label>
                                    <Select
                                        name="CCX"
                                        options={accuracyClassOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="-- Chọn cấp --"
                                        isClearable
                                        value={accuracyClassOptions.find(option => option.value === CCX) || null}
                                        onChange={(selectedOptions: any) => setCCX(selectedOptions ? selectedOptions.value : "")}
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
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="DN" className="form-label">- Đường kính danh định (DN):</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="DN"
                                            placeholder="DN"
                                            value={DN}
                                            onChange={handleNumberChange(setDN)}
                                            pattern="\d*"
                                        />
                                        <span className="input-group-text" id="basic-addon2">mm</span>
                                    </div>
                                </div>
                                {renderCCXFields()}
                            </div>
                            <label className="w-100 fs-5 fw-bold">Chi tiết:</label>
                            <div className="row mx-0 w-100 mb-3">

                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="donViPDM" className="form-label">Đơn vị phê duyệt:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="donViPDM"
                                        placeholder="Đơn vị"
                                        value={donViPDM}
                                        onChange={(e) => setDonViPDM(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="address" className="form-label">Địa chỉ:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        placeholder="Địa chỉ"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                {/* TODO: Check PDM  */}
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="soQDPDM" className="form-label">Ký hiệu PDM/Số quyết định PDM:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="soQDPDM"
                                        placeholder="Ký hiệu PDM/Số quyết định PDM"
                                        value={soQDPDM}
                                        onChange={(e) => setSoQDPDM(e.target.value)}
                                    />

                                    {errorSoQDPDM && (
                                        <div className="w-100 my-2">
                                            <small className="text-danger">{errorSoQDPDM}</small>
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="ngayQuyetDinh" className="form-label">Ngày quyết định:</label>
                                    <DatePicker
                                        className={`${vrfWm['date-picker']}`}
                                        value={dayjs(ngayQuyetDinh)}
                                        format="DD-MM-YYYY"
                                        maxDate={dayjs(ngayHetHan)}
                                        onChange={(newValue: Dayjs | null) => setNgayQuyetDinh(newValue ? newValue.toDate() : null)}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="ngayHetHan" className="form-label">Ngày hết hạn:</label>
                                    <DatePicker
                                        className={`${vrfWm['date-picker']}`}
                                        value={dayjs(ngayHetHan)}
                                        format="DD-MM-YYYY"
                                        minDate={dayjs(ngayQuyetDinh).add(1, 'day')}
                                        onChange={(newValue: Dayjs | null) => setNgayHetHan(newValue ? newValue.toDate() : null)}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </div>
                            </div>
                            <label className="w-100 fs-5 fw-bold">Mã tìm đồng hồ:</label>
                            <div className="row mx-0 w-100 mb-3">

                                <div className="mb-3 col-12 col-md-6">
                                    <input
                                        type="text"
                                        className="form-control bg-lighter-grey"
                                        id="maTimDongHoPDM"
                                        placeholder="Mã"
                                        value={maTimDongHoPDM}
                                        readOnly={true}
                                        disabled
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className={`w-100 mt-2 p-0 d-flex justify-content-end`}>
                        <button type="button" onClick={handleSubmit} className="btn text-white bg-main-green">
                            Thêm mới PDM
                        </button>
                    </div>
                </div>
            </div>
        </LocalizationProvider >
    )
}