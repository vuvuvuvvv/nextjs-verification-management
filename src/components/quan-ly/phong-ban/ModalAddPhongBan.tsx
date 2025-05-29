'use client'

import '@styles/scss/ui/general-modal.scss';
import { useReducer, ChangeEvent, useState, useEffect, useRef } from "react";
import { User, UserInPhongBan } from "@lib/types";
import { Modal, Button } from 'react-bootstrap';
import UserAddAutocompleteMUI from "./UserAddAutocompleteMUI";
import { getUsersByPhongBanStatus, upsertPhongBan } from "@/app/api/phongban/route";
import Swal from "sweetalert2";
import Loading from '@/components/Loading';

interface ModalAddPhongBanProps {
    show: boolean | null;
    handleClose: () => void;
}

interface State {
    ten_phong_ban: string | null;
    truong_phong: UserInPhongBan | null;
    members: UserInPhongBan[];
}

const initialState: State = {
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

    // const _upsertPhongBan = async () => {
    //     if (state.ten_phong_ban && state.truong_phong && state.members.length > 0) {
    //         setFilterLoading(true);
    //         try {
    //             const res = await upsertPhongBan({
    //                 ten_phong_ban: state.ten_phong_ban,
    //                 truong_phong: state.truong_phong,
    //                 members: state.members,
    //             });
    //             return true;
    //         } catch (error) {
    //             setError("Có lỗi đã xảy ra!");
    //         } finally {
    //             setFilterLoading(false);
    //         }
    //         return false;
    //     }
    // }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!state.ten_phong_ban || !state.truong_phong || state.members.length <= 0) {
            setError("Vui lòng điền đầy đủ thông tin phòng ban.");
            return;
        }

        const truongPhongDaThamGia = membersState.da_tham_gia.find(
            (userInPB) =>
                userInPB === state.truong_phong &&
                userInPB.is_manager === true
        );

        const nhanVienDaThamGia = state.members.filter((member) =>
            membersState.da_tham_gia.some(
                (userInPB) => userInPB.user === member.user
            )
        );

        if (truongPhongDaThamGia || nhanVienDaThamGia.length > 0) {
            Swal.fire({
                title: 'Xác nhận phân vị trí mới?',
                text: 'Phát hiện Trưởng phòng hoặc Nhân viên đã có vị trí hiện tại được phân vị trí mới. Các vị trí/phòng ban cũ tương ứng sẽ bị xóa khi cập nhật.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy',
            }).then(async (result) => {
                if (!result.isConfirmed) {
                    return;
                }
            });
        }

        setFilterLoading(true);
        try {
            const res = await upsertPhongBan({
                ten_phong_ban: state.ten_phong_ban,
                truong_phong: state.truong_phong,
                members: state.members,
            });  
            if (res.status == 201) {
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
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
                    handleClose();
                });
            } else {
                setError("Lỗi khi thêm mới phòng ban.");
            }
        } catch (error) {
            setError("Có lỗi đã xảy ra!");
        } finally {
            setFilterLoading(false);
        }
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
                style={{ maxHeight: '330px', overflowY: 'auto', position: 'relative' }}
                ref={modalBodyRef}
            >
                {filterLoading && <Loading />}
                <div className="flex flex-col items-center justify-center bg-gray-100">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên phòng ban {!state.ten_phong_ban && <sup className="text-danger">*</sup>}
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
                            Trưởng phòng {!state.truong_phong && <sup className="text-danger">*</sup>}
                        </label>
                        <UserAddAutocompleteMUI
                            users={[...membersState.chua_tham_gia, ...membersState.da_tham_gia].filter(user => user !== state.truong_phong)}
                            value={state.truong_phong ? [...membersState.chua_tham_gia, ...membersState.da_tham_gia].filter(u => u === state.truong_phong) : []}
                            onChange={(selectedIds: number[]) => {
                                const selectedUser = ([...membersState.chua_tham_gia, ...membersState.da_tham_gia]).find(user => user.user.id === selectedIds[0]);
                                dispatch({ type: 'SET_TRUONG_PHONG', payload: selectedUser ? selectedUser : null });

                                if (selectedUser && state.members.includes(selectedUser)) {
                                    const updatedMembers = state.members.filter(member => member !== selectedUser);
                                    dispatch({ type: 'SET_MEMBERS', payload: updatedMembers });
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nhân viên phòng ban {state.members.length <= 0 && <sup className="text-danger">*</sup>}
                        </label>
                        <UserAddAutocompleteMUI
                            users={[...membersState.chua_tham_gia, ...membersState.da_tham_gia].filter(user => user !== state.truong_phong)}
                            isDisabled={!state.truong_phong}
                            isMultiple={true}
                            value={
                                state.members.map(mem => {
                                    return ([...membersState.chua_tham_gia, ...membersState.da_tham_gia])
                                        .find(user => user.user.id === mem.user.id);
                                }).filter(Boolean) as UserInPhongBan[]
                            }
                            onChange={(selectedIds: number[]) => {
                                const selectedUsers = ([...membersState.chua_tham_gia, ...membersState.da_tham_gia].filter(user => user !== state.truong_phong))
                                    .filter(user => selectedIds.includes(user.user.id))
                                    .map(user => user);
                                dispatch({ type: 'SET_MEMBERS', payload: selectedUsers.length > 0 ? selectedUsers : [] });
                            }}
                        // selectedUser={!state.members ? [] : [...state.members]}
                        />
                    </div>
                </div>
                <div ref={bottomRef} />
            </Modal.Body>
            <Modal.Footer className={`d-flex align-items-center justify-content-end`}>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="success" disabled={!state.ten_phong_ban || !state.truong_phong || state.members.length <= 0} onClick={handleSubmit}>
                    Thêm mới
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
