import RegisterForm from './RegisterForm';
import layout from "@styles/scss/ui/auth.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Metadata } from 'next'
import Link from 'next/link';
export const metadata: Metadata = {
    title: "Đăng ký",
}

export default function Register() {
    return (
        <>
            <div className='w-100 py-3'>
                <h5 className='text-center text-uppercase'>
                    đăng ký
                </h5>
            </div>
            <RegisterForm className='w-100'></RegisterForm>
            <div className="mt-3 d-flex align-items-center justify-content-center gap-1"><span>Đã có tài khoản?</span>
                <Link href="/login" className='btn m-0 p-0 '>
                    Đăng nhập
                </Link>
            </div>
        </>
    );
}