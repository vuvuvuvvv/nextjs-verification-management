"use client"

import { getFullSoGiayCN, getSaiSoDongHo } from "@lib/system-function";
import dtp from "@styles/scss/ui/q-bgt-15.detail.module.scss";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { DongHo, DuLieuChayDiemLuuLuong, DuLieuChayDongHo } from "@lib/types";
import { Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { downloadBBExcel, downloadBBPDF, downloadGCN } from "@/app/api/download/route";
import Swal from "sweetalert2";
import { ACCESS_LINKS, TITLE_LUU_LUONG } from "@lib/system-constant";
import Link from "next/link";

const Loading = dynamic(() => import('@/components/Loading'));
interface DetailKiemDinhDongHoProps {
    dongHo: DongHo;
}

export default function DetailKiemDinhDongHo({ dongHo }: DetailKiemDinhDongHoProps) {
    const [listKeys, setListKeys] = useState<string[] | null>();

    const [duLieuKiemDinhCacLuuLuong, setDuLieuKiemDinhCacLuuLuong] = useState<DuLieuChayDongHo>();
    const [ketQua, setKetQua] = useState<boolean | null>(null);
    const [hieuSaiSo, setFormHieuSaiSo] = useState<{ hss: number | null }[] | null>(null);

    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (dongHo) {
            setListKeys(dongHo.q3 ? ["Q3", "Q2", "Q1"] : (dongHo.qn ? ['Qn', "Qt", "Qmin"] : null));
            const duLieuKiemDinhJSON = dongHo.du_lieu_kiem_dinh;
            const duLieuKiemDinh = duLieuKiemDinhJSON ?
                ((typeof duLieuKiemDinhJSON != 'string') ?
                    duLieuKiemDinhJSON : JSON.parse(duLieuKiemDinhJSON)
                ) : null;
            if (duLieuKiemDinh?.du_lieu) {
                const dlKiemDinh = duLieuKiemDinh.du_lieu;
                setDuLieuKiemDinhCacLuuLuong(dlKiemDinh);
                console.log(dlKiemDinh);
            }

            if (duLieuKiemDinh?.hieu_sai_so) {
                setFormHieuSaiSo(duLieuKiemDinh.hieu_sai_so);
            }

            setKetQua(duLieuKiemDinh.ket_qua);
            console.log(dongHo.q3 ? ["Q3", "Q2", "Q1"] : (dongHo.qn ? ['Qn', "Qt", "Qmin"] : null));
        }
    }, [dongHo]);

    const renderDulieuLuuLuong = () => {
        if (listKeys && duLieuKiemDinhCacLuuLuong) {
            return listKeys.map((key, index) => {
                console.log(listKeys);

                const value = duLieuKiemDinhCacLuuLuong[key] as DuLieuChayDiemLuuLuong;
                console.log(value);
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
                                        const hss = hieuSaiSo ? hieuSaiSo[
                                            [TITLE_LUU_LUONG.q1, TITLE_LUU_LUONG.qmin].includes(key)
                                                ? 2 : [TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.qt].includes(key)
                                                    ? 1 : [TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.qn].includes(key)
                                                        ? 0 : index].hss : 0;
                                        jsxEnd = <><td rowSpan={rowSpan}>{hss}</td></>
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

    const handleDownloadBBExcel = async () => {
        if (dongHo.id) {
            const result = await downloadBBExcel(dongHo);
            setMessage(result.msg);
        }
    }

    const handleDownloadBBPDF = async () => {
        if (dongHo.id) {
            const result = await downloadBBPDF(dongHo);
            setMessage(result.msg);
        }
    }

    const handleDownloadGCN = async () => {
        if (dongHo.id) {
            const result = await downloadGCN(dongHo);
            setMessage(result.msg);
        }
    }

    if (!dongHo) {
        return <Loading></Loading>;
    }

    return <div className="container-fluid m-0 p-2">
        <title>{dongHo?.ten_phuong_tien_do}</title>
        {dongHo ? (
            <div className="w-100 container my-3 p-0">
                <div className={`w-100 mb-3 mx-0 d-flex align-items-center justify-content-center justify-content-md-end p-0`}>
                    <Link href={ACCESS_LINKS.DHN_EDIT_DH.src + "/" + dongHo.id} aria-label="Chỉnh sửa đồng hồ" className="btn bg-warning me-2">
                        <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon> Edit
                    </Link>
                    {ketQua != null && <>
                        <span style={{ cursor: "unset" }} className={`btn bg-grey text-white rounded-start rounded-end-0 ${(dongHo.so_giay_chung_nhan && dongHo.so_tem && ketQua == true) || (ketQua == false) ? "d-inline" : "d-none"}`}><FontAwesomeIcon icon={faDownload}></FontAwesomeIcon> Nhiều:</span>
                        <button aria-label="Tải biên bản kiểm định" className={`btn bg-main-green rounded-0 ${(dongHo.so_giay_chung_nhan && dongHo.so_tem && ketQua == true) ? "" : "rounded-end"} text-white ${(dongHo.so_giay_chung_nhan && dongHo.so_tem && ketQua == true) || (ketQua == false) ? "d-inline" : "d-none"}`} onClick={handleDownloadBBExcel}>
                            <FontAwesomeIcon icon={faFileExcel} className="me-1"></FontAwesomeIcon> Biên bản
                        </button>
                        <button aria-label="Tải giấy chứng nhận kiểm định" className={`btn border-start rounded-start-0 rounded-end bg-main-green text-white ${(dongHo.so_giay_chung_nhan && dongHo.so_tem && ketQua == true) ? "d-inline" : "d-none"}`} onClick={handleDownloadGCN}>
                            <FontAwesomeIcon icon={faFileExcel} className="me-1"></FontAwesomeIcon> Giấy chứng nhận
                        </button>
                    </>}
                </div>
                <div className="w-100 bg-white px-3 px-md-5 py-3">
                    <h4 className="fs-4 text-center text-uppercase">Chi tiết đồng hồ</h4>
                    <div className="row">
                        <div className="col-12">
                            <p>Số giấy chứng nhận: <b>{dongHo.so_giay_chung_nhan && dongHo.ngay_thuc_hien ? getFullSoGiayCN(dongHo.so_giay_chung_nhan, dongHo.ngay_thuc_hien) : "Chưa có số giấy chứng nhận"}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Số tem: <b>{dongHo.so_tem ? dongHo.so_tem : "Chưa có số tem"}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Tên phương tiện đo: <b>{dongHo.ten_phuong_tien_do || "Chưa có tên phương tiện đo"}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Nơi sản xuất: <b>{dongHo.co_so_san_xuat || "Chưa có nơi sản xuất"}</b></p>
                        </div>
                        {/* {(dongHo.sensor || dongHo.seri_sensor || dongHo.transitor || dongHo.seri_chi_thi)
                            && <div className="col-12 mb-3">
                                <p className="m-0">Kiểu sản xuất:</p>
                                <div className="w-100 row m-0 px-3">
                                    <div className="col-12 col-md-6 m-0 p-0">{(dongHo.sensor) && <>Kiểu sensor: <b>{dongHo.sensor}</b></>}</div>
                                    <div className="col-12 col-md-6 m-0 p-0">{(dongHo.seri_sensor) && <>Serial sensor: <b>{dongHo.seri_sensor}</b></>}</div>
                                    <div className="col-12 col-md-6 m-0 p-0">{(dongHo.transitor) && <>Kiểu chỉ thị: <b>{dongHo.transitor}</b></>}</div>
                                    <div className="col-12 col-md-6 m-0 p-0">{(dongHo.seri_chi_thi) && <>Serial chỉ thị: <b>{dongHo.seri_chi_thi}</b></>}</div>
                                </div>
                            </div>
                        } */}
                    </div>
                    <div className="row mb-3">
                        <div className="col-12 col-md-4">
                            <span>Đặc trưng kỹ thuật đo lường:</span>
                        </div>
                        <div className="col-12 col-md-8 px-4 px-md-0">
                            <ul className="list-unstyled m-0 p-0">
                                <li>- Đường kính danh định: <b>DN ={dongHo.dn || 0}</b> mm</li>
                                <li>- Lưu lượng danh định: {dongHo.q3 ? <b>Q3= {dongHo.q3 || 0}</b> : <b>Qn= {dongHo.qn || 0}</b>} m<sup>3</sup>/h</li>
                                <li>- Cấp chính xác: <b>{dongHo.ccx || "Chưa có cấp chính xác"}</b></li>
                                <li>- Ký hiệu PDM / Số quyết định: <b>{dongHo.so_qd_pdm || "Chưa có số quyết định"}</b></li>
                            </ul>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <p>Cơ sở sử dụng: <b>{dongHo.co_so_su_dung || "Chưa có cơ sở sử dụng"}</b></p>
                    </div>
                    <div className="row mb-3">
                        <p>Phương pháp thực hiện: <b>{dongHo.phuong_phap_thuc_hien || "Chưa có phương pháp thực hiện"}</b></p>
                        <p>Chuẩn được sử dụng: <b>{dongHo.chuan_thiet_bi_su_dung || "Chưa có chuẩn thiết bị sử dụng"}</b></p>
                    </div>
                    <div className="row mb-3">
                        <div className="col-6">
                            <p>Người thực hiện: <b className="text-uppercase">{dongHo.nguoi_thuc_hien || "Chưa có người thực hiện"}</b></p>
                        </div>
                        <div className="col-6">
                            <p>Ngày thực hiện: <b>{dayjs(dongHo.ngay_thuc_hien).format("DD/MM/YYYY")}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Địa điểm thực hiện: <b>{dongHo.dia_diem_thuc_hien || "Chưa có địa điểm thực hiện"}</b></p>
                        </div>
                    </div>
                    <div className="w-100 mb-3">
                        <p className="fs-5 fw-bold text-center text-uppercase m-0">Kết quả kiểm định</p>
                        <p className="m-0">1. Kết quả kiểm tra bên ngoài: <b>{dongHo.ket_qua_check_vo_ngoai ? "Đạt" : "Không đạt"}</b></p>
                        <p className="m-0">2. Kết quả kiểm tra kỹ thuật:</p>
                        <div className="w-100 mb-3 px-4 px-md-5">
                            <ul className="list-unstyled m-0 p-0">
                                <li>- Kiểm tra độ kín: <b>{dongHo.ket_qua_check_do_kin ? "Đạt" : "Không đạt"}</b></li>
                                <li>- Kiểm tra độ ổn định số chỉ: <b>{dongHo.ket_qua_check_do_on_dinh_chi_so ? "Đạt" : "Không đạt"}</b></li>
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
                                        <td>%</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {duLieuKiemDinhCacLuuLuong && listKeys && (
                                        <>
                                            {renderDulieuLuuLuong()}
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        ) :
            (<i>Không có dữ liệu để hiển thị!</i>)}
    </div>
}