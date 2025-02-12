import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { DongHo, DongHoPermission, RoleOption } from '@lib/types';
import Swal from 'sweetalert2';
import { getAvailableRolesOptions, getNameOfRole } from '@lib/system-function';
import Select, { GroupBase } from 'react-select';
import "@styles/scss/ui/modal-dh-permissions-mng.scss";
import { useUser } from '@/context/AppContext';
import { checkDHPByUserInfoAndGroupId, checkDHPByUserInfoAndId, createDongHoPermission, createMultDongHoPermission } from '@/app/api/dongho/route';
import { PERMISSION_VALUES, PERMISSIONS } from '@lib/system-constant';
import Loading from '../Loading';
import { permission } from 'process';

interface ModalMultDongHoPermissionMngProps {
    show: boolean;
    dongHoList: DongHo[];
    handleClose: () => void;
}

export default function ModalMultDongHoPermissionMng({ show, handleClose, dongHoList }: ModalMultDongHoPermissionMngProps) {
    const [selectedRoleOption, setSelectedRoleOption] = useState<Record<string, RoleOption> | null>();
    const { user, isSuperAdmin } = useUser();
    const groupIdRoot = useRef(dongHoList[0]?.group_id || "--");
    const [loading, setLoading] = useState<boolean>(false);
    const [canSave, setCansave] = useState<boolean>(false);
    const [errorUserInfo, setErrorUserInfo] = useState("");
    const [roleErrMsgs, setRoleErrMsgs] = useState<Record<string, string | null>>({});
    const [msgPostErr, setMsgPostErr] = useState("");
    const [userInfo, setUserInfo] = useState<string>("");

    const resetSelectedRole = () => {
        setSelectedRoleOption((prev) => {
            const newSelectedRoleOption = { ...prev };
            dongHoList.forEach((dongHo, index) => {
                if (dongHo.id) {
                    newSelectedRoleOption[dongHo.id] = getAvailableRolesOptions(dongHo?.current_permission || null)[0];
                }
            });
            return newSelectedRoleOption;
        });
    }

    useEffect(() => {
        if (show != null) {
            setCansave(false);
            setErrorUserInfo("");
            resetSelectedRole();
        }
    }, [show]);

    const debounceFieldTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleUserInfo = (value: string) => {
        setUserInfo(value);
        if (debounceFieldTimeoutRef.current) {
            clearTimeout(debounceFieldTimeoutRef.current);
        }
        setLoading(true);
        setMsgPostErr("");
        if (value) {
            value = value.trim();
            if (value == user?.username) {
                setMsgPostErr("Không thể cấp thêm quyền cho bản thân.");
                setCansave(false);
                setLoading(false);
            } else {
                debounceFieldTimeoutRef.current = setTimeout(async () => {
                    try {
                        const res = await checkDHPByUserInfoAndGroupId(value, groupIdRoot.current);
                        if (res?.status == 200 || res?.status == 201) {
                            setCansave(true);
                            resetSelectedRole();
                            setRoleErrMsgs({})
                        } else if (res?.status == 409) {
                            setSelectedRoleOption((prev) => {
                                const newSelectedRoleOption = { ...prev };
                                Object.keys(res.data).map((key) => {
                                    delete newSelectedRoleOption[key];
                                })
                                return newSelectedRoleOption;
                            });
                            setRoleErrMsgs(res.data || {});
                            setCansave(res.data ? true : false);
                        } else {
                            setMsgPostErr(res.msg);
                            setCansave(false);
                        }
                    } catch (error) {
                        setMsgPostErr("Đã có lỗi xảy ra! Hãy thử lại sau.");
                    } finally {
                        setLoading(false);
                    }
                }, 700);
            }
        } else {
            setMsgPostErr("");
            setCansave(false);
            setLoading(false);
            setRoleErrMsgs({});
            setSelectedRoleOption(null);
            resetSelectedRole();
        }
    };

    const handleSave = async () => {
        let permissions = selectedRoleOption ? [...Object.entries(selectedRoleOption).map(([key, val], index) => {
            return { id: key, permission: PERMISSION_VALUES[val.value] }
        })] : [];
        if (permissions.length) {
            setLoading(true);
            try {
                const data = {
                    permissions: permissions,
                    user_info: userInfo.trim()
                }
                const res = await createMultDongHoPermission(data);
                if (res.status == 200 || res.status == 201) {
                    handleCloseModal();
                    Swal.fire({
                        icon: "success",
                        showClass: {
                            popup: `
                                    animate__animated
                                    animate__fadeInUp
                                    animate__faster
                                `
                        },
                        html: "Phân quyền thành công!",
                        allowEscapeKey: false,
                    });
                } else {
                    setMsgPostErr("Đã có lỗi xảy ra! Hãy thử lại sau.")
                }
            } catch (error) {
                setMsgPostErr("Đã có lỗi xảy ra! Hãy thử lại sau.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCloseModal = () => {
        setMsgPostErr("");
        setUserInfo("");
        setSelectedRoleOption(null);
        setRoleErrMsgs({});
        handleClose();
    }

    return (
        <Modal show={show} className={`pe-0 wrap-dh-per-mng-modal wrap-mult-dh-per`} style={{ overflow: "unset", marginTop: "-20px" }} onHide={handleCloseModal} centered
            backdrop="static">
            <Modal.Header closeButton className='pb-1'>
                <Modal.Title>Thêm phân quyền</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ overflow: "unset", padding: "10px 16px" }}>
                <div className={`row m-0 p-0 w-100`}>
                    <div className="col-12 mb-3 px-0">
                        <label className={`w-100`} htmlFor="seri_sensor">
                            Group ID:
                            <input
                                type="text"
                                id="seri_sensor"
                                className="form-control w-100"
                                value={groupIdRoot.current}
                                disabled
                            />
                        </label>
                    </div>
                    <div className="col-12 mb-3 px-0">
                        <label className={`w-100`}>
                            Username hoặc Email:
                            <input
                                type="text"
                                className="form-control w-100 mt-2"
                                placeholder="username / example@gmail.com"
                                spellCheck={false}
                                autoComplete="off"
                                value={userInfo}
                                onChange={(e) => handleUserInfo(e.target.value)}
                            />
                        </label>

                        {errorUserInfo && <small className="text-danger">{errorUserInfo}</small>}
                    </div>
                    {/* <i><small className='fw-light'>* Bạn chỉ có thể phân cho người dùng vai trò thấp hơn bạn</small></i> */}
                </div>
                <div className={`col-12 m-0 mb-2 p-0 w-100}`}>
                    Quyền truy cập:
                    <div className="w-100 m-0 mt-2 overflow-y-auto wrap-roles-select-box position-relative" >
                        {loading && <Loading />}
                        <ul className='w-100 list-unstyled'>

                            {dongHoList.map((dongHo, index) => {
                                let availabelRoleOption = getAvailableRolesOptions(dongHo?.current_permission || null);
                                return <li key={index} className={`w-100 bg-lighter-grey ${(dongHo?.id && roleErrMsgs[dongHo.id]) ? "bg-warning-subtle" : "bg-secondary-subtle"} mb-2 p-2`}>
                                    <label className={`w-100 row m-0 p-0 d-flex align-items-center justify-content-between`} htmlFor="role">
                                        <div className='dh-serial-sensor col-12 col-sm-6 mb-1 mb-sm-0'>{dongHo.seri_sensor || "Không có serial sensor"}</div>
                                        <Select
                                            options={availabelRoleOption as unknown as readonly GroupBase<never>[]}
                                            className="basic-multi-select col-12 col-sm-6"
                                            placeholder="--"
                                            classNamePrefix="select"
                                            id="role"
                                            isDisabled={!isSuperAdmin && !!(roleErrMsgs[dongHo?.id || ""])}
                                            value={dongHo?.id && selectedRoleOption ? (selectedRoleOption[dongHo.id] || null) : availabelRoleOption[0]}
                                            isSearchable
                                            onChange={(selectedOptions: any) => {
                                                if (selectedOptions) {
                                                    const values = selectedOptions.value;
                                                    if (dongHo.id) setSelectedRoleOption((prev) => {
                                                        return {
                                                            ...prev,
                                                            [dongHo.id as string]: selectedOptions
                                                        }
                                                    });
                                                } else {
                                                    setSelectedRoleOption((prev) => {
                                                        let tmp = { ...prev };
                                                        if (dongHo.id) delete tmp[dongHo.id];

                                                        return tmp;

                                                    });
                                                }
                                            }}
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    height: '42px',
                                                    minHeight: '42px',
                                                    borderColor: '#dee2e6 !important',
                                                    boxShadow: 'none !important',
                                                    backgroundColor: (!isSuperAdmin && !!(roleErrMsgs[dongHo?.id || ""])) ? "#e9ecef" : "white",
                                                }),
                                                valueContainer: (provided) => ({
                                                    ...provided,
                                                    height: '42px',
                                                    padding: '0 8px'
                                                }),
                                                input: (provided) => ({
                                                    ...provided,
                                                    margin: '0',
                                                    padding: '0'
                                                }),
                                                indicatorsContainer: (provided) => ({
                                                    ...provided,
                                                    height: '42px',
                                                    display: availabelRoleOption.length == 0 ? "none" : "flex",
                                                }),
                                                menu: (provided) => ({
                                                    ...provided,
                                                    display: availabelRoleOption.length == 0 ? "none" : "",
                                                    maxHeight: "250px",
                                                    zIndex: 1999
                                                }),
                                                menuList: (provided) => ({
                                                    ...provided,
                                                    maxHeight: "250px",
                                                }),
                                                singleValue: (provided, state) => ({
                                                    ...provided,
                                                    color: state.isDisabled ? '#6d6e70' : provided.color,
                                                }),
                                                menuPortal: (provided) => ({ ...provided, zIndex: 9999 })
                                            }}
                                            menuPortalTarget={document.body}
                                            menuPosition="absolute"
                                            menuPlacement="auto"
                                            menuShouldScrollIntoView={false}
                                        />
                                        {dongHo.id && roleErrMsgs[dongHo.id] && <small className='text-secondary mt-1'>*Người dùng đã được phân quyền cho đồng hồ này!</small>}
                                    </label>
                                </li>
                            })}

                        </ul>
                    </div>
                    {msgPostErr &&
                        <div className="alert alert-warning alert-dismissible mt-2 mb-0 d-flex align-items-center justify-content-between" role="alert">
                            {msgPostErr}
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setMsgPostErr("")}></button>
                        </div>
                    }

                </div>

                <div className='d-flex align-items-center justify-content-between py-1'>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant={'success'} style={{ minWidth: "60px" }}
                        disabled={!canSave
                            || (selectedRoleOption && Object.keys(selectedRoleOption).length == 0)
                            || (Object.keys(roleErrMsgs).length == dongHoList.length)}
                        onClick={() => handleSave()}>
                        {loading ?
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div> : "Lưu"}
                    </Button>
                </div>
            </Modal.Body>
        </Modal >
    );
}