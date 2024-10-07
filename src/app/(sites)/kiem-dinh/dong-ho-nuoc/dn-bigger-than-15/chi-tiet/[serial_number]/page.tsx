"use client"

import { getDongHoBySerinumber } from "@/app/api/dongho/route";
import Loading from "@/components/loading";
import { DongHo } from "@lib/types";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import dtp from "@styles/scss/ui/dn-bgt-15.detail.module.scss";

export default function Page({ params }: { params: { serial_number: string } }) {
    const [dongHoData, setDongHoData] = useState<DongHo>();
    const [loading, setLoading] = useState<boolean>(true);
    const fetchCalled = useRef(false);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await getDongHoBySerinumber(params.serial_number);
                setDongHoData(res.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.serial_number]);

    if (loading) {
        return <Loading></Loading>;
    }

    return <div className="w-100 m-0 p-2">
        <title>{dongHoData?.serial_number + " - " + dongHoData?.co_so_san_xuat}</title>
        {dongHoData ? (
            <div className="container bg-white px-4 px-md-5 py-4">
                <div className="row mb-3">
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
                </div>
                <div className="row mb-3">
                    <div className="col-12">
                        <p>Tên đối tượng: <b>{dongHoData.phuong_tien_do || "Chưa có tên đối tượng"}</b></p>
                    </div>
                    <div className="col-12">
                        <p>Nơi sản xuất: <b>{dongHoData.co_so_san_xuat || "Chưa có nơi sản xuất"}</b></p>
                    </div>
                    <div className="col-6">
                        <p>Kiểu sản xuất: <b>{dongHoData.kieu_thiet_bi || "Chưa có kiểu sản xuất"}</b></p>
                    </div>
                    <div className="col-6">
                        <p>Số: <b>{dongHoData.serial_number}</b></p>
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
                    <p className="fs-5 text-center text-uppercase">Kết quả kiểm tra khả năng hoạt động của hệ thống</p>
                    <div className={`${dtp.wrapper} w-100`}>
                        <table>
                            <thead>
                                <tr>
                                    <th className="text-center" colSpan={2} rowSpan={2}>Q</th>
                                    <th className="text-center" colSpan={4}>Số chỉ trên đồng hồ</th>
                                    <th className="text-center" colSpan={2}>Số chỉ trên chuẩn</th>
                                    <th className="text-center" rowSpan={2}>δ</th>
                                    <th className="text-center" rowSpan={2}>Hiệu sai số</th>
                                </tr>
                                <tr>
                                    <th className="text-center">V<sub>1đ</sub></th>
                                    <th className="text-center">V<sub>2đ</sub></th>
                                    <th className="text-center">V<sub>đ</sub></th>
                                    <th className="text-center">T</th>
                                    <th className="text-center">V<sub>C</sub></th>
                                    <th className="text-center">V<sub>T</sub></th>
                                </tr>
                                <tr>
                                    <td className="text-center" colSpan={2}>m<sup>3</sup>/h</td>
                                    <td className="text-center">Lít</td>
                                    <td className="text-center">Lít</td>
                                    <td className="text-center">Lít</td>
                                    <td className="text-center">°C</td>
                                    <td className="text-center">Lít</td>
                                    <td className="text-center">°C</td>
                                    <td className="text-center">%</td>
                                    <td className="text-center">%</td>
                                </tr>
                            </thead>
                            {/* TODO: */}
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Nguyễn Văn A</td>
                                    <td>20</td>
                                    <td>Nam</td>
                                    <td>1</td>
                                    <td>Nguyễn Văn A</td>
                                    <td>20</td>
                                    <td>Nam</td>
                                    <td>20</td>
                                    <td>Nam</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        ) :
            (<i>Không có dữ liệu để hiển thị!</i>)}
    </div>
}