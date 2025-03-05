"use client"

import { getFullSoGiayCN, getSaiSoDongHo } from "@lib/system-function";
import dtp from "@styles/scss/ui/q-bgt-15.detail.module.scss";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { DongHo, DuLieuChayDiemLuuLuong, DuLieuChayDongHo, GeneralInfoDongHo } from "@lib/types";
import { Fragment, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { downloadHC } from "@/app/api/download/route";
import { ACCESS_LINKS, TITLE_LUU_LUONG } from "@lib/system-constant";
import Link from "next/link";

const Loading = dynamic(() => import('@/components/Loading'));
const ModalSelectDongHoToDownload = dynamic(() => import('@/components/ui/ModalSelectDongHoToDownload'), { ssr: false });
interface DetailHieuChuanNhomDongHoProps {
    nhomDongHo: DongHo[];
}

interface DuLieuKiemDinh {
    hieu_sai_so: { hss: number | null }[] | null,
    du_lieu: DuLieuChayDongHo | null,
    ket_qua: string | null,
    mf: { mf: number | null }[]
}

const DOWNLOAD_TYPE = {
    BB: 1,      // Biên bản
    GCN: 2,     // Giấy chứng nhận
    HC: 3       // Hiệu chuẩn
}

export default function DetailHieuChuanNhomDongHo({ nhomDongHo }: DetailHieuChuanNhomDongHoProps) {
    const nhomDongHoData = useRef<DongHo[]>(nhomDongHo);

    const [selectedDongHo, setSelectedDongHo] = useState<DongHo[]>([]);
    const selectedDongHoRef = useRef(selectedDongHo);
    const [typeToDownload, setTypeToDownload] = useState<number | null>(null);

    const [showModalSelectDongHoToDownload, setShowModalSelectDongHoToDownload] = useState(false);

    const [generalInfo, setGeneralInfo] = useState<GeneralInfoDongHo | null>(null);

    const [nhomDuLieuKiemDinh, setNhomDuLieuKiemDinh] = useState<DuLieuKiemDinh[] | null>(null);

    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (message) {
            Swal.fire({
                icon: "info",
                title: "CHÚ Ý",
                text: message,
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
                setMessage("");
            });
        }
    }, [message]);

    useEffect(() => {
        if (selectedDongHo.length > 0 && typeToDownload && selectedDongHoRef.current != selectedDongHo) {
            downloadMultDongHo();
        }
    }, [selectedDongHo]);

    const downloadMultDongHo = async () => {
        selectedDongHoRef.current = selectedDongHo;
        let successMessages: string[] = [];
        let errorMessages: string[] = [];

        for (let i = 0; i < selectedDongHo.length; i++) {
            const dongHo = selectedDongHo[i];
            try {
                let res;
                res = await downloadHC(dongHo);
                if (res.status && [404, 500, 400, 422].includes(res.status)) {
                    errorMessages.push(`ĐH số ${(nhomDongHoData.current.indexOf(dongHo)) + 1}: ${res.msg || "Chưa thể tải"}`);
                }
            } catch (error: any) {
                errorMessages.push(`ĐH số ${(nhomDongHoData.current.indexOf(dongHo)) + 1}: ${error.message || error.response.msg || "Chưa thể tải"}`);
            } finally {
            }

            Swal.update({
                html: `Đang tải ${i + 1}/${selectedDongHo.length} đồng hồ...`,
            });
        }
        Swal.close();
        const resultMessages = [...successMessages, ...errorMessages];
        Swal.fire({
            title: 'Tải xuống',
            html: errorMessages.length > 0 ? resultMessages.join('<br>') : "Lưu thành công!",
            icon: errorMessages.length > 0 ? 'error' : 'success',
        });
        setTypeToDownload(null);
        setSelectedDongHo([]);
    }

    const handleDownloadBB = async (dongHo: DongHo) => {
        // TODO
        return 
        if (dongHo.id) {
            const result = await downloadHC(dongHo);
            setMessage(result.msg);
        }
    }

    const handleMultDownloadHC = async () => {
        // TODO:
        return
        setTypeToDownload(DOWNLOAD_TYPE.HC);
        setShowModalSelectDongHoToDownload(true);
    }

    const handleCloseModal = () => {
        setShowModalSelectDongHoToDownload(false);
    }

    useEffect(() => {
        if (nhomDongHoData.current.length > 0) {
            const dongHo = nhomDongHo[0];
            setGeneralInfo({
                group_id: dongHo.group_id,
                kieu_thiet_bi: dongHo.kieu_thiet_bi,

                ten_dong_ho: dongHo.ten_dong_ho,
                phuong_tien_do: dongHo.phuong_tien_do,

                kieu_chi_thi: dongHo.kieu_chi_thi,
                kieu_sensor: dongHo.kieu_sensor,
                co_so_san_xuat: dongHo.co_so_san_xuat,

                nam_san_xuat: dongHo.nam_san_xuat,
                dn: dongHo.dn,
                d: dongHo.d,

                ccx: dongHo.ccx,
                q3: dongHo.q3,
                r: dongHo.r,

                qn: dongHo.qn,
                so_qd_pdm: dongHo.so_qd_pdm ?? null,

                ten_khach_hang: dongHo.ten_khach_hang,
                co_so_su_dung: dongHo.co_so_su_dung,
                phuong_phap_thuc_hien: dongHo.phuong_phap_thuc_hien,

                chuan_thiet_bi_su_dung: dongHo.chuan_thiet_bi_su_dung,
                nguoi_thuc_hien: dongHo.nguoi_thuc_hien,
                ngay_thuc_hien: dongHo.ngay_thuc_hien,

                vi_tri: dongHo.vi_tri,
                nhiet_do: dongHo.nhiet_do,
                do_am: dongHo.do_am,

                nguoi_soat_lai: dongHo.noi_thuc_hien,
                noi_thuc_hien: dongHo.noi_thuc_hien,
                noi_su_dung: dongHo.noi_su_dung,
            })

            let tmpNhomDuLieuKiemDinh: DuLieuKiemDinh[] = []
            nhomDongHoData.current.map((dongHoData, index) => {

                const duLieuKiemDinhJSON = dongHoData.du_lieu_kiem_dinh;
                const duLieuKiemDinh = duLieuKiemDinhJSON ?
                    ((typeof duLieuKiemDinhJSON != 'string') ?
                        duLieuKiemDinhJSON : JSON.parse(duLieuKiemDinhJSON)
                    ) : null;

                tmpNhomDuLieuKiemDinh.push(duLieuKiemDinh)
            });
            setNhomDuLieuKiemDinh(tmpNhomDuLieuKiemDinh);
        }
    }, [nhomDongHoData.current]);

    const renderDulieuLuuLuong = (listKeys: string[], duLieuKiemDinh: DuLieuKiemDinh) => {
        const duLieu = duLieuKiemDinh.du_lieu;
        const hieuSaiSo = duLieuKiemDinh.hieu_sai_so;
        const mf = duLieuKiemDinh.mf;
        if (listKeys && duLieu && hieuSaiSo && mf) {
            return listKeys.map((key, index) => {
                const value = duLieu[key] as DuLieuChayDiemLuuLuong;
                if (value?.value) {
                    let indexHead = true;
                    let jsxStart, jsxEnd;
                    const rowSpan = Object.entries(value.lan_chay).reduce((count, [keyLanChay, valueLanChay]) => {
                        return getSaiSoDongHo(valueLanChay) != null ? count + 1 : count;
                    }, 0);

                    return (
                        <Fragment key={key + index}>
                            {
                                Object.entries(value.lan_chay).map(([keyLanChay, valueLanChay], indexLanChay) => {
                                    jsxStart = <></>
                                    jsxEnd = <></>
                                    if (indexHead) {
                                        jsxStart = <>
                                            <td rowSpan={rowSpan}>
                                                {(key === TITLE_LUU_LUONG.q1 || key === TITLE_LUU_LUONG.qmin)
                                                    ? "I" : ((key === TITLE_LUU_LUONG.q2 || key === TITLE_LUU_LUONG.qt)
                                                        ? "II" : "III")}
                                            </td>
                                            <td rowSpan={rowSpan}>{key === TITLE_LUU_LUONG.q3 ? 0.3 * parseFloat(Number(value.value).toString()) : value.value}</td>
                                        </>;
                                        const getmf = mf ? mf[
                                            [TITLE_LUU_LUONG.q1, TITLE_LUU_LUONG.qmin].includes(key)
                                                ? 2 : [TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.qt].includes(key)
                                                    ? 1 : [TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.qn].includes(key)
                                                        ? 0 : index].mf : 0;

                                        const gethss = hieuSaiSo ? hieuSaiSo[
                                            [TITLE_LUU_LUONG.q1, TITLE_LUU_LUONG.qmin].includes(key)
                                                ? 2 : [TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.qt].includes(key)
                                                    ? 1 : [TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.qn].includes(key)
                                                        ? 0 : index].hss : 0;
                                        jsxEnd = <><td rowSpan={rowSpan}>{getmf}</td><td rowSpan={rowSpan}>{gethss}</td></>
                                        indexHead = false;
                                    }

                                    if (getSaiSoDongHo(valueLanChay) != null) {
                                        return (
                                            <tr key={keyLanChay + indexLanChay}>
                                                {jsxStart}
                                                <td>{valueLanChay.V1}</td>
                                                <td>{valueLanChay.V2}</td>
                                                <td>{(Number(valueLanChay.V2) - Number(valueLanChay.V1)).toFixed(4).replace(/\.?0+$/, '')}</td>
                                                <td>{valueLanChay.Tdh}</td>
                                                <td>{valueLanChay.Vc1}</td>
                                                <td>{valueLanChay.Vc2}</td>
                                                <td>{(Number(valueLanChay.Vc2) - Number(valueLanChay.Vc1)).toFixed(4).replace(/\.?0+$/, '')}</td>
                                                <td>{valueLanChay.Tc}</td>
                                                <td>{getSaiSoDongHo(valueLanChay)}</td>
                                                {jsxEnd}
                                            </tr>
                                        );
                                    } else {
                                        return <></>
                                    }
                                })
                            }
                        </Fragment>
                    );
                }
            })
        }
        return <></>
    }

    if (!nhomDongHoData.current || generalInfo == null) {
        return <Loading></Loading>;
    }

    return <div className="w-100 m-0 mb-4 p-2">
        <title>{"Nhóm đồng hồ " + generalInfo.ten_dong_ho || ""}</title>
        {generalInfo ? (
            <div className="w-100 m-0 p-0">
                <ModalSelectDongHoToDownload
                    dongHoList={nhomDongHoData.current}
                    show={showModalSelectDongHoToDownload}
                    handleClose={handleCloseModal}
                    handleSelectedDongHo={setSelectedDongHo}
                    isDownloadGCN={DOWNLOAD_TYPE.GCN == typeToDownload}
                ></ModalSelectDongHoToDownload>
                <div className={`container my-3 p-0 d-flex align-items-center justify-content-end`}>
                    <Link href={ACCESS_LINKS.HC_DHN_EDIT_NDH.src + "/" + generalInfo.group_id} aria-label="Chỉnh sửa đồng hồ" className="btn bg-warning border border-warning me-2">
                        <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon> All
                    </Link>
                    <span style={{ cursor: "unset" }} className="m-0 btn border-0 py-2 bg-grey text-white rounded-end-0"><FontAwesomeIcon icon={faDownload}></FontAwesomeIcon> Nhiều:</span>
                    <button aria-label="Tải hiệu chuẩn" className="btn bg-main-green rounded-0 border-0 rounded-end py-2 text-white" onClick={handleMultDownloadHC}>
                        <FontAwesomeIcon icon={faFileExcel} className="me-1"></FontAwesomeIcon> Hiệu chuẩn
                    </button>
                </div>
                <div className="container px-0 bg-white py-4">
                    <div className="px-4 px-md-5">
                        <h4 className="text-center text-uppercase">Chi tiết hiệu chuẩn nhóm đồng hồ</h4>
                        <div className="row mb-3">
                            <div className="col-12">
                                <p>Mã nhóm đồng hồ: <b>{generalInfo.group_id || "Không có mã nhóm"}</b>
                                </p>
                            </div>
                            <div className="col-12">
                                <p>Tên đồng hồ: <b>{generalInfo.ten_dong_ho || "Chưa có tên đồng hồ"}</b></p>
                            </div>
                            <div className="col-12">
                                <p>Tên phương tiện đo: <b>{generalInfo.phuong_tien_do || "Chưa có tên phương tiện đo"}</b></p>
                            </div>
                            <div className="col-12">
                                <p>Nơi sản xuất: <b>{generalInfo.co_so_san_xuat || "Chưa có nơi sản xuất"}</b></p>
                            </div>
                            {(generalInfo.kieu_sensor || generalInfo.kieu_chi_thi) && <div className="col-12 mb-3">
                                <p className="m-0">Kiểu sản xuất:</p>
                                <div className="w-100 row m-0 px-3">
                                    <div className="col-12 col-md-6 m-0 p-0">{(generalInfo.kieu_sensor) && <>Kiểu sensor: <b>{generalInfo.kieu_sensor}</b></>}</div>
                                    <div className="col-12 col-md-6 m-0 p-0">{(generalInfo.kieu_chi_thi) && <>Kiểu chỉ thị: <b>{generalInfo.kieu_chi_thi}</b></>}</div>
                                </div>
                            </div>}

                        </div>
                        <div className="row mb-3">
                            <div className="col-12 col-md-4">
                                <p>Đặc trưng kỹ thuật đo lường:</p>
                            </div>
                            <div className="col-12 col-md-8">
                                <ul className="list-unstyled m-0 p-0">
                                    <li>- Đường kính danh định: <b>DN ={generalInfo.dn || 0}</b> mm</li>
                                    <li>- Lưu lượng danh định: {generalInfo.q3 ? <b>Q3= {generalInfo.q3 || 0}</b> : <b>Qn= {generalInfo.qn || 0}</b>} m<sup>3</sup>/h</li>
                                    <li>- Cấp chính xác: <b>{generalInfo.ccx || "Chưa có cấp chính xác"}</b></li>
                                </ul>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <p>Cơ sở sử dụng: <b>{generalInfo.noi_su_dung || "Chưa có cơ sở sử dụng"}</b></p>
                        </div>
                        <div className="row mb-3">
                            <p>Phương pháp thực hiện: <b>{generalInfo.phuong_phap_thuc_hien || "Chưa có phương pháp thực hiện"}</b></p>
                            <p>Chuẩn được sử dụng: <b>{generalInfo.chuan_thiet_bi_su_dung || "Chưa có chuẩn thiết bị sử dụng"}</b></p>
                        </div>
                        <div className="row mb-3">
                            <div className="col-6">
                                <p>Người thực hiện: <b className="text-uppercase">{generalInfo.nguoi_thuc_hien || "Chưa có người thực hiện"}</b></p>
                            </div>
                            <div className="col-6">
                                <p>Ngày thực hiện: <b>{dayjs(generalInfo.ngay_thuc_hien).format("DD/MM/YYYY")}</b></p>
                            </div>
                            <div className="col-12">
                                <p>Địa điểm thực hiện: <b>{generalInfo.noi_thuc_hien || "Chưa có địa điểm thực hiện"}</b></p>
                            </div>
                        </div>
                    </div>

                    {nhomDongHoData.current.map((dongHo, index) => {
                        const listKeys = dongHo.q3 ? ["Q3", "Q2", "Q1"] : dongHo.qn ? ['Qn', "Qt", "Qmin"] : null

                        const duLieuKiemDinhJSON = dongHo.du_lieu_kiem_dinh;
                        const duLieuKiemDinh = duLieuKiemDinhJSON ?
                            ((typeof duLieuKiemDinhJSON != 'string') ?
                                duLieuKiemDinhJSON : JSON.parse(duLieuKiemDinhJSON)
                            ) : null;

                        const ketQua = duLieuKiemDinh?.ket_qua;

                        return <div key={index} className="py-3 mb-3">

                            <div className="w-100 mb-3 p-3 px-md-4 bg-lighter-grey d-flex row mx-0 align-items-center justify-content-between">
                                <h4 className="col-12 col-md-4 mb-md-0 p-0 text-center text-md-start text-uppercase fw-bold">Đồng hồ số {index + 1}:</h4>
                                <div className={`col-12 px-0 col-md-8 d-flex align-items-center justify-content-center justify-content-md-end`}>
                                    <Link href={ACCESS_LINKS.HC_DHN_EDIT_DH.src + "/" + dongHo.id} aria-label="Chỉnh sửa đồng hồ" className="btn border-0 me-2 bg-warning">
                                        <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                                    </Link>
                                    {ketQua != null && <>
                                        <span style={{ cursor: "unset" }} className={`btn border-0 bg-grey text-white rounded-start rounded-end-0 ${(dongHo.so_giay_chung_nhan && dongHo.so_tem && ketQua == true) || (ketQua == false) ? "d-inline" : "d-none"}`}><FontAwesomeIcon icon={faDownload}></FontAwesomeIcon></span>
                                        <button
                                            aria-label="Tải hiệu chuẩn"
                                            className={`btn border-top-0 border-bottom-0 bg-main-green rounded-0 ${(dongHo.so_giay_chung_nhan && dongHo.so_tem && ketQua == true) ? "" : "rounded-end"} text-white ${(dongHo.so_giay_chung_nhan && dongHo.so_tem && ketQua == true) || (ketQua == false) ? "d-inline" : "d-none"}`}
                                            onClick={() => handleDownloadBB(dongHo)}>
                                            <FontAwesomeIcon icon={faFileExcel} className="me-1"></FontAwesomeIcon> Hiệu chuẩn
                                        </button>
                                    </>}
                                </div>
                            </div>
                            <div className="px-3 px-md-5">
                                <div className="row px-3">
                                    <div className="col-12 m-0 p-0 col-md-6">
                                        <p>Số giấy: <b>{(dongHo.so_giay_chung_nhan) ? getFullSoGiayCN(dongHo.so_giay_chung_nhan, dongHo.ngay_thuc_hien || new Date, true) : "Không có số giấy"}</b></p>
                                    </div>
                                    <div className="col-12 m-0 p-0 col-md-6">
                                        <p>Số tem: <b>{dongHo.so_tem ? dongHo.so_tem : "Không có số tem"}</b></p>
                                    </div>
                                    {dongHo.seri_sensor && <div className="col-12">
                                        <p>Serial sensor: <b>{dongHo.seri_sensor}</b></p>
                                    </div>}
                                    {dongHo.seri_chi_thi && <div className="col-12">
                                        <p>Serial chỉ thị: <b>{dongHo.seri_chi_thi}</b></p>
                                    </div>}
                                </div>
                                {nhomDuLieuKiemDinh ? (

                                    <div className="row mb-3">
                                        <div className="w-100 px-3">
                                            <p className="fs-5 fw-bold text-center text-uppercase m-0">Kết quả kiểm tra</p>
                                            <div className="w-100 m-0 p-0 row mb-3">
                                                <div className="col-12 col-md-5 col-lg-4 col-xl-3 m-0 p-0">
                                                    <span>1. Kết quả kiểm tra bên ngoài:</span>
                                                </div>
                                                <div className="col-12 col-md-7 col-lg-8 col-xl-9 px-4">
                                                    <ul className="list-unstyled m-0 p-0">
                                                        <li>- Nhãn hiệu: <b>Đạt</b></li>
                                                        <li>- Phụ kiện: <b>Đạt</b></li>
                                                        <li>- Bộ phận chỉ thị: <b>Đạt</b></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <p className="m-0">2. Kết quả kiểm tra kỹ thuật:</p>
                                            <div className="w-100 mb-3 px-4 px-md-5">
                                                <ul className="list-unstyled m-0 p-0">
                                                    <li>- Kiểm tra khả năng hoạt động của hệ thống: <b>{ketQua ? "Đạt" : "Không đạt"}</b></li>
                                                </ul>
                                            </div>
                                            <p>3. Kết quả kiểm tra đo lường: </p>
                                            <div className={`${dtp.wrapper} w-100`}>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th colSpan={2} rowSpan={2}>Q</th>
                                                            <th colSpan={4}>Số chỉ trên đồng hồ</th>
                                                            <th colSpan={4}>Số chỉ trên chuẩn</th>
                                                            <th rowSpan={2}>δ</th>
                                                            <th rowSpan={2}>Mf</th>
                                                            <th rowSpan={2}>Hiệu sai số</th>
                                                        </tr>
                                                        <tr>
                                                            <th>V<sub>1</sub></th>
                                                            <th>V<sub>2</sub></th>
                                                            <th>V<sub>đh</sub></th>
                                                            <th>T</th>
                                                            <th>V<sub>c1</sub></th>
                                                            <th>V<sub>c2</sub></th>
                                                            <th>V<sub>c</sub></th>
                                                            <th>T</th>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={2}>m<sup>3</sup>/h</td>
                                                            <td>Lít</td>
                                                            <td>Lít</td>
                                                            <td>Lít</td>
                                                            <td>°C</td>
                                                            <td>Lít</td>
                                                            <td>Lít</td>
                                                            <td>Lít</td>
                                                            <td>°C</td>
                                                            <td>%</td>
                                                            <td>-</td>
                                                            <td>%</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {nhomDuLieuKiemDinh[index] && listKeys && (
                                                            <>
                                                                {renderDulieuLuuLuong(listKeys, nhomDuLieuKiemDinh[index])}
                                                            </>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ) : (<i>- Không có dữ liệu hiệu chuẩn -</i>)}
                            </div>
                        </div>;
                    })}
                </div>
            </div>
        ) :
            (<i>Không có dữ liệu để hiển thị!</i>)
        }
    </div >
}