"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome, faBars, faImage,
    faFileAlt, faEdit, faCog,
    faTimes, faUserFriends, faCaretDown, faCaretUp,
    faQrcode, faComment, faSlidersH,
    faTint,
    faWind,
    faWeight,
    faClock,
    faCaretLeft,
    faCaretRight,
    faFile,
    faCertificate
}
    from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';

import Offcanvas from 'react-bootstrap/Offcanvas';

import sb from "@styles/scss/ui/sidebar.module.scss";
import Link from 'next/link';
import { SideLink } from '@lib/types';
import Loading from '../loading';

interface SidebarProps {
    // "?" can be undefind
    className?: string;
    title?: string;
}

interface CollapseState {
    [key: number | string]: boolean;
};

const siteSideLinks: SideLink[] = [
    {
        title: "Trang chủ",
        icon: faHome,
        href: "/"
    },
    {
        title: "Kiểm định",
        icon: faEdit,
        children: [
            {
                title: "Đồng hồ",
                icon: faClock,
                children: [
                    { title: "DN > 15 m³/h", href: "/kiem-dinh/dong-ho-nuoc/dn-bigger-than-15", icon: faTint },
                    { title: "DN < 15 m³/h", href: "/kiem-dinh/dong-ho-nuoc/dn-smaller-than-15", icon: faTint },
                ]
            },
            { title: "Phê duyệt mẫu", href: "/kiem-dinh/pdm", icon: faFileAlt },
        ]
    },
    {
        title: "Hiệu chuẩn",
        icon: faImage,
        children: [
            { title: "Đồng hồ nước", href: "#", icon: faTint },
            { title: "Đồng hồ khí", href: "#", icon: faWind },
            { title: "Thiết bị đo lưu lượng", href: "#", icon: faClock },
            { title: "Thiết bị đo áp suất", href: "#", icon: faWeight },
        ]
    },
    {
        title: "Quản lý chứng từ",
        icon: faFileAlt,
        children: [
            { title: "Biên bản kiểm định", href: "#", icon: faFile },
            { title: "Giấy chứng nhận hiệu chuẩn", href: "#", icon: faCertificate },
        ]
    },
    {
        title: "Xuất báo cáo",
        icon: faComment,
        href: "#"
    },
    {
        title: "Quét mã QR",
        icon: faQrcode,
        href: "#"
    },
    {
        title: "Tài khoản",
        icon: faUserFriends,
        href: "#"
    },
    {
        title: "Hướng dẫn sử dụng",
        icon: faCog,
        href: "#"
    },
    {
        title: "Chính sách bảo mật",
        icon: faSlidersH,
        href: "#"
    }
]

const adminSideLinks: SideLink[] = [
    {
        title: "Dashboard",
        icon: faHome,
        href: "/dashboard"
    },
    {
        title: "Quản lý người dùng",
        icon: faUserFriends,
        href: "/dashboard/manage/user"
    },
    {
        title: "Quay lại trang kiểm định",
        icon: faQrcode,
        href: "/"
    },
]

export default function Sidebar({
    className,
    title
}: SidebarProps) {
    const [show, setShow] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [collapseState, setCollapseState] = useState<CollapseState>({});
    const pathname = usePathname();
    const sideLinks = pathname.startsWith("/dashboard") ? adminSideLinks : siteSideLinks;

    const toggleOpen = () => {
        setShow(!show);
        setCollapseState({});
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            setCollapseState({});
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleCollapse = (id: number | string) => {
        setCollapseState(prevState => {
            if (id.toString().includes("-")) {
                return { ...prevState, [id]: !prevState[id] };
            }
            return { [id]: !prevState[id] };
        });
    };

    return <Suspense fallback={<Loading />}>
        <button aria-label="Menu" className={`bg-transparent d-xl-none px-3 ${sb['btn-toggle']}`} onClick={toggleOpen}>
            <FontAwesomeIcon icon={faBars} fontSize={24}></FontAwesomeIcon>
        </button>
        {show && (
            <div className={`${sb['sb-backdrop']}`} onClick={() => setShow(!show)}></div>
        )}
        <div ref={sidebarRef} className={`${sb['wrap-sidebar']} p-0 ${className ? className : ""} ${show ? sb["sb-show"] : ""}`}>
            <div className={`${sb['sb-header']} py-3 border-bottom`}>
                <Offcanvas.Title className={sb['sb-title']}>
                    <img src="/images/logo.png" alt="profileImg" />
                    <h5 className='fw-bold m-0 p-0'>{title ? title : ""}</h5>
                </Offcanvas.Title>
                <button aria-label="Đóng" onClick={toggleOpen} className={`btn border-0 shadow-0 ${''}`}>
                    <FontAwesomeIcon icon={faTimes} fontSize={24}></FontAwesomeIcon>
                </button>
            </div>
            <div className={`${sb['sb-body']}`}>

                <ul className={`w-100 ${sb['nav-menu']}`}>

                    {sideLinks.map((item, index) => {

                        const isActive = item.children?.some(child => 'href' in child && child.href === pathname);
                        return <li className={`${sb['nav-item']}`} key={index}>

                            {item.children ? (
                                <>
                                    <button
                                        aria-label={item.title}
                                        className={`${sb["nav-link"]} btn ${sb['btn-collapse']} ${(collapseState[index]) ? sb['btn-showed'] : ""} ${isActive ? sb['active'] : ""}`}
                                        type="button"
                                        onClick={() => toggleCollapse(index)}
                                    >
                                        <span className={`${sb['nl-icon']}`}>
                                            <FontAwesomeIcon icon={item.icon} />
                                        </span>
                                        <span className={`${sb["nl-title"]}`}>{item.title}
                                            <FontAwesomeIcon className='ms-3 d-none d-xl-flex' icon={(!collapseState[index]) ? faCaretDown : faCaretRight} />
                                            <FontAwesomeIcon className='ms-3 d-xl-none' icon={faCaretDown} />
                                        </span>
                                    </button>
                                    <div className={`${sb['collapse-menu']} ${sb['collapse']} ${collapseState[index] ? sb['show'] : ''}`}>
                                        {item.children.map((child, childIndex) => (
                                            'children' in child ? (
                                                <div key={index + "-" + childIndex}>
                                                    <button
                                                        aria-label={child.title}
                                                        className={`${sb["nav-link"]} p-0 w-100 ${sb["clp-link"]} btn ${sb['btn-collapse']} ${(collapseState[index + "-" + childIndex]) ? sb['btn-showed'] : ""}`}
                                                        type="button"
                                                        onClick={() => toggleCollapse(index + "-" + childIndex)}
                                                    >
                                                        <span className={`${sb['nl-child-icon']}`}>
                                                            <FontAwesomeIcon icon={child.icon} fontSize={14} />
                                                        </span>
                                                        <span className={`${sb["nl-title"]}`}>{child.title}
                                                            <FontAwesomeIcon className='ms-3 d-none d-xl-flex' icon={(!collapseState[index + "-" + childIndex]) ? faCaretDown : faCaretRight} />
                                                            <FontAwesomeIcon className='ms-3 d-xl-none' icon={faCaretDown} />
                                                        </span>
                                                    </button>
                                                    <div className={`${sb['collapse-menu']} w-100 ${sb['collapse']} ${collapseState[index + "-" + childIndex] ? sb['show'] : ''}`}>
                                                        {child.children?.map((grandChild, grandChildIndex) => {
                                                            return <Link href={grandChild.href || "#"} className={`btn ${sb['clp-link']}`} key={index + "-" + childIndex + "-" + grandChildIndex} onClick={toggleOpen}>
                                                                <FontAwesomeIcon icon={grandChild.icon} className={`me-3`} />{grandChild.title}
                                                            </Link>
                                                        })}

                                                    </div>
                                                </div>
                                            ) : (
                                                <Link href={child.href || "#"} className={`btn ${sb['clp-link']}`} key={index + "-" + childIndex} onClick={toggleOpen}>
                                                    <FontAwesomeIcon icon={child.icon} className={`me-3`} />{child.title}
                                                </Link>
                                            )
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link href={item.href || "#"} className={`btn ${sb['nav-link']} ${item.href == pathname ? sb['active'] : ""}`} onClick={toggleOpen}>
                                    <span className={`${sb['nl-icon']}`}>
                                        <FontAwesomeIcon icon={item.icon} />
                                    </span>
                                    <span className={sb["nl-title"]}>{item.title}</span>
                                </Link>
                            )}

                        </li>
                    })}

                </ul>
            </div>

            {/* <div className={`${sb["sb-footer"]}`}>
                <div className={`${sb['profile']}`}>
                    <img src="/images/logo.png" alt="profileImg" />
                    <div className={sb["name_job"]}>
                        <div className={sb["name"]}>Vuvuvuvvv</div>
                        <div className={sb["job"]}>Admin</div>
                    </div>
                </div>
                <Link
                    href={"#"}
                    className={`btn m-0 p-0`}
                    id={`${sb['btn-logout']}`}
                >
                    <FontAwesomeIcon icon={faSignOutAlt} fontSize={20}></FontAwesomeIcon>
                </Link>
            </div> */}
        </div>
    </Suspense>
}