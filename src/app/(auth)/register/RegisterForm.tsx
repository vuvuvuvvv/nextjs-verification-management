"use client"

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import layout from "@styles/scss/layouts/auth-layout.module.scss";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import { register } from '@/app/api/auth/register/route';

import { RegisterCredentials } from '@lib/types';

interface FormProps {
    className?: string
}


export default function RegisterForm({ className }: FormProps) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [response, setResponse] = useState(null);

    const [error, setError] = useState('');
    const [isPwNotMatch, setPwNotMatch] = useState(false);
    const router = useRouter();

    useEffect(() => {
        console.log(response);
    }, [response]);

    const closeAlert = () => {
        setError("");
    }


    const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.currentTarget.value);
        setPwNotMatch(password != e.currentTarget.value);
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (!isPwNotMatch) {
            setError('');

            const credentials : RegisterCredentials = {username, password, email}
            try {
                const response = await register(credentials)
                if (response.status == 200) {
                    router.push('/');
                    setResponse(response);
                } else {
                    setResponse(response);
                    setError(response.msg);
                }
            } catch (err) {
                console.log(err);
                setError("Something went wrong! Please try again.");
            }
        }
    };

    return (
        <form className={className ? className : ""} onSubmit={handleSubmit}>
            {error &&
                <div className="alert alert-danger w-100 alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" onClick={closeAlert} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            }
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Tên đăng nhập:</label>
                <input
                    type="text"
                    className="form-control py-2"
                    id="username"
                    placeholder='Tên đăng nhập'
                    spellCheck={false}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <FontAwesomeIcon className={`${layout['placeholder-icon']}`} icon={faUser}></FontAwesomeIcon>
            </div>
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
                <FontAwesomeIcon className={`${layout['placeholder-icon']}`} icon={faLock}></FontAwesomeIcon>
            </div>
            <div className={(!isPwNotMatch) ? "mb-3" : ""}>
                <label htmlFor="confirm-password" className="form-label">Nhập lại khẩu:</label>
                <input
                    type="password"
                    className="form-control py-2"
                    id="confirm-password"
                    placeholder='Nhập lại mật khẩu'
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
            <button type="submit" className="btn btn-primary w-100">Đăng ký</button>
        </form>
    );
}
