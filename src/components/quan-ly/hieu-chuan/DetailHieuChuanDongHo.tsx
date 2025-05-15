// "use client"

// import { getFullSoGiayCN, getSaiSoDongHo } from "@lib/system-function";
// import dtp from "@styles/scss/ui/q-bgt-15.detail.module.scss";
// import dayjs from "dayjs";
// import dynamic from "next/dynamic";
// import { DongHo, DuLieuChayDiemLuuLuong, DuLieuChayDongHo } from "@lib/types";
// import { Fragment, useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faDownload, faEdit, faFileExcel } from "@fortawesome/free-solid-svg-icons";
// import { downloadHC, downloadGCN } from "@/app/api/download/route";
// import Swal from "sweetalert2";
// import { ACCESS_LINKS, TITLE_LUU_LUONG } from "@lib/system-constant";
// import Link from "next/link";

// const Loading = dynamic(() => import('@/components/Loading'));
// interface DetailHieuChuanDongHoProps {
//     dongHo: DongHo;
// }

// export default function DetailHieuChuanDongHo({ dongHo }: DetailHieuChuanDongHoProps) {
//     const [listKeys, setListKeys] = useState<string[] | null>();

//     const [duLieuKiemDinhCacLuuLuong, setDuLieuKiemDinhCacLuuLuong] = useState<DuLieuChayDongHo>();
//     const [ketQua, setKetQua] = useState<boolean | null>(null);
//     const [hieuSaiSo, setFormHieuSaiSo] = useState<{ hss: number | null }[] | null>(null);
//     const [mf, setFormMf] = useState<{ mf: number | null }[] | null>(null);

//     const [message, setMessage] = useState<string | null>(null);

//     useEffect(() => {
//         if (dongHo) {
//             setListKeys(dongHo.q3 ? ["Q3", "Q2", "Q1"] : dongHo.qn ? ['Qn', "Qt", "Qmin"] : null);
//             const duLieuKiemDinhJSON = dongHo.du_lieu_kiem_dinh;
//             const duLieuKiemDinh = duLieuKiemDinhJSON ?
//                 ((typeof duLieuKiemDinhJSON != 'string') ?
//                     duLieuKiemDinhJSON : JSON.parse(duLieuKiemDinhJSON)
//                 ) : null;

//             if (duLieuKiemDinh?.du_lieu) {
//                 const dlKiemDinh = duLieuKiemDinh.du_lieu;
//                 setDuLieuKiemDinhCacLuuLuong(dlKiemDinh);
//             }

//             if (duLieuKiemDinh?.hieu_sai_so) {
//                 setFormHieuSaiSo(duLieuKiemDinh.hieu_sai_so);
//             }

//             if (duLieuKiemDinh?.mf) {
//                 setFormMf(duLieuKiemDinh.mf);
//             }

//             setKetQua(duLieuKiemDinh.ket_qua);
//         }
//     }, [dongHo]);

//     const renderDulieuLuuLuong = () => {
//         if (listKeys && duLieuKiemDinhCacLuuLuong) {
//             return listKeys.map((key, index) => {
//                 const value = duLieuKiemDinhCacLuuLuong[key] as DuLieuChayDiemLuuLuong;
//                 if (value?.value != null) {
//                     let indexHead = true;
//                     let jsxStart, jsxEnd;
//                     const rowSpan = Object.entries(value.lan_chay).reduce((count, [keyLanChay, valueLanChay]) => {
//                         return getSaiSoDongHo(valueLanChay) != null ? count + 1 : count;
//                     }, 0);

//                     return (
//                         <Fragment key={key + index}>
//                             {
//                                 Object.entries(value.lan_chay).map(([keyLanChay, valueLanChay], indexLanChay) => {
//                                     jsxStart = <></>
//                                     jsxEnd = <></>
//                                     if (indexHead) {
//                                         jsxStart = <>
//                                             <td rowSpan={rowSpan}>
//                                                 {(key === TITLE_LUU_LUONG.q1 || key === TITLE_LUU_LUONG.qmin)
//                                                     ? "I" : ((key === TITLE_LUU_LUONG.q2 || key === TITLE_LUU_LUONG.qt)
//                                                         ? "II" : "III")}
//                                             </td>
//                                             <td rowSpan={rowSpan}>{key === TITLE_LUU_LUONG.q3 ? 0.3 * parseFloat(Number(value.value).toString()) : value.value}</td>
//                                         </>;
//                                         const getmf = mf ? mf[
//                                             [TITLE_LUU_LUONG.q1, TITLE_LUU_LUONG.qmin].includes(key)
//                                                 ? 2 : [TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.qt].includes(key)
//                                                     ? 1 : [TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.qn].includes(key)
//                                                         ? 0 : index].mf : 0;

//                                         const gethss = hieuSaiSo ? hieuSaiSo[
//                                             [TITLE_LUU_LUONG.q1, TITLE_LUU_LUONG.qmin].includes(key)
//                                                 ? 2 : [TITLE_LUU_LUONG.q2, TITLE_LUU_LUONG.qt].includes(key)
//                                                     ? 1 : [TITLE_LUU_LUONG.q3, TITLE_LUU_LUONG.qn].includes(key)
//                                                         ? 0 : index].hss : 0;
//                                         jsxEnd = <><td rowSpan={rowSpan}>{getmf}</td><td rowSpan={rowSpan}>{gethss}</td></>
//                                         indexHead = false;
//                                     }

//                                     if (getSaiSoDongHo(valueLanChay) != null) {
//                                         return (
//                                             <tr key={keyLanChay + indexLanChay}>
//                                                 {jsxStart}
//                                                 <td>{valueLanChay.V1}</td>
//                                                 <td>{valueLanChay.V2}</td>
//                                                 <td>{(Number(valueLanChay.V2) - Number(valueLanChay.V1)).toFixed(4).replace(/\.?0+$/, '')}</td>
//                                                 <td>{valueLanChay.Tdh}</td>
//                                                 <td>{valueLanChay.Vc1}</td>
//                                                 <td>{valueLanChay.Vc2}</td>
//                                                 <td>{(Number(valueLanChay.Vc2) - Number(valueLanChay.Vc1)).toFixed(4).replace(/\.?0+$/, '')}</td>
//                                                 <td>{valueLanChay.Tc}</td>
//                                                 <td>{getSaiSoDongHo(valueLanChay)}</td>
//                                                 {jsxEnd}
//                                             </tr>
//                                         );
//                                     } else {
//                                         return <></>
//                                     }
//                                 })
//                             }
//                         </Fragment>
//                     );
//                 }
//             })
//         }
//         return <></>
//     }

//     useEffect(() => {
//         if (message) {
//             Swal.fire({
//                 icon: "info",
//                 title: "CHÚ Ý",
//                 text: message,
//                 showClass: {
//                     popup: `
//                     animate__animated
//                     animate__fadeInUp
//                     animate__faster
//                   `
//                 },
//                 hideClass: {
//                     popup: `
//                     animate__animated
//                     animate__fadeOutDown
//                     animate__faster
//                   `
//                 },
//                 confirmButtonColor: "#0980de",
//                 confirmButtonText: "OK"
//             }).then(() => {
//                 setMessage("");
//             });
//         }
//     }, [message]);

//     const handleDownloadHC = async () => {
//         if (dongHo.id) {
//             const result = await downloadHC(dongHo);
//             setMessage(result.msg);
//         }
//     }

//     if (!dongHo) {
//         return <Loading></Loading>;
//     }

//     return <div className="container-fluid m-0 p-2">
//         <title>{dongHo?.ten_dong_ho}</title>
//         {dongHo ? (
//             <div className="w-100 container my-3 p-0">
//                 <div className={`w-100 mb-3 mx-0 d-flex align-items-center justify-content-center justify-content-md-end p-0`}>
//                     <Link href={ACCESS_LINKS.HC_DHN_EDIT_DH.src + "/" + dongHo.id} aria-label="Chỉnh sửa đồng hồ" className="btn bg-warning me-2">
//                         <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon> Edit
//                     </Link>
//                     {ketQua != null && <>
//                         <span style={{ cursor: "unset" }} className={`btn bg-grey text-white rounded-start rounded-end-0 ${(dongHo.so_giay_chung_nhan && dongHo.so_tem && ketQua == true) || (ketQua == false) ? "d-inline" : "d-none"}`}><FontAwesomeIcon icon={faDownload}></FontAwesomeIcon> Nhiều:</span>
//                         <button aria-label="Tải hiệu chuẩn" disabled className={`btn bg-main-green rounded-end ${(dongHo.so_giay_chung_nhan && dongHo.so_tem && ketQua == true) ? "" : ""} text-white ${(dongHo.so_giay_chung_nhan && dongHo.so_tem && ketQua == true) || (ketQua == false) ? "d-inline" : "d-none"}`} onClick={handleDownloadHC}>
//                             <FontAwesomeIcon icon={faFileExcel} className="me-1"></FontAwesomeIcon> Hiệu chuẩn
//                         </button>
//                     </>}
//                 </div>
//                 <div className="w-100 bg-white px-3 px-md-5 py-3">
//                     <h4 className="fs-4 text-center text-uppercase">Chi tiết hiệu chuẩn</h4>
//                     <div className="row">
//                         {dongHo.so_giay_chung_nhan && dongHo.ngay_thuc_hien && (
//                             <div className="col-12">
//                                 <p>Số giấy: <b>{getFullSoGiayCN(dongHo.so_giay_chung_nhan, dongHo.ngay_thuc_hien, true)}</b></p>
//                             </div>
//                         )}
//                         {dongHo.so_tem && (
//                             <div className="col-12">
//                                 <p>Số tem: <b>{dongHo.so_tem}</b></p>
//                             </div>
//                         )}
//                         {dongHo.ten_dong_ho && (
//                             <div className="col-12">
//                                 <p>Tên đồng hồ: <b>{dongHo.ten_dong_ho}</b></p>
//                             </div>
//                         )}
//                         {dongHo.ten_phuong_tien_do && (
//                             <div className="col-12">
//                                 <p>Tên phương tiện đo: <b>{dongHo.ten_phuong_tien_do}</b></p>
//                             </div>
//                         )}
//                         {dongHo.co_so_san_xuat && (
//                             <div className="col-12 col-md-6">
//                                 <p>Nơi sản xuất: <b>{dongHo.co_so_san_xuat}</b></p>
//                             </div>
//                         )}
//                         {dongHo.ma_quan_ly && (
//                             <div className="col-12 col-md-6">
//                                 <p>Mã quản lý: <b>{dongHo.ma_quan_ly}</b></p>
//                             </div>
//                         )}

//                         {(dongHo.sensor || dongHo.seri_sensor || dongHo.transitor || dongHo.seri_chi_thi)
//                             && <div className="col-12 row mb-3">
//                                 <p className="m-0">Kiểu sản xuất:</p>
//                                 <div className="col-12 col-sm-6 row m-0 px-3">
//                                     <p>{(dongHo.sensor) && <>Kiểu sensor: <b>{dongHo.sensor}</b></>}</p>
//                                     <p>{(dongHo.transitor) && <>Kiểu chỉ thị: <b>{dongHo.transitor}</b></>}</p>
//                                 </div>
//                                 <div className="col-12 col-sm-6 row m-0 px-3">
//                                     <p>{(dongHo.seri_sensor) && <>Serial sensor: <b>{dongHo.seri_sensor}</b></>}</p>
//                                     <p>{(dongHo.seri_chi_thi) && <>Serial chỉ thị: <b>{dongHo.seri_chi_thi}</b></>}</p>
//                                 </div>
//                             </div>
//                         }
//                     </div>
//                     {(dongHo.dn || dongHo.q3 || dongHo.ccx || dongHo.k_factor)
//                         && <div className="row mb-3">
//                             <div className="col-12 col-md-4">
//                                 <span>Đặc trưng kỹ thuật đo lường:</span>
//                             </div>
//                             <div className="col-12 col-md-8 px-4 px-md-0">
//                                 <ul className="list-unstyled m-0 p-0">
//                                     {dongHo.dn && (
//                                         <li>- Đường kính danh định: <b>DN = {dongHo.dn}</b> mm</li>
//                                     )}
//                                     {(dongHo.q3 || dongHo.qn) && (
//                                         <li>- Lưu lượng danh định: {dongHo.q3 ? <b>Q3 = {dongHo.q3}</b> : <b>Qn = {dongHo.qn}</b>} m<sup>3</sup>/h</li>
//                                     )}
//                                     {dongHo.ccx && (
//                                         <li>- Cấp chính xác: <b>{dongHo.ccx}</b></li>
//                                     )}
//                                     {dongHo.k_factor && (
//                                         <li>- Hệ số K: <b>{dongHo.k_factor}</b></li>
//                                     )}
//                                 </ul>
//                             </div>
//                         </div>}
//                     {dongHo.noi_su_dung && (
//                         <div className="row mb-3">
//                             <p>Cơ sở sử dụng: <b>{dongHo.noi_su_dung}</b></p>
//                         </div>
//                     )}
//                     {(dongHo.phuong_phap_thuc_hien || dongHo.chuan_thiet_bi_su_dung) && (
//                         <div className="row mb-3">
//                             {dongHo.phuong_phap_thuc_hien && (
//                                 <p>Phương pháp thực hiện: <b>{dongHo.phuong_phap_thuc_hien}</b></p>
//                             )}
//                             {dongHo.chuan_thiet_bi_su_dung && (
//                                 <p>Chuẩn được sử dụng: <b>{dongHo.chuan_thiet_bi_su_dung}</b></p>
//                             )}
//                         </div>
//                     )}
//                     {(dongHo.so_tem || dongHo.hieu_luc_bien_ban) && (
//                         <div className="row mb-3">
//                             {dongHo.so_tem && (
//                                 <div className="col-6">
//                                     <p>Người thực hiện: <b className="text-uppercase">{dongHo.nguoi_thuc_hien}</b></p>
//                                 </div>
//                             )}
//                             {dongHo.hieu_luc_bien_ban && (
//                                 <div className="col-6">
//                                     <p>Ngày hiệu chuẩn đề nghị: <b>{dayjs(dongHo.hieu_luc_bien_ban).format("DD/MM/YYYY")}</b></p>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                     <div className="w-100 mb-3">
//                         <p className="fs-5 fw-bold text-center text-uppercase m-0">Kết quả:</p>
//                         <div className={`${dtp.wrapper} w-100`}>
//                             <table>
//                                 <thead>
//                                     <tr>
//                                         <th colSpan={2} rowSpan={2}>Q</th>
//                                         <th colSpan={4}>Số chỉ trên đồng hồ</th>
//                                         <th colSpan={4}>Số chỉ trên chuẩn</th>
//                                         <th rowSpan={2}>δ</th>
//                                         <th rowSpan={2}>Mf</th>
//                                         <th rowSpan={2}>Hiệu sai số</th>
//                                     </tr>
//                                     <tr>
//                                         <th>V<sub>1</sub></th>
//                                         <th>V<sub>2</sub></th>
//                                         <th>V<sub>đh</sub></th>
//                                         <th>T</th>
//                                         <th>V<sub>c1</sub></th>
//                                         <th>V<sub>c2</sub></th>
//                                         <th>V<sub>c</sub></th>
//                                         <th>T</th>
//                                     </tr>
//                                     <tr>
//                                         <td colSpan={2}>m<sup>3</sup>/h</td>
//                                         <td>Lít</td>
//                                         <td>Lít</td>
//                                         <td>Lít</td>
//                                         <td>°C</td>
//                                         <td>Lít</td>
//                                         <td>Lít</td>
//                                         <td>Lít</td>
//                                         <td>°C</td>
//                                         <td>%</td>
//                                         <td>-</td>
//                                         <td>%</td>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {duLieuKiemDinhCacLuuLuong && listKeys && (
//                                         <>
//                                             {renderDulieuLuuLuong()}
//                                         </>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                     {(dongHo.nguoi_thuc_hien || dongHo.ngay_thuc_hien || dongHo.dia_diem_thuc_hien) && (
//                         <div className="row mb-3">
//                             {dongHo.nguoi_thuc_hien && (
//                                 <div className="col-6">
//                                     <p>Người thực hiện: <b className="text-uppercase">{dongHo.nguoi_thuc_hien}</b></p>
//                                 </div>
//                             )}
//                             {dongHo.ngay_thuc_hien && (
//                                 <div className="col-6">
//                                     <p>Ngày thực hiện: <b>{dayjs(dongHo.ngay_thuc_hien).format("DD/MM/YYYY")}</b></p>
//                                 </div>
//                             )}
//                             {dongHo.dia_diem_thuc_hien && (
//                                 <div className="col-12">
//                                     <p>Địa điểm thực hiện: <b>{dongHo.dia_diem_thuc_hien}</b></p>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         ) :
//             (<i>Không có dữ liệu để hiển thị!</i>)}
//     </div>
// }