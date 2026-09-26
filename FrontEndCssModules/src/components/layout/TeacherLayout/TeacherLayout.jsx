import React, { useState } from 'react';
import ClassNames from 'classnames/bind';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faFileCode,
    faChartLine,
    faRightFromBracket,
    faChevronDown,
    faChevronUp,
    faHouse,
    faBell,
    faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../../hooks/useAuth';
import styles from './TeacherLayout.module.css';

const cx = ClassNames.bind(styles);

const SIDEBAR_NAV = [
    {
        label: 'Quản lý sinh viên',
        path: '/teacher/students',
        icon: faUsers,
    },
    {
        label: 'Quản lý bài tập',
        path: '/teacher/problems',
        icon: faFileCode,
    },
    {
        label: 'Thống kê học tập',
        path: '/teacher/analytics',
        icon: faChartLine,
    },
];

export default function TeacherLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className={cx('portal')}>
            {/* ─── Top Bar ─────────────────────────────────────────── */}
            <header className={cx('topBar')}>
                <div className={cx('topBarLeft')}>
                    <img
                        src="https://cdn-001.haui.edu.vn//img/logo-haui-size.png"
                        alt="HaUI Logo"
                        className={cx('topLogo')}
                    />
                    <div className={cx('topTitle')}>
                        <span className={cx('topTitleMain')}>CODE HAUI</span>
                        <span className={cx('topTitleSub')}>CỔNG ĐÀO TẠO & QUẢN LÝ — ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI</span>
                    </div>
                </div>

                <div className={cx('topBarRight')}>
                    <button className={cx('bellBtn')} title="Thông báo hệ thống">
                        <FontAwesomeIcon icon={faBell} />
                        <span className={cx('bellDot')} />
                    </button>

                    <div style={{ position: 'relative' }}>
                        <button className={cx('profileBtn')} onClick={() => setIsProfileOpen(!isProfileOpen)}>
                            <div className={cx('avatarWrap')}>
                                <img
                                    src={
                                        user?.avatar ||
                                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80'
                                    }
                                    alt={user?.name}
                                    className={cx('avatar')}
                                />
                            </div>
                            <div className={cx('profileText')}>
                                <span className={cx('profileName')}>{user?.name || 'TS. Nguyễn Văn Hùng'}</span>
                                <span className={cx('profileId')}>Mã GV: {user?.studentId || 'GV2026'}</span>
                            </div>
                            <FontAwesomeIcon
                                icon={isProfileOpen ? faChevronUp : faChevronDown}
                                className={cx('chevron')}
                            />
                        </button>

                        {isProfileOpen && (
                            <div className={cx('profileDropdown')}>
                                <div className={cx('dropdownInfo')}>
                                    <p className={cx('dropInfoName')}>{user?.name || 'TS. Nguyễn Văn Hùng'}</p>
                                    <p className={cx('dropInfoMeta')}>{user?.department || 'Khoa Công nghệ thông tin'}</p>
                                </div>
                                <Link to="/home" className={cx('dropItem')} onClick={() => setIsProfileOpen(false)}>
                                    <FontAwesomeIcon icon={faHouse} />
                                    Về trang học tập sinh viên
                                </Link>
                                <button className={cx('dropItem', 'dropItemLogout')} onClick={handleLogout}>
                                    <FontAwesomeIcon icon={faRightFromBracket} />
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ─── Body: Sidebar + Main Content ──────────────────────── */}
            <div className={cx('body')}>
                {/* Sidebar */}
                <aside className={cx('sidebar')}>
                    <div className={cx('sidebarHeader')}>
                        <span className={cx('sidebarSectionTitle')}>DANH MỤC QUẢN LÝ</span>
                    </div>

                    <nav className={cx('sideNav')}>
                        {SIDEBAR_NAV.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => cx('sideLink', isActive && 'sideLinkActive')}
                            >
                                <FontAwesomeIcon icon={item.icon} className={cx('sideLinkIcon')} />
                                <span className={cx('sideLinkLabel')}>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className={cx('content')}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
