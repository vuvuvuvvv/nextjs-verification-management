"use client"

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useUser } from '@/context/AppContext';
import { requestVerificationToken } from '@/app/api/auth/request-token/route';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/api/auth/logout/route';

export default function UnverifiedPage() {
    const { user, logoutUser } = useUser();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
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
            const response = await requestVerificationToken(user?.email || "");
            if (response?.status == 200 || response?.status == 201) {
                Swal.fire({
                    icon: "success",
                    title: "Thành công!",
                    text: "Đã gửi email! Hãy kiểm tra hòm thư của bạn.",
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


    return <div className='w-100'>
        <h5 className='text-center text-uppercase'>
            Chưa xác thực
        </h5>
        <p style={{ textIndent: "20px" }}>Xin chào{(" " + user?.fullname) || ""}. Bạn chưa thực hiện xác thực tài khoản của mình.</p>
        <p style={{ textIndent: "20px" }}>Hãy kiểm tra email chúng tôi gửi đến có chứa mã xác thực tài khoản.</p>
        <div className='mb-3 d-flex w-100 justify-content-between align-items-center'>Cần mã khác? <button className='btn bg-main-blue text-white ms-2' style={{ minWidth: "132px" }} disabled={loading} onClick={handleResendVericationEmail}>
            {loading ?
                <div className='d-flex align-items-center gap-2'>
                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <span role="status ms-1">Đang gửi...</span>
                </div> : "Gửi email"}
        </button></div>
        <div className='w-100 d-flex justify-content-center'>
            <button className='btn bg-light-grey text-white' onClick={logoutUser}>Đăng xuất</button>
        </div>
    </div>
}