"use client"
// Import Layout css
import layout from "@styles/scss/ui/navbar.module.scss";

// import Sidebar from "@/components/ui/sidebar";
const Sidebar = dynamic(() => import("@/components/Sidebar"), {
    ssr: false,
});

const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then(mod => mod.FontAwesomeIcon), {
    ssr: false,
});

import {
    faKey,
    faMailBulk,
    faSignOut,
    faUser
}
    from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";

import { useUser } from "@/context/AppContext";

import React from "react";
import dynamic from "next/dynamic";
import { ACCESS_LINKS } from "@lib/system-constant";
import { getNameOfRole } from "@lib/system-function";

interface NavbarProps {
    className?: string,
    title?: string,
}
const Navbar: React.FC<NavbarProps> = ({ className, title = "Trang kiểm định" }) => {
    const { user, logoutUser } = useUser();

    return (
        <>
            <nav id={layout["navbar"]} className={`container-fluid sticky-top ${className ? className : ""}`}>
                <div className="row m-0 p-0 w-100 d-flex align-items-center justify-content-between">
                    <div className="col-9 d-flex align-items-center justify-content-start gap-1">

                        <Sidebar title={title}></Sidebar>

                        <Link href={"/"} className={"btn m-0 p-0 border-0"}>
                            <div className={`${layout["nav-brand"]} ps-2 ps-xl-0`}>
                                <img src="/images/logo.png" alt="Kiểm định DHT" />
                            </div>
                        </Link>
                        <h5 className={`d-none d-sm-block fw-bold m-0 p-0 ms-2 ${layout['nav-title']}`}>{title}</h5>
                    </div>
                    <div className="col-3 d-flex align-items-center justify-content-end">
                        <div className={`dropdown ${layout["dD_account"]}`}>
                            <button aria-label="Tài khoản" className={`${layout["dD_button"]} btn dropdown-toggle`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <FontAwesomeIcon icon={faUser} fontSize={24}></FontAwesomeIcon>
                                <span className={`${layout['p_name']} d-none d-sm-block`}>{user?.fullname || user?.username || "Unknown"}</span>
                            </button>

                            <div className={`${layout['dD_menu']} dropdown-menu border-0 shadow-sm`}>
                                <div className={`${layout['dD_profile']}`}>
                                    <div className={`${layout['box-info']}`}>
                                        <table>
                                            <tbody>
                                                {user?.fullname && 
                                                <tr className="d-sm-none">
                                                    <th>Tên:</th>
                                                    <td>
                                                        <span className={`${layout['b_name']}`}>{user?.fullname}</span>
                                                    </td>
                                                </tr>
                                                }
                                                {user?.email && <tr>
                                                    <th>Email:</th>
                                                    <td>
                                                        <span className={`${layout['b_email']}`}>{user?.email}</span>
                                                    </td>
                                                </tr>
                                                }
                                                {user?.username && <tr>
                                                    <th>Tài khoản:</th>
                                                    <td>
                                                        <span className={`${layout['b_username']}`}>{user?.username}</span>
                                                    </td>
                                                </tr>
                                                }
                                                {user?.role &&
                                                    <tr>
                                                        <th>Vai trò:</th>
                                                        <td>
                                                            <span className={`${layout['b_role']}`}>{getNameOfRole(user?.role)}</span></td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <hr className="my-2" />

                                <a aria-label="Đổi mật khẩu" href={ACCESS_LINKS.CHANGE_PW.src} className={`dropdown-item ${layout['dD_item']}`}>
                                    <FontAwesomeIcon icon={faKey}></FontAwesomeIcon>
                                    Đổi mật khẩu
                                </a>
                                <a aria-label="Đổi Email" href={ACCESS_LINKS.CHANGE_EMAIL.src} className={`dropdown-item ${layout['dD_item']}`}>
                                    <FontAwesomeIcon icon={faMailBulk}></FontAwesomeIcon>
                                    Đổi Email
                                </a>
                                <button aria-label="Đăng xuất" type="button" onClick={logoutUser} className={`dropdown-item ${layout['dD_item']}`}>
                                    <FontAwesomeIcon icon={faSignOut}></FontAwesomeIcon>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                        {/* <Dropdown></Dropdown> */}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;