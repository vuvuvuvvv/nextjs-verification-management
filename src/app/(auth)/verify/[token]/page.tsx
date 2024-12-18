"use client"

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

import axios from 'axios';
import { ACCESS_LINKS } from '@lib/system-constant';
import { useRef } from 'react';

export default function VerifyPage({ params }: { params: { token: string } }) {
    const fetchedRef = useRef(false);
    const router = useRouter();

    const handleVerify = async () => {
        if (!fetchedRef.current) {
            console.log(`Bearer ${params.token}`);
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {}, {
                    headers: {
                        Authorization: `Bearer ${params.token}`
                    }
                });
                if (response?.status == 200 || response?.status == 201) {
                    const user = response?.data.user;
                    if (user) {
                        Cookies.set('user', JSON.stringify(user));
                        Swal.fire({
                            title: "Thành công",
                            text: "Xác thực thành công!",
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
                            confirmButtonText: "Ok"
                        }).then(() => {
                            router.push(ACCESS_LINKS.HOME.src);
                        });
                    } else {
                        handleErr();
                    }
                }
            } catch (err) {
                handleErr();
            }
            fetchedRef.current = true;
        }
    }

    const handleErr = async () => {
        Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Mã không hợp lệ hoặc đã hết hạn. Hãy thử lại!",
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
            router.push("/error/error-token");
        });
    }

    handleVerify();

    return <div className='py-3 py-md-4 text-blue d-flex justify-content-center'>
        <div className='d-flex align-items-center gap-2'>
            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
            <span role="status ms-1">Đang xác thực...</span>
        </div>
    </div>;
}