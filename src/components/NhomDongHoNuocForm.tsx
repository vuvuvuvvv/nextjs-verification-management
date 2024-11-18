"use client"

import ui_vfm from "@styles/scss/ui/vfm.module.scss"

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { viVN } from "@mui/x-date-pickers/locales";
const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then(mod => mod.FontAwesomeIcon), { ssr: false });
const LocalizationProvider = dynamic(() => import('@mui/x-date-pickers/LocalizationProvider').then(mod => mod.LocalizationProvider), { ssr: false });
const DatePicker = dynamic(() => import('@mui/x-date-pickers/DatePicker').then(mod => mod.DatePicker), { ssr: false });
const NavTab = dynamic(() => import('@/components/NavTab'), { ssr: false });
const TinhSaiSoTab = dynamic(() => import('@/components/TinhSaiSoTab'), { ssr: false });
const TinhSaiSoForm = dynamic(() => import('@/components/TinhSaiSoForm'), { ssr: false });
const Loading = dynamic(() => import("@/components/Loading"), { ssr: false });
// const ModalSelectDongHoToSave = dynamic(() => import('@/components/ui/ModalSelectDongHoToSave'), { ssr: false });

import { useKiemDinh } from "@/context/KiemDinh";
import { useDongHo } from "@/context/DongHo";
import { useUser } from "@/context/AppContext";


import CreatableSelect from 'react-select/creatable';
import Select, { GroupBase } from 'react-select';
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";

import { convertToUppercaseNonAccent, getLastDayOfMonthInFuture, getQ2OrQtAndQ1OrQMin, isDongHoDatTieuChuan } from "@lib/system-function";
import { ACCESS_LINKS, BASE_API_URL, ccxOptions, DEFAULT_LOCATION, phuongTienDoOptions, TITLE_LUU_LUONG, typeOptions } from "@lib/system-constant";

import { createDongHo, getDongHoExistsByInfo } from "@/app/api/dongho/route";
import { faArrowLeft, faArrowRight, faSave, faTasks } from "@fortawesome/free-solid-svg-icons";
import { DongHo, PDMData } from "@lib/types";
import { useDongHoList } from "@/context/ListDongHo";

import dynamic from "next/dynamic";
import { getPDMByMaTimDongHoPDM } from "@/app/api/pdm/route";
import api from "@/app/api/route";


interface NhomDongHoNuocFormProps {
    className?: string
}


export default function NhomDongHoNuocForm({ className }: NhomDongHoNuocFormProps) {
    const { user, isAdmin } = useUser();
    const [loading, setLoading] = useState<boolean>(true);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const [tenDongHo, setTenDongHo] = useState<string>("");
    const [selectedTenDHOption, setSelectedTenDHOption] = useState('');

    const [phuongTienDo, setPhuongTienDo] = useState<string>("");
    const [seriChiThi, setSeriChiThi] = useState<string>("");
    const [seriSensor, setSeriSensor] = useState<string>("");
    const [ccx, setCCX] = useState<string | null>(null);
    const [kieuChiThi, setKieuChiThi] = useState<string>("");
    const [kieuSensor, setKieuSensor] = useState<string>("");
    const [kieuThietBi, setKieuThietBi] = useState<string>("");
    const [soTem, setSoTem] = useState<string>("");
    const [coSoSanXuat, setCoSoSanXuat] = useState<string>("");
    const [namSanXuat, setNamSanXuat] = useState<Date | null>(null);
    const [dn, setDN] = useState<string>("");
    const [d, setD] = useState<string>("");
    const [q3, setQ3] = useState<string>("");
    const [r, setR] = useState<string>("");
    const [qn, setQN] = useState<string>("");
    const [kFactor, setKFactor] = useState<string>("");
    const [soQDPDM, setSoQDPDM] = useState<string>("");
    const [tenKhachHang, setTenKhachhang] = useState<string>("");
    const [phuongPhapThucHien, setPhuongPhapThucHien] = useState<string>("FMS - PP - 02");
    const [chuanThietBiSuDung, setChuanThietBiSuDung] = useState<string>("Đồng hồ chuẩn đo nước và Bình chuẩn");
    const [nguoiKiemDinh, setNguoiKiemDinh] = useState<string>(user?.fullname || "");
    const [nguoiSoatLai, setNguoiSoatLai] = useState<string>("");
    const [ngayThucHien, setNgayThucHien] = useState<Date | null>(new Date());
    const [hieuLucBienBan, setHieuLucBienBan] = useState<Date | null>(new Date());
    const [coSoSuDung, setCoSoSuDung] = useState<string>("");
    const [noiSuDung, setNoiSuDung] = useState<string>("");
    const [noiThucHien, setNoiThucHien] = useState<string>("");
    const [viTri, setViTri] = useState<string>("");
    const [nhietDo, setNhietDo] = useState<string>('');
    const [soGiayChungNhan, setSoGiayChungNhan] = useState<string>('');
    const [doAm, setDoAm] = useState<string>('');
    const [DHNameOptions, setDHNameOptions] = useState<{ value: string, label: string }[]>([]);

    const [isDHDienTu, setDHDienTu] = useState<boolean>(false);

    const [q2Ort, setQ1OrQt] = useState<number | null>(null);
    const [q1Ormin, setQ2OrQmin] = useState<number | null>(null);

    const [debouncedFields, setDebouncedFields] = useState<Partial<DongHo>>({});

    const { dongHo, setDongHo } = useDongHo();

    const { dongHoList,
        saveListDongHo,
        getDongHoDaKiemDinh,
        updateListDongHo,
        updateDongHoFieldsInList,
        dongHoSelected,
        setDongHoSelected,
        getDongHoChuaKiemDinh,
        savedDongHoList,
        setSavedDongHoList
    } = useDongHoList();

    // const [showModalSelectDongHoToSave, setShowModalSelectDongHoToSave] = useState(false);

    const [showFormTienTrinh, setShowFormTienTrinh] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [error, setError] = useState("");
    const [errorPDM, setErrorPDM] = useState("");

    const [errorSoTem, setErrorSoTem] = useState("");
    const [errorGCN, setErrorGCN] = useState("");
    const [errorSerialSensor, setErrorSerialSensor] = useState("");
    const [errorSerialChiThi, setErrorSerialChiThi] = useState("");

    const [errorFields, setErrorFields] = useState<string[]>([]);
    const [checking, setChecking] = useState(false);
    const [isCheckingInfo, setCheckingInfo] = useState(false);

    const router = useRouter();

    const [isDHSaved, setDHSaved] = useState<boolean | null>(null);
    const [isExistsDHSaved, setExitsDHSaved] = useState<boolean>(false);

    const [isFirstTabLL, setFirsttabLL] = useState<boolean>(false);
    const fetchCalled = useRef(false);
    const [selectedCssxOption, setSelectedCssxOption] = useState('');
    const [CSSXOptions, setCSSXOptions] = useState<{ value: string, label: string }[]>([]);

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

    // Query dongho name
    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

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
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Debounce effect
    useEffect(() => {
        const handler = setTimeout(() => {
            updateDongHoFieldsInList(selectedDongHoIndex, debouncedFields);
        }, 300); // 500ms debounce delay

        return () => {
            clearTimeout(handler);
        };
    }, [debouncedFields]);

    const handleChangeField = (field: keyof DongHo, value: string) => {
        setDebouncedFields(prevFields => ({ ...prevFields, [field]: value }));
    };

    const {
        getDuLieuKiemDinhJSON,
        ketQua, formHieuSaiSo,
        setDuLieuKiemDinhCacLuuLuong,
        setFormHieuSaiSo, setKetQua,
        initialFormHieuSaiSo,
        initialDuLieuKiemDinhCacLuuLuong
    } = useKiemDinh();

    useEffect(() => {
        if (isFirstTabLL) {
            setFirsttabLL(false);
        }
    }, [isFirstTabLL])

    // Func: Set saved
    useEffect(() => {
        if (savedDongHoList.length > 0) {
            setExitsDHSaved(true);
            updateDongHoSaved(getCurrentDongHo())
        }
    }, [savedDongHoList]);

    const [selectedDongHoIndex, setSelectedDongHoIndex] = useState<number>(0); // State để lưu trữ chỉ số đồng hồ đã chọn

    const scrollRef = useRef<HTMLDivElement | null>(null);

    const filterPDM = useMemo(() => ({
        tenDongHo: tenDongHo,
        dn: dn,
        ccx: ccx,
        kieuSensor: kieuSensor,
        kieuChiThi: kieuChiThi,
        qn: qn,
        q3: q3,
        r: r
    }), [tenDongHo, dn, ccx, kieuSensor, kieuChiThi, qn, q3, r]);

    const soQDPDMRef = useRef(soQDPDM);

    // Func: Set err
    useEffect(() => {
        if (soQDPDMRef.current != soQDPDM) {
            setErrorPDM("");
            soQDPDMRef.current = soQDPDM
        }
    }, [soQDPDM]);

    const filterPDMRef = useRef(filterPDM);

    useEffect(() => {
        if (filterPDMRef.current !== filterPDM) {
            if (filterPDM.tenDongHo && filterPDM.dn && filterPDM.ccx && (filterPDM.kieuSensor || filterPDM.kieuChiThi) && ((filterPDM.q3 && filterPDM.r) || filterPDM.qn)) {
                const ma_tim_dong_ho_pdm = convertToUppercaseNonAccent(filterPDM.tenDongHo + filterPDM.dn + filterPDM.ccx + filterPDM.kieuSensor + filterPDM.kieuChiThi + (isDHDienTu ? (filterPDM.q3 + filterPDM.r) : filterPDM.qn));

                const handler = setTimeout(async () => {
                    const res = await getPDMByMaTimDongHoPDM(ma_tim_dong_ho_pdm);
                    if (res.status == 200 || res.status == 201) {
                        const pdm = res.data;
                        const getDate = new Date(pdm.ngay_qd_pdm)
                        setSoQDPDM(pdm.so_qd_pdm + (getDate.getFullYear() ? "-" + getDate.getFullYear() : ""));
                        if (dayjs(pdm.ngay_het_han) < dayjs()) {
                            setErrorPDM("Số quyết định PDM đã hết hạn.")
                            setPhuongPhapThucHien("FMS - PP - 02")
                            // setSoQDPDM("");
                            setCanSave(false);
                        }
                        setCoSoSuDung(pdm.don_vi_pdm);
                        setPhuongPhapThucHien("ĐNVN 17:2017");
                    } else if (res.status == 404) {
                        setErrorPDM("Không có số PDM phù hợp hoặc số PDM đã hết hạn.")
                        setPhuongPhapThucHien("FMS - PP - 02")
                        // setErrorPDM("")
                        setSoQDPDM("");
                    } else {
                        setErrorPDM("Có lỗi xảy ra khi lấy số quyết định PDM!")
                        setSoQDPDM("");
                    }
                }, 500);

                return () => {
                    clearTimeout(handler);
                };

            }
            filterPDMRef.current = filterPDM;
        }
    }, [filterPDM]);

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
        kFactor: "Hệ số K",
        so_qd_pdm: "Ký hiệu PDM/Số quyết định PDM",
        ten_khach_hang: "Tên khách hàng",
        co_so_su_dung: "Đơn vị phê duyệt mẫu",
        phuong_phap_thuc_hien: "Phương pháp thực hiện",
        noi_su_dung: "Nơi sử dụng",
        vi_tri: "Địa chỉ nơi sử dụng",
        nhiet_do: "Nhiệt độ",
        do_am: "Độ ẩm",
        ket_qua: "Tiến trình chạy lưu lượng"
    };

    const fields = [
        { value: tenDongHo, setter: setTenDongHo, id: "ten_dong_ho" },
        // { value: phuongTienDo, setter: setPhuongTienDo, id: "phuong_tien_do" },
        { value: kieuThietBi, setter: setKieuThietBi, id: "kieu_thiet_bi" },

        // TODO: Seri
        // { value: seriChiThi, setter: setSeriChiThi, id: "seri_chi_thi" },
        // { value: seriSensor, setter: setSeriSensor, id: "seri_sensor" },
        // { value: kieuChiThi, setter: setKieuChiThi, id: "kieu_chi_thi" },
        // { value: kieuSensor, setter: setKieuSensor, id: "kieu_sensor" },

        // { value: soTem, setter: setSoTem, id: "so_tem" },
        { value: coSoSanXuat, setter: setCoSoSanXuat, id: "co_so_san_xuat" },
        // { value: namSanXuat, setter: setNamSanXuat, id: "nam_san_xuat" },
        { value: dn, setter: setDN, id: "dn" },
        { value: d, setter: setD, id: "d" },
        { value: ccx, setter: setCCX, id: "ccx" },
        { value: q3, setter: setQ3, id: "q3" },
        { value: r, setter: setR, id: "r" },
        { value: qn, setter: setQN, id: "qn" },
        // { value: kFactor, setter: setKFactor, id: "kFactor" },
        { value: soQDPDM, setter: setSoQDPDM, id: "so_qd_pdm" },
        { value: tenKhachHang, setter: setTenKhachhang, id: "ten_khach_hang" },
        { value: coSoSuDung, setter: setCoSoSuDung, id: "co_so_su_dung" },
        { value: phuongPhapThucHien, setter: setPhuongPhapThucHien, id: "phuong_phap_thuc_hien" },
        { value: noiSuDung, setter: setNoiSuDung, id: "noi_su_dung" },
        // { value: viTri, setter: setViTri, id: "vi_tri" },
        // { value: nhietDo, setter: setNhietDo, id: "nhiet_do" },
        // { value: doAm, setter: setDoAm, id: "do_am" },
    ];

    useEffect(() => {
        setKetQua(isDongHoDatTieuChuan(formHieuSaiSo));
        setShowFormTienTrinh(errorFields.length === 0)
        if (errorFields.length != 0) {
            setKetQua(null)
            setSoTem("");;
            setCanSave(false);
        };

        if (errorFields.length === 0 && !errorGCN && !errorSerialChiThi && !errorSerialSensor && !errorSoTem) {
            const checkQ3 = ((ccx && (ccx == "1" || ccx == "2")) || isDHDienTu);
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
                so_qd_pdm: soQDPDM,
                ten_khach_hang: tenKhachHang,
                co_so_su_dung: coSoSuDung,
                phuong_phap_thuc_hien: phuongPhapThucHien,
                chuan_thiet_bi_su_dung: chuanThietBiSuDung,
                nguoi_kiem_dinh: nguoiKiemDinh,
                nguoi_soat_lai: nguoiSoatLai,
                ngay_thuc_hien: ngayThucHien,
                noi_su_dung: noiSuDung || "",
                noi_thuc_hien: noiThucHien || DEFAULT_LOCATION,
                vi_tri: viTri || "",
                nhiet_do: nhietDo,
                do_am: doAm,
                du_lieu_kiem_dinh: getDuLieuKiemDinhJSON(), // Assuming this is not part of the form
                hieu_luc_bien_ban: soTem ? getLastDayOfMonthInFuture(isDHDienTu) : null,
                so_giay_chung_nhan: soGiayChungNhan,
            });

            if (isDongHoDatTieuChuan(formHieuSaiSo) != null && (soTem && soGiayChungNhan)) {
                setCanSave(true);
            }
        } else {
            setCanSave(false);

        }
    }, [errorFields, errorGCN, errorSerialChiThi, errorSerialSensor, errorSoTem]);

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
        tenDongHo, kieuThietBi, seriChiThi, seriSensor, kieuChiThi, kieuSensor, soTem, coSoSanXuat, dn, d, ccx, q3, r, qn, soQDPDM, tenKhachHang, coSoSuDung, phuongPhapThucHien, viTri, nhietDo, doAm, isDHDienTu
    ]);

    const infoStates = [
        { info: soTem, setError: setErrorSoTem, title: "Số tem" },
        { info: soGiayChungNhan, setError: setErrorGCN, title: "Số giấy chứng nhận" },
        { info: seriSensor, setError: setErrorSerialSensor, title: "Serial sensor" },
        { info: seriChiThi, setError: setErrorSerialChiThi, title: "Serial chỉ thị" },
    ];

    const previousInfoStates = useRef(infoStates.map(state => state.info));

    useEffect(() => {
        infoStates.forEach(({ info, setError, title }, index) => {
            if (info && !isDHSaved && info !== previousInfoStates.current[index]) {
                setCheckingInfo(true)
                const handler = setTimeout(async () => {
                    const res = await getDongHoExistsByInfo(info);
                    if (res?.status === 200 || res?.status === 201) {
                        setError(title + " đã tồn tại!");
                    } else if (res?.status === 404) {
                        setError("");
                    } else {
                        setError("Có lỗi xảy ra khi kiểm tra " + title + "!");
                    }
                    setCheckingInfo(false)
                }, 500);

                return () => {
                    clearTimeout(handler);
                };
            }
            if (!info) {
                setError("")
            }
        });

        previousInfoStates.current = infoStates.map(state => state.info);
    }, [soTem, soGiayChungNhan, seriSensor, seriChiThi]);

    useEffect(() => {
        if (errorGCN || errorSerialChiThi || errorSerialSensor || errorSoTem) {
            setCanSave(false);
            setHieuLucBienBan(null);
        } else {
            setCanSave(soTem && soGiayChungNhan ? true : false);
            setHieuLucBienBan(soTem && soGiayChungNhan ? getLastDayOfMonthInFuture(isDHDienTu) : null);
        }
    }, [soTem, soGiayChungNhan]);

    const getCurrentDongHo = () => {
        const checkQ3 = ((ccx && (ccx == "1" || ccx == "2")) || isDHDienTu);
        return {
            id: null,
            ten_dong_ho: tenDongHo || "",
            group_id: convertToUppercaseNonAccent(tenDongHo + dn + ccx + q3 + r + qn + (ngayThucHien ? dayjs(ngayThucHien).format('DDMMYYHHmmss') : '')),
            phuong_tien_do: phuongTienDo,
            seri_chi_thi: seriChiThi,
            seri_sensor: checkQ3 ? seriSensor : "",
            kieu_chi_thi: kieuChiThi,
            kieu_sensor: checkQ3 ? kieuSensor : "",
            kieu_thiet_bi: kieuThietBi,
            co_so_san_xuat: coSoSanXuat,
            so_tem: soTem || "",
            nam_san_xuat: namSanXuat || null,
            dn: dn,
            d: d,
            ccx: ccx,
            q3: checkQ3 ? q3 : "",
            r: r,
            qn: checkQ3 ? "" : qn,
            k_factor: kFactor || "",
            so_qd_pdm: soQDPDM || "",
            ten_khach_hang: tenKhachHang || "",
            co_so_su_dung: coSoSuDung || "",
            phuong_phap_thuc_hien: phuongPhapThucHien || "",
            chuan_thiet_bi_su_dung: chuanThietBiSuDung || "",
            nguoi_kiem_dinh: nguoiKiemDinh || "",
            nguoi_soat_lai: nguoiSoatLai || "",
            ngay_thuc_hien: ngayThucHien,
            noi_su_dung: noiSuDung || "",
            noi_thuc_hien: noiThucHien || DEFAULT_LOCATION,
            vi_tri: viTri || "",
            nhiet_do: nhietDo || "",
            do_am: doAm || "",
            du_lieu_kiem_dinh: getDuLieuKiemDinhJSON(),
            hieu_luc_bien_ban: soTem ? getLastDayOfMonthInFuture(isDHDienTu) : null,
            so_giay_chung_nhan: soGiayChungNhan || "",
        }
    }

    // Func: Save dong ho
    const handleSaveDongHo = async () => {
        const currentDongHo = getCurrentDongHo();
        if (canSave) {
            try {
                const response = await createDongHo(currentDongHo);
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
                        setSavedDongHoList((prevState) => {
                            return [
                                ...prevState,
                                currentDongHo
                            ]
                        })
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

    // Func: Hieu sai so
    useEffect(() => {
        if (q3 || qn) {
            setKetQua(isDongHoDatTieuChuan(formHieuSaiSo));
        }
        if (checking) {
            setChecking(false);
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

    // TODO: Check cơ điện từ
    useEffect(() => {
        setDHDienTu(Boolean((ccx && ["1", "2"].includes(ccx)) || (kieuThietBi && ["Điện tử"].includes(kieuThietBi))));
        if (kieuThietBi) {
            setPhuongTienDo(kieuThietBi == "Điện tử" ? "Đồng hồ đo nước lạnh có cơ cấu điện tử" : "Đồng hồ đo nước lạnh cơ khí")
        } else {
            setPhuongTienDo("");
        }
    }, [ccx, kieuThietBi]);

    // Fumc: Get Q1, Q2
    useEffect(() => {
        if (ccx && ((q3 && r) || qn)) {
            const { getQ1OrMin, getQ2OrQt } = getQ2OrQtAndQ1OrQMin(isDHDienTu, ccx, isDHDienTu ? q3 : qn, r);
            setQ2OrQmin(getQ1OrMin);
            setQ1OrQt(getQ2OrQt);
        }
    }, [ccx, q3, qn, r]);

    //Check doAm
    useEffect(() => {
        const humidity = parseFloat(doAm);
        if (humidity > 100) {
            setDoAm('100');
        } else if (humidity < 0) {
            setDoAm('0');
        }
    }, [doAm]);

    const updateDongHoSaved = (dongHoSelected: DongHo) => {
        for (const dongHo of savedDongHoList) {
            setDHSaved(false);
            if (dongHo.seri_sensor == dongHoSelected.seri_sensor && dongHo.seri_chi_thi == dongHoSelected.seri_chi_thi) {
                setDHSaved(true);
                break;
            }
        }
    }

    // Gán giá trị khi slect dongHo
    useEffect(() => {
        if (dongHoSelected) {
            setCanSave(false);
            setErrorGCN("");
            setErrorSerialChiThi("");
            setErrorSerialSensor("");
            setErrorSoTem("");
            // setFirsttabLL(true);

            const duLieuKiemDinhJSON = dongHoSelected.du_lieu_kiem_dinh; // Define the type

            if (duLieuKiemDinhJSON) {
                const duLieuKiemDinh = JSON.parse(duLieuKiemDinhJSON);
                console.log(duLieuKiemDinh.du_lieu)
                setDuLieuKiemDinhCacLuuLuong(duLieuKiemDinh.du_lieu || initialDuLieuKiemDinhCacLuuLuong);

                setFormHieuSaiSo(duLieuKiemDinh.hieu_sai_so || initialFormHieuSaiSo);

                setSeriChiThi(dongHoSelected.seri_chi_thi || "");
                setSeriSensor(dongHoSelected.seri_sensor || "");
                setKFactor(dongHoSelected.k_factor || "");
                setSoGiayChungNhan(dongHoSelected.so_giay_chung_nhan || "");
                setSoTem(dongHoSelected.so_tem || "");
                setHieuLucBienBan(dongHoSelected.hieu_luc_bien_ban ? new Date(dongHoSelected.hieu_luc_bien_ban) : null);
            } else {
                setFormHieuSaiSo(initialFormHieuSaiSo);
                setDuLieuKiemDinhCacLuuLuong(initialDuLieuKiemDinhCacLuuLuong);
            }

            updateDongHoSaved(dongHoSelected);
        }
    }, [dongHoSelected]);

    const updateCurrentDongHo = () => {
        const currentDongHo = getCurrentDongHo();
        if (currentDongHo != dongHoSelected) {
            updateListDongHo(selectedDongHoIndex, currentDongHo);
        }
    }

    // Handle selection change
    const handleDongHoChange = (selectedIndex: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        setSelectedDongHoIndex(selectedIndex);
        setDongHoSelected(dongHoList[selectedIndex]);
        updateCurrentDongHo();
    };

    // Handle previous and next button clicks
    const handlePrevDongHo = () => {
        if (selectedDongHoIndex > 0) {
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            setSelectedDongHoIndex(selectedDongHoIndex - 1);
            setDongHoSelected(dongHoList[selectedDongHoIndex - 1]);
            updateCurrentDongHo();
        }
    };

    const handleNextDongHo = () => {
        if (selectedDongHoIndex < dongHoList.length - 1) {
            // if (scrollRef.current) {
            //     scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            // }
            setSelectedDongHoIndex(selectedDongHoIndex + 1);
            setDongHoSelected(dongHoList[selectedDongHoIndex + 1]);
            updateCurrentDongHo();
        }
    };

    // const handleSaveDongHoWithOptions = () => {
    //     handleShowModal();
    // }

    const handleSaveAllDongHo = () => {
        const dongHoChuaKiemDinh = getDongHoChuaKiemDinh(dongHoList);
        const dongHoDaKiemDinhCount = dongHoList.length - dongHoChuaKiemDinh.length;

        if (dongHoChuaKiemDinh.length === 0) {
            // All dongHo are verified
            Swal.fire({
                title: 'Xác nhận!',
                text: 'Xác nhận lưu toàn bộ?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Hủy',
                confirmButtonText: 'Lưu',
                reverseButtons: true
            }).then((rs) => {
                if (rs.isConfirmed) {
                    Swal.fire({
                        title: 'Đang lưu đồng hồ',
                        html: 'Đang chuẩn bị...',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                            saveListDongHo(dongHoList);
                            updateDongHoSaved(getCurrentDongHo())
                        }
                    });
                }
            });
        } else if (dongHoDaKiemDinhCount === 0 || (dongHoChuaKiemDinh.length == dongHoList.length - savedDongHoList.length)) {
            // No dongHo are verified
            Swal.fire({
                title: 'Chú ý!',
                text: 'Chưa có đồng hồ nào được kiểm định, hãy kiểm tra lại.',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
            });
        } else {
            // Some dongHo are not verified
            Swal.fire({
                title: 'Chú ý!',
                text: 'Có ' + dongHoChuaKiemDinh.length + ' đồng hồ chưa kiểm định. Chỉ có thể lưu toàn bộ những đồng hồ đã kiểm định. Có muốn tiếp tục lưu?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Hủy',
                confirmButtonText: 'Lưu',
                reverseButtons: true
            }).then((rs) => {
                if (rs.isConfirmed) {
                    Swal.fire({
                        title: 'Đang lưu đồng hồ',
                        html: 'Đang chuẩn bị...',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                            saveListDongHo(getDongHoDaKiemDinh(dongHoList));
                            updateDongHoSaved(getCurrentDongHo())
                        }
                    });
                }
            });
        }
    }

    const filteredCcxOptions = (q3: string | undefined, qn: string | undefined) => {
        const options = ccxOptions as unknown as readonly GroupBase<never>[];

        const q3Value = q3 ? parseFloat(q3) : undefined;
        const qnValue = qn ? parseFloat(qn) : undefined;

        if ((q3Value && q3Value > 15) || (qnValue && qnValue > 15)) {
            if (ccx && ccx.includes("D")) {
                setCCX(null);
            }
            return options.filter(option => option.label !== "D");
        }
        return options;
    };

    // const handleShowModal = () => {
    //     updateCurrentDongHo();
    //     setShowModalSelectDongHoToSave(true)
    // };
    // const handleCloseModal = () => setShowModalSelectDongHoToSave(false);

    if (loading) {
        return <Loading></Loading>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
            {/* <ModalSelectDongHoToSave
                dongHoList={dongHoList}
                show={showModalSelectDongHoToSave}
                handleClose={handleCloseModal}
                setExitsDHSaved={setExitsDHSaved}
            /> */}
            <div className={`${className ? className : ""} ${ui_vfm['wraper']} container-fluid p-0 px-2 py-3 w-100`}>
                <div className={`row m-0 mb-3 p-3 w-100 bg-white shadow-sm rounded`}>
                    <div className="w-100 m-0 p-0 mb-3 position-relative">
                        <h3 className="text-uppercase fw-bolder text-center mt-3 mb-0">thông tin chung đồng hồ</h3>
                    </div>
                    <div className={`w-100 p-0 row m-0`}>
                        <div className={`col-12 p-0 mb-3 ${ui_vfm['seri-number-input']}`}>
                            <label htmlFor="ten_dong_ho" className={`form-label m-0 fs-5 fw-bold d-block`} style={{ width: "150px" }}>Tên đồng hồ:</label>
                            <CreatableSelect
                                options={DHNameOptions as unknown as readonly GroupBase<never>[]}
                                className="basic-multi-select col-12 col-md-6 px-3"
                                placeholder="Tên đồng hồ"
                                classNamePrefix="select"
                                isClearable
                                id="ten_dong_ho"
                                value={selectedTenDHOption || null}
                                isDisabled={isExistsDHSaved}
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
                                        backgroundColor: isExistsDHSaved ? "#e9ecef" : "white",
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
                    </div>
                    <div className={`collapse ${isCollapsed ? '' : 'show'} w-100 mt-2 p-0`}>
                        <form className="w-100">
                            <label className="w-100 fs-5 fw-bold">Thông tin thiết bị:</label>
                            <div className="row mx-0 w-100 mb-3">
                                {/* <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="phuongTienDo" className="form-label">Tên phương tiện đo:</label>
                                    <Select
                                        name="phuongTienDo"
                                        options={phuongTienDoOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="-- Chọn tên --"
                                        isClearable
                                        isDisabled={isExistsDHSaved}
                                        value={phuongTienDoOptions.find(option => option.label == phuongTienDo) || null}
                                        onChange={(selectedOptions: any) => setPhuongTienDo(selectedOptions ? selectedOptions.label : "")}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                minHeight: '42px',
                                                borderColor: '#dee2e6 !important',
                                                boxShadow: 'none !important',
                                                backgroundColor: isExistsDHSaved ? "#e9ecef" : "white",
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
                                                color: state.isDisabled ? '#000' : provided.color,
                                            })
                                        }}
                                    />
                                </div> */}

                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="kieuThietBi" className="form-label">Kiểu:</label>
                                    <Select
                                        name="type"
                                        options={typeOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        placeholder="-- Chọn kiểu --"
                                        classNamePrefix="select"
                                        isClearable
                                        isDisabled={isExistsDHSaved}
                                        id="kieuThietBi"
                                        value={typeOptions.find(option => option.value === kieuThietBi) || null} // Kiểm tra giá trị
                                        onChange={(selectedOptions: any) => setKieuThietBi(selectedOptions ? selectedOptions.value : "")}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                minHeight: '42px',
                                                borderColor: '#dee2e6 !important',
                                                boxShadow: 'none !important',
                                                backgroundColor: isExistsDHSaved ? "#e9ecef" : "white",
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
                                                color: state.isDisabled ? '#000' : provided.color,
                                            })
                                        }}
                                    />
                                </div>

                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="coSoSanXuat" className="form-label">Cơ sở sản xuất:</label>
                                    <CreatableSelect
                                        options={CSSXOptions as unknown as readonly GroupBase<never>[]}
                                        className="basic-multi-select"
                                        placeholder="Cơ sở sản xuất"
                                        classNamePrefix="select"
                                        isClearable
                                        isDisabled={isExistsDHSaved}
                                        id="noi_san_xuat"
                                        value={selectedCssxOption || null}
                                        isSearchable
                                        onChange={(selectedOptions: any) => {
                                            if (selectedOptions) {
                                                const values = selectedOptions.value;

                                                setSelectedCssxOption(selectedOptions);
                                                setCoSoSanXuat(values);
                                            } else {
                                                setSelectedCssxOption('');
                                                setCoSoSanXuat("");
                                            }
                                        }}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                minHeight: '42px',
                                                borderColor: '#dee2e6 !important',
                                                boxShadow: 'none !important',
                                                backgroundColor: isExistsDHSaved ? "#e9ecef" : "white",
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
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="namSanXuat" className="form-label">Năm sản xuất:</label>
                                    <DatePicker
                                        className={`${ui_vfm['date-picker']}`}
                                        value={namSanXuat ? dayjs(namSanXuat) : null}
                                        views={['year']}
                                        format="YYYY"
                                        minDate={dayjs('1900-01-01')}
                                        maxDate={dayjs().endOf('year')}
                                        disabled={isExistsDHSaved}
                                        onChange={(newValue: Dayjs | null) => {
                                            if (newValue) {

                                                setNamSanXuat(newValue.toDate());
                                            } else {
                                                setNamSanXuat(null); // or handle invalid date
                                            }

                                        }}
                                        slotProps={{ textField: { fullWidth: true, style: { backgroundColor: isExistsDHSaved ? "#e9ecef" : "white" } } }}
                                    />
                                </div>
                            </div>
                            <label className="w-100 fs-5 fw-bold">Đặc trưng kỹ thuật:</label>
                            <div className="row mx-0 w-100 mb-3">
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="kieu_sensor" className="form-label">- Kiểu sensor:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="kieu_sensor"
                                        disabled={isExistsDHSaved}
                                        value={kieuSensor || ""}
                                        onChange={(e) => {
                                            setKieuSensor(e.target.value);
                                            handleChangeField('kieu_sensor', e.target.value)
                                        }}
                                    />
                                </div>
                                {((ccx && (ccx == "1" || ccx == "2")) || isDHDienTu) ? <>
                                    <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                        <label htmlFor="kieu_chi_thi" className="form-label">- Kiểu chỉ thị:</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="kieu_chi_thi"
                                                disabled={isExistsDHSaved}
                                                value={kieuChiThi || ""}
                                                onChange={(e) => {
                                                    setKieuChiThi(e.target.value);
                                                    handleChangeField('kieu_chi_thi', e.target.value)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </> :
                                    <div className="mb-3 col-12 col-md-6 d-xxl-none">
                                    </div>}
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="dn" className="form-label">- Đường kính danh định (DN):</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="dn"
                                            value={dn || ""}
                                            onChange={handleNumberChange(setDN)}
                                            disabled={isExistsDHSaved}

                                        />
                                        <span className="input-group-text">mm</span>
                                    </div>
                                </div>
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="ccx" className="form-label">- Cấp chính xác:</label>
                                    <Select
                                        name="ccx"
                                        options={filteredCcxOptions(q3, qn)}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="-- Chọn cấp --"
                                        isDisabled={isExistsDHSaved}
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
                                                backgroundColor: isExistsDHSaved ? "#e9ecef" : "white",
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
                                                color: state.isDisabled ? '#000' : provided.color,
                                            })
                                        }}
                                    />
                                </div>

                                {((ccx && (ccx == "1" || ccx == "2")) || isDHDienTu) ? <>
                                    <div className="mb-3 col-12 col-md-6 col-lg-4 col-xxl-4">
                                        <label htmlFor="q3" className="form-label">- Q<sub>3</sub>:</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="q3"
                                                value={q3 || ""}
                                                onChange={handleNumberChange(setQ3)}

                                                disabled={isExistsDHSaved}
                                            />
                                            <span className="input-group-text">m<sup>3</sup>/h</span>
                                        </div>
                                    </div>
                                    <div className="mb-3 col-12 col-md-6 col-lg-4 col-xxl-4">
                                        <label htmlFor="r" className="form-label">- Tỷ số Q<sub>3</sub>/Q<sub>1</sub> (R):</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="r"
                                            value={r || ""}
                                            onChange={handleNumberChange(setR)}
                                            disabled={isExistsDHSaved}
                                        />
                                    </div>
                                </> : <>
                                    <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                        <label htmlFor="qn" className="form-label">- Q<sub>n</sub>:</label>
                                        <div className="input-group">
                                            <input

                                                type="text"
                                                className="form-control"
                                                id="qn"
                                                value={qn || ""}
                                                onChange={handleNumberChange(setQN)}
                                                disabled={isExistsDHSaved}
                                            />
                                            <span className="input-group-text">m<sup>3</sup>/h</span>
                                        </div>
                                    </div>
                                </>}
                                <div className={`mb-3 col-12 col-md-6 ${isDHDienTu ? "col-lg-4" : ""} col-xxl-4`}>
                                    <label htmlFor="dn" className="form-label">- Độ chia nhỏ nhất (d):</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="d"
                                        value={d || ""}
                                        onChange={handleNumberChange(setD)}
                                        disabled={isExistsDHSaved}

                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="so_qd_pdm" className="form-label">- Ký hiệu PDM/Số quyết định PDM:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="so_qd_pdm"
                                        disabled={isExistsDHSaved}
                                        value={soQDPDM || ""}
                                        onChange={(e) => setSoQDPDM(e.target.value)}
                                    />
                                    {errorPDM && <small className="text-danger">{errorPDM}</small>}
                                </div>

                                {((ccx && (ccx == "1" || ccx == "2")) || isDHDienTu) && <>
                                    <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                        <label htmlFor="kFactor" className="form-label">- Hệ số K:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="kFactor"
                                            disabled={isExistsDHSaved}
                                            value={kFactor || ""}
                                            onChange={handleNumberChange(setKFactor)}
                                        />
                                    </div>
                                </>}
                                <div className={`mb-3 col-12 d-flex ${isAdmin ? "" : "d-none"}`}>
                                    <Link
                                        href={ACCESS_LINKS.PDM_ADD.src}
                                        className="btn btn-success px-3 py-2 text-white"
                                    >
                                        Thêm mới PDM
                                    </Link>
                                </div>
                            </div>
                            <label className="w-100 fs-5 fw-bold">Chi tiết kiểm định:</label>
                            <div className="row mx-0 w-100 mb-3">
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="tenKhachHang" className="form-label">Tên khách hàng:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tenKhachHang"
                                        disabled={isExistsDHSaved}
                                        value={tenKhachHang || ""}
                                        onChange={(e) => setTenKhachhang(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="coSoSuDung" className="form-label">Đơn vị phê duyệt mẫu:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="coSoSuDung"
                                        disabled={isExistsDHSaved}
                                        value={coSoSuDung || ""}
                                        onChange={(e) => setCoSoSuDung(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-xl-6">
                                    <label htmlFor="noi_su_dung" className="form-label">Nơi sử dụng:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="noi_su_dung"
                                        disabled={isExistsDHSaved}
                                        value={noiSuDung || ""}
                                        onChange={(e) => setNoiSuDung(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-xl-6">
                                    <label htmlFor="viTri" className="form-label">Địa chỉ nơi sử dụng:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="viTri"
                                        disabled={isExistsDHSaved}
                                        value={viTri || ""}
                                        onChange={(e) => setViTri(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="phuongPhapThucHien" className="form-label">Phương pháp thực hiện:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled={isExistsDHSaved}
                                        id="phuongPhapThucHien"
                                        placeholder="Phương pháp thực hiện"
                                        value={phuongPhapThucHien || ""}
                                        onChange={(e) => setPhuongPhapThucHien(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="chuanThietBiSuDung" className="form-label">Chuẩn, thiết bị chính được sử dụng:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="chuanThietBiSuDung"
                                        disabled={isExistsDHSaved}
                                        value={chuanThietBiSuDung || ""}
                                        onChange={(e) => setChuanThietBiSuDung(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="ngayThucHien" className="form-label">Ngày thực hiện:</label>
                                    <DatePicker
                                        className={`${ui_vfm['date-picker']}`}
                                        disabled={isExistsDHSaved}
                                        value={dayjs(ngayThucHien) || null}
                                        format="DD-MM-YYYY"
                                        maxDate={dayjs().endOf('day')}
                                        onChange={(newValue: Dayjs | null) => setNgayThucHien(newValue ? newValue.toDate() : null)}
                                        slotProps={{ textField: { fullWidth: true, style: { backgroundColor: isExistsDHSaved ? "#e9ecef" : "white" } } }}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="noi_su_dung" className="form-label">Nơi thực hiện:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="noi_thuc_hien"
                                        placeholder={DEFAULT_LOCATION}
                                        disabled={isExistsDHSaved}
                                        value={noiThucHien || ""}
                                        onChange={(e) => setNoiThucHien(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="nhietDo" className="form-label">Nhiệt độ:</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nhietDo"
                                            disabled={isExistsDHSaved}
                                            value={nhietDo || ""}
                                            onChange={handleNumberChange(setNhietDo)}
                                        />
                                        <span className="input-group-text">°C</span>
                                    </div>
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="doAm" className="form-label">Độ ẩm:</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="doAm"
                                            disabled={isExistsDHSaved}
                                            value={doAm || ""}
                                            onChange={handleNumberChange(setDoAm)}
                                        />
                                        <span className="input-group-text">%</span>
                                    </div>
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="nguoi_kiem_dinh" className="form-label">Người thực hiện:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nguoi_kiem_dinh"
                                        disabled={isExistsDHSaved}
                                        value={nguoiKiemDinh || ""}
                                        onChange={(e) => setNguoiKiemDinh(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="nguoi_kiem_dinh" className="form-label">Người soát lại:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nguoi_soat_lai"
                                        disabled={isExistsDHSaved}
                                        value={nguoiSoatLai || ""}
                                        onChange={(e) => setNguoiSoatLai(e.target.value)}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="w-100 m-0 p-0 d-flex justify-content-center align-items-center gap-4" ref={scrollRef}>
                        <span className={ui_vfm['end-line']}></span>
                        <button aria-label={`${isCollapsed ? "Hiện thêm" : "Ẩn bớt"}`} type="button" className={`btn ${ui_vfm['btn-collapse-info']} ${ui_vfm['btn-collapse-end']}`} onClick={toggleCollapse}>
                            {isCollapsed ? "Hiện thêm" : "Ẩn bớt"}
                        </button>
                        <span className={ui_vfm['end-line']}></span>
                    </div>
                </div>
                <div className={`m-0 mb-3 bg-white rounded shadow-sm w-100 position-relative`}>
                    <div className="w-100 m-0 mb-3 p-0 position-relative">
                        {/* Select Nav  */}
                        <div className={`w-100 p-3 shadow-sm rounded-top bg-main-blue d-flex align-items-center sticky-top justify-content-center`} style={{ top: "60px", zIndex: "900" }}>
                            <span className="fs-5 fw-bold mb-0 text-white me-2">Đồng hồ:</span>
                            <button aria-label="Đồng hồ trước" className="btn bg-white m-0 p-0 px-2 d-flex align-items-center justify-content-center" style={{ height: "42px", width: "42px" }} onClick={() => {
                                handlePrevDongHo()
                            }}>
                                <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: "1.6rem" }} className="fa-2x text-blue"></FontAwesomeIcon>
                            </button>

                            <div className="mx-2">
                                <Select
                                    name="selectDongHo"
                                    options={dongHoList.map((dongHo, index) => ({ value: index, label: "Đồng hồ " + (index + 1) }))} // Assuming each dong ho has a 'name' property
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="- Chọn đồng hồ -"
                                    value={{ value: selectedDongHoIndex, label: "Đồng hồ " + (selectedDongHoIndex + 1) } || null} // Đặt giá trị dựa trên state
                                    onChange={(selectedOptions) => {
                                        if (selectedOptions) {
                                            handleDongHoChange(selectedOptions.value);
                                        }
                                    }} // Pass the index
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            minWidth: "180px",
                                            width: "30vw",
                                            height: '42px',
                                            minHeight: '42px',
                                            borderColor: '#dee2e6 !important',
                                            boxShadow: 'none !important',
                                            backgroundColor: isExistsDHSaved ? "#e9ecef" : "white",
                                            overflow: "hidden"
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
                                            height: '42px',
                                            width: '34px'
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            zIndex: 777
                                        }),
                                        singleValue: (provided, state) => ({
                                            ...provided,
                                            color: state.isDisabled ? '#000' : provided.color,
                                        })
                                    }}
                                />
                            </div>

                            <button aria-label="Đồng hồ tiếp theo" className="btn bg-white m-0 p-0 px-2 d-flex align-items-center justify-content-center" style={{ height: "42px", width: "42px" }} onClick={() => {
                                handleNextDongHo()
                            }}>
                                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "1.6rem" }} className="fa-2x text-blue"></FontAwesomeIcon>
                            </button>
                        </div>
                        {/* End select nav  */}

                        <div className={`w-100 p-2`}>
                            {dongHoSelected ? (
                                <>
                                    <div className={`w-100 p-2`}>
                                        <h5 className="p-0">Thông tin kỹ thuật:</h5>
                                        <div className="row m-0 p-0">
                                            <div className="mb-3 col-12 col-md-6 col-xxl-6">
                                                <label htmlFor="seri_sensor" className="form-label">Serial sensor:</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="seri_sensor"
                                                    placeholder="Serial sensor"
                                                    value={seriSensor || ""}
                                                    disabled={isDHSaved != null && isDHSaved}
                                                    onChange={(e) => {
                                                        setSeriSensor(e.target.value);
                                                        handleChangeField('seri_sensor', e.target.value)
                                                    }}
                                                />
                                                {(errorSerialSensor && !isDHSaved) && <small className="text-danger">{errorSerialSensor}</small>}
                                            </div>
                                            {((ccx && (ccx == "1" || ccx == "2")) || isDHDienTu) && <>
                                                <div className="mb-3 col-12 col-md-6 col-xxl-6">
                                                    <label htmlFor="seri_chi_thi" className="form-label">Serial chỉ thị:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="seri_chi_thi"
                                                        placeholder="Serial chỉ thị"
                                                        value={seriChiThi || ""}
                                                        disabled={isDHSaved != null && isDHSaved}
                                                        onChange={(e) => {
                                                            setSeriChiThi(e.target.value);
                                                            handleChangeField('seri_chi_thi', e.target.value)
                                                        }}
                                                    />
                                                    {(errorSerialChiThi && !isDHSaved) && <small className="text-danger">{errorSerialChiThi}</small>}
                                                </div>
                                            </>}
                                        </div>

                                        <div className={`w-100 p-2 d-flex gap-2 justify-content-between ${showFormTienTrinh ? "d-none" : ""}`}>
                                            <div className={`w-100 px-3 row alert alert-warning m-0 ${(ketQua != null) ? "fade d-none" : "show"}`}>
                                                <h6><i>* Điền đủ các thông tin để hiện Form tiến trình!</i></h6>
                                                {errorFields.map((error, index) => (
                                                    <div className="col-12 col-sm-6 col-lg-4 col-xxl-3" key={index}><span className="me-2">•</span> {fieldTitles[error as keyof typeof fieldTitles]} là bắt buộc</div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={`w-100 ${showFormTienTrinh ? "" : "d-none"}`}>
                                            <h5 className="p-0">Đo lường:</h5>
                                            <NavTab buttonControl={true} gotoFirstTab={isFirstTabLL} tabContent={[
                                                {
                                                    title: <>Q<sub>{isDHDienTu ? "3" : "n"}</sub></>,
                                                    content: <TinhSaiSoTab isDHDienTu={isDHDienTu} onFormHSSChange={(value: number | null) => handleFormHSSChange(0, value)}
                                                        isDisable={isDHSaved != null && isDHSaved}
                                                        d={d ? d : ""} q={{
                                                            title: (isDHDienTu) ? TITLE_LUU_LUONG.q3 : TITLE_LUU_LUONG.qn,
                                                            value: (q3) ? q3 : ((qn) ? qn : "")
                                                        }} className="" tabIndex={1} Form={TinhSaiSoForm as any} />
                                                },
                                                {
                                                    title: <>Q<sub>{isDHDienTu ? "2" : "t"}</sub></>,
                                                    content: <TinhSaiSoTab onFormHSSChange={(value: number | null) => handleFormHSSChange(1, value)}
                                                        isDisable={isDHSaved != null && isDHSaved}
                                                        d={d ? d : ""} q={{
                                                            title: (isDHDienTu) ? TITLE_LUU_LUONG.q2 : TITLE_LUU_LUONG.qt,
                                                            value: (q2Ort) ? q2Ort.toString() : ""
                                                        }} tabIndex={2} Form={TinhSaiSoForm as any} />
                                                },
                                                {
                                                    title: <>Q<sub>{isDHDienTu ? "1" : "min"}</sub></>,
                                                    content: <TinhSaiSoTab onFormHSSChange={(value: number | null) => handleFormHSSChange(2, value)}
                                                        isDisable={isDHSaved != null && isDHSaved}
                                                        d={d ? d : ""} q={{
                                                            title: (isDHDienTu) ? TITLE_LUU_LUONG.q1 : TITLE_LUU_LUONG.qmin,
                                                            value: (q1Ormin) ? q1Ormin.toString() : ""
                                                        }} tabIndex={3} Form={TinhSaiSoForm as any} />
                                                },
                                            ]} />

                                            <div className={`w-100 px-2 py-1 d-flex gap-2 justify-content-between`}>
                                                <div className={`w-100 px-3 row alert alert-warning m-0 ${(ketQua != null) ? "fade d-none" : "show"} ${isDHSaved != null && isDHSaved ? "d-none" : ""}`}>
                                                    <h6><i>* Điền đủ các thông tin để hiện kết quả kiểm tra!</i></h6>

                                                    {ketQua == null && (
                                                        <div className="col-12"><span className="me-2">•</span>Tiến trình chạy lưu lượng không được bỏ trống</div>
                                                    )}
                                                </div>
                                                {/* <div className={`w-100 px-3 py-2 m-0 bg-lighter-grey rounded d-flex align-items-center justify-content-end ${(ketQua == null) || (checking) ? "fade d-none" : "show"}`}>
                                                    <button aria-label="Kiểm tra" className={`btn btn-success px-3 py-2 text-white ${ui_vfm['btn-check']}`} onClick={
                                                        () => {
                                                            // TODO:
                                                            // handleCheck();
                                                            setChecking(true);
                                                        }
                                                    }><FontAwesomeIcon className="me-2" icon={faTasks} />Kiểm tra</button>
                                                </div> */}
                                                {/* <div className={`w-100 px-3 p-xl-4 row alert ${ketQua ? "alert-success" : "alert-danger"} m-0 ${(ketQua != null) && (checking) ? "show" : "fade d-none"}`}>
                                                    <h5 className="p-0">Kết quả kiểm tra kỹ thuật:</h5>
                                                    <p className="p-0 m-0">- Khả năng hoạt động của hệ thống: <b className="text-uppercase">{ketQua ? "Đạt" : "Không đạt"}</b></p>
                                                    <div className={`w-100 m-0 mt-3 p-0 ${ketQua ? "" : "d-none"}`}>
                                                        <div className="w-100 m-0 p-0 justify-content-between">
                                                            <div className="w-100 m-0 p-0 row mb-3">

                                                                <div className={`col-12 col-md-10 col-xl-10 col-xxl-9 m-0 p-0 ps-lg-4 d-md-flex align-items-center justify-content-between ${ui_vfm['seri-number-input']}`}>
                                                                    <label htmlFor="soTem" className={`form-label m-0 fs-6 fw-bold d-block`}>Số Tem:</label>
                                                                    <input
                                                                        type="text"
                                                                        id="soTem"
                                                                        className={`form-control`}
                                                                        placeholder="Nhập số tem"
                                                                        value={ketQua ? soTem : ""}
                                                                        disabled={isDHSaved != null && isDHSaved}
                                                                        onChange={(e) => setSoTem(e.target.value)}
                                                                    />
                                                                </div>
                                                                {errorSoTem && <small className="text-danger px-4">{errorSoTem}</small>}
                                                            </div>
                                                            <div className="w-100 m-0 p-0 row mb-3">
                                                                <div className={`col-12 col-md-10 col-xl-10 col-xxl-9 m-0 p-0 ps-lg-4 d-md-flex align-items-center justify-content-between ${ui_vfm['seri-number-input']}`}>
                                                                    <label htmlFor="soGiayChungNhan" className={`form-label m-0 fs-6 fw-bold d-block`} style={{ width: "210px" }}>Số giấy chứng nhận:</label>
                                                                    <div className="input-group d-flex align-items-center justify-content-center">
                                                                        <input
                                                                            type="text"
                                                                            id="soGiayChungNhan"
                                                                            className={`form-control`}
                                                                            style={{ width: "max-content", borderTopRightRadius: "0", borderBottomRightRadius: "0" }}
                                                                            placeholder="Nhập số giấy chứng nhận"
                                                                            value={ketQua ? soGiayChungNhan : ""}
                                                                            disabled={isDHSaved != null && isDHSaved}
                                                                            onChange={(e) => setSoGiayChungNhan(e.target.value)}
                                                                        />
                                                                        <span className="input-group-text" style={{ height: "42px" }}>Số: FMS.KĐ.<span className="text-primary">{soGiayChungNhan || "-----"}</span>.{dayjs().format("YY")}</span>
                                                                    </div>
                                                                </div>
                                                                {errorGCN && <small className="text-danger px-4">{errorGCN}</small>}
                                                            </div>

                                                            <div className="w-100 m-0 p-0 row mb-3">
                                                                <div className={`col-12 col-md-10 col-xl-10 col-xxl-9 m-0 p-0 ps-lg-4 d-md-flex align-items-center justify-content-between ${(soTem && soGiayChungNhan) ? "" : "d-none"} ${ui_vfm['seri-number-input']}`}>
                                                                    <label htmlFor="hieuLucBienBan" style={{ width: "180px" }} className="form-label m-0 fs-6 fw-bold d-block">Hiệu lực đến:</label>
                                                                    <DatePicker
                                                                        className={`bg-white ${ui_vfm['date-picker']}`}
                                                                        value={dayjs(hieuLucBienBan)}
                                                                        format="DD-MM-YYYY"
                                                                        // maxDate={dayjs().endOf('day')}
                                                                        disabled={isDHSaved != null && isDHSaved}
                                                                        minDate={dayjs().endOf('day')}
                                                                        onChange={(newValue: Dayjs | null) => setHieuLucBienBan(newValue ? newValue.toDate() : null)}
                                                                        slotProps={{ textField: { fullWidth: true } }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`w-100 m-0 px-0 d-flex gap-2 justify-content-end ${isDHSaved != null && isDHSaved ? "d-none" : ""}`}>
                                                        <button aria-label="Lưu Đồng hồ" className={`btn py-2 px-3 btn-success`}
                                                            disabled={(!canSave && (ketQua != null && ketQua)) || isCheckingInfo || !(!errorGCN && !errorSerialChiThi && !errorSerialSensor && !errorSoTem)}
                                                            onClick={handleSaveDongHo}
                                                        >
                                                            Lưu Đồng hồ
                                                        </button>
                                                    </div> */}
                                                {/* <div className={`w-100 m-0 px-0 d-flex gap-2 justify-content-end ${isDHSaved != null && isDHSaved ? "d-none" : ""}`}>
                                                    <button aria-label="Lưu Đồng hồ" className={`btn py-2 px-3 btn-success`}
                                                        disabled={(!canSave && (ketQua != null && ketQua)) || isCheckingInfo || !(!errorGCN && !errorSerialChiThi && !errorSerialSensor && !errorSoTem)}
                                                        onClick={handleSaveDongHo}
                                                    >
                                                        Lưu Đồng hồ
                                                    </button>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className={`w-100 m-0 p-2 d-flex gap-2 justify-content-between ${isDHSaved != null && isDHSaved ? "" : "d-none"}`}>
                                            <button aria-label="Đồng hồ đã lưu" className={`btn py-2 px-3 btn-secondary`} disabled={isDHSaved != null && isDHSaved}>
                                                Đồng hồ đã lưu
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="py-4 w-100 text-center"><i>CHƯA CHỌN ĐỒNG HỒ</i></p>
                            )}
                        </div>

                        {/* Select Nav  */}
                        <div className={`w-100 rounded-bottom p-3 bg-light-grey d-flex align-items-center justify-content-center`}>
                            {/* <span className="fs-5 fw-bold mb-0 text-white me-2">Đồng hồ:</span> */}
                            <button aria-label="Đồng hồ trước" className="btn bg-white m-0 p-0 px-2 d-flex align-items-center justify-content-center" style={{ height: "42px", width: "42px" }}
                                onClick={() => {
                                    handlePrevDongHo()
                                }}>
                                <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: "1.6rem" }} className="fa-2x text-blue"></FontAwesomeIcon>
                            </button>

                            <div className="mx-2">
                                <Select
                                    name="selectDongHo"
                                    options={dongHoList.map((dongHo, index) => ({ value: index, label: "Đồng hồ " + (index + 1) }))}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="- Chọn đồng hồ -"
                                    value={{ value: selectedDongHoIndex, label: "Đồng hồ " + (selectedDongHoIndex + 1) } || null}
                                    onChange={(selectedOptions) => {
                                        if (selectedOptions) {
                                            handleDongHoChange(selectedOptions.value);
                                        }
                                    }} // Pass the index
                                    menuPlacement="top"
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            minWidth: "180px",
                                            width: "30vw",
                                            height: '42px',
                                            minHeight: '42px',
                                            borderColor: '#dee2e6 !important',
                                            boxShadow: 'none !important',
                                            backgroundColor: "white",
                                            overflow: "hidden"
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
                                            height: '42px',
                                            width: '34px'
                                        }),
                                        menu: (provided) => ({
                                            ...provided,
                                            zIndex: 777
                                        }),
                                        singleValue: (provided, state) => ({
                                            ...provided,
                                            color: state.isDisabled ? '#000' : provided.color,
                                        })
                                    }}
                                />
                            </div>

                            <button aria-label="Đồng hồ tiếp theo" className="btn bg-white m-0 p-0 px-2 d-flex align-items-center justify-content-center" style={{ height: "42px", width: "42px" }}
                                onClick={() => {
                                    handleNextDongHo()
                                }}>
                                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "1.6rem" }} className="fa-2x text-blue"></FontAwesomeIcon>
                            </button>
                        </div>
                        {/* End select nav  */}
                    </div>
                </div>
                <div className={`m-0 mb-3 bg-white rounded shadow-sm w-100 position-relative py-3 pt-md-4`}>
                    <h4 className="w-100 text-uppercase text-center">Thông tin riêng</h4>
                    <div className={`w-100 m-0 p-0 ${ui_vfm['wrap-process-table']}`}>
                        <table className={`table table-striped table-bordered table-hover ${ui_vfm['process-table']}`}>
                            <thead>
                                <tr className={`${ui_vfm['table-header']}`}>
                                    <th>
                                        <div className={`${ui_vfm['table-label']}`}>
                                            <span>
                                                Đồng hồ
                                            </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`${ui_vfm['table-label']}`}>
                                            <span>
                                                Số giấy CN
                                            </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`${ui_vfm['table-label']}`}>
                                            <span>
                                                Số Tem
                                            </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`${ui_vfm['table-label']}`}>
                                            <span>
                                                Serial Sensor
                                            </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`${ui_vfm['table-label']}`}>
                                            <span>
                                                Serial chỉ thị
                                            </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`${ui_vfm['table-label']}`}>
                                            <span>
                                                Hiệu lực đến
                                            </span>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`${ui_vfm['table-label']}`}>
                                            <span>
                                                Kết quả
                                            </span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        100
                                    </td>
                                    <td>
                                        <input className="form-control" style={{ width: "170px" }} />
                                        <small className="w-100 text-center text-danger">Serail sensor đã tồn tại</small>
                                    </td>
                                    <td>
                                        <input className="form-control" style={{ width: "170px" }} />
                                    </td>
                                    <td>
                                        <input className="form-control" style={{ width: "170px" }} />
                                    </td>
                                    <td>
                                        <input className="form-control" style={{ width: "170px" }} />
                                    </td>
                                    <td>

                                        <DatePicker
                                            className={`bg-white ${ui_vfm['date-picker']}`}
                                            value={dayjs(hieuLucBienBan) || null}
                                            format="DD-MM-YYYY"
                                            // maxDate={dayjs().endOf('day')}
                                            disabled={isDHSaved != null && isDHSaved}
                                            minDate={dayjs().endOf('day')}
                                            onChange={(newValue: Dayjs | null) => setHieuLucBienBan(newValue ? newValue.toDate() : null)}
                                            slotProps={{ textField: { fullWidth: true, style: { maxWidth: '175px' } } }}
                                        />
                                    </td>
                                    <td>
                                        <p className="m-0 p-0" style={{ width: "140px" }}>Chưa kiểm định</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className={`w-100 px-2 px-md-3 d-flex gap-2 align-items-center justify-content-end`}>
                        {/* <button aria-label="Áp dụng số giấy chứng nhận cho toàn đồng hồ" className="btn py-2 bg-light-grey px-4 text-white d-none" style={{ color: "#489444", border: "2px solid #489444 !important" }} onClick={
                            () => {
                                // TODO: set GCN for all dongHo 
                            }
                        }>
                            <FontAwesomeIcon icon={faCogs} className="me-2"></FontAwesomeIcon> Đặt số GCN cho toàn đồng hồ
                        </button>
                        <button aria-label="Lưu tùy chọn" className="btn py-2 px-4 bg-lighter-grey" style={{ color: "#137f0e" }} onClick={handleSaveDongHoWithOptions}>
                            <FontAwesomeIcon icon={faCheckSquare} className="me-2"></FontAwesomeIcon> Lưu tùy chọn
                        </button> */}
                        <button aria-label="Lưu toàn bộ" className="btn btn-success py-2 px-4" onClick={handleSaveAllDongHo}>
                            <FontAwesomeIcon icon={faSave} className="me-2"></FontAwesomeIcon> Lưu toàn bộ
                        </button>
                    </div>
                </div>
            </div>
        </LocalizationProvider >
    )
}