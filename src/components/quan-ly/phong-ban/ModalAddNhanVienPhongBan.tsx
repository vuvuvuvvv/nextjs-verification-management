'use client'

import '@styles/scss/ui/general-modal.scss';
import { useReducer, useState, useEffect, useRef } from "react";
import { UserInPhongBan } from "@lib/types";
import { Modal, Button } from 'react-bootstrap';
import UserAddAutocompleteMUI from "./UserAddAutocompleteMUI";
import { getUsersByPhongBanStatus, addNhanVienPhongBan } from "@/app/api/phongban/route";
import Swal from "sweetalert2";
import Loading from '@/components/Loading';

interface ModalAddNhanVienPhongBanProps {
    show: boolean | null;
    handleClose: () => void;
    exceptPhongBanID?: number | null;
}

interface State {
    members: UserInPhongBan[];
}

const initialState: State = { members: [] };

type Action =
    | { type: 'SET_MEMBERS'; payload: UserInPhongBan[] }
    | { type: 'RESET_STATE' };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_MEMBERS': return { ...state, members: action.payload };
        case 'RESET_STATE': return initialState;
        default: return state;
    }
}

interface ModalAddNhanVienPhongBanProps {
    show: boolean | null;
    handleClose: () => void;
    handleSuccess?: () => void;
    exceptPhongBanID?: number | null;
}

export default function ModalAddNhanVienPhongBan({ show, handleClose, exceptPhongBanID = null, handleSuccess }: ModalAddNhanVienPhongBanProps) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [usersByStatus, setUsersByStatus] = useState({
        chua_tham_gia: [] as UserInPhongBan[],
        da_tham_gia: [] as UserInPhongBan[],
    });
    const [loading, setLoading] = useState(false);
    const modalBodyRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const allUsers = [...usersByStatus.chua_tham_gia, ...usersByStatus.da_tham_gia];

    useEffect(() => {
        if (show) {
            dispatch({ type: 'RESET_STATE' });
            fetchUsers();
        }
    }, [show]);

    useEffect(() => {
        if (modalBodyRef.current && bottomRef.current) {
            modalBodyRef.current.scrollTo({ top: bottomRef.current.offsetTop });
        }
    }, [state.members]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getUsersByPhongBanStatus(exceptPhongBanID);
            if (res.status === 200 && res.data) {
                setUsersByStatus(res.data);
            } else {
                showError("Lỗi khi lấy danh sách thành viên.");
            }
        } catch {
            showError("Có lỗi đã xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    const showError = (msg: string) => {
        Swal.fire({ icon: "error", title: "Lỗi", text: msg, confirmButtonColor: "#0980de" });
    };

    const showSuccess = async () => {
        const rs = await Swal.fire({
            icon: "success",
            title: "Thành công",
            confirmButtonColor: "#0980de"
        });
        if (rs.isConfirmed) {
            handleSuccess && handleSuccess();
        }
        handleClose();
    };

    const confirmOverwrite = () => {
        return Swal.fire({
            title: 'Xác nhận phân vị trí mới?',
            text: 'Phát hiện Trưởng phòng hoặc Nhân viên đã có vị trí hiện tại được phân vị trí mới. Các vị trí/phòng ban cũ tương ứng sẽ bị xóa khi cập nhật.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
        });
    };

    const handleSubmit = async () => {
        if (state.members.length === 0) return showError("Vui lòng điền đầy đủ thông tin.");

        const overwriteRequired = state.members.some(member =>
            usersByStatus.da_tham_gia.some(
                existing => existing.user.id === member.user.id || existing.is_manager
            )
        );

        const proceed = overwriteRequired ? (await confirmOverwrite()).isConfirmed : true;

        if (!proceed || !exceptPhongBanID) return;

        setLoading(true);
        try {
            const res = await addNhanVienPhongBan({ id: exceptPhongBanID, members: state.members });
            if (res.status === 201) {
                await showSuccess();
            } else {
                showError("Lỗi khi thêm nhân viên phòng ban.");
            }
        } catch {
            showError("Có lỗi đã xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={!!show}
            onHide={handleClose}
            scrollable
            backdrop="static"
            className='pe-0 d-flex justify-content-center'
            dialogClassName='modal-phong-ban'
        >
            <Modal.Header closeButton>
                <Modal.Title>Thêm nhân viên</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ position: 'relative' }}>
                {loading && <Loading />}
                <div
                    ref={modalBodyRef}
                    style={{ maxHeight: '330px', overflowY: 'auto' }}
                    className="bg-gray-100 p-3"
                >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nhân viên phòng ban {state.members.length === 0 && <sup className="text-danger">*</sup>}
                    </label>
                    <UserAddAutocompleteMUI
                        users={allUsers}
                        isMultiple
                        value={state.members.map(m => allUsers.find(u => u.user.id === m.user.id)).filter(Boolean) as UserInPhongBan[]}
                        onChange={(selectedIds: number[]) => {
                            const selected = allUsers.filter(u => selectedIds.includes(u.user.id));
                            dispatch({ type: 'SET_MEMBERS', payload: selected });
                        }}
                    />
                    <div ref={bottomRef} />
                </div>
                <div className='w-100 mt-3 d-flex justify-content-end gap-2 px-2'>
                    <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                    <Button variant="success" disabled={state.members.length === 0} onClick={handleSubmit}>
                        Thêm mới
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}
