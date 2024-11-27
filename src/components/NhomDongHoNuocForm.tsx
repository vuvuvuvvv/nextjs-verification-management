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
const TableDongHoInfo = dynamic(() => import('@/components/TableInputDongHoInfo'));
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
    className?: string;
    generalInfoDongHo?: DongHo | null,
    isEditable?:boolean
}


export default function NhomDongHoNuocForm({ className, generalInfoDongHo,isEditable }: NhomDongHoNuocFormProps) {
    const { user, isAdmin } = useUser();
    const { dongHoList,
        createListDongHo,
        getDongHoDaKiemDinh,
        updateListDongHo,
        getDongHoChuaKiemDinh,
        savedDongHoList,
        setSavedDongHoList,
        setDongHoList
    } = useDongHoList();
    const {
        getDuLieuKiemDinhJSON,
        ketQua, formHieuSaiSo,
        setDuLieuKiemDinhCacLuuLuong,
        setFormHieuSaiSo, setKetQua,
        initialFormHieuSaiSo,
        initialDuLieuKiemDinhCacLuuLuong
    } = useKiemDinh();

    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const [tenDongHo, setTenDongHo] = useState<string>(generalInfoDongHo?.ten_dong_ho || "");
    const [selectedTenDHOption, setSelectedTenDHOption] = useState<{ value: string, label: string } | null>(
        generalInfoDongHo?.ten_dong_ho ? { value: generalInfoDongHo.ten_dong_ho, label: generalInfoDongHo.ten_dong_ho } : null
    );

    const [phuongTienDo, setPhuongTienDo] = useState<string>(generalInfoDongHo?.phuong_tien_do || "");
    const [ccx, setCCX] = useState<string | null>(generalInfoDongHo?.ccx || null);
    const [kieuChiThi, setKieuChiThi] = useState<string>(generalInfoDongHo?.kieu_chi_thi || "");
    const [kieuSensor, setKieuSensor] = useState<string>(generalInfoDongHo?.kieu_sensor || "");
    const [kieuThietBi, setKieuThietBi] = useState<string>(generalInfoDongHo?.kieu_thiet_bi || "");
    const [coSoSanXuat, setCoSoSanXuat] = useState<string>(generalInfoDongHo?.co_so_san_xuat || "");
    const [selectedCssxOption, setSelectedCssxOption] = useState<{ value: string, label: string } | null>(
        generalInfoDongHo?.co_so_san_xuat ? { value: generalInfoDongHo.co_so_san_xuat, label: generalInfoDongHo.co_so_san_xuat } : null
    );
    const [namSanXuat, setNamSanXuat] = useState<Date | null>(generalInfoDongHo?.nam_san_xuat || null);
    const [dn, setDN] = useState<string>(generalInfoDongHo?.dn || "");
    const [d, setD] = useState<string>(generalInfoDongHo?.d || "");
    const [q3, setQ3] = useState<string>(generalInfoDongHo?.q3 || "");
    const [r, setR] = useState<string>(generalInfoDongHo?.r || "");
    const [qn, setQN] = useState<string>(generalInfoDongHo?.qn || "");
    const [soQDPDM, setSoQDPDM] = useState<string>(generalInfoDongHo?.so_qd_pdm || "");
    const [tenKhachHang, setTenKhachhang] = useState<string>(generalInfoDongHo?.ten_khach_hang || "");
    const [phuongPhapThucHien, setPhuongPhapThucHien] = useState<string>(generalInfoDongHo?.phuong_phap_thuc_hien || "FMS - PP - 02");
    const [chuanThietBiSuDung, setChuanThietBiSuDung] = useState<string>(generalInfoDongHo?.chuan_thiet_bi_su_dung || "Đồng hồ chuẩn đo nước và Bình chuẩn");
    const [nguoiKiemDinh, setNguoiKiemDinh] = useState<string>(generalInfoDongHo?.nguoi_kiem_dinh || user?.fullname || "");
    const [nguoiSoatLai, setNguoiSoatLai] = useState<string>(generalInfoDongHo?.nguoi_soat_lai || "");
    const [ngayThucHien, setNgayThucHien] = useState<Date | null>(generalInfoDongHo?.ngay_thuc_hien || new Date());
    const [coSoSuDung, setCoSoSuDung] = useState<string>(generalInfoDongHo?.co_so_su_dung || "");
    const [noiSuDung, setNoiSuDung] = useState<string>(generalInfoDongHo?.noi_su_dung || "");
    const [noiThucHien, setNoiThucHien] = useState<string>(generalInfoDongHo?.noi_thuc_hien || "");
    const [viTri, setViTri] = useState<string>(generalInfoDongHo?.vi_tri || "");
    const [nhietDo, setNhietDo] = useState<string>(generalInfoDongHo?.nhiet_do || '');
    const [doAm, setDoAm] = useState<string>(generalInfoDongHo?.do_am || '');
    const [DHNameOptions, setDHNameOptions] = useState<{ value: string, label: string }[]>([]);

    const [isDHDienTu, setDHDienTu] = useState<boolean>(false);

    const [q2Ort, setQ1OrQt] = useState<number | null>(null);
    const [q1Ormin, setQ2OrQmin] = useState<number | null>(null);

    const [debouncedFields, setDebouncedFields] = useState<Partial<DongHo>>({});

    // const [showModalSelectDongHoToSave, setShowModalSelectDongHoToSave] = useState(false);

    const [showFormTienTrinh, setShowFormTienTrinh] = useState(false);
    const [error, setError] = useState("");
    const [errorPDM, setErrorPDM] = useState("");

    const [errorFields, setErrorFields] = useState<string[]>([]);

    const router = useRouter();

    const [isDHSaved, setDHSaved] = useState<boolean | null>(null);
    const [isExistsDHSaved, setExitsDHSaved] = useState<boolean>(false);
    const [isFirstTabLL, setFirsttabLL] = useState<boolean>(false);
    const fetchCalled = useRef(false);
    const [CSSXOptions, setCSSXOptions] = useState<{ value: string, label: string }[]>([]);

    const [isErrorInfoExists, setIsErrorInfoExists] = useState<boolean | null>(false);

    const [selectedDongHoIndex, setSelectedDongHoIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

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
            setLoading(true);
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

    const handleChangeField = (field: keyof DongHo, value: string) => {
        if (debounceFieldTimeoutRef.current) {
            clearTimeout(debounceFieldTimeoutRef.current);
        }

        debounceFieldTimeoutRef.current = setTimeout(() => {
            setDebouncedFields(prevFields => ({ ...prevFields, [field]: value }));
        }, 500);
    };

    const debounceFieldTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Func: Set saved
    useEffect(() => {
        if (savedDongHoList.length > 0) {
            setExitsDHSaved(true);
            updateDongHoSaved(getCurrentDongHo())
        }
    }, [savedDongHoList]);

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
        if (filterPDMRef.current !== filterPDM && !isExistsDHSaved) {
            if (filterPDM.tenDongHo && filterPDM.dn && filterPDM.ccx && (filterPDM.kieuSensor || filterPDM.kieuChiThi) && ((filterPDM.q3 && filterPDM.r) || filterPDM.qn)) {
                const ma_tim_dong_ho_pdm = convertToUppercaseNonAccent(filterPDM.tenDongHo + filterPDM.dn + filterPDM.ccx + filterPDM.kieuSensor + filterPDM.kieuChiThi + (isDHDienTu ? (filterPDM.q3 + filterPDM.r) : filterPDM.qn));

                const handler = setTimeout(async () => {
                    setLoading(true);
                    try {
                        const res = await getPDMByMaTimDongHoPDM(ma_tim_dong_ho_pdm);
                        if (res.status == 200 || res.status == 201) {
                            const pdm = res.data;
                            const getDate = new Date(pdm.ngay_qd_pdm)
                            setSoQDPDM(pdm.so_qd_pdm + (getDate.getFullYear() ? "-" + getDate.getFullYear() : ""));
                            if (dayjs(pdm.ngay_het_han) < dayjs()) {
                                setErrorPDM("Số quyết định PDM đã hết hạn.")
                                setPhuongPhapThucHien("FMS - PP - 02")
                                // setSoQDPDM("");
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
                    } catch (error) {
                        setError("Đã có lỗi xảy ra! Hãy thử lại sau.");
                    } finally {
                        setLoading(false);
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
        // { value: noiSuDung, setter: setNoiSuDung, id: "noi_su_dung" },
        // { value: viTri, setter: setViTri, id: "vi_tri" },
        // { value: nhietDo, setter: setNhietDo, id: "nhiet_do" },
        // { value: doAm, setter: setDoAm, id: "do_am" },
    ];

    // TODO:
    useEffect(() => {
        setShowFormTienTrinh(errorFields.length == 0)
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

    const infoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (infoTimeoutRef.current) {
            clearTimeout(infoTimeoutRef.current);
        }

        infoTimeoutRef.current = setTimeout(() => {
            setErrorFields(validateFields());
            updateCurrentDongHo();
        }, 500);

        return () => {
            if (infoTimeoutRef.current) {
                clearTimeout(infoTimeoutRef.current);
            }
        };
    }, [
        tenDongHo,
        kieuThietBi,
        kieuChiThi,
        kieuSensor,
        coSoSanXuat,
        dn,
        d,
        ccx,
        q3,
        r,
        qn,
        soQDPDM,
        tenKhachHang,
        coSoSuDung,
        phuongPhapThucHien,
        viTri,
        nhietDo,
        doAm,
        ngayThucHien,
        nguoiKiemDinh,
        chuanThietBiSuDung,
        namSanXuat,
        nguoiSoatLai,
        noiSuDung,
        noiThucHien,
    ]);

    const getCurrentDongHo = (formHieuSaiSoProp?: { hss: number | null }[]) => {
        const checkQ3 = ((ccx && (ccx == "1" || ccx == "2")) || isDHDienTu);
        const duLieuKiemDinhJSON = getDuLieuKiemDinhJSON(formHieuSaiSoProp);
        const duLieuKiemDinh = duLieuKiemDinhJSON ? JSON.parse(duLieuKiemDinhJSON) : null;
        const status = duLieuKiemDinh ? duLieuKiemDinh.ket_qua : null;

        // TODO: check so_tem, sogcn hieu_luc_bb
        return {
            id: null,
            ten_dong_ho: tenDongHo || "",
            group_id: convertToUppercaseNonAccent(tenDongHo + dn + ccx + q3 + r + qn + (ngayThucHien ? dayjs(ngayThucHien).format('DDMMYYHHmmss') : '')),
            phuong_tien_do: phuongTienDo,
            seri_chi_thi: '',
            seri_sensor: "",
            kieu_chi_thi: checkQ3 ? kieuChiThi : "",
            kieu_sensor:  kieuSensor,
            kieu_thiet_bi: kieuThietBi,
            co_so_san_xuat: coSoSanXuat,
            so_tem: "",
            nam_san_xuat: namSanXuat || null,
            dn: dn,
            d: d,
            ccx: ccx,
            q3: checkQ3 ? q3 : "",
            r: r,
            qn: checkQ3 ? "" : qn,
            k_factor: "",
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
            du_lieu_kiem_dinh: getDuLieuKiemDinhJSON(formHieuSaiSoProp),
            hieu_luc_bien_ban: null,
            so_giay_chung_nhan: "",
        }
    }

    // Func: Save dong ho
    const handleSaveDongHo = async () => {
        const currentDongHo = getCurrentDongHo();
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    const handleFormHSSChange = (index: number, value: number | null) => {
        const newFormValues = [...formHieuSaiSo];
        newFormValues[index].hss = value;
        setFormHieuSaiSo(newFormValues);
        const newKetQua = isDongHoDatTieuChuan(newFormValues);
        setKetQua(newKetQua);

        setLoading(true);

        // Clear previous timeout if it exists
        if (handler.current) {
            clearTimeout(handler.current);
        }

        handler.current = setTimeout(() => {
            const updatedDongHoList = [...dongHoList];
            updatedDongHoList[selectedDongHoIndex] = getCurrentDongHo(newFormValues);
            setDongHoList(updatedDongHoList);
            setLoading(false);
        }, 500);
    };

    const handler = useRef<NodeJS.Timeout | null>(null);

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
        setDHDienTu(Boolean((ccx && ["1", "2"].includes(ccx)) || kieuThietBi == "Điện tử"));
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
        setDHSaved(savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHoSelected)))
    }

    // Gán giá trị khi slect dongHo
    useEffect(() => {
        // setFirsttabLL(true);
        const dongHoSelected = dongHoList[selectedDongHoIndex]
        const duLieuKiemDinhJSON = dongHoSelected.du_lieu_kiem_dinh;

        if (duLieuKiemDinhJSON) {
            const duLieuKiemDinh = JSON.parse(duLieuKiemDinhJSON);
            setDuLieuKiemDinhCacLuuLuong(duLieuKiemDinh.du_lieu || initialDuLieuKiemDinhCacLuuLuong);
            setFormHieuSaiSo(duLieuKiemDinh.hieu_sai_so || initialFormHieuSaiSo);
        } else {
            setFormHieuSaiSo(initialFormHieuSaiSo);
            setDuLieuKiemDinhCacLuuLuong(initialDuLieuKiemDinhCacLuuLuong);
        }

        updateDongHoSaved(dongHoSelected);
    }, [selectedDongHoIndex]);

    const updateCurrentDongHo = () => {
        const currentDongHo = getCurrentDongHo();
        if (currentDongHo != dongHoList[selectedDongHoIndex]) {
            updateListDongHo(currentDongHo);
        }
    }

    // Handle selection change
    const handleDongHoChange = (selectedIndex: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        setSelectedDongHoIndex(selectedIndex);
        updateCurrentDongHo();
    };

    // Handle previous and next button clicks
    const handlePrevDongHo = () => {
        if (selectedDongHoIndex > 0) {
            setSelectedDongHoIndex(selectedDongHoIndex - 1);
            updateCurrentDongHo();
        }
    };

    const handleNextDongHo = () => {
        if (selectedDongHoIndex < dongHoList.length - 1) {
            setSelectedDongHoIndex(selectedDongHoIndex + 1);
            updateCurrentDongHo();
        }
    };

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
                            createListDongHo(dongHoList).then((isSuccessful) => {
                                if (isSuccessful) {
                                    router.push(ACCESS_LINKS.DHN.src);
                                }
                            });
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
        } else if (dongHoList.length == savedDongHoList.length) {

        } else {
            // Some dongHo are not verified
            Swal.fire({
                title: 'Chú ý!',
                text: 'Đồng hồ ' + (
                    dongHoChuaKiemDinh.length > 3
                        ? dongHoChuaKiemDinh.slice(0, 3).map((dongHo, i) => (dongHoList.indexOf(dongHo) + 1)).join(', ') + ',...'
                        : dongHoChuaKiemDinh.map((dongHo, i) => (dongHoList.indexOf(dongHo) + 1)).join(', ')
                ) + ' chưa kiểm định xong.'
                // + ' Tiếp tục lưu?'
                ,
                icon: 'warning',
                // showCancelButton: true,
                // confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                // cancelButtonText: 'Hủy',
                // confirmButtonText: 'Lưu',
                reverseButtons: true
            }).then((rs) => {
                // if (rs.isConfirmed) {
                //     Swal.fire({
                //         title: 'Đang lưu đồng hồ',
                //         html: 'Đang chuẩn bị...',
                //         allowOutsideClick: false,
                //         didOpen: () => {
                //             Swal.showLoading();
                //             createListDongHo(getDongHoDaKiemDinh(dongHoList));
                //             updateDongHoSaved(getCurrentDongHo())
                //         }
                //     });
                // }
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
                                        setSelectedTenDHOption(null);
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
                                                setSelectedCssxOption(null);
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
                                {(isDHDienTu != null && isDHDienTu) ? <>
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

                                {(isDHDienTu != null && isDHDienTu) ? <>
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
                                    <div className="mb-3 col-12 col-md-6">
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
                                <div className={`mb-3 col-12 col-md-6 ${isDHDienTu ? "col-lg-4" : ""}`}>
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
                                <div className={`mb-3 col-12 col-md-6 ${isDHDienTu ? "col-xxl-4" : ""}`}>
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

                                <div className={`mb-3 col-12 col-md-6 col-xxl-4 d-flex align-items-end ${isAdmin ? "" : "d-none"}`}>

                                    <Link
                                        href={ACCESS_LINKS.PDM_ADD.src}
                                        className="btn btn-success px-3 py-2 text-white"
                                        style={{ width: "max-content", height: "max-content" }}
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
                        <div className={`w-100 p-3 shadow-sm rounded-top bg-main-blue d-flex align-items-center sticky-top justify-content-center ${dongHoList.length <= 1 ? "d-none":""}`} style={{ top: "60px", zIndex: "900" }}>
                            {/* <span className="fs-5 fw-bold mb-0 text-white me-2">Đồng hồ:</span> */}
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
                                    value={{ value: selectedDongHoIndex, label: "Đồng hồ " + (selectedDongHoIndex + 1) + (isDHSaved != null && isDHSaved ? " (Đã lưu)" : "") } || null} // Đặt giá trị dựa trên state
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
                            {dongHoList[selectedDongHoIndex] ? (
                                <>
                                    <div className={`w-100 p-2`}>
                                        <div className={`w-100 p-2 d-flex gap-2 justify-content-between ${showFormTienTrinh ? "d-none" : ""}`}>
                                            <div className={`w-100 px-3 row alert alert-warning m-0`}>
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
                                                    title: <>{isDHDienTu != null && isDHDienTu ? "0.3*" : ""}Q<sub>{isDHDienTu != null && isDHDienTu ? "3" : "n"}</sub></>,
                                                    content: <TinhSaiSoTab isDHDienTu={isDHDienTu} onFormHSSChange={(value: number | null) => handleFormHSSChange(0, value)}
                                                        isDisable={isExistsDHSaved}
                                                        d={d ? d : ""} q={{
                                                            title: isDHDienTu != null && isDHDienTu ? TITLE_LUU_LUONG.q3 : TITLE_LUU_LUONG.qn,
                                                            value: (q3) ? q3 : ((qn) ? qn : "")
                                                        }} className="" tabIndex={1} Form={TinhSaiSoForm as any} />
                                                },
                                                {
                                                    title: <>Q<sub>{isDHDienTu != null && isDHDienTu ? "2" : "t"}</sub></>,
                                                    content: <TinhSaiSoTab onFormHSSChange={(value: number | null) => handleFormHSSChange(1, value)}
                                                        isDisable={isExistsDHSaved}
                                                        d={d ? d : ""} q={{
                                                            title: isDHDienTu != null && isDHDienTu ? TITLE_LUU_LUONG.q2 : TITLE_LUU_LUONG.qt,
                                                            value: (q2Ort) ? q2Ort.toString() : ""
                                                        }} tabIndex={2} Form={TinhSaiSoForm as any} />
                                                },
                                                {
                                                    title: <>Q<sub>{isDHDienTu != null && isDHDienTu ? "1" : "min"}</sub></>,
                                                    content: <TinhSaiSoTab onFormHSSChange={(value: number | null) => handleFormHSSChange(2, value)}
                                                        isDisable={isExistsDHSaved}
                                                        d={d ? d : ""} q={{
                                                            title: isDHDienTu != null && isDHDienTu ? TITLE_LUU_LUONG.q1 : TITLE_LUU_LUONG.qmin,
                                                            value: (q1Ormin) ? q1Ormin.toString() : ""
                                                        }} tabIndex={3} Form={TinhSaiSoForm as any} />
                                                },
                                            ]} />
                                            {/* 
                                            <div className={`w-100 px-2 py-1 d-flex gap-2 justify-content-between`}>
                                                <div className={`w-100 px-3 row alert alert-warning m-0 ${(ketQua != null) ? "fade d-none" : "show"} ${isDHSaved != null && isDHSaved ? "d-none" : ""}`}>
                                                    <h6><i>* Điền đủ các thông tin để hiện kết quả kiểm tra!</i></h6>

                                                    {ketQua == null && (
                                                        <div className="col-12"><span className="me-2">•</span>Tiến trình chạy lưu lượng không được bỏ trống</div>
                                                    )}
                                                </div>
                                            </div> */}
                                        </div>
                                        <div className={`w-100 m-0 p-2 d-flex gap-2 justify-content-center ${isDHSaved != null && isDHSaved ? "" : "d-none"}`}>
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
                        <div className={`w-100 rounded-bottom p-3 bg-light-grey d-flex align-items-center justify-content-center ${dongHoList.length <= 1 ? "d-none":""}`}>
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
                                    value={{ value: selectedDongHoIndex, label: "Đồng hồ " + (selectedDongHoIndex + 1) + (isDHSaved != null && isDHSaved ? " (Đã lưu)" : "") } || null}
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
                    {showFormTienTrinh &&
                        <>
                            <h4 className="w-100 text-uppercase text-center">Thông tin riêng</h4>
                            <TableDongHoInfo
                                isDHDienTu={isDHDienTu}
                                setIsErrorInfoExists={(value: boolean | null) => setIsErrorInfoExists(value)}
                                setLoading={(value: boolean) => setLoading(value)} />
                        </>}

                    <div className={`w-100 px-2 px-md-3 d-flex gap-2 align-items-center justify-content-end ${savedDongHoList.length == dongHoList.length ? "d-none" : ""}`}>
                        <button aria-label={dongHoList.length <= 1 ? "Lưu đồng hồ":"Lưu toàn bộ"} className="btn btn-success py-2 px-4" disabled={loading || !showFormTienTrinh} onClick={handleSaveAllDongHo}>
                            {loading ?
                                <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span></> :
                                <><FontAwesomeIcon icon={faSave} className="me-2"></FontAwesomeIcon></>
                            } {dongHoList.length <= 1 ? "Lưu đồng hồ":"Lưu toàn bộ"}
                        </button>
                    </div>
                </div>
            </div>
        </LocalizationProvider >
    )
}