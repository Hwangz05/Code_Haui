import React, { useState, useEffect } from 'react';
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
import { notificationService } from '../../../services/notificationService';

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
    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const formatNotiTime = (dateStr) => {
        if (!dateStr) return 'Vừa xong';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffMins < 1) return 'Vừa xong';
            if (diffMins < 60) return `${diffMins} phút trước`;
            if (diffHours < 24) return `${diffHours} giờ trước`;
            if (diffDays === 1) return 'Hôm qua';
            return `${diffDays} ngày trước`;
        } catch {
            return dateStr;
        }
    };

    useEffect(() => {
        let isMounted = true;
        const loadNotifications = async () => {
            if (!user) return;
            try {
                const notifs = await notificationService.getMyNotifications();
                if (isMounted && Array.isArray(notifs) && notifs.length > 0) {
                    setNotifications(
                        notifs.map((n) => ({
                            id: n.id,
                            title: n.title,
                            body: n.body,
                            time: formatNotiTime(n.createdAt),
                            read: n.isRead,
                            link: n.link,
                        }))
                    );
                } else if (isMounted && notifications.length === 0) {
                    setNotifications([
                        {
                            id: 1,
                            title: '📥 15 sinh viên vừa nộp bài tập mới',
                            body: 'Lớp DHKTPM16A có 15 sinh viên vừa nộp bài Quản lý Nhân viên OOP.',
                            time: '10 phút trước',
                            read: false,
                            link: '/teacher/students',
                        },
                        {
                            id: 2,
                            title: '🌟 96.5% sinh viên đạt tiến độ học tập',
                            body: 'Báo cáo tuần: 4 lớp học phần duy trì tiến độ làm bài xuất sắc.',
                            time: '3 giờ trước',
                            read: false,
                            link: '/teacher/analytics',
                        },
                        {
                            id: 3,
                            title: '🛡️ Máy chủ chấm code Sandbox nâng cấp',
                            body: 'Hệ thống đã hỗ trợ Java 21, C++ 23 và Python 3.12 tự động.',
                            time: '1 ngày trước',
                            read: true,
                            link: '/teacher/dashboard',
                        },
                    ]);
                }
            } catch (err) {
                console.warn('Lỗi khi tải thông báo TeacherLayout:', err);
            }
        };

        loadNotifications();
        const interval = setInterval(loadNotifications, 30000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

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
                    <div style={{ position: 'relative' }}>
                        <button
                            className={cx('bellBtn')}
                            title="Thông báo hệ thống"
                            onClick={() => {
                                setIsNotiOpen(!isNotiOpen);
                                setIsProfileOpen(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faBell} />
                            {unreadCount > 0 && <span className={cx('bellDot')} />}
                        </button>

                        {isNotiOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 0.5rem)',
                                    right: 0,
                                    width: '22rem',
                                    maxHeight: '24rem',
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: '0.75rem',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                                    zIndex: 100,
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.75rem 1rem',
                                        borderBottom: '1px solid #334155',
                                    }}
                                >
                                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>
                                        Thông báo Giảng viên {unreadCount > 0 && <span style={{ color: '#f97316' }}>({unreadCount})</span>}
                                    </strong>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={() => {
                                                const unreadList = notifications.filter((n) => !n.read);
                                                setNotifications(notifications.map((n) => ({ ...n, read: true })));
                                                unreadList.forEach((n) => {
                                                    if (n.id) notificationService.markAsRead(n.id).catch(() => {});
                                                });
                                            }}
                                            style={{
                                                fontSize: '0.75rem',
                                                color: '#f97316',
                                                fontWeight: 600,
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Đánh dấu đã đọc
                                        </button>
                                    )}
                                </div>
                                <div style={{ maxHeight: '18rem', overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                                            Chưa có thông báo nào
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                onClick={() => {
                                                    if (!n.read && n.id) {
                                                        notificationService.markAsRead(n.id).catch(() => {});
                                                        setNotifications((prev) =>
                                                            prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                                                        );
                                                    }
                                                    setIsNotiOpen(false);
                                                    if (n.link) navigate(n.link);
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    padding: '0.75rem 1rem',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                                    backgroundColor: n.read ? 'transparent' : 'rgba(249, 115, 22, 0.08)',
                                                    transition: 'background-color 0.2s',
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '2px' }}>
                                                    <span style={{ color: n.read ? '#cbd5e1' : '#fff', fontWeight: n.read ? 500 : 700, fontSize: '0.85rem' }}>
                                                        {n.title}
                                                    </span>
                                                    {!n.read && (
                                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f97316', flexShrink: 0, marginLeft: '6px' }} />
                                                    )}
                                                </div>
                                                {n.body && (
                                                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '2px 0', lineHeight: 1.4 }}>
                                                        {n.body}
                                                    </p>
                                                )}
                                                <small style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '3px' }}>
                                                    {n.time}
                                                </small>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

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
