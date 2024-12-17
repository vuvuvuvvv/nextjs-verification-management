"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import layout from "@styles/scss/layouts/auth-layout.module.scss";
import Link from 'next/link';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import { ACCESS_LINKS } from '@lib/system-constant';

export default function VerifyPage({ params }: { params: { token: string } }) {
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

    const handleSubmit = async (event: { preventDefault: () => void; }) => {

        event.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
                headers: {
                    Authorization: `Bearer ${params.token}`
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
            // console.log(err);
            setError("Có lỗi đã xảy ra. Hãy thử lại!");
        }
    }
    return <div className='w-100'>
    </div>
}