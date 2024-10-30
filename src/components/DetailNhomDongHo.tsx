"use client"

import { getFullSoGiayCN, getSaiSoDongHo } from "@lib/system-function";
import dtp from "@styles/scss/ui/dn-bgt-15.detail.module.scss";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { DongHo, DuLieuChayDongHo } from "@lib/types";
import { Fragment, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { downloadBB, downloadGCN } from "@/app/api/download/route";

const Loading = dynamic(() => import('@/components/Loading'), { ssr: false });
const ModalSelectDongHoToDownload = dynamic(() => import('@/components/ui/ModalSelectDongHoToDownload'), { ssr: false });
interface DetailNhomDongHoProps {
    nhomDongHo: DongHo[];
}

interface GeneralInfo {
    group_id: string | null;
    ten_dong_ho: string | null;
    phuong_tien_do: string | null;
    kieu_chi_thi: string | null;
    kieu_sensor: string | null;
    kieu_thiet_bi: string | null;
    co_so_san_xuat: string | null;
    nam_san_xuat: Date | null;
    dn: string | null;
    d: string | null;
    ccx: string | null;
    q3: string | null;
    r: string | null;
    qn: string | null;
    k_factor: string | null;
    so_qd_pdm: string | null;
    ten_khach_hang: string | null;
    co_so_su_dung: string | null;
    phuong_phap_thuc_hien: string | null;
    chuan_thiet_bi_su_dung: string | null;
    nguoi_kiem_dinh: string | null;
    ngay_thuc_hien: Date | null;
    vi_tri: string | null;
    nhiet_do: string | null;
    do_am: string | null;
}

interface DuLieuKiemDinh {
    hieu_sai_so: { hss: number | null }[] | null,
    du_lieu: DuLieuChayDongHo | null,
    ket_qua: string | null
}

const DOWNLOAD_TYPE = {
    BB: 1,
    GCN: 2
}

export default function DetailNhomDongHo({ nhomDongHo }: DetailNhomDongHoProps) {
    const [nhomDongHoData, setNhomDongHoData] = useState<DongHo[]>(nhomDongHo);

    const [selectedDongHo, setSelectedDongHo] = useState<DongHo[]>([]);
    const selectedDongHoRef = useRef(selectedDongHo);
    const [typeToDownload, setTypeToDownload] = useState<number | null>(null);

    const [showModalSelectDongHoToDownload, setShowModalSelectDongHoToDownload] = useState(false);

    const [generalInfo, setGeneralInfo] = useState<GeneralInfo | null>(null);

    const [nhomDuLieuKiemDinh, setNhomDuLieuKiemDinh] = useState<DuLieuKiemDinh[] | null>(null);

    useEffect(() => {
        console.log(nhomDuLieuKiemDinh);
    }, [nhomDuLieuKiemDinh])

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
                if (typeToDownload === DOWNLOAD_TYPE.BB) {
                    res = await downloadBB(dongHo);
                } else {
                    res = await downloadGCN(dongHo);
                }
                if (res.status && [404, 500, 400, 422].includes(res.status)) {
                    errorMessages.push(`ĐH số ${(nhomDongHoData.indexOf(dongHo)) + 1}: ${res.msg || "Chưa thể tải"}`);
                }
            } catch (error: any) {
                errorMessages.push(`ĐH số ${(nhomDongHoData.indexOf(dongHo)) + 1}: ${error.message || error.response.msg || "Chưa thể tải"}`);
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
        if (dongHo.id) {
            const result = await downloadBB(dongHo);
            setMessage(result.msg);
        }
    }

    const handleDownloadGCN = async (dongHo: DongHo) => {
        if (dongHo.id) {
            const result = await downloadGCN(dongHo);
            setMessage(result.msg);
        }
    }

    const handleMultDownloadBB = async () => {
        setTypeToDownload(DOWNLOAD_TYPE.BB);
        setShowModalSelectDongHoToDownload(true);
    }

    const handleMultDownloadGCN = async () => {
        setTypeToDownload(DOWNLOAD_TYPE.GCN);
        setShowModalSelectDongHoToDownload(true);
    }

    const handleCloseModal = () => {
        setShowModalSelectDongHoToDownload(false);
    }

    useEffect(() => {
        if (nhomDongHoData.length > 0) {
            const dongHo = nhomDongHo[0];
            setGeneralInfo({
                group_id: dongHo.group_id,
                ten_dong_ho: dongHo.ten_dong_ho,
                phuong_tien_do: dongHo.phuong_tien_do,
                kieu_thiet_bi: dongHo.kieu_thiet_bi,
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
                k_factor: dongHo.k_factor,
                so_qd_pdm: dongHo.so_qd_pdm,
                ten_khach_hang: dongHo.ten_khach_hang,
                co_so_su_dung: dongHo.co_so_su_dung,
                phuong_phap_thuc_hien: dongHo.phuong_phap_thuc_hien,
                chuan_thiet_bi_su_dung: dongHo.chuan_thiet_bi_su_dung,
                nguoi_kiem_dinh: dongHo.nguoi_kiem_dinh,
                ngay_thuc_hien: dongHo.ngay_thuc_hien,
                vi_tri: dongHo.vi_tri,
                nhiet_do: dongHo.nhiet_do,
                do_am: dongHo.do_am,
            })

            let tmpNhomDuLieuKiemDinh: DuLieuKiemDinh[] = []
            nhomDongHoData.map((dongHoData, index) => {
                let tmp_hieu_sai_so = null
                let tmp_du_lieu = null
                let tmp_ket_qua = null

                const duLieuKiemDinh = dongHoData.du_lieu_kiem_dinh as { du_lieu?: DuLieuChayDongHo };
                if (duLieuKiemDinh?.du_lieu) {
                    tmp_du_lieu = duLieuKiemDinh.du_lieu;

                }
                const duLieuHSS = dongHoData.du_lieu_kiem_dinh as { hieu_sai_so?: { hss: number | null }[] };
                if (duLieuHSS?.hieu_sai_so) {
                    tmp_hieu_sai_so = duLieuHSS.hieu_sai_so;
                }
                const duLieuKetQua = dongHoData.du_lieu_kiem_dinh as { ket_qua?: boolean } | null;
                if (duLieuKetQua != null) {
                    tmp_ket_qua = duLieuKetQua ? "Đạt" : "Không đạt";
                }

                tmpNhomDuLieuKiemDinh.push({
                    hieu_sai_so: tmp_hieu_sai_so,
                    du_lieu: tmp_du_lieu,
                    ket_qua: tmp_ket_qua
                })
            });
            setNhomDuLieuKiemDinh(tmpNhomDuLieuKiemDinh);
        }
    }, [nhomDongHoData]);

    if (!nhomDongHoData || generalInfo == null) {
        return <Loading></Loading>;
    }

    return <div className="w-100 m-0 p-2">
        <title>{"Nhóm đồng hồ " + generalInfo.ten_dong_ho || ""}</title>
        {generalInfo ? (
            <div className="w-100 m-0 my-3 p-0">
                <ModalSelectDongHoToDownload
                    dongHoList={nhomDongHoData}
                    show={showModalSelectDongHoToDownload}
                    handleClose={handleCloseModal}
                    handleSelectedDongHo={setSelectedDongHo}
                ></ModalSelectDongHoToDownload>
                <div className={`container my-3 p-0 d-flex align-items-center gap-2`}>
                    <h6 className="m-0">Chọn tải xuống:</h6>
                    <button className="btn bg-main-green text-white" onClick={handleMultDownloadBB}>
                        <FontAwesomeIcon icon={faFileExcel} className="me-2"></FontAwesomeIcon> Biên bản kiểm định
                    </button>
                    <button className="btn bg-main-green text-white" onClick={handleMultDownloadGCN}>
                        <FontAwesomeIcon icon={faFileExcel} className="me-2"></FontAwesomeIcon> Giấy chứng nhận kiểm định
                    </button>
                </div>
                <div className="container bg-white px-4 px-md-5 py-4">
                    <h4 className="text-center text-uppercase">Chi tiết nhóm đồng hồ</h4>
                    <p className="fs-5 text-uppercase fw-bold text-decoration-underline">I. Thông tin chung:</p>
                    <div className="row mb-3">
                        <div className="col-12">
                            <p>Tên đồng hồ: <b>{generalInfo.ten_dong_ho || "Chưa có tên đồng hồ"}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Tên phương tiện đo: <b>{generalInfo.phuong_tien_do || "Chưa có tên phương tiện đo"}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Nơi sản xuất: <b>{generalInfo.co_so_san_xuat || "Chưa có nơi sản xuất"}</b></p>
                        </div>
                        <div className="col-6">
                            <p>Kiểu sản xuất: <b>{generalInfo.kieu_thiet_bi || "Chưa có kiểu sản xuất"}</b></p>
                        </div>
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
                                <li>- Ký hiệu PDM / Số quyết định: <b>{generalInfo.so_qd_pdm || "Chưa có số quyết định"}</b></li>
                            </ul>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <p>Cơ sở sử dụng: <b>{generalInfo.co_so_su_dung || "Chưa có cơ sở sử dụng"}</b></p>
                    </div>
                    <div className="row mb-3">
                        <p>Phương pháp thực hiện: <b>{generalInfo.phuong_phap_thuc_hien || "Chưa có phương pháp thực hiện"}</b></p>
                        <p>Chuẩn được sử dụng: <b>{generalInfo.chuan_thiet_bi_su_dung || "Chưa có chuẩn thiết bị sử dụng"}</b></p>
                    </div>
                    <div className="row mb-3">
                        <div className="col-6">
                            <p>Người thực hiện: <b className="text-uppercase">{generalInfo.nguoi_kiem_dinh || "Chưa có người thực hiện"}</b></p>
                        </div>
                        <div className="col-6">
                            <p>Ngày thực hiện: <b>{dayjs(generalInfo.ngay_thuc_hien).format("DD/MM/YYYY")}</b></p>
                        </div>
                        <div className="col-12">
                            <p>Địa điểm thực hiện: <b>{generalInfo.vi_tri || "Chưa có địa điểm thực hiện"}</b></p>
                        </div>
                    </div>

                    <p className="fs-5 text-uppercase fw-bold text-decoration-underline">II. Chi tiết:</p>
                    {nhomDongHoData.map((dongHo, index) => {

                        return <div key={index} className="py-3 px-2 mb-3">

                            <div className="w-100 mb-3 d-flex align-items-center gap-3 justify-content-between">
                                <h5 className="fs-5 text-center text-uppercase text-decoration-underline fw-bold">Đồng hồ số {index + 1}:</h5>

                                <div className="d-flex align-items-center gap-3 justify-content-end">
                                    <h6 className="m-0">Tải xuống:</h6>
                                    <button className="btn bg-main-green text-white" onClick={() => handleDownloadBB(dongHo)}>
                                        <FontAwesomeIcon icon={faFileExcel} className="me-2"></FontAwesomeIcon> Biên bản kiểm định
                                    </button>
                                    <button className="btn bg-main-green text-white" onClick={() => handleDownloadGCN(dongHo)}>
                                        <FontAwesomeIcon icon={faFileExcel} className="me-2"></FontAwesomeIcon> Giấy chứng nhận kiểm định
                                    </button>
                                </div>
                            </div>

                            <div className="row px-3 px-md-4 mb-3">
                                {(dongHo.so_giay_chung_nhan && dongHo.ngay_thuc_hien) && <div className="col-12 col-md-6">
                                    <p>Số giấy chứng nhận: <b>{getFullSoGiayCN(dongHo.so_giay_chung_nhan, dongHo.ngay_thuc_hien)}</b></p>
                                </div>}
                                {dongHo.seri_chi_thi && <div className="col-12 col-md-6">
                                    <p>Số tem: <b>{dongHo.so_tem}</b></p>
                                </div>}
                                {dongHo.kieu_sensor && <div className="col-12 col-md-6">
                                    <p>Kiểu sensor: <b>{dongHo.kieu_sensor}</b></p>
                                </div>}
                                {dongHo.kieu_chi_thi && <div className="col-12 col-md-6">
                                    <p>Kiểu chỉ thị: <b>{dongHo.kieu_chi_thi}</b></p>
                                </div>}
                                {dongHo.seri_sensor && <div className="col-12 col-md-6">
                                    <p>Serial sensor: <b>{dongHo.seri_sensor}</b></p>
                                </div>}
                                {dongHo.seri_chi_thi && <div className="col-12 col-md-6">
                                    <p>Serial chỉ thị: <b>{dongHo.seri_chi_thi}</b></p>
                                </div>}
                            </div>
                            {nhomDuLieuKiemDinh ? (

                                <div className="row mb-3">
                                    <p className="fs-5 text-uppercase text-decoration-underline">Kết quả kiểm tra:</p>
                                    <div className="w-100 px-3 px-md-4">
                                        <p>1. Khả năng hoạt động: <b>{nhomDuLieuKiemDinh[index].ket_qua}</b></p>
                                        <p>3. Hiệu lực biên bản: {dayjs(dongHo.hieu_luc_bien_ban).format("DD/MM/YYYY") || "Không có hiệu lực"} </p>
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
                                                    {nhomDuLieuKiemDinh[index].du_lieu && (
                                                        <>
                                                            {
                                                                Object.entries(nhomDuLieuKiemDinh[index].du_lieu).map(([key, value], indexDL) => {
                                                                    if (value?.value) {
                                                                        let indexHead = true;
                                                                        let jsxStart, jsxEnd;
                                                                        const rowSpan = Object.entries(value.lan_chay).reduce((count, [keyLanChay, valueLanChay]) => {
                                                                            return getSaiSoDongHo(valueLanChay) != null ? count + 1 : count;
                                                                        }, 0);

                                                                        return (
                                                                            <Fragment key={key + indexDL}>
                                                                                {
                                                                                    Object.entries(value.lan_chay).map(([keyLanChay, valueLanChay], indexLanChay) => {
                                                                                        jsxStart = <></>
                                                                                        jsxEnd = <></>
                                                                                        if (indexHead) {
                                                                                            jsxStart = <>
                                                                                                <td rowSpan={rowSpan}>{key}</td>
                                                                                                <td rowSpan={rowSpan}>{value.value}</td>
                                                                                            </>;
                                                                                            const hss = nhomDuLieuKiemDinh[index].hieu_sai_so ? nhomDuLieuKiemDinh[index].hieu_sai_so.reverse()[index].hss : 0;
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
                            ) : (<i>- Không có dữ liệu kiểm định -</i>)}
                        </div>;
                    })}
                </div>
            </div>
        ) :
            (<i>Không có dữ liệu để hiển thị!</i>)
        }
    </div >
}