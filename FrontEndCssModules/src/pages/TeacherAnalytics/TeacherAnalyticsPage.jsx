import React, { useState } from 'react';
import ClassNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faTrophy,
    faClock,
    faTriangleExclamation,
    faFileExport,
    faFireFlameCurved,
    faEnvelope,
    faCheckCircle,
    faSearch,
    faGraduationCap,
    faUsers,
    faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import styles from './TeacherAnalyticsPage.module.css';

const cx = ClassNames.bind(styles);

// Mock data
const STUDENTS_ANALYTICS = [
    {
        id: 1,
        studentId: '2020601111',
        name: 'Trần Văn Mạnh',
        class: 'DHKTPM16A',
        solvedCount: 54,
        score: 1850,
        acRate: '94.2%',
        timeSpent: 48.5,
        streak: 24,
        lastActive: '10 phút trước',
        status: 'GOOD',
    },
    {
        id: 2,
        studentId: '2022604567',
        name: 'Lê Quỳnh Trang',
        class: 'DHKTPM16A',
        solvedCount: 49,
        score: 1720,
        acRate: '91.0%',
        timeSpent: 42.0,
        streak: 19,
        lastActive: '35 phút trước',
        status: 'GOOD',
    },
    {
        id: 3,
        studentId: '2021600123',
        name: 'Nguyễn Văn An',
        class: 'DHKTPM16A',
        solvedCount: 48,
        score: 1690,
        acRate: '89.5%',
        timeSpent: 38.5,
        streak: 14,
        lastActive: '1 giờ trước',
        status: 'GOOD',
    },
    {
        id: 4,
        studentId: '2021603344',
        name: 'Phạm Đức Long',
        class: 'DHKTPM16B',
        solvedCount: 45,
        score: 1540,
        acRate: '86.0%',
        timeSpent: 36.2,
        streak: 12,
        lastActive: '3 giờ trước',
        status: 'GOOD',
    },
    {
        id: 5,
        studentId: '2022607890',
        name: 'Hoàng Minh Tuấn',
        class: 'DHTH15',
        solvedCount: 41,
        score: 1420,
        acRate: '82.4%',
        timeSpent: 33.0,
        streak: 10,
        lastActive: '5 giờ trước',
        status: 'GOOD',
    },
    {
        id: 6,
        studentId: '2021609988',
        name: 'Đỗ Thùy Linh',
        class: 'DHKTPM16B',
        solvedCount: 38,
        score: 1310,
        acRate: '79.0%',
        timeSpent: 29.5,
        streak: 8,
        lastActive: 'Hôm qua',
        status: 'GOOD',
    },
    {
        id: 7,
        studentId: '2022601122',
        name: 'Bùi Quốc Anh',
        class: 'DHTH15',
        solvedCount: 12,
        score: 350,
        acRate: '40.0%',
        timeSpent: 4.2,
        streak: 0,
        lastActive: '5 ngày trước',
        status: 'WARNING',
        reason: 'Chưa nộp bài tập tuần 3, vắng 5 ngày',
    },
    {
        id: 8,
        studentId: '2021605566',
        name: 'Vũ Hải Nam',
        class: 'DHKTPM16A',
        solvedCount: 6,
        score: 180,
        acRate: '28.5%',
        timeSpent: 2.1,
        streak: 0,
        lastActive: '8 ngày trước',
        status: 'DANGER',
        reason: 'Không đăng nhập 8 ngày, tỷ lệ làm bài < 30%',
    },
    {
        id: 9,
        studentId: '2022608899',
        name: 'Ngô Khánh Huyền',
        class: 'DHKTPM16B',
        solvedCount: 4,
        score: 100,
        acRate: '22.0%',
        timeSpent: 1.5,
        streak: 0,
        lastActive: '10 ngày trước',
        status: 'DANGER',
        reason: 'Nguy cơ cấm thi: vắng học 10 ngày, chưa nộp bài OOP',
    },
];

export default function TeacherAnalyticsPage() {
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState('ALL');
    const [activeTab, setActiveTab] = useState('solved'); // 'solved' | 'time' | 'atRisk'
    const [searchQuery, setSearchQuery] = useState('');
    const [alertSentId, setAlertSentId] = useState(null);

    const handleSendAlert = (stId, stName) => {
        setAlertSentId(stId);
        setTimeout(() => {
            alert(`📧 Đã gửi email đôn đốc học tập tới: ${stName} (${stId}@sv.haui.edu.vn)`);
            setAlertSentId(null);
        }, 500);
    };

    const handleExportExcel = () => {
        alert('📊 Đang xuất báo cáo: "Bang_Tong_Hop_Hoc_Tap_HaUI_2026.xlsx" bao gồm danh sách điểm, giờ học & tỷ lệ chuyên cần.');
    };

    // Filter students
    const filtered = STUDENTS_ANALYTICS.filter((st) => {
        const matchClass = selectedClass === 'ALL' || st.class === selectedClass;
        const matchSearch =
            st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            st.studentId.includes(searchQuery);
        return matchClass && matchSearch;
    });

    const topSolved = [...filtered].sort((a, b) => b.solvedCount - a.solvedCount);
    const topTime = [...filtered].sort((a, b) => b.timeSpent - a.timeSpent);
    const atRisk = filtered.filter((st) => st.status === 'WARNING' || st.status === 'DANGER');

    return (
        <div className={cx('page')}>
            <div className={cx('container')}>
                {/* 1. Header */}
                <div className={cx('pageHeader')}>
                    <div>
                        <h1 className={cx('pageTitle')}>
                            <FontAwesomeIcon icon={faChartLine} className={cx('pageTitleIcon')} />
                            Thống kê & Báo cáo học tập
                        </h1>
                        <p className={cx('pageSubtitle')}>
                            Theo dõi mức độ chuyên cần, sinh viên làm nhiều bài tập, sinh viên học lâu và cảnh báo nguy cơ học tập
                        </p>
                    </div>

                    <button className={cx('exportBtn')} onClick={handleExportExcel}>
                        <FontAwesomeIcon icon={faFileExport} />
                        Xuất báo cáo Excel
                    </button>
                </div>

                {/* 2. Top Summary KPI Cards */}
                <div className={cx('kpiGrid')}>
                    <div className={cx('kpiCard')}>
                        <div className={cx('kpiIcon', 'iconBlue')}>
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                        <div>
                            <span className={cx('kpiLabel')}>Tổng sinh viên phụ trách</span>
                            <div className={cx('kpiValueRow')}>
                                <span className={cx('kpiNumber')}>168</span>
                                <span className={cx('kpiSub')}>3 Lớp học phần</span>
                            </div>
                        </div>
                    </div>

                    <div className={cx('kpiCard')}>
                        <div className={cx('kpiIcon', 'iconOrange')}>
                            <FontAwesomeIcon icon={faTrophy} />
                        </div>
                        <div>
                            <span className={cx('kpiLabel')}>TB số bài giải / SV</span>
                            <div className={cx('kpiValueRow')}>
                                <span className={cx('kpiNumber')}>32.4</span>
                                <span className={cx('kpiSub')}>Tỷ lệ AC: 82.5%</span>
                            </div>
                        </div>
                    </div>

                    <div className={cx('kpiCard')}>
                        <div className={cx('kpiIcon', 'iconGreen')}>
                            <FontAwesomeIcon icon={faClock} />
                        </div>
                        <div>
                            <span className={cx('kpiLabel')}>Thời gian học TB / ngày</span>
                            <div className={cx('kpiValueRow')}>
                                <span className={cx('kpiNumber')}>2.8h</span>
                                <span className={cx('kpiSub')}>Chuỗi TB: 11 ngày</span>
                            </div>
                        </div>
                    </div>

                    <div className={cx('kpiCard', 'kpiCardDanger')}>
                        <div className={cx('kpiIcon', 'iconRed')}>
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                        </div>
                        <div>
                            <span className={cx('kpiLabel')}>Sinh viên có nguy cơ</span>
                            <div className={cx('kpiValueRow')}>
                                <span className={cx('kpiNumber', 'textDanger')}>{atRisk.length}</span>
                                <span className={cx('kpiSub')}>Vắng {'>'} 5 ngày</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Filter Bar */}
                <div className={cx('filterCard')}>
                    <div className={cx('classFilters')}>
                        <span className={cx('filterLabel')}>Lớp học phần:</span>
                        {['ALL', 'DHKTPM16A', 'DHKTPM16B', 'DHTH15'].map((cls) => (
                            <button
                                key={cls}
                                className={cx('classBtn', selectedClass === cls && 'classBtnActive')}
                                onClick={() => setSelectedClass(cls)}
                            >
                                {cls === 'ALL' ? 'Tất cả các lớp' : cls}
                            </button>
                        ))}
                    </div>

                    <div className={cx('searchBox')}>
                        <FontAwesomeIcon icon={faSearch} className={cx('searchIcon')} />
                        <input
                            type="text"
                            placeholder="Tìm tên, MSSV..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cx('searchInput')}
                        />
                    </div>
                </div>

                {/* 4. Analytics Section Tabs */}
                <div className={cx('analyticsCard')}>
                    <div className={cx('tabsHeader')}>
                        <button
                            className={cx('tabBtn', activeTab === 'solved' && 'tabBtnActive')}
                            onClick={() => setActiveTab('solved')}
                        >
                            <FontAwesomeIcon icon={faTrophy} className={cx('tabIconOrange')} />
                            Top làm bài nhiều nhất ({topSolved.length})
                        </button>

                        <button
                            className={cx('tabBtn', activeTab === 'time' && 'tabBtnActive')}
                            onClick={() => setActiveTab('time')}
                        >
                            <FontAwesomeIcon icon={faClock} className={cx('tabIconBlue')} />
                            Top học lâu & Chăm chỉ ({topTime.length})
                        </button>

                        <button
                            className={cx('tabBtn', activeTab === 'atRisk' && 'tabBtnActiveDanger')}
                            onClick={() => setActiveTab('atRisk')}
                        >
                            <FontAwesomeIcon icon={faTriangleExclamation} className={cx('tabIconRed')} />
                            Sinh viên nguy cơ / Lười học ({atRisk.length})
                        </button>
                    </div>

                    {/* TAB 1: TOP SOLVED */}
                    {activeTab === 'solved' && (
                        <div className={cx('tableScroll')}>
                            <table className={cx('table')}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '60px', textAlign: 'center' }}>Hạng</th>
                                        <th>Sinh viên</th>
                                        <th>Lớp</th>
                                        <th style={{ textAlign: 'center' }}>Số bài đã giải (AC)</th>
                                        <th style={{ textAlign: 'center' }}>Điểm rèn luyện</th>
                                        <th style={{ textAlign: 'center' }}>Tỷ lệ chính xác</th>
                                        <th style={{ textAlign: 'center' }}>Lần cuối online</th>
                                        <th style={{ textAlign: 'center' }}>Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topSolved.map((st, idx) => (
                                        <tr key={st.id} className={cx('tableRow')}>
                                            <td style={{ textAlign: 'center' }}>
                                                <span
                                                    className={cx(
                                                        'rankBadge',
                                                        idx === 0 && 'rank1',
                                                        idx === 1 && 'rank2',
                                                        idx === 2 && 'rank3'
                                                    )}
                                                >
                                                    {idx + 1}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={cx('studentCell')}>
                                                    <div className={cx('avatarCircle')}>
                                                        {st.name.charAt(st.name.lastIndexOf(' ') + 1)}
                                                    </div>
                                                    <div>
                                                        <strong className={cx('studentName')}>{st.name}</strong>
                                                        <span className={cx('studentId')}>{st.studentId}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={cx('classBadge')}>{st.class}</span>
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 800, color: '#ea580c' }}>
                                                {st.solvedCount} bài
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 700, color: '#0f172a' }}>
                                                {st.score} pts
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>
                                                {st.acRate}
                                            </td>
                                            <td style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>
                                                {st.lastActive}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    className={cx('viewBtn')}
                                                    onClick={() => navigate(`/teacher/students/${st.studentId}`, { state: { student: st, className: st.class } })}
                                                >
                                                    Xem <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TAB 2: TOP TIME & STREAK */}
                    {activeTab === 'time' && (
                        <div className={cx('tableScroll')}>
                            <table className={cx('table')}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '60px', textAlign: 'center' }}>Hạng</th>
                                        <th>Sinh viên</th>
                                        <th>Lớp</th>
                                        <th style={{ textAlign: 'center' }}>Tổng thời gian học</th>
                                        <th style={{ textAlign: 'center' }}>Chuỗi chăm chỉ (Streak)</th>
                                        <th style={{ textAlign: 'center' }}>Số bài hoàn thành</th>
                                        <th style={{ textAlign: 'center' }}>Đánh giá</th>
                                        <th style={{ textAlign: 'center' }}>Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topTime.map((st, idx) => (
                                        <tr key={st.id} className={cx('tableRow')}>
                                            <td style={{ textAlign: 'center' }}>
                                                <span
                                                    className={cx(
                                                        'rankBadge',
                                                        idx === 0 && 'rank1',
                                                        idx === 1 && 'rank2',
                                                        idx === 2 && 'rank3'
                                                    )}
                                                >
                                                    {idx + 1}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={cx('studentCell')}>
                                                    <div className={cx('avatarCircle')}>
                                                        {st.name.charAt(st.name.lastIndexOf(' ') + 1)}
                                                    </div>
                                                    <div>
                                                        <strong className={cx('studentName')}>{st.name}</strong>
                                                        <span className={cx('studentId')}>{st.studentId}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={cx('classBadge')}>{st.class}</span>
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 800, color: '#2563eb' }}>
                                                ⏱️ {st.timeSpent} giờ
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 800, color: '#ea580c' }}>
                                                🔥 {st.streak} ngày liên tục
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 600, color: '#334155' }}>
                                                {st.solvedCount} bài
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className={cx('goodBadge')}>
                                                    <FontAwesomeIcon icon={faCheckCircle} /> Rất tích cực
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    className={cx('viewBtn')}
                                                    onClick={() => navigate(`/teacher/students/${st.studentId}`, { state: { student: st, className: st.class } })}
                                                >
                                                    Xem <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TAB 3: AT RISK */}
                    {activeTab === 'atRisk' && (
                        <div>
                            <div className={cx('warningBanner')}>
                                <FontAwesomeIcon icon={faTriangleExclamation} className={cx('warningIcon')} />
                                <div>
                                    <strong>Cảnh báo học vụ & Chuyên cần:</strong>
                                    <p>
                                        Danh sách các sinh viên có nguy cơ cấm thi hoặc trượt môn do vắng học trên 5 ngày hoặc tỷ lệ làm bài dưới 40%. Giảng viên có thể gửi email cảnh báo trực tiếp từ hệ thống.
                                    </p>
                                </div>
                            </div>

                            <div className={cx('tableScroll')}>
                                <table className={cx('table')}>
                                    <thead>
                                        <tr>
                                            <th>Sinh viên</th>
                                            <th>Lớp</th>
                                            <th style={{ textAlign: 'center' }}>Thời gian học</th>
                                            <th style={{ textAlign: 'center' }}>Số bài nộp</th>
                                            <th style={{ textAlign: 'center' }}>Lần cuối online</th>
                                            <th>Lý do cảnh báo</th>
                                            <th style={{ textAlign: 'center' }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {atRisk.map((st) => (
                                            <tr key={st.id} className={cx('tableRow')}>
                                                <td>
                                                    <div className={cx('studentCell')}>
                                                        <div className={cx('avatarCircle', 'avatarRed')}>
                                                            {st.name.charAt(st.name.lastIndexOf(' ') + 1)}
                                                        </div>
                                                        <div>
                                                            <strong className={cx('studentName')}>{st.name}</strong>
                                                            <span className={cx('studentId')}>{st.studentId}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={cx('classBadge')}>{st.class}</span>
                                                </td>
                                                <td style={{ textAlign: 'center', fontWeight: 700, color: '#dc2626' }}>
                                                    {st.timeSpent}h
                                                </td>
                                                <td style={{ textAlign: 'center', fontWeight: 600 }}>
                                                    {st.solvedCount} bài
                                                </td>
                                                <td style={{ textAlign: 'center', color: '#d97706', fontWeight: 600 }}>
                                                    {st.lastActive}
                                                </td>
                                                <td>
                                                    <span className={cx('riskReason')}>
                                                        {st.reason || 'Chưa hoàn thành đủ số lượng bài tập tối thiểu'}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button
                                                        className={cx('emailBtn')}
                                                        onClick={() => handleSendAlert(st.studentId, st.name)}
                                                    >
                                                        <FontAwesomeIcon icon={faEnvelope} />
                                                        {alertSentId === st.studentId ? 'Đang gửi...' : 'Gửi email nhắc'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
