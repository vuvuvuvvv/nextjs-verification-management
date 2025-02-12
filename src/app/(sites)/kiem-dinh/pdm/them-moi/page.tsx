"use client"
import vrfWm from "@styles/scss/ui/vfm.module.scss"
import { useEffect, useMemo, useRef, useState } from "react";


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { viVN } from "@mui/x-date-pickers/locales";

import dayjs, { Dayjs } from "dayjs";

import { ACCESS_LINKS, BASE_API_URL, ccxOptions, phuongTienDoOptions, typeOptions } from "@lib/system-constant";

import Select, { GroupBase } from 'react-select';
import { PDM, PDMData } from "@lib/types";
import Swal from "sweetalert2";
import { createPDM, getPDMByMaTimDongHoPDM, getPDMBySoQDPDM } from "@/app/api/pdm/route";
import { useRouter } from "next/navigation";
import api from "@/app/api/route";
import CreatableSelect from "react-select/creatable";
import { convertToUppercaseNonAccent } from "@lib/system-function";


interface AddNewPDMProps {
    className?: string,
}

export default function AddNewPDM({ className }: AddNewPDMProps) {

    const [deviceName, setDeviceName] = useState<string>("");                          
    const [tenDongHo, setTenDongHo] = useState<string>("");                             
    const [kieuSensor, setKieuSensor] = useState<string>("");                            
    const [noiSanXuat, setNoiSanXuat] = useState<string>("");                           
    const [DN, setDN] = useState<string>("");                                      
    const [CCX, setCCX] = useState<string | null>(null); 
    const [q3, setQ3] = useState<string>("");                                 
    const [R, setR] = useState<string>("");                                      
    const [qn, setQN] = useState<string>("");                                          
    const [donViPDM, setDonViPDM] = useState<string>("");                               
    const [soQDPDM, setSoQDPDM] = useState<string>("");                                    
    const [ngayQuyetDinh, setNgayQuyetDinh] = useState<Date | null>(null);                
    const [ngayHetHan, setNgayHetHan] = useState<Date | null>(null);                      
    const [errorSoQDPDM, setErrorSoQDPDM] = useState("");
    const [errorMaTimDHPDM, setErrorMaTimDHPDM] = useState("");

    const [address, setAddress] = useState<string>("");
    const [kieuChiThi, setKieuChiThi] = useState<string>("");                           

    const [maTimDongHoPDM, setMaTimDongHoPDM] = useState<string>("");                                       

    const [isDHDienTu, setDHDienTu] = useState(false);
    const [error, setError] = useState("");
    const [canSave, setCanSave] = useState(false);
    const router = useRouter();

    const fetchDHNameCalled = useRef(false);
    const [selectedTenDHOption, setSelectedTenDHOption] = useState('');
    const [DHNameOptions, setDHNameOptions] = useState<{ value: string, label: string }[]>([]);
    const [selectedCssxOption, setSelectedCssxOption] = useState('');
    const [CSSXOptions, setCSSXOptions] = useState<{ value: string, label: string }[]>([]);

    useEffect(() => {
        const isFormValid = 
            deviceName.trim() !== "" && 
            tenDongHo.trim() !== "" &&
            kieuSensor.trim() !== "" && 
            noiSanXuat.trim() !== "" && 
            DN.trim() !== "" && 
            CCX !== null && 
            ((q3.trim() !== "" && R.trim() !== "") || qn.trim() !== "") && 
            donViPDM.trim() !== "" && 
            soQDPDM.trim() !== "" && 
            ngayQuyetDinh !== null && 
            ngayHetHan !== null && 
            errorSoQDPDM === "" && 
            errorMaTimDHPDM === "";
        setCanSave(isFormValid);
    }, [
        deviceName, 
        tenDongHo, 
        kieuSensor, 
        noiSanXuat, 
        DN, 
        CCX, 
        q3, 
        R, 
        qn, 
        donViPDM, 
        soQDPDM, 
        ngayQuyetDinh, 
        ngayHetHan, 
        errorSoQDPDM, 
        errorMaTimDHPDM
    ]);

    // Query dongho name
    useEffect(() => {
        if (fetchDHNameCalled.current) return;
        fetchDHNameCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await api.get(`${BASE_API_URL}/pdm`);
                const listNames: string[] = [...res.data.map((pdm: PDMData) => pdm["ten_dong_ho"])]
                const uniqueNames = listNames.filter((value, index, self) => self.indexOf(value) === index);
                const sortedNames = uniqueNames.sort((a, b) => a.localeCompare(b));
                setDHNameOptions(sortedNames && sortedNames.length > 0 ? [
                    ...sortedNames
                        .filter(name => name && name.trim() !== "")
                        .map((name) => ({ value: name, label: name }))
                ] : []);

                const listCSSX: string[] = [...res.data.map((pdm: PDMData) => pdm["noi_san_xuat"])]
                const uniqueCSSX = listCSSX.filter((value, index, self) => self.indexOf(value) === index);
                const sortedCSSX = uniqueCSSX.sort((a, b) => a.localeCompare(b));
                setCSSXOptions(sortedCSSX && sortedCSSX.length > 0 ? [
                    ...sortedCSSX
                        .filter(name => name && name.trim() !== "")
                        .map((name) => ({ value: name, label: name }))
                ] : []);
            } catch (error) {
                setError("Đã có lỗi xảy ra! Hãy thử lại sau.");
            }
        };

        fetchData();
    }, []);

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
            noi_san_xuat: noiSanXuat,
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
                        router.push(ACCESS_LINKS.PDM.src);
                    }
                });
            } else {
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
                        window.open(ACCESS_LINKS.PDM_DETAIL.src + '/' + response.data.ma_tim_dong_ho_pdm, '_blank');
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
        setDHDienTu(deviceName !== "" && phuongTienDoOptions.find(option => option.label == deviceName)?.value == "1");
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
                        <span className="input-group-text">m<sup>3</sup>/h</span>
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
                    <span className="input-group-text">m<sup>3</sup>/h</span>
                </div>
            </div>
        </>
    }

    const filterMaTimDHPDM = useMemo(() => ({
        tenDongHo: tenDongHo,
        dn: DN,
        ccx: CCX,
        kieuSensor: kieuSensor,
        kieuChiThi: kieuChiThi,
        qn: qn,
        q3: q3,
        r: R
    }), [tenDongHo, DN, CCX, kieuSensor, kieuChiThi, qn, q3, R]);

    const soQDPDMRef = useRef(soQDPDM);

    // Func: Set err
    useEffect(() => {
        if (soQDPDMRef.current != soQDPDM) {
            setErrorSoQDPDM("");
            soQDPDMRef.current = soQDPDM
        }
    }, [soQDPDM]);

    const filterMaTimDHPDMRef = useRef(filterMaTimDHPDM);

    useEffect(() => {
        if (filterMaTimDHPDMRef.current !== filterMaTimDHPDM) {
            if (filterMaTimDHPDM.tenDongHo && filterMaTimDHPDM.dn && filterMaTimDHPDM.ccx && (filterMaTimDHPDM.kieuSensor || filterMaTimDHPDM.kieuChiThi) && ((filterMaTimDHPDM.q3 && filterMaTimDHPDM.r) || filterMaTimDHPDM.qn)) {
                const ma_tim_dong_ho_pdm = convertToUppercaseNonAccent(filterMaTimDHPDM.tenDongHo + filterMaTimDHPDM.dn + filterMaTimDHPDM.ccx + filterMaTimDHPDM.kieuSensor + filterMaTimDHPDM.kieuChiThi + filterMaTimDHPDM.q3 + filterMaTimDHPDM.r + filterMaTimDHPDM.qn);

                const handler = setTimeout(async () => {
                    const res = await getPDMByMaTimDongHoPDM(ma_tim_dong_ho_pdm);

                    if (res.status == 200 || res.status == 201) {
                        setErrorMaTimDHPDM("Đã tồn tại mã tìm đồng hồ PDM!")
                        setCanSave(false);
                    } else if (res.status == 404) {
                        setErrorMaTimDHPDM("")
                        setCanSave(true);
                    } else {
                        setErrorMaTimDHPDM("Có lỗi xảy ra khi lấy mã tìm đồng hồ PDM!")
                    }
                }, 500);

                return () => {
                    clearTimeout(handler);
                };

            }
            filterMaTimDHPDMRef.current = filterMaTimDHPDM;
        }
    }, [filterMaTimDHPDM]);

    const filterPDM = useMemo(() => ({
        soQDPDM: soQDPDM,
        ngayQuyetDinh: ngayQuyetDinh
    }), [soQDPDM, ngayQuyetDinh]);
    const filterPDMRef = useRef(filterPDM);

    useEffect(() => {
        if (filterPDMRef.current !== filterPDM) {
            if (filterPDM.soQDPDM && filterPDM.ngayQuyetDinh) {
                const soQD = filterPDM.soQDPDM + "-" + dayjs(filterPDM.ngayQuyetDinh).format("YYYY");
                const debounce = setTimeout(async () => {
                    try {
                        const res = await getPDMBySoQDPDM(soQD);
                        if (res.status == 200) {
                            setErrorSoQDPDM(`Số quyết định PDM: ${soQD} đã tồn tại!`)
                            setCanSave(false)
                        } else if (res.status == 404) {
                            setErrorSoQDPDM("");
                        } else {
                            console.error(res);
                            setError("Có lỗi đã xảy ra!");
                        }
                    } catch (error) {
                        console.error('Error fetching PDM data:', error);
                        setError("Có lỗi đã xảy ra!");
                    } finally {
                    }
                }, 1200);
                return () => clearTimeout(debounce);

            }
            filterPDMRef.current = filterPDM;
        }
    }, [filterPDM]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            <div className={`${className ? className : ""} ${vrfWm['wraper']} container p-0 px-2 py-3 w-100`}>
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
                                    <CreatableSelect
                                        options={DHNameOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        placeholder="Tên đồng hồ"
                                        classNamePrefix="select"
                                        isClearable
                                        id="ten_dong_ho"
                                        value={selectedTenDHOption}
                                        isSearchable
                                        onChange={(selectedOptions: any) => {
                                            if (selectedOptions) {
                                                const values = selectedOptions.value;

                                                setSelectedTenDHOption(selectedOptions);
                                                setTenDongHo(values);
                                            } else {
                                                setSelectedTenDHOption('');
                                                setTenDongHo("");
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
                                                display: DHNameOptions.length == 0 ? "none" : "flex",
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                display: DHNameOptions.length == 0 ? "none" : "",
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
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="noiSanXuat" className="form-label">Cơ sở sản xuất:</label>
                                    <CreatableSelect
                                        options={CSSXOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        placeholder="Cơ sở sản xuất"
                                        classNamePrefix="select"
                                        isClearable
                                        id="noi_san_xuat"
                                        value={selectedCssxOption}
                                        isSearchable
                                        onChange={(selectedOptions: any) => {
                                            if (selectedOptions) {
                                                const values = selectedOptions.value;

                                                setSelectedCssxOption(selectedOptions);
                                                setNoiSanXuat(values);
                                            } else {
                                                setSelectedCssxOption('');
                                                setNoiSanXuat("");
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
                                                display: CSSXOptions.length == 0 ? "none" : "flex",
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                display: CSSXOptions.length == 0 ? "none" : "",
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
                                </div>
                            </div>
                            <label className="w-100 fs-5 fw-bold">Đặc trưng kỹ thuật:</label>

                            <div className="row mx-0 w-100 mb-3">
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="deviceName" className="form-label">Tên phương tiện đo:</label>
                                    <Select
                                        name="deviceName"
                                        options={phuongTienDoOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="-- Chọn tên --"
                                        isClearable
                                        value={phuongTienDoOptions.find(option => option.label == deviceName) || null}
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
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="CCX" className="form-label">- Cấp chính xác:</label>
                                    <Select
                                        name="CCX"
                                        options={ccxOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="-- Chọn cấp --"
                                        isClearable
                                        value={ccxOptions.find(option => option.value === CCX) || null}
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
                                        <span className="input-group-text">mm</span>
                                    </div>
                                </div>
                                {renderCCXFields()}
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
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="kieuChiThi" className="form-label">- Kiểu chỉ thị (Transmitter):</label>
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
                                {errorSoQDPDM && (
                                    <div className="w-100 mb-3">
                                        <small className="text-danger">{errorSoQDPDM}</small>
                                    </div>
                                )}
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

                                    {errorMaTimDHPDM && (
                                        <div className="w-100 my-2">
                                            <small className="text-danger">{errorMaTimDHPDM}</small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className={`w-100 mt-2 p-0 d-flex justify-content-end`}>
                        <button aria-label="Thêm mới phê duyệt mẫu" disabled={!canSave} type="button" onClick={handleSubmit} className="btn text-white bg-main-green">
                            Thêm mới PDM
                        </button>
                    </div>
                </div>
            </div>
        </LocalizationProvider >
    )
}