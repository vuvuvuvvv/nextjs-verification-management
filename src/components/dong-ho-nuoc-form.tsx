"use client"

import vrfWm from "@styles/scss/ui/vfm.module.scss"

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { viVN } from "@mui/x-date-pickers/locales";


import NavTab from "@/components/nav-tab";
import TinhSaiSoTab from "@/components/tinh-sai-so-tab";
import TinhSaiSoForm from "@/components/tinh-sai-so-form";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { DongHo, DuLieuChayDiemLuuLuong, DuLieuChayDongHo } from "@lib/types";


interface FormDongHoNuocDNLonHon15Props {
    className?: string,
    dataDongHo?: DongHo
}

interface TabState {
    [key: number | string]: boolean;
};

export default function FormDongHoNuocDNLonHon15({ className, dataDongHo }: FormDongHoNuocDNLonHon15Props) {

    const { user } = useUser();
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const [seriNumber, setSeriNumber] = useState<string>(dataDongHo?.serial_number || "");
    const [phuongTienDo, setPhuongTienDo] = useState<string>(dataDongHo?.phuong_tien_do || "");
    const [seriChiThi, setSeriChiThi] = useState<string>(dataDongHo?.seri_chi_thi || "");
    const [seriSensor, setSeriSensor] = useState<string>(dataDongHo?.seri_sensor || "");
    const [ccx, setCCX] = useState<string | null>(dataDongHo?.ccx || null);
    const [kieuChiThi, setKieuChiThi] = useState<string>(dataDongHo?.kieu_chi_thi || "");
    const [kieuSensor, setKieuSensor] = useState<string>(dataDongHo?.kieu_sensor || "");
    const [kieuThietBi, setKieuThietBi] = useState<string>(dataDongHo?.kieu_thiet_bi || "");
    const [soTem, setSoTem] = useState<string>(dataDongHo?.so_tem || "");
    const [coSoSanXuat, setCoSoSanXuat] = useState<string>(dataDongHo?.co_so_san_xuat || "");
    const [namSanXuat, setNamSanXuat] = useState<Date | null>(dataDongHo?.nam_san_xuat ? new Date(dataDongHo.nam_san_xuat) : new Date());
    const [dn, setDN] = useState<string>(dataDongHo?.dn || "");
    const [d, setD] = useState<string>(dataDongHo?.d || "");
    const [q3, setQ3] = useState<string>(dataDongHo?.q3 || "");
    const [r, setR] = useState<string>(dataDongHo?.r || "");
    const [qn, setQN] = useState<string>(dataDongHo?.qn || "");
    const [kFactor, setKFactor] = useState<string>(dataDongHo?.k_factor || "");
    const [so_qd_pdm, setSoQDPDM] = useState<string>(dataDongHo?.so_qd_pdm || "");
    const [tenKhachHang, setTenKhachhang] = useState<string>(dataDongHo?.ten_khach_hang || "");
    const [coSoSuDung, setCoSoSuDung] = useState<string>(dataDongHo?.co_so_su_dung || "");
    const [phuongPhapThucHien, setPhuongPhapThucHien] = useState<string>(dataDongHo?.phuong_phap_thuc_hien || "ĐNVN 17:2017");
    const [chuanThietBiSuDung, setChuanThietBiSuDung] = useState<string>(dataDongHo?.chuan_thiet_bi_su_dung || "Đồng hồ chuẩn đo nước và Bình chuẩn");
    const [nguoiKiemDinh, setNguoiKiemDinh] = useState<string>(dataDongHo?.nguoi_kiem_dinh || user?.fullname || "");
    const [ngayThucHien, setNgayThucHien] = useState<Date | null>(dataDongHo?.ngay_thuc_hien ? new Date(dataDongHo.ngay_thuc_hien) : new Date());
    const [hieuLucBienBan, setHieuLucBienBan] = useState<Date | null>(dataDongHo?.hieu_luc_bien_ban ? new Date(dataDongHo.hieu_luc_bien_ban) : new Date());
    const [viTri, setViTri] = useState<string>(dataDongHo?.vi_tri || "");
    const [nhietDo, setNhietDo] = useState<string>(dataDongHo?.nhiet_do || '');
    const [soGiayChungNhan, setSoGiayChungNhan] = useState<string>(dataDongHo?.so_giay_chung_nhan || '');
    const [doAm, setDoAm] = useState<string>(dataDongHo?.do_am || '');

    const [isDHDienTu, setDHDienTu] = useState(false);

    const [q2Ort, setQ1OrQt] = useState<number | null>(null);
    const [q1Ormin, setQ2OrQmin] = useState<number | null>(null);

    const { getDuLieuKiemDinhJSON, ketQua, formHieuSaiSo, setDuLieuKiemDinhCacLuuLuong, setFormHieuSaiSo, setKetQua } = useKiemDinh();
    const { dongHo, setDongHo } = useDongHo();

    const [canSave, setCanSave] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (dataDongHo) {
            const duLieuKiemDinh = dataDongHo.du_lieu_kiem_dinh as { du_lieu?: DuLieuChayDongHo }; // Define the type
            if (duLieuKiemDinh?.du_lieu) { // Optional chaining
                const dlKiemDinh = duLieuKiemDinh.du_lieu;
                setDuLieuKiemDinhCacLuuLuong(dlKiemDinh);
            }
            const duLieuHSS = dataDongHo.du_lieu_kiem_dinh as { hieu_sai_so?: { hss: number | null }[] }; // Define the type
            if (duLieuHSS?.hieu_sai_so) { // Optional chaining
                const dlHSS = duLieuHSS.hieu_sai_so;
                setFormHieuSaiSo(dlHSS);
            }
        }
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

    // Func: Validate
    const fieldTitles = {
        seriNumber: "Số Seri",
        phuongTienDo: "Tên phương tiện đo",
        kieuThietBi: "Kiểu thiết bị",
        seriChiThi: "Serial chỉ thị",
        seriSensor: "Serial sensor",
        kieuChiThi: "Kiểu chỉ thị",
        kieuSensor: "Kiểu sensor",
        soTem: "Số Tem",
        coSoSanXuat: "Cơ sở sản xuất",
        namSanXuat: "Năm sản xuất",
        dn: "Đường kính danh định (DN)",
        d: "Độ chia nhỏ nhất (d)",
        ccx: "Cấp chính xác",
        q3: "Q3",
        r: "Tỷ số Q3/Q1 (R)",
        qn: "Qn",
        kFactor: "Hệ số K-factor",
        so_qd_pdm: "Ký hiệu PDM/Số quyết định PDM",
        tenKhachHang: "Tên khách hàng",
        coSoSuDung: "Cơ sở sử dụng",
        phuongPhapThucHien: "Phương pháp thực hiện",
        viTri: "Địa điểm thực hiện",
        nhietDo: "Nhiệt độ",
        doAm: "Độ ẩm",
        ketQua: "Tiến trình chạy lưu lượng"
    };

    // Func: validate
    const validateFields = () => {
        const fields = [
            { value: seriNumber, setter: setSeriNumber, id: "seriNumber" },
            { value: phuongTienDo, setter: setPhuongTienDo, id: "phuongTienDo" },
            { value: kieuThietBi, setter: setKieuThietBi, id: "kieuThietBi" },
            // { value: seriChiThi, setter: setSeriChiThi, id: "seriChiThi" },
            { value: seriSensor, setter: setSeriSensor, id: "seriSensor" },
            // { value: kieuChiThi, setter: setKieuChiThi, id: "kieuChiThi" },
            { value: kieuSensor, setter: setKieuSensor, id: "kieuSensor" },
            // { value: soTem, setter: setSoTem, id: "soTem" },
            { value: coSoSanXuat, setter: setCoSoSanXuat, id: "coSoSanXuat" },
            { value: namSanXuat, setter: setNamSanXuat, id: "namSanXuat" },
            { value: dn, setter: setDN, id: "dn" },
            { value: d, setter: setD, id: "d" },
            { value: ccx, setter: setCCX, id: "ccx" },
            { value: q3, setter: setQ3, id: "q3" },
            { value: r, setter: setR, id: "r" },
            { value: qn, setter: setQN, id: "qn" },
            // { value: kFactor, setter: setKFactor, id: "kFactor" },
            { value: so_qd_pdm, setter: setSoQDPDM, id: "so_qd_pdm" },
            { value: tenKhachHang, setter: setTenKhachhang, id: "tenKhachHang" },
            { value: coSoSuDung, setter: setCoSoSuDung, id: "coSoSuDung" },
            { value: phuongPhapThucHien, setter: setPhuongPhapThucHien, id: "phuongPhapThucHien" },
            { value: viTri, setter: setViTri, id: "viTri" },
            { value: nhietDo, setter: setNhietDo, id: "nhietDo" },
            { value: doAm, setter: setDoAm, id: "doAm" },
        ];

        let firstInvalidField = null;
        let validationErrors = [];

        for (const field of fields) {
            const element = document.getElementById(field.id);
            if (field.value) {
                if (element) {
                    // element.classList.remove("is-invalid");
                }
            } else {
                if (element) {
                    // element.classList.add("is-invalid");
                    validationErrors.push(field.id);
                    if (!firstInvalidField) {
                        firstInvalidField = element;
                    }
                }
            }
        }
        return validationErrors;
    };

    useEffect(() => {
        const errors = validateFields();
        if (errors.length === 0) {
            const checkQ3 = ((ccx && (ccx == "1" || ccx == "2")) || isDHDienTu);

            setDongHo({
                serial_number: seriNumber,
                phuong_tien_do: phuongTienDo,
                seri_chi_thi: checkQ3 ? seriChiThi : "",
                seri_sensor: checkQ3 ? seriSensor : "",
                kieu_chi_thi: checkQ3 ? kieuChiThi : "",
                kieu_sensor: checkQ3 ? kieuSensor : "",
                kieu_thiet_bi: kieuThietBi,
                co_so_san_xuat: coSoSanXuat,
                so_tem: soTem,
                nam_san_xuat: namSanXuat,
                dn: dn,
                d: d,
                ccx: ccx,
                q3: checkQ3 ? q3: "",
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

            if (ketQua != null) {
                setCanSave(true);
            }
        } else {
            setSoTem("");
            setKetQua(null);
            setCanSave(false);
        }
    }, [
        seriNumber, phuongTienDo, kieuThietBi, seriChiThi, seriSensor, kieuChiThi, kieuSensor, soTem, coSoSanXuat, namSanXuat, dn, d, ccx, q3, r, qn, kFactor, so_qd_pdm, tenKhachHang, coSoSuDung, phuongPhapThucHien, viTri, nhietDo, doAm
    ]);

    useEffect(() => {
        setCanSave(soTem ? true : false);
        setHieuLucBienBan(soTem ? getLastDayOfMonthInFuture(isDHDienTu) : null);
    }, [soTem]);

    const handleSaveDongHo = async () => {
        if(dataDongHo) {
            // TODO: Update Dongho
        } else {
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
    }

    // TODO: Dat tieu chuan:
    const handleFormHSSChange = (index: number, value: number) => {
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

    // TODO: Check lại ccx để nó clear hết data
    useEffect(() => {
        setDHDienTu(phuongTienDo !== "" && phuongTienDoOptions.find(option => option.label == phuongTienDo)?.value == "1");
    }, [ccx, phuongTienDo]);

    useEffect(() => {
        if (ccx && phuongTienDo && ((q3 && r) || qn)) {
            const { getQ1OrMin, getQ2OrQt } = getQ2OrQtAndQ1OrQMin(isDHDienTu, ccx, q3, r);
            setQ2OrQmin(getQ1OrMin);
            setQ1OrQt(getQ2OrQt);
        }
    }, [ccx, phuongTienDo, q3, qn, r]);

    // useEffect(() => {
    //     if (!isDHDienTu) {
    //         setQ3("");
    //         setR("");
    //         setSeriChiThi("");
    //         setSeriSensor("");
    //         setKieuSensor("");
    //         setKieuChiThi("");
    //     } else {
    //         setQN("");
    //     }
    // }, [ccx, phuongTienDo]);

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
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 777
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
                                        id="kieuThietBi"
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
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 777
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
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 777
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
                                        className="btn btn-success px-3 py-2 text-white"
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
                    <NavTab buttonControl={true} tabContent={
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
                    <div className={`w-100 p-2 d-flex gap-2 justify-content-between`}>
                        <div id="validate-info" className={`w-100 px-3 row alert alert-warning m-0 ${(ketQua != null) ? "fade d-none" : "show"}`}>
                            <h6><i>* Điền đủ các thông tin để hiện kết quả kiểm tra!</i></h6>
                            {validateFields().map((error, index) => (
                                <div className="col-12 col-sm-6 col-lg-4 col-xxl-3" key={index}><span className="me-2">•</span> {fieldTitles[error as keyof typeof fieldTitles]} là bắt buộc</div>
                            ))}
                            {ketQua == null && (
                                <div className="col-12 col-sm-6 col-lg-4 col-xxl-3"><span className="me-2">•</span>Tiến trình chạy lưu lượng không được bỏ trống</div>
                            )}
                        </div>
                        <div id="validate-info" className={`w-100 px-3 p-xl-4 row alert ${ketQua ? "alert-success" : "alert-danger"} m-0 ${(ketQua != null) ? "show" : "fade d-none"}`}>
                            <h5 className="p-0">Kết quả kiểm tra kỹ thuật:</h5>
                            <p className="p-0 m-0">- Khả năng hoạt động của hệ thống: <b className="text-uppercase">{ketQua ? "Đạt" : "Không đạt"}</b></p>
                            <div className={`w-100 m-0 mt-3 p-0 ${ketQua ? "" : "d-none"}`}>
                                <div className="w-100 row m-0 p-0 gap-xxl-5">
                                    <div className={`col-12 col-md-10 col-xl-8 col-xxl-5 m-0 mb-3 p-0 ps-lg-2 p-0 d-flex align-items-center justify-content-between ${vrfWm['seri-number-input']}`}>
                                        <label htmlFor="seriNumber" className={`form-label m-0 fs-6 fw-bold d-block`}>Số Tem:</label>
                                        <input
                                            type="text"
                                            id="soTem"
                                            className={`form-control`}
                                            placeholder="Nhập số tem"
                                            value={ketQua ? soTem : ""}
                                            onChange={(e) => setSoTem(e.target.value)}
                                        />
                                    </div>

                                    <div className={`col-12 col-md-10 col-xl-8 col-xxl-5 m-0 mb-3 p-0 ps-lg-2 p-0 d-flex align-items-center justify-content-between ${vrfWm['seri-number-input']}`}>
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
                                <div className="w-100 m-0 p-0">
                                    <button className="btn px-3 py-2 btn-success" style={{ width: "max-content" }}>
                                        <FontAwesomeIcon icon={faFileAlt} className="me-2"></FontAwesomeIcon> Giấy chứng nhận
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-100 m-0 p-2 d-flex gap-2 justify-content-between">
                        {/* <button className="btn py-2 px-3 btn-danger" onClick={handleCheck}>
                            Kiểm tra
                        </button> */}
                        <button className={`btn py-2 px-3 ${canSave ? "btn-success" : "btn-secondary"}`} disabled={!canSave} onClick={handleSaveDongHo}>
                            Lưu Đồng hồ
                        </button>
                    </div>
                </div>
            </div>
        </LocalizationProvider >
    )
}
