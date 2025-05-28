'use client'

import '@styles/scss/ui/general-modal.scss';
import { useReducer, ChangeEvent, useState, useEffect, useRef } from "react";
import { User } from "@lib/types";
import { Modal, Button } from 'react-bootstrap';
import UserAddAutocompleteMUI from "./UserAddAutocompleteMUI";
import { getUsersByPhongBanStatus } from "@/app/api/phongban/route";
import Swal from "sweetalert2";

interface UserInPhongBan {
    user: User;
    is_manager: boolean | null;
    phong_ban_id: number | null;
    phong_ban: string | null;
}

interface ModalAddPhongBanProps {
    show: boolean | null;
    handleClose: () => void;
}

interface State {
    ten_phong_ban: string | null;
    truong_phong: User | null;
    members: User[] | null;
}

const initialState: State = {
    ten_phong_ban: '',
    truong_phong: null,
    members: [],
};

type Action =
    | { type: 'SET_TEN_PHONG_BAN'; payload: string }
    | { type: 'SET_TRUONG_PHONG'; payload: User | null }
    | { type: 'SET_MEMBERS'; payload: User[] | null }
    | { type: 'RESET_STATE' };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_TEN_PHONG_BAN':
            return { ...state, ten_phong_ban: action.payload };
        case 'SET_TRUONG_PHONG':
            return { ...state, truong_phong: action.payload };
        case 'SET_MEMBERS':
            return { ...state, members: action.payload };
        case 'RESET_STATE':
            return initialState;
        default:
            return state;
    }
}

export default function ModalAddPhongBan({ show, handleClose }: ModalAddPhongBanProps) {
    const [membersState, setMembersState] = useState<{
        chua_tham_gia: UserInPhongBan[];
        da_tham_gia: UserInPhongBan[];
    }>({
        chua_tham_gia: [],
        da_tham_gia: [],
    })

    const [error, setError] = useState("");
    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: error,
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
                setError("");
            });
        }
    }, [error]);

    const [filterLoading, setFilterLoading] = useState(true);

    const modalBodyRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const scrollToBottomRef = () => {
        if (modalBodyRef.current && bottomRef.current) {
            const body = modalBodyRef.current;
            const bottom = bottomRef.current;

            const offsetTop = bottom.offsetTop;

            body.scrollTo({
                top: offsetTop,
            });
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        scrollToBottomRef();
    }, [state]);

    const _fetchAllMembers = async () => {
        setFilterLoading(true);
        try {
            const res = await getUsersByPhongBanStatus();
            if (res.status === 200 && res.data && res.data) {
                setMembersState({
                    chua_tham_gia: res.data.chua_tham_gia,
                    da_tham_gia: res.data.da_tham_gia,
                });
            } else {
                setError("Lỗi khi lấy danh sách thành viên.");
            }
        } catch (error) {
            setError("Có lỗi đã xảy ra!");
        } finally {
            setFilterLoading(false);
        }
    }

    useEffect(() => {
        if (show) {
            _fetchAllMembers();
            dispatch({ type: 'RESET_STATE' });
        }
    }, [show]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Dữ liệu gửi đi:", state);
        handleClose();
    };

    return (
        <Modal
            backdrop="static"
            dialogClassName={`modal-phong-ban`}
            show={show == null ? false : show}
            className='pe-0 d-flex justify-content-center'
            onHide={handleClose} scrollable
        >
            <Modal.Header closeButton>
                <Modal.Title>Thêm mới Phòng ban</Modal.Title>
            </Modal.Header>
            <Modal.Body
                style={{ maxHeight: '330px', overflowY: 'auto' }}
                ref={modalBodyRef}
            >
                <div className="flex flex-col items-center justify-center bg-gray-100">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên phòng ban
                        </label>
                        <input
                            type="text"
                            placeholder="Phòng ban"
                            value={state.ten_phong_ban || ''}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                dispatch({ type: 'SET_TEN_PHONG_BAN', payload: e.target.value })
                            }
                            className="w-100 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trưởng phòng
                        </label>
                        <UserAddAutocompleteMUI
                            users={[...membersState.chua_tham_gia, ...membersState.da_tham_gia]}
                            onChange={(selectedIds: number[]) => {
                                const selectedUser = membersState.chua_tham_gia.find(user => user.user.id === selectedIds[0]);
                                dispatch({ type: 'SET_TRUONG_PHONG', payload: selectedUser ? selectedUser.user : null });
                            }}
                            selectedUser={!state.truong_phong ? [] : [state.truong_phong]}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nhân viên phòng ban
                        </label>
                        <UserAddAutocompleteMUI
                            users={[...membersState.chua_tham_gia, ...membersState.da_tham_gia].filter(user => user.user !== state.truong_phong)}
                            isDisabled={!state.truong_phong}
                            isMultiple={true}
                            onChange={(selectedIds: number[]) => {
                                const selectedUsers = membersState.chua_tham_gia
                                    .filter(user => selectedIds.includes(user.user.id))
                                    .map(user => user.user);
                                dispatch({ type: 'SET_MEMBERS', payload: selectedUsers.length > 0 ? selectedUsers : null });
                            }}
                            selectedUser={!state.truong_phong ? [] : [state.truong_phong]}
                        />
                    </div>
                </div>
                <div ref={bottomRef} />
            </Modal.Body>
            <Modal.Footer className={`d-flex align-items-center justify-content-end`}>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="success" onClick={handleSubmit}>
                    Thêm mới
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
