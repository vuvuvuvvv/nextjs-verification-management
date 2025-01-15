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
    faCertificate,
    faPeopleArrows,
    faFileExport
}
    from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';

import Offcanvas from 'react-bootstrap/Offcanvas';

import sb from "@styles/scss/ui/sidebar.module.scss";
import Link from 'next/link';
import { SideLink } from '@lib/types';
import Loading from './Loading';
import { ACCESS_LINKS } from '@lib/system-constant';
import { useUser } from '@/context/AppContext';

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
        title: ACCESS_LINKS.HOME.title,
        icon: faHome,
        href: ACCESS_LINKS.HOME.src
    },
    {
        title: "Kiểm định",
        icon: faEdit,
        children: [
            { title: ACCESS_LINKS.DHN.title, href: ACCESS_LINKS.DHN.src, icon: faClock },
            { title: ACCESS_LINKS.PDM.title, href: ACCESS_LINKS.PDM.src, icon: faFileAlt },
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
        title: ACCESS_LINKS.AD_XUAT_BAO_CAO.title,
        icon: faFileExport,
        href: ACCESS_LINKS.AD_XUAT_BAO_CAO.src
    },
    {
        title: ACCESS_LINKS.AD_PHAN_QUYEN.title,
        icon: faPeopleArrows,
        href: ACCESS_LINKS.AD_PHAN_QUYEN.src
    },
]

export default function Sidebar({
    className,
    title
}: SidebarProps) {
    const { isManager } = useUser();
    const [show, setShow] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [collapseState, setCollapseState] = useState<CollapseState>({});
    const pathname = usePathname();
    // const sideLinks = !isManager ? [...siteSideLinks, ...adminSideLinks] : siteSideLinks;
    const sideLinks = [...siteSideLinks, ...adminSideLinks];

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
                    <img src="/images/logo.png" alt="Kiểm định DHT" />
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
                                                        <span className={`${sb["nl-title"]}`}
                                                            style={{ fontSize: "14px" }}>{child.title}
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
                                                    <FontAwesomeIcon icon={child.icon} className={`me-3 ms-1`} />{child.title}
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
        </div>
    </Suspense>
}