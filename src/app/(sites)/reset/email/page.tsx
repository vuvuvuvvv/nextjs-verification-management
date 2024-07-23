"use client"

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import reset from "@styles/scss/ui/reset.module.scss";
import { resetEmail } from '@/app/api/auth/reset/email/route';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useUser } from '@/context/user-context';
import Head from 'next/head';

interface FormProps {
    className?: string
}

export default function ResetEmail({ className = "" }: FormProps) { // Default value for className
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { user, updateUser } = useUser();

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

        try {
            const credentials = {
                email: newEmail,
                password: password
            }
            const response = await resetEmail(credentials)
            if (response?.status == 200) {
                updateUser(response.user);
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
    };


    return (
        <>
            <h5 className='text-center'>Đổi Email</h5>
            <form className={`${className} ${reset['form']}`} onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Nhập Email mới:</label>
                    <input
                        type="email"
                        className="form-control py-2"
                        id="new-email"
                        placeholder='Email'
                        spellCheck={false}
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                    />
                    <FontAwesomeIcon className={`${reset['placeholder-icon']}`} icon={faEnvelope}></FontAwesomeIcon>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật khẩu:</label>
                    <input
                        type="password"
                        className="form-control py-2"
                        id="password"
                        placeholder='Nhập mật khẩu'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FontAwesomeIcon className={`${reset['placeholder-icon']}`} icon={faLock}></FontAwesomeIcon>
                </div>
                <button type="submit" className="btn btn-primary w-100">Đổi Email</button>
            </form>
        </>
    )
}