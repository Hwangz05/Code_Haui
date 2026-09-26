import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import styles from './TeacherDashboardPage.module.css';

export default function TeacherDashboardPage() {
    const [selectedClass, setSelectedClass] = useState('ALL');
    const [timeRange, setTimeRange] = useState('WEEK');
    const [activeTab, setActiveTab] = useState('solved'); // 'solved' | 'time' | 'atRisk' | 'problems'
    const [searchStudent, setSearchStudent] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [alertSentId, setAlertSentId] = useState(null);

    // Form state for creating problem
    const [newProblem, setNewProblem] = useState({
        title: '',
        category: 'Lập trình Java',
        difficulty: 'Dễ',
        points: 100,
        timeLimit: '1.0s',
        memLimit: '256MB',
        statement: '',
        sampleInput: '',
        sampleOutput: '',
    });

    const [createdProblemsList, setCreatedProblemsList] = useState([
        { id: 1, title: 'Tìm số lớn nhất trong mảng', category: 'Java Core', difficulty: 'Dễ', submissions: 156, acRate: '88.4%', createdDate: '15/09/2026' },
        { id: 2, title: 'Quản lý Nhân viên kế thừa OOP', category: 'Java OOP', difficulty: 'Trung bình', submissions: 112, acRate: '72.1%', createdDate: '18/09/2026' },
        { id: 3, title: 'Cây nhị phân tìm kiếm BST', category: 'Cấu trúc dữ liệu', difficulty: 'Khó', submissions: 84, acRate: '45.8%', createdDate: '20/09/2026' },
    ]);

    // Mock Students Database for Teacher Analytics
    const studentsData = [
        { id: 1, name: 'Trần Văn Mạnh', studentId: '2020601111', class: 'DHKTPM16A', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80', solvedCount: 54, score: 1850, acRate: '94.2%', timeSpent: '48.5 giờ', streak: 24, lastActive: '10 phút trước', status: 'GOOD' },
        { id: 2, name: 'Lê Quỳnh Trang', studentId: '2022604567', class: 'DHKTPM16A', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80', solvedCount: 49, score: 1720, acRate: '91.0%', timeSpent: '42.0 giờ', streak: 19, lastActive: '35 phút trước', status: 'GOOD' },
        { id: 3, name: 'Nguyễn Văn An', studentId: '2021600123', class: 'DHKTPM16A', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80', solvedCount: 48, score: 1690, acRate: '89.5%', timeSpent: '38.5 giờ', streak: 14, lastActive: '1 giờ trước', status: 'GOOD' },
        { id: 4, name: 'Phạm Đức Long', studentId: '2021603344', class: 'DHKTPM16B', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&auto=format&fit=crop&q=80', solvedCount: 45, score: 1540, acRate: '86.0%', timeSpent: '36.2 giờ', streak: 12, lastActive: '3 giờ trước', status: 'GOOD' },
        { id: 5, name: 'Hoàng Minh Tuấn', studentId: '2022607890', class: 'DHTH15', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80', solvedCount: 41, score: 1420, acRate: '82.4%', timeSpent: '33.0 giờ', streak: 10, lastActive: '5 giờ trước', status: 'GOOD' },
        { id: 6, name: 'Đỗ Thùy Linh', studentId: '2021609988', class: 'DHKTPM16B', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&auto=format&fit=crop&q=80', solvedCount: 38, score: 1310, acRate: '79.0%', timeSpent: '29.5 giờ', streak: 8, lastActive: 'Hôm qua', status: 'GOOD' },
        { id: 7, name: 'Bùi Quốc Anh', studentId: '2022601122', class: 'DHTH15', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80', solvedCount: 12, score: 350, acRate: '40.0%', timeSpent: '4.2 giờ', streak: 0, lastActive: '5 ngày trước', status: 'WARNING' },
        { id: 8, name: 'Vũ Hải Nam', studentId: '2021605566', class: 'DHKTPM16A', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&auto=format&fit=crop&q=80', solvedCount: 6, score: 180, acRate: '28.5%', timeSpent: '2.1 giờ', streak: 0, lastActive: '8 ngày trước', status: 'DANGER' },
        { id: 9, name: 'Ngô Khánh Huyền', studentId: '2022608899', class: 'DHKTPM16B', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&auto=format&fit=crop&q=80', solvedCount: 4, score: 100, acRate: '22.0%', timeSpent: '1.5 giờ', streak: 0, lastActive: '10 ngày trước', status: 'DANGER' },
    ];

    // Filter students
    const filteredStudents = studentsData.filter((st) => {
        const matchClass = selectedClass === 'ALL' || st.class === selectedClass;
        const matchSearch = st.name.toLowerCase().includes(searchStudent.toLowerCase()) || st.studentId.includes(searchStudent);
        return matchClass && matchSearch;
    });

    // Sorted by criteria
    const topSolvedStudents = [...filteredStudents].sort((a, b) => b.solvedCount - a.solvedCount);
    const topTimeStudents = [...filteredStudents].sort((a, b) => parseFloat(b.timeSpent) - parseFloat(a.timeSpent));
    const atRiskStudents = filteredStudents.filter((st) => st.status === 'WARNING' || st.status === 'DANGER');

    const handleCreateProblemSubmit = (e) => {
        e.preventDefault();
        if (!newProblem.title.trim()) return;

        const created = {
            id: createdProblemsList.length + 1,
            title: newProblem.title,
            category: newProblem.category,
            difficulty: newProblem.difficulty,
            submissions: 0,
            acRate: '100%',
            createdDate: 'Hôm nay',
        };

        setCreatedProblemsList([created, ...createdProblemsList]);
        setIsCreateModalOpen(false);
        setNewProblem({
            title: '',
            category: 'Lập trình Java',
            difficulty: 'Dễ',
            points: 100,
            timeLimit: '1.0s',
            memLimit: '256MB',
            statement: '',
            sampleInput: '',
            sampleOutput: '',
        });
        alert(`✅ Đã xuất bản bài tập "${created.title}" thành công cho sinh viên HaUI làm bài!`);
    };

    const handleSendAlert = (studentId, studentName) => {
        setAlertSentId(studentId);
        setTimeout(() => {
            alert(`📧 Đã gửi email nhắc nhở học tập tự động tới sinh viên: ${studentName} (${studentId}@sv.haui.edu.vn)`);
            setAlertSentId(null);
        }, 600);
    };

    const handleExportExcel = () => {
        alert('📊 Đang xuất file "Bang_Diem_Chuyen_Can_HaUI_2026.xlsx" chứa danh sách 168 sinh viên...');
    };

    return (
        <div className={`container ${styles.pageWrapper}`}>
            {/* 1. TEACHER PROFILE HEADER */}
            <div className={styles.teacherBanner}>
                <div className={styles.teacherInfoLeft}>
                    <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                        alt="Giảng viên HaUI"
                        className={styles.teacherAvatar}
                    />
                    <div>
                        <div className={styles.roleBadgeRow}>
                            <Badge variant="purple">👨‍🏫 GIẢNG VIÊN HAUI</Badge>
                            <span className={styles.teacherIdTag}>Mã GV: GV2026</span>
                            <span className={styles.deptTag}>Khoa Công nghệ Thông tin</span>
                        </div>
                        <h1 className={styles.teacherName}>TS. Nguyễn Văn Hùng</h1>
                        <p className={styles.teacherSub}>
                            Bộ môn Kỹ thuật Phần mềm • Phụ trách: <strong>DHKTPM16A, DHKTPM16B, DHTH15</strong> (168 sinh viên)
                        </p>
                    </div>
                </div>

                <div className={styles.teacherActionsRight}>
                    <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)}>
                        ➕ Đăng bài tập mới
                    </Button>
                    <Button variant="secondary" size="md" onClick={handleExportExcel}>
                        📊 Xuất bảng điểm Excel
                    </Button>
                </div>
            </div>

            {/* 2. STATS KPI CARDS */}
            <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                    <span className={styles.kpiLabel}>TỔNG SINH VIÊN QUẢN LÝ</span>
                    <div className={styles.kpiValueRow}>
                        <span className={styles.kpiNumber} style={{ color: 'var(--color-primary)' }}>168</span>
                        <span className={styles.kpiSub}>3 Lớp học phần</span>
                    </div>
                </div>

                <div className={styles.kpiCard}>
                    <span className={styles.kpiLabel}>BÀI NỘP HÔM NAY</span>
                    <div className={styles.kpiValueRow}>
                        <span className={styles.kpiNumber} style={{ color: 'var(--color-success)' }}>142</span>
                        <span className={styles.kpiSub}>Tỷ lệ AC: 94.2%</span>
                    </div>
                </div>

                <div className={styles.kpiCard}>
                    <span className={styles.kpiLabel}>THỜI GIAN HỌC TRUNG BÌNH</span>
                    <div className={styles.kpiValueRow}>
                        <span className={styles.kpiNumber} style={{ color: '#38bdf8' }}>2.8h</span>
                        <span className={styles.kpiSub}>/ sinh viên / ngày</span>
                    </div>
                </div>

                <div className={styles.kpiCard}>
                    <span className={styles.kpiLabel}>SINH VIÊN CẦN CHÚ Ý</span>
                    <div className={styles.kpiValueRow}>
                        <span className={styles.kpiNumber} style={{ color: '#ef4444' }}>{atRiskStudents.length}</span>
                        <span className={styles.kpiSub}>Vắng {'>'} 5 ngày</span>
                    </div>
                </div>
            </div>

            {/* 3. FILTER CONTROLS BAR */}
            <div className={styles.filterBar}>
                <div className={styles.filterLeft}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Lớp học phần:</span>
                    <div className={styles.classBtnGroup}>
                        {[
                            { key: 'ALL', label: 'Tất cả các lớp (168)' },
                            { key: 'DHKTPM16A', label: 'DHKTPM16A - Java' },
                            { key: 'DHKTPM16B', label: 'DHKTPM16B - DSA' },
                            { key: 'DHTH15', label: 'DHTH15 - Web' },
                        ].map((cls) => (
                            <button
                                key={cls.key}
                                onClick={() => setSelectedClass(cls.key)}
                                className={`${styles.classBtn} ${selectedClass === cls.key ? styles.classBtnActive : ''}`}
                            >
                                {cls.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.filterRight}>
                    <input
                        type="text"
                        placeholder="Tìm tên hoặc MSSV..."
                        value={searchStudent}
                        onChange={(e) => setSearchStudent(e.target.value)}
                        className={styles.searchInput}
                    />
                    <div className={styles.timeRangeSelect}>
                        <button
                            className={`${styles.timeBtn} ${timeRange === 'WEEK' ? styles.timeBtnActive : ''}`}
                            onClick={() => setTimeRange('WEEK')}
                        >
                            🔥 Tuần này
                        </button>
                        <button
                            className={`${styles.timeBtn} ${timeRange === 'MONTH' ? styles.timeBtnActive : ''}`}
                            onClick={() => setTimeRange('MONTH')}
                        >
                            📅 Tháng này
                        </button>
                        <button
                            className={`${styles.timeBtn} ${timeRange === 'ALL' ? styles.timeBtnActive : ''}`}
                            onClick={() => setTimeRange('ALL')}
                        >
                            ⭐ Toàn khóa
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. MAIN ANALYTICS TABS */}
            <div className={styles.analyticsSection}>
                <div className={styles.tabsHeader}>
                    <button
                        className={`${styles.analyticsTab} ${activeTab === 'solved' ? styles.analyticsTabActive : ''}`}
                        onClick={() => setActiveTab('solved')}
                    >
                        🏆 Top Làm Nhiều Bài Nhất ({topSolvedStudents.length})
                    </button>
                    <button
                        className={`${styles.analyticsTab} ${activeTab === 'time' ? styles.analyticsTabActive : ''}`}
                        onClick={() => setActiveTab('time')}
                    >
                        ⏱️ Top Học Lâu & Chăm Chỉ Nhất ({topTimeStudents.length})
                    </button>
                    <button
                        className={`${styles.analyticsTab} ${activeTab === 'atRisk' ? styles.analyticsTabActive : ''}`}
                        onClick={() => setActiveTab('atRisk')}
                    >
                        ⚠️ Sinh Viên Có Nguy Cơ / Lười Học ({atRiskStudents.length})
                    </button>
                    <button
                        className={`${styles.analyticsTab} ${activeTab === 'problems' ? styles.analyticsTabActive : ''}`}
                        onClick={() => setActiveTab('problems')}
                    >
                        📝 Kho Bài Tập Đã Đăng ({createdProblemsList.length})
                    </button>
                </div>

                {/* TAB 1: MOST SOLVED PROBLEMS */}
                {activeTab === 'solved' && (
                    <div className={styles.tableCard}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{ width: '4rem', textAlign: 'center' }}>Hạng</th>
                                    <th>Sinh viên</th>
                                    <th>Lớp</th>
                                    <th style={{ textAlign: 'center' }}>Số bài đã giải (AC)</th>
                                    <th style={{ textAlign: 'center' }}>Điểm tích lũy</th>
                                    <th style={{ textAlign: 'center' }}>Tỷ lệ chính xác</th>
                                    <th style={{ textAlign: 'center' }}>Hoạt động gần nhất</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topSolvedStudents.map((st, idx) => (
                                    <tr key={st.id}>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`${styles.rankBadge} ${idx === 0 ? styles.rank1 : idx === 1 ? styles.rank2 : idx === 2 ? styles.rank3 : ''}`}>
                                                {idx + 1}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.studentUserCell}>
                                                <img src={st.avatar} alt={st.name} className={styles.studentAvatar} />
                                                <div>
                                                    <strong className={styles.studentNameText}>{st.name}</strong>
                                                    <small className={styles.studentIdText}>{st.studentId}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td><Badge variant="slate">{st.class}</Badge></td>
                                        <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--color-primary)' }}>
                                            {st.solvedCount} bài
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: 700 }}>
                                            {st.score} pts
                                        </td>
                                        <td style={{ textAlign: 'center', color: 'var(--color-success)', fontWeight: 700 }}>
                                            {st.acRate}
                                        </td>
                                        <td style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                                            {st.lastActive}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TAB 2: MOST TIME SPENT & STREAK */}
                {activeTab === 'time' && (
                    <div className={styles.tableCard}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{ width: '4rem', textAlign: 'center' }}>Hạng</th>
                                    <th>Sinh viên</th>
                                    <th>Lớp</th>
                                    <th style={{ textAlign: 'center' }}>Tổng thời gian học thực tế</th>
                                    <th style={{ textAlign: 'center' }}>Chuỗi chăm chỉ (Streak)</th>
                                    <th style={{ textAlign: 'center' }}>Số bài hoàn thành</th>
                                    <th style={{ textAlign: 'center' }}>Đánh giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topTimeStudents.map((st, idx) => (
                                    <tr key={st.id}>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`${styles.rankBadge} ${idx === 0 ? styles.rank1 : idx === 1 ? styles.rank2 : idx === 2 ? styles.rank3 : ''}`}>
                                                {idx + 1}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.studentUserCell}>
                                                <img src={st.avatar} alt={st.name} className={styles.studentAvatar} />
                                                <div>
                                                    <strong className={styles.studentNameText}>{st.name}</strong>
                                                    <small className={styles.studentIdText}>{st.studentId}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td><Badge variant="slate">{st.class}</Badge></td>
                                        <td style={{ textAlign: 'center', fontWeight: 800, color: '#38bdf8' }}>
                                            ⏱️ {st.timeSpent}
                                        </td>
                                        <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--color-primary)' }}>
                                            🔥 {st.streak} ngày liên tục
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{st.solvedCount} bài</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Badge variant="green">Rất tích cực</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TAB 3: AT-RISK STUDENTS */}
                {activeTab === 'atRisk' && (
                    <div className={styles.tableCard}>
                        <div className={styles.warningAlertBox}>
                            ⚠️ <strong>Danh sách cảnh báo:</strong> Các sinh viên dưới đây chưa đăng nhập vào học trên 5 ngày hoặc tỷ lệ giải bài dưới 40%. Giảng viên có thể gửi email cảnh báo trực tiếp.
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Sinh viên</th>
                                    <th>Lớp</th>
                                    <th style={{ textAlign: 'center' }}>Thời gian học</th>
                                    <th style={{ textAlign: 'center' }}>Số bài đã nộp</th>
                                    <th style={{ textAlign: 'center' }}>Lần cuối online</th>
                                    <th style={{ textAlign: 'center' }}>Tình trạng</th>
                                    <th style={{ textAlign: 'center' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {atRiskStudents.map((st) => (
                                    <tr key={st.id}>
                                        <td>
                                            <div className={styles.studentUserCell}>
                                                <img src={st.avatar} alt={st.name} className={styles.studentAvatar} />
                                                <div>
                                                    <strong className={styles.studentNameText}>{st.name}</strong>
                                                    <small className={styles.studentIdText}>{st.studentId}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td><Badge variant="slate">{st.class}</Badge></td>
                                        <td style={{ textAlign: 'center', color: '#ef4444', fontWeight: 700 }}>
                                            {st.timeSpent}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{st.solvedCount} bài</td>
                                        <td style={{ textAlign: 'center', color: '#f59e0b', fontWeight: 600 }}>
                                            {st.lastActive}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Badge variant={st.status === 'DANGER' ? 'red' : 'yellow'}>
                                                {st.status === 'DANGER' ? 'Vắng nhiều ngày' : 'Cần đôn đốc'}
                                            </Badge>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSendAlert(st.studentId, st.name)}
                                            >
                                                {alertSentId === st.studentId ? 'Đang gửi...' : '✉️ Gửi nhắc nhở'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TAB 4: CREATED PROBLEMS */}
                {activeTab === 'problems' && (
                    <div className={styles.tableCard}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                            <strong style={{ color: '#fff' }}>Danh sách bài tập do bạn biên soạn</strong>
                            <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                                ➕ Thêm bài tập mới
                            </Button>
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Mã bài</th>
                                    <th>Tên bài tập</th>
                                    <th>Chủ đề</th>
                                    <th>Độ khó</th>
                                    <th style={{ textAlign: 'center' }}>Lượt nộp bài</th>
                                    <th style={{ textAlign: 'center' }}>Tỷ lệ AC</th>
                                    <th style={{ textAlign: 'center' }}>Ngày tạo</th>
                                    <th style={{ textAlign: 'center' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {createdProblemsList.map((p) => (
                                    <tr key={p.id}>
                                        <td style={{ fontWeight: 700, color: 'var(--text-dim)' }}>#{p.id}</td>
                                        <td><strong style={{ color: '#fff' }}>{p.title}</strong></td>
                                        <td><Badge variant="blue">{p.category}</Badge></td>
                                        <td>
                                            <Badge variant={p.difficulty === 'Dễ' ? 'green' : p.difficulty === 'Trung bình' ? 'yellow' : 'red'}>
                                                {p.difficulty}
                                            </Badge>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{p.submissions} lượt</td>
                                        <td style={{ textAlign: 'center', color: 'var(--color-success)', fontWeight: 700 }}>{p.acRate}</td>
                                        <td style={{ textAlign: 'center', color: 'var(--text-dim)' }}>{p.createdDate}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Link to="/thi-dau/tim-so-lon-nhat">
                                                <Button variant="secondary" size="sm">Xem thử</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 5. MODAL: CREATE PROBLEM FORM */}
            {isCreateModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalBox}>
                        <div className={styles.modalHeader}>
                            <h2 style={{ color: '#fff', fontSize: '1.25rem', margin: 0 }}>➕ Đăng bài tập mới vào hệ thống</h2>
                            <button className={styles.modalCloseBtn} onClick={() => setIsCreateModalOpen(false)}>✕</button>
                        </div>

                        <form onSubmit={handleCreateProblemSubmit} className={styles.modalBody}>
                            <div className={styles.formRow}>
                                <div style={{ flex: 2 }}>
                                    <label className={styles.formLabel}>Tiêu đề bài tập *</label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Tính tổng các số chẵn trong mảng"
                                        value={newProblem.title}
                                        onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                                        className={styles.modalInput}
                                        required
                                    />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <label className={styles.formLabel}>Chủ đề môn học</label>
                                    <select
                                        value={newProblem.category}
                                        onChange={(e) => setNewProblem({ ...newProblem, category: e.target.value })}
                                        className={styles.modalSelect}
                                    >
                                        <option value="Java Core">Java Core</option>
                                        <option value="Java OOP">Java OOP</option>
                                        <option value="Cấu trúc dữ liệu">Cấu trúc dữ liệu</option>
                                        <option value="Lập trình C/C++">Lập trình C/C++</option>
                                        <option value="Lập trình Web">Lập trình Web</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div>
                                    <label className={styles.formLabel}>Độ khó</label>
                                    <select
                                        value={newProblem.difficulty}
                                        onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                                        className={styles.modalSelect}
                                    >
                                        <option value="Dễ">Dễ (Easy)</option>
                                        <option value="Trung bình">Trung bình (Medium)</option>
                                        <option value="Khó">Khó (Hard)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={styles.formLabel}>Điểm rèn luyện</label>
                                    <input
                                        type="number"
                                        value={newProblem.points}
                                        onChange={(e) => setNewProblem({ ...newProblem, points: Number(e.target.value) })}
                                        className={styles.modalInput}
                                    />
                                </div>

                                <div>
                                    <label className={styles.formLabel}>Giới hạn thời gian</label>
                                    <input
                                        type="text"
                                        value={newProblem.timeLimit}
                                        onChange={(e) => setNewProblem({ ...newProblem, timeLimit: e.target.value })}
                                        className={styles.modalInput}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={styles.formLabel}>Nội dung đề bài (Hỗ trợ Markdown) *</label>
                                <textarea
                                    rows="4"
                                    placeholder="Mô tả chi tiết bài toán, yêu cầu đầu vào (Input) và đầu ra (Output)..."
                                    value={newProblem.statement}
                                    onChange={(e) => setNewProblem({ ...newProblem, statement: e.target.value })}
                                    className={styles.modalTextarea}
                                    required
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div style={{ flex: 1 }}>
                                    <label className={styles.formLabel}>Test case Mẫu Input</label>
                                    <textarea
                                        rows="3"
                                        placeholder="5&#10;1 2 3 4 5"
                                        value={newProblem.sampleInput}
                                        onChange={(e) => setNewProblem({ ...newProblem, sampleInput: e.target.value })}
                                        className={styles.modalTextarea}
                                    />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <label className={styles.formLabel}>Test case Mẫu Output</label>
                                    <textarea
                                        rows="3"
                                        placeholder="6"
                                        value={newProblem.sampleOutput}
                                        onChange={(e) => setNewProblem({ ...newProblem, sampleOutput: e.target.value })}
                                        className={styles.modalTextarea}
                                    />
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <Button variant="secondary" size="md" type="button" onClick={() => setIsCreateModalOpen(false)}>
                                    Hủy bỏ
                                </Button>
                                <Button variant="primary" size="md" type="submit">
                                    🚀 Xuất bản bài tập cho SV làm bài
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
