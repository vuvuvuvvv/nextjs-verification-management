import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { DongHo, DongHoPermission } from '@lib/types';
import Swal from 'sweetalert2';
import { getAvailableRolesOptions, getNameOfRole } from '@lib/system-function';
import Select, { GroupBase } from 'react-select';
import "@styles/scss/ui/modal-dh-permissions-mng.scss";
import { useUser } from '@/context/AppContext';
import { checkUserInfoForDongHoPermission, createDongHoPermission } from '@/app/api/dongho/route';
import { PERMISSION_VALUES, PERMISSIONS } from '@lib/system-constant';


interface ModalDongHoPermissionMngProps {
    show: boolean;
    selectedDongHo: DongHo;
    handleClose: () => void;
    isEditing?: boolean;
    currentPer?: DongHoPermission | null;
    refreshData?: () => void;
}

interface DongHoPermissionsMngForm {
    user_info: "",
    role: "",
}

interface RoleOption {
    value: string;
    label: string;
}

export default function ModalDongHoPermissionMng({ show, refreshData, handleClose, selectedDongHo, currentPer, isEditing = false }: ModalDongHoPermissionMngProps) {
    const [isShow, setIsShow] = useState<boolean | null>(null);
    const [selectedRoleOption, setSelectedRoleOption] = useState<RoleOption | null>(null);
    const { user, getCurrentRole } = useUser();
    const availabelRoleOption = useRef(getAvailableRolesOptions(getCurrentRole()));
    const [loading, setLoading] = useState<boolean>(false);
    const [canSave, setCansave] = useState<boolean>(false);
    const [errorUserInfo, setErrorUserInfo] = useState("");
    const [msgPostErr, setMsgPostErr] = useState("");

    const [formValues, setFormValues] = useState<DongHoPermissionsMngForm>({
        user_info: "",
        role: "",
    });

    useEffect(() => {
        if (show != null) {
            const defaultRole = { value: PERMISSIONS.VIEWER, label: getNameOfRole(PERMISSIONS.VIEWER) };
            if (isEditing && currentPer) {
                const roleOption = availabelRoleOption.current.find(option => option.value.toString() == currentPer?.role);
                setSelectedRoleOption(roleOption || defaultRole);
                setFormValues({
                    user_info: currentPer.email as any,
                    role: currentPer.role as any,
                });
                setCansave(true);
            } else {
                setSelectedRoleOption(defaultRole);
                setFormValues({
                    user_info: "",
                    role: "",
                })
                setCansave(false);
            }
            setErrorUserInfo("");
        }
    }, [show]);

    const debounceFieldTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleFormChange = (key: keyof DongHoPermissionsMngForm, value: string) => {
        setFormValues(prevForm => ({
            ...prevForm,
            [key]: value
        }));
        if (debounceFieldTimeoutRef.current) {
            clearTimeout(debounceFieldTimeoutRef.current);
        }

        if (!isEditing && key == "user_info") {
            setLoading(true);
            if (value) {
                value = value.trim();
                if (value == user?.username) {
                    setErrorUserInfo("Không thể cấp thêm quyền cho bản thân.");
                    setCansave(false);
                    setLoading(false);
                } else {
                    debounceFieldTimeoutRef.current = setTimeout(async () => {
                        try {
                            const res = await checkUserInfoForDongHoPermission(value, selectedDongHo);
                            if (res?.status == 200 || res?.status == 201) {
                                setCansave(true);
                                setErrorUserInfo("");
                            } else {
                                setErrorUserInfo(res.msg);
                                setCansave(false);
                            }
                        } catch (error) {
                            setErrorUserInfo("Đã có lỗi xảy ra! Hãy thử lại sau.");
                        } finally {
                            setLoading(false);
                        }
                    }, 500);
                }
            } else {
                setErrorUserInfo("");
                setCansave(false);
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        const data = {
            id: selectedDongHo.id || "",
            user_info: formValues.user_info,
            permission: PERMISSION_VALUES[formValues.role] || 0,
            manager: user?.username || ""
        }

        setLoading(true);
        try {
            const res = await createDongHoPermission(data);
            if (res.status == 200 || res.status == 201) {
                handleClose();
                refreshData?.();
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
    };

    return (
        <Modal show={isShow != null ? isShow : show} className={`pe-0 mt-5 pt-5 wrap-dh-per-mng-modal`} style={{ overflow: "unset" }} onHide={handleClose} scrollable
            backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? "Sửa" : "Thêm"} phân quyền</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ overflow: "unset" }}>
                <div className={`row m-0 p-0 w-100`}>
                    <div className="col-12 mb-3">
                        <label className={`w-100`} htmlFor="seri_sensor">
                            Serial Sensor:
                            <input
                                type="text"
                                id="seri_sensor"
                                className="form-control w-100"
                                value={selectedDongHo?.seri_sensor || ""}
                                disabled
                            />
                        </label>
                    </div>
                    <div className="col-12 mb-3">
                        <label className={`w-100`} htmlFor="user_info">
                            {isEditing ? "Email" : "Username hoặc Email"}:
                            <input
                                type="text"
                                id="user_info"
                                className="form-control w-100"
                                placeholder="username / example@gmail.com"
                                spellCheck={false}
                                value={formValues.user_info}
                                onChange={(e) => handleFormChange('user_info', e.target.value)}
                                disabled={isEditing}
                            />
                        </label>

                        {errorUserInfo && <small className="text-danger">{errorUserInfo}</small>}
                    </div>
                    <div className="col-12 mb-1">
                        <label className={`w-100`} htmlFor="role">
                            Vai trò:
                            <Select
                                options={availabelRoleOption.current as unknown as readonly GroupBase<never>[]}
                                className="basic-multi-select mt-2 w-100"
                                placeholder="--"
                                classNamePrefix="select"
                                id="role"
                                value={selectedRoleOption}
                                isSearchable
                                onChange={(selectedOptions: any) => {
                                    if (selectedOptions) {
                                        const values = selectedOptions.value;
                                        setSelectedRoleOption(selectedOptions);
                                        handleFormChange('role', values);
                                    } else {
                                        setSelectedRoleOption(null);
                                        handleFormChange('role', "");
                                    }
                                }}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        height: '42px',
                                        minHeight: '42px',
                                        borderColor: '#dee2e6 !important',
                                        boxShadow: 'none !important',
                                        backgroundColor: "white",
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
                                        display: availabelRoleOption.current.length == 0 ? "none" : "flex",
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                        display: availabelRoleOption.current.length == 0 ? "none" : "",
                                        maxHeight: "250px",
                                        zIndex: 777
                                    }),
                                    menuList: (provided) => ({
                                        ...provided,
                                        maxHeight: "250px",
                                    }),
                                    singleValue: (provided, state) => ({
                                        ...provided,
                                        color: state.isDisabled ? '#000' : provided.color,
                                    })
                                }}
                            />
                        </label>
                    </div>
                    <i><small className='fw-light'>* Bạn chỉ có thể phân cho người dùng vai trò thấp hơn bạn</small></i>

                    {msgPostErr &&
                        <div className="alert alert-danger alert-dismissible mt-2 mb-0" role="alert">
                            <strong>Lỗi!</strong> {msgPostErr}
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setMsgPostErr("")}></button>
                        </div>
                    }

                </div>

            </Modal.Body>
            <Modal.Footer className='d-flex align-items-center justify-content-between'>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant={'success'} style={{ minWidth: "60px" }} disabled={!canSave} onClick={() => handleSave()}>
                    {loading ?
                        <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div> : (isEditing ? "Sửa" : "Lưu")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}