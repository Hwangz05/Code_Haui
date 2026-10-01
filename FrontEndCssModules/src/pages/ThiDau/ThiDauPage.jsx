import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClassNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faKhanda,
    faFire,
    faMagnifyingGlass,
    faCheck,
    faTrophy,
    faArrowRight,
    faMedal,
    faUser,
    faCircle,
    faPencil,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleDot } from '@fortawesome/free-regular-svg-icons';

import { ROUTES } from '../../config/routes.config';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import styles from './ThiDauPage.module.css';
import { leaderboardService, mapApiStudent } from '../../services/leaderboardService';
import {
    problemService,
    mapHauiProblemFromApi,
    mapLeetCodeProblemFromApi,
} from '../../services/problemService';
import { userService } from '../../services/userService';
import { useAuthContext } from '../../context/AuthContext';
const cx = ClassNames.bind(styles);

const defaultTopStudents = [
    { rank: 1, name: 'Trần Văn Mạnh', id: '2020601111', solved: 5, points: 3840, medal: 'gold', isMe: false },
    { rank: 2, name: 'Lê Quỳnh Trang', id: '2022604567', solved: 5, points: 3410, medal: 'silver', isMe: false },
    { rank: 3, name: 'Trịnh Gia Bảo', id: '2022601999', solved: 3, points: 2980, medal: 'bronze', isMe: false },
    { rank: 4, name: 'Phan Thanh Tùng', id: '2020603412', solved: 4, points: 2650, medal: 'none', isMe: false },
    { rank: 5, name: 'Tạ Minh Quang', id: '2021604477', solved: 2, points: 2200, medal: 'none', isMe: false },
];

export default function ThiDauPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeTab, setActiveTab] = useState('all');
    const [topStudents, setTopStudents] = useState(defaultTopStudents);
    const [problems, setProblems] = useState([]);
    const [loadingProblems, setLoadingProblems] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const { user } = useAuthContext();

    const isTeacher =
        user?.role === 'TEACHER' ||
        (user?.studentId && String(user.studentId).toUpperCase().startsWith('GV')) ||
        (user?.code && String(user.code).toUpperCase().startsWith('GV'));

    const userCode = user?.studentId || user?.code || (isTeacher ? 'GV2026' : '2020601111');
    const userId = user?.id || (isTeacher ? 1 : 3);

    const fallbackProblems = [
        {
            id: 1,
            title: 'Tìm số lớn nhất trong mảng (Max Element)',
            slug: 'tim-so-lon-nhat',
            category: 'Mảng & Chuỗi',
            difficulty: 'Dễ',
            diffVariant: 'green',
            acRate: '84.5%',
            points: 100,
            solved: false,
            tags: ['Array', 'Math'],
            isHaUI: true,
        },
        {
            id: 2,
            title: 'Kiểm tra số nguyên tố tối ưu (Prime Check)',
            slug: 'kiem-tra-so-nguyen-to',
            category: 'Toán học',
            difficulty: 'Dễ',
            diffVariant: 'green',
            acRate: '72.3%',
            points: 100,
            solved: false,
            tags: ['Math', 'Number Theory'],
            isHaUI: true,
        },
        {
            id: 3,
            title: 'Đảo ngược chuỗi và kiểm tra Palindrome',
            slug: 'dao-nguoc-chuoi-palindrome',
            category: 'Mảng & Chuỗi',
            difficulty: 'Dễ',
            diffVariant: 'green',
            acRate: '79.1%',
            points: 100,
            solved: false,
            tags: ['String', 'Two Pointers'],
            isHaUI: true,
        },
        {
            id: 4,
            title: 'Tìm kiếm nhị phân (Binary Search)',
            slug: 'tim-kiem-nhi-phan',
            category: 'Sắp xếp & Tìm kiếm',
            difficulty: 'Dễ',
            diffVariant: 'green',
            acRate: '68.4%',
            points: 120,
            solved: false,
            tags: ['Binary Search', 'Array'],
            isHaUI: true,
        },
        {
            id: 5,
            title: 'Bài toán cái túi 0/1 (Knapsack DP)',
            slug: 'bai-toan-cai-tui',
            category: 'Quy hoạch động',
            difficulty: 'Trung bình',
            diffVariant: 'yellow',
            acRate: '45.2%',
            points: 250,
            solved: false,
            tags: ['DP', 'Backtracking'],
            isHaUI: true,
        },
        {
            id: 6,
            title: 'Duyệt đồ thị theo chiều rộng (BFS Traversal)',
            slug: 'duyet-do-thi-bfs',
            category: 'Đồ thị',
            difficulty: 'Trung bình',
            diffVariant: 'yellow',
            acRate: '51.8%',
            points: 200,
            solved: false,
            tags: ['Graph', 'BFS', 'Queue'],
            isHaUI: true,
        },
    ];

    // 1. Tải danh sách bài tập từ LeetCode API + Bài tập HaUI từ Backend
    useEffect(() => {
        let isMounted = true;
        const loadAllProblems = async () => {
            try {
                setLoadingProblems(true);
                // Gọi song song LeetCode API và Backend HaUI
                const [leetCodeData, hauiRes] = await Promise.allSettled([
                    problemService.getLeetCodeProblems(),
                    problemService.getProblems({ size: 50 }),
                ]);

                let combined = [];

                // Lấy danh sách bài nộp của user từ backend
                let solvedProblemIds = new Set();
                let solvedProblemTitles = new Set();

                if (!isTeacher && userId) {
                    try {
                        const subsList = await userService.getUserSubmissions(userId);
                        subsList
                            .filter((s) => s.status === 'AC' || s.status === 'ACCEPTED')
                            .forEach((s) => {
                                if (s.problemId) solvedProblemIds.add(Number(s.problemId));
                                if (s.problemTitle) solvedProblemTitles.add(s.problemTitle.toLowerCase().trim());
                            });
                    } catch (e) {
                        console.warn('Không tải được bài nộp của user:', e.message);
                    }
                }

                // Nếu có bài tập từ thầy cô trên Backend HaUI
                if (hauiRes.status === 'fulfilled' && hauiRes.value?.items?.length > 0) {
                    const hauiProblems = hauiRes.value.items.map((p) =>
                        mapHauiProblemFromApi(p, solvedProblemIds, solvedProblemTitles)
                    );
                    combined.push(...hauiProblems);
                }

                // Nếu tải được LeetCode API
                if (leetCodeData.status === 'fulfilled' && Array.isArray(leetCodeData.value) && leetCodeData.value.length > 0) {
                    const leetProblems = leetCodeData.value.map(mapLeetCodeProblemFromApi);
                    combined.push(...leetProblems);
                }

                if (isMounted) {
                    if (combined.length > 0) {
                        setProblems(combined);
                    } else {
                        setProblems(fallbackProblems);
                    }
                }
            } catch (err) {
                console.warn('Lỗi khi tải bài tập:', err);
                if (isMounted) setProblems(fallbackProblems);
            } finally {
                if (isMounted) setLoadingProblems(false);
            }
        };

        loadAllProblems();

        return () => {
            isMounted = false;
        };
    }, [userCode]);

    // 2. Tải Bảng xếp hạng Top Sinh viên
    useEffect(() => {
        let isMounted = true;
        leaderboardService
            .getTop10Solvers()
            .then((data) => {
                if (!isMounted) return;
                if (Array.isArray(data) && data.length > 0) {
                    const top5 = data.slice(0, 5).map((item, idx) => ({
                        ...mapApiStudent(item, idx),
                        medal: rankToMedal(idx + 1),
                        isMe: !isTeacher && ((user?.studentId || user?.code) === item.code),
                    }));
                    setTopStudents(top5);
                }
            })
            .catch((err) => console.warn('Không tải được leaderboard:', err.message));
        return () => {
            isMounted = false;
        };
    }, [user]);

    const rankToMedal = (rank) => {
        if (rank === 1) return 'gold';
        if (rank === 2) return 'silver';
        if (rank === 3) return 'bronze';
        return 'none';
    };

    const getMedalIcon = (medal) => {
        const config = {
            gold: { icon: faTrophy, color: 'var(--color-haui-gold)' },
            silver: { icon: faMedal, color: 'var(--color-haui-silver)' },
            bronze: { icon: faMedal, color: 'var(--color-haui-bronze)' },
            none: { icon: faUser },
        };

        const { icon, color } = config[medal] || config.none;
        return <FontAwesomeIcon icon={icon} style={{ color }} />;
    };

    // Lấy danh sách Categories độc nhất từ tất cả tags
    const availableCategories = [
        'All',
        'Array',
        'String',
        'Hash Table',
        'Dynamic Programming',
        'Math',
        'Sorting',
        'Greedy',
        'Depth-First Search',
        'Binary Search',
        'Tree',
        'Two Pointers',
        'Graph',
        'Stack',
        'Linked List',
    ];

    // Filtering logic
    const filteredProblems = problems.filter((item) => {
        const matchSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
            String(item.id).includes(searchQuery);
        const matchDiff = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
        const matchCat =
            selectedCategory === 'All' ||
            item.category === selectedCategory ||
            item.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());
        const matchTab =
            activeTab === 'all' ||
            (activeTab === 'haui' && item.isHaUI) ||
            (activeTab === 'leetcode' && !item.isHaUI) ||
            (activeTab === 'solved' && item.solved) ||
            (activeTab === 'hot' && item.points >= 250);

        return matchSearch && matchDiff && matchCat && matchTab;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredProblems.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProblems = filteredProblems.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };

    const myRankNumber =
        topStudents.findIndex((st) => st.id === userCode) !== -1
            ? topStudents.findIndex((st) => st.id === userCode) + 1
            : (user?.totalPoints >= 3800 ? 1 : user?.totalPoints >= 3400 ? 2 : user?.totalPoints >= 2900 ? 3 : 1);

    const solvedCount = problems.filter((p) => p.solved).length;

    return (
        <div className="container" style={{ paddingBottom: '3rem' }}>
            {/* 1. Header Banner */}
            <div className={styles.pageHeader}>
                <div>
                    <Badge variant="orange">
                        <FontAwesomeIcon icon={faKhanda} className={cx('fakhanda-icon')} />
                        <span className={cx('badgeText')}>ĐẤU TRƯỜNG THUẬT TOÁN HAUI</span>
                    </Badge>
                    <h1 className={cx('headerTitle')}>Trang Thi Đấu Lập Trình</h1>
                    <p className={cx('headerSubtitle')}>
                        Rèn luyện kỹ năng giải thuật, chinh phục hơn 1,200 bài thi đấu thực chiến và nâng cao thứ hạng
                        trong cộng đồng sinh viên Đại học Công nghiệp Hà Nội.
                    </p>
                </div>

                {isTeacher ? (
                    <div className={cx('statsRow')}>
                        <div className={cx('statItem')}>
                            <div className={cx('statVal')} style={{ color: 'var(--color-primary)' }}>
                                {problems.length > 0 ? `${problems.length}+` : '1,200+'}
                            </div>
                            <div className={cx('statTxt')}>Tổng bài thi đấu</div>
                        </div>
                        <div className={cx('divider')}></div>
                        <div className={cx('statItem')}>
                            <div className={cx('statVal')} style={{ color: 'var(--color-success)' }}>
                                Giảng viên
                            </div>
                            <div className={cx('statTxt')}>Vai trò</div>
                        </div>
                        <div className={cx('divider')}></div>
                        <div className={cx('statItem')}>
                            <div className={cx('statVal')} style={{ color: 'var(--color-info)' }}>
                                {user?.department || 'Khoa CNTT'}
                            </div>
                            <div className={cx('statTxt')}>Đơn vị</div>
                        </div>
                    </div>
                ) : (
                    <div className={cx('statsRow')}>
                        <div className={cx('statItem')}>
                            <div className={cx('statVal')}>
                                {solvedCount} / {problems.length > 0 ? problems.length : 15}
                            </div>
                            <div className={cx('statTxt')}>Đã hoàn thành</div>
                        </div>
                        <div className={cx('divider')}></div>
                        <div className={cx('statItem')}>
                            <div className={cx('statVal')} style={{ color: 'var(--color-success)' }}>
                                #{myRankNumber}
                            </div>
                            <div className={cx('statTxt')}>Thứ hạng HaUI</div>
                        </div>
                        <div className={cx('divider')}></div>
                        <div className={cx('statItem')}>
                            <div className={cx('statVal')} style={{ color: 'var(--color-info)' }}>
                                {user?.totalPoints ? Number(user.totalPoints).toLocaleString() : '3,840'}
                            </div>
                            <div className={cx('statTxt')}>Điểm tích lũy</div>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Main Grid */}
            <div className={cx('mainGrid')}>
                <div>
                    {/* Sub Tabs */}
                    <div className={cx('subTabs')}>
                        <button
                            onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                            className={`${styles.subTabBtn} ${activeTab === 'all' ? styles.subTabActive : ''}`}
                        >
                            Tất cả ({problems.length})
                        </button>
                        <button
                            onClick={() => { setActiveTab('haui'); setCurrentPage(1); }}
                            className={`${styles.subTabBtn} ${activeTab === 'haui' ? styles.subTabActive : ''}`}
                        >
                            🏫 Bài tập HaUI ({problems.filter((p) => p.isHaUI).length})
                        </button>
                        <button
                            onClick={() => { setActiveTab('leetcode'); setCurrentPage(1); }}
                            className={`${styles.subTabBtn} ${activeTab === 'leetcode' ? styles.subTabActive : ''}`}
                        >
                            ⚡ LeetCode ({problems.filter((p) => !p.isHaUI).length})
                        </button>
                        <button
                            onClick={() => { setActiveTab('solved'); setCurrentPage(1); }}
                            className={`${styles.subTabBtn} ${activeTab === 'solved' ? styles.subTabActive : ''}`}
                        >
                            Đã giải ({problems.filter((p) => p.solved).length})
                        </button>
                        <button
                            onClick={() => { setActiveTab('hot'); setCurrentPage(1); }}
                            className={`${styles.subTabBtn} ${activeTab === 'hot' ? styles.subTabActive : ''}`}
                        >
                            <FontAwesomeIcon icon={faFire} className={cx('fafire-icon')} />
                            Thử thách khó
                        </button>
                    </div>

                    {/* Filters Bar */}
                    <div className={cx('filterBox')}>
                        <div className={cx('searchInputWrapper')}>
                            <span className={cx('searchIcon')}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} className={cx('searchIcon')} />
                            </span>
                            <input
                                type="text"
                                placeholder="Tìm kiếm tên bài, ID hoặc chủ đề (Array, DP, Tree...)"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className={styles.filterInput}
                            />
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={cx('filterSelect')}
                        >
                            {availableCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === 'All' ? 'Tất cả chủ đề' : cat}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedDifficulty}
                            onChange={(e) => {
                                setSelectedDifficulty(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={cx('filterSelect')}
                        >
                            <option value="All">Tất cả độ khó</option>
                            <option value="Dễ">Dễ (Easy)</option>
                            <option value="Trung bình">Trung bình (Medium)</option>
                            <option value="Khó">Khó (Hard)</option>
                        </select>
                    </div>

                    {/* Problem Table */}
                    <div className={cx('tableCard')}>
                        {loadingProblems ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                                    Đang tải kho bài tập thuật toán...
                                </div>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                                    Đang kết nối LeetCode API & Hệ thống HaUI
                                </span>
                            </div>
                        ) : (
                            <table className={cx('table')}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '3.5rem', textAlign: 'center', fontSize: '0.75rem' }}>
                                            Trạng thái
                                        </th>
                                        <th style={{ fontSize: '0.75rem' }}>Tên bài thi đấu</th>
                                        <th style={{ fontSize: '0.75rem' }}>Chủ đề</th>
                                        <th style={{ fontSize: '0.75rem' }}>Độ khó</th>
                                        <th style={{ textAlign: 'center', fontSize: '0.75rem' }}>Tỷ lệ AC</th>
                                        <th style={{ textAlign: 'center', fontSize: '0.75rem' }}>Điểm</th>
                                        <th style={{ textAlign: 'center', fontSize: '0.75rem' }}>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProblems.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}
                                            >
                                                Không tìm thấy bài thi đấu phù hợp với bộ lọc!
                                            </td>
                                        </tr>
                                    ) : (
                                        currentProblems.map((prob) => (
                                            <tr
                                                key={`${prob.isHaUI ? 'haui' : 'lc'}-${prob.id}`}
                                                onClick={() => navigate(`/thi-dau/${prob.slug}`)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td style={{ textAlign: 'center' }}>
                                                    {prob.solved ? (
                                                        <span className={styles.solvedIcon} title="Đã hoàn thành">
                                                            <FontAwesomeIcon icon={faCheck} className={cx('faCheck-icon')} />
                                                        </span>
                                                    ) : (
                                                        <span className={styles.unsolvedIcon} title="Chưa làm">
                                                            <FontAwesomeIcon
                                                                icon={faCircleDot}
                                                                className={cx('faCircleDot-icon')}
                                                            />
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className={styles.probTitle}>
                                                        <span style={{ fontWeight: 800, color: 'var(--color-primary)', marginRight: '0.4rem' }}>
                                                            #{prob.id}
                                                        </span>
                                                        {prob.title}
                                                        {prob.isHaUI && (
                                                            <span
                                                                style={{
                                                                    marginLeft: '0.5rem',
                                                                    fontSize: '0.7rem',
                                                                    background: 'rgba(249, 115, 22, 0.15)',
                                                                    color: 'var(--color-primary)',
                                                                    padding: '2px 6px',
                                                                    borderRadius: '4px',
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                HaUI
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={styles.tagGroup}>
                                                        {prob.tags.slice(0, 3).map((t, idx) => (
                                                            <span key={idx} className={styles.tag}>
                                                                #{t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td style={{ color: 'var(--text-muted)' }}>{prob.category}</td>
                                                <td>
                                                    <Badge variant={prob.diffVariant}>{prob.difficulty}</Badge>
                                                </td>
                                                <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                                                    {prob.acRate}
                                                </td>
                                                <td
                                                    style={{
                                                        textAlign: 'center',
                                                        fontWeight: 800,
                                                        color: 'var(--color-primary)',
                                                    }}
                                                >
                                                    +{prob.points}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <Button
                                                        variant={prob.solved ? 'secondary' : 'primary'}
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/thi-dau/${prob.slug}`);
                                                        }}
                                                    >
                                                        {prob.solved ? 'Làm lại' : 'Vào thi đấu'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}

                        {/* Pagination Footer */}
                        <div className={cx('pagination')}>
                            <span>
                                Hiển thị {filteredProblems.length > 0 ? startIndex + 1 : 0} -{' '}
                                {Math.min(startIndex + itemsPerPage, filteredProblems.length)} / {filteredProblems.length} bài
                            </span>
                            <div className={cx('pageBtnGroup')}>
                                <button
                                    className={cx('pageBtn')}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                >
                                    Trước
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum = currentPage <= 3 ? i + 1 : currentPage + i - 2;
                                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                                    if (pageNum < 1) pageNum = 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`${cx('pageBtn')} ${currentPage === pageNum ? cx('pageBtnActive') : ''}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                <button
                                    className={cx('pageBtn')}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Sidebar */}
                <div className={cx('sidebarGroup')}>
                    {/* Top Leaderboard Mini Card */}
                    <Card>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid var(--border-color)',
                                paddingBottom: '0.75rem',
                                marginBottom: '0.75rem',
                            }}
                        >
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                                <FontAwesomeIcon
                                    icon={faTrophy}
                                    style={{ color: 'var(--color-haui-gold)', marginRight: '0.4rem', fontSize: '1rem' }}
                                />
                                Top Sinh Viên HaUI
                            </h3>
                            <Link
                                to={ROUTES.LEADERBOARD}
                                style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}
                            >
                                Xem tất cả
                                <FontAwesomeIcon
                                    icon={faArrowRight}
                                    style={{ marginLeft: '0.25rem', fontSize: '0.75rem' }}
                                />
                            </Link>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {topStudents.map((st) => (
                                <div
                                    key={st.rank}
                                    className={`${cx('studentRankItem')} ${st.isMe ? cx('studentRankItemMe') : ''}`}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <span style={{ fontSize: '1rem', marginBottom: '0.6rem' }}>
                                            {getMedalIcon(st.medal)}
                                        </span>
                                        <div>
                                            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                                                {st.name}
                                            </p>
                                            <small style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                                MSSV: {st.id}{' '}
                                                <FontAwesomeIcon
                                                    icon={faCircle}
                                                    style={{ fontSize: '0.4rem', margin: '2px 6px' }}
                                                />{' '}
                                                {st.solved} bài
                                            </small>
                                        </div>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: '0.8rem',
                                            fontWeight: 800,
                                            color: 'var(--color-primary)',
                                            fontFamily: 'var(--font-mono)',
                                        }}
                                    >
                                        {st.points} pts
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Weekly Sprint Challenge Banner */}
                    <div className={cx('sprintBanner')}>
                        <span
                            style={{
                                alignSelf: 'flex-start',
                                padding: '0.15rem 0.5rem',
                                background: 'rgba(99, 102, 241, 0.3)',
                                color: '#a5b4fc',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                            }}
                        >
                            KỲ THI TUẦN NÀY
                        </span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                            HaUI Code Sprint #12: Thuật toán nâng cao
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: '#c7d2fe', lineHeight: 1.5 }}>
                            Giải quyết 4 bài thi đấu trong vòng 90 phút. Giải nhất nhận 500.000đ + Giấy khen Khoa CNTT.
                        </p>
                        <Button
                            variant="primary"
                            size="sm"
                            style={{ width: '100%', background: '#4f46e5', marginTop: '0.25rem' }}
                            onClick={() => alert('Đã đăng ký tham gia kỳ thi HaUI Code Sprint #12 thành công!')}
                        >
                            Đăng ký dự thi ngay
                        </Button>
                    </div>

                    {/* Rules Card */}
                    <Card>
                        <h4
                            style={{
                                color: '#fff',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                marginBottom: '0.5rem',
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faPencil}
                                style={{ marginRight: '0.5rem', fontSize: '0.8rem', color: 'var(--color-primary)' }}
                            />
                            Quy chế thi đấu
                        </h4>
                        <div
                            style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.35rem',
                                lineHeight: 1.5,
                            }}
                        >
                            <p>
                                <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.4rem', marginRight: '0.5rem' }} />
                                Mã nguồn được biên dịch độc lập trong Sandbox container.
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.4rem', marginRight: '0.5rem' }} />
                                Giới hạn thời gian: Java 2.0s, C++ 1.0s, Python 3.0s.
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.4rem', marginRight: '0.5rem' }} />
                                Nghiêm cấm sao chép lời giải gian lận.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
