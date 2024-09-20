"use client"

import TinhSaiSoTab from "@/components/tinh-sai-so-tab";
import TinhSaiSoForm from "@/components/tinh-sai-so-form";
import vrfWm from "@styles/scss/ui/vfm.module.scss"
import { useEffect, useRef, useState } from "react";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { viVN } from "@mui/x-date-pickers/locales";

import dayjs, { Dayjs } from "dayjs";

import NavTab from "@/components/nav-tab";
import { ccxOptions, phuongTienDoOptions, TITLE_LUU_LUONG, typeOptions } from "@lib/system-constant";

import Select, { GroupBase } from 'react-select';

import { useUser } from "@/context/app-context";
import { getQ2OrQtAndQ1OrQMin, isDongHoDatTieuChuan } from "@lib/system-function";
import Link from "next/link";
import { KiemDinhProvider, useKiemDinh } from "@/context/kiem-dinh";

interface NewProcessDNBiggerThan32Props {
    className?: string,
}

interface TabState {
    [key: number | string]: boolean;
};

export default function NewProcessDNBiggerThan32({ className }: NewProcessDNBiggerThan32Props) {

    const { user } = useUser();
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const [seriNumber, setSeriNumber] = useState<string>("");                                                                   // Serial number

    const [phuongTienDo, setPhuongTienDo] = useState<string>("");                                                         // Tên phương tiện đo
    const [seriChiThi, setSeriChiThi] = useState<string>("");                                                                   // Serial chỉ thị
    const [seriSensor, setSeriSensor] = useState<string>("");                                                                   // Serial sensor
    const [kieuChiThi, setKieuChiThi] = useState<string>("");                                                                   // Kiểu chỉ thị
    const [kieuSensor, setKieuSensor] = useState<string>("");                                                                   // Kiểu sensor

    const [kieuThietBi, setKieuThietBi] = useState<string>("");                                                                 // Kiểu
    const [soTem, setSoTem] = useState<string>("");                                                                             // Số
    const [coSoSanXuat, setCoSoSanXuat] = useState<string>("");                                                                 // Cơ sở sản xuất
    const [namSanXuat, setNamSanXuat] = useState<Date | null>(null);                                                            // Năm sản xuất
    const [dn, setDN] = useState<string>("");                                                                                   // Đường kính danh định
    const [d, setD] = useState<string>("");                                                                                     // Độ chia nhỏ nhất

    const [ccx, setCCX] = useState<string | null>(null);                                                                        // Cấp chính xác
    const [q3, setQ3] = useState<string>("");                                                                                   // Q3
    const [r, setR] = useState<string>("");                                                                             // Tỷ số Q3/Q1 (R)
    const [qn, setQN] = useState<string>("");                                                                                   // QN

    const [kFactor, setKFactor] = useState<string>("");                                                                         // k factor
    const [so_qd_pdm, setSoQDPDM] = useState<string>("");                                                                       // K hiệu PDM/Số quyết định PDM

    const [tenKhachHang, setTenKhachhang] = useState<string>("");
    const [coSoSuDung, setCoSoSuDung] = useState<string>("");                                                                   // Cơ sở sử dụng
    const [phuongPhapThucHien, setPhuongPhapThucHien] = useState<string>("ĐNVN 17:2017");                                       // Phương pháp thực hiện
    const [chuanThietBiSuDung, setChuanThietBiSuDung] = useState<string>("Đồng hồ chuẩn đo nước và Bình chuẩn");                // Chuẩn, thiết bị chính được sử dụng
    const [implementer, setImplementer] = useState<string>("");                                                                 // Người thực hiện
    const [ngayThucHien, setNgayThucHien] = useState<Date | null>(new Date());                                                  // Ngày thực hiện
    const [viTri, setViTri] = useState<string>("");                                                                             // Vị trí
    const [nhietDo, setNhietDo] = useState<string>('');                                                                         // Nhiệt độ
    const [doAm, setDoAm] = useState<string>('');                                                                               // Độ ẩm 

    const [isDHDienTu, setDHDienTu] = useState(false);

    const [q2Ort, setQ1OrQt] = useState<number | null>(null);
    const [q1Ormin, setQ2OrQmin] = useState<number | null>(null);

    const [formHieuSaiSo, setFormHieuSaiSo] = useState<{ hss: number | null }[]>([
        { hss: null },
        { hss: null },
        { hss: null },
    ]);

    // TODO: Dat tieu chuan:
    const handleFormHSSChange = (index: number, value: number) => {
        const newFormValues = [...formHieuSaiSo];
        newFormValues[index].hss = value;
        setFormHieuSaiSo(newFormValues);
        console.log("HSS: ", formHieuSaiSo);
        // console.log("Đạt tiêu chuẩn: ", isDongHoDatTieuChuan(isDHDienTu, newFormValues) ? "Đạt" : "Không");
    };

    useEffect(() => {
        if (q3 || qn) {
            // TODO: Tạo button check?
            console.log("Đạt tiêu chuẩn: ", isDongHoDatTieuChuan(isDHDienTu, formHieuSaiSo) ? "Đạt" : "Không");
        }
    }, [formHieuSaiSo])

    // Check Đồng hồ điện tử
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    // truyền setter vào để lưu giá trị vào state
    const handleNumberChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        // Replace commas with periods
        value = value.replace(/,/g, '.');
        // Allow only numbers and one decimal point
        if (/^\d*\.?\d*$/.test(value)) {
            setter(value);
        }
    };

    useEffect(() => {
        setQ3("");
        setR("");
        setQN("");
        setSeriChiThi("");
        setSeriSensor("");
        setKieuSensor("");
        setKieuChiThi("");
        setDHDienTu(phuongTienDo !== "" && phuongTienDoOptions.find(option => option.label == phuongTienDo)?.value == "1");
    }, [ccx, phuongTienDo]);

    useEffect(() => {
        if (ccx && phuongTienDo && ((q3 && r) || qn)) {
            const { getQ1OrMin, getQ2OrQt } = getQ2OrQtAndQ1OrQMin(isDHDienTu, ccx, q3, r);
            setQ2OrQmin(getQ1OrMin);
            setQ1OrQt(getQ2OrQt);
        }
    }, [ccx, phuongTienDo, q3, qn, r]);

    useEffect(() => {
        const humidity = parseFloat(doAm);
        if (humidity > 100) {
            setDoAm('100');
        } else if (humidity < 0) {
            setDoAm('0');
        }
    }, [doAm]);

    const renderccxFields = () => {
        // Check có phải đồng hồ đtu hay không : value: "1"
        if ((ccx && (ccx == "1" || ccx == "2")) || isDHDienTu) {
            return <>
                <div className="mb-3 col-12 col-md-6 col-xxl-4">
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
                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                    <label htmlFor="r" className="form-label">- Tỷ số Q<sub>3</sub>/Q<sub>1</sub> (R):</label>
                    <input
                        type="text"
                        className="form-control"
                        id="r"
                        placeholder="Tỷ số Q3/Q1 (R)"
                        value={r}
                        onChange={handleNumberChange(setR)}
                        pattern="\d*"
                    />
                </div>

                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                    <label htmlFor="seriChiThi" className="form-label">Serial chỉ thị:</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            id="seriChiThi"
                            placeholder="Serial chỉ thị"
                            value={seriChiThi}
                            onChange={(e) => setSeriChiThi(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                    <label htmlFor="kieuChiThi" className="form-label">Kiểu chỉ thị:</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            id="kieuChiThi"
                            placeholder="Serial chỉ thị"
                            value={kieuChiThi}
                            onChange={(e) => setKieuChiThi(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                    <label htmlFor="seriSensor" className="form-label">Serial sensor:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="seriSensor"
                        placeholder="Serial sensor"
                        value={seriSensor}
                        onChange={(e) => setSeriSensor(e.target.value)}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                    <label htmlFor="kieuSensor" className="form-label">Kiểu sensor:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="kieuSensor"
                        placeholder="Serial sensor"
                        value={kieuSensor}
                        onChange={(e) => setKieuSensor(e.target.value)}
                    />
                </div>
            </>
        }

        return <>
            <div className="mb-3 col-12 col-md-6 col-xxl-4">
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
            <div className="mb-3 col-12 col-md-6 col-xxl-4">
                <label htmlFor="kieuSensor" className="form-label">Kiểu sensor:</label>
                <input
                    type="text"
                    className="form-control"
                    id="kieuSensor"
                    placeholder="Serial sensor"
                    value={kieuSensor}
                    onChange={(e) => setKieuSensor(e.target.value)}
                />
            </div>
        </>
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            <div className={`${className ? className : ""} ${vrfWm['wraper']} container-fluid p-0 px-2 py-3 w-100`}>
                <div className={`row m-0 mb-3 p-3 w-100 bg-white shadow-sm rounded`}>
                    <div className="w-100 m-0 p-0 mb-3 position-relative">
                        <h3 className="text-uppercase fw-bolder text-center mt-3 mb-0">thông tin đồng hồ</h3>
                    </div>
                    <div className={`w-100 p-0 row m-0`}>
                        <div className={`col-12 col-lg-6 m-0 mb-3 p-0 pe-lg-2 p-0 d-flex align-items-center justify-content-between ${vrfWm['seri-number-input']}`}>
                            <label htmlFor="seriNumber" className={`form-label m-0 fs-5 fw-bold d-block`}>Số Seri:</label>
                            <input
                                type="text"
                                id="seriNumber"
                                className={`form-control`}
                                placeholder="Nhập số serial"
                                value={seriNumber}
                                onChange={(e) => setSeriNumber(e.target.value)}
                            />
                        </div>
                        <div className={`col-12 col-lg-6 m-0 mb-3 p-0 ps-lg-2 p-0 d-flex align-items-center justify-content-between ${vrfWm['seri-number-input']}`}>
                            <label htmlFor="seriNumber" className={`form-label m-0 fs-5 fw-bold d-block`}>Số Tem:</label>
                            <input
                                type="text"
                                id="soTem"
                                className={`form-control`}
                                placeholder="Nhập số tem"
                                value={soTem}
                                onChange={(e) => setSoTem(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={`collapse ${isCollapsed ? '' : 'show'} w-100 mt-2 p-0`}>
                        <form className="w-100">
                            <label className="w-100 fs-5 fw-bold">Thông tin thiết bị:</label>
                            <div className="row mx-0 w-100 mb-3">
                                <div className="mb-3 col-12 col-xxl-6">
                                    <label htmlFor="phuongTienDo" className="form-label">Tên phương tiện đo:</label>
                                    <Select
                                        name="phuongTienDo"
                                        options={phuongTienDoOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="-- Chọn tên --"
                                        isClearable
                                        value={phuongTienDoOptions.find(option => option.label == phuongTienDo) || null}
                                        onChange={(selectedOptions: any) => setPhuongTienDo(selectedOptions ? selectedOptions.label : "")}
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
                                    <label htmlFor="kieuThietBi" className="form-label">Kiểu:</label>
                                    <Select
                                        name="type"
                                        options={typeOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        placeholder="-- Chọn kiểu --"
                                        classNamePrefix="select"
                                        isClearable
                                        value={typeOptions.find(option => option.value === kieuThietBi) || null}
                                        onChange={(selectedOptions: any) => setKieuThietBi(selectedOptions ? selectedOptions.value : "")}
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
                                    <label htmlFor="coSoSanXuat" className="form-label">Cơ sở sản xuất:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="coSoSanXuat"
                                        placeholder="Cơ sở sản xuất"
                                        value={coSoSanXuat}
                                        onChange={(e) => setCoSoSanXuat(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="namSanXuat" className="form-label">Năm sản xuất:</label>
                                    <DatePicker
                                        className={`${vrfWm['date-picker']}`}
                                        value={namSanXuat ? dayjs(namSanXuat) : null}
                                        views={['year']}
                                        format="YYYY"
                                        maxDate={dayjs().endOf('year')}
                                        onChange={(newValue: Dayjs | null) => {
                                            if (newValue && newValue.year() >= 1900 && newValue.year() <= dayjs().year()) {

                                                setNamSanXuat(newValue.toDate());
                                            } else {
                                                setNamSanXuat(null); // or handle invalid date
                                            }

                                        }}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </div>
                            </div>
                            <label className="w-100 fs-5 fw-bold">Đặc trưng kỹ thuật:</label>
                            <div className="row mx-0 w-100 mb-3">
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="dn" className="form-label">- Đường kính danh định (DN):</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="dn"
                                            placeholder="DN"
                                            value={dn}
                                            onChange={handleNumberChange(setDN)}
                                            pattern="\d*"
                                        />
                                        <span className="input-group-text">mm</span>
                                    </div>
                                </div>
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="dn" className="form-label">- Độ chia nhỏ nhất (d):</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="d"
                                        placeholder="d"
                                        value={d}
                                        onChange={handleNumberChange(setD)}
                                        pattern="\d*"
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="ccx" className="form-label">- Cấp chính xác:</label>
                                    <Select
                                        name="ccx"
                                        options={ccxOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="-- Chọn cấp --"
                                        isClearable
                                        value={ccxOptions.find(option => option.value === ccx) || null}
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

                                {/* Generate input field  */}
                                {renderccxFields()}


                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="kFactor" className="form-label">- Hệ số K-factor :</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="kFactor"
                                        placeholder="K-factor"
                                        value={kFactor}
                                        onChange={handleNumberChange(setKFactor)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="so_qd_pdm" className="form-label">- Ký hiệu PDM/Số quyết định PDM:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="so_qd_pdm"
                                        placeholder="Ký hiệu PDM/Số quyết định PDM"
                                        value={so_qd_pdm}
                                        onChange={(e) => setSoQDPDM(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6 col-xxl-4 d-flex align-items-end py-1">
                                    <Link
                                        href={"/kiem-dinh/pdm//them-moi"}
                                        className="btn bg-main-green text-white"
                                    >
                                        Thêm mới PDM
                                    </Link>
                                </div>
                            </div>
                            <label className="w-100 fs-5 fw-bold">Chi tiết kiểm định:</label>
                            <div className="row mx-0 w-100 mb-3">
                                <div className="mb-3 col-12 col-xxl-6">
                                    <label htmlFor="tenKhachHang" className="form-label">Tên khách hàng:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tenKhachHang"
                                        placeholder="Tên khách hàng"
                                        value={tenKhachHang}
                                        onChange={(e) => setTenKhachhang(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-xxl-6">
                                    <label htmlFor="coSoSuDung" className="form-label">Cơ sở sử dụng:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="coSoSuDung"
                                        placeholder="Cơ sở sử dụng"
                                        value={coSoSuDung}
                                        onChange={(e) => setCoSoSuDung(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-xl-6">
                                    <label htmlFor="chuanThietBiSuDung" className="form-label">Chuẩn, thiết bị chính được sử dụng:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="chuanThietBiSuDung"
                                        placeholder="Chuẩn, thiết bị chính được sử dụng"
                                        value={chuanThietBiSuDung}
                                        onChange={(e) => setChuanThietBiSuDung(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-xl-6">
                                    <label htmlFor="viTri" className="form-label">Địa điểm thực hiện:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="viTri"
                                        placeholder="Địa điểm thực hiện"
                                        value={viTri}
                                        onChange={(e) => setViTri(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="implementer" className="form-label">Người thực hiện:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="implementer"
                                        placeholder="Người thực hiện"
                                        value={user?.fullname || implementer}
                                        onChange={(e) => setImplementer(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="ngayThucHien" className="form-label">Ngày thực hiện:</label>
                                    <DatePicker
                                        className={`${vrfWm['date-picker']}`}
                                        value={dayjs(ngayThucHien)}
                                        format="DD-MM-YYYY"
                                        maxDate={dayjs().endOf('day')}
                                        onChange={(newValue: Dayjs | null) => setNgayThucHien(newValue ? newValue.toDate() : null)}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-xxl-4">
                                    <label htmlFor="phuongPhapThucHien" className="form-label">Phương pháp thực hiện:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phuongPhapThucHien"
                                        placeholder="Phương pháp thực hiện"
                                        value={phuongPhapThucHien}
                                        onChange={(e) => setPhuongPhapThucHien(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="nhietDo" className="form-label">Nhiệt độ:</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nhietDo"
                                            placeholder="Nhiệt độ"
                                            value={nhietDo}
                                            onChange={handleNumberChange(setNhietDo)}
                                        />
                                        <span className="input-group-text">°C</span>
                                    </div>
                                </div>
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="doAm" className="form-label">Độ ẩm:</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="doAm"
                                            placeholder="Độ ẩm"
                                            value={doAm}
                                            onChange={handleNumberChange(setDoAm)}
                                        />
                                        <span className="input-group-text">%</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="w-100 m-0 p-0 d-flex justify-content-center align-items-center gap-4">
                        <span className={vrfWm['end-line']}></span>
                        <button type="button" className={`btn ${vrfWm['btn-collapse-info']} ${vrfWm['btn-collapse-end']}`} onClick={toggleCollapse}>
                            {isCollapsed ? "Hiện thêm" : "Ẩn bớt"}
                        </button>
                        <span className={vrfWm['end-line']}></span>
                    </div>
                </div>

                <div className={`m-0 mb-3 p-2 bg-white rounded shadow-sm w-100 w-100`}>
                    {/* TODO: validate before show form  */}
                    <NavTab tabContent={
                        [
                            {
                                title: <>Q<sub>{isDHDienTu ? "3" : "n"}</sub></>,
                                content: <TinhSaiSoTab
                                    onFormHSSChange={(value: number) => handleFormHSSChange(0, value)}
                                    d={d ? d : ""} q={{
                                        title: (isDHDienTu) ? TITLE_LUU_LUONG.q3 : TITLE_LUU_LUONG.qn,
                                        value: (q3) ? q3 : ((qn) ? qn : "")
                                    }} className="" tabIndex={1} form={TinhSaiSoForm} />
                            },
                            {
                                title: <>Q<sub>{isDHDienTu ? "2" : "t"}</sub></>,
                                content: <TinhSaiSoTab
                                    onFormHSSChange={(value: number) => handleFormHSSChange(1, value)}
                                    d={d ? d : ""} q={{
                                        title: (isDHDienTu) ? TITLE_LUU_LUONG.q2 : TITLE_LUU_LUONG.qt,
                                        value: (q2Ort) ? q2Ort.toString() : ""
                                    }} tabIndex={2} form={TinhSaiSoForm} />
                            },
                            {
                                title: <>Q<sub>{isDHDienTu ? "1" : "min"}</sub></>,
                                content: <TinhSaiSoTab
                                    onFormHSSChange={(value: number) => handleFormHSSChange(2, value)}
                                    d={d ? d : ""} q={{
                                        title: (isDHDienTu) ? TITLE_LUU_LUONG.q1 : TITLE_LUU_LUONG.qmin,
                                        value: (q1Ormin) ? q1Ormin.toString() : ""
                                    }} tabIndex={3} form={TinhSaiSoForm} />
                            },
                        ]
                    } />

                </div>
            </div>
        </LocalizationProvider >
    )
}