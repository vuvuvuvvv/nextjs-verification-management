"use client"

import vrfWm from "@styles/scss/ui/vfm.module.scss"
import dynamic from "next/dynamic";
import { useKiemDinh } from "@/context/kiem-dinh";
import { useDongHo } from "@/context/dong-ho";
import { useUser } from "@/context/app-context";
import Select, { GroupBase } from 'react-select';
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { getLastDayOfMonthInFuture, getQ2OrQtAndQ1OrQMin, isDongHoDatTieuChuan } from "@lib/system-function";
import { ccxOptions, phuongTienDoOptions, TITLE_LUU_LUONG, typeOptions } from "@lib/system-constant";
import { createDongHo } from "@/app/api/dongho/route";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { viVN } from "@mui/x-date-pickers/locales";

const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then(mod => mod.FontAwesomeIcon), { ssr: false });
const LocalizationProvider = dynamic(() => import('@mui/x-date-pickers/LocalizationProvider').then(mod => mod.LocalizationProvider), { ssr: false });
const DatePicker = dynamic(() => import('@mui/x-date-pickers/DatePicker').then(mod => mod.DatePicker), { ssr: false });
const NavTab = dynamic(() => import('@/components/nav-tab'), { ssr: false });
const TinhSaiSoTab = dynamic(() => import('@/components/tinh-sai-so-tab'), { ssr: false });
const TinhSaiSoForm = dynamic(() => import('@/components/tinh-sai-so-form'), { ssr: false });


interface FormDongHoNuocDNLonHon15Props {
    className?: string,
}

export default function FormDongHoNuocDNLonHon15({ className }: FormDongHoNuocDNLonHon15Props) {

    const { user } = useUser();
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const [tenDongHo, setTenDongHo] = useState<string>("");
    const [phuongTienDo, setPhuongTienDo] = useState<string>("");
    const [seriChiThi, setSeriChiThi] = useState<string>("");
    const [seriSensor, setSeriSensor] = useState<string>("");
    const [ccx, setCCX] = useState<string | null>(null);
    const [kieuChiThi, setKieuChiThi] = useState<string>("");
    const [kieuSensor, setKieuSensor] = useState<string>("");
    const [kieuThietBi, setKieuThietBi] = useState<string>("");
    const [soTem, setSoTem] = useState<string>("");
    const [coSoSanXuat, setCoSoSanXuat] = useState<string>("");
    const [namSanXuat, setNamSanXuat] = useState<Date | null>(new Date());
    const [dn, setDN] = useState<string>("");
    const [d, setD] = useState<string>("");
    const [q3, setQ3] = useState<string>("");
    const [r, setR] = useState<string>("");
    const [qn, setQN] = useState<string>("");
    const [kFactor, setKFactor] = useState<string>("");
    const [so_qd_pdm, setSoQDPDM] = useState<string>("");
    const [tenKhachHang, setTenKhachhang] = useState<string>("");
    const [coSoSuDung, setCoSoSuDung] = useState<string>("");
    const [phuongPhapThucHien, setPhuongPhapThucHien] = useState<string>("ĐNVN 17:2017");
    const [chuanThietBiSuDung, setChuanThietBiSuDung] = useState<string>("Đồng hồ chuẩn đo nước và Bình chuẩn");
    const [nguoiKiemDinh, setNguoiKiemDinh] = useState<string>(user?.fullname || "");
    const [ngayThucHien, setNgayThucHien] = useState<Date | null>(new Date());
    const [hieuLucBienBan, setHieuLucBienBan] = useState<Date | null>(new Date());
    const [viTri, setViTri] = useState<string>("");
    const [nhietDo, setNhietDo] = useState<string>('');
    const [soGiayChungNhan, setSoGiayChungNhan] = useState<string>('');
    const [doAm, setDoAm] = useState<string>('');

    const [isDHDienTu, setDHDienTu] = useState(false);

    const [q2Ort, setQ1OrQt] = useState<number | null>(null);
    const [q1Ormin, setQ2OrQmin] = useState<number | null>(null);

    const { getDuLieuKiemDinhJSON, ketQua, formHieuSaiSo, setDuLieuKiemDinhCacLuuLuong, setFormHieuSaiSo, setKetQua } = useKiemDinh();
    const { dongHo, setDongHo } = useDongHo();

    const [showFormTienTrinh, setShowFormTienTrinh] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [error, setError] = useState("");

    const [errorFields, setErrorFields] = useState<string[]>([]);

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

    // Func: Validate
    const fieldTitles = {
        ten_dong_ho: "Tên đồng hồ",
        phuong_tien_do: "Tên phương tiện đo",
        kieu_thiet_bi: "Kiểu thiết bị",
        seri_chi_thi: "Serial chỉ thị",
        seri_sensor: "Serial sensor",
        kieu_chi_thi: "Kiểu chỉ thị",
        kieu_sensor: "Kiểu sensor",
        so_tem: "Số Tem",
        co_so_san_xuat: "Cơ sở sản xuất",
        nam_san_xuat: "Năm sản xuất",
        dn: "Đường kính danh định (DN)",
        d: "Độ chia nhỏ nhất (d)",
        ccx: "Cấp chính xác",
        q3: "Q3",
        r: "Tỷ số Q3/Q1 (R)",
        qn: "Qn",
        kFactor: "Hệ số K-factor",
        so_qd_pdm: "Ký hiệu PDM/Số quyết định PDM",
        ten_khach_hang: "Tên khách hàng",
        co_so_su_dung: "Cơ sở sử dụng",
        phuong_phap_thuc_hien: "Phương pháp thực hiện",
        vi_tri: "Địa điểm thực hiện",
        nhiet_do: "Nhiệt độ",
        do_am: "Độ ẩm",
        ket_qua: "Tiến trình chạy lưu lượng"
    };

    const fields = [
        { value: tenDongHo, setter: setTenDongHo, id: "ten_dong_ho" },
        { value: phuongTienDo, setter: setPhuongTienDo, id: "phuong_tien_do" },
        { value: kieuThietBi, setter: setKieuThietBi, id: "kieu_thiet_bi" },
        // { value: seriChiThi, setter: setSeriChiThi, id: "seri_chi_thi" },
        { value: seriSensor, setter: setSeriSensor, id: "seri_sensor" },
        // { value: kieuChiThi, setter: setKieuChiThi, id: "kieu_chi_thi" },
        { value: kieuSensor, setter: setKieuSensor, id: "kieu_sensor" },
        // { value: soTem, setter: setSoTem, id: "so_tem" },
        { value: coSoSanXuat, setter: setCoSoSanXuat, id: "co_so_san_xuat" },
        { value: namSanXuat, setter: setNamSanXuat, id: "nam_san_xuat" },
        { value: dn, setter: setDN, id: "dn" },
        { value: d, setter: setD, id: "d" },
        { value: ccx, setter: setCCX, id: "ccx" },
        { value: q3, setter: setQ3, id: "q3" },
        { value: r, setter: setR, id: "r" },
        { value: qn, setter: setQN, id: "qn" },
        // { value: kFactor, setter: setKFactor, id: "kFactor" },
        { value: so_qd_pdm, setter: setSoQDPDM, id: "so_qd_pdm" },
        { value: tenKhachHang, setter: setTenKhachhang, id: "ten_khach_hang" },
        { value: coSoSuDung, setter: setCoSoSuDung, id: "co_so_su_dung" },
        { value: phuongPhapThucHien, setter: setPhuongPhapThucHien, id: "phuong_phap_thuc_hien" },
        { value: viTri, setter: setViTri, id: "vi_tri" },
        { value: nhietDo, setter: setNhietDo, id: "nhiet_do" },
        { value: doAm, setter: setDoAm, id: "do_am" },
    ];

    useEffect(() => {
        if (errorFields.length === 0) {
            const checkQ3 = ((ccx && (ccx == "1" || ccx == "2")) || isDHDienTu);
            setShowFormTienTrinh(true);
            setDongHo({
                id: null,
                ten_dong_ho: tenDongHo || "",
                group_id: null,
                phuong_tien_do: phuongTienDo,
                seri_chi_thi: seriChiThi,
                seri_sensor: checkQ3 ? seriSensor : "",
                kieu_chi_thi: kieuChiThi,
                kieu_sensor: checkQ3 ? kieuSensor : "",
                kieu_thiet_bi: kieuThietBi,
                co_so_san_xuat: coSoSanXuat,
                so_tem: soTem,
                nam_san_xuat: namSanXuat,
                dn: dn,
                d: d,
                ccx: ccx,
                q3: checkQ3 ? q3 : "",
                r: r,
                qn: checkQ3 ? "" : qn,
                k_factor: kFactor,
                so_qd_pdm: so_qd_pdm,
                ten_khach_hang: tenKhachHang,
                co_so_su_dung: coSoSuDung,
                phuong_phap_thuc_hien: phuongPhapThucHien,
                chuan_thiet_bi_su_dung: chuanThietBiSuDung,
                nguoi_kiem_dinh: nguoiKiemDinh,
                ngay_thuc_hien: ngayThucHien,
                vi_tri: viTri,
                nhiet_do: nhietDo,
                do_am: doAm,
                du_lieu_kiem_dinh: getDuLieuKiemDinhJSON(), // Assuming this is not part of the form
                hieu_luc_bien_ban: soTem ? getLastDayOfMonthInFuture(isDHDienTu) : null,
                so_giay_chung_nhan: soGiayChungNhan,
            });

            if (ketQua != null && (soTem && soGiayChungNhan)) {
                setCanSave(true);
            }
        } else {
            setShowFormTienTrinh(false);
            setSoTem("");
            setKetQua(null);
            setCanSave(false);

        }
    }, [errorFields]);

    const validateFields = () => {
        let validationErrors = [];

        for (const field of fields) {
            const shouldValidate = (ccx && (ccx === "1" || ccx === "2")) || isDHDienTu
                ? field.id !== "qn"
                : field.id !== "q3" && field.id !== "r" && field.id !== "seri_sensor" && field.id !== "kieu_sensor";

            if (shouldValidate && !field.value) {
                validationErrors.push(field.id);
            }
        }
        return validationErrors;
    };

    useEffect(() => {
        setErrorFields(validateFields());
    }, [
        tenDongHo, phuongTienDo, kieuThietBi, seriChiThi, seriSensor, kieuChiThi, kieuSensor, soTem, coSoSanXuat, namSanXuat, dn, d, ccx, q3, r, qn, so_qd_pdm, tenKhachHang, coSoSuDung, phuongPhapThucHien, viTri, nhietDo, doAm, isDHDienTu
    ]);

    useEffect(() => {
        setCanSave(soTem && soGiayChungNhan ? true : false);
        setHieuLucBienBan(soTem && soGiayChungNhan ? getLastDayOfMonthInFuture(isDHDienTu) : null);
    }, [soTem, soGiayChungNhan]);

    const handleSaveDongHo = async () => {
        if (canSave) {
            try {
                const response = await createDongHo(dongHo);
                // console.log(response)
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
                        html: "Lưu Đồng hồ thành công!",
                        timer: 1500,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.timer) {
                            Swal.showLoading();
                            router.push("/kiem-dinh/dong-ho-nuoc/dn-bigger-than-15");
                        }
                    });
                } else {
                    // console.log(response)
                    setError(response.msg);
                }
            } catch (err) {
                setError("Đã có lỗi xảy ra. Vui lòng thử lại!");
            }
        } else {
            setError("Chưa thể lưu lúc này!");
        }
    }

    const handleFormHSSChange = (index: number, value: number | null) => {
        const newFormValues = [...formHieuSaiSo];
        newFormValues[index].hss = value;
        setFormHieuSaiSo(newFormValues);
    };

    useEffect(() => {
        if (q3 || qn) {
            // TODO: Tạo button check?
            setKetQua(isDongHoDatTieuChuan(isDHDienTu, formHieuSaiSo));
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
        setDHDienTu(phuongTienDo !== "" && ["1", "2"].includes(phuongTienDoOptions.find(option => option.label == phuongTienDo)?.value ?? ""));
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
                    <label htmlFor="kieu_sensor" className="form-label">Kiểu sensor:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="kieu_sensor"
                        placeholder="Serial sensor"
                        value={kieuSensor}
                        onChange={(e) => setKieuSensor(e.target.value)}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                    <label htmlFor="seri_sensor" className="form-label">Serial sensor:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="seri_sensor"
                        placeholder="Serial sensor"
                        value={seriSensor}
                        onChange={(e) => setSeriSensor(e.target.value)}
                    />
                </div>
                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                    <label htmlFor="seri_chi_thi" className="form-label">Serial chỉ thị:</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            id="seri_chi_thi"
                            placeholder="Serial chỉ thị"
                            value={seriChiThi}
                            onChange={(e) => setSeriChiThi(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                    <label htmlFor="kieu_chi_thi" className="form-label">Kiểu chỉ thị:</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            id="kieu_chi_thi"
                            placeholder="Serial chỉ thị"
                            value={kieuChiThi}
                            onChange={(e) => setKieuChiThi(e.target.value)}
                        />
                    </div>
                </div>
            </>
        } else {

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
                    <label htmlFor="seri_chi_thi" className="form-label">Serial chỉ thị:</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            id="seri_chi_thi"
                            placeholder="Serial chỉ thị"
                            value={seriChiThi}
                            onChange={(e) => setSeriChiThi(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                    <label htmlFor="kieu_chi_thi" className="form-label">Kiểu chỉ thị:</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            id="kieu_chi_thi"
                            placeholder="Kiểu chỉ thị"
                            value={kieuChiThi}
                            onChange={(e) => setKieuChiThi(e.target.value)}
                        />
                    </div>
                </div>
            </>
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            <div className={`${className ? className : ""} ${vrfWm['wraper']} container-fluid p-0 px-2 py-3 w-100`}>
                <div className={`row m-0 mb-3 p-3 w-100 bg-white shadow-sm rounded`}>
                    <div className="w-100 m-0 p-0 mb-3 position-relative">
                        <h3 className="text-uppercase fw-bolder text-center mt-3 mb-0">thông tin đồng hồ</h3>
                    </div>
                    <div className={`w-100 p-0 row m-0`}>
                        <div className={`col-12 col-lg-8 col-xxl-6 m-0 mb-3 p-0 pe-lg-2 p-0 d-flex align-items-center justify-content-between ${vrfWm['seri-number-input']}`}>
                            <label htmlFor="ten_dong_ho" className={`form-label m-0 fs-5 fw-bold d-block`} style={{ width: "150px" }}>Tên đồng hồ:</label>
                            <input

                                type="text"
                                id="ten_dong_ho"
                                className={`form-control`}
                                placeholder="Nhập tên đồng hồ"
                                value={tenDongHo}
                                onChange={(e) => setTenDongHo(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={`collapse ${isCollapsed ? '' : 'show'} w-100 mt-2 p-0`}>
                        <form className="w-100">
                            <label className="w-100 fs-5 fw-bold">Thông tin thiết bị:</label>
                            <div className="row mx-0 w-100 mb-3">
                                <div className="mb-3 col-12 col-xxl-6">
                                    <label htmlFor="phuong_tien_do" className="form-label">Tên phương tiện đo:</label>
                                    <Select
                                        name="phuong_tien_do"
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
                                                boxShadow: 'none !important',
                                                backgroundColor: "white",
                                            }),
                                            valueContainer: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                padding: '0 8px',
                                                color: "#000 !important",
                                            }),
                                            input: (provided) => ({
                                                ...provided,
                                                margin: '0',
                                                padding: '0'
                                            }),
                                            indicatorsContainer: (provided) => ({
                                                ...provided,
                                                height: '42px'
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 777
                                            }),
                                            singleValue: (provided, state) => ({
                                                ...provided,
                                                color: state.isDisabled ? '#000' : provided.color, // Set color to black when disabled
                                            })
                                        }}
                                    />
                                </div>

                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="kieu_thiet_bi" className="form-label">Kiểu:</label>
                                    <Select
                                        name="type"
                                        options={typeOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        placeholder="-- Chọn kiểu --"
                                        classNamePrefix="select"
                                        isClearable
                                        id="kieu_thiet_bi"
                                        value={typeOptions.find(option => option.value === kieuThietBi) || null}
                                        onChange={(selectedOptions: any) => setKieuThietBi(selectedOptions ? selectedOptions.value : "")}
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
                                                height: '42px'
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 777
                                            }),
                                            singleValue: (provided, state) => ({
                                                ...provided,
                                                color: state.isDisabled ? '#000' : provided.color, // Set color to black when disabled
                                            })
                                        }}
                                    />
                                </div>

                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="co_so_san_xuat" className="form-label">Cơ sở sản xuất:</label>
                                    <input

                                        type="text"
                                        className="form-control"
                                        id="co_so_san_xuat"
                                        placeholder="Cơ sở sản xuất"
                                        value={coSoSanXuat}
                                        onChange={(e) => setCoSoSanXuat(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="nam_san_xuat" className="form-label">Năm sản xuất:</label>
                                    <DatePicker
                                        className={`${vrfWm['date-picker']}`}
                                        value={namSanXuat ? dayjs(namSanXuat) : null}
                                        views={['year']}
                                        format="YYYY"
                                        minDate={dayjs('1900-01-01')}
                                        maxDate={dayjs().endOf('year')}
                                        onChange={(newValue: Dayjs | null) => {
                                            if (newValue) {

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
                                                height: '42px'
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 777
                                            }),
                                            singleValue: (provided, state) => ({
                                                ...provided,
                                                color: state.isDisabled ? '#000' : provided.color, // Set color to black when disabled
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
                                <div className={`mb-3 col-12 col-md-6 col-xxl-4 d-flex align-items-end`}>
                                    <Link
                                        href={"/kiem-dinh/pdm//them-moi"}
                                        className="btn btn-success px-3 py-2 text-white"
                                    >
                                        Thêm mới PDM
                                    </Link>
                                </div>
                            </div>
                            <label className="w-100 fs-5 fw-bold">Chi tiết kiểm định:</label>
                            <div className="row mx-0 w-100 mb-3">
                                <div className="mb-3 col-12 col-xxl-6">
                                    <label htmlFor="ten_khach_hang" className="form-label">Tên khách hàng:</label>
                                    <input

                                        type="text"
                                        className="form-control"
                                        id="ten_khach_hang"
                                        placeholder="Tên khách hàng"
                                        value={tenKhachHang}
                                        onChange={(e) => setTenKhachhang(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-xxl-6">
                                    <label htmlFor="co_so_su_dung" className="form-label">Cơ sở sử dụng:</label>
                                    <input

                                        type="text"
                                        className="form-control"
                                        id="co_so_su_dung"
                                        placeholder="Cơ sở sử dụng"
                                        value={coSoSuDung}
                                        onChange={(e) => setCoSoSuDung(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-xl-6">
                                    <label htmlFor="chuan_thiet_bii_su_dung" className="form-label">Chuẩn, thiết bị chính được sử dụng:</label>
                                    <input

                                        type="text"
                                        className="form-control"
                                        id="chuan_thiet_bii_su_dung"
                                        placeholder="Chuẩn, thiết bị chính được sử dụng"
                                        value={chuanThietBiSuDung}
                                        onChange={(e) => setChuanThietBiSuDung(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-xl-6">
                                    <label htmlFor="vi_tri" className="form-label">Địa điểm thực hiện:</label>
                                    <input

                                        type="text"
                                        className="form-control"
                                        id="vi_tri"
                                        placeholder="Địa điểm thực hiện"
                                        value={viTri}
                                        onChange={(e) => setViTri(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="nguoi_kiem_dinh" className="form-label">Người thực hiện:</label>
                                    <input

                                        type="text"
                                        className="form-control"
                                        id="nguoi_kiem_dinh"
                                        placeholder="Người thực hiện"
                                        value={nguoiKiemDinh}
                                        onChange={(e) => setNguoiKiemDinh(e.target.value)}
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
                                    <label htmlFor="phuong_phap_thuc_hien" className="form-label">Phương pháp thực hiện:</label>
                                    <input

                                        type="text"
                                        className="form-control"
                                        id="phuong_phap_thuc_hien"
                                        placeholder="Phương pháp thực hiện"
                                        value={phuongPhapThucHien}
                                        onChange={(e) => setPhuongPhapThucHien(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="nhiet_do" className="form-label">Nhiệt độ:</label>
                                    <div className="input-group">
                                        <input

                                            type="text"
                                            className="form-control"
                                            id="nhiet_do"
                                            placeholder="Nhiệt độ"
                                            value={nhietDo}
                                            onChange={handleNumberChange(setNhietDo)}
                                        />
                                        <span className="input-group-text">°C</span>
                                    </div>
                                </div>
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="do_am" className="form-label">Độ ẩm:</label>
                                    <div className="input-group">
                                        <input

                                            type="text"
                                            className="form-control"
                                            id="do_am"
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
                        <button aria-label={isCollapsed ? "Hiện thêm" : "Ẩn bớt"} type="button" className={`btn ${vrfWm['btn-collapse-info']} ${vrfWm['btn-collapse-end']}`} onClick={toggleCollapse}>
                            {isCollapsed ? "Hiện thêm" : "Ẩn bớt"}
                        </button>
                        <span className={vrfWm['end-line']}></span>
                    </div>
                </div>

                <div className={`m-0 mb-3 p-2 bg-white rounded shadow-sm w-100 w-100`}>

                    <div className={`w-100 p-2 d-flex gap-2 justify-content-between ${showFormTienTrinh ? "d-none" : ""}`}>
                        <div className={`w-100 px-3 row alert alert-warning m-0 ${(ketQua != null) ? "fade d-none" : "show"}`}>
                            <h6><i>* Điền đủ các thông tin để hiện Form tiến trình!</i></h6>
                            {errorFields.map((error, index) => (
                                <div className="col-12 col-sm-6 col-lg-4 col-xxl-3" key={index}><span className="me-2">•</span> {fieldTitles[error as keyof typeof fieldTitles]} là bắt buộc</div>
                            ))}
                        </div>
                    </div>
                    <div className={`w-100 ${showFormTienTrinh ? "" : "d-none"}`}>
                        <NavTab buttonControl={true} tabContent={
                            [
                                {
                                    title: <>Q<sub>{isDHDienTu ? "3" : "n"}</sub></>,
                                    content: <TinhSaiSoTab
                                        onFormHSSChange={(value: number | null) => handleFormHSSChange(0, value)}
                                        d={d ? d : ""} q={{
                                            title: isDHDienTu ? TITLE_LUU_LUONG.q3 : TITLE_LUU_LUONG.qn,
                                            value: q3 ? q3 : (qn ? qn : "")
                                        }} className="" tabIndex={1} form={TinhSaiSoForm as any} />
                                },
                                {
                                    title: <>Q<sub>{isDHDienTu ? "2" : "t"}</sub></>,
                                    content: <TinhSaiSoTab
                                        onFormHSSChange={(value: number | null) => handleFormHSSChange(1, value)}
                                        d={d ? d : ""} q={{
                                            title: (isDHDienTu) ? TITLE_LUU_LUONG.q2 : TITLE_LUU_LUONG.qt,
                                            value: (q2Ort) ? q2Ort.toString() : ""
                                        }} tabIndex={2} form={TinhSaiSoForm as any} />
                                },
                                {
                                    title: <>Q<sub>{isDHDienTu ? "1" : "min"}</sub></>,
                                    content: <TinhSaiSoTab
                                        onFormHSSChange={(value: number | null) => handleFormHSSChange(2, value)}
                                        d={d ? d : ""} q={{
                                            title: (isDHDienTu) ? TITLE_LUU_LUONG.q1 : TITLE_LUU_LUONG.qmin,
                                            value: (q1Ormin) ? q1Ormin.toString() : ""
                                        }} tabIndex={3} form={TinhSaiSoForm as any} />
                                },
                            ]
                        } />
                        <div className={`w-100 p-2 d-flex gap-2 justify-content-between`}>
                            <div className={`w-100 px-3 row alert alert-warning m-0 ${(ketQua != null) ? "fade d-none" : "show"}`}>
                                <h6><i>* Điền đủ các thông tin để kiểm tra kết quả!</i></h6>

                                {ketQua == null && (
                                    <div className="col-12"><span className="me-2">•</span>Tiến trình chạy lưu lượng không được bỏ trống</div>
                                )}
                            </div>
                            <div className={`w-100 px-3 m-0 d-flex align-items-center justify-content-end ${(ketQua != null) ? "fade d-none" : "show"}`}>
                                <button aria-label="Kiểm tra" className="btn btn-success px-3 py-2 text-white" onClick={
                                    () => {
                                        // TODO:
                                        // handleCheck();
                                    }
                                }><FontAwesomeIcon className="me-2" icon="fas fa-tasks" />Kiểm tra</button>
                            </div>
                            <div className={`w-100 px-3 p-xl-4 row alert ${ketQua ? "alert-success" : "alert-danger"} m-0 ${(ketQua != null) ? "show" : "fade d-none"}`}>
                                <h5 className="p-0">Kết quả kiểm tra kỹ thuật:</h5>
                                <p className="p-0 m-0">- Khả năng hoạt động của hệ thống: <b className="text-uppercase">{ketQua ? "Đạt" : "Không đạt"}</b></p>
                                <div className={`w-100 m-0 mt-3 p-0 ${ketQua ? "" : "d-none"}`}>
                                    <div className="w-100 row m-0 p-0 justify-content-between">
                                        <div className={`col-12 col-md-10 col-xl-8 col-xxl-6 m-0 mb-3 p-0 ps-lg-4 d-flex align-items-center justify-content-between ${vrfWm['seri-number-input']}`}>
                                            <label htmlFor="soTem" className={`form-label m-0 fs-6 fw-bold d-block`}>Số Tem:</label>
                                            <input
                                                type="text"
                                                id="soTem"
                                                className={`form-control`}
                                                placeholder="Nhập số tem"
                                                value={ketQua ? soTem : ""}
                                                onChange={(e) => setSoTem(e.target.value)}
                                            />
                                        </div>
                                        <div className={`col-12 col-md-10 col-xl-8 col-xxl-6 m-0 mb-3 p-0 ps-lg-4 d-flex align-items-center justify-content-between ${vrfWm['seri-number-input']}`}>
                                            <label htmlFor="soGiayChungNhan" className={`form-label m-0 fs-6 fw-bold d-block`}>Số giấy chứng nhận:</label>
                                            <input
                                                type="text"
                                                id="soGiayChungNhan"
                                                className={`form-control`}
                                                placeholder="Nhập số giấy chứng nhận"
                                                value={ketQua ? soGiayChungNhan : ""}
                                                onChange={(e) => setSoGiayChungNhan(e.target.value)}
                                            />
                                        </div>

                                        <div className={`col-12 col-md-10 col-xl-8 col-xxl-6 m-0 mb-3 p-0 ps-lg-4 d-flex align-items-center justify-content-between ${(soTem && soGiayChungNhan) ? "" : "d-none"} ${vrfWm['seri-number-input']}`}>
                                            <label htmlFor="hieuLucBienBan" style={{ width: "180px" }} className="form-label m-0 fs-6 fw-bold d-block">Hiệu lực biên bản:</label>
                                            <DatePicker
                                                className={`bg-white ${vrfWm['date-picker']}`}
                                                value={dayjs(hieuLucBienBan)}
                                                format="DD-MM-YYYY"
                                                // maxDate={dayjs().endOf('day')}
                                                minDate={dayjs().endOf('day')}
                                                onChange={(newValue: Dayjs | null) => setHieuLucBienBan(newValue ? newValue.toDate() : null)}
                                                slotProps={{ textField: { fullWidth: true } }}
                                            />
                                        </div>
                                    </div>
                                    {/* TODO: Giấy chứng nhận */}
                                    {/* <div className="w-100 m-0 p-0">
                                    <button aria-label="Giấy chứng nhận" className="btn px-3 py-2 btn-success" style={{ width: "max-content" }}>
                                        <FontAwesomeIcon icon={faFileAlt} className="me-2"></FontAwesomeIcon> Giấy chứng nhận
                                    </button>
                                </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="w-100 m-0 p-2 d-flex gap-2 justify-content-between">
                            {/* <button className="btn py-2 px-3 btn-danger" onClick={handleCheck}>
                            Kiểm tra
                        </button> */}
                            <button aria-label="Lưu Đồng hồ" className={`btn py-2 px-3 ${canSave ? "btn-success" : "btn-secondary"}`} disabled={!canSave} onClick={handleSaveDongHo}>
                                Lưu Đồng hồ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </LocalizationProvider >
    )
}

