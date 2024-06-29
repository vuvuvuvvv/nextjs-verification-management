"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import layout from "@styles/scss/layouts/auth-layout.module.scss";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';

import { login } from '@/app/api/auth/login/route';

import { LoginCredentials } from '@lib/types';

interface FormProps {
    className?: string
}


export default function LoginForm({ className }: FormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [response, setResponse] = useState(null);

    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (response) {
            console.log(response);
        }
    }, [response]);

    const closeAlert = () => {
        setError("");
    }

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setError("");

        const credentials: LoginCredentials = { username, password };

        try {
            const response = await login(credentials);
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
    };

    return (
        <form className={(className) ? className : ""} onSubmit={handleSubmit}>
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
                <label htmlFor="password" className="form-label">Mật khẩu:</label>
                <input
                    type="text"
                    className="form-control py-2"
                    id="password"
                    placeholder='Nhập mật khẩu'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <FontAwesomeIcon className={`${layout['placeholder-icon']}`} icon={faLock}></FontAwesomeIcon>
            </div>
            <div className="mb-3 d-flex align-items-center justify-content-between">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                    <label className="form-check-label" htmlFor="defaultCheck1">
                        Nhớ tài khoản
                    </label>
                </div>
                <Link href="/forgot" className='btn m-0 p-0'>
                    Quên mật khẩu?
                </Link>
            </div>
            <button type="submit" className="btn btn-primary py-2 w-100">Đăng nhập</button>
        </form>
    );
}
