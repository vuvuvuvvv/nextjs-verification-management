"use client"

import { getFullSoGiayCN, getSaiSoDongHo } from "@lib/system-function";
import dtp from "@styles/scss/ui/dn-bgt-15.detail.module.scss";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { DongHo, DuLieuChayDongHo } from "@lib/types";
import { Fragment, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { downloadBB, downloadGCN } from "@/app/api/download/route";
import Swal from "sweetalert2";

const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });
interface DetailDongHoProps {
    dongHo: DongHo;
}

export default function DetailDongHo({ dongHo }: DetailDongHoProps) {
    const [dongHoData, setDongHoData] = useState<DongHo>(dongHo);

    const [duLieuKiemDinhCacLuuLuong, setDuLieuKiemDinhCacLuuLuong] = useState<DuLieuChayDongHo>();
    const [ketQua, setKetQua] = useState<boolean | null>(null);
    const [hieuSaiSo, setFormHieuSaiSo] = useState<{ hss: number | null }[] | null>(null);

    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (dongHoData) {
            const duLieuKiemDinh = dongHoData.du_lieu_kiem_dinh as { du_lieu?: DuLieuChayDongHo };
            if (duLieuKiemDinh?.du_lieu) {
                const dlKiemDinh = duLieuKiemDinh.du_lieu;
                setDuLieuKiemDinhCacLuuLuong(dlKiemDinh);
            }
            const duLieuHSS = dongHoData.du_lieu_kiem_dinh as { hieu_sai_so?: { hss: number | null }[] };
            if (duLieuHSS?.hieu_sai_so) {
                const reversedHSS = [...duLieuHSS.hieu_sai_so].reverse(); // Tạo bản sao và đảo ngược
                setFormHieuSaiSo(reversedHSS);
            }
            const duLieuKetQua = dongHoData.du_lieu_kiem_dinh as { ket_qua?: boolean } | null;
            if (duLieuKetQua?.ket_qua != null) {
                setKetQua(duLieuKetQua.ket_qua);
            }
        }
    }, [dongHoData]);

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

    if (!dongHoData) {
        return <Loading></Loading>;
    }

    return <div className="w-100 m-0 p-2">
        <title>{dongHoData?.ten_dong_ho}</title>
        {dongHoData ? (
            <div className="w-100 m-0 my-3 p-0">
                <div className="container bg-white px-4 px-md-5 py-3">

                    <div className={`w-100 mb-4 p-0 d-flex align-items-center justify-content-end gap-2 ${ketQua ? '' : 'd-none'}`}>
                        <h6 className="m-0">Tải xuống:</h6>
                        <button className="btn bg-main-green text-white" onClick={handleDownloadBB}>
                            <FontAwesomeIcon icon={faFileExcel} className="me-2"></FontAwesomeIcon> Biên bản kiểm định
                        </button>
                        <button className="btn bg-main-green text-white" onClick={handleDownloadGCN}>
                            <FontAwesomeIcon icon={faFileExcel} className="me-2"></FontAwesomeIcon> Giấy chứng nhận kiểm định
                        </button>
                    </div>
                    <h4 className="fs-4 text-center text-uppercase">Chi tiết đồng hồ</h4>
                    <div className="row mb-3">
                        <div className="col-12">
                            <p>Số giấy chứng nhận: <b>{dongHoData.so_giay_chung_nhan && dongHoData.ngay_thuc_hien ? getFullSoGiayCN(dongHoData.so_giay_chung_nhan, dongHoData.ngay_thuc_hien) : "Chưa có số giấy chứng nhận"}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Số tem: <b>{dongHoData.so_tem ? dongHoData.so_tem : "Chưa có số tem"}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Tên đồng hồ: <b>{dongHoData.ten_dong_ho || "Chưa có tên đồng hồ"}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Tên phương tiện đo: <b>{dongHoData.phuong_tien_do || "Chưa có tên phương tiện đo"}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Nơi sản xuất: <b>{dongHoData.co_so_san_xuat || "Chưa có nơi sản xuất"}</b></p>
                        </div>
                        <div className="col-6">
                            <p>Kiểu sản xuất: <b>{dongHoData.kieu_thiet_bi || "Chưa có kiểu sản xuất"}</b></p>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12 col-md-4">
                            <p>Đặc trưng kỹ thuật đo lường:</p>
                        </div>
                        <div className="col-12 col-md-8">
                            <ul className="list-unstyled m-0 p-0">
                                <li>- Đường kính danh định: <b>DN ={dongHoData.dn || 0}</b> mm</li>
                                <li>- Lưu lượng danh định: {dongHoData.q3 ? <b>Q3= {dongHoData.q3 || 0}</b> : <b>Qn= {dongHoData.qn || 0}</b>} m<sup>3</sup>/h</li>
                                <li>- Cấp chính xác: <b>{dongHoData.ccx || "Chưa có cấp chính xác"}</b></li>
                                {(dongHoData.kieu_sensor) && <li>- Model sensor: <b>{dongHoData.kieu_sensor}</b></li>}
                                {(dongHoData.kieu_chi_thi) && <li>- Model chỉ thị: <b>{dongHoData.kieu_chi_thi}</b></li>}
                                {(dongHoData.seri_sensor) && <li>- Serial sensor: <b>{dongHoData.seri_sensor}</b></li>}
                                {(dongHoData.seri_chi_thi) && <li>- Serial chỉ thị: <b>{dongHoData.seri_chi_thi}</b></li>}
                                <li>- Ký hiệu PDM / Số quyết định: <b>{dongHoData.so_qd_pdm || "Chưa có số quyết định"}</b></li>
                            </ul>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <p>Cơ sở sử dụng: <b>{dongHoData.co_so_su_dung || "Chưa có cơ sở sử dụng"}</b></p>
                    </div>
                    <div className="row mb-3">
                        <p>Phương pháp thực hiện: <b>{dongHoData.phuong_phap_thuc_hien || "Chưa có phương pháp thực hiện"}</b></p>
                        <p>Chuẩn được sử dụng: <b>{dongHoData.chuan_thiet_bi_su_dung || "Chưa có chuẩn thiết bị sử dụng"}</b></p>
                    </div>
                    <div className="row mb-3">
                        <div className="col-6">
                            <p>Người thực hiện: <b className="text-uppercase">{dongHoData.nguoi_kiem_dinh || "Chưa có người thực hiện"}</b></p>
                        </div>
                        <div className="col-6">
                            <p>Ngày thực hiện: <b>{dayjs(dongHoData.ngay_thuc_hien).format("DD/MM/YYYY")}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Địa điểm thực hiện: <b>{dongHoData.vi_tri || "Chưa có địa điểm thực hiện"}</b></p>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <p className="fs-5 text-center text-uppercase">Kết quả kiểm tra</p>
                        <p>1. Khả năng hoạt động: <b>{ketQua ? "Đạt" : "Không đạt"}</b></p>
                        <p>2. Kết quả kiểm tra đo lường: </p>
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
                                    {duLieuKiemDinhCacLuuLuong && (
                                        <>
                                            {
                                                Object.entries(duLieuKiemDinhCacLuuLuong).map(([key, value], index) => {
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
                                                                                <td rowSpan={rowSpan}>{key}</td>
                                                                                <td rowSpan={rowSpan}>{value.value}</td>
                                                                            </>;
                                                                            const hss = hieuSaiSo ? hieuSaiSo[index].hss : 0;
                                                                            jsxEnd = <>
                                                                                <td rowSpan={rowSpan}>{hss}</td>
                                                                            </>
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
                                                                        }
                                                                    })
                                                                }
                                                            </Fragment>
                                                        );
                                                    }
                                                })
                                            }
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