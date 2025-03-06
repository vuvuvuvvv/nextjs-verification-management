"use client"

import ui_vfm from "@styles/scss/ui/vfm.module.scss"

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { viVN } from "@mui/x-date-pickers/locales";
const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then(mod => mod.FontAwesomeIcon));
const LocalizationProvider = dynamic(() => import('@mui/x-date-pickers/LocalizationProvider').then(mod => mod.LocalizationProvider));
const DatePicker = dynamic(() => import('@mui/x-date-pickers/DatePicker').then(mod => mod.DatePicker));
const NavTab = dynamic(() => import('@/components/ui/NavTab'));
const TinhSaiSoTab = dynamic(() => import('@/components/TinhSaiSoTab'));
const TinhSaiSoForm = dynamic(() => import('@/components/TinhSaiSoForm'));
const TableDongHoInfo = dynamic(() => import('@/components/TableInputDongHoInfo'));

import { useKiemDinh } from "@/context/KiemDinh";
import { useUser } from "@/context/AppContext";

import CreatableSelect from 'react-select/creatable';
import Select, { GroupBase } from 'react-select';
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";

import { convertToUppercaseNonAccent, getQ2OrtAndQ1OrQMin, isDongHoDatTieuChuan } from "@lib/system-function";
import {
    ACCESS_LINKS, BASE_API_URL, ccxOptions, DEFAULT_LOCATION,
    TITLE_LUU_LUONG, typeOptions
} from "@lib/system-constant";

import { faArrowLeft, faChevronLeft, faChevronRight, faSave } from "@fortawesome/free-solid-svg-icons";
import { DongHo } from "@lib/types";
import { useDongHoList } from "@/context/ListDongHo";

import dynamic from "next/dynamic";
import api from "@/app/api/route";


interface HieuChuanNhomDongHoNuocFormProps {
    className?: string;
    generalInfoDongHo?: DongHo | null,
    isEditing?: boolean
}

interface State {
    ketQuaCheckVoNgoai: boolean
    ghiChuVoNgoai: string | null,

    tenDongHo: string;
    phuongTienDo: string;
    ccx: string | null;
    kieuChiThi: string;
    kieuSensor: string;
    kieuThietBi: string;
    coSoSanXuat: string;
    namSanXuat: Date | null;
    dn: string;
    d: string;
    q3: string;
    r: string;
    qn: string;
    tenKhachHang: string;
    phuongPhapThucHien: string;
    chuanThietBiSuDung: string;
    nguoiThucHien: string;
    nguoiSoatLai: string;
    ngayThucHien: Date | null;
    coSoSuDung: string;
    noiSuDung: string;
    noiThucHien: string;
    viTri: string;
    nhietDo: string;
    doAm: string;
    q2Ort: number | null;
    q1Ormin: number | null;
    selectedTenDHOption: { value: string, label: string } | null;
    selectedCssxOption: { value: string, label: string } | null;
}

type Action =
    | { type: 'SET_FIELD', field: keyof State, value: any }
    | { type: 'SET_MULTIPLE_FIELDS', fields: Partial<State> };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'SET_MULTIPLE_FIELDS':
            return { ...state, ...action.fields };
        default:
            return state;
    }
}

export default function HieuChuanNhomDongHoNuocForm({ className, generalInfoDongHo, isEditing = false }: HieuChuanNhomDongHoNuocFormProps) {

    const { user, isManager } = useUser();

    const initialState: State = {
        ketQuaCheckVoNgoai: false,
        ghiChuVoNgoai: "",

        tenDongHo: generalInfoDongHo?.ten_dong_ho || "",
        phuongTienDo: generalInfoDongHo?.phuong_tien_do || "",
        ccx: generalInfoDongHo?.ccx || null,
        kieuChiThi: generalInfoDongHo?.kieu_chi_thi || "",
        kieuSensor: generalInfoDongHo?.kieu_sensor || "",
        kieuThietBi: generalInfoDongHo?.kieu_thiet_bi || "",
        coSoSanXuat: generalInfoDongHo?.co_so_san_xuat || "",
        namSanXuat: generalInfoDongHo?.nam_san_xuat || null,
        dn: generalInfoDongHo?.dn || "",
        d: generalInfoDongHo?.d || "",
        q3: generalInfoDongHo?.q3 || "",
        r: generalInfoDongHo?.r || "",
        qn: generalInfoDongHo?.qn || "",
        tenKhachHang: generalInfoDongHo?.ten_khach_hang || "",
        phuongPhapThucHien: generalInfoDongHo?.phuong_phap_thuc_hien || "FMS - PP - 02",
        chuanThietBiSuDung: generalInfoDongHo?.chuan_thiet_bi_su_dung || "Đồng hồ chuẩn đo nước và Bình chuẩn",
        nguoiThucHien: generalInfoDongHo?.nguoi_thuc_hien || user?.fullname || "",
        nguoiSoatLai: generalInfoDongHo?.nguoi_soat_lai || "",
        ngayThucHien: generalInfoDongHo?.ngay_thuc_hien || new Date(),
        coSoSuDung: generalInfoDongHo?.co_so_su_dung || "",
        noiSuDung: generalInfoDongHo?.noi_su_dung || "",
        noiThucHien: generalInfoDongHo?.noi_thuc_hien || "",
        viTri: generalInfoDongHo?.vi_tri || "",
        nhietDo: generalInfoDongHo?.nhiet_do || '',
        doAm: generalInfoDongHo?.do_am || '',
        q2Ort: null,
        q1Ormin: null,
        selectedTenDHOption: generalInfoDongHo?.ten_dong_ho ? { value: generalInfoDongHo.ten_dong_ho, label: generalInfoDongHo.ten_dong_ho } : null,
        selectedCssxOption: generalInfoDongHo?.co_so_san_xuat ? { value: generalInfoDongHo.co_so_san_xuat, label: generalInfoDongHo.co_so_san_xuat } : null,
    };

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
        formHieuSaiSo,
        setFormHieuSaiSo,
        setFormMf,
        setKetQua,
        initialFormHieuSaiSo,
        initialFormMf,
        initialDuLieuKiemDinhCacLuuLuong,
        duLieuKiemDinhCacLuuLuong,
        setDuLieuKiemDinhCacLuuLuong,
    } = useKiemDinh();

    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const [selectedTenDHOption, setSelectedTenDHOption] = useState<{ value: string, label: string } | null>(
        generalInfoDongHo?.ten_dong_ho ? { value: generalInfoDongHo.ten_dong_ho, label: generalInfoDongHo.ten_dong_ho } : null
    );
    const [selectedCssxOption, setSelectedCssxOption] = useState<{ value: string, label: string } | null>(
        generalInfoDongHo?.co_so_san_xuat ? { value: generalInfoDongHo.co_so_san_xuat, label: generalInfoDongHo.co_so_san_xuat } : null
    );
    const [DHNameOptions, setDHNameOptions] = useState<{ value: string, label: string }[]>([]);
    const [isDHDienTu, setDHDienTu] = useState<boolean>(false);
    const [isDHSaved, setDHSaved] = useState<boolean | null>(null);
    const [CSSXOptions, setCSSXOptions] = useState<{ value: string, label: string }[]>([]);
    const [selectedDongHoIndex, setSelectedDongHoIndex] = useState<number | null>(null);
    const [errorPDM, setErrorPDM] = useState("");
    const [errorFields, setErrorFields] = useState<string[]>([]);

    //
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleFieldChange = (field: keyof State, value: any) => {
        dispatch({ type: 'SET_FIELD', field, value });
    };

    const handleMultFieldChange = (fields: Partial<State>) => {
        dispatch({ type: 'SET_MULTIPLE_FIELDS', fields });
    };
    //

    const [error, setError] = useState("");

    const [showFormTienTrinh, setShowFormTienTrinh] = useState(false);

    const router = useRouter();

    const [isFirstTabLL, setFirsttabLL] = useState<boolean>(false);
    const fetchCalled = useRef(false);

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

    // Query dongho name && noi san xuat
    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.get(`${BASE_API_URL}/dongho/get-distinct-names-and-locations`);
                const listNames: string[] = res.data.ten_dong_ho ?? [];
                const uniqueNames = listNames.filter((value, index, self) => self.indexOf(value) === index);
                const sortedNames = uniqueNames.sort((a, b) => a.localeCompare(b));
                setDHNameOptions(sortedNames && sortedNames.length > 0 ? [
                    ...sortedNames
                        .filter(name => name && name.trim() !== "")
                        .map((name) => ({ value: name, label: name }))
                ] : []);

                const listCSSX: string[] = res.data.noi_san_xuat ?? [];
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

    // Func: Set saved
    useEffect(() => {
        if (savedDongHoList.length > 0 && selectedDongHoIndex != null) {
            updateDongHoSaved(getCurrentDongHo(selectedDongHoIndex))
        }
    }, [savedDongHoList]);

    const scrollRef = useRef<HTMLDivElement | null>(null);

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
        { value: state.tenDongHo, id: "ten_dong_ho" },
        // { value: state.phuongTienDo, setter: setPhuongTienDo, id: "phuong_tien_do" },
        { value: state.kieuThietBi, id: "kieu_thiet_bi" },

        // { value: state.seriChiThi, id: "seri_chi_thi" },
        // { value: state.seriSensor, id: "seri_sensor" },
        // { value: state.kieuChiThi, id: "kieu_chi_thi" },                      
        // { value: state.kieuSensor, id: "kieu_sensor" },

        // { value: state.soTem, id: "so_tem" },
        { value: state.coSoSanXuat, id: "co_so_san_xuat" },
        // { value: state.namSanXuat, id: "nam_san_xuat" },
        { value: state.dn, id: "dn" },
        { value: state.d, id: "d" },
        { value: state.ccx, id: "ccx" },
        { value: state.q3, id: "q3" },
        { value: state.r, id: "r" },
        { value: state.qn, id: "qn" },
        // { value: state.kFactor, id: "kFactor" },
        { value: state.tenKhachHang, id: "ten_khach_hang" },
        { value: state.coSoSuDung, id: "co_so_su_dung" },
        { value: state.phuongPhapThucHien, id: "phuong_phap_thuc_hien" },
        { value: state.noiSuDung, id: "noi_su_dung" },
        // { value: state.viTri, id: "vi_tri" },
        { value: state.nhietDo, id: "nhiet_do" },
        { value: state.doAm, id: "do_am" },
    ];

    useEffect(() => {
        setShowFormTienTrinh(errorFields.length == 0)
    }, [errorFields]);

    const validateFields = () => {
        let validationErrors = [];

        for (const field of fields) {
            const shouldValidate = (state.ccx && (state.ccx === "1" || state.ccx === "2")) || isDHDienTu
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
        state.tenDongHo,
        state.kieuThietBi,
        state.kieuChiThi,
        state.kieuSensor,
        state.coSoSanXuat,
        state.dn,
        state.d,
        state.ccx,
        state.q3,
        state.r,
        state.qn,
        state.tenKhachHang,
        state.coSoSuDung,
        state.phuongPhapThucHien,
        state.viTri,
        state.nhietDo,
        state.doAm,
        state.ngayThucHien,
        state.nguoiThucHien,
        state.chuanThietBiSuDung,
        state.namSanXuat,
        state.nguoiSoatLai,
        state.noiSuDung,
        state.noiThucHien,
    ]);

    const getCurrentDongHo = (selectedDongHoIndex: number | null, formHieuSaiSoProp?: { hss: number | null }[]) => {
        const checkQ3 = ((state.ccx && (state.ccx == "1" || state.ccx == "2")) || isDHDienTu);

        // TODO: check so_tem, sogcn hieu_luc_bb

        return {
            ket_qua_check_vo_ngoai: state.ketQuaCheckVoNgoai,
            ghi_chu_vo_ngoai: state.ghiChuVoNgoai,
            index: dongHoList[selectedDongHoIndex ?? 0].index ?? 0,

            id: isEditing ? dongHoList[selectedDongHoIndex ?? 0].id : null,
            ten_dong_ho: state.tenDongHo || "",
            group_id: !isEditing
                ? convertToUppercaseNonAccent(state.tenDongHo + state.dn + state.ccx + state.q3 + state.r + state.qn + (state.ngayThucHien ? dayjs(state.ngayThucHien).format('DDMMYYHHmmss') : ''))
                : convertToUppercaseNonAccent(""
                    + (generalInfoDongHo?.ten_dong_ho || "")
                    + (generalInfoDongHo?.dn || "")
                    + (generalInfoDongHo?.ccx || "")
                    + (generalInfoDongHo?.q3 || "")
                    + (generalInfoDongHo?.r || "")
                    + (generalInfoDongHo?.qn || "")
                    + (generalInfoDongHo?.ngay_thuc_hien ? dayjs(generalInfoDongHo.ngay_thuc_hien).format('DDMMYYHHmmss') : '')),
            phuong_tien_do: state.phuongTienDo,
            seri_chi_thi: '',
            seri_sensor: "",
            kieu_chi_thi: checkQ3 ? state.kieuChiThi : "",
            kieu_sensor: state.kieuSensor,
            kieu_thiet_bi: state.kieuThietBi,
            co_so_san_xuat: state.coSoSanXuat,
            so_tem: "",
            nam_san_xuat: state.namSanXuat || null,
            dn: state.dn,
            d: state.d,
            ccx: state.ccx,
            q3: checkQ3 ? state.q3 : "",
            r: state.r,
            qn: checkQ3 ? "" : state.qn,
            k_factor: "",
            so_qd_pdm: null,
            ten_khach_hang: state.tenKhachHang || "",
            co_so_su_dung: state.coSoSuDung || "",
            phuong_phap_thuc_hien: state.phuongPhapThucHien || "",
            chuan_thiet_bi_su_dung: state.chuanThietBiSuDung || "",
            nguoi_thuc_hien: state.nguoiThucHien || "",
            nguoi_soat_lai: state.nguoiSoatLai || "",
            ngay_thuc_hien: state.ngayThucHien,
            noi_su_dung: state.noiSuDung || "",
            noi_thuc_hien: state.noiThucHien || DEFAULT_LOCATION,
            vi_tri: state.viTri || "",
            nhiet_do: state.nhietDo || "",
            do_am: state.doAm || "",
            du_lieu_kiem_dinh: getDuLieuKiemDinhJSON(formHieuSaiSoProp),
            hieu_luc_bien_ban: null,
            so_giay_chung_nhan: "",
        }
    }

    const handleFormHSSChange = (index: number, value: number | null) => {
        const newFormValues = [...formHieuSaiSo];
        newFormValues[index].hss = value;
        setFormHieuSaiSo(newFormValues);
        const newKetQua = isDongHoDatTieuChuan(newFormValues);
        setKetQua(newKetQua);
    };

    const handler = useRef<NodeJS.Timeout | null>(null);

    // Check Đồng hồ điện tử
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    // truyền setter vào để lưu giá trị vào state
    const handleNumberChange = (field: keyof State, value: any) => {
        // Replace commas with periods
        value = value.replace(/,/g, '.');
        // Allow only numbers and one decimal point
        if (/^\d*\.?\d*$/.test(value)) {
            handleFieldChange(field, value);
        }
    };

    // TODO: Check cơ điện từ
    useEffect(() => {
        setDHDienTu(Boolean((state.ccx && ["1", "2"].includes(state.ccx)) || ["Điện tử", "Cơ - Điện từ"].includes(state.kieuThietBi)));
        if (state.kieuThietBi) {
            handleFieldChange("phuongTienDo", ["Điện tử", "Cơ - Điện từ"].includes(state.kieuThietBi) ? "Đồng hồ đo nước lạnh có cơ cấu điện tử" : "Đồng hồ đo nước lạnh cơ khí")
        } else {
            handleFieldChange("phuongTienDo", "");
        }
    }, [state.ccx, state.kieuThietBi]);

    // Fumc: Get Q1, Q2
    useEffect(() => {
        if (state.ccx && ((state.q3 && state.r) || state.qn)) {
            const { getQ1OrMin, getQ2Ort } = getQ2OrtAndQ1OrQMin(isDHDienTu, state.ccx, isDHDienTu ? state.q3 : state.qn, isDHDienTu ? state.r : null);
            handleMultFieldChange({ q1Ormin: getQ1OrMin.value, q2Ort: getQ2Ort.value });
        }
    }, [state.ccx, state.q3, state.qn, state.r]);

    //Check doAm
    useEffect(() => {
        const humidity = parseFloat(state.doAm);
        if (humidity > 100) {
            handleFieldChange('doAm', '100');
        } else if (humidity < 0) {
            handleFieldChange('doAm', '0');
        }
    }, [state.doAm]);

    const updateDongHoSaved = (dongHoSelected: DongHo) => {
        setDHSaved(savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHoSelected)))
    }

    // Gán giá trị khi slect dongHo
    useEffect(() => {
        // setFirsttabLL(true);
        if (selectedDongHoIndex != null) {
            const dongHoSelected = dongHoList[selectedDongHoIndex]
            const duLieuKiemDinhJSON = dongHoSelected.du_lieu_kiem_dinh;
            if (duLieuKiemDinhJSON) {
                const duLieuKiemDinh = duLieuKiemDinhJSON ?
                    ((isEditing && typeof duLieuKiemDinhJSON != 'string') ?
                        duLieuKiemDinhJSON : JSON.parse(duLieuKiemDinhJSON)
                    ) : null;
                setDuLieuKiemDinhCacLuuLuong(duLieuKiemDinh.du_lieu || initialDuLieuKiemDinhCacLuuLuong);
                setFormHieuSaiSo(duLieuKiemDinh.hieu_sai_so || initialFormHieuSaiSo);
                setFormMf(duLieuKiemDinh.mf || initialFormMf)
                const newKetQua = isDongHoDatTieuChuan(duLieuKiemDinh.hieu_sai_so);
                setKetQua(newKetQua || null);
            } else {
                setFormHieuSaiSo(initialFormHieuSaiSo);
                setFormMf(initialFormMf)
                setDuLieuKiemDinhCacLuuLuong(initialDuLieuKiemDinhCacLuuLuong);
            }

            updateDongHoSaved(dongHoSelected);
        }
    }, [selectedDongHoIndex]);

    useEffect(() => {
        const handler = setTimeout(() => {
            updateCurrentDongHo();
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [duLieuKiemDinhCacLuuLuong])

    const updateCurrentDongHo = () => {
        if (selectedDongHoIndex != null) {
            const currentDongHo = getCurrentDongHo(selectedDongHoIndex);
            if (currentDongHo != dongHoList[selectedDongHoIndex ?? 0]) {
                updateListDongHo(currentDongHo, selectedDongHoIndex ?? 0);
            }
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
        if (selectedDongHoIndex != null && selectedDongHoIndex > 0) {
            setSelectedDongHoIndex(selectedDongHoIndex - 1);
            updateCurrentDongHo();
        }
    };

    const handleNextDongHo = () => {
        if (selectedDongHoIndex != null && selectedDongHoIndex < dongHoList.length - 1) {
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
                    const dongHoToSave = dongHoList.filter(dongHo => !savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHo)));
                    Swal.fire({
                        title: 'Đang lưu đồng hồ',
                        html: 'Đang chuẩn bị...',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                            createListDongHo(dongHoToSave).then((isSuccessful) => {
                                if (isSuccessful) {
                                    window.location.href = ACCESS_LINKS.HC_DHN.src;
                                }
                            });
                            // TODO: Update Save
                            // updateDongHoSaved(getCurrentDongHo(selectedDongHoIndex))
                        }
                    });
                }
            });
        } else if (dongHoDaKiemDinhCount === 0 || (dongHoChuaKiemDinh.length == dongHoList.length - savedDongHoList.length)) {
            // No dongHo are verified
            Swal.fire({
                title: 'Chú ý!',
                text: 'Chưa có đồng hồ nào được hiệu chuẩn, hãy kiểm tra lại.',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
            });
        } else if (dongHoList.length == savedDongHoList.length) {

        } else {
            Swal.fire({
                title: 'Chú ý!',
                text: 'Đồng hồ ' + (
                    dongHoChuaKiemDinh.length > 3
                        ? dongHoChuaKiemDinh.slice(0, 3).map((dongHo, i) => (dongHoList.indexOf(dongHo) + 1)).join(', ') + ',...'
                        : dongHoChuaKiemDinh.map((dongHo, i) => (dongHoList.indexOf(dongHo) + 1)).join(', ')
                ) + ' chưa hiệu chuẩn xong.'
                ,
                icon: 'warning',
                cancelButtonColor: '#d33',
                reverseButtons: true
            })
        }
    }

    const filteredCcxOptions = (q3: string | undefined, qn: string | undefined) => {
        const options = ccxOptions as unknown as readonly GroupBase<never>[];

        const q3Value = q3 ? parseFloat(q3) : undefined;
        const qnValue = qn ? parseFloat(qn) : undefined;

        if ((q3Value && q3Value > 15) || (qnValue && qnValue > 15)) {
            if (state.ccx && state.ccx.includes("D")) {
                handleFieldChange('ccx', null);
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
            <div className={`${className ? className : ""} ${ui_vfm['wraper']} container p-0 px-2 py-3 w-100`}>
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
                                isDisabled={savedDongHoList.length != 0}
                                isSearchable
                                onChange={(selectedOptions: any) => {
                                    if (selectedOptions) {
                                        const values = selectedOptions.value;

                                        setSelectedTenDHOption(selectedOptions);
                                        handleFieldChange('tenDongHo', values);
                                    } else {
                                        setSelectedTenDHOption(null);
                                        handleFieldChange('tenDongHo', "");
                                    }
                                }}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '42px',
                                        minHeight: '42px',
                                        borderColor: '#dee2e6 !important',
                                        boxShadow: 'none !important',
                                        backgroundColor: savedDongHoList.length != 0 ? "#e9ecef" : "white",
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
                                        isDisabled={savedDongHoList.length != 0}
                                        id="kieuThietBi"
                                        value={typeOptions.find(option => option.value === state.kieuThietBi) || null} // Kiểm tra giá trị
                                        onChange={(selectedOptions: any) => handleFieldChange('kieuThietBi', selectedOptions ? selectedOptions.value : "")}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                minHeight: '42px',
                                                borderColor: '#dee2e6 !important',
                                                boxShadow: 'none !important',
                                                backgroundColor: savedDongHoList.length != 0 ? "#e9ecef" : "white",
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
                                        value={state.namSanXuat ? dayjs(state.namSanXuat) : null}
                                        views={['year']}
                                        format="YYYY"
                                        minDate={dayjs('1900-01-01')}
                                        maxDate={dayjs().endOf('year')}
                                        disabled={savedDongHoList.length != 0}
                                        onChange={(newValue: Dayjs | null) => {
                                            if (newValue) {
                                                handleFieldChange('namSanXuat', newValue.toDate());
                                            } else {
                                                handleFieldChange('namSanXuat', null); // or handle invalid date
                                            }

                                        }}
                                        slotProps={{ textField: { fullWidth: true, style: { backgroundColor: savedDongHoList.length != 0 ? "#e9ecef" : "white" } } }}
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
                                        isDisabled={savedDongHoList.length != 0}
                                        id="noi_san_xuat"
                                        value={selectedCssxOption || null}
                                        isSearchable
                                        onChange={(selectedOptions: any) => {
                                            if (selectedOptions) {
                                                const values = selectedOptions.value;

                                                setSelectedCssxOption(selectedOptions);
                                                handleFieldChange('coSoSanXuat', values);
                                            } else {
                                                setSelectedCssxOption(null);
                                                handleFieldChange('coSoSanXuat', "");
                                            }
                                        }}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                minHeight: '42px',
                                                borderColor: '#dee2e6 !important',
                                                boxShadow: 'none !important',
                                                backgroundColor: savedDongHoList.length != 0 ? "#e9ecef" : "white",
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
                                        disabled={savedDongHoList.length != 0}
                                        value={state.kieuSensor || ""}
                                        onChange={(e) => {
                                            handleFieldChange('kieuSensor', e.target.value);
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
                                                disabled={savedDongHoList.length != 0}
                                                value={state.kieuChiThi || ""}
                                                onChange={(e) => {
                                                    handleFieldChange('kieuChiThi', e.target.value);
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
                                            value={state.dn || ""}
                                            onChange={(e) => handleNumberChange("dn", e.target.value)}
                                            disabled={savedDongHoList.length != 0}

                                        />
                                        <span className="input-group-text">mm</span>
                                    </div>
                                </div>
                                <div className="mb-3 col-12 col-md-6 col-xxl-4">
                                    <label htmlFor="ccx" className="form-label">- Cấp chính xác:</label>
                                    <Select
                                        name="ccx"
                                        options={filteredCcxOptions(state.q3, state.qn)}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="-- Chọn cấp --"
                                        isDisabled={savedDongHoList.length != 0}
                                        isClearable
                                        value={ccxOptions.find(option => option.value === state.ccx) || null}
                                        onChange={(selectedOptions: any) => handleFieldChange('ccx', selectedOptions ? selectedOptions.value : "")}
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                height: '42px',
                                                minHeight: '42px',
                                                borderColor: '#dee2e6 !important',
                                                boxShadow: 'none !important',
                                                backgroundColor: savedDongHoList.length != 0 ? "#e9ecef" : "white",
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
                                                value={state.q3 || ""}
                                                onChange={(e) => handleNumberChange("q3", e.target.value)}

                                                disabled={savedDongHoList.length != 0}
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
                                            value={state.r || ""}
                                            onChange={(e) => handleNumberChange("r", e.target.value)}
                                            disabled={savedDongHoList.length != 0}
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
                                                value={state.qn || ""}
                                                onChange={(e) => handleNumberChange("qn", e.target.value)}
                                                disabled={savedDongHoList.length != 0}
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
                                        value={state.d || ""}
                                        onChange={(e) => handleNumberChange("d", e.target.value)}
                                        disabled={savedDongHoList.length != 0}

                                    />
                                </div>
                            </div>
                            <label className="w-100 fs-5 fw-bold">Chi tiết hiệu chuẩn:</label>
                            <div className="row mx-0 w-100 mb-3">
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="tenKhachHang" className="form-label">Tên khách hàng:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tenKhachHang"
                                        disabled={savedDongHoList.length != 0}
                                        value={state.tenKhachHang || ""}
                                        onChange={(e) => handleFieldChange('tenKhachHang', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="coSoSuDung" className="form-label">Đơn vị phê duyệt mẫu:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="coSoSuDung"
                                        disabled={savedDongHoList.length != 0}
                                        value={state.coSoSuDung || ""}
                                        onChange={(e) => handleFieldChange('coSoSuDung', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-xl-6">
                                    <label htmlFor="noi_su_dung" className="form-label">Nơi sử dụng:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="noi_su_dung"
                                        disabled={savedDongHoList.length != 0}
                                        value={state.noiSuDung || ""}
                                        onChange={(e) => handleFieldChange('noiSuDung', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-xl-6">
                                    <label htmlFor="viTri" className="form-label">Địa chỉ nơi sử dụng:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="viTri"
                                        disabled={savedDongHoList.length != 0}
                                        value={state.viTri || ""}
                                        onChange={(e) => handleFieldChange('viTri', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="phuongPhapThucHien" className="form-label">Phương pháp thực hiện:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        disabled={savedDongHoList.length != 0}
                                        id="phuongPhapThucHien"
                                        placeholder="Phương pháp thực hiện"
                                        value={state.phuongPhapThucHien || ""}
                                        onChange={(e) => handleFieldChange('phuongPhapThucHien', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="chuanThietBiSuDung" className="form-label">Chuẩn, thiết bị chính được sử dụng:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="chuanThietBiSuDung"
                                        disabled={savedDongHoList.length != 0}
                                        value={state.chuanThietBiSuDung || ""}
                                        onChange={(e) => handleFieldChange('chuanThietBiSuDung', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="ngayThucHien" className="form-label">Ngày thực hiện:</label>
                                    <DatePicker
                                        className={`${ui_vfm['date-picker']}`}
                                        disabled={savedDongHoList.length != 0}
                                        value={dayjs(state.ngayThucHien) || null}
                                        format="DD-MM-YYYY"
                                        maxDate={dayjs().endOf('day')}
                                        onChange={(newValue: Dayjs | null) => handleFieldChange('ngayThucHien', newValue ? newValue.toDate() : null)}
                                        slotProps={{ textField: { fullWidth: true, style: { backgroundColor: savedDongHoList.length != 0 ? "#e9ecef" : "white" } } }}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="noi_su_dung" className="form-label">Nơi thực hiện:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="noi_thuc_hien"
                                        placeholder={DEFAULT_LOCATION}
                                        disabled={savedDongHoList.length != 0}
                                        value={state.noiThucHien || ""}
                                        onChange={(e) => handleFieldChange('noiThucHien', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="nhietDo" className="form-label">Nhiệt độ:</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nhietDo"
                                            disabled={savedDongHoList.length != 0}
                                            value={state.nhietDo || ""}
                                            onChange={(e) => handleNumberChange("nhietDo", e.target.value)}
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
                                            disabled={savedDongHoList.length != 0}
                                            value={state.doAm || ""}
                                            onChange={(e) => handleNumberChange("doAm", e.target.value)}
                                        />
                                        <span className="input-group-text">%</span>
                                    </div>
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="nguoi_thuc_hien" className="form-label">Người thực hiện:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nguoi_thuc_hien"
                                        disabled={savedDongHoList.length != 0}
                                        value={state.nguoiThucHien || ""}
                                        onChange={(e) => handleFieldChange('nguoiThucHien', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3 col-12 col-md-6">
                                    <label htmlFor="nguoi_thuc_hien" className="form-label">Người soát lại:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nguoi_soat_lai"
                                        disabled={savedDongHoList.length != 0}
                                        value={state.nguoiSoatLai || ""}
                                        onChange={(e) => handleFieldChange('nguoiSoatLai', e.target.value)}
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
                        {selectedDongHoIndex != null && showFormTienTrinh && <>
                            {/* Select Nav  */}
                            <div className={`w-100 py-3 px-2 shadow-sm rounded-top bg-main-blue d-flex align-items-center sticky-top justify-content-center`} style={{ top: "60px", zIndex: "900" }}>

                                <button style={{ top: "50%", left: "10px", transform: "translateY(-50%)" }} className={`btn m-0 py-0 px-0 position-absolute text-white d-flex align-items-center gap-1 border-0 shadow-0`} onClick={() => setSelectedDongHoIndex(null)}>
                                    <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: "1.6rem" }}></FontAwesomeIcon><span className="d-none d-sm-block">Quay lại</span>
                                </button>
                                <button aria-label="Đồng hồ trước" className="btn bg-white m-0 p-0 px-2 d-flex align-items-center justify-content-center" style={{ height: "42px", width: "42px" }} onClick={() => {
                                    handlePrevDongHo()
                                }}>
                                    <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: "1.6rem" }} className="fa-2x text-blue"></FontAwesomeIcon>
                                </button>

                                <div className="mx-2">
                                    <Select
                                        name="selectDongHo"
                                        options={dongHoList.map((dongHo, index) => ({ value: index, label: "Đồng hồ " + (index + 1) }))} // Assuming each dong ho has a 'name' property
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        placeholder="- Chọn đồng hồ -"
                                        value={selectedDongHoIndex !== null ? { value: selectedDongHoIndex, label: "Đồng hồ " + (selectedDongHoIndex + 1) + (isDHSaved ? " (Đã lưu)" : "") } : null} // Đặt giá trị dựa trên state
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
                                    <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: "1.6rem" }} className="fa-2x text-blue"></FontAwesomeIcon>
                                </button>
                            </div>
                            {/* End select nav  */}

                            <div className={`w-100 p-2`}>
                                {dongHoList[selectedDongHoIndex] ? (
                                    <>
                                        <div className={`w-100 p-2`}>
                                            <div className={`w-100 ${showFormTienTrinh ? "" : "d-none"}`}>
                                                <h5 className="p-0">Đo lường:</h5>
                                                <NavTab buttonControl={true} gotoFirstTab={isFirstTabLL} tabContent={[
                                                    {
                                                        title: <>{isDHDienTu != null && isDHDienTu ? "0.3*" : ""}Q<sub>{isDHDienTu != null && isDHDienTu ? "3" : "n"}</sub></>,
                                                        content: <TinhSaiSoTab
                                                            isDHDienTu={isDHDienTu}
                                                            onFormHSSChange={(value: number | null) => handleFormHSSChange(0, value)}
                                                            isDisable={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHoList[selectedDongHoIndex]))}
                                                            d={state.d ? state.d : ""}
                                                            q={{
                                                                title: isDHDienTu != null && isDHDienTu ? TITLE_LUU_LUONG.q3 : TITLE_LUU_LUONG.qn,
                                                                value: (state.q3) ? state.q3 : ((state.qn) ? state.qn : "")
                                                            }}
                                                            className=""
                                                            tabIndex={1}
                                                            Form={TinhSaiSoForm as any} />
                                                    },
                                                    {
                                                        title: <>Q<sub>{isDHDienTu != null && isDHDienTu ? "2" : "t"}</sub></>,
                                                        content: <TinhSaiSoTab onFormHSSChange={(value: number | null) => handleFormHSSChange(1, value)}
                                                            isDisable={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHoList[selectedDongHoIndex]))}
                                                            d={state.d ? state.d : ""} q={{
                                                                title: isDHDienTu != null && isDHDienTu ? TITLE_LUU_LUONG.q2 : TITLE_LUU_LUONG.qt,
                                                                value: (state.q2Ort) ? state.q2Ort.toString() : ""
                                                            }} tabIndex={2} Form={TinhSaiSoForm as any} />
                                                    },
                                                    {
                                                        title: <>Q<sub>{isDHDienTu != null && isDHDienTu ? "1" : "min"}</sub></>,
                                                        content: <TinhSaiSoTab onFormHSSChange={(value: number | null) => handleFormHSSChange(2, value)}
                                                            isDisable={savedDongHoList.some(dh => JSON.stringify(dh) == JSON.stringify(dongHoList[selectedDongHoIndex]))}
                                                            d={state.d ? state.d : ""} q={{
                                                                title: isDHDienTu != null && isDHDienTu ? TITLE_LUU_LUONG.q1 : TITLE_LUU_LUONG.qmin,
                                                                value: (state.q1Ormin) ? state.q1Ormin.toString() : ""
                                                            }} tabIndex={3} Form={TinhSaiSoForm as any} />
                                                    },
                                                ]} />
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
                            {/* <div className={`w-100 rounded-bottom p-3 bg-light-grey d-flex align-items-center justify-content-center ${dongHoList.length <= 1 ? "d-none" : ""}`}>
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
                                        value={selectedDongHoIndex !== null ? { value: selectedDongHoIndex, label: "Đồng hồ " + (selectedDongHoIndex + 1) + (isDHSaved != null && isDHSaved ? " (Đã lưu)" : "") } : null}
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
                            </div> */}
                        </>}
                        {/* End select nav  */}
                    </div>
                </div>

                <div className={`m-0 mb-3 bg-white rounded shadow-sm w-100 position-relative p-3`}>
                    {showFormTienTrinh && selectedDongHoIndex == null &&
                        <>
                            <TableDongHoInfo
                                isEditing={isEditing}
                                isDHDienTu={isDHDienTu}
                                setLoading={(value: boolean) => setLoading(value)}
                                selectDongHo={(value: number) => setSelectedDongHoIndex(value)}
                            />
                        </>}
                    <div className={`w-100 d-flex gap-2 justify-content-between ${showFormTienTrinh ? "d-none" : ""}`}>
                        <div className={`w-100 px-3 row alert alert-warning m-0`}>
                            <h6><i>* Điền đủ các thông tin để hiện Form tiến trình!</i></h6>
                            {errorFields.map((error, index) => (
                                <div className="col-12 col-sm-6 col-lg-4 col-xxl-3" key={index}><span className="me-2">•</span> {fieldTitles[error as keyof typeof fieldTitles]} là bắt buộc</div>
                            ))}
                        </div>
                    </div>

                    <div className={`w-100 px-2 px-md-3 d-flex gap-2 align-items-center justify-content-end ${savedDongHoList.length == dongHoList.length || !showFormTienTrinh ? "d-none" : ""}`}>
                        <button aria-label={dongHoList.length <= 1 ? "Lưu đồng hồ" : "Lưu toàn bộ"} className="btn btn-success py-2 px-4" disabled={loading || !showFormTienTrinh} onClick={handleSaveAllDongHo}>
                            {loading ?
                                <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span></> :
                                <><FontAwesomeIcon icon={faSave} className="me-2"></FontAwesomeIcon></>
                            } {isEditing ? "Lưu thay đổi" : (dongHoList.length <= 1 ? "Lưu đồng hồ" : "Lưu toàn bộ")}
                        </button>
                    </div>
                </div>
            </div>
        </LocalizationProvider >
    )
}