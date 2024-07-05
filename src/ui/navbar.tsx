"use client"
// Import Layout css
import layout from "@styles/scss/ui/navbar.module.scss";

// Import Sidebar
import Sidebar from "@/ui/sidebar";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faKey,
    faMailBulk,
    faSignOut,
    faUser
}
    from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";

import { useUser } from "@/context/user-context";

import React, { useCallback } from "react";
import { logout } from "@/app/api/auth/logout/route";
import { useRouter } from "next/navigation";

interface NavbarProps {
    className?: string,
    // children: Readonly<{ children: React.ReactNode; }>
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
    const router = useRouter();

    const { user, loading, logoutUser } = useUser();

    // console.log(cookieUser.username);

    return (
        <nav id={layout["navbar"]} className={`container-fluid sticky-top ${className ? className : ""}`}>
            <div className="row m-0 p-0 w-100 d-flex align-items-center justify-content-between">
                <div className="col-6 d-flex align-items-center justify-content-start gap-1">
                    <Sidebar></Sidebar>
                    <Link href={"/"} className={"btn m-0 p-0 border-0"}>
                        <div className={`${layout["nav-brand"]} ps-3 ps-xl-0`}>
                            <img src="/images/favicon.png" alt="profileImg" />
                            <span>LocalBrand</span>
                        </div>
                    </Link>
                </div>
                <div className="col-6 d-flex align-items-center justify-content-end">
                    <div className={`dropdown ${layout["dD_account"]}`}>
                        <button className={`${layout["dD_button"]} btn dropdown-toggle`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <FontAwesomeIcon icon={faUser} fontSize={24}></FontAwesomeIcon>
                            <span className={`${layout['p_name']} d-none d-sm-block`}>{user?.username}</span>
                        </button>

                        <div className={`${layout['dD_menu']} dropdown-menu border-0 shadow`}>
                            <div className={`${layout['dD_profile']}`}>
                                <div className={`${layout['box-avt']}`}>
                                    <img src="/images/favicon.png" alt="profileImg" />
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
                            <a href="/reset/password" className={`dropdown-item ${layout['dD_item']}`}>
                                <FontAwesomeIcon icon={faKey}></FontAwesomeIcon>
                                Đổi mật khẩu
                            </a>
                            <a href="/reset/email" className={`dropdown-item ${layout['dD_item']}`}>
                                <FontAwesomeIcon icon={faMailBulk}></FontAwesomeIcon>
                                Đổi Email
                            </a>
                            <button onClick={logoutUser} className={`dropdown-item ${layout['dD_item']}`}>
                                <FontAwesomeIcon icon={faSignOut}></FontAwesomeIcon>
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                    {/* <Dropdown></Dropdown> */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;