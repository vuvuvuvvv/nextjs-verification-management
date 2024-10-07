"use client"
// Import Layout css
import layout from "@styles/scss/ui/navbar.module.scss";

// Import Sidebar
import Sidebar from "@/components/ui/sidebar";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faKey,
    faMailBulk,
    faSignOut,
    faUser,
    faUsersCog
}
    from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";

import { useUser } from "@/context/app-context";

import React from "react";

interface NavbarProps {
    className?: string,
    title?: string,
}
const Navbar: React.FC<NavbarProps> = ({ className, title = "Trang kiểm định" }) => {
    const { user, logoutUser, isAdmin } = useUser();

    return (
        <>
            <nav id={layout["navbar"]} className={`container-fluid sticky-top ${className ? className : ""}`}>
                <div className="row m-0 p-0 w-100 d-flex align-items-center justify-content-between">
                    <div className="col-9 d-flex align-items-center justify-content-start gap-1">

                        <Sidebar title={title}></Sidebar>

                        <Link href={"/"} className={"btn m-0 p-0 border-0"}>
                            <div className={`${layout["nav-brand"]} ps-2 ps-xl-0`}>
                                <img src="/images/logo.png" alt="profileImg" />
                            </div>
                        </Link>
                        <h5 className={`d-none d-sm-block fw-bold m-0 p-0 ms-2 ${layout['nav-title']}`}>{title}</h5>
                    </div>
                    <div className="col-3 d-flex align-items-center justify-content-end">
                        <div className={`dropdown ${layout["dD_account"]}`}>
                            <button aria-label="Tài khoản" className={`${layout["dD_button"]} btn dropdown-toggle`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <FontAwesomeIcon icon={faUser} fontSize={24}></FontAwesomeIcon>
                                <span className={`${layout['p_name']} d-none d-sm-block`}>{user?.username}</span>
                            </button>

                            <div className={`${layout['dD_menu']} dropdown-menu border-0 shadow-sm`}>
                                <div className={`${layout['dD_profile']}`}>
                                    <div className={`${layout['box-avt']}`}>
                                        <img src="/images/logo.png" alt="profileImg" />
                                    </div>
                                    <div className={`${layout['box-info']}`}>
                                        <table>
                                            <tbody>
                                                <tr className="d-sm-none">
                                                    <th>Name:</th>
                                                    <td>
                                                        <span className={`${layout['b_name']}`}>{user?.username}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Email:</th>
                                                    <td>
                                                        <span className={`${layout['b_email']}`}>{user?.email}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Role:</th>
                                                    <td>
                                                        <span className={`${layout['b_role']}`}>{user?.role}</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <hr className="my-2" />

                                {isAdmin && (
                                    <a aria-label="Trang quản trị" href="/dashboard" className={`dropdown-item ${layout['dD_item']}`}>
                                        <FontAwesomeIcon icon={faUsersCog}></FontAwesomeIcon>
                                        Trang quản trị
                                    </a>
                                )}
                                <a aria-label="Đổi mật khẩu" href="/change/password" className={`dropdown-item ${layout['dD_item']}`}>
                                    <FontAwesomeIcon icon={faKey}></FontAwesomeIcon>
                                    Đổi mật khẩu
                                </a>
                                <a aria-label="Đổi Email" href="/change/email" className={`dropdown-item ${layout['dD_item']}`}>
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