import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ClassNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faArrowRight,
    faLaptop,
    faQuestion,
    faBook,
    faCaretLeft,
    faCaretRight,
    faComment,
    faTriangleExclamation,
    faBarsStaggered,
    faChevronDown,
    faChevronRight,
    faPlay,
    faCheck,
    faCircle,
    faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleDot, faLightbulb } from '@fortawesome/free-regular-svg-icons';

import { ROUTES } from '../../config/routes.config';
import { courseService } from '../../services/courseService';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import styles from './KhoaHocDetailPage.module.css';

const cx = ClassNames.bind(styles);

export default function KhoaHocDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('theory'); // 'theory' | 'practice' | 'quiz' | 'discussion'
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedChapters, setExpandedChapters] = useState([]);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [courseData, setCourseData] = useState(null);
    const [loadingCourse, setLoadingCourse] = useState(true);
    const [lessonDetail, setLessonDetail] = useState(null);
    const [loadingLesson, setLoadingLesson] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [practiceCode, setPracticeCode] = useState(`// Bài tập: Hoàn thiện class Dog và Cat kế thừa từ Animal
class Animal {
    public void makeSound() {
        System.out.println("Animal makes a sound");
    }
}

class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Gâu gâu! (HaUI Dog)");
    }
}

class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Meo meo! (HaUI Cat)");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal myDog = new Dog();
        Animal myCat = new Cat();
        myDog.makeSound();
        myCat.makeSound();
    }
}`);
    const [practiceOutput, setPracticeOutput] = useState(null);
    const [isExecuting, setIsExecuting] = useState(false);

    // Fallback Course Data nếu chưa bật backend
    const defaultCourse = {
        id: id || 1,
        title: 'Lập trình Java Căn bản & OOP',
        category: 'Java Core',
        instructor: 'TS. Nguyễn Văn Hùng',
        totalLessons: 12,
        chapters: [
            {
                id: 1,
                title: 'Chương 1: Tổng quan ngôn ngữ Java & Cú pháp',
                lessons: [
                    {
                        id: 101,
                        title: '1.1 Cài đặt môi trường JDK & IntelliJ IDEA',
                        type: 'theory',
                        duration: '10 phút',
                        completed: true,
                    },
                    {
                        id: 102,
                        title: '1.2 Biến, Kiểu dữ liệu nguyên thủy & Toán tử',
                        type: 'practice',
                        duration: '15 phút',
                        completed: true,
                    },
                    {
                        id: 103,
                        title: '1.3 Cấu trúc rẽ nhánh if-else & Vòng lặp for/while',
                        type: 'practice',
                        duration: '20 phút',
                        completed: true,
                    },
                ],
            },
            {
                id: 2,
                title: 'Chương 2: Lập trình Hướng đối tượng (OOP) Chuyên sâu',
                lessons: [
                    {
                        id: 201,
                        title: '2.1 Lớp (Class), Đối tượng (Object) & Constructor',
                        type: 'theory',
                        duration: '15 phút',
                        completed: true,
                    },
                    {
                        id: 202,
                        title: '2.2 Tính Đóng gói (Encapsulation) & Access Modifiers',
                        type: 'practice',
                        duration: '20 phút',
                        completed: true,
                    },
                    {
                        id: 203,
                        title: '2.3 Tính Kế thừa (Inheritance) & Đa hình (Polymorphism)',
                        type: 'practice',
                        duration: '25 phút',
                        completed: false,
                        current: true,
                    },
                    {
                        id: 204,
                        title: '2.4 Lớp trừu tượng (Abstract Class) & Interface',
                        type: 'theory',
                        duration: '20 phút',
                        completed: false,
                    },
                ],
            },
            {
                id: 3,
                title: 'Chương 3: Java Collections Framework & Ngoại lệ',
                lessons: [
                    {
                        id: 301,
                        title: '3.1 Xử lý ngoại lệ với try-catch-finally & Custom Exception',
                        type: 'theory',
                        duration: '15 phút',
                        completed: false,
                    },
                    {
                        id: 302,
                        title: '3.2 Danh sách ArrayList, LinkedList & Generic',
                        type: 'practice',
                        duration: '25 phút',
                        completed: false,
                    },
                    {
                        id: 303,
                        title: '3.3 Cấu trúc Map (HashMap, TreeMap) & Set',
                        type: 'practice',
                        duration: '20 phút',
                        completed: false,
                    },
                ],
            },
            {
                id: 4,
                title: 'Chương 4: Bài tập lớn & Mini Project HaUI',
                lessons: [
                    {
                        id: 401,
                        title: '4.1 Xây dựng hệ thống Quản lý Sinh viên HaUI Console',
                        type: 'practice',
                        duration: '45 phút',
                        completed: false,
                    },
                    {
                        id: 402,
                        title: '4.2 Đọc/Ghi File văn bản & Serialization',
                        type: 'quiz',
                        duration: '30 phút',
                        completed: false,
                    },
                ],
            },
        ],
    };

    // 1. Tải dữ liệu Khóa học thật từ Backend API
    useEffect(() => {
        let isMounted = true;
        const fetchCourse = async () => {
            try {
                setLoadingCourse(true);
                const courseIdOrSlug = id || '1';
                const data = await courseService.getCourseDetail(courseIdOrSlug);

                if (isMounted && data) {
                    const formatted = {
                        id: data.id,
                        title: data.title,
                        slug: data.slug,
                        category: data.level === 'BASIC' ? 'Cơ bản' : data.level === 'INTERMEDIATE' ? 'Trung cấp' : 'Nâng cao',
                        instructor: data.instructorName || 'Khoa CNTT - HaUI',
                        totalLessons: data.totalLessons || 0,
                        chapters: (data.sections || []).map((sec, sIdx) => ({
                            id: sec.id || sIdx + 1,
                            title: sec.title,
                            lessons: (sec.lessons || []).map((les) => ({
                                id: les.id,
                                title: les.title,
                                type: les.type ? les.type.toLowerCase() : 'theory',
                                duration: les.durationMinutes ? `${les.durationMinutes} phút` : '15 phút',
                                completed: les.isCompleted,
                            })),
                        })),
                    };

                    setCourseData(formatted);

                    // Mở tất cả chương
                    if (formatted.chapters.length > 0) {
                        setExpandedChapters(formatted.chapters.map((ch) => ch.id));
                        const allLes = formatted.chapters.flatMap((c) => c.lessons);
                        const firstLes = allLes.find((l) => !l.completed) || allLes[0];
                        if (firstLes) setSelectedLessonId(firstLes.id);

                        const compIds = allLes.filter((l) => l.completed).map((l) => l.id);
                        setCompletedLessons(compIds);
                    }
                } else if (isMounted) {
                    setCourseData(defaultCourse);
                    setSelectedLessonId(203);
                    setCompletedLessons([101, 102, 103, 201, 202]);
                    setExpandedChapters([1, 2]);
                }
            } catch (err) {
                console.warn('Lỗi khi tải khóa học từ Backend, dùng dữ liệu mẫu:', err);
                if (isMounted) {
                    setCourseData(defaultCourse);
                    setSelectedLessonId(203);
                    setCompletedLessons([101, 102, 103, 201, 202]);
                    setExpandedChapters([1, 2]);
                }
            } finally {
                if (isMounted) setLoadingCourse(false);
            }
        };

        fetchCourse();

        return () => {
            isMounted = false;
        };
    }, [id]);

    // 2. Tải nội dung chi tiết của bài học đang chọn
    useEffect(() => {
        let isMounted = true;
        if (selectedLessonId && typeof selectedLessonId === 'number' && selectedLessonId > 0 && selectedLessonId < 100) {
            setLoadingLesson(true);
            courseService
                .getLessonDetail(selectedLessonId)
                .then((data) => {
                    if (isMounted && data) {
                        setLessonDetail(data);
                        if (data.initialCode) {
                            setPracticeCode(data.initialCode);
                        }
                    }
                })
                .catch((err) => console.warn('Lỗi tải bài học:', err))
                .finally(() => {
                    if (isMounted) setLoadingLesson(false);
                });
        }
        return () => {
            isMounted = false;
        };
    }, [selectedLessonId]);

    const course = courseData || defaultCourse;

    // Flatten lessons for navigation
    const allLessons = course.chapters.flatMap((ch) => ch.lessons);
    const currentIndex = allLessons.findIndex((l) => l.id === selectedLessonId);
    const currentLesson = allLessons[currentIndex] || allLessons[0];
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    const progressPercentage = Math.round((completedLessons.length / allLessons.length) * 100);

    const toggleChapter = (chapterId) => {
        setExpandedChapters((prev) =>
            prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId],
        );
    };

    const handleLessonSelect = (lessonId) => {
        setSelectedLessonId(lessonId);
        setPracticeOutput(null);
        setQuizSubmitted(false);

        // Tự động mở chương chứa bài học nếu đang đóng
        const parentChapter = course.chapters.find((ch) => ch.lessons.some((l) => l.id === lessonId));
        if (parentChapter) {
            setExpandedChapters((prev) => (prev.includes(parentChapter.id) ? prev : [...prev, parentChapter.id]));
        }
    };

    const toggleCompleteCurrent = async () => {
        if (!completedLessons.includes(selectedLessonId)) {
            setCompletedLessons((prev) => [...prev, selectedLessonId]);
            if (typeof selectedLessonId === 'number' && selectedLessonId < 100) {
                try {
                    await courseService.markLessonCompleted(selectedLessonId);
                } catch (e) {
                    console.warn('Lỗi lưu tiến độ bài học lên Backend:', e);
                }
            }
        }
        if (nextLesson) {
            handleLessonSelect(nextLesson.id);
        }
    };

    const handleRunPractice = () => {
        setIsExecuting(true);
        setPracticeOutput({ status: 'RUNNING', text: '⚡ Đang biên dịch trên HaUI Java Sandbox...' });
        setTimeout(() => {
            setIsExecuting(false);
            setPracticeOutput({
                status: 'SUCCESS',
                output: `Gâu gâu! (HaUI Dog)\nMeo meo! (HaUI Cat)\n\n>>> Biên dịch thành công: Đạt 100/100 điểm testcase!\n>>> +50 Điểm rèn luyện HaUI.`,
            });
            if (!completedLessons.includes(selectedLessonId)) {
                setCompletedLessons((prev) => [...prev, selectedLessonId]);
            }
        }, 800);
    };

    // ─── Loading guard: tránh màn hình trống khi đang tải khóa học ───
    if (loadingCourse && !courseData) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    background: 'var(--bg-primary, #0f172a)',
                    color: 'var(--text-muted, #94a3b8)',
                    gap: '16px',
                }}
            >
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(249,115,22,0.3)',
                        borderTop: '3px solid #f97316',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                    }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <span style={{ fontSize: '15px' }}>Đang tải khóa học...</span>
            </div>
        );
    }

    return (

        <div className={cx('learningWrapper')}>
            {/* 1. TOP HEADER BAR */}
            <div className={cx('topBar')}>
                <div className={cx('topLeft')}>
                    <Link to={ROUTES.KHOA_HOC} className={cx('backBtn')}>
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            style={{ marginRight: '8px', marginLeft: '8px', fontSize: '14px' }}
                        />
                        Khóa học
                    </Link>
                    <div className={cx('divider')} />
                    <div className={cx('courseInfo')}>
                        <span className={cx('courseTitle')}>{course.title}</span>
                        <span className={cx('chapterBadge')}>{currentLesson?.title}</span>
                    </div>
                </div>

                <div className={cx('topCenter')}>
                    <div className={cx('progressContainer')}>
                        <div className={cx('progressLabels')}>
                            <span>Tiến độ học tập</span>
                            <strong>
                                {progressPercentage}% ({completedLessons.length}/{allLessons.length} bài)
                            </strong>
                        </div>
                        <div className={cx('progressBar')}>
                            <div className={cx('progressFill')} style={{ width: `${progressPercentage}%` }} />
                        </div>
                    </div>
                </div>

                <div className={cx('topRight')}>
                    <button
                        className={cx('navArrowBtn')}
                        disabled={!prevLesson}
                        onClick={() => prevLesson && handleLessonSelect(prevLesson.id)}
                        title="Bài trước"
                    >
                        <FontAwesomeIcon icon={faCaretLeft} />
                        Bài trước
                    </button>
                    <button
                        className={cx('navArrowBtn')}
                        disabled={!nextLesson}
                        onClick={() => nextLesson && handleLessonSelect(nextLesson.id)}
                        title="Bài tiếp theo"
                    >
                        <FontAwesomeIcon icon={faCaretRight} />
                        Bài tiếp theo
                    </button>
                    <button
                        className={`${cx('sidebarToggleBtn')} ${sidebarOpen ? cx('sidebarToggleActive') : ''}`}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        title="Đóng / Mở danh mục bài học"
                    >
                        <FontAwesomeIcon icon={faBarsStaggered} />
                        Mục lục ({allLessons.length})
                    </button>
                </div>
            </div>

            {/* 2. MAIN WORKSPACE */}
            <div className={cx('mainLayout')}>
                {/* 2A. LEFT SIDEBAR: SYLLABUS / DANH SÁCH BÀI HỌC (CodeLearn Style) */}
                <div className={`${cx('sidebar')} ${sidebarOpen ? cx('sidebarOpen') : cx('sidebarClosed')}`}>
                    <div className={cx('sidebarHeader')}>
                        <h3 className={cx('sidebarTitle')}>Nội dung khóa học</h3>
                        <span className={cx('completedCount')}>
                            Đã học: {completedLessons.length}/{allLessons.length}
                        </span>
                    </div>

                    <div className={cx('syllabusScroll')}>
                        {course.chapters.map((chapter) => {
                            const isExpanded = expandedChapters.includes(chapter.id);
                            const chapterCompletedCount = chapter.lessons.filter((l) =>
                                completedLessons.includes(l.id),
                            ).length;

                            return (
                                <div key={chapter.id} className={cx('chapterBlock')}>
                                    <div className={cx('chapterHeader')} onClick={() => toggleChapter(chapter.id)}>
                                        <div className={cx('chapterHeaderLeft')}>
                                            <FontAwesomeIcon
                                                icon={isExpanded ? faChevronDown : faChevronRight}
                                                className={cx('chapterChevron')}
                                            />
                                            <span className={cx('chapterTitleText')}>{chapter.title}</span>
                                        </div>
                                        <span className={cx('chapterProgressBadge')}>
                                            {chapterCompletedCount}/{chapter.lessons.length}
                                        </span>
                                    </div>

                                    {isExpanded && (
                                        <div className={cx('lessonList')}>
                                            {chapter.lessons.map((lesson) => {
                                                const isCompleted = completedLessons.includes(lesson.id);
                                                const isSelected = selectedLessonId === lesson.id;

                                                return (
                                                    <div
                                                        key={lesson.id}
                                                        className={`${cx('lessonItem')} ${isSelected ? cx('lessonItemActive') : ''} ${isCompleted ? cx('lessonItemCompleted') : ''}`}
                                                        onClick={() => handleLessonSelect(lesson.id)}
                                                    >
                                                        <div className={cx('lessonStatusIcon')}>
                                                            {isCompleted ? (
                                                                <span className={cx('checkIcon')}>
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </span>
                                                            ) : isSelected ? (
                                                                <span className={cx('currentDot')}>
                                                                    <FontAwesomeIcon icon={faPlay} />
                                                                </span>
                                                            ) : (
                                                                <span className={cx('pendingDot')}>
                                                                    <FontAwesomeIcon icon={faCircleDot} />
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className={cx('lessonMeta')}>
                                                            <span className={cx('lessonTitle')}>{lesson.title}</span>
                                                            <div className={cx('lessonSubInfo')}>
                                                                <span>
                                                                    {lesson.type === 'theory'
                                                                        ? ' Lý thuyết'
                                                                        : lesson.type === 'practice'
                                                                          ? ' Thực hành'
                                                                          : ' Trắc nghiệm'}
                                                                </span>
                                                                <span>
                                                                    <FontAwesomeIcon
                                                                        icon={faCircle}
                                                                        style={{
                                                                            fontSize: '0.25rem',
                                                                            margin: '0 0.3rem 2px 0.3rem',
                                                                        }}
                                                                    />
                                                                </span>
                                                                <span> {lesson.duration}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2B. RIGHT CONTENT AREA: THEORY, PRACTICE & QUIZ */}
                <div className={cx('contentArea')}>
                    {/* Activity Tabs */}
                    <div className={cx('tabNav')}>
                        <button
                            className={`${cx('tabBtn')} ${activeTab === 'theory' ? cx('tabBtnActive') : ''}`}
                            onClick={() => setActiveTab('theory')}
                        >
                            <FontAwesomeIcon icon={faBook} style={{ marginRight: '6px', fontSize: '0.85rem' }} />
                            Lý thuyết bài học
                        </button>
                        <button
                            className={`${cx('tabBtn')} ${activeTab === 'practice' ? cx('tabBtnActive') : ''}`}
                            onClick={() => setActiveTab('practice')}
                        >
                            <FontAwesomeIcon icon={faLaptop} style={{ marginRight: '6px', fontSize: '0.85rem' }} />
                            Bài tập thực hành
                        </button>
                        <button
                            className={`${cx('tabBtn')} ${activeTab === 'quiz' ? cx('tabBtnActive') : ''}`}
                            onClick={() => setActiveTab('quiz')}
                        >
                            <FontAwesomeIcon icon={faQuestion} style={{ marginRight: '6px', fontSize: '0.9rem' }} />
                            Câu hỏi trắc nghiệm
                        </button>
                        <button
                            className={`${cx('tabBtn')} ${activeTab === 'discussion' ? cx('tabBtnActive') : ''}`}
                            onClick={() => setActiveTab('discussion')}
                        >
                            <FontAwesomeIcon icon={faComment} style={{ marginRight: '6px', fontSize: '0.9rem' }} />
                            Thảo luận & Hỏi đáp (8)
                        </button>
                    </div>

                    {/* Tab 1: Theory Content */}
                    {activeTab === 'theory' && (
                        <div className={cx('scrollableContent')}>
                            <div className={cx('lessonArticle')}>
                                <div className={cx('articleHeader')}>
                                    <div className={cx('badgeRow')}>
                                        <Badge variant="orange">Java Core OOP</Badge>
                                        <Badge variant="green">Chuẩn giáo trình HaUI</Badge>
                                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                                            Thời lượng ước tính: 25 phút
                                        </span>
                                    </div>
                                    <h1 className={cx('articleTitle')}>
                                        Bài 2.3: Tính Kế thừa (Inheritance) và Đa hình (Polymorphism) trong Java
                                    </h1>
                                </div>

                                <div className={cx('articleBody')}>
                                    <h2>1. Khái niệm Tính Đa hình (Polymorphism)</h2>
                                    <p>
                                        <strong>Đa hình (Polymorphism)</strong> là một trong bốn trụ cột cốt lõi của lập
                                        trình hướng đối tượng (OOP). Từ này có nguồn gốc từ tiếng Hy Lạp, nghĩa là{' '}
                                        <em>"nhiều hình thái"</em>.
                                    </p>
                                    <p>
                                        Trong Java, đa hình cho phép các đối tượng thuộc các lớp khác nhau cùng phản hồi
                                        lại một lời gọi phương thức theo những cách riêng biệt.
                                    </p>

                                    <div className={cx('infoCallout')}>
                                        <FontAwesomeIcon
                                            icon={faLightbulb}
                                            style={{
                                                marginRight: '6px',
                                                color: 'var(--color-warning)',
                                                fontSize: '1rem',
                                            }}
                                        />
                                        <strong>Quy tắc cốt lõi:</strong> Một biến tham chiếu kiểu lớp cha (Parent Class)
                                        có thể trỏ tới bất kỳ đối tượng nào của lớp con (Child Class).
                                    </div>

                                    <h2>2. Ghi đè phương thức (Method Overriding)</h2>
                                    <p>
                                        Khi một lớp con cung cấp cài đặt cụ thể cho một phương thức đã được định nghĩa ở
                                        lớp cha, ta gọi đó là <strong>Method Overriding</strong>.
                                    </p>
                                    <ul>
                                        <li>
                                            Tên phương thức, kiểu trả về và danh sách tham số phải{' '}
                                            <strong>giống hệt</strong> lớp cha.
                                        </li>
                                        <li>
                                            Phạm vi truy cập (Access Modifier) của phương thức ở lớp con không được thu
                                            hẹp hơn lớp cha.
                                        </li>
                                        <li>
                                            Khuyến khích sử dụng chú thích <code>@Override</code> để trình biên dịch kiểm
                                            tra lỗi chính tả.
                                        </li>
                                    </ul>

                                    <div className={cx('codeBlock')}>
                                        <div className={cx('codeHeader')}>
                                            <span>Java 17 Code Snippet</span>
                                        </div>
                                        <pre className={styles.preCode}>{`// Lớp cha (Superclass)
class Animal {
    public void makeSound() {
        System.out.println("Động vật phát ra âm thanh...");
    }
}

// Lớp con (Subclass)
class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Gâu gâu! (Chó sủa)");
    }
}

public class TestPolymorphism {
    public static void main(String[] args) {
        Animal myAnimal = new Dog(); // Biến cha trỏ tới đối tượng con
        myAnimal.makeSound();        // In ra: Gâu gâu! (Dynamic Binding)
    }
}`}</pre>
                                    </div>

                                    <h2>3. Lưu ý quan trọng cho kỳ thi thực hành HaUI</h2>
                                    <div className={cx('warningCallout')}>
                                        <FontAwesomeIcon
                                            icon={faTriangleExclamation}
                                            style={{ marginRight: '6px', color: 'var(--color-warning)' }}
                                        />
                                        <strong>Lưu ý:</strong> Phương thức <code>static</code>, <code>final</code> hoặc{' '}
                                        <code>private</code> <strong>KHÔNG THỂ</strong> bị ghi đè (override). Nếu gọi
                                        phương thức static từ biến cha, Java sẽ thực hiện <em>Static Binding</em> tại thời
                                        điểm biên dịch.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Interactive Practice Code Sandbox */}
                    {activeTab === 'practice' && (
                        <div className={cx('practiceContainer')}>
                            <div className={cx('practiceStatement')}>
                                <h3> Nhiệm vụ thực hành:</h3>
                                <p>
                                    1. Viết phương thức <code>makeSound()</code> trong lớp <code>Dog</code> in ra{' '}
                                    <code>"Gâu gâu! (HaUI Dog)"</code>.
                                    <br />
                                    2. Viết phương thức <code>makeSound()</code> trong lớp <code>Cat</code> in ra{' '}
                                    <code>"Meo meo! (HaUI Cat)"</code>.
                                </p>
                            </div>

                            <div className={cx('practiceEditorWrapper')}>
                                <div className={cx('practiceEditorHeader')}>
                                    <span>Trình soạn thảo Java Online (HaUI Sandbox)</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setPracticeCode(`// Reset code...`)}
                                        >
                                            <FontAwesomeIcon
                                                icon={faRotate}
                                                style={{ margin: '1px 4px 0px 0px', fontSize: '0.875rem' }}
                                            />
                                            Reset Code
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            loading={isExecuting}
                                            onClick={handleRunPractice}
                                        >
                                            <FontAwesomeIcon
                                                icon={faPlay}
                                                style={{ margin: '1px 4px 0px 0px', fontSize: '0.875rem' }}
                                            />
                                            Chạy & Nộp bài
                                        </Button>
                                    </div>
                                </div>

                                <textarea
                                    className={styles.practiceTextarea}
                                    value={practiceCode}
                                    onChange={(e) => setPracticeCode(e.target.value)}
                                    spellCheck={false}
                                />

                                {practiceOutput && (
                                    <div className={cx('practiceOutputBox')}>
                                        <span className={cx('outputLabel')}>Kết quả chấm bài tự động:</span>
                                        <pre className={cx('outputPre')}>
                                            {practiceOutput.output || practiceOutput.text}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Quick Quiz Test */}
                    {activeTab === 'quiz' && (
                        <div className={cx('scrollableContent')}>
                            <div className={cx('quizBox')}>
                                <h2>
                                    <FontAwesomeIcon
                                        icon={faQuestion}
                                        style={{ marginRight: '6px', fontSize: '1.8rem', color: 'var(--color-haui-red)' }}
                                    />
                                    Trắc nghiệm củng cố kiến thức
                                </h2>
                                <p style={{ color: 'var(--text-muted)' }}>
                                    Trả lời các câu hỏi dưới đây để kiểm tra mức độ hiểu bài của bạn:
                                </p>

                                <div className={cx('quizCard')}>
                                    <h4>Câu 1: Từ khóa nào trong Java dùng để khai báo một lớp kế thừa từ lớp khác?</h4>
                                    <div className={cx('optionsList')}>
                                        {['implements', 'extends', 'inherits', 'super'].map((opt) => (
                                            <label key={opt} className={styles.optionLabel}>
                                                <input
                                                    type="radio"
                                                    name="q1"
                                                    value={opt}
                                                    onChange={() => setQuizAnswers({ ...quizAnswers, q1: opt })}
                                                />
                                                <span>
                                                    <code>{opt}</code>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className={cx('quizCard')}>
                                    <h4>Câu 2: Phương thức nào sau đây KHÔNG THỂ bị ghi đè (Overriding) trong Java?</h4>
                                    <div className={cx('optionsList')}>
                                        {[
                                            'public void display()',
                                            'protected int getCount()',
                                            'public final void calculate()',
                                            'void process()',
                                        ].map((opt) => (
                                            <label key={opt} className={cx('optionLabel')}>
                                                <input
                                                    type="radio"
                                                    name="q2"
                                                    value={opt}
                                                    onChange={() => setQuizAnswers({ ...quizAnswers, q2: opt })}
                                                />
                                                <span>
                                                    <code>{opt}</code>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginTop: '1.5rem' }}>
                                    <Button variant="primary" size="md" onClick={() => setQuizSubmitted(true)}>
                                        Kiểm tra đáp án
                                    </Button>

                                    {quizSubmitted && (
                                        <div className={cx('quizResultAlert')}>
                                            <strong>Xuất sắc!</strong> Bạn đã trả lời đúng 2/2 câu hỏi (Đáp án:{' '}
                                            <code>extends</code> và <code>final void calculate()</code>). +20 Điểm rèn
                                            luyện!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 4: Discussion Q&A */}
                    {activeTab === 'discussion' && (
                        <div className={cx('scrollableContent')}>
                            <div className={cx('discussionSection')}>
                                <h3>
                                    <FontAwesomeIcon
                                        icon={faComment}
                                        style={{ marginRight: '6px', fontSize: '1.1rem' }}
                                    />
                                    Hỏi đáp về bài học này
                                </h3>
                                <div className={cx('qaInputBox')}>
                                    <textarea
                                        placeholder="Bạn có thắc mắc gì về bài học này? Giảng viên và bạn học sẽ giải đáp..."
                                        rows="3"
                                    />
                                    <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                        <Button variant="primary" size="sm">
                                            Gửi câu hỏi
                                        </Button>
                                    </div>
                                </div>

                                <div className={cx('qaList')}>
                                    <div className={cx('qaCard')}>
                                        <strong>Nguyễn Minh Quân (DHKTPM16)</strong>
                                        <p>
                                            Cho em hỏi nếu lớp con không viết annotation <code>@Override</code> thì phương
                                            thức có được ghi đè không ạ?
                                        </p>
                                        <div className={cx('qaReply')}>
                                            <strong style={{ color: 'var(--color-primary)' }}>
                                                TS. Nguyễn Văn Hùng (Giảng viên HaUI):
                                            </strong>
                                            <p>
                                                Vẫn được ghi đè bình thường nếu đúng tên và tham số em nhé. Tuy nhiên nên
                                                viết <code>@Override</code> để trình biên dịch phát hiện lỗi nếu em gõ sai
                                                tên!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. BOTTOM ACTION FOOTER */}
                    <div className={cx('bottomFooter')}>
                        <div className={cx('footerCenter')}>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={toggleCompleteCurrent}
                                className={cx('nextLessonBtn')}
                            >
                                {completedLessons.includes(selectedLessonId) ? (
                                    <>
                                        <FontAwesomeIcon icon={faCheck} />
                                        <span>Đã hoàn thành bài này (Tiếp theo)</span>
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </>
                                ) : (
                                    <>
                                        <span>Đánh dấu Đã học & Tiếp tục</span>
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
