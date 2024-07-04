"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome, faBars, faSearch, faImage,
    faFileAlt, faEdit, faCog, faSignOutAlt,
    faTimes, faUserFriends, faCaretDown, faCaretUp,
    faQrcode, faComment, faSlidersH,
    faFile,
    faCertificate,
    faTint,
    faWind,
    faWeight,
    faClock,
    faCaretLeft,
    faCaretRight
}
    from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';

import sb from "@styles/scss/ui/sidebar.module.scss";
import Link from 'next/link';

interface SidebarProps {
    // "?" can be undefind
    className?: string;
}

interface CollapseState {
    [key: number | string]: boolean;
};

export default function Sidebar({
    className
}: SidebarProps) {
    const [show, setShow] = useState(false);

    const [collapseState, setCollapseState] = useState<CollapseState>({});

    const toggleOpen = () => {
        setShow(!show);
    }

    const toggleCollapse = (id: number) => {
        setCollapseState(prevState => ({
            [id]: !prevState[id]
        }));
    };

    return <>
        <button className={`bg-transparent d-xl-none`} onClick={toggleOpen}>
            <FontAwesomeIcon icon={faBars} fontSize={24}></FontAwesomeIcon>
        </button>
        {show && (
            <div className={`${sb['sb-backdrop']}`} onClick={() => setShow(!show)}></div>
        )}
        <div className={`${sb['wrap-sidebar']} ${className ? className : ""} ${show ? sb["sb-show"] : ""}`}>
            <div className={`${sb['sb-header']}`}>
                <Offcanvas.Title className={sb['sb-title']}>
                    <img src="/images/favicon.png" alt="profileImg" />
                    Sidebar
                </Offcanvas.Title>
                <button onClick={toggleOpen} className={`btn ${''}`}>
                    <FontAwesomeIcon icon={faTimes} fontSize={24}></FontAwesomeIcon>
                </button>
            </div>
            <div className={`${sb['sb-body']}`}>
                {/* <div className={`${sb['nav-profile']}`}>
                    <span>
                        <FontAwesomeIcon icon={faSearch} fontSize={20}></FontAwesomeIcon>
                    </span>
                    <input type="text" placeholder="Search..." />
                </div> */}

                {/* <div className={`${sb['nav-search']}`}>
                    <span>
                        <FontAwesomeIcon icon={faSearch} fontSize={20}></FontAwesomeIcon>
                    </span>
                    <input type="text" placeholder="Search..." />
                </div> */}

                <ul className={`w-100 ${sb['nav-menu']}`}>
                    <li className={`${sb['nav-item']}`}>
                        <Link href={"/"} className={`btn ${sb['nav-link']}`}>
                            <span className={`${sb['nl-icon']}`}>
                                <FontAwesomeIcon icon={faHome} />
                            </span>
                            <span className={sb["nl-title"]}>Trang chủ</span>
                        </Link>
                    </li>
                    <li className={`${sb['nav-item']}`}>
                        <Link href={"#"} className={`btn ${sb['nav-link']}`}>
                            <span className={`${sb['nl-icon']}`}>
                                <FontAwesomeIcon icon={faEdit} />
                            </span>
                            <span className={sb["nl-title"]}>Kiểm định</span>
                        </Link>
                    </li>
                    <li className={`${sb['nav-item']}`}>
                        <button
                            className={`${sb["nav-link"]} btn ${sb['btn-collapse']} ${(collapseState[1]) ? sb['btn-showed'] : ""}`}
                            type="button"
                            onClick={() => toggleCollapse(1)}
                        >
                            <span className={`${sb['nl-icon']}`}>
                                <FontAwesomeIcon icon={faImage} />
                            </span>
                            <span className={`${sb["nl-title"]}`}>Hiệu chuẩn
                                <FontAwesomeIcon className='ms-3 d-none d-md-flex' icon={(collapseState[1]) ? faCaretLeft : faCaretRight} />
                                <FontAwesomeIcon className='ms-3 d-md-none' icon={(collapseState[1]) ? faCaretUp : faCaretDown} />
                            </span>
                        </button>
                        <div className={`${sb['collapse-menu']} ${sb['collapse']} ${collapseState[1] ? sb['show'] : ''}`}>
                            <Link href={"#"} className={`btn ${sb['clp-link']}`}>
                                <FontAwesomeIcon icon={faTint} className={`me-3`} />Đồng hồ nước
                            </Link>
                            <Link href={"#"} className={`btn ${sb['clp-link']}`}>
                                <FontAwesomeIcon icon={faWind} className={`me-3`} />Đồng hồ khí
                            </Link>
                            <Link href={"#"} className={`btn ${sb['clp-link']}`}>
                                <FontAwesomeIcon icon={faClock} className={`me-3`} />Thiết bị đo lưu lượng
                            </Link>
                            <Link href={"#"} className={`btn ${sb['clp-link']}`}>
                                <FontAwesomeIcon icon={faWeight} className={`me-3`} />Thiết bị đo áp suất
                            </Link>
                        </div>
                    </li>
                    <li className={`${sb['nav-item']}`}>
                        <button
                            className={`${sb["nav-link"]} btn ${sb['btn-collapse']} ${(collapseState[2]) ? sb['btn-showed'] : ""}`}
                            type="button"
                            onClick={() => toggleCollapse(2)}
                        >
                            <span className={`${sb['nl-icon']}`}>
                                <FontAwesomeIcon icon={faFileAlt} />
                            </span>
                            <span className={`${sb["nl-title"]}`}>Quản lý chứng từ
                                <FontAwesomeIcon className='ms-3 d-none d-md-flex' icon={(collapseState[2]) ? faCaretLeft : faCaretRight} />
                                <FontAwesomeIcon className='ms-3 d-md-none' icon={(collapseState[2]) ? faCaretUp : faCaretDown} />
                            </span>
                        </button>
                        <div className={`${sb['collapse-menu']} ${sb['collapse']} ${collapseState[2] ? sb['show'] : ''}`}>
                            <Link href={"#"} className={`btn ${sb['clp-link']}`}>
                                <FontAwesomeIcon icon={faFile} className={`me-3`} />Biên bản kiểm định
                            </Link>
                            <Link href={"#"} className={`btn ${sb['clp-link']}`}>
                                <FontAwesomeIcon icon={faCertificate} className={`me-3`} />Giấy chứng nhận hiệu chuẩn
                            </Link>
                        </div>
                    </li>
                    <li className={`${sb['nav-item']}`}>
                        <Link href={"#"} className={`btn ${sb['nav-link']}`}>
                            <span className={`${sb['nl-icon']}`}>
                                <FontAwesomeIcon icon={faComment} />
                            </span>
                            <span className={sb["nl-title"]}>Xuất báo cáo</span>
                        </Link>
                    </li>
                    <li className={`${sb['nav-item']}`}>
                        <Link href={"#"} className={`btn ${sb['nav-link']}`}>
                            <span className={`${sb['nl-icon']}`}>
                                <FontAwesomeIcon icon={faQrcode} />
                            </span>
                            <span className={sb["nl-title"]}>Quét mã QR</span>
                        </Link>
                    </li>
                    <li className={`${sb['nav-item']}`}>
                        <Link href={"#"} className={`btn ${sb['nav-link']}`}>
                            <span className={`${sb['nl-icon']}`}>
                                <FontAwesomeIcon icon={faUserFriends} />
                            </span>
                            <span className={sb["nl-title"]}>Tài khoản</span>
                        </Link>
                    </li>
                    <li className={`${sb['nav-item']}`}>
                        <Link href={"#"} className={`btn ${sb['nav-link']}`}>
                            <span className={`${sb['nl-icon']}`}>
                                <FontAwesomeIcon icon={faCog} />
                            </span>
                            <span className={sb["nl-title"]}>Hướng dẫn sử dụng</span>
                        </Link>
                    </li>
                    <li className={`${sb['nav-item']}`}>
                        <Link href={"#"} className={`btn ${sb['nav-link']}`}>
                            <span className={`${sb['nl-icon']}`}>
                                <FontAwesomeIcon icon={faSlidersH} />
                            </span>
                            <span className={sb["nl-title"]}>Chính sách bảo mật</span>
                        </Link>
                    </li>
                </ul>
            </div>
            {/* <div className={`${sb["sb-footer"]}`}>
                <div className={`${sb['profile']}`}>
                    <img src="/images/favicon.png" alt="profileImg" />
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
    </>
}