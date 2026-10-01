import React, { useState, useEffect } from 'react';
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
import { teacherService, mapClassFromApi, mapMemberFromApi, enrichClass } from '../../services/teacherService';
import styles from './TeacherClassesPage.module.css';

const cx = ClassNames.bind(styles);

const STATUS_CONFIG = {
    GOOD: { label: 'Tốt', color: 'var(--color-success)', bg: 'rgba(16,185,129,0.1)' },
    WARNING: { label: 'Cảnh báo', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    DANGER: { label: 'Nguy hiểm', color: 'var(--color-danger)', bg: 'rgba(244,63,94,0.1)' },
};

export default function TeacherClassesPage() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedClass, setExpandedClass] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const classList = await teacherService.getClasses();
                const mapped = (Array.isArray(classList) ? classList : []).map(mapClassFromApi);

                // Tải sinh viên của tất cả lớp song song; lớp nào lỗi thì để rỗng
                const memberLists = await Promise.all(
                    mapped.map((cls) =>
                        teacherService
                            .getStudentsByClass(cls.id)
                            .then((list) => (Array.isArray(list) ? list.map(mapMemberFromApi) : []))
                            .catch((err) => {
                                console.warn('Không tải được sinh viên của lớp', cls.id, err);
                                return [];
                            }),
                    ),
                );

                if (!isMounted) return;
                const enriched = mapped.map((cls, i) => enrichClass(cls, memberLists[i]));
                setClasses(enriched);
                if (enriched[0]) setExpandedClass(enriched[0].id);
            } catch (err) {
                console.error('Lỗi tải danh sách lớp:', err);
                if (isMounted) setError('Không tải được danh sách lớp. Vui lòng thử lại sau.');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, []);

    const toggleClass = (classId) => {
        setExpandedClass(expandedClass === classId ? null : classId);
    };

    const getFilteredMembers = (members) => {
        return members.filter((m) => {
            const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.includes(searchQuery);
            const matchStatus = statusFilter === 'ALL' || m.status === statusFilter;
            return matchSearch && matchStatus;
        });
    };

    const totalStudents = classes.reduce((s, c) => s + c.students, 0);
    const totalAtRisk = classes.reduce((s, c) => s + c.atRisk, 0);

    if (isLoading) {
        return (
            <div className={cx('page')}>
                <div className={cx('container')}>
                    <p style={{ textAlign: 'center', padding: '4rem 0' }}>Đang tải danh sách lớp...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cx('page')}>
                <div className={cx('container')}>
                    <p style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-danger, red)' }}>{error}</p>
                </div>
            </div>
        );
    }

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

                {classes.length === 0 && (
                    <p style={{ textAlign: 'center', padding: '2rem 0' }}>Chưa có lớp học phần nào.</p>
                )}

                {/* Class Summary Cards */}
                <div className={cx('classSummaryGrid')}>
                    {classes.map((cls) => (
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
                {classes.map((cls) => {
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
                                                                    {student.name.charAt(
                                                                        student.name.lastIndexOf(' ') + 1,
                                                                    )}
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
                                                                style={{ color: status.color, background: status.bg }}
                                                            >
                                                                {student.status === 'DANGER' && (
                                                                    <FontAwesomeIcon
                                                                        icon={faTriangleExclamation}
                                                                        style={{ marginRight: 4 }}
                                                                    />
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
                                                                <FontAwesomeIcon
                                                                    icon={faArrowRight}
                                                                    style={{ marginLeft: 6 }}
                                                                />
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
