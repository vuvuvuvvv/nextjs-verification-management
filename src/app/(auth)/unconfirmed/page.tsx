"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import layout from "@styles/scss/layouts/auth-layout.module.scss";

import Link from 'next/link';
import Swal from 'sweetalert2';
import { requestPasswordResetToken } from '@/app/api/auth/request-password-reset-token/route';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ACCESS_LINKS } from '@lib/system-constant';
import { useUser } from '@/context/AppContext';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const { user } = useUser();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

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

    const handleResendVericationEmail = async () => {
        setError("");
        setLoading(true);
        try {
            const response = await requestPasswordResetToken(email);
            if (response?.status == 200 || response?.status == 201) {
                setSuccess(true);
                Swal.fire({
                    title: "Thành công",
                    text: response?.msg,
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
                setError(response?.msg);
            }
        } catch (err) {
            // console.log(err);
            setError("Có lỗi đã xảy ra. Hãy thử lại!");
        } finally {
            setLoading(false);
        }
    }


    return <>
        <div className='w-100 pt-4'>
            <h5 className='text-center text-uppercase'>
                Chưa xác thực
            </h5>
            <p>Xin chào{(" " + user?.fullname) || ""}, Bạn chưa xác nhận tài khoản của mình.</p>
            <p>Chúng tôi đã gửi đến bạn email có chứa liên kết xác thực tài khoản. Hãy kiểm tra.</p>
            <p>Cần một mã xác thực khác? <span className='btn bg-main-blue'>Gửi lại</span></p>
        </div>
    </>
}