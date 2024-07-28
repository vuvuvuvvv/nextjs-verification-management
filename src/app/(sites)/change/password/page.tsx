"use client"

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import reset from "@styles/scss/ui/reset.module.scss";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';
import { resetPassword } from '@/app/api/auth/change/password/route';
import { logout } from '@/app/api/auth/logout/route';
import Head from 'next/head';

interface FormProps {
    className?: string
}

export default function ChangePassword({ className }: FormProps) {
    const [error, setError] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPwNotMatch, setPwNotMatch] = useState(false);

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


    const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.currentTarget.value);
        setPwNotMatch(newPassword != e.currentTarget.value);
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        try {
            const credentials = {
                old_password: oldPassword,
                new_password: newPassword
            }
            const response = await resetPassword(credentials)
            if (response?.status == 200) {
                Swal.fire({
                    title: "Thành công",
                    text: response?.msg + " Hãy đăng nhập lại!",
                    icon: "success",
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
                    logout()
                });

            } else {
                setError(response?.msg);
            }
        } catch (err) {
            console.log(err);
            setError("Có lỗi đã xảy ra. Hãy thử lại!");
        }
    };


    return (
        <>
            <h5 className='text-center'>Đổi mật khẩu</h5>
            <form className={`${className ? className : ""} ${reset['form']}`} onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật khẩu cũ:</label>
                    <input
                        type="password"
                        className="form-control py-2"
                        id="old-password"
                        placeholder='Nhập mật khẩu cũ'
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                    <FontAwesomeIcon className={`${reset['placeholder-icon']}`} icon={faLock}></FontAwesomeIcon>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật khẩu:</label>
                    <input
                        type="password"
                        className="form-control py-2"
                        id="new-password"
                        placeholder='Nhập mật khẩu mới'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <FontAwesomeIcon className={`${reset['placeholder-icon']}`} icon={faLock}></FontAwesomeIcon>
                </div>
                <div className={(!isPwNotMatch) ? "mb-3" : ""}>
                    <label htmlFor="confirm-password" className="form-label">Nhập lại khẩu:</label>
                    <input
                        type="password"
                        className="form-control py-2"
                        id="confirm-password"
                        placeholder='Xác nhận mật khẩu'
                        value={confirmPassword}
                        onChange={(e) => handleChangeConfirmPassword(e)}
                        required
                    />
                    <FontAwesomeIcon className={`${reset['placeholder-icon']}`} icon={faLock}></FontAwesomeIcon>
                </div>
                {(isPwNotMatch) &&
                    (
                        <div className='w-100 mb-3'>
                            <small className='text-danger'>Mật khẩu không khớp</small>
                        </div>
                    )
                }
                <button type="submit" className="btn btn-primary w-100">Đổi mật khẩu</button>
            </form>
        </>
    )
}