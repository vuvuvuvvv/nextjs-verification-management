"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import layout from "@styles/scss/layouts/auth-layout.module.scss";
import Link from 'next/link';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import { ACCESS_LINKS } from '@/lib/system-constant';

export default function ResetPassword({ params }: { params: { token: string } }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState("");
    const [isPwInvalid, setPwInvalid] = useState(false);
    const [isPwNotMatch, setPwNotMatch] = useState(false);
    const router = useRouter();

    const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.currentTarget.value);
        setPwNotMatch(newPassword != e.currentTarget.value);
    };

    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Mã thông báo đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu đặt lại mật khẩu.",
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
                router.push(ACCESS_LINKS.AUTH_FORGOT_PW.src);
            });
        }
    }, [error]);

    const handleChangeNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.currentTarget.value);
        setPwInvalid(!/^[a-zA-Z0-9]{8,}$/.test(e.currentTarget.value));
    }

    const handleSubmit = async (event: { preventDefault: () => void; }) => {

        event.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset/password`, {
                "new_password": newPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${params.token}` // Include the token in the Authorization header
                }
            });
            if (response?.status == 200 || response?.status == 201) {
                Swal.fire({
                    title: "Thành công",
                    text: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.",
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
                    router.push(ACCESS_LINKS.AUTH_LOGIN.src);
                });

            } else {
                setError(response?.data?.msg);
            }
        } catch (err) {
            setError("Có lỗi đã xảy ra. Hãy thử lại!");
        }
    }
    return <>
        <title>Đặt lại mật khẩu</title>
        <div className='w-100 pt-4'>
            <h5 className='text-center text-uppercase'>
                Quên mật khẩu
            </h5>
            <p>Vui lòng nhập Email. Đường dẫn đặt lại mật khẩu sẽ được gửi tới Email của bạn.</p>
        </div>
        <form className={`${layout['form']}`} onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Mật khẩu:</label>
                <input
                    type="password"
                    className="form-control py-2"
                    id="new-password"
                    placeholder='Nhập mật khẩu mới'
                    value={newPassword}
                    onChange={(e) => handleChangeNewPassword(e)}
                    required
                />
                <FontAwesomeIcon className={`${layout['placeholder-icon']}`} icon={faLock}></FontAwesomeIcon>
            </div>

            {(newPassword != "" && isPwInvalid) &&
                (
                    <div className='w-100 mb-3'>
                        <small className='text-danger'>Mật khẩu tối thiểu 8 ký tự và không bao gồm ký tự đặc biệt</small>
                    </div>
                )
            }

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
                <FontAwesomeIcon className={`${layout['placeholder-icon']}`} icon={faLock}></FontAwesomeIcon>
            </div>
            {(isPwNotMatch) &&
                (
                    <div className='w-100 mb-3'>
                        <small className='text-danger'>Mật khẩu không khớp</small>
                    </div>
                )
            }
            <button aria-label="Đổi mật khẩu" type="submit" className="btn btn-primary w-100">Đổi mật khẩu</button>
        </form>
        <div className="mt-3 d-flex align-items-center justify-content-end">
            <Link href={ACCESS_LINKS.AUTH_LOGIN.src} className='btn m-0 p-0 '>
                Quay lại đăng nhập
            </Link>
        </div>
    </>
}