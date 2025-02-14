"use client"

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import layout from "@styles/scss/layouts/auth-layout.module.scss";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import { login } from '@/app/api/auth/login/route';
import Swal from 'sweetalert2';
import { LoginCredentials } from '@lib/types';
import { ACCESS_LINKS } from '@lib/system-constant';

interface FormProps {
    className?: string
}

export default function LoginForm({ className }: FormProps) {
    const [credentials, setCredentials] = useState<LoginCredentials>({
        username: '',
        password: '',
        remember: false
    });

    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';

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
            const response = await login(credentials);
            if (response.status == 200 || response.status == 201) {
                Swal.fire({
                    icon: "success",
                    showClass: {
                        popup: `
                          animate__animated
                          animate__fadeInUp
                          animate__faster
                        `
                    },
                    html: "Đăng nhập thành công! Đang chuyển hướng...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                })
                window.location.href = redirectUrl;
            } else if (response.status == 401) {
                setError("Thông tin đăng nhập không chính xác!");
            } else {
                setError(response.msg);
            }
        } catch (err) {
            setError("Đã có lỗi xảy ra. Vui lòng thử lại!");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, checked, type } = e.target;
        setCredentials(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <form className={(className) ? className : ""} onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Tên tài khoản:</label>
                <input
                    type="text"
                    className="form-control py-2"
                    id="username"
                    placeholder='Email hoặc tên đăng nhập'
                    spellCheck={false}
                    value={credentials.username}
                    onChange={handleChange}
                    required
                />
                <FontAwesomeIcon className={`${layout['placeholder-icon']}`} icon={faUser}></FontAwesomeIcon>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Mật khẩu:</label>
                <input
                    type="password"
                    className="form-control py-2"
                    id="password"
                    placeholder='Nhập mật khẩu'
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <FontAwesomeIcon className={`${layout['placeholder-icon']}`} icon={faLock}></FontAwesomeIcon>
            </div>
            <div className="mb-3 d-flex align-items-center justify-content-between">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="remember" checked={credentials.remember} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="remember">
                        Nhớ tài khoản
                    </label>
                </div>
                <Link href={ACCESS_LINKS.AUTH_FORGOT_PW.src} className='btn m-0 p-0'>
                    Quên mật khẩu?
                </Link>
            </div>
            <button aria-label="Đăng nhập" type="submit" className="btn btn-primary py-2 w-100">Đăng nhập</button>
        </form>
    );
}