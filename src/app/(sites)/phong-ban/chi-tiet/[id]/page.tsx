"use client";

import { deleteNhanVienPhongBan, deletePhongBan, getPhongBanById } from "@/app/api/phongban/route";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    Modal,
    Row,
    Table,
    Pagination,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { PhongBan, User } from "@lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faUserPlus, faEye, faTimesCircle, faEdit } from "@fortawesome/free-solid-svg-icons";
import c_vfml from "@styles/scss/components/verification-management-layout.module.scss";
import ModalAddPhongBan from "@/components/quan-ly/phong-ban/ModalAddPhongBan";
import ModalAddNhanVienPhongBan from "@/components/quan-ly/phong-ban/ModalAddNhanVienPhongBan";

import { useRouter } from "next/navigation"; // nếu bạn dùng App Router (Next.js 13+)
import { ACCESS_LINKS } from "@lib/system-constant";


const Loading = dynamic(() => import("@/components/Loading"));

export default function DetailPhongBanPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [phongBanData, setPhongBanData] = useState<PhongBan>();
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState<User[]>([]);
    const [deletingMode, setDeletingMode] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const [showAddNhanVienModal, setShowAddNhanVienModal] = useState(false);
    const [showEditPhongBanModal, setShowEditPhongBanModal] = useState(false);

    const phongBanId = Number(params.id);
    const isParamsReady = !isNaN(phongBanId);

    const [currentPage, setCurrentPage] = useState(1);
    const membersPerPage = 5;

    const fetchCalled = useRef(false);

    const _fetchData = async () => {
        try {
            const res = await getPhongBanById(phongBanId);
            setPhongBanData(res?.data);
            setMembers(res?.data?.members || []);
        } catch (error) {
            console.error("Error fetching data!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        _fetchData();
    }, [params.id]);

    const handleDeleteSelected = async () => {
        const result = await Swal.fire({
            title: "Xác nhận xóa?",
            text: "Những nhân viên này sẽ bị xóa.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            setMembers((prev) => prev.filter((m) => !selected.has(m.id.toString())));
            setSelected(new Set());
            setDeletingMode(false);
        }
    };

    const handleSingleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Xác nhận xóa?",
            text: "Nhân viên này sẽ bị gỡ khỏi phòng ban.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            // Hiển thị loading
            Swal.fire({
                title: "Đang xử lý...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const res = await deleteNhanVienPhongBan(id);

            Swal.close(); // Tắt loading

            if (res.status === 200) {
                await Swal.fire({
                    title: "Đã xóa!",
                    text: res.msg,
                    icon: "success",
                    timer: 3000,
                    showConfirmButton: true,
                });

                _fetchData?.(); // Reload danh sách
            } else {
                await Swal.fire({
                    title: "Lỗi!",
                    text: res.msg || "Xóa thất bại. Vui lòng thử lại.",
                    icon: "error",
                });
            }
        }
    };

    const handleDeletePhongBan = async () => {
        const result = await Swal.fire({
            title: "Xác nhận giải tán?",
            text: "Phòng ban và toàn bộ nhân viên sẽ bị gỡ liên kết.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Giải tán",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: "Đang xử lý...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const res = await deletePhongBan(params.id.toString());

            Swal.close();

            if (res.status === 200 || res.status === 201) {
                await Swal.fire({
                    title: "Thành công!",
                    text: res.msg,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });

                router.push(ACCESS_LINKS.PB_DHN.src);
            } else {
                await Swal.fire({
                    title: "Lỗi!",
                    text: res.msg || "Không thể giải tán phòng ban. Vui lòng thử lại.",
                    icon: "error",
                });
            }
        }
    };

    // Pagination logic
    const indexOfLast = currentPage * membersPerPage;
    const indexOfFirst = indexOfLast - membersPerPage;
    const currentMembers = members.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(members.length / membersPerPage);

    if (loading || !phongBanData) return <Loading />;

    return (
        <Container fluid className="my-4">

            <ModalAddPhongBan
                show={showEditPhongBanModal}
                handleSuccess={() => _fetchData()}
                handleClose={() => setShowEditPhongBanModal(false)}
                isEditing={true}
                phongBanId={phongBanId}
            />

            <ModalAddNhanVienPhongBan
                show={showAddNhanVienModal}
                handleSuccess={() => _fetchData()}
                handleClose={() => setShowAddNhanVienModal(false)}
                exceptPhongBanID={phongBanId}
            />
            <div className="p-2 shadow-sm rounded row w-100 m-0 d-flex bg-white justify-content-between align-items-center mb-3">
                <div className="col-12 col-lg-7 m-0 py-0 d-flex align-items-center mb-3 mb-lg-0">
                    <p className="fs-4" style={{
                        maxWidth: "100%",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                        margin: "0",
                    }}><b className="fs-4">Phòng ban:</b> {phongBanData.ten_phong_ban}</p>
                </div>
                <div className="col-12 col-lg-5 d-flex justify-content-between gap-2 justify-content-lg-end m-0 py-0">
                    <div className="d-flex gap-2">
                        <div className="d-flex gap-2">
                            <Button variant="warning" onClick={() => setShowEditPhongBanModal(true)}>
                                <FontAwesomeIcon icon={faEdit} />
                            </Button>
                            <Button variant="success" onClick={() => setShowAddNhanVienModal(true)}>
                                <FontAwesomeIcon icon={faUserPlus} />
                            </Button>
                        </div>
                    </div>
                    <Button variant="danger" onClick={handleDeletePhongBan}>
                        <FontAwesomeIcon icon={faMinusCircle} className="me-2" />
                        Giải tán
                    </Button>
                </div>
            </div>

            <Row className="mb-4">
                <Col md={6} lg={4}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Header className="text-center">Trưởng phòng</Card.Header>
                        <Card.Body>
                            <p className="m-0"><b className="fs-5">{phongBanData.truong_phong.fullname}</b></p>
                            <small className="m-0">@{phongBanData.truong_phong.username}</small><br />
                            <small className="m-0">{phongBanData.truong_phong.email}</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card className="h-100 border-0 shadow-sm text-center">
                        <Card.Header>Số đồng hồ đã kiểm định</Card.Header>
                        <Card.Body>
                            <span style={{ fontSize: "3rem", fontWeight: "bold" }}>
                                {phongBanData?.dong_hos?.length ?? "--"}
                            </span>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className={`${c_vfml['wraper']} w-100 py-3 mb-3 bg-white w-100 shadow-sm rounded`}>
                <div className={`row m-0 w-100 mb-3 ${c_vfml['search-process']}`}>
                    <label className={`${c_vfml['form-label']}`} htmlFor="kieu_moden">
                        Tìm kiếm:
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập tên hoặc username, email"
                            // value={filterForm.ten_phong_ban ?? ""}
                            onChange={(e) => {
                                const keyword = e.target.value.toLowerCase();
                                const filtered = phongBanData.members.filter(
                                    (m) =>
                                        m.fullname.toLowerCase().includes(keyword) ||
                                        m.username.toLowerCase().includes(keyword)
                                );
                                setMembers(filtered);
                            }}
                        />
                    </label>
                </div>
                <div className={`m-0 mb-3 p-0 w-100 w-100 border-bottom-0 ${c_vfml['wrap-process-table']}`}>

                    <table className={`table table-striped table-bordered table-hover mb-0 ${c_vfml['process-table']}`}>
                        <thead>
                            <tr className={`${c_vfml['table-header']}`}>
                                <th>STT</th>
                                <th>Tên nv</th>
                                <th>username</th>
                                <th>email</th>
                                {!deletingMode && <th></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {currentMembers.map((member, index) => (
                                <tr key={member.id}>
                                    <td>{indexOfFirst + index + 1}</td>
                                    <td>{member.fullname}</td>
                                    <td>{member.username}</td>
                                    <td>{member.email}</td>
                                    {!deletingMode && (
                                        <td style={{ width: "90px" }}>
                                            <div className="w-100 m-0 p-0 d-flex align-items-center justify-content-center">
                                                <button aria-label="Xem" className={`btn border-0 bg-transparent p-1 w-100 text-danger shadow-0`}
                                                    onClick={() => handleSingleDelete(member.id.toString())}>
                                                    <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <small className="px-2 text-muted">
                    <b>{phongBanData.members.length}</b> nhân viên
                </small><br />

                <Pagination className="m-0 px-2 pt-2">
                    {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                            key={i + 1}
                            active={i + 1 === currentPage}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
        </Container>
    );
}
