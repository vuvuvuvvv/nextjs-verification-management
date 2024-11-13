"use client"

import { getFullSoGiayCN, getSaiSoDongHo } from "@lib/system-function";
import dtp from "@styles/scss/ui/q-bgt-15.detail.module.scss";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { DongHo, DuLieuChayDiemLuuLuong, DuLieuChayDongHo } from "@lib/types";
import { Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { downloadBB, downloadGCN } from "@/app/api/download/route";
import Swal from "sweetalert2";
import { TITLE_LUU_LUONG } from "@lib/system-constant";

const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });
interface DetailDongHoProps {
    dongHo: DongHo;
}

export default function DetailDongHo({ dongHo }: DetailDongHoProps) {
    const [listKeys, setListKeys] = useState<string[] | null>();

    const [duLieuKiemDinhCacLuuLuong, setDuLieuKiemDinhCacLuuLuong] = useState<DuLieuChayDongHo>();
    const [ketQua, setKetQua] = useState<boolean | null>(null);
    const [hieuSaiSo, setFormHieuSaiSo] = useState<{ hss: number | null }[] | null>(null);

    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (dongHo) {
            setListKeys(dongHo.q3 ? ["Q3", "Q2", "Q1"] : dongHo.qn ? ['Qn', "Qt", "Qmin"] : null);

            const duLieuKiemDinh = dongHo.du_lieu_kiem_dinh as { du_lieu?: DuLieuChayDongHo };
            if (duLieuKiemDinh?.du_lieu) {
                const dlKiemDinh = duLieuKiemDinh.du_lieu;
                setDuLieuKiemDinhCacLuuLuong(dlKiemDinh);
            }
            const duLieuHSS = dongHo.du_lieu_kiem_dinh as { hieu_sai_so?: { hss: number | null }[] };
            if (duLieuHSS?.hieu_sai_so) {
                setFormHieuSaiSo(duLieuHSS.hieu_sai_so);
            }
            const duLieuKetQua = dongHo.du_lieu_kiem_dinh as { ket_qua?: boolean } | null;
            if (duLieuKetQua?.ket_qua != null) {
                setKetQua(duLieuKetQua.ket_qua);
            }
        }
    }, [dongHo]);

    const renderDulieuLuuLuong = () => {
        if (listKeys && duLieuKiemDinhCacLuuLuong) {
            return listKeys.map((key, index) => {
                const value = duLieuKiemDinhCacLuuLuong[key] as DuLieuChayDiemLuuLuong;
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
                                                {key === TITLE_LUU_LUONG.q1
                                                    ? "QI" : key === TITLE_LUU_LUONG.q2
                                                        ? "QII" : key === TITLE_LUU_LUONG.q3
                                                            ? "QIII" : key}
                                            </td>
                                            <td rowSpan={rowSpan}>{value.value}</td>
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

    const handleDownloadBB = async () => {
        if (dongHo.id) {
            const result = await downloadBB(dongHo);
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

    return <div className="w-100 m-0 p-2">
        <title>{dongHo?.ten_dong_ho}</title>
        {dongHo ? (
            <div className="w-100 m-0 my-3 p-0">
                <div className="container bg-white px-3 px-md-5 py-3">

                    <div className={`w-100 mb-4 mx-0 d-flex align-items-center justify-content-center justify-content-md-end p-0 ${ketQua ? '' : 'd-none'}`}>
                        <span style={{ cursor: "unset" }} className="btn border-0 bg-lighter-grey rounded-start rounded-end-0"><FontAwesomeIcon icon={faDownload}></FontAwesomeIcon></span>
                        <button aria-label="Tải biên bản kiểm định" className="btn bg-main-green rounded-0 border-0 text-white" onClick={handleDownloadBB}>
                            <FontAwesomeIcon icon={faFileExcel} className="me-1"></FontAwesomeIcon> Biên bản
                        </button>
                        <button aria-label="Tải giấy chứng nhận kiểm định" className="btn border-start rounded-start-0 rounded-end border-top-0 border-bottom-0 bg-main-green text-white" onClick={handleDownloadGCN}>
                            <FontAwesomeIcon icon={faFileExcel} className="me-1"></FontAwesomeIcon> Giấy chứng nhận
                        </button>
                    </div>
                    <h4 className="fs-4 text-center text-uppercase">Chi tiết đồng hồ</h4>
                    <div className="row">
                        <div className="col-12">
                            <p>Số giấy chứng nhận: <b>{dongHo.so_giay_chung_nhan && dongHo.ngay_thuc_hien ? getFullSoGiayCN(dongHo.so_giay_chung_nhan, dongHo.ngay_thuc_hien) : "Chưa có số giấy chứng nhận"}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Số tem: <b>{dongHo.so_tem ? dongHo.so_tem : "Chưa có số tem"}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Tên đồng hồ: <b>{dongHo.ten_dong_ho || "Chưa có tên đồng hồ"}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Tên phương tiện đo: <b>{dongHo.phuong_tien_do || "Chưa có tên phương tiện đo"}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Nơi sản xuất: <b>{dongHo.co_so_san_xuat || "Chưa có nơi sản xuất"}</b></p>
                        </div>
                        <div className="col-12 mb-3">
                            <p className="m-0">Kiểu sản xuất:</p>
                            <div className="w-100 row m-0 px-3">
                                <div className="col-12 col-md-6 m-0 p-0">{(dongHo.kieu_sensor) && <>Kiểu sensor: <b>{dongHo.kieu_sensor}</b></>}</div>
                                <div className="col-12 col-md-6 m-0 p-0">{(dongHo.seri_sensor) && <>Serial sensor: <b>{dongHo.seri_sensor}</b></>}</div>
                                <div className="col-12 col-md-6 m-0 p-0">{(dongHo.kieu_chi_thi) && <>Kiểu chỉ thị: <b>{dongHo.kieu_chi_thi}</b></>}</div>
                                <div className="col-12 col-md-6 m-0 p-0">{(dongHo.seri_chi_thi) && <>Serial chỉ thị: <b>{dongHo.seri_chi_thi}</b></>}</div>
                            </div>
                        </div>
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
                                <li>- Ký hiệu PDM / Số quyết định: <b>{dongHo.so_qd_pdm + "-" + dayjs(dongHo.ngay_thuc_hien).format('YYYY') || "Chưa có số quyết định"}</b></li>
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
                            <p>Người thực hiện: <b className="text-uppercase">{dongHo.nguoi_kiem_dinh || "Chưa có người thực hiện"}</b></p>
                        </div>
                        <div className="col-6">
                            <p>Ngày thực hiện: <b>{dayjs(dongHo.ngay_thuc_hien).format("DD/MM/YYYY")}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Địa điểm thực hiện: <b>{dongHo.noi_su_dung || "Chưa có địa điểm thực hiện"}</b></p>
                        </div>
                    </div>
                    <div className="w-100 mb-3">
                        <p className="fs-5 fw-bold text-center text-uppercase m-0">Kết quả kiểm tra</p>
                        <div className="w-100 m-0 p-0 row mb-3">
                            <div className="col-12 col-md-5 col-lg-4">
                                <span>1. Kết quả kiểm tra bên ngoài:</span>
                            </div>
                            <div className="col-12 col-md-7 col-lg-8 px-4 px-md-0">
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