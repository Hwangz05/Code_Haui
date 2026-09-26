import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserGraduate,
    faStar,
    faCircle,
    faFire,
    faMedal,
    faTrophy,
    faBookOpen,
    faSquareCheck,
    faChartColumn,
    faArrowRight,
    faCalendarDays,
} from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../config/routes.config';
import Badge from '../../components/common/Badge/Badge';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import styles from './ProfilePage.module.css';

const cx = ClassNames.bind(styles);
export default function ProfilePage() {
    const { user } = useAuth();
    const [activeSubTab, setActiveSubTab] = useState('submissions');

    const skills = [
        { name: 'C / C++ Cơ sở', percent: 90, color: '#3b82f6' },
        { name: 'Java & Hướng đối tượng (OOP)', percent: 85, color: '#f97316' },
        { name: 'Cấu trúc dữ liệu & Giải thuật', percent: 72, color: '#eab308' },
        { name: 'ReactJS & Web Frontend', percent: 65, color: '#06b6d4' },
        { name: 'Cơ sở dữ liệu & SQL', percent: 60, color: '#a855f7' },
    ];

    const recentSubmissions = [
        {
            id: 101,
            problem: '1. Tìm số lớn nhất trong mảng',
            lang: 'Java 17',
            status: 'ACCEPTED',
            score: 100,
            time: '18 ms',
            memory: '8.2 MB',
            date: 'Hôm nay 10:15',
        },
        {
            id: 102,
            problem: '4. Tìm đường ngắn nhất (BFS)',
            lang: 'Java 17',
            status: 'ACCEPTED',
            score: 200,
            time: '45 ms',
            memory: '16.4 MB',
            date: 'Hôm qua 21:30',
        },
        {
            id: 103,
            problem: '6. Quy hoạch động - Ba lô 0/1',
            lang: 'C++ 20',
            status: 'WRONG_ANSWER',
            score: 40,
            time: '12 ms',
            memory: '4.1 MB',
            date: '15/09/2026',
        },
        {
            id: 104,
            problem: '2. Kiểm tra số nguyên tố tối ưu',
            lang: 'C++ 20',
            status: 'ACCEPTED',
            score: 100,
            time: '8 ms',
            memory: '2.5 MB',
            date: '14/09/2026',
        },
        {
            id: 105,
            problem: '9. Số Fibonacci sử dụng Matrix Exponentiation',
            lang: 'Java 17',
            status: 'ACCEPTED',
            score: 200,
            time: '20 ms',
            memory: '10.1 MB',
            date: '12/09/2026',
        },
    ];

    const badges = [
        { title: 'Quán quân Mini Contest #3', icon: '🏆', desc: 'Đạt hạng 1 kỳ thi tuần HaUI' },
        { title: 'Chuyên gia Thuật toán', icon: '⚡', desc: 'Giải thành công 40+ bài thuật toán' },
        { title: 'Chuỗi Streak 10 Ngày', icon: '🔥', desc: 'Luyện tập liên tục không nghỉ' },
        { title: 'Chiến binh Olympic HaUI', icon: '🏅', desc: 'Tham gia đội tuyển Tin học' },
    ];

    return (
        <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
            {/* Profile Header Banner */}
            <div className={cx('headerCard')}>
                <div className={cx('headerFlex')}>
                    <div className={cx('avatarWrapper')}>
                        <img
                            src={
                                user?.avatar ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                            }
                            alt={user?.name}
                            className={cx('avatar')}
                        />
                        <span className={cx('onlineBadge')}></span>
                    </div>

                    <div className={cx('profileMeta')}>
                        <div className={cx('titleRow')}>
                            <h1 className={cx('userName')}>{user?.name || 'Nguyễn Văn An'}</h1>
                            <Badge variant="orange">
                                <FontAwesomeIcon icon={faUserGraduate} style={{ margin: '0 0.25rem 2px 0' }} />
                                <span style={{ fontSize: '0.875rem' }}>SINH VIÊN HAUI</span>
                            </Badge>
                            <Badge variant="yellow">
                                <FontAwesomeIcon icon={faStar} style={{ margin: '0 0.25rem 2px 0' }} />
                                <span style={{ fontSize: '0.875rem' }}>PRO CODER</span>
                            </Badge>
                        </div>

                        <p className={cx('userSub')}>
                            Mã SV:{' '}
                            <strong style={{ color: 'var(--color-primary)' }}>{user?.studentId || '2021600123'}</strong>
                            <span className={cx('dot')}>
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{ fontSize: '0.3rem', margin: '0 0.25rem 2px 0.25rem' }}
                                />
                            </span>
                            Lớp: <strong style={{ color: '#fff' }}>{user?.class || 'DHKTPM16A'}</strong>
                            <span className={cx('dot')}>
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{ fontSize: '0.3rem', margin: '0 0.25rem 2px 0.25rem' }}
                                />
                            </span>
                            Khoa: <strong>Công nghệ Thông tin</strong>
                        </p>

                        <div className={cx('userBio')}>
                            Đam mê lập trình giải thuật, cấu trúc dữ liệu và phát triển ứng dụng web full-stack. Thành
                            viên CLB Tin học HaUI.
                        </div>
                    </div>

                    <div className={cx('headerActions')}>
                        <Link to={ROUTES.THI_DAU}>
                            <Button variant="primary" size="md">
                                Vào thi đấu ngay
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className={cx('statsGrid')}>
                <div className={cx('statCard')}>
                    <div className={cx('statIcon ')}>
                        <FontAwesomeIcon icon={faTrophy} className={cx('color-gold')} />
                    </div>
                    <div className={cx('statValue')}>1,250</div>
                    <div className={cx('statLabel')}>Điểm tích lũy HaUI</div>
                    <div className={cx('statSub')}>Hạng #4 Toàn trường</div>
                </div>

                <div className={cx('statCard')}>
                    <div className={cx('statIcon ')}>
                        <FontAwesomeIcon icon={faSquareCheck} className={cx('color-green')} />
                    </div>
                    <div className={cx('statValue')}>48 / 500</div>
                    <div className={cx('statLabel')}>Bài thi đấu đã giải (AC)</div>
                    <div className={cx('statSub')}>Tỷ lệ chính xác: 88.5%</div>
                </div>

                <div className={cx('statCard')}>
                    <div className={cx('statIcon ')}>
                        <FontAwesomeIcon icon={faBookOpen} className={cx('color-blue')} />
                    </div>
                    <div className={cx('statValue')}>3 Khóa</div>
                    <div className={cx('statLabel')}>Khóa học đang học</div>
                    <div className={cx('statSub')}>1 Đã hoàn thành 100%</div>
                </div>

                <div className={cx('statCard')}>
                    <div className={cx('statIcon ')}>
                        <FontAwesomeIcon icon={faFire} className={cx('color-red')} />
                    </div>
                    <div className={cx('statValue')}>12 Ngày</div>
                    <div className={cx('statLabel')}>Chuỗi ngày học liên tục</div>
                    <div className={cx('statSub')}>Kỷ lục cá nhân: 24 ngày</div>
                </div>
            </div>

            {/* Two-Column Details Grid */}
            <div className={cx('contentGrid')}>
                {/* Left Column: Skills & Badges */}
                <div className={cx('leftCol')}>
                    {/* Skills Breakdown */}
                    <div className={cx('sectionCard')}>
                        <h3 className={cx('cardHeaderTitle')}>
                            <FontAwesomeIcon
                                icon={faChartColumn}
                                style={{ marginRight: '0.5rem', fontSize: '1.2rem', color: 'var(--color-primary)' }}
                            />
                            Kỹ năng & Ngôn ngữ
                        </h3>
                        <div className={cx('skillsList')}>
                            {skills.map((s, idx) => (
                                <div key={idx} className={cx('skillItem')}>
                                    <div className={cx('skillHeader')}>
                                        <span className={cx('skillName')}>{s.name}</span>
                                        <span className={cx('skillPercent')}>{s.percent}%</span>
                                    </div>
                                    <div className={cx('skillTrack')}>
                                        <div
                                            className={cx('skillBar')}
                                            style={{ width: `${s.percent}%`, backgroundColor: s.color }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Badges & Achievements */}
                    <div className={cx('sectionCard')}>
                        <h3 className={cx('cardHeaderTitle')}>
                            <FontAwesomeIcon
                                icon={faMedal}
                                style={{ marginRight: '0.5rem', fontSize: '1.2rem', color: 'var(--color-haui-gold)' }}
                            />
                            Huy hiệu & Thành tựu
                        </h3>
                        <div className={cx('badgesList')}>
                            {badges.map((b, idx) => (
                                <div key={idx} className={cx('badgeItem')}>
                                    <div className={cx('badgeIconBox')}>{b.icon}</div>
                                    <div>
                                        <strong className={cx('badgeTitle')}>{b.title}</strong>
                                        <p className={cx('badgeDesc')}>{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Submissions History */}
                <div className={cx('rightCol')}>
                    <div className={cx('sectionCard')}>
                        <div className={cx('tabNavRow')}>
                            <h3 className={cx('cardHeaderTitle')} style={{ margin: 0 }}>
                                <FontAwesomeIcon
                                    icon={faCalendarDays}
                                    style={{ marginRight: '0.5rem', fontSize: '1.2rem', color: 'var(--color-haui-blue)' }}
                                />
                                Lịch sử giải bài gần đây
                            </h3>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>5 bài nộp mới nhất</span>
                        </div>

                        <div className={cx('submissionsTableWrapper')}>
                            <table className={cx('subTable')}>
                                <thead>
                                    <tr>
                                        <th>Bài thi đấu</th>
                                        <th>Ngôn ngữ</th>
                                        <th style={{ textAlign: 'center' }}>Kết quả</th>
                                        <th style={{ textAlign: 'center' }}>Thời gian</th>
                                        <th style={{ textAlign: 'right' }}>Ngày nộp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentSubmissions.map((sub) => (
                                        <tr key={sub.id}>
                                            <td>
                                                <strong className={cx('subProblemName')}>{sub.problem}</strong>
                                                <div className={cx('subMem')}>RAM: {sub.memory}</div>
                                            </td>
                                            <td>
                                                <Badge variant="slate">{sub.lang}</Badge>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {sub.status === 'ACCEPTED' ? (
                                                    <Badge variant="green">ACCEPTED (+{sub.score})</Badge>
                                                ) : (
                                                    <Badge variant="red">WRONG ANSWER</Badge>
                                                )}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: 'center',
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: '0.8rem',
                                                    color: 'var(--text-muted)',
                                                }}
                                            >
                                                {sub.time}
                                            </td>
                                            <td
                                                style={{
                                                    textAlign: 'right',
                                                    fontSize: '0.75rem',
                                                    color: 'var(--text-dim)',
                                                }}
                                            >
                                                {sub.date}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className={styles.bottomLinkBox}>
                            <Link to={ROUTES.THI_DAU} className={styles.seeAllLink}>
                                Xem toàn bộ bài tập trong kho lưu trữ
                                <FontAwesomeIcon
                                    icon={faArrowRight}
                                    style={{ marginLeft: '0.4rem', fontSize: '0.8rem', color: 'var(--color-haui-red)' }}
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
