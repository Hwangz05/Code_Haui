import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faStar,
    faCalendarDays,
    faFire,
    faTrophy,
    faCrown,
    faMedal,
    faCrosshairs,
    faCircle,
    faChalkboardTeacher,
} from '@fortawesome/free-solid-svg-icons';

// chỉnh lại path cho đúng vị trí file thật
import { ROUTES } from '../../config/routes.config';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import styles from './LeaderboardPage.module.css';
import { leaderboardService, mapApiStudent } from '../../services/leaderboardService';
import { useAuthContext } from '../../context/AuthContext';

const cx = ClassNames.bind(styles);

export default function LeaderboardPage() {
    const [timeframe, setTimeframe] = useState('all');
    const [department, setDepartment] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [rawStudents, setRawStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuthContext();

    const isTeacher =
        user?.role === 'TEACHER' ||
        (user?.studentId && String(user.studentId).toUpperCase().startsWith('GV')) ||
        (user?.code && String(user.code).toUpperCase().startsWith('GV'));

    const rawStudentsDefault = [
        {
            rank: 1,
            name: 'Trần Văn Mạnh',
            id: '2020601111',
            class: 'DHKTPM16A',
            faculty: 'Khoa CNTT',
            solved: 5,
            acRate: 100.0,
            points: 3840,
            badge: 'Grandmaster',
            badgeColor: 'orange',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 2,
            name: 'Lê Quỳnh Trang',
            id: '2022604567',
            class: 'DHKTPM16A',
            faculty: 'Khoa CNTT',
            solved: 5,
            acRate: 83.3,
            points: 3410,
            badge: 'Master',
            badgeColor: 'purple',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 3,
            name: 'Trịnh Gia Bảo',
            id: '2022601999',
            class: 'DHKHMT17',
            faculty: 'Khoa CNTT',
            solved: 3,
            acRate: 100.0,
            points: 2980,
            badge: 'Master',
            badgeColor: 'purple',
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 4,
            name: 'Phan Thanh Tùng',
            id: '2020603412',
            class: 'DHTH15',
            faculty: 'Khoa CNTT',
            solved: 4,
            acRate: 100.0,
            points: 2650,
            badge: 'Master',
            badgeColor: 'purple',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 5,
            name: 'Tạ Minh Quang',
            id: '2021604477',
            class: 'DHATTT16',
            faculty: 'Khoa An toàn Thông tin',
            solved: 2,
            acRate: 100.0,
            points: 2200,
            badge: 'Master',
            badgeColor: 'purple',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 6,
            name: 'Nguyễn Văn An',
            id: '2021600123',
            class: 'DHKTPM16A',
            faculty: 'Khoa CNTT',
            solved: 5,
            acRate: 83.3,
            points: 2150,
            badge: 'Master',
            badgeColor: 'purple',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 7,
            name: 'Phạm Đức Long',
            id: '2021603344',
            class: 'DHKTPM16B',
            faculty: 'Khoa CNTT',
            solved: 2,
            acRate: 100.0,
            points: 1890,
            badge: 'Expert',
            badgeColor: 'blue',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 8,
            name: 'Dương Thùy Linh',
            id: '2020607823',
            class: 'DHTH15',
            faculty: 'Khoa CNTT',
            solved: 2,
            acRate: 100.0,
            points: 1780,
            badge: 'Expert',
            badgeColor: 'blue',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 9,
            name: 'Hoàng Minh Tuấn',
            id: '2021602288',
            class: 'DHKTPM16A',
            faculty: 'Khoa CNTT',
            solved: 2,
            acRate: 100.0,
            points: 1620,
            badge: 'Expert',
            badgeColor: 'blue',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 10,
            name: 'Nguyễn Thị Thu Hà',
            id: '2021607799',
            class: 'DHKTPM16B',
            faculty: 'Khoa CNTT',
            solved: 2,
            acRate: 100.0,
            points: 1450,
            badge: 'Expert',
            badgeColor: 'blue',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        },
    ];

    useEffect(() => {
        let isMounted = true;
        const fetchLeaderboard = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await leaderboardService.getTop10Solvers();
                if (!isMounted) return;
                if (Array.isArray(response) && response.length > 0) {
                    const mapped = response.map((item, idx) => ({
                        ...mapApiStudent(item, idx),
                        isMe: !isTeacher && (user?.studentId === item.code || user?.code === item.code),
                    }));
                    setRawStudents(mapped);
                } else {
                    setRawStudents(rawStudentsDefault.map((item) => ({
                        ...item,
                        isMe: !isTeacher && (user?.studentId === item.id || user?.code === item.id),
                    })));
                }
            } catch (err) {
                console.warn('Lấy leaderboard từ backend thất bại:', err);
                if (isMounted) {
                    setRawStudents(rawStudentsDefault.map((item) => ({
                        ...item,
                        isMe: !isTeacher && (user?.studentId === item.id || user?.code === item.id),
                    })));
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchLeaderboard();
        return () => {
            isMounted = false;
        };
    }, [user]);

    // useEffect(() => {
    //     let isMounted = true;

    //     async function fetchLeaderboard() {
    //         setIsLoading(true);
    //         setError(null);
    //         try {
    //             const response = await leaderboardService.getTop10Solvers();
    //             console.log('DEBUG leaderboard response:', response); // TODO: xoá dòng này sau khi debug xong
    //             // response có dạng { success, message, data, timestamp }
    //             if (!isCancelled) {
    //                 if (response?.success) {
    //                     const list = Array.isArray(response.data.data) ? response.data.data : [];
    //                     setRawStudents(list.map(mapApiStudent));
    //                 } else {
    //                     setError(response?.message || 'Không tải được bảng xếp hạng.');
    //                     // setRawStudents(rawStudentsDefault); // fallback về dữ liệu mặc định
    //                 }
    //             }
    //         } catch (err) {
    //             if (!isCancelled) {
    //                 setError('Không tải được bảng xếp hạng. Vui lòng thử lại sau.');
    //                 console.error('Lỗi khi gọi getTop10Solvers:', err);
    //             }
    //         } finally {
    //             if (!isCancelled) setIsLoading(false);
    //         }
    //     }

    //     fetchLeaderboard();
    //     return () => {
    //         isCancelled = true;
    //     };
    // }, [timeframe]); // gọi lại API khi đổi timeframe; thêm department vào đây nếu API hỗ trợ lọc theo khoa

    const filteredStudents = rawStudents.filter((st) => {
        const matchSearch =
            st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            st.id.includes(searchQuery) ||
            st.class.toLowerCase().includes(searchQuery.toLowerCase());
        const matchDept = department === 'all' || st.faculty === department;
        return matchSearch && matchDept;
    });

    const top1 = rawStudents[0];
    const top2 = rawStudents[1];
    const top3 = rawStudents[2];
    const hasPodium = Boolean(top1 && top2 && top3);

    const myStudent = isTeacher
        ? null
        : rawStudents.find((st) => st.isMe || st.id === user?.code || st.id === user?.studentId) ||
          rawStudents.find((st) => user?.fullName && st.name.toLowerCase().includes(user.fullName.toLowerCase())) ||
          rawStudents[0] ||
          { rank: 1, name: 'Trần Văn Mạnh', id: '2020601111', points: 3840, solved: 5 };

    const myRank = myStudent?.rank || 1;
    const myPoints = myStudent?.points || 0;
    const mySolved = myStudent?.solved || 0;

    const pointsToTop3 = top3 ? Math.max(10, top3.points - myPoints + 10) : 100;
    const pointsToTop1 = top1 ? Math.max(10, top1.points - myPoints + 10) : 100;

    if (isLoading) {
        return (
            <div className="container" style={{ paddingBottom: '4rem', textAlign: 'center', padding: '4rem 0' }}>
                <p>Đang tải bảng xếp hạng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ paddingBottom: '4rem', textAlign: 'center', padding: '4rem 0' }}>
                <p style={{ color: 'var(--color-danger, red)' }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div className={cx('headerSection')}>
                <Badge variant="orange">
                    <FontAwesomeIcon icon={faTrophy} style={{ margin: '0 2px 1px 0', fontSize: '1rem' }} />

                    <span style={{ fontSize: '1.25rem' }}>BẢNG VINH DANH HAUI CODER</span>
                </Badge>
                <h1 className={cx('pageTitle')}>Bảng Xếp Hạng Sinh Viên</h1>
                <p className={cx('pageSubtitle')}>
                    Vinh danh các tài năng lập trình xuất sắc nhất Đại học Công nghiệp Hà Nội qua các kỳ thi đấu thuật
                    toán và giải bài tập tự động.
                </p>
            </div>

            {/* Timeframe Subtabs & Filters */}
            <div className={cx('filterBar')}>
                <div className={cx('timeframeTabs')}>
                    <button
                        className={`${cx('tabBtn')} ${timeframe === 'week' ? cx('tabBtnActive') : ''}`}
                        onClick={() => setTimeframe('week')}
                    >
                        <FontAwesomeIcon
                            icon={faFire}
                            style={{ margin: '0 0.5rem 1px 0', fontSize: '0.9rem', color: 'var(--color-haui-red)' }}
                        />
                        Tuần này
                    </button>
                    <button
                        className={`${cx('tabBtn')} ${timeframe === 'month' ? cx('tabBtnActive') : ''}`}
                        onClick={() => setTimeframe('month')}
                    >
                        <FontAwesomeIcon
                            icon={faCalendarDays}
                            style={{ margin: '0 0.5rem 1px 0', fontSize: '0.8rem', color: 'var(--color-haui-blue)' }}
                        />
                        Tháng này
                    </button>
                    <button
                        className={`${cx('tabBtn')} ${timeframe === 'all' ? cx('tabBtnActive') : ''}`}
                        onClick={() => setTimeframe('all')}
                    >
                        <FontAwesomeIcon
                            icon={faStar}
                            style={{ margin: '0 0.5rem 1px 0', fontSize: '0.8rem', color: 'var(--color-haui-gold)' }}
                        />
                        Toàn khóa
                    </button>
                </div>

                <div className={cx('searchAndSelect')}>
                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className={cx('filterSelect')}
                    >
                        <option value="all">Tất cả Khoa / Viện</option>
                        <option value="Khoa CNTT">Khoa CNTT</option>
                        <option value="Khoa Điện tử">Khoa Điện tử</option>
                        <option value="Khoa Cơ khí">Khoa Cơ khí</option>
                    </select>
                </div>
            </div>

            {/* Podium Top 3 */}
            {hasPodium && (
                <div className={cx('podiumGrid')}>
                    {/* Rank 2 */}
                    <div className={`${cx('podiumCard')} ${cx('rankTwo')}`}>
                        <div className={cx('medalBadge')}>
                            <FontAwesomeIcon
                                icon={faMedal}
                                style={{ marginRight: '0.3rem', fontSize: '2rem', color: 'var(--color-silver)' }}
                            />
                        </div>
                        <div className={cx('podiumAvatarBox')}>
                            <img src={top2.avatar} alt={top2.name} className={cx('podiumAvatar')} />
                            <span className={cx('podiumRankTag')}>#2</span>
                        </div>
                        <Badge variant="slate">Á QUÂN 1</Badge>
                        <strong className={cx('podiumName')}>{top2.name}</strong>
                        <span className={cx('podiumMeta')}>
                            MSSV: {top2.id}
                            <FontAwesomeIcon
                                icon={faCircle}
                                style={{ margin: '0 0.5rem 1px 0.5rem ', fontSize: '0.4rem', color: 'var(--text-dim)' }}
                            />
                            {top2.class}
                        </span>
                        <div className={cx('podiumScore')}>
                            <span className={cx('pointsText')}>{top2.points}</span>
                            <span className={cx('ptsUnit')}>pts</span>
                        </div>
                        <div className={cx('podiumStats')}>
                            <span>{top2.solved} bài AC</span>
                            <span>
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{
                                        margin: '0 0.2rem 1px 0.2rem ',
                                        fontSize: '0.35rem',
                                        color: 'var(--text-dim)',
                                    }}
                                />
                            </span>
                            <span style={{ color: 'var(--color-success)' }}>{top2.acRate}%</span>
                        </div>
                    </div>

                    {/* Rank 1 */}
                    <div className={`${cx('podiumCard')} ${cx('rankOne')}`}>
                        <div className={cx('crownIcon')}>
                            <FontAwesomeIcon
                                icon={faCrown}
                                style={{ fontSize: '2.5rem', color: 'var(--color-haui-gold)' }}
                            />
                        </div>
                        <div className={cx('podiumAvatarBox')}>
                            <img
                                src={top1.avatar}
                                alt={top1.name}
                                className={`${cx('podiumAvatar')} ${cx('firstAvatar')}`}
                            />
                            <span className={`${cx('podiumRankTag')} ${cx('firstRankTag')}`}>#1</span>
                        </div>
                        <Badge variant="yellow">
                            <span style={{ fontSize: '0.875rem' }}>QUÁN QUÂN</span>
                        </Badge>
                        <strong className={`${cx('podiumName')} ${cx('firstPlaceName')}`}>{top1.name}</strong>
                        <span className={cx('podiumMeta')}>
                            <span>MSSV: {top1.id}</span>
                            <FontAwesomeIcon
                                icon={faCircle}
                                style={{ margin: '0 0.5rem 2px 0.5rem ', fontSize: '0.4rem', color: 'var(--text-dim)' }}
                            />
                            <span>{top1.class}</span>
                        </span>
                        <div className={cx('podiumScore')}>
                            <span className={`${cx('pointsText')} ${cx('firstPointsText')}`}>{top1.points}</span>
                            <span className={cx('ptsUnit')}>pts</span>
                        </div>
                        <div className={cx('podiumStats')}>
                            <span>{top1.solved} bài AC</span>
                            <span>
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{
                                        margin: '0 0.2rem 1px 0.2rem ',
                                        fontSize: '0.35rem',
                                        color: 'var(--text-dim)',
                                    }}
                                />
                            </span>
                            <span style={{ color: 'var(--color-success)' }}>{top1.acRate}% AC</span>
                        </div>
                    </div>

                    {/* Rank 3 */}
                    <div className={`${cx('podiumCard')} ${cx('rankThree')}`}>
                        <div className={cx('medalBadge')}>
                            <FontAwesomeIcon
                                icon={faMedal}
                                style={{ marginRight: '0.3rem', fontSize: '2rem', color: 'var(--color-haui-bronze)' }}
                            />
                        </div>
                        <div className={cx('podiumAvatarBox')}>
                            <img src={top3.avatar} alt={top3.name} className={cx('podiumAvatar')} />
                            <span className={cx('podiumRankTag')}>#3</span>
                        </div>
                        <Badge variant="slate">Á QUÂN 2</Badge>
                        <strong className={cx('podiumName')}>{top3.name}</strong>
                        <span className={cx('podiumMeta')}>
                            <span>MSSV: {top3.id}</span>
                            <FontAwesomeIcon
                                icon={faCircle}
                                style={{ margin: '0 0.5rem 1px 0.5rem ', fontSize: '0.4rem', color: 'var(--text-dim)' }}
                            />
                            <span>{top3.class}</span>
                        </span>
                        <div className={cx('podiumScore')}>
                            <span className={cx('pointsText')}>{top3.points}</span>
                            <span className={cx('ptsUnit')}>pts</span>
                        </div>
                        <div className={cx('podiumStats')}>
                            <span>{top3.solved} bài AC</span>
                            <span>
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{
                                        margin: '0 0.2rem 1px 0.2rem ',
                                        fontSize: '0.35rem',
                                        color: 'var(--text-dim)',
                                    }}
                                />
                            </span>
                            <span style={{ color: 'var(--color-success)' }}>{top3.acRate}%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Ranking Table */}
            <div className={cx('tableCard')}>
                <div className={cx('tableHeaderInfo')}>
                    <h3 className={cx('tableTitle')}>Top Bảng Xếp Hạng HaUI</h3>
                    <span className={cx('tableSubtitle')}>
                        Hiển thị {filteredStudents.length} sinh viên xuất sắc nhất
                    </span>
                </div>

                <div className={cx('tableWrapper')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th style={{ width: '4.5rem', textAlign: 'center' }}>Thứ hạng</th>
                                <th>Sinh viên HaUI</th>
                                <th>Lớp / Khoa</th>
                                <th style={{ textAlign: 'center' }}>Danh hiệu</th>
                                <th style={{ textAlign: 'center' }}>Số bài AC</th>
                                <th style={{ textAlign: 'center' }}>Tỷ lệ AC</th>
                                <th style={{ textAlign: 'right' }}>Tổng điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((st) => (
                                <tr key={st.rank} className={`${cx('tableRow')} ${st.isMe ? cx('isMeRow') : ''}`}>
                                    <td style={{ textAlign: 'center', fontWeight: 800 }}>
                                        {st.rank === 1 ? (
                                            <span className={cx('badgeGold')}>
                                                <FontAwesomeIcon
                                                    icon={faCrown}
                                                    style={{ marginRight: '0.3rem', fontSize: '1rem' }}
                                                />
                                                #1
                                            </span>
                                        ) : st.rank === 2 ? (
                                            <span className={cx('badgeSilver')}>
                                                <FontAwesomeIcon
                                                    icon={faMedal}
                                                    style={{ marginRight: '0.3rem', fontSize: '1rem' }}
                                                />
                                                #2
                                            </span>
                                        ) : st.rank === 3 ? (
                                            <span className={cx('badgeBronze')}>
                                                <FontAwesomeIcon
                                                    icon={faMedal}
                                                    style={{ marginRight: '0.3rem', fontSize: '1rem' }}
                                                />
                                                #3
                                            </span>
                                        ) : (
                                            <span className={cx('badgeRegular')}>#{st.rank}</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className={cx('studentCell')}>
                                            <img src={st.avatar} alt={st.name} className={cx('tableAvatar')} />
                                            <div>
                                                <div className={cx('studentNameWrap')}>
                                                    <strong className={cx('studentNameText')}>{st.name}</strong>
                                                    {st.isMe && (
                                                        <Badge
                                                            variant="orange"
                                                            style={{ marginLeft: '0.4rem', fontSize: '0.65rem' }}
                                                        >
                                                            BẠN
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className={cx('studentIdText')}>MSSV: {st.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={cx('classText')}>{st.class}</div>
                                        <div className={cx('facultyText')}>{st.faculty}</div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <Badge variant={st.badgeColor}>{st.badge}</Badge>
                                    </td>
                                    <td style={{ textAlign: 'center', color: 'var(--color-success)', fontWeight: 700 }}>
                                        {st.solved} bài
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div className={cx('rateCell')}>
                                            <span className={cx('rateText')}>{st.acRate}%</span>
                                            <div className={cx('miniBarTrack')}>
                                                <div
                                                    className={cx('miniBarFill')}
                                                    style={{ width: `${st.acRate}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <span className={cx('pointsValue')}>{st.points.toLocaleString()}</span>
                                        <span className={cx('pointsSuffix')}> pts</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Your Rank Highlight Banner / Teacher Info Banner */}
            {isTeacher ? (
                <div className={cx('myRankBanner')}>
                    <div className={cx('myRankLeft')}>
                        <div className={cx('myRankIcon')}>
                            <FontAwesomeIcon
                                icon={faChalkboardTeacher}
                                style={{ fontSize: '2.25rem', color: 'var(--color-primary)' }}
                            />
                        </div>
                        <div>
                            <div className={cx('myRankTitle')}>
                                Bạn đang xem bảng xếp hạng với tư cách <strong>Giảng viên ({user?.fullName || 'Thầy/Cô'})</strong>
                            </div>
                            <div className={cx('myRankDesc')}>
                                Theo dõi, đánh giá kết quả thi đua thuật toán và thống kê chi tiết tiến độ sinh viên các lớp học phần.
                            </div>
                        </div>
                    </div>
                    <Link to={ROUTES.TEACHER_DASHBOARD}>
                        <Button variant="primary" size="md">
                            Quản lý Giảng dạy
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className={cx('myRankBanner')}>
                    <div className={cx('myRankLeft')}>
                        <div className={cx('myRankIcon')}>
                            <FontAwesomeIcon
                                icon={faCrosshairs}
                                style={{ fontSize: '2.25rem', color: 'var(--color-haui-blue)' }}
                            />
                        </div>
                        <div>
                            <div className={cx('myRankTitle')}>
                                Vị trí của bạn: <strong>Hạng #{myRank} toàn trường</strong> ({myPoints.toLocaleString()} pts • {mySolved} bài AC)
                            </div>
                            <div className={cx('myRankDesc')}>
                                {myRank === 1 ? (
                                    <>
                                        🎉 Bạn đang <strong style={{ color: 'var(--color-primary)' }}>dẫn đầu</strong> Bảng xếp hạng HaUI! Hãy tiếp tục duy trì phong độ xuất sắc.
                                    </>
                                ) : myRank <= 3 ? (
                                    <>
                                        🏆 Bạn đang trong <strong style={{ color: 'var(--color-primary)' }}>Top 3 Podium</strong>! Cần thêm <strong style={{ color: 'var(--color-primary)' }}>{pointsToTop1.toLocaleString()} điểm</strong> nữa để vươn lên vị trí Quán quân #1.
                                    </>
                                ) : (
                                    <>
                                        Bạn chỉ cần thêm <strong style={{ color: 'var(--color-primary)' }}>{pointsToTop3.toLocaleString()} điểm</strong> nữa để vượt qua hạng 3 và lọt vào Top Podium!
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <Link to={ROUTES.THI_DAU}>
                        <Button variant="primary" size="md">
                            Luyện tập kiếm điểm ngay
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
