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
} from '@fortawesome/free-solid-svg-icons';

// chỉnh lại path cho đúng vị trí file thật
import { ROUTES } from '../../config/routes.config';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import styles from './LeaderboardPage.module.css';
import { leaderboardService, mapApiStudent } from '../../services/leaderboardService';

const cx = ClassNames.bind(styles);

export default function LeaderboardPage() {
    const [timeframe, setTimeframe] = useState('all');
    const [department, setDepartment] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [rawStudents, setRawStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const rawStudentsDefault = [
        {
            rank: 1,
            name: 'Trần Văn Mạnh',
            id: '2020601111',
            class: 'DHKTPM15',
            faculty: 'Khoa CNTT',
            solved: 142,
            acRate: 95.8,
            points: 3840,
            badge: 'Grandmaster',
            badgeColor: 'orange',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 2,
            name: 'Hoàng Nhật Minh',
            id: '2021602345',
            class: 'DHKTPM16',
            faculty: 'Khoa CNTT',
            solved: 135,
            acRate: 92.4,
            points: 3620,
            badge: 'Master',
            badgeColor: 'purple',
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 3,
            name: 'Lê Quỳnh Trang',
            id: '2022604567',
            class: 'DHKHMT17',
            faculty: 'Khoa CNTT',
            solved: 128,
            acRate: 91.0,
            points: 3410,
            badge: 'Master',
            badgeColor: 'purple',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 4,
            name: 'Nguyễn Văn An (Bạn)',
            id: '2021600123',
            class: 'DHKTPM16A',
            faculty: 'Khoa CNTT',
            solved: 48,
            acRate: 88.5,
            points: 1250,
            badge: 'Expert',
            badgeColor: 'blue',
            isMe: true,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 5,
            name: 'Phạm Minh Đức',
            id: '2021607890',
            class: 'DHTH16',
            faculty: 'Khoa CNTT',
            solved: 45,
            acRate: 86.2,
            points: 1190,
            badge: 'Expert',
            badgeColor: 'blue',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 6,
            name: 'Vũ Thị Thanh Hằng',
            id: '2022603344',
            class: 'DHKTPM17B',
            faculty: 'Khoa CNTT',
            solved: 41,
            acRate: 84.0,
            points: 1080,
            badge: 'Expert',
            badgeColor: 'blue',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 7,
            name: 'Đỗ Quốc Bảo',
            id: '2021605566',
            class: 'DHEE16',
            faculty: 'Khoa Điện tử',
            solved: 39,
            acRate: 82.5,
            points: 990,
            badge: 'Candidate Master',
            badgeColor: 'purple',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 8,
            name: 'Ngô Đức Thắng',
            id: '2023608899',
            class: 'DHKTPM18A',
            faculty: 'Khoa CNTT',
            solved: 35,
            acRate: 79.8,
            points: 920,
            badge: 'Specialist',
            badgeColor: 'green',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 9,
            name: 'Phan Bảo Ngọc',
            id: '2022609911',
            class: 'DHAUTO17',
            faculty: 'Khoa Cơ khí',
            solved: 32,
            acRate: 76.5,
            points: 850,
            badge: 'Specialist',
            badgeColor: 'green',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        },
        {
            rank: 10,
            name: 'Bùi Gia Khiêm',
            id: '2023601245',
            class: 'DHKHMT18',
            faculty: 'Khoa CNTT',
            solved: 29,
            acRate: 74.0,
            points: 790,
            badge: 'Specialist',
            badgeColor: 'green',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
        },
    ];

    // Map rankTitle -> màu badge hiển thị
    const mapBadgeColor = (rankTitle) => {
        switch (rankTitle) {
            case 'Grandmaster':
                return 'orange';
            case 'Master':
                return 'purple';
            case 'Candidate Master':
                return 'purple';
            case 'Expert':
                return 'blue';
            case 'Specialist':
                return 'green';
            default:
                return 'slate';
        }
    };

    // Chuyển đổi 1 record trả về từ API sang đúng shape mà UI đang cần.
    // const mapApiStudent = (item, index) => ({
    //     rank: index + 1, // API chưa trả field rank -> giả định mảng đã sort theo totalPoints giảm dần
    //     name: item.fullName,
    //     id: item.code,
    //     class: item.classId,
    //     faculty: item.department || item.className, // "department" hiện null, tạm dùng className thay thế
    //     solved: item.solvedCount ?? 0, // API hiện chưa có field này, cần backend bổ sung để hiển thị đúng
    //     acRate: item.acRate ?? 0, // tương tự, tạm mặc định 0
    //     points: item.totalPoints ?? 0,
    //     badge: item.rankTitle ?? 'Newbie',
    //     badgeColor: mapBadgeColor(item.rankTitle),
    //     avatar: item.avatarUrl,
    //     isMe: false, // cần so sánh item.code với mã số của user đang đăng nhập (lấy từ auth context/localStorage)
    // });

    useEffect(() => {
        let isMounted = true;
        const fetchLeaderboard = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await leaderboardService.getTop10Solvers();
                if (isMounted && Array.isArray(response) && response.length > 0) {
                    setRawStudents(response.map(mapApiStudent));
                }
            } catch (err) {
                console.warn('Lấy leaderboard từ backend thất bại:', err);
                if (isMounted) {
                    setError('Không tải được bảng xếp hạng. Vui lòng thử lại sau.');
                    // Fallback về danh sách mặc định khi backend lỗi
                    setRawStudents((prev) => (prev.length > 0 ? prev : rawStudentsDefault));
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchLeaderboard();
        return () => {
            isMounted = false;
        };
    }, []);

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
                    {/* <input
                        type="text"
                        placeholder="Tìm theo tên, MSSV, lớp..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cx('filterInput')}
                    /> */}
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

            {/* Your Rank Highlight Banner */}
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
                            Vị trí của bạn: <strong>Hạng #4 toàn trường</strong> (1,250 pts • 48 bài AC)
                        </div>
                        <div className={cx('myRankDesc')}>
                            Bạn chỉ cần thêm <strong style={{ color: 'var(--color-primary)' }}>160 điểm</strong> nữa để
                            vượt qua hạng 3 và lọt vào Top Podium!
                        </div>
                    </div>
                </div>
                <Link to={ROUTES.THI_DAU}>
                    <Button variant="primary" size="md">
                        Luyện tập kiếm điểm ngay
                    </Button>
                </Link>
            </div>
        </div>
    );
}
