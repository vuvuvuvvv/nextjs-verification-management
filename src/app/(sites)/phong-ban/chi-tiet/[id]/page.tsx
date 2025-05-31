"use client";

import { getPhongBanById } from "@/app/api/phongban/route";
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


const Loading = dynamic(() => import("@/components/Loading"));

export default function DetailPhongBanPage({ params }: { params: { id: number } }) {
    const [phongBanData, setPhongBanData] = useState<PhongBan>();
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState<User[]>([]);
    const [deletingMode, setDeletingMode] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState({ fullname: "", email: "", username: "" });

    const [currentPage, setCurrentPage] = useState(1);
    const membersPerPage = 5;

    const fetchCalled = useRef(false);

    useEffect(() => {
        if (fetchCalled.current) return;
        fetchCalled.current = true;

        const fetchData = async () => {
            try {
                const res = await getPhongBanById(params.id);
                setPhongBanData(res?.data);
                setMembers(res?.data?.members || []);
            } catch (error) {
                console.error("Error fetching data!");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selected);
        newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
        setSelected(newSelected);
    };

    const toggleSelectAll = () => {
        if (selected.size === currentMembers.length) {
            setSelected(new Set());
        } else {
            const newSet = new Set(currentMembers.map((m) => m.id.toString()));
            setSelected(newSet);
        }
    };

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
            text: "Nhân viên này sẽ bị xóa.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            setMembers((prev) => prev.filter((m) => m.id.toString() !== id));
        }
    };

    const handleAddMember = () => {
        // const newMember: User = {
        //     ...form,
        //     id: Math.random().toString(36).substring(2),
        //     confirmed: 1,
        //     permission: 1,
        //     role: "Member",
        // };
        // setMembers((prev) => [...prev, newMember]);
        // setShowAddModal(false);
        // setForm({ fullname: "", email: "", username: "" });
    };

    // Pagination logic
    const indexOfLast = currentPage * membersPerPage;
    const indexOfFirst = indexOfLast - membersPerPage;
    const currentMembers = members.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(members.length / membersPerPage);

    if (loading || !phongBanData) return <Loading />;

    return (
        <Container fluid className="my-4">
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
                        <Button variant="warning" onClick={() => setShowAddModal(true)}>
                            <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button variant="success" onClick={() => setShowAddModal(true)}>
                            <FontAwesomeIcon icon={faUserPlus} />
                        </Button>
                    </div>
                    <Button variant="danger">
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
                <div className={`m-0 p-0 w-100 w-100 border-bottom-0 ${c_vfml['wrap-process-table']}`}>

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
                                                <Button aria-label="Xem" className={`btn bg-transparent p-1 w-100 text-danger shadow-0`}
                                                    onClick={() => handleSingleDelete(member.id.toString())}>
                                                    <FontAwesomeIcon icon={faTimesCircle}></FontAwesomeIcon>
                                                </Button></div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination className="m-0 px-2 pt-3">
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

            {/* Modal Thêm Nhân Viên */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm nhân viên</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control
                                name="fullname"
                                value={form.fullname}
                                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                name="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                name="username"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleAddMember}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
