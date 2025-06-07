import { Metadata } from 'next'
import LoginForm from '@/app/(auth)/login/LoginForm';
import layout from "@styles/scss/ui/auth.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import { ACCESS_LINKS } from '@/lib/system-constant';

export const metadata: Metadata = {
    title: "Đăng nhập",
}

export default function Login() {
    return (
        <>
            <div className='w-100 py-4'>
                <h5 className='text-center text-uppercase'>
                    Đăng nhập
                </h5>
            </div>
            <LoginForm className='w-100'></LoginForm>
            <div className="mt-3 d-flex align-items-center justify-content-center gap-1"><span>Chưa có tài khoản?</span>
                <Link href={ACCESS_LINKS.AUTH_REGISTER.src} className='btn m-0 p-0 '>
                    Đăng ký
                </Link>
            </div>
        </>
    );
}
