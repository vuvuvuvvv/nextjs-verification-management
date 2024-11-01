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

export default function ForgotPassword() {
    const [email, setEmail] = useState('');

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

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
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
                Quên mật khẩu
            </h5>
            <p>Vui lòng nhập Email. Đường dẫn đặt lại mật khẩu sẽ được gửi tới Email của bạn.</p>
        </div>
        <form className={`${layout['form']}`} onSubmit={handleSubmit}>
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
            <button aria-label="Gửi" type="submit" disabled={loading || success} className={`btn border-0 p-2 btn-primary w-100 ${loading ? 'bg-grey' : ''}`}>
                {loading ?
                    <FontAwesomeIcon icon={faSpinner} className={`${layout.icon} ${layout.spinning}`}></FontAwesomeIcon>
                    :
                    "Gửi"
                }
            </button>
        </form>
        <div className="mt-3 d-flex align-items-center justify-content-end">
            <Link
                href={ACCESS_LINKS.AUTH_LOGIN.src}
                className='btn m-0 p-0'
                onClick={(e) => {
                    if (loading || success) {
                        e.preventDefault();
                    }
                }}
            >
                Quay lại đăng nhập
            </Link>
        </div>
    </>
}