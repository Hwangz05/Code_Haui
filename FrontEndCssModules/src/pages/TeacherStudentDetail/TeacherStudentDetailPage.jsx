import React, { useState } from 'react';
import ClassNames from 'classnames/bind';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faFireFlameCurved,
    faTrophy,
    faClock,
    faCheckCircle,
    faXmarkCircle,
    faTriangleExclamation,
    faEnvelope,
    faChartLine,
    faCalendarDays,
    faCode,
    faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

import styles from './TeacherStudentDetailPage.module.css';

const cx = ClassNames.bind(styles);

// ─── Mock Submission Data ────────────────────────────────────────────────────
const MOCK_SUBMISSIONS = [
    { id: 1, problem: 'Tổng hai số', difficulty: 'Dễ', status: 'AC', time: '2026-09-20 14:30', lang: 'Python', runtime: '42ms', score: 100 },
    { id: 2, problem: 'Chuỗi palindrome', difficulty: 'Trung bình', status: 'AC', time: '2026-09-19 10:15', lang: 'C++', runtime: '8ms', score: 100 },
    { id: 3, problem: 'Đồ thị BFS', difficulty: 'Khó', status: 'WA', time: '2026-09-18 16:45', lang: 'Java', runtime: '—', score: 0 },
    { id: 4, problem: 'Sắp xếp nhanh', difficulty: 'Trung bình', status: 'AC', time: '2026-09-17 09:00', lang: 'C++', runtime: '12ms', score: 90 },
    { id: 5, problem: 'Cây nhị phân tìm kiếm', difficulty: 'Trung bình', status: 'TLE', time: '2026-09-16 20:30', lang: 'Python', runtime: '>2000ms', score: 0 },
    { id: 6, problem: 'Quy hoạch động cơ bản', difficulty: 'Khó', status: 'AC', time: '2026-09-15 11:00', lang: 'C++', runtime: '24ms', score: 100 },
    { id: 7, problem: 'Số Fibonacci', difficulty: 'Dễ', status: 'AC', time: '2026-09-14 08:20', lang: 'Python', runtime: '55ms', score: 100 },
    { id: 8, problem: 'Đảo ngược mảng', difficulty: 'Dễ', status: 'AC', time: '2026-09-13 15:10', lang: 'Java', runtime: '38ms', score: 100 },
];

// 7 ngày học tập giả lập
const WEEKLY_ACTIVITY = [
    { day: 'T2', hours: 2.5, submissions: 3 },
    { day: 'T3', hours: 1.0, submissions: 1 },
    { day: 'T4', hours: 3.5, submissions: 5 },
    { day: 'T5', hours: 0, submissions: 0 },
    { day: 'T6', hours: 2.0, submissions: 2 },
    { day: 'T7', hours: 4.5, submissions: 6 },
    { day: 'CN', hours: 1.5, submissions: 2 },
];

const MAX_HOURS = Math.max(...WEEKLY_ACTIVITY.map((d) => d.hours));

const DIFF_COLOR = {
    'Dễ': 'var(--color-success)',
    'Trung bình': '#f59e0b',
    'Khó': 'var(--color-danger)',
};

const STATUS_CONFIG = {
    AC: { label: 'Đúng', color: 'var(--color-success)', bg: 'rgba(16,185,129,0.1)' },
    WA: { label: 'Sai', color: 'var(--color-danger)', bg: 'rgba(244,63,94,0.1)' },
    TLE: { label: 'Quá thời gian', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    MLE: { label: 'Tràn bộ nhớ', color: 'var(--color-info)', bg: 'rgba(56,189,248,0.1)' },
};

export default function TeacherStudentDetailPage() {
    const { studentId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('submissions');
    const [emailSent, setEmailSent] = useState(false);

    // Lấy dữ liệu được truyền từ trang Classes, hoặc dùng mock
    const student = location.state?.student || {
        id: studentId,
        name: 'Nguyễn Văn An',
        score: 1250,
        solved: 48,
        streak: 12,
        studyHours: 87,
        status: 'GOOD',
    };
    const className = location.state?.className || 'DHKTPM16A';

    const acCount = MOCK_SUBMISSIONS.filter((s) => s.status === 'AC').length;
    const acRate = Math.round((acCount / MOCK_SUBMISSIONS.length) * 100);

    const handleSendEmail = () => {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 3000);
    };

    const tabs = [
        { id: 'submissions', label: 'Lịch sử nộp bài', icon: faCode },
        { id: 'activity', label: 'Hoạt động tuần', icon: faChartLine },
    ];

    return (
        <div className={cx('page')}>
            <div className={cx('container')}>
                {/* Back button */}
                <button className={cx('backBtn')} onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Quay lại danh sách lớp
                </button>

                {/* Student Profile Banner */}
                <div className={cx('profileBanner')}>
                    <div className={cx('profileLeft')}>
                        <div className={cx('avatarLarge')}>
                            {student.name.charAt(student.name.lastIndexOf(' ') + 1)}
                        </div>
                        <div className={cx('profileInfo')}>
                            <h1 className={cx('studentName')}>{student.name}</h1>
                            <p className={cx('studentMeta')}>
                                MSSV: <span>{student.id}</span> · Lớp: <span>{className}</span>
                            </p>
                            <span
                                className={cx('statusTag')}
                                style={{
                                    color: student.status === 'GOOD' ? 'var(--color-success)' : student.status === 'WARNING' ? '#f59e0b' : 'var(--color-danger)',
                                    background: student.status === 'GOOD' ? 'rgba(16,185,129,0.1)' : student.status === 'WARNING' ? 'rgba(245,158,11,0.1)' : 'rgba(244,63,94,0.1)',
                                }}
                            >
                                {student.status === 'GOOD' ? (
                                    <><FontAwesomeIcon icon={faCircleCheck} /> Học tốt</>
                                ) : student.status === 'WARNING' ? (
                                    <><FontAwesomeIcon icon={faTriangleExclamation} /> Cần theo dõi</>
                                ) : (
                                    <><FontAwesomeIcon icon={faTriangleExclamation} /> Cần hỗ trợ ngay</>
                                )}
                            </span>
                        </div>
                    </div>
                    <button
                        className={cx('emailBtn', emailSent && 'emailBtnSent')}
                        onClick={handleSendEmail}
                    >
                        <FontAwesomeIcon icon={faEnvelope} />
                        {emailSent ? '✓ Đã gửi email!' : 'Gửi email nhắc nhở'}
                    </button>
                </div>

                {/* KPI Cards */}
                <div className={cx('kpiGrid')}>
                    <div className={cx('kpiCard')}>
                        <div className={cx('kpiIcon')} style={{ color: '#f97316', background: 'rgba(249,115,22,0.1)' }}>
                            <FontAwesomeIcon icon={faTrophy} />
                        </div>
                        <div>
                            <p className={cx('kpiValue')}>{student.score.toLocaleString()}</p>
                            <p className={cx('kpiLabel')}>Tổng điểm</p>
                        </div>
                    </div>
                    <div className={cx('kpiCard')}>
                        <div className={cx('kpiIcon')} style={{ color: 'var(--color-success)', background: 'rgba(16,185,129,0.1)' }}>
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                        <div>
                            <p className={cx('kpiValue')}>{student.solved}</p>
                            <p className={cx('kpiLabel')}>Bài đã giải</p>
                        </div>
                    </div>
                    <div className={cx('kpiCard')}>
                        <div className={cx('kpiIcon')} style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.1)' }}>
                            <FontAwesomeIcon icon={faFireFlameCurved} />
                        </div>
                        <div>
                            <p className={cx('kpiValue')}>{student.streak} ngày</p>
                            <p className={cx('kpiLabel')}>Streak hiện tại</p>
                        </div>
                    </div>
                    <div className={cx('kpiCard')}>
                        <div className={cx('kpiIcon')} style={{ color: 'var(--color-info)', background: 'rgba(56,189,248,0.1)' }}>
                            <FontAwesomeIcon icon={faClock} />
                        </div>
                        <div>
                            <p className={cx('kpiValue')}>{student.studyHours}h</p>
                            <p className={cx('kpiLabel')}>Tổng giờ học</p>
                        </div>
                    </div>
                    <div className={cx('kpiCard')}>
                        <div className={cx('kpiIcon')} style={{ color: 'var(--color-success)', background: 'rgba(16,185,129,0.1)' }}>
                            <FontAwesomeIcon icon={faCircleCheck} />
                        </div>
                        <div>
                            <p className={cx('kpiValue')}>{acRate}%</p>
                            <p className={cx('kpiLabel')}>Tỷ lệ AC</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className={cx('tabBar')}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={cx('tabBtn', activeTab === tab.id && 'tabBtnActive')}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <FontAwesomeIcon icon={tab.icon} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab: Submissions */}
                {activeTab === 'submissions' && (
                    <div className={cx('card')}>
                        <div className={cx('cardHeader')}>
                            <h2 className={cx('cardTitle')}>Lịch sử nộp bài</h2>
                            <span className={cx('cardBadge')}>{MOCK_SUBMISSIONS.length} lần nộp</span>
                        </div>
                        <div className={cx('tableScroll')}>
                            <table className={cx('table')}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Bài tập</th>
                                        <th>Độ khó</th>
                                        <th>Kết quả</th>
                                        <th>Ngôn ngữ</th>
                                        <th>Thời gian chạy</th>
                                        <th>Điểm</th>
                                        <th>Thời gian nộp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_SUBMISSIONS.map((sub, idx) => {
                                        const st = STATUS_CONFIG[sub.status] || STATUS_CONFIG.WA;
                                        return (
                                            <tr key={sub.id} className={cx('tableRow')}>
                                                <td className={cx('rankCell')}>{idx + 1}</td>
                                                <td className={cx('problemCell')}>{sub.problem}</td>
                                                <td>
                                                    <span style={{ color: DIFF_COLOR[sub.difficulty], fontWeight: 600, fontSize: '0.8rem' }}>
                                                        {sub.difficulty}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={cx('statusChip')} style={{ color: st.color, background: st.bg }}>
                                                        {sub.status === 'AC' ? (
                                                            <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 4 }} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faXmarkCircle} style={{ marginRight: 4 }} />
                                                        )}
                                                        {sub.status}
                                                    </span>
                                                </td>
                                                <td className={cx('langCell')}>{sub.lang}</td>
                                                <td className={cx('runtimeCell')}>{sub.runtime}</td>
                                                <td className={cx('scoreCell', sub.status === 'AC' && 'scoreCellGood')}>
                                                    {sub.score > 0 ? `+${sub.score}` : sub.score}
                                                </td>
                                                <td className={cx('timeCell')}>{sub.time}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab: Activity Chart */}
                {activeTab === 'activity' && (
                    <div className={cx('card')}>
                        <div className={cx('cardHeader')}>
                            <h2 className={cx('cardTitle')}>
                                <FontAwesomeIcon icon={faCalendarDays} style={{ marginRight: 8 }} />
                                Hoạt động 7 ngày qua
                            </h2>
                        </div>
                        <div className={cx('activityChart')}>
                            {WEEKLY_ACTIVITY.map((day) => (
                                <div key={day.day} className={cx('activityCol')}>
                                    <div className={cx('barWrap')}>
                                        <div
                                            className={cx('bar')}
                                            style={{
                                                height: `${(day.hours / MAX_HOURS) * 100}%`,
                                                background: day.hours === 0 ? 'var(--border-color)' : 'var(--color-primary)',
                                            }}
                                            title={`${day.hours}h`}
                                        />
                                    </div>
                                    <p className={cx('barHours')}>{day.hours}h</p>
                                    <p className={cx('barDay')}>{day.day}</p>
                                    <p className={cx('barSubs')}>{day.submissions} bài</p>
                                </div>
                            ))}
                        </div>
                        <div className={cx('activitySummary')}>
                            <div className={cx('actStat')}>
                                <span className={cx('actStatValue')}>
                                    {WEEKLY_ACTIVITY.reduce((s, d) => s + d.hours, 0).toFixed(1)}h
                                </span>
                                <span className={cx('actStatLabel')}>Tổng giờ tuần này</span>
                            </div>
                            <div className={cx('actStat')}>
                                <span className={cx('actStatValue')}>
                                    {WEEKLY_ACTIVITY.reduce((s, d) => s + d.submissions, 0)}
                                </span>
                                <span className={cx('actStatLabel')}>Tổng lần nộp</span>
                            </div>
                            <div className={cx('actStat')}>
                                <span className={cx('actStatValue')}>
                                    {WEEKLY_ACTIVITY.filter((d) => d.hours > 0).length}/7
                                </span>
                                <span className={cx('actStatLabel')}>Ngày có hoạt động</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
