import React, { useState } from 'react';
import ClassNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers,
    faSearch,
    faChevronDown,
    faChevronRight,
    faFireFlameCurved,
    faTrophy,
    faClock,
    faTriangleExclamation,
    faCheckCircle,
    faArrowRight,
    faGraduationCap,
    faChalkboard,
} from '@fortawesome/free-solid-svg-icons';

import styles from './TeacherClassesPage.module.css';

const cx = ClassNames.bind(styles);

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CLASSES = [
    {
        id: 'DHKTPM16A',
        name: 'DHKTPM16A',
        fullName: 'Kỹ thuật phần mềm 16A',
        students: 38,
        avgScore: 780,
        avgSolved: 32,
        semester: 'HK2 2025-2026',
        atRisk: 5,
        members: [
            { id: '2021600123', name: 'Nguyễn Văn An', score: 1250, solved: 48, streak: 12, studyHours: 87, status: 'GOOD' },
            { id: '2021600124', name: 'Trần Thị Bích', score: 1180, solved: 44, streak: 8, studyHours: 72, status: 'GOOD' },
            { id: '2021600125', name: 'Lê Minh Cường', score: 920, solved: 35, streak: 3, studyHours: 51, status: 'WARNING' },
            { id: '2021600126', name: 'Phạm Thanh Dung', score: 760, solved: 28, streak: 1, studyHours: 33, status: 'DANGER' },
            { id: '2021600127', name: 'Hoàng Văn Em', score: 1050, solved: 40, streak: 6, studyHours: 65, status: 'GOOD' },
            { id: '2021600128', name: 'Vũ Thị Fảnh', score: 850, solved: 33, streak: 4, studyHours: 48, status: 'WARNING' },
            { id: '2021600129', name: 'Đặng Minh Giang', score: 680, solved: 22, streak: 0, studyHours: 21, status: 'DANGER' },
            { id: '2021600130', name: 'Ngô Thị Huyền', score: 1320, solved: 52, streak: 18, studyHours: 98, status: 'GOOD' },
        ],
    },
    {
        id: 'DHKTPM16B',
        name: 'DHKTPM16B',
        fullName: 'Kỹ thuật phần mềm 16B',
        students: 36,
        avgScore: 720,
        avgSolved: 28,
        semester: 'HK2 2025-2026',
        atRisk: 7,
        members: [
            { id: '2021600201', name: 'Trịnh Văn Anh', score: 1100, solved: 42, streak: 9, studyHours: 76, status: 'GOOD' },
            { id: '2021600202', name: 'Bùi Thị Bắc', score: 950, solved: 36, streak: 5, studyHours: 60, status: 'GOOD' },
            { id: '2021600203', name: 'Cao Minh Châu', score: 620, solved: 18, streak: 0, studyHours: 15, status: 'DANGER' },
            { id: '2021600204', name: 'Dương Thị Đào', score: 780, solved: 30, streak: 3, studyHours: 44, status: 'WARNING' },
            { id: '2021600205', name: 'Đinh Văn Ế', score: 1200, solved: 46, streak: 14, studyHours: 90, status: 'GOOD' },
            { id: '2021600206', name: 'Giang Thị Phương', score: 540, solved: 14, streak: 0, studyHours: 10, status: 'DANGER' },
        ],
    },
    {
        id: 'DHTH15',
        name: 'DHTH15',
        fullName: 'Tin học ứng dụng 15',
        students: 40,
        avgScore: 650,
        avgSolved: 24,
        semester: 'HK2 2025-2026',
        atRisk: 9,
        members: [
            { id: '2020600301', name: 'Hà Thị Giang', score: 980, solved: 38, streak: 7, studyHours: 68, status: 'GOOD' },
            { id: '2020600302', name: 'Lý Văn Hùng', score: 720, solved: 26, streak: 2, studyHours: 38, status: 'WARNING' },
            { id: '2020600303', name: 'Mai Thị Ina', score: 580, solved: 16, streak: 0, studyHours: 12, status: 'DANGER' },
            { id: '2020600304', name: 'Nguyễn Văn Kiên', score: 1100, solved: 44, streak: 11, studyHours: 80, status: 'GOOD' },
            { id: '2020600305', name: 'Phan Thị Linh', score: 450, solved: 10, streak: 0, studyHours: 8, status: 'DANGER' },
        ],
    },
];

const STATUS_CONFIG = {
    GOOD: { label: 'Tốt', color: 'var(--color-success)', bg: 'rgba(16,185,129,0.1)' },
    WARNING: { label: 'Cảnh báo', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    DANGER: { label: 'Nguy hiểm', color: 'var(--color-danger)', bg: 'rgba(244,63,94,0.1)' },
};

export default function TeacherClassesPage() {
    const navigate = useNavigate();
    const [expandedClass, setExpandedClass] = useState('DHKTPM16A');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const toggleClass = (classId) => {
        setExpandedClass(expandedClass === classId ? null : classId);
    };

    const getFilteredMembers = (members) => {
        return members.filter((m) => {
            const matchSearch =
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.id.includes(searchQuery);
            const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
            return matchSearch && matchStatus;
        });
    };

    const totalStudents = CLASSES.reduce((s, c) => s + c.students, 0);
    const totalAtRisk = CLASSES.reduce((s, c) => s + c.atRisk, 0);

    return (
        <div className={cx('page')}>
            <div className={cx('container')}>
                {/* Page Header */}
                <div className={cx('pageHeader')}>
                    <div>
                        <h1 className={cx('pageTitle')}>
                            <FontAwesomeIcon icon={faChalkboard} className={cx('pageTitleIcon')} />
                            Quản lý lớp học
                        </h1>
                        <p className={cx('pageSubtitle')}>Theo dõi tiến độ học tập và tình trạng sinh viên theo lớp</p>
                    </div>
                    <div className={cx('headerStats')}>
                        <div className={cx('statPill')}>
                            <FontAwesomeIcon icon={faUsers} />
                            <span>{totalStudents} sinh viên</span>
                        </div>
                        <div className={cx('statPill', 'statPillDanger')}>
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                            <span>{totalAtRisk} cần chú ý</span>
                        </div>
                    </div>
                </div>

                {/* Class Summary Cards */}
                <div className={cx('classSummaryGrid')}>
                    {CLASSES.map((cls) => (
                        <div
                            key={cls.id}
                            className={cx('classSummaryCard', expandedClass === cls.id && 'classSummaryCardActive')}
                            onClick={() => toggleClass(cls.id)}
                        >
                            <div className={cx('classSummaryTop')}>
                                <div className={cx('classIcon')}>
                                    <FontAwesomeIcon icon={faGraduationCap} />
                                </div>
                                <div className={cx('classInfo')}>
                                    <h3 className={cx('className')}>{cls.name}</h3>
                                    <p className={cx('classFullName')}>{cls.fullName}</p>
                                </div>
                                <FontAwesomeIcon
                                    icon={expandedClass === cls.id ? faChevronDown : faChevronRight}
                                    className={cx('classChevron')}
                                />
                            </div>
                            <div className={cx('classSummaryStats')}>
                                <div className={cx('classStat')}>
                                    <span className={cx('classStatValue')}>{cls.students}</span>
                                    <span className={cx('classStatLabel')}>Sinh viên</span>
                                </div>
                                <div className={cx('classStat')}>
                                    <span className={cx('classStatValue')}>{cls.avgSolved}</span>
                                    <span className={cx('classStatLabel')}>TB bài giải</span>
                                </div>
                                <div className={cx('classStat', 'classStatDanger')}>
                                    <span className={cx('classStatValue')}>{cls.atRisk}</span>
                                    <span className={cx('classStatLabel')}>Cần chú ý</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search & Filter */}
                <div className={cx('filterBar')}>
                    <div className={cx('searchBox')}>
                        <FontAwesomeIcon icon={faSearch} className={cx('searchIcon')} />
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc MSSV..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cx('searchInput')}
                        />
                    </div>
                    <div className={cx('statusFilters')}>
                        {['ALL', 'GOOD', 'WARNING', 'DANGER'].map((s) => (
                            <button
                                key={s}
                                className={cx('statusFilterBtn', statusFilter === s && 'statusFilterActive')}
                                onClick={() => setStatusFilter(s)}
                            >
                                {s === 'ALL' ? 'Tất cả' : STATUS_CONFIG[s].label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Expanded Class Student Table */}
                {CLASSES.map((cls) => {
                    if (expandedClass !== cls.id) return null;
                    const filtered = getFilteredMembers(cls.members);
                    return (
                        <div key={cls.id} className={cx('studentTableWrap')}>
                            <div className={cx('tableHeader')}>
                                <h2 className={cx('tableTitle')}>
                                    Danh sách sinh viên — {cls.name}
                                    <span className={cx('tableCount')}>{filtered.length} người</span>
                                </h2>
                            </div>
                            <div className={cx('tableScroll')}>
                                <table className={cx('table')}>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Sinh viên</th>
                                            <th>
                                                <FontAwesomeIcon icon={faTrophy} /> Điểm
                                            </th>
                                            <th>
                                                <FontAwesomeIcon icon={faCheckCircle} /> Bài giải
                                            </th>
                                            <th>
                                                <FontAwesomeIcon icon={faFireFlameCurved} /> Streak
                                            </th>
                                            <th>
                                                <FontAwesomeIcon icon={faClock} /> Giờ học
                                            </th>
                                            <th>Tình trạng</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className={cx('emptyRow')}>
                                                    Không tìm thấy sinh viên phù hợp
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((student, idx) => {
                                                const status = STATUS_CONFIG[student.status];
                                                return (
                                                    <tr key={student.id} className={cx('tableRow')}>
                                                        <td className={cx('rankCell')}>{idx + 1}</td>
                                                        <td>
                                                            <div className={cx('studentCell')}>
                                                                <div className={cx('studentAvatar')}>
                                                                    {student.name.charAt(student.name.lastIndexOf(' ') + 1)}
                                                                </div>
                                                                <div>
                                                                    <p className={cx('studentName')}>{student.name}</p>
                                                                    <p className={cx('studentId')}>{student.id}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className={cx('scoreCell')}>
                                                            {student.score.toLocaleString()}
                                                        </td>
                                                        <td className={cx('numCell')}>{student.solved}</td>
                                                        <td className={cx('streakCell')}>
                                                            {student.streak > 0 ? (
                                                                <>
                                                                    <FontAwesomeIcon
                                                                        icon={faFireFlameCurved}
                                                                        style={{ color: '#f97316', marginRight: 4 }}
                                                                    />
                                                                    {student.streak} ngày
                                                                </>
                                                            ) : (
                                                                <span className={cx('noStreak')}>— ngày</span>
                                                            )}
                                                        </td>
                                                        <td className={cx('numCell')}>{student.studyHours}h</td>
                                                        <td>
                                                            <span
                                                                className={cx('statusBadge')}
                                                                style={{
                                                                    color: status.color,
                                                                    background: status.bg,
                                                                }}
                                                            >
                                                                {student.status === 'DANGER' && (
                                                                    <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: 4 }} />
                                                                )}
                                                                {status.label}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className={cx('detailBtn')}
                                                                onClick={() =>
                                                                    navigate(`/teacher/students/${student.id}`, {
                                                                        state: { student, className: cls.name },
                                                                    })
                                                                }
                                                            >
                                                                Chi tiết
                                                                <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: 6 }} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
