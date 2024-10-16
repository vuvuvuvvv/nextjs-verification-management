"use client"

import { getDongHoById } from "@/app/api/dongho/route";
const Loading = dynamic(() => import('@/components/loading'), { ssr: false });
import { DongHo, DuLieuChayDongHo } from "@lib/types";
import dayjs from "dayjs";
import { Fragment, useEffect, useRef, useState } from "react";
import dtp from "@styles/scss/ui/dn-bgt-15.detail.module.scss";
import { getSaiSoDongHo } from "@lib/system-function";
import dynamic from "next/dynamic";

export default function Page({ params }: { params: { id: string } }) {
    const [dongHoData, setDongHoData] = useState<DongHo>();
    const [duLieuKiemDinhCacLuuLuong, setDuLieuKiemDinhCacLuuLuong] = useState<DuLieuChayDongHo>();
    const [ketQua, setKetQua] = useState<string>("");
    const [hieuSaiSo, setFormHieuSaiSo] = useState<{ hss: number | null }[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const fetchCalled = useRef(false);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await getDongHoById(params.id);
                // console.log("res: ", res?.data);
                setDongHoData(res?.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    useEffect(() => {
        if (dongHoData) {
            const duLieuKiemDinh = dongHoData.du_lieu_kiem_dinh as { du_lieu?: DuLieuChayDongHo };
            if (duLieuKiemDinh?.du_lieu) { // Optional chaining
                const dlKiemDinh = duLieuKiemDinh.du_lieu;
                setDuLieuKiemDinhCacLuuLuong(dlKiemDinh);
            }
            const duLieuHSS = dongHoData.du_lieu_kiem_dinh as { hieu_sai_so?: { hss: number | null }[] };
            if (duLieuHSS?.hieu_sai_so) { // Optional chaining
                const dlHSS = duLieuHSS.hieu_sai_so;
                // Reverse array HSS
                setFormHieuSaiSo(dlHSS.reverse());
            }
            const duLieuKetQua = dongHoData.du_lieu_kiem_dinh as { ket_qua?: boolean } | null;
            if (duLieuKetQua != null) {
                setKetQua(duLieuKetQua ? "Đạt" : "Không đạt");
            }
        }
    }, [dongHoData]);

    if (loading) {
        return <Loading></Loading>;
    }

    return <div className="w-100 m-0 p-2">
        <title>{dongHoData?.ten_dong_ho}</title>
        {dongHoData ? (
            <div className="container bg-white px-4 px-md-5 py-4">
                {/* <div className="row mb-3">
                    <div className="col-6">
                        <p className="text-center fs-5">
                            CÔNG TY CỔ PHẦN<br />
                            CÔNG NGHỆ VÀ THƯƠNG MẠI FMS
                        </p>
                    </div>
                    <div className="col-6">
                        <p className="text-center fs-5">
                            BIÊN BẢN KIỂM ĐỊNH<br />
                            <b className="fs-5">Số: {dongHoData.so_giay_chung_nhan || "Chưa có số giấy chứng nhận"}</b>
                        </p>
                    </div>
                </div> */}
                <div className="row mb-3">
                    <div className="col-12">
                        <p>Số: <b>{dongHoData.so_giay_chung_nhan || "Chưa có số giấy chứng nhận"}</b></p>
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
                    <p>1. Khả năng hoạt động: <b>{ketQua}</b></p>
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
                                                    return (
                                                        <Fragment key={key + index}>
                                                            {
                                                                Object.entries(value.lan_chay).map(([keyLanChay, valueLanChay], indexLanChay) => {
                                                                    jsxStart = <></>
                                                                    jsxEnd = <></>
                                                                    if (indexHead) {
                                                                        jsxStart = <>
                                                                            <td rowSpan={Object.keys(value.lan_chay).length}>{key}</td>
                                                                            <td rowSpan={Object.keys(value.lan_chay).length}>{value.value}</td>
                                                                        </>;
                                                                        const hss = hieuSaiSo ? hieuSaiSo.reverse()[index].hss : 0;
                                                                        jsxEnd = <>
                                                                            <td rowSpan={Object.keys(value.lan_chay).length}>{hss}</td>
                                                                        </>
                                                                        indexHead = false;
                                                                    }

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
        ) :
            (<i>Không có dữ liệu để hiển thị!</i>)}
    </div>
}