"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import layout from "@styles/scss/layouts/auth-layout.module.scss";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import { register } from '@/app/api/auth/register/route';
import Swal from 'sweetalert2';

import { RegisterCredentials } from '@lib/types';

interface FormProps {
    className?: string
}

export default function RegisterForm({ className }: FormProps) {
    const [formState, setFormState] = useState<RegisterCredentials & {
        confirmPassword: string;
        isPwInvalid: boolean;
        isUsernameInvalid: boolean;
        isPwNotMatch: boolean;
    }>({
        username: '',
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
        isPwInvalid: false,
        isUsernameInvalid: false,
        isPwNotMatch: false
    });

    const [error, setError] = useState('');
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormState(prev => {
            const newState = { ...prev, [id]: value };
            if (id === 'password') {
                newState.isPwInvalid = !/^[a-zA-Z0-9]{8,}$/.test(value);
                newState.isPwNotMatch = newState.confirmPassword !== value;
            }
            if (id === 'confirmPassword') {
                newState.isPwNotMatch = newState.password !== value;
            }
            if (id === 'username') {
                newState.isUsernameInvalid = !/^[a-zA-Z0-9]{8,}$/.test(value);
            }
            return newState;
        });
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const { username, fullname, email, password, isPwNotMatch, isUsernameInvalid, isPwInvalid } = formState;
        if (!isPwNotMatch && !isUsernameInvalid && !isPwInvalid) {
            setError('');

            const credentials: RegisterCredentials = { username, fullname, password, email };

            try {
                const response = await register(credentials);
                if (response.status == 201) {
                    Swal.fire({
                        icon: "success",
                        showClass: {
                            popup: `
                              animate__animated
                              animate__fadeInUp
                              animate__faster
                            `
                        },
                        html: "Đăng ký thành công! Đang chuyển hướng về trang chủ.",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        },
                    })
                    window.location.href = "/";
                } else {
                    setError(response.msg);
                }
            } catch (err) {
                setError("Đã có lỗi xảy ra. Vui lòng thử lại!");
            }
        }
    };

    return (
        <form className={className ? className : ""} onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="fullname" className="form-label">Họ tên kiểm định viên:</label>
                <input
                    type="text"
                    className="form-control py-2"
                    id="fullname"
                    placeholder='Tên đầy đủ'
                    spellCheck={false}
                    value={formState.fullname}
                    onChange={handleChange}
                    required
                />
                <FontAwesomeIcon className={`${layout['placeholder-icon']}`} icon={faUser}></FontAwesomeIcon>
            </div>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Tên đăng nhập:</label>
                <input
                    type="text"
                    className="form-control py-2"
                    id="username"
                    placeholder='Tên đăng nhập'
                    spellCheck={false}
                    value={formState.username}
                    onChange={handleChange}
                    required
                />
                <FontAwesomeIcon className={`${layout['placeholder-icon']}`} icon={faUser}></FontAwesomeIcon>
            </div>
            {(formState.username !== "" && formState.isUsernameInvalid) &&
                (
                    <div className='w-1000 mb-3'>
                        <small className='text-danger'>Tối thiểu 8 ký tự viết liền không bao gồm ký tự đặc biệt</small>
                    </div>
                )
            }
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                    type="email"
                    className="form-control py-2"
                    id="email"
                    placeholder='Email'
                    spellCheck={false}
                    value={formState.email}
                    onChange={handleChange}
                    required
                />
                <FontAwesomeIcon className={`${layout['placeholder-icon']}`} icon={faEnvelope}></FontAwesomeIcon>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Mật khẩu:</label>
                <input
                    type="password"
                    className="form-control py-2"
                    id="password"
                    placeholder='Nhập mật khẩu'
                    value={formState.password}
                    onChange={handleChange}
                    required
                />
                <FontAwesomeIcon className={`${layout['placeholder-icon']}`} icon={faLock}></FontAwesomeIcon>
            </div>
            {(formState.password !== "" && formState.isPwInvalid) &&
                (
                    <div className='w-100 mb-3'>
                        <small className='text-danger'>Mật khẩu tối thiểu 8 ký tự và không bao gồm ký tự đặc biệt</small>
                    </div>
                )
            }
            <div className={(!formState.isPwNotMatch) ? "mb-3" : ""}>
                <label htmlFor="confirmPassword" className="form-label">Nhập lại khẩu:</label>
                <input
                    type="password"
                    className="form-control py-2"
                    id="confirmPassword"
                    placeholder='Nhập lại mật khẩu'
                    value={formState.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <FontAwesomeIcon className={`${layout['placeholder-icon']}`} icon={faLock}></FontAwesomeIcon>
            </div>
            {(formState.isPwNotMatch) &&
                (
                    <div className='w-100 mb-3'>
                        <small className='text-danger'>Mật khẩu không khớp</small>
                    </div>
                )
            }
            <button aria-label="Đăng ký" type="submit" className="btn btn-primary w-100">Đăng ký</button>
        </form>
    );
}