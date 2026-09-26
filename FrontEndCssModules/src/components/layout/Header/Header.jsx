import React, { useState } from 'react';
import ClassNames from 'classnames/bind';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMagnifyingGlass,
    faBell,
    faUser,
    faTrophy,
    faBookOpen,
    faRightFromBracket,
    faChalkboardTeacher,
    faUsers,
    faClipboardList,
} from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../config/routes.config';
import Badge from '../../common/Badge/Badge';
import styles from './Header.module.css';

const cx = ClassNames.bind(styles);

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, login, logout } = useAuth();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const [showTeacherAccessModal, setShowTeacherAccessModal] = useState(false);

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'Kỳ thi đấu "HaUI Coding Cup 2026" sắp diễn ra',
            time: '10 phút trước',
            read: false,
        },
        {
            id: 2,
            title: 'Bạn đã hoàn thành xuất sắc bài "Tìm số lớn nhất"',
            time: '2 giờ trước',
            read: false,
        },
        {
            id: 3,
            title: 'Khóa học Cấu trúc dữ liệu & Giải thuật mới cập nhật',
            time: '1 ngày trước',
            read: true,
        },
    ]);

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN);
    };

    const isTeacher = user?.role === 'TEACHER' || (user?.studentId && user.studentId.toUpperCase().startsWith('GV'));

    const navLinks = [
        { name: 'Trang chủ', path: ROUTES.HOME },
        { name: 'Khóa học', path: ROUTES.KHOA_HOC },
        { name: 'Thi đấu', path: ROUTES.THI_DAU },
        { name: 'Bảng xếp hạng', path: ROUTES.LEADERBOARD },
    ];

    const handleTeacherPortalClick = () => {
        setIsProfileOpen(false);
        if (isTeacher) {
            navigate('/teacher/dashboard');
        } else {
            setShowTeacherAccessModal(true);
        }
    };

    const handleQuickSwitchToTeacher = async () => {
        setShowTeacherAccessModal(false);
        await login('GV2026', 'haui@2026');
        navigate('/teacher/dashboard');
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <header className={cx('header')}>
            <div className={cx('container', 'inner')}>
                {/* Left: Brand & Nav */}
                <div className={cx('leftGroup')}>
                    <Link to={ROUTES.HOME} className={cx('brand')}>
                        <div className={cx('logoBox')}>
                            <div className={cx('logoInner')}>
                                <img
                                    className={cx('logoImg')}
                                    src="https://cdn-001.haui.edu.vn//img/logo-haui-size.png"
                                    alt="Logo Đại học Công nghiệp Hà Nội"
                                />
                            </div>
                        </div>
                        <div className={cx('brandInfo')}>
                            <span className={cx('brandTitle')}>CODE HAUI</span>
                            <span className={cx('brandSubtitle')}>HaUI Code Learning</span>
                        </div>
                    </Link>

                    <nav className={cx('nav')}>
                        {navLinks.map((link) => {
                            const isActive =
                                location.pathname === link.path ||
                                (link.path !== ROUTES.HOME && location.pathname.startsWith(link.path));
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`${cx('navLink')} ${isActive ? cx('navLinkActive') : ''}`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Right: Search, Noti & User */}
                <div className={cx('rightGroup')}>
                    <div className={cx('searchBox')}>
                        <span className={cx('searchIcon')}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </span>
                        <input type="text" placeholder="Tìm bài tập, khóa học..." className={cx('searchInput')} />
                    </div>

                    {/* Bell Notification */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => {
                                setIsNotiOpen(!isNotiOpen);
                                setIsProfileOpen(false);
                            }}
                            className={cx('bellBtn')}
                            title="Thông báo"
                        >
                            <FontAwesomeIcon icon={faBell} className={cx('bell-icon')} />
                            {unreadCount > 0 && <span className={cx('notiBadge')}>{unreadCount}</span>}
                        </button>

                        {isNotiOpen && (
                            <div className={cx('dropdown')} style={{ width: '20rem' }}>
                                <div
                                    className={cx('dropdownHeader')}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <strong style={{ color: '#fff', fontSize: '0.85rem' }}>Thông báo</strong>
                                    <button
                                        onClick={() =>
                                            setNotifications(notifications.map((n) => ({ ...n, read: true })))
                                        }
                                        style={{
                                            fontSize: '0.7rem',
                                            color: 'var(--color-primary)',
                                        }}
                                    >
                                        Đánh dấu đã đọc
                                    </button>
                                </div>
                                <div style={{ maxHeight: '15rem', overflowY: 'auto' }}>
                                    {notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className={cx('dropdownItem')}
                                            style={{
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: n.read ? 'var(--text-muted)' : 'var(--text-white)',
                                                    fontWeight: n.read ? 400 : 600,
                                                }}
                                            >
                                                {n.title}
                                            </span>
                                            <small
                                                style={{
                                                    color: 'var(--text-dim)',
                                                    fontSize: '0.65rem',
                                                    marginTop: '2px',
                                                }}
                                            >
                                                {n.time}
                                            </small>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => {
                                setIsProfileOpen(!isProfileOpen);
                                setIsNotiOpen(false);
                            }}
                            className={cx('profileBtn')}
                        >
                            <div className={cx('avatarWrapper')}>
                                <img
                                    src={
                                        user?.avatar ||
                                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                                    }
                                    alt={user?.name}
                                    className={cx('avatar')}
                                />
                                <span className={cx('onlineDot')}></span>
                            </div>
                            <div className={cx('profileInfo')}>
                                <span className={cx('studentName')}>
                                    {user?.name || 'Nguyễn Văn An'}
                                    <Badge variant={isTeacher ? 'purple' : 'orange'}>
                                        {isTeacher ? 'GV' : 'SV'}
                                    </Badge>
                                </span>
                                <span className={cx('studentId')}>{user?.studentId || '2021600123'}</span>
                            </div>
                        </button>

                        {isProfileOpen && (
                            <div className={cx('dropdown')}>
                                <div className={cx('dropdownHeader')}>
                                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{user?.name}</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {isTeacher ? 'Mã GV: ' : 'MSSV: '}{' '}
                                        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                                            {user?.studentId}
                                        </span>
                                    </p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {isTeacher ? `Khoa: ${user?.department || 'CNTT'}` : `Lớp: ${user?.class}`}
                                    </p>
                                </div>
                                <div>
                                    {/* Link Quản lý Giảng viên with Role Check */}
                                    <button
                                        type="button"
                                        onClick={handleTeacherPortalClick}
                                        className={cx('dropdownItem')}
                                        style={{
                                            background: 'rgba(139, 92, 246, 0.08)',
                                            color: '#a78bfa',
                                            fontWeight: 600,
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        }}
                                    >
                                        <span>
                                            <FontAwesomeIcon icon={faChalkboardTeacher} className={cx('icon-profile--item')} />
                                        </span>
                                        Quản lý giảng viên
                                        {isTeacher ? (
                                            <span style={{ fontSize: '0.65rem', background: '#8b5cf6', color: '#fff', padding: '2px 6px', borderRadius: '4px', marginLeft: 'auto' }}>Mở</span>
                                        ) : (
                                            <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', color: 'var(--text-dim)', padding: '2px 6px', borderRadius: '4px', marginLeft: 'auto' }}>Khóa 🔒</span>
                                        )}
                                    </button>

                                    <Link
                                        to={ROUTES.PROFILE}
                                        onClick={() => setIsProfileOpen(false)}
                                        className={cx('dropdownItem')}
                                    >
                                        <span>
                                            <FontAwesomeIcon icon={faUser} className={cx('icon-profile--item')} />
                                        </span>
                                        Hồ sơ cá nhân
                                    </Link>
                                    <Link
                                        to={ROUTES.THI_DAU}
                                        onClick={() => setIsProfileOpen(false)}
                                        className={cx('dropdownItem')}
                                    >
                                        <span>
                                            <FontAwesomeIcon icon={faTrophy} className={cx('icon-profile--item')} />
                                        </span>
                                        Bài thi đấu đã nộp
                                    </Link>
                                    <Link
                                        to={ROUTES.KHOA_HOC}
                                        onClick={() => setIsProfileOpen(false)}
                                        className={cx('dropdownItem')}
                                    >
                                        <span>
                                            <FontAwesomeIcon icon={faBookOpen} className={cx('icon-profile--item')} />
                                        </span>
                                        Khóa học của tôi
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className={`${cx('dropdownItem')} ${cx('logoutBtn')}`}
                                    >
                                        <span>
                                            <FontAwesomeIcon
                                                icon={faRightFromBracket}
                                                className={cx('icon-profile--item')}
                                            />
                                        </span>
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal cảnh báo khi Sinh viên bấm vào Quản lý giảng viên */}
            {showTeacherAccessModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '1rem',
                }}>
                    <div style={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        borderRadius: '16px',
                        maxWidth: '480px',
                        width: '100%',
                        padding: '1.75rem',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: '4rem',
                            height: '4rem',
                            backgroundColor: 'rgba(245, 158, 11, 0.15)',
                            color: '#f59e0b',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.75rem',
                            margin: '0 auto 1.25rem',
                        }}>
                            🔒
                        </div>

                        <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            Trang Dành Riêng Cho Giảng Viên
                        </h3>

                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                            Khu vực <strong style={{ color: '#a78bfa' }}>Quản lý giảng viên</strong> chỉ cấp quyền cho Cán bộ & Giảng viên Đại học Công nghiệp Hà Nội để quản lý bài tập, theo dõi chuyên cần và chấm điểm lớp học phần.
                        </p>

                        <div style={{
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            marginBottom: '1.5rem',
                            textAlign: 'left',
                            fontSize: '0.85rem',
                            color: 'var(--text-dim)',
                        }}>
                            <div>Tài khoản hiện tại: <strong style={{ color: '#fff' }}>{user?.name || 'Nguyễn Văn An'}</strong></div>
                            <div>Vai trò: <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Sinh viên (SV - {user?.studentId || '2021600123'})</span></div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={handleQuickSwitchToTeacher}
                                style={{
                                    backgroundColor: '#8b5cf6',
                                    color: '#fff',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                👨‍🏫 Đăng nhập nhanh tài khoản Giảng viên (GV2026)
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowTeacherAccessModal(false)}
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'var(--text-dim)',
                                    padding: '0.6rem',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'pointer',
                                }}
                            >
                                Đóng thông báo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
