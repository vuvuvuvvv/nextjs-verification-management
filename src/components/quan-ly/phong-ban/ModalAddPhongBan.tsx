'use client'

import '@styles/scss/ui/general-modal.scss';
import { useReducer, useState, useEffect, useMemo, useRef } from "react";
import { UserInPhongBan } from "@/lib/types";
import { Modal, Button } from 'react-bootstrap';
import UserAddAutocompleteMUI from "./UserAddAutocompleteMUI";
import { getPhongBanById, getUsersByPhongBanStatus, upsertPhongBan } from "@lib/api/phongban";
import Swal from "sweetalert2";
import Loading from '@/components/Loading';


interface State {
    id_phong_ban?: number | null;
    ten_phong_ban: string;
    truong_phong: UserInPhongBan | null;
    members: UserInPhongBan[];
}

const initialState: State = {
    id_phong_ban: null,
    ten_phong_ban: '',
    truong_phong: null,
    members: [],
};

type Action =
    | { type: 'SET_TEN_PHONG_BAN'; payload: string }
    | { type: 'SET_TRUONG_PHONG'; payload: UserInPhongBan | null }
    | { type: 'SET_MEMBERS'; payload: UserInPhongBan[] }
    | { type: 'RESET_STATE' };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_TEN_PHONG_BAN': return { ...state, ten_phong_ban: action.payload };
        case 'SET_TRUONG_PHONG': return { ...state, truong_phong: action.payload };
        case 'SET_MEMBERS': return { ...state, members: action.payload };
        case 'RESET_STATE': return initialState;
        default: return state;
    }
}

interface ModalAddPhongBanProps {
    show: boolean | null;
    handleClose: () => void;
    handleSuccess?: () => void;
    isEditing?: boolean;
    phongBanId?: number;
}

export default function ModalAddPhongBan({ show, handleClose, isEditing = false, phongBanId, handleSuccess }: ModalAddPhongBanProps) {
    const [membersState, setMembersState] = useState<{ chua_tham_gia: UserInPhongBan[]; da_tham_gia: UserInPhongBan[] }>({
        chua_tham_gia: [],
        da_tham_gia: [],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const allUsers = useMemo(() => [...membersState.chua_tham_gia, ...membersState.da_tham_gia], [membersState]);
    const [state, dispatch] = useReducer(reducer, initialState);

    const showError = (message: string) => {
        setError(message);
        Swal.fire({ icon: "error", title: "Lỗi", text: message, confirmButtonColor: "#0980de" }).then(() => setError(""));
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!show) return;

            setLoading(true);
            try {
                // 1. Fetch all users (cả đang có và chưa tham gia phòng ban)
                const userRes = await getUsersByPhongBanStatus();
                if (userRes.status === 200 && userRes.data) {
                    setMembersState(userRes.data);
                } else {
                    showError("Lỗi khi lấy danh sách thành viên.");
                    return;
                }

                // 2. Nếu là chỉnh sửa thì lấy thông tin phòng ban
                if (isEditing && phongBanId) {
                    const phongBanRes = await getPhongBanById(phongBanId);
                    if (phongBanRes.status === 200 && phongBanRes.data) {
                        const phongBan = phongBanRes.data;

                        // Chuyển đổi trưởng phòng và member về dạng UserInPhongBan
                        const truongPhongUser = {
                            user: phongBan.truong_phong,
                            is_manager: true,
                            phong_ban_id: phongBan.id,
                            phong_ban: phongBan.ten_phong_ban,
                        };

                        const members = phongBan.members
                            .filter(m => m.id !== phongBan.truong_phong.id)
                            .map(user => ({
                                user,
                                is_manager: false,
                                phong_ban_id: phongBan.id,
                                phong_ban: phongBan.ten_phong_ban,
                            }));

                        dispatch({ type: 'SET_TEN_PHONG_BAN', payload: phongBan.ten_phong_ban || '' });
                        dispatch({ type: 'SET_TRUONG_PHONG', payload: truongPhongUser });
                        dispatch({ type: 'SET_MEMBERS', payload: members });
                    } else {
                        showError("Không lấy được thông tin phòng ban.");
                    }
                } else {
                    dispatch({ type: 'RESET_STATE' });
                }

            } catch (error) {
                showError("Đã xảy ra lỗi khi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [show]);

    const validateBeforeSubmit = (): boolean => {
        if (!state.ten_phong_ban || !state.truong_phong || state.members.length === 0) {
            showError("Vui lòng điền đầy đủ thông tin phòng ban.");
            return false;
        }
        return true;
    };

    const confirmOverwrite = async (): Promise<boolean> => {
        const { truong_phong, members } = state;
        const existedManager = membersState.da_tham_gia.some(u => u.user.id === truong_phong?.user.id && u.is_manager);
        const existedMembers = members.filter(mem => membersState.da_tham_gia.some(u => u.user.id === mem.user.id));

        if (existedManager || existedMembers.length > 0) {
            const result = await Swal.fire({
                title: 'Xác nhận phân vị trí mới?',
                text: 'Một số thành viên đã có vị trí, phòng ban cũ sẽ bị xóa.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy',
            });
            return result.isConfirmed;
        }
        return true;
    };

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

    useEffect(() => {
        scrollToBottomRef();
    }, [state]);

    const submit = async () => {
        if (!state.ten_phong_ban || !state.truong_phong || state.members.length === 0) {
            showError("Vui lòng điền đầy đủ thông tin phòng ban.");
            return
        }

        setLoading(true);
        try {
            const upsertData: {
                id_phong_ban?: number;
                ten_phong_ban: string;
                truong_phong: UserInPhongBan;
                members: UserInPhongBan[];
            } = {
                ten_phong_ban: state.ten_phong_ban,
                truong_phong: state.truong_phong,
                members: state.members,
            };

            if (isEditing && phongBanId) {
                upsertData.id_phong_ban = phongBanId;
            }

            const res = await upsertPhongBan(upsertData);
            if (res.status === 201 || res.status === 200) {
                Swal.fire({ icon: "success", title: "Thành công", confirmButtonColor: "#0980de" }).then(() => {
                    handleClose();
                    handleSuccess && handleSuccess();
                });
            } else {
                showError("Lỗi khi lưu phòng ban.");
            }
        } catch {
            showError("Có lỗi đã xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateBeforeSubmit()) return;
        if (await confirmOverwrite()) {
            await submit();
        }
    };

    return (
        <Modal backdrop="static" dialogClassName="modal-phong-ban" show={!!show} className="pe-0 d-flex justify-content-center" onHide={handleClose} scrollable>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? "Sửa" : "Thêm mới"} Phòng ban</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ position: 'relative' }}>
                {loading && <Loading />}
                <div ref={modalBodyRef} style={{ maxHeight: '330px', overflowY: 'auto' }} className="bg-gray-100 p-3">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên phòng ban {!state.ten_phong_ban && <sup className="text-danger">*</sup>}
                        </label>
                        <input
                            type="text"
                            placeholder="Phòng ban"
                            value={state.ten_phong_ban}
                            onChange={(e) => dispatch({ type: 'SET_TEN_PHONG_BAN', payload: e.target.value })}
                            className="w-100 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trưởng phòng {!state.truong_phong && <sup className="text-danger">*</sup>}
                        </label>
                        <UserAddAutocompleteMUI
                            users={allUsers.filter(u => u !== state.truong_phong)}
                            value={state.truong_phong ? [state.truong_phong] : []}
                            onChange={(selectedIds: number[]) => {
                                const selectedUser = allUsers.find(user => user.user.id === selectedIds[0]) || null;
                                dispatch({ type: 'SET_TRUONG_PHONG', payload: selectedUser });
                                dispatch({
                                    type: 'SET_MEMBERS',
                                    payload: state.members.filter(member => member.user.id !== selectedUser?.user.id)
                                });
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nhân viên phòng ban {state.members.length === 0 && <sup className="text-danger">*</sup>}
                        </label>
                        <UserAddAutocompleteMUI
                            users={allUsers.filter(u => u.user.id !== state.truong_phong?.user.id)}
                            isDisabled={!state.truong_phong}
                            isMultiple
                            value={state.members}
                            onChange={(selectedIds: number[]) => {
                                const selectedUsers = allUsers.filter(user => selectedIds.includes(user.user.id));
                                dispatch({ type: 'SET_MEMBERS', payload: selectedUsers });
                            }}
                        />
                    </div>

                    <div ref={bottomRef} />
                </div>
                <div className="w-100 m-0 p-2 gap-2 d-flex justify-content-end">
                    <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                    <Button variant="success" disabled={!state.ten_phong_ban || !state.truong_phong || state.members.length === 0} onClick={handleSubmit}>
                        {isEditing ? "Lưu" : "Thêm mới"}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}
