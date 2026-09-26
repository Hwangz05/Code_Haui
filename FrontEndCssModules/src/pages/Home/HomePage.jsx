import React, { useState } from 'react';
import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ClassNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserGraduate,
    faFire,
    faBoltLightning,
    faTrophy,
    faBookOpen,
    faArrowRight,
    faUserGroup,
    faCalendarDays,
    faClock,
    faRocket,
} from '@fortawesome/free-solid-svg-icons';

import { ROUTES } from '../../config/routes.config';
import { courseService, mapCourseFromApi } from '../../services/courseService';
import Button from '../../components/common/Button/Button';
import Badge from '../../components/common/Badge/Badge';
import CourseCard from '../../components/features/Courses/CourseCard';
import styles from './HomePage.module.css';

const cx = ClassNames.bind(styles);

function useTypewriter(text, speed = 22) {
    const [displayed, setDisplayed] = useState('');
    const isPausedRef = useRef(false);
    const charIndexRef = useRef(0);
    const timeoutRef = useRef(null);

    // Reset khi đổi tab
    useEffect(() => {
        charIndexRef.current = 0;
        setDisplayed('');

        return () => clearTimeout(timeoutRef.current);
    }, [text]);

    // Vòng lặp gõ chữ
    useEffect(() => {
        function typeNext() {
            // Nếu đang hover thì tạm dừng
            if (isPausedRef.current) {
                timeoutRef.current = setTimeout(typeNext, 80);
                return;
            }

            // Đang còn ký tự → tiếp tục gõ
            if (charIndexRef.current < text.length) {
                const nextChar = text[charIndexRef.current];

                setDisplayed((prev) => prev + nextChar);
                charIndexRef.current += 1;

                timeoutRef.current = setTimeout(typeNext, speed);
            }
            // Gõ xong → chờ 2 giây → chạy lại từ đầu
            else {
                timeoutRef.current = setTimeout(() => {
                    charIndexRef.current = 0;
                    setDisplayed('');
                    typeNext();
                }, 2000);
            }
        }

        timeoutRef.current = setTimeout(typeNext, speed);

        return () => clearTimeout(timeoutRef.current);
    }, [text, speed]);

    // Di chuột vào → pause
    const pause = useCallback(() => {
        isPausedRef.current = true;
        clearTimeout(timeoutRef.current);
    }, []);

    // Di chuột ra → chạy tiếp
    const resume = useCallback(() => {
        isPausedRef.current = false;
        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            // Nếu code đã chạy xong thì bắt đầu lại
            if (charIndexRef.current >= text.length) {
                charIndexRef.current = 0;
                setDisplayed('');
            }

            // Tiếp tục gõ
            const typeNext = () => {
                if (isPausedRef.current) return;

                if (charIndexRef.current < text.length) {
                    const nextChar = text[charIndexRef.current];

                    setDisplayed((prev) => prev + nextChar);
                    charIndexRef.current += 1;

                    timeoutRef.current = setTimeout(typeNext, speed);
                } else {
                    timeoutRef.current = setTimeout(() => {
                        charIndexRef.current = 0;
                        setDisplayed('');
                        typeNext();
                    }, 3000);
                }
            };

            typeNext();
        }, 50);
    }, [text, speed]);

    return { displayed, pause, resume };
}

export default function HomePage() {
    const [activeTab, setActiveTab] = useState('java');
    const [runResult, setRunResult] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const codeSnippets = {
        java: `public class CodeHaui {
    public static void main(String[] args) {
        System.out.println("Xin chào Đại học Công nghiệp Hà Nội!");
        System.out.println("Chào mừng bạn đến với CODE HAUI 🚀");
        
        int n = 5;
        long factorial = 1;
        for (int i = 1; i <= n; i++) {
            factorial *= i;
        }
        System.out.println("5! = " + factorial);
    }
}`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Xin chao sinh vien HaUI!" << endl;
    cout << "San sang chinh phuc thu thach lap trinh!" << endl;
    
    int a = 15, b = 25;
    cout << "UCLN(" << a << ", " << b << ") = 5" << endl;
    return 0;
}`,
        react: `function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div className="p-4 bg-slate-800 rounded-xl">
      <h1 className="text-orange-500 font-bold">CODE HAUI Frontend</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Luyện code ngay: {count} bài
      </button>
    </div>
  );
}`,
    };

    const { displayed, pause, resume } = useTypewriter(codeSnippets[activeTab], 20);

    const handleRun = () => {
        setIsRunning(true);
        setRunResult('Đang biên dịch trên HaUI Sandbox Container...');
        setTimeout(() => {
            setIsRunning(false);
            if (activeTab === 'java') {
                setRunResult(`[KẾT QUẢ BIÊN DỊCH JAVA 17]
Xin chào Đại học Công nghiệp Hà Nội!
Chào mừng bạn đến với nền tảng CODE HAUI 🚀
5! = 120

>>> Thời gian thực thi: 42ms | Bộ nhớ: 12.4 MB | Status: ACCEPTED (100/100)`);
            } else if (activeTab === 'cpp') {
                setRunResult(`[KẾT QUẢ BIÊN DỊCH G++ 12]
Xin chao sinh vien HaUI!
San sang chinh phuc thu thach lap trinh!
UCLN(15, 25) = 5

>>> Thời gian thực thi: 8ms | Bộ nhớ: 3.2 MB | Status: ACCEPTED (100/100)`);
            } else {
                setRunResult(`[REACT LIVE PREVIEW]
Render component thành công!
State ban đầu: count = 0`);
            }
        }, 600);
    };

    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    const defaultCourses = [
        {
            id: 1,
            title: 'Lập trình Java Căn bản & OOP',
            category: 'Java Core',
            level: 'Cơ bản',
            lessons: 45,
            students: 2340,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60',
            badge: 'Bắt buộc - HaUI',
            desc: 'Nắm vững kiến thức cốt lõi Java 17, Collections và Hướng đối tượng chuẩn HaUI.',
            instructor: 'TS. Nguyễn Văn A',
        },
        {
            id: 2,
            title: 'Cấu trúc Dữ liệu & Giải thuật',
            category: 'Algorithms',
            level: 'Trung cấp',
            lessons: 60,
            students: 1890,
            rating: 4.95,
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60',
            badge: 'Hot nhất',
            desc: 'Rèn luyện tư duy thuật toán: Sắp xếp, Tìm kiếm nhị phân, DP, Tree & Graph.',
            instructor: 'ThS. Trần Thị B',
        },
        {
            id: 3,
            title: 'Lập trình Web với ReactJS & Tailwind',
            category: 'Frontend',
            level: 'Cơ bản - Nâng cao',
            lessons: 52,
            students: 1420,
            rating: 4.85,
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60',
            badge: 'Thực chiến',
            desc: 'Xây dựng giao diện web mượt mà với React Hooks, Router, Context & CSS Modules.',
            instructor: 'ThS. Lê Văn C',
        },
        {
            id: 4,
            title: 'Backend Chuyên sâu Java Spring Boot 3',
            category: 'Backend',
            level: 'Nâng cao',
            lessons: 68,
            students: 1150,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60',
            badge: 'Doanh nghiệp',
            desc: 'Thiết kế REST API bảo mật Spring Security JWT, JPA Hibernate & MySQL.',
            instructor: 'TS. Phạm Minh D',
        },
    ];

    // Gọi API lấy danh sách khóa học thật từ Backend khi vào Trang Chủ
    useEffect(() => {
        let isMounted = true;
        const fetchCourses = async () => {
            try {
                setLoadingCourses(true);
                const data = await courseService.getAllCourses();
                if (isMounted && Array.isArray(data) && data.length > 0) {
                    setCourses(data.map(mapCourseFromApi));
                } else if (isMounted) {
                    setCourses(defaultCourses);
                }
            } catch (err) {
                console.warn('Backend chưa bật hoặc lỗi kết nối, hiển thị dữ liệu mẫu mặc định:', err);
                if (isMounted) {
                    setCourses(defaultCourses);
                }
            } finally {
                if (isMounted) setLoadingCourses(false);
            }
        };

        fetchCourses();

        return () => {
            isMounted = false;
        };
    }, []);

    const recentContests = [
        {
            id: 101,
            title: 'HaUI Coding Cup 2026 - Vòng 1',
            date: 'Chủ Nhật, 15/09/2026',
            time: '08:00 - 11:30 (210 phút)',
            participants: 580,
            status: 'Sắp diễn ra',
            statusVariant: 'yellow',
        },
        {
            id: 102,
            title: 'Thử thách Thuật toán: Quy hoạch động',
            date: 'Đang diễn ra liên tục',
            time: 'Luyện tập tự do',
            participants: 1240,
            status: 'Đang mở',
            statusVariant: 'green',
        },
        {
            id: 103,
            title: 'Đấu trường Tân sinh viên K19 HaUI',
            date: 'Đã kết thúc',
            time: 'Top 1: 500/500đ',
            participants: 890,
            status: 'Xem kết quả',
            statusVariant: 'slate',
        },
    ];

    return (
        <div>
            {/* 1. Hero Section */}
            <section className={cx('heroSection')}>
                <div className={`container ${styles.heroGrid}`}>
                    <div>
                        <div className={cx('heroBadge')}>
                            <FontAwesomeIcon icon={faUserGraduate} className={cx('usergraduate-Icon')} />
                            NỀN TẢNG HỌC LẬP TRÌNH SINH VIÊN HAUI
                        </div>
                        <h1 className={cx('heroTitle')}>
                            Học Lập Trình Hiệu Quả <br />
                            <span className={cx('highlightText')}>Bứt Phá Cùng CODE HAUI</span>
                        </h1>
                        <p className={cx('heroDesc')}>
                            Nền tảng kiến tạo kỹ năng lập trình, bài tập thuật toán tự động chấm điểm và các giải đấu
                            chuyên nghiệp dành riêng cho sinh viên Đại học Công nghiệp Hà Nội.
                        </p>
                        <div className={cx('heroBtnGroup')}>
                            <Link to={ROUTES.THI_DAU}>
                                <Button variant="primary" size="lg">
                                    <FontAwesomeIcon icon={faFire} className={cx('fire-Icon')} />
                                    Bắt đầu Thi Đấu
                                </Button>
                            </Link>
                            <Link to={ROUTES.KHOA_HOC}>
                                <Button variant="outline" size="lg">
                                    <FontAwesomeIcon icon={faBookOpen} className={cx('book-Icon')} />
                                    Khám phá Khóa học
                                </Button>
                            </Link>
                        </div>

                        <div className={cx('metricsRow')}>
                            <div>
                                <div className={cx('metricValue')}>10,000+</div>
                                <div className={cx('metricLabel')}>Sinh viên HaUI</div>
                            </div>
                            <div>
                                <div className={cx('metricValue')} style={{ color: 'var(--color-primary)' }}>
                                    1,200+
                                </div>
                                <div className={cx('metricLabel')}>Bài thi đấu & Thuật toán</div>
                            </div>
                            <div>
                                <div className={cx('metricValue')} style={{ color: 'var(--color-success)' }}>
                                    99.8%
                                </div>
                                <div className={cx('metricLabel')}>Tự động chấm điểm</div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Code Editor - KHUNG CỐ ĐỊNH */}
                    <div className={cx('editorBox')}>
                        <div className={cx('editorHeader')}>
                            <div className={cx('dotGroup')}>
                                <span className={cx('dotRed')}></span>
                                <span className={cx('dotYellow')}></span>
                                <span className={cx('dotGreen')}></span>
                                <span
                                    style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-dim)',
                                        fontFamily: 'var(--font-mono)',
                                        marginLeft: '0.5rem',
                                    }}
                                >
                                    CodeHaui_Runner.java
                                </span>
                            </div>
                            <div className={cx('editorTabs')}>
                                {['java', 'cpp', 'react'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => {
                                            setActiveTab(lang);
                                            setRunResult('');
                                        }}
                                        className={`${cx('tabBtn')} ${activeTab === lang ? cx('tabBtnActive') : ''}`}
                                    >
                                        {lang.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div
                            className={cx('editorBody')}
                            onMouseEnter={pause}
                            onMouseLeave={resume}
                            title="Di chuột vào để tạm dừng"
                        >
                            <pre>
                                {displayed}
                                <span className={cx('cursor')}>|</span>
                            </pre>
                        </div>

                        <div className={cx('editorFooter')}>
                            <small style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>HaUI Cloud Sandbox</small>
                            <Button variant="primary" size="sm" loading={isRunning} onClick={handleRun}>
                                ▶ Chạy thử Code
                            </Button>
                        </div>

                        {runResult && (
                            <div className={cx('terminalOutput')}>
                                <p style={{ color: 'var(--color-success)', fontWeight: 700, marginBottom: '4px' }}>
                                    TERMINAL OUTPUT:
                                </p>
                                {runResult}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 2. Phương Pháp Học Kiến Tạo Tại HAUI */}
            <section className={`container ${styles.section}`}>
                <div className={cx('sectionHeader')}>
                    <h2 className={cx('sectionTitle')}>Phương Pháp Học Kiến Tạo Tại HaUI</h2>
                    <p className={cx('sectionSubtitle')}>
                        Áp dụng mô hình Social Constructivism: Học nhóm tương tác, giải quyết vấn đề thực tiễn
                    </p>
                </div>

                <div className={cx('pillarsGrid')}>
                    <div className={cx('pillarCard')}>
                        <div className={cx('pillarIcon')} style={{ background: 'rgba(249, 115, 22, 0.1)' }}>
                            <FontAwesomeIcon
                                icon={faBoltLightning}
                                className={cx('bolt-Icon')}
                                style={{ color: 'var(--color-primary)' }}
                            />
                        </div>
                        <h3 className={cx('pillarTitle')}>Bài Tập Thực Hành Liên Tục</h3>
                        <p className={cx('pillarDesc')}>
                            Hàng ngàn bài tập luyện code, từ Dễ → Trung bình → Khó, cùng tính năng chấm điểm tự động để
                            rèn kỹ năng lập trình.
                        </p>
                    </div>

                    <div className={cx('pillarCard')}>
                        <div className={cx('pillarIcon')} style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                            <FontAwesomeIcon icon={faTrophy} className={cx('trophy-Icon')} style={{ color: '#22c55e' }} />
                        </div>
                        <h3 className={cx('pillarTitle')}>Kỳ Thi Đấu Lập Trình</h3>
                        <p className={cx('pillarDesc')}>
                            Tham gia các kỳ thi online, giải toán thuật và lập trình thực chiến. Xây dựng danh tiếng và cơ
                            hội học bổng giỏi.
                        </p>
                    </div>

                    <div className={cx('pillarCard')}>
                        <div className={cx('pillarIcon')} style={{ background: 'rgba(37, 99, 235, 0.1)' }}>
                            <FontAwesomeIcon icon={faBookOpen} className={cx('book-Icon')} style={{ color: '#2563eb' }} />
                        </div>
                        <h3 className={cx('pillarTitle')}>Giáo trình bám sát học phần HaUI</h3>
                        <p className={cx('pillarDesc')}>
                            Các bài học được biên soạn chuẩn theo chương trình đào tạo của Khoa Công nghệ Thông tin - Đại
                            học Công nghiệp Hà Nội.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Khóa Học Tiêu Biểu */}
            <section className={`container ${styles.section}`}>
                <div className={cx('sectionHeaderRow')}>
                    <div>
                        <h2 className={cx('sectionTitle')}>Khóa Học Tiêu Biểu</h2>
                        <p className={cx('sectionSubtitle')} style={{ marginTop: '0.25rem' }}>
                            Được giảng viên và sinh viên ưu tú HaUI biên soạn
                        </p>
                    </div>
                    <Link to={ROUTES.KHOA_HOC} className={cx('viewAllLink')}>
                        Xem tất cả khóa học
                        <FontAwesomeIcon icon={faArrowRight} className={cx('arrow-Icon')} />
                    </Link>
                </div>

                <div className={cx('courseGrid')}>
                    {(courses.length > 0 ? courses : defaultCourses).map((c) => (
                        <CourseCard key={c.id} course={c} />
                    ))}
                </div>
            </section>

            {/* 4. Kỳ Thi Đấu Thuật Toán HaUI */}
            <section className="container">
                <div className={cx('contestBox')}>
                    <div className={cx('contestHeader')}>
                        <div>
                            <span
                                style={{
                                    fontSize: '1.2rem',
                                    fontWeight: 700,
                                    color: 'var(--color-primary)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                <FontAwesomeIcon icon={faBoltLightning} className={cx('bolt-lightning-Icon')} />
                                ĐẤU TRƯỜNG LẬP TRÌNH
                            </span>
                            <h2 className={cx('sectionTitle')} style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>
                                Kỳ Thi Đấu Thuật Toán HaUI
                            </h2>
                            <p className={cx('sectionSubtitle')} style={{ marginTop: '0.25rem' }}>
                                Tham gia thi đấu, tích lũy điểm rèn luyện và săn học bổng sinh viên giỏi
                            </p>
                        </div>
                        <Link to={ROUTES.THI_DAU}>
                            <Button variant="primary" size="sm">
                                Xem tất cả bài thi đấu
                                <FontAwesomeIcon icon={faArrowRight} className={cx('arrow-Icon--right')} />
                            </Button>
                        </Link>
                    </div>

                    <div className={cx('contestGrid')}>
                        {recentContests.map((c) => (
                            <div key={c.id} className={cx('contestCard')}>
                                <div className={cx('contestCardTop')}>
                                    <Badge variant={c.statusVariant}>{c.status}</Badge>
                                    <span style={{ color: 'var(--text-dim)' }}>
                                        <FontAwesomeIcon icon={faUserGroup} className={cx('usergroup-Icon-match')} />
                                        {c.participants} SV tham gia
                                    </span>
                                </div>
                                <h4 className={cx('contestCardTitle')}>{c.title}</h4>
                                <div className={cx('contestCardMeta')}>
                                    <span>
                                        <FontAwesomeIcon icon={faCalendarDays} className={cx('calendar-Icon-match')} />
                                        {c.date}
                                    </span>
                                    <span>
                                        <FontAwesomeIcon icon={faClock} className={cx('clock-Icon-match')} />
                                        {c.time}
                                    </span>
                                </div>
                                <Link to={ROUTES.THI_DAU} style={{ marginTop: '0.5rem' }}>
                                    <Button variant="secondary" size="sm" style={{ width: '100%' }}>
                                        <spann className={cx('buttonText')}>Tham gia thi đấu</spann>
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Sinh Viên Nói Gì Về CODE HAUI? */}
            <section className={`container ${styles.section}`}>
                <div className={cx('sectionHeader')}>
                    <h2 className={cx('sectionTitle')}>Sinh Viên Nói Gì Về CODE HAUI?</h2>
                    <p className={cx('sectionSubtitle')}>
                        Chia sẻ chân thực từ các sinh viên Khoa Công nghệ Thông tin HaUI
                    </p>
                </div>

                <div className={cx('testiGrid')}>
                    <div className={cx('testiCard')}>
                        <p className={cx('testiQuote')}>
                            "Giao diện CODE HAUI rất mượt, nộp bài Java nhận kết quả ngay lập tức. Nhờ luyện tập ở đây mà
                            mình đã đạt điểm A+ môn Cấu trúc dữ liệu và giải thuật kỳ vừa rồi!"
                        </p>
                        <div className={cx('testiAuthor')}>
                            <div className={cx('avatarCircle')} style={{ background: '#ea580c' }}>
                                TH
                            </div>
                            <div>
                                <p className={cx('authorName')}>Trần Hải Đăng</p>
                                <p className={cx('authorClass')}>DHKTPM15 - HaUI (Giải Nhất Olympic)</p>
                            </div>
                        </div>
                    </div>

                    <div className={cx('testiCard')}>
                        <p className={cx('testiQuote')}>
                            "Trang thi đấu có phân chia độ khó từ Dễ đến Khó rất rõ ràng. Mỗi ngày mình đều giải 2 bài để
                            duy trì thói quen tư duy thuật toán."
                        </p>
                        <div className={cx('testiAuthor')}>
                            <div className={cx('avatarCircle')} style={{ background: '#2563eb' }}>
                                LA
                            </div>
                            <div>
                                <p className={cx('authorName')}>Lê Thuỳ Anh</p>
                                <p className={cx('authorClass')}>DHTH16 - HaUI</p>
                            </div>
                        </div>
                    </div>

                    <div className={cx('testiCard')}>
                        <p className={cx('testiQuote')}>
                            "Hệ thống đăng nhập bằng Mã sinh viên rất tiện. Bảng xếp hạng tạo động lực cạnh tranh lành
                            mạnh giữa các lớp trong khoa."
                        </p>
                        <div className={cx('testiAuthor')}>
                            <div className={cx('avatarCircle')} style={{ background: '#059669' }}>
                                NV
                            </div>
                            <div>
                                <p className={cx('authorName')}>Nguyễn Hoàng Việt</p>
                                <p className={cx('authorClass')}>DHKHMT17 - HaUI</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. CTA Banner */}
            <section className="container" style={{ paddingBottom: '4rem' }}>
                <div className={cx('ctaBanner')}>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.75rem' }}>
                        Sẵn Sàng Chinh Phục CODE HAUI?
                    </h2>
                    <p style={{ fontSize: '1.2rem', maxWidth: '38rem', margin: '0 auto 1.5rem', opacity: 0.95 }}>
                        Đăng nhập với Mã sinh viên của bạn để bắt đầu luyện tập, làm bài thi đấu và nâng cao kỹ năng lập
                        trình ngay hôm nay!
                    </p>
                    <Link to={ROUTES.THI_DAU}>
                        <Button
                            variant="secondary"
                            size="lg"
                            style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '0.85rem 2rem' }}
                        >
                            Vào Trang Thi Đấu Ngay
                            <FontAwesomeIcon
                                icon={faRocket}
                                className={cx('rocket-Icon')}
                                style={{ marginLeft: '0.5rem' }}
                            />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
