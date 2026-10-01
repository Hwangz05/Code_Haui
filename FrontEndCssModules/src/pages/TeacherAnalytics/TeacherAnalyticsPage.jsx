import React, { useState, useEffect } from 'react';
import ClassNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faTrophy,
    faClock,
    faTriangleExclamation,
    faFileExport,
    faEnvelope,
    faCheckCircle,
    faSearch,
    faUsers,
    faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { teacherService } from '../../services/teacherService';
import styles from './TeacherAnalyticsPage.module.css';

const cx = ClassNames.bind(styles);

const emptyStyle = { textAlign: 'center', padding: '2rem 0', color: '#64748b' };

export default function TeacherAnalyticsPage() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]); // [{ id, name }]
    const [selectedClass, setSelectedClass] = useState('ALL');
    const [activeTab, setActiveTab] = useState('solved'); // 'solved' | 'score' | 'atRisk'
    const [searchQuery, setSearchQuery] = useState('');
    const [alertSentId, setAlertSentId] = useState(null);

    const [kpi, setKpi] = useState(null);
    const [solvers, setSolvers] = useState([]);
    const [atRiskList, setAtRiskList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Danh sách lớp cho bộ lọc
    useEffect(() => {
        let isMounted = true;
        teacherService
            .getClasses()
            .then((list) => {
                if (!isMounted) return;
                setClasses(Array.isArray(list) ? list.map((c) => ({ id: c.id, name: c.name })) : []);
            })
            .catch((err) => console.warn('Không tải được danh sách lớp:', err));
        return () => {
            isMounted = false;
        };
    }, []);

    // Số liệu thống kê: tải lại mỗi khi đổi lớp
    useEffect(() => {
        let isMounted = true;
        const classId = selectedClass === 'ALL' ? '' : selectedClass;

        const fetchAnalytics = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const [kpiRes, solverRes, riskRes] = await Promise.all([
                    teacherService.getKpiSummary(classId),
                    teacherService.getTopSolvers(classId),
                    teacherService.getAtRiskStudents(classId),
                ]);
                if (!isMounted) return;
                setKpi(kpiRes ?? null);
                setSolvers(Array.isArray(solverRes) ? solverRes : []);
                setAtRiskList(Array.isArray(riskRes) ? riskRes : []);
            } catch (err) {
                console.error('Lỗi tải thống kê giảng viên:', err);
                if (isMounted) setError('Không tải được số liệu thống kê. Vui lòng thử lại sau.');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchAnalytics();
        return () => {
            isMounted = false;
        };
    }, [selectedClass]);

    // API trả className đầy đủ ("Kỹ thuật phần mềm 16A"); đổi sang mã lớp nếu tìm thấy
    const classCodeByName = Object.fromEntries(classes.map((c) => [c.name, c.id]));
    const classLabel = (name) => classCodeByName[name] ?? name;

    const handleSendAlert = (st) => {
        setAlertSentId(st.studentId);
        setTimeout(() => {
            // Chưa có API gửi email -> tạm giữ hành vi mô phỏng
            alert(`📧 Đã gửi email đôn đốc học tập tới: ${st.name} (${st.email})`);
            setAlertSentId(null);
        }, 500);
    };

    const handleExportExcel = () => {
        alert('📊 Đang xuất báo cáo: "Bang_Tong_Hop_Hoc_Tap_HaUI_2026.xlsx" bao gồm danh sách điểm & tỷ lệ chuyên cần.');
    };

    // Tìm kiếm ngay trên trình duyệt
    const matchSearch = (st) =>
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) || String(st.studentId).includes(searchQuery);

    const topSolved = solvers.filter(matchSearch).sort((a, b) => b.solvedCount - a.solvedCount || b.score - a.score);
    const topScore = solvers.filter(matchSearch).sort((a, b) => b.score - a.score);
    const atRisk = atRiskList.filter(matchSearch);

    // KPI
    const avgSolved = solvers.length
        ? (solvers.reduce((sum, s) => sum + s.solvedCount, 0) / solvers.length).toFixed(1)
        : '0';
    const classCount = selectedClass === 'ALL' ? classes.length : 1;
    const showValue = (v) => (isLoading || !kpi ? '—' : v);

    const goDetail = (st) =>
        navigate(`/teacher/students/${st.studentId}`, { state: { student: st, className: st.class } });

    const stateMessage = isLoading ? 'Đang tải dữ liệu...' : error;

    const renderStudentCell = (st, red = false) => (
        <div className={cx('studentCell')}>
            <div className={cx('avatarCircle', red && 'avatarRed')}>{st.name.charAt(st.name.lastIndexOf(' ') + 1)}</div>
            <div>
                <strong className={cx('studentName')}>{st.name}</strong>
                <span className={cx('studentId')}>{st.studentId}</span>
            </div>
        </div>
    );

    const rankBadge = (idx) => (
        <span className={cx('rankBadge', idx === 0 && 'rank1', idx === 1 && 'rank2', idx === 2 && 'rank3')}>
            {idx + 1}
        </span>
    );

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
                            Theo dõi mức độ chuyên cần, sinh viên làm nhiều bài tập, điểm số và cảnh báo nguy cơ học tập
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
                                <span className={cx('kpiNumber')}>{showValue(kpi?.totalStudents)}</span>
                                <span className={cx('kpiSub')}>{classCount} Lớp học phần</span>
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
                                <span className={cx('kpiNumber')}>{showValue(avgSolved)}</span>
                                <span className={cx('kpiSub')}>Tỷ lệ AC: {showValue(kpi?.overallPassRate)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className={cx('kpiCard')}>
                        <div className={cx('kpiIcon', 'iconGreen')}>
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                        <div>
                            <span className={cx('kpiLabel')}>Sinh viên đang hoạt động</span>
                            <div className={cx('kpiValueRow')}>
                                <span className={cx('kpiNumber')}>{showValue(kpi?.activeStudents)}</span>
                                <span className={cx('kpiSub')}>{showValue(kpi?.totalSubmissions)} lượt nộp bài</span>
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
                                <span className={cx('kpiNumber', 'textDanger')}>{showValue(kpi?.atRiskCount)}</span>
                                <span className={cx('kpiSub')}>Không hoạt động {'>'} 14 ngày</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Filter Bar */}
                <div className={cx('filterCard')}>
                    <div className={cx('classFilters')}>
                        <span className={cx('filterLabel')}>Lớp học phần:</span>
                        {[{ id: 'ALL', name: 'Tất cả các lớp' }, ...classes].map((cls) => (
                            <button
                                key={cls.id}
                                className={cx('classBtn', selectedClass === cls.id && 'classBtnActive')}
                                onClick={() => setSelectedClass(cls.id)}
                                title={cls.id === 'ALL' ? undefined : cls.name}
                            >
                                {cls.id === 'ALL' ? cls.name : cls.id}
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
                            className={cx('tabBtn', activeTab === 'score' && 'tabBtnActive')}
                            onClick={() => setActiveTab('score')}
                        >
                            <FontAwesomeIcon icon={faClock} className={cx('tabIconBlue')} />
                            Top điểm & Danh hiệu ({topScore.length})
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
                    {activeTab === 'solved' &&
                        (stateMessage ? (
                            <p style={emptyStyle}>{stateMessage}</p>
                        ) : (
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
                                            <th style={{ textAlign: 'center' }}>Lượt nộp bài</th>
                                            <th style={{ textAlign: 'center' }}>Chi tiết</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topSolved.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} style={emptyStyle}>
                                                    Không có dữ liệu phù hợp
                                                </td>
                                            </tr>
                                        ) : (
                                            topSolved.map((st, idx) => (
                                                <tr key={st.id} className={cx('tableRow')}>
                                                    <td style={{ textAlign: 'center' }}>{rankBadge(idx)}</td>
                                                    <td>{renderStudentCell(st)}</td>
                                                    <td>
                                                        <span className={cx('classBadge')}>{classLabel(st.class)}</span>
                                                    </td>
                                                    <td
                                                        style={{ textAlign: 'center', fontWeight: 800, color: '#ea580c' }}
                                                    >
                                                        {st.solvedCount} bài
                                                    </td>
                                                    <td
                                                        style={{ textAlign: 'center', fontWeight: 700, color: '#0f172a' }}
                                                    >
                                                        {st.score.toLocaleString()} pts
                                                    </td>
                                                    <td
                                                        style={{ textAlign: 'center', fontWeight: 700, color: '#16a34a' }}
                                                    >
                                                        {st.passRate}%
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: 'center',
                                                            color: '#64748b',
                                                            fontSize: '0.8rem',
                                                        }}
                                                    >
                                                        {st.submissions}
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <button className={cx('viewBtn')} onClick={() => goDetail(st)}>
                                                            Xem <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ))}

                    {/* TAB 2: TOP SCORE & RANK TITLE */}
                    {activeTab === 'score' &&
                        (stateMessage ? (
                            <p style={emptyStyle}>{stateMessage}</p>
                        ) : (
                            <div className={cx('tableScroll')}>
                                <table className={cx('table')}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '60px', textAlign: 'center' }}>Hạng</th>
                                            <th>Sinh viên</th>
                                            <th>Lớp</th>
                                            <th style={{ textAlign: 'center' }}>Tổng điểm</th>
                                            <th style={{ textAlign: 'center' }}>Số bài AC</th>
                                            <th style={{ textAlign: 'center' }}>Tỷ lệ chính xác</th>
                                            <th style={{ textAlign: 'center' }}>Danh hiệu</th>
                                            <th style={{ textAlign: 'center' }}>Chi tiết</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topScore.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} style={emptyStyle}>
                                                    Không có dữ liệu phù hợp
                                                </td>
                                            </tr>
                                        ) : (
                                            topScore.map((st, idx) => (
                                                <tr key={st.id} className={cx('tableRow')}>
                                                    <td style={{ textAlign: 'center' }}>{rankBadge(idx)}</td>
                                                    <td>{renderStudentCell(st)}</td>
                                                    <td>
                                                        <span className={cx('classBadge')}>{classLabel(st.class)}</span>
                                                    </td>
                                                    <td
                                                        style={{ textAlign: 'center', fontWeight: 800, color: '#2563eb' }}
                                                    >
                                                        {st.score.toLocaleString()} pts
                                                    </td>
                                                    <td
                                                        style={{ textAlign: 'center', fontWeight: 600, color: '#334155' }}
                                                    >
                                                        {st.solvedCount} bài
                                                    </td>
                                                    <td
                                                        style={{ textAlign: 'center', fontWeight: 700, color: '#16a34a' }}
                                                    >
                                                        {st.passRate}%
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <span className={cx('goodBadge')}>
                                                            <FontAwesomeIcon icon={faCheckCircle} /> {st.rankTitle || '—'}
                                                        </span>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        <button className={cx('viewBtn')} onClick={() => goDetail(st)}>
                                                            Xem <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ))}

                    {/* TAB 3: AT RISK */}
                    {activeTab === 'atRisk' && (
                        <div>
                            <div className={cx('warningBanner')}>
                                <FontAwesomeIcon icon={faTriangleExclamation} className={cx('warningIcon')} />
                                <div>
                                    <strong>Cảnh báo học vụ & Chuyên cần:</strong>
                                    <p>
                                        Danh sách sinh viên không hoạt động trong thời gian dài hoặc chưa nộp đủ bài tập.
                                        Giảng viên có thể gửi email cảnh báo trực tiếp từ hệ thống.
                                    </p>
                                </div>
                            </div>

                            {stateMessage ? (
                                <p style={emptyStyle}>{stateMessage}</p>
                            ) : (
                                <div className={cx('tableScroll')}>
                                    <table className={cx('table')}>
                                        <thead>
                                            <tr>
                                                <th>Sinh viên</th>
                                                <th>Lớp</th>
                                                <th style={{ textAlign: 'center' }}>Ngày không hoạt động</th>
                                                <th style={{ textAlign: 'center' }}>Số bài nộp</th>
                                                <th style={{ textAlign: 'center' }}>Lần cuối online</th>
                                                <th>Lý do cảnh báo</th>
                                                <th style={{ textAlign: 'center' }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {atRisk.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} style={emptyStyle}>
                                                        Không có sinh viên nguy cơ
                                                    </td>
                                                </tr>
                                            ) : (
                                                atRisk.map((st) => (
                                                    <tr key={st.id} className={cx('tableRow')}>
                                                        <td>{renderStudentCell(st, true)}</td>
                                                        <td>
                                                            <span className={cx('classBadge')}>
                                                                {classLabel(st.class)}
                                                            </span>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign: 'center',
                                                                fontWeight: 700,
                                                                color: '#dc2626',
                                                            }}
                                                        >
                                                            {st.inactiveDays} ngày
                                                        </td>
                                                        <td style={{ textAlign: 'center', fontWeight: 600 }}>
                                                            {st.submissions} bài
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign: 'center',
                                                                color: '#d97706',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            {st.lastActive ?? 'Chưa ghi nhận'}
                                                        </td>
                                                        <td>
                                                            <span className={cx('riskReason')}>
                                                                {st.reason ||
                                                                    'Chưa hoàn thành đủ số lượng bài tập tối thiểu'}
                                                            </span>
                                                        </td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <button
                                                                className={cx('emailBtn')}
                                                                onClick={() => handleSendAlert(st)}
                                                            >
                                                                <FontAwesomeIcon icon={faEnvelope} />
                                                                {alertSentId === st.studentId
                                                                    ? 'Đang gửi...'
                                                                    : 'Gửi email nhắc'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
