"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import layout from "@styles/scss/layouts/auth-layout.module.scss";

import Link from 'next/link';
import Swal from 'sweetalert2';
import { requestPasswordResetToken } from '@/app/api/auth/request-password-reset-token/route';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');

    const [error, setError] = useState("");
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

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setError("");

        try {
            const response = await requestPasswordResetToken(email);
            if (response?.status == 200) {
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
                    router.push('/');
                });

            } else {
                setError(response?.msg);
            }
        } catch (err) {
            console.log(err);
            setError("Có lỗi đã xảy ra. Hãy thử lại!");
        }
    }


    return <>
        <div className='w-100 py-4'>
            <h5 className='text-center text-uppercase'>
                Quên mật khẩu
            </h5>
            <p>Vui lòng nhập Email. Đường dẫn đặt lại mật khẩu sẽ được gửi tới Email của bạn.</p>
        </div>
        <form className={``} onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Email:</label>
                <input
                    type="email"
                    className="form-control py-2"
                    id="email"
                    placeholder='Email'
                    spellCheck={false}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <FontAwesomeIcon className={`${layout['placeholder-icon']}`} icon={faEnvelope}></FontAwesomeIcon>
            </div>
            <button type="submit" className="btn btn-primary w-100">Gửi</button>
        </form>
        <div className="mt-3 d-flex align-items-center justify-content-end">
            <Link href="/login" className='btn m-0 p-0 '>
                Quay lại đăng nhập
            </Link>
        </div>
    </>
}