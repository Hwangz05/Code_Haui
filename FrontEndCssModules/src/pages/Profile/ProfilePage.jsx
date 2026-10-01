import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserGraduate,
    faChalkboardTeacher,
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
    faClock,
} from '@fortawesome/free-solid-svg-icons';

import { useAuthContext } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes.config';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import styles from './ProfilePage.module.css';
import { leaderboardService } from '../../services/leaderboardService';
import { userService, computeUserSkills, formatRelativeDate, formatLangLabel } from '../../services/userService';

const cx = ClassNames.bind(styles);

export default function ProfilePage() {
    const { user } = useAuthContext();
    const [profile, setProfile] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [userRank, setUserRank] = useState(1);
    const [loading, setLoading] = useState(true);

    const isTeacher =
        user?.role === 'TEACHER' ||
        (user?.studentId && String(user.studentId).toUpperCase().startsWith('GV')) ||
        (user?.code && String(user.code).toUpperCase().startsWith('GV'));

    const userCode = user?.studentId || user?.code || (isTeacher ? 'GV2026' : '2020601111');
    const userId = user?.id || (isTeacher ? 1 : 3);

    useEffect(() => {
        let isMounted = true;

        async function fetchProfileData() {
            setLoading(true);
            try {
                // 1. Fetch User Profile from Backend
                let userData = user;
                try {
                    const mappedUser = await userService.getUserByCode(userCode);
                    if (mappedUser) {
                        userData = { ...user, ...mappedUser };
                    }
                } catch (e) {
                    console.warn('Không lấy được profile từ API, sử dụng dữ liệu auth:', e.message);
                }

                if (isMounted) setProfile(userData);

                // 2. Fetch User Submissions from Backend
                let subsList = [];
                try {
                    subsList = await userService.getUserSubmissions(userId);
                } catch (e) {
                    console.warn('Không lấy được submissions từ API:', e.message);
                }

                if (isMounted) setSubmissions(subsList);

                // 3. Fetch Leaderboard to calculate exact rank
                if (!isTeacher) {
                    try {
                        const lbData = await leaderboardService.getTop10Solvers();
                        if (Array.isArray(lbData) && lbData.length > 0) {
                            const foundIdx = lbData.findIndex((st) => st.code === userCode);
                            if (foundIdx !== -1) {
                                if (isMounted) setUserRank(foundIdx + 1);
                            } else {
                                // Estimate from points
                                const points = userData?.totalPoints || 0;
                                const rank = points >= 3800 ? 1 : points >= 3400 ? 2 : points >= 2900 ? 3 : points >= 2500 ? 4 : 5;
                                if (isMounted) setUserRank(rank);
                            }
                        }
                    } catch (e) {
                        console.warn('Không lấy được leaderboard rank:', e.message);
                    }
                }
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu trang cá nhân:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchProfileData();

        return () => {
            isMounted = false;
        };
    }, [user, userCode, userId, isTeacher]);

    // Computed Stats
    const acCount = submissions.filter((s) => s.status === 'AC' || s.status === 'ACCEPTED').length;
    const totalSubCount = submissions.length;
    const passRateCalc =
        profile?.passRate != null
            ? Number(profile.passRate).toFixed(1)
            : totalSubCount > 0
            ? ((acCount / totalSubCount) * 100).toFixed(1)
            : '100.0';

    const totalPointsCalc =
        profile?.totalPoints != null
            ? Number(profile.totalPoints).toLocaleString()
            : user?.totalPoints != null
            ? Number(user.totalPoints).toLocaleString()
            : '3,840';

    const streakDaysCalc = profile?.streakDays || user?.streakDays || 32;

    const skills = computeUserSkills({ profile, user, submissions, isTeacher });

    // Dynamic Badges
    const badges = isTeacher
        ? [
              { title: 'Giảng viên Xuất sắc', icon: '👨‍🏫', desc: 'Khoa Công nghệ Thông tin - HaUI' },
              { title: 'Chuyên gia Thuật toán', icon: '⚡', desc: 'Cố vấn đội tuyển Olympic Tin học' },
              { title: 'Cố vấn Đề thi', icon: '🏆', desc: 'Soạn thảo & phê duyệt ngân hàng bài tập' },
              { title: 'Đóng góp Nền tảng', icon: '🌟', desc: 'Tích cực phát triển hệ sinh thái Code HaUI' },
          ]
        : [
              {
                  title: userRank === 1 ? 'Quán quân Toàn trường' : `Top #${userRank} Podium HaUI`,
                  icon: '🏆',
                  desc: userRank === 1 ? 'Dẫn đầu Bảng xếp hạng sinh viên HaUI' : `Xuất sắc lọt Top ${userRank} toàn trường`,
              },
              {
                  title: `${profile?.rankTitle || 'Grandmaster'} Coder`,
                  icon: '⚡',
                  desc: `Giải thành công ${acCount || 5} bài thuật toán thực chiến`,
              },
              {
                  title: `Chuỗi Streak ${streakDaysCalc} Ngày`,
                  icon: '🔥',
                  desc: 'Luyện tập liên tục duy trì phong độ',
              },
              {
                  title: 'Chiến binh Olympic HaUI',
                  icon: '🏅',
                  desc: 'Thành viên xuất sắc CLB Tin học HaUI',
              },
          ];

    return (
        <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
            {/* 1. Profile Header Banner */}
            <div className={cx('headerCard')}>
                <div className={cx('headerFlex')}>
                    <div className={cx('avatarWrapper')}>
                        <img
                            src={
                                profile?.avatarUrl ||
                                profile?.avatar ||
                                user?.avatarUrl ||
                                user?.avatar ||
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
                            }
                            alt={profile?.fullName || user?.name}
                            className={cx('avatar')}
                        />
                        <span className={cx('onlineBadge')}></span>
                    </div>

                    <div className={cx('profileMeta')}>
                        <div className={cx('titleRow')}>
                            <h1 className={cx('userName')}>{profile?.fullName || user?.fullName || user?.name || 'Trần Văn Mạnh'}</h1>
                            <Badge variant={isTeacher ? 'blue' : 'orange'}>
                                <FontAwesomeIcon
                                    icon={isTeacher ? faChalkboardTeacher : faUserGraduate}
                                    style={{ margin: '0 0.25rem 2px 0' }}
                                />
                                <span style={{ fontSize: '0.875rem' }}>
                                    {isTeacher ? 'GIẢNG VIÊN HAUI' : 'SINH VIÊN HAUI'}
                                </span>
                            </Badge>
                            <Badge variant="yellow">
                                <FontAwesomeIcon icon={faStar} style={{ margin: '0 0.25rem 2px 0' }} />
                                <span style={{ fontSize: '0.875rem' }}>
                                    {isTeacher ? 'CHUYÊN GIA' : profile?.rankTitle || user?.rankTitle || 'GRANDMASTER'}
                                </span>
                            </Badge>
                        </div>

                        <p className={cx('userSub')}>
                            {isTeacher ? 'Mã GV: ' : 'Mã SV: '}
                            <strong style={{ color: 'var(--color-primary)' }}>
                                {profile?.code || profile?.studentId || userCode}
                            </strong>
                            <span className={cx('dot')}>
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{ fontSize: '0.3rem', margin: '0 0.25rem 2px 0.25rem' }}
                                />
                            </span>
                            {isTeacher ? 'Bộ môn: ' : 'Lớp: '}
                            <strong style={{ color: '#fff' }}>
                                {isTeacher
                                    ? 'Khoa học Máy tính'
                                    : profile?.className || profile?.classId || user?.className || 'Kỹ thuật phần mềm 16A'}
                            </strong>
                            <span className={cx('dot')}>
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    style={{ fontSize: '0.3rem', margin: '0 0.25rem 2px 0.25rem' }}
                                />
                            </span>
                            Khoa: <strong>{profile?.department || user?.department || 'Công nghệ Thông tin'}</strong>
                        </p>

                        <div className={cx('userBio')}>
                            {isTeacher
                                ? 'Giảng viên Bộ môn Khoa học Máy tính, Khoa Công nghệ Thông tin - Đại học Công nghiệp Hà Nội. Cố vấn học tập và nghiên cứu thuật toán nâng cao.'
                                : 'Đam mê lập trình giải thuật, cấu trúc dữ liệu và phát triển ứng dụng web full-stack. Thành viên tích cực CLB Tin học HaUI.'}
                        </div>
                    </div>

                    <div className={cx('headerActions')}>
                        <Link to={isTeacher ? ROUTES.TEACHER_DASHBOARD : ROUTES.THI_DAU}>
                            <Button variant="primary" size="md">
                                {isTeacher ? 'Quản lý Giảng dạy' : 'Vào thi đấu ngay'}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. Stats Cards Row */}
            <div className={cx('statsGrid')}>
                {isTeacher ? (
                    <>
                        <div className={cx('statCard')}>
                            <div className={cx('statIcon ')}>
                                <FontAwesomeIcon icon={faTrophy} className={cx('color-gold')} />
                            </div>
                            <div className={cx('statValue')}>120+ Đề</div>
                            <div className={cx('statLabel')}>Ngân hàng đề thi</div>
                            <div className={cx('statSub')}>Khoa CNTT - HaUI</div>
                        </div>

                        <div className={cx('statCard')}>
                            <div className={cx('statIcon ')}>
                                <FontAwesomeIcon icon={faSquareCheck} className={cx('color-green')} />
                            </div>
                            <div className={cx('statValue')}>4 Lớp</div>
                            <div className={cx('statLabel')}>Lớp học phần phụ trách</div>
                            <div className={cx('statSub')}>Học kỳ I (2026 - 2027)</div>
                        </div>

                        <div className={cx('statCard')}>
                            <div className={cx('statIcon ')}>
                                <FontAwesomeIcon icon={faBookOpen} className={cx('color-blue')} />
                            </div>
                            <div className={cx('statValue')}>180 SV</div>
                            <div className={cx('statLabel')}>Sinh viên đang theo học</div>
                            <div className={cx('statSub')}>Tỷ lệ qua môn: 96.5%</div>
                        </div>

                        <div className={cx('statCard')}>
                            <div className={cx('statIcon ')}>
                                <FontAwesomeIcon icon={faFire} className={cx('color-red')} />
                            </div>
                            <div className={cx('statValue')}>100%</div>
                            <div className={cx('statLabel')}>Tỷ lệ tương tác</div>
                            <div className={cx('statSub')}>Hoạt động thường xuyên</div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={cx('statCard')}>
                            <div className={cx('statIcon ')}>
                                <FontAwesomeIcon icon={faTrophy} className={cx('color-gold')} />
                            </div>
                            <div className={cx('statValue')}>{totalPointsCalc}</div>
                            <div className={cx('statLabel')}>Điểm tích lũy HaUI</div>
                            <div className={cx('statSub')}>
                                Hạng #{userRank} {userRank <= 3 ? 'Podium toàn trường' : 'Toàn trường'}
                            </div>
                        </div>

                        <div className={cx('statCard')}>
                            <div className={cx('statIcon ')}>
                                <FontAwesomeIcon icon={faSquareCheck} className={cx('color-green')} />
                            </div>
                            <div className={cx('statValue')}>
                                {acCount} / {submissions.length > 0 ? submissions.length : 5}
                            </div>
                            <div className={cx('statLabel')}>Bài thi đấu đã giải (AC)</div>
                            <div className={cx('statSub')}>Tỷ lệ chính xác: {passRateCalc}%</div>
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
                            <div className={cx('statValue')}>{streakDaysCalc} Ngày</div>
                            <div className={cx('statLabel')}>Chuỗi ngày học liên tục</div>
                            <div className={cx('statSub')}>Kỷ lục cá nhân: {streakDaysCalc + 12} ngày</div>
                        </div>
                    </>
                )}
            </div>

            {/* 3. Two-Column Details Grid */}
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
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                {submissions.length} bài nộp được ghi nhận
                            </span>
                        </div>

                        <div className={cx('submissionsTableWrapper')}>
                            {submissions.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Chưa có bài nộp nào. Hãy vào thi đấu để ghi nhận kết quả!
                                </div>
                            ) : (
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
                                        {submissions.map((sub, idx) => {
                                            const isAC = sub.status === 'AC' || sub.status === 'ACCEPTED';
                                            const score = sub.scoreEarned || (isAC ? 100 : 0);
                                            const memoryMb = sub.memoryUsedKb
                                                ? (sub.memoryUsedKb / 1024).toFixed(1) + ' MB'
                                                : sub.memory || '15.4 MB';
                                            const runtime = sub.runtimeMs ? `${sub.runtimeMs} ms` : sub.time || '38 ms';

                                            return (
                                                <tr key={sub.id || idx}>
                                                    <td>
                                                        <strong className={cx('subProblemName')}>
                                                            {sub.problemTitle || sub.problem || `Bài tập #${sub.problemId || idx + 1}`}
                                                        </strong>
                                                        <div className={cx('subMem')}>RAM: {memoryMb}</div>
                                                    </td>
                                                    <td>
                                                        <Badge variant="slate">{formatLangLabel(sub.language || sub.lang)}</Badge>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>
                                                        {isAC ? (
                                                            <Badge variant="green">ACCEPTED (+{score})</Badge>
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
                                                        {runtime}
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: 'right',
                                                            fontSize: '0.75rem',
                                                            color: 'var(--text-dim)',
                                                        }}
                                                    >
                                                        {formatRelativeDate(sub.createdAt || sub.date)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
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
