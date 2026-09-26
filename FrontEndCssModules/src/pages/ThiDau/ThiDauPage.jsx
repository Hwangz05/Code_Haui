import React, { useState } from 'react';
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

const cx = ClassNames.bind(styles);

export default function ThiDauPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeTab, setActiveTab] = useState('all');

    const problemsData = [
        {
            id: 1,
            title: 'Tìm số lớn nhất trong mảng (Max Element)',
            slug: 'tim-so-lon-nhat',
            category: 'Mảng & Chuỗi',
            difficulty: 'Dễ',
            diffVariant: 'green',
            acRate: '84.5%',
            points: 100,
            solved: true,
            tags: ['Array', 'Math'],
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
            solved: true,
            tags: ['Math', 'Number Theory'],
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
            solved: true,
            tags: ['String', 'Two Pointers'],
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
            solved: true,
            tags: ['Graph', 'BFS', 'Queue'],
        },
        {
            id: 7,
            title: 'Dãy con tăng dài nhất (LIS - Longest Increasing)',
            slug: 'day-con-tang-dai-nhat',
            category: 'Quy hoạch động',
            difficulty: 'Trung bình',
            diffVariant: 'yellow',
            acRate: '41.6%',
            points: 250,
            solved: false,
            tags: ['DP', 'Binary Search'],
        },
        {
            id: 8,
            title: 'Cây nhị phân tìm kiếm cân bằng (AVL Tree)',
            slug: 'cay-nhi-phan-avl',
            category: 'Cây & Cấu trúc nâng cao',
            difficulty: 'Khó',
            diffVariant: 'red',
            acRate: '28.9%',
            points: 400,
            solved: false,
            tags: ['Tree', 'AVL', 'Data Structure'],
        },
        {
            id: 9,
            title: 'Thuật toán tìm đường ngắn nhất Dijkstra',
            slug: 'thuat-toan-dijkstra',
            category: 'Đồ thị',
            difficulty: 'Khó',
            diffVariant: 'red',
            acRate: '33.4%',
            points: 400,
            solved: false,
            tags: ['Graph', 'Shortest Path', 'Heap'],
        },
        {
            id: 10,
            title: 'Thiết kế hệ thống LRU Cache trong Java',
            slug: 'thiet-ke-lru-cache',
            category: 'Cây & Cấu trúc nâng cao',
            difficulty: 'Khó',
            diffVariant: 'red',
            acRate: '24.1%',
            points: 500,
            solved: false,
            tags: ['Design', 'Hash Table', 'Linked List'],
        },
        {
            id: 11,
            title: 'Sắp xếp trộn (Merge Sort)',
            slug: 'sap-xep-tron-merge-sort',
            category: 'Sắp xếp & Tìm kiếm',
            difficulty: 'Dễ',
            diffVariant: 'green',
            acRate: '75.0%',
            points: 120,
            solved: true,
            tags: ['Sort', 'Divide and Conquer'],
        },
        {
            id: 12,
            title: 'Bài toán 8 quân hậu (N-Queens Backtracking)',
            slug: 'bai-toan-8-quan-hau',
            category: 'Toán học',
            difficulty: 'Trung bình',
            diffVariant: 'yellow',
            acRate: '48.7%',
            points: 220,
            solved: false,
            tags: ['Backtracking', 'Recursion'],
        },
    ];

    const topStudents = [
        { rank: 1, name: 'Trần Văn Mạnh', id: '2020601111', score: 3840, solved: 142, medal: 'gold' },
        { rank: 2, name: 'Hoàng Nhật Minh', id: '2021602345', score: 3620, solved: 135, medal: 'silver' },
        { rank: 3, name: 'Lê Quỳnh Trang', id: '2022604567', score: 3410, solved: 128, medal: 'bronze' },
        { rank: 4, name: 'Nguyễn Văn An (Bạn)', id: '2021600123', score: 1250, solved: 48, medal: 'none', isMe: true },
        { rank: 5, name: 'Phạm Minh Đức', id: '2021607890', score: 1190, solved: 45, medal: 'none' },
    ];

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

    // Filtering
    const filteredProblems = problemsData.filter((item) => {
        const matchSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchDiff = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
        const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
        const matchTab =
            activeTab === 'all' || (activeTab === 'solved' && item.solved) || (activeTab === 'hot' && item.points >= 250);

        return matchSearch && matchDiff && matchCat && matchTab;
    });

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

                <div className={cx('statsRow')}>
                    <div className={cx('statItem')}>
                        <div className={cx('statVal')}>48 / 120</div>
                        <div className={cx('statTxt')}>Đã hoàn thành</div>
                    </div>
                    <div className={cx('divider')}></div>
                    <div className={cx('statItem')}>
                        <div className={cx('statVal')} style={{ color: 'var(--color-success)' }}>
                            #4
                        </div>
                        <div className={cx('statTxt')}>Hạng lớp</div>
                    </div>
                    <div className={cx('divider')}></div>
                    <div className={cx('statItem')}>
                        <div className={cx('statVal')} style={{ color: 'var(--color-info)' }}>
                            1,250
                        </div>
                        <div className={cx('statTxt')}>Điểm tích lũy</div>
                    </div>
                </div>
            </div>

            {/* 2. Main Grid */}
            <div className={cx('mainGrid')}>
                <div>
                    {/* Sub Tabs */}
                    <div className={cx('subTabs')}>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`${styles.subTabBtn} ${activeTab === 'all' ? styles.subTabActive : ''}`}
                        >
                            Tất cả bài thi đấu ({problemsData.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('solved')}
                            className={`${styles.subTabBtn} ${activeTab === 'solved' ? styles.subTabActive : ''}`}
                        >
                            Đã giải quyết (5)
                        </button>
                        <button
                            onClick={() => setActiveTab('hot')}
                            className={`${styles.subTabBtn} ${activeTab === 'hot' ? styles.subTabActive : ''}`}
                        >
                            <FontAwesomeIcon icon={faFire} className={cx('fafire-icon')} />
                            Điểm cao & Thử thách khó
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
                                placeholder="Tìm theo tên bài hoặc tag (Array, DP, Tree...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.filterInput}
                            />
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={cx('filterSelect')}
                        >
                            <option value="All">Tất cả chủ đề</option>
                            <option value="Mảng & Chuỗi">Mảng & Chuỗi</option>
                            <option value="Toán học">Toán học</option>
                            <option value="Sắp xếp & Tìm kiếm">Sắp xếp & Tìm kiếm</option>
                            <option value="Quy hoạch động">Quy hoạch động</option>
                            <option value="Đồ thị">Đồ thị</option>
                            <option value="Cây & Cấu trúc nâng cao">Cây & Cấu trúc</option>
                        </select>

                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
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
                                {filteredProblems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}
                                        >
                                            Không tìm thấy bài thi đấu phù hợp với bộ lọc!
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProblems.map((prob) => (
                                        <tr
                                            key={prob.id}
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
                                                    {prob.id}. {prob.title}
                                                </div>
                                                <div className={styles.tagGroup}>
                                                    {prob.tags.map((t, idx) => (
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

                        {/* Pagination Footer */}
                        <div className={cx('pagination')}>
                            <span>
                                Hiển thị {filteredProblems.length} / {problemsData.length} bài thi đấu
                            </span>
                            <div className={cx('pageBtnGroup')}>
                                <button className={cx('pageBtn')} disabled>
                                    Trước
                                </button>
                                <button className={`${cx('pageBtn')} ${cx('pageBtnActive')}`}>1</button>
                                <button className={cx('pageBtn')}>2</button>
                                <button className={cx('pageBtn')}>3</button>
                                <button className={cx('pageBtn')}>Sau</button>
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
                                        {st.score} pts
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
