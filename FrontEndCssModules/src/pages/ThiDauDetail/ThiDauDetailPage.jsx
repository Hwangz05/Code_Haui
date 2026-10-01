import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ClassNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faRocket,
    faClock,
    faFloppyDisk,
    faFileLines,
    faComment,
    faPlay,
    faCircle,
    faRulerCombined,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleDot, faLightbulb } from '@fortawesome/free-regular-svg-icons';
import { ROUTES } from '../../config/routes.config';
import { problemService } from '../../services/problemService';
import { translateLeetCodeHtml, translateTextToVietnamese } from '../../services/translateService';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import styles from './ThiDauDetailPage.module.css';

const cx = ClassNames.bind(styles);

export default function ThiDauDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('statement');
    const [activeTestTab, setActiveTestTab] = useState('tc1');
    const [language, setLanguage] = useState('java');
    const [terminalOutput, setTerminalOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [customInput, setCustomInput] = useState('5\n10 45 2 99 30');
    const [hauiProblemData, setHauiProblemData] = useState(null);
    const [apiProblemData, setApiProblemData] = useState(null);
    const [loadingApiDetail, setLoadingApiDetail] = useState(false);
    const [viewLang, setViewLang] = useState('vi'); // 'vi' (mặc định Tiếng Việt) hoặc 'en'
    const [translatedContent, setTranslatedContent] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);

    // Resizable Split Panes State (LeetCode Style)
    const [leftWidth, setLeftWidth] = useState(45);
    const [editorHeight, setEditorHeight] = useState(60);
    const [isDraggingH, setIsDraggingH] = useState(false);
    const [isDraggingV, setIsDraggingV] = useState(false);
    const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(false);

    const splitContainerRef = useRef(null);
    const rightColRef = useRef(null);

    const problemsDatabase = {
        'tim-so-lon-nhat': {
            id: 1,
            title: 'Tìm số lớn nhất trong mảng (Max Element)',
            category: 'Mảng 1 chiều',
            difficulty: 'Dễ',
            diffVariant: 'green',
            points: 100,
            statement:
                'Cho một mảng gồm n số nguyên. Hãy viết chương trình tìm và in ra giá trị của phần tử lớn nhất trong mảng đã cho.',
            inputSpec:
                '• Dòng 1: Số nguyên n (1 ≤ n ≤ 10^5)\n• Dòng 2: n số nguyên cách nhau bởi dấu cách (-10^9 ≤ a[i] ≤ 10^9)',
            outputSpec: 'Một số nguyên duy nhất là giá trị lớn nhất trong mảng.',
            ex1: { input: '5\n10 45 2 99 30', output: '99', note: 'Trong dãy [10, 45, 2, 99, 30], số lớn nhất là 99.' },
            ex2: { input: '3\n-15 -3 -80', output: '-3', note: 'Vì toàn bộ mảng là số âm, số lớn nhất là -3.' },
            timeLimit: '1.0 giây',
            memLimit: '256 MB',
            hints: 'Khởi tạo maxVal = arr[0], duyệt for từ i=1..n-1 và cập nhật maxVal nếu arr[i] > maxVal. O(N) thời gian, O(1) không gian.',
            codes: {
                java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        \n        int maxVal = arr[0];\n        for (int i = 1; i < n; i++) {\n            if (arr[i] > maxVal) maxVal = arr[i];\n        }\n        System.out.println(maxVal);\n    }\n}`,
                cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int maxVal = arr[0];\n    for (int i = 1; i < n; i++) {\n        if (arr[i] > maxVal) maxVal = arr[i];\n    }\n    cout << maxVal << "\\n";\n    return 0;\n}`,
                python: `import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    if not data: return\n    n = int(data[0])\n    arr = [int(x) for x in data[1:n+1]]\n    print(max(arr))\n\nif __name__ == '__main__':\n    main()`,
            },
        },
        'kiem-tra-so-nguyen-to': {
            id: 2,
            title: 'Kiểm tra số nguyên tố tối ưu (Prime Check)',
            category: 'Toán học',
            difficulty: 'Dễ',
            diffVariant: 'green',
            points: 100,
            statement:
                'Cho số nguyên dương n. Hãy kiểm tra xem n có phải là số nguyên tố hay không. In ra YES nếu đúng, ngược lại in ra NO.',
            inputSpec: 'Một số nguyên n duy nhất (1 ≤ n ≤ 10^12)',
            outputSpec: 'In ra "YES" hoặc "NO"',
            ex1: { input: '17', output: 'YES', note: '17 là số nguyên tố chỉ chia hết cho 1 và chính nó.' },
            ex2: { input: '1', output: 'NO', note: '1 không phải là số nguyên tố.' },
            timeLimit: '1.0 giây',
            memLimit: '256 MB',
            hints: 'Duyệt kiểm tra từ 2 đến sqrt(n). Nếu n chia hết cho bất kỳ số nào thì kết luận NO.',
            codes: {
                java: `import java.util.Scanner;\n\npublic class Solution {\n    public static boolean isPrime(long n) {\n        if (n < 2) return false;\n        for (long i = 2; i * i <= n; i++) {\n            if (n % i == 0) return false;\n        }\n        return true;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextLong()) return;\n        long n = sc.nextLong();\n        System.out.println(isPrime(n) ? "YES" : "NO");\n    }\n}`,
                cpp: `#include <iostream>\nusing namespace std;\n\nbool isPrime(long long n) {\n    if (n < 2) return false;\n    for (long long i = 2; i * i <= n; i++) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}\n\nint main() {\n    long long n;\n    if (cin >> n) {\n        cout << (isPrime(n) ? "YES" : "NO") << "\\n";\n    }\n    return 0;\n}`,
                python: `import sys\n\ndef is_prime(n):\n    if n < 2: return False\n    i = 2\n    while i * i <= n:\n        if n % i == 0: return False\n        i += 1\n    return True\n\nif __name__ == '__main__':\n    data = sys.stdin.read().strip()\n    if data:\n        n = int(data)\n        print("YES" if is_prime(n) else "NO")`,
            },
        },
        'dao-nguoc-chuoi-palindrome': {
            id: 3,
            title: 'Đảo ngược chuỗi và kiểm tra Palindrome',
            category: 'Mảng & Chuỗi',
            difficulty: 'Dễ',
            diffVariant: 'green',
            points: 100,
            statement:
                'Cho một chuỗi s gồm các ký tự chữ cái và chữ số. Hãy kiểm tra xem chuỗi s có phải là chuỗi đối xứng (Palindrome) hay không.',
            inputSpec: 'Một chuỗi ký tự s (1 ≤ |s| ≤ 10^5)',
            outputSpec: 'In ra "YES" nếu đối xứng, ngược lại "NO"',
            ex1: { input: 'radar', output: 'YES', note: '"radar" đọc xuôi hay ngược đều giống nhau.' },
            ex2: { input: 'haui2026', output: 'NO', note: '"haui2026" không phải chuỗi đối xứng.' },
            timeLimit: '1.0 giây',
            memLimit: '256 MB',
            hints: 'Sử dụng kỹ thuật 2 con trỏ (Two Pointers) từ 2 đầu trái phải so sánh dần vào giữa.',
            codes: {
                java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        int l = 0, r = s.length() - 1;\n        boolean isPalin = true;\n        while (l < r) {\n            if (s.charAt(l) != s.charAt(r)) {\n                isPalin = false;\n                break;\n            }\n            l++; r--;\n        }\n        System.out.println(isPalin ? "YES" : "NO");\n    }\n}`,
                cpp: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    if (cin >> s) {\n        int l = 0, r = s.length() - 1;\n        bool ok = true;\n        while (l < r) {\n            if (s[l] != s[r]) { ok = false; break; }\n            l++; r--;\n        }\n        cout << (ok ? "YES" : "NO") << "\\n";\n    }\n    return 0;\n}`,
                python: `import sys\ns = sys.stdin.read().strip()\nif s:\n    print("YES" if s == s[::-1] else "NO")`,
            },
        },
    };

    // Tự động gọi API lấy chi tiết bài toán HaUI Backend hoặc LeetCode nếu không có trong DB cục bộ
    useEffect(() => {
        let isMounted = true;
        if (!problemsDatabase[slug] && slug) {
            setLoadingApiDetail(true);
            setHauiProblemData(null);
            setApiProblemData(null);

            // 1. Thử gọi backend HaUI trước
            problemService
                .getProblemBySlug(slug)
                .then((hauiProb) => {
                    if (isMounted && hauiProb) {
                        setHauiProblemData(hauiProb);
                        setLoadingApiDetail(false);
                    } else {
                        // 2. Nếu không phải bài HaUI, gọi LeetCode API
                        return problemService.getLeetCodeProblemDetail(slug).then((data) => {
                            if (isMounted && data) {
                                setApiProblemData(data);
                            }
                        });
                    }
                })
                .catch((err) => console.warn('Lỗi tải chi tiết bài tập:', err))
                .finally(() => {
                    if (isMounted) setLoadingApiDetail(false);
                });
        } else {
            setHauiProblemData(null);
            setApiProblemData(null);
        }

        return () => {
            isMounted = false;
        };
    }, [slug]);

    // Tự động dịch nội dung đề bài LeetCode sang Tiếng Việt khi tải xong
    useEffect(() => {
        let isMounted = true;
        if (apiProblemData?.content) {
            setIsTranslating(true);
            translateLeetCodeHtml(apiProblemData.content, slug)
                .then((translated) => {
                    if (isMounted && translated) {
                        setTranslatedContent(translated);
                    }
                })
                .catch((err) => console.warn('Lỗi dịch HTML:', err))
                .finally(() => {
                    if (isMounted) setIsTranslating(false);
                });
        } else {
            setTranslatedContent(null);
        }

        return () => {
            isMounted = false;
        };
    }, [apiProblemData]);

    const formattedTitle = slug
        ? slug
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ')
        : 'Thử thách lập trình';

    const defaultLeetProb = {
        id: apiProblemData?.questionFrontendId || slug,
        title: apiProblemData?.title || formattedTitle,
        category: apiProblemData?.topicTags?.[0]?.name || 'Thuật toán LeetCode',
        difficulty: apiProblemData?.difficulty === 'Easy' ? 'Dễ' : apiProblemData?.difficulty === 'Medium' ? 'Trung bình' : 'Khó',
        diffVariant: apiProblemData?.difficulty === 'Easy' ? 'green' : apiProblemData?.difficulty === 'Medium' ? 'yellow' : 'red',
        points: apiProblemData?.difficulty === 'Easy' ? 100 : apiProblemData?.difficulty === 'Medium' ? 250 : 500,
        content: apiProblemData?.content,
        statement: `Bài toán thuật toán: ${apiProblemData?.title || formattedTitle}. Hãy phân tích độ phức tạp thời gian/không gian và viết chương trình tối ưu bên dưới.`,
        inputSpec: 'Dữ liệu đầu vào chuẩn theo mô tả bài toán trên LeetCode.',
        outputSpec: 'Kết quả đầu ra tương ứng theo yêu cầu của bài toán.',
        ex1: {
            input: 'nums = [2, 7, 11, 15], target = 9',
            output: '[0, 1]',
            note: 'nums[0] + nums[1] = 2 + 7 = 9 -> Trả về [0, 1]',
        },
        timeLimit: '1.0 giây',
        memLimit: '256 MB',
        hints: 'Khuyến nghị sử dụng cấu trúc dữ liệu HashMap hoặc kỹ thuật Two Pointers để đạt độ phức tạp O(N).',
        codes: {
            java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Viết code giải thuật tại đây\n        System.out.println("Accepted");\n    }\n}`,
            cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Viet code giai thuat tai day\n    cout << "Accepted\\n";\n    return 0;\n}`,
            python: `import sys\n\ndef main():\n    # Viet code giai thuat tai day\n    print("Accepted")\n\nif __name__ == '__main__':\n    main()`,
        },
        url: `https://leetcode.com/problems/${slug}/`,
    };

    const currentProb = problemsDatabase[slug] || hauiProblemData || defaultLeetProb;
    const [code, setCode] = useState(currentProb?.codes?.[language] || currentProb?.codes?.java || '');

    useEffect(() => {
        if (currentProb && currentProb.codes && currentProb.codes[language]) {
            setCode(currentProb.codes[language]);
        }
        if (currentProb?.ex1?.input) {
            setCustomInput(currentProb.ex1.input);
        }
    }, [slug, language, hauiProblemData, apiProblemData]);

    const comments = [
        {
            id: 1,
            author: 'Trần Văn Mạnh',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80',
            time: '2 giờ trước',
            content: 'Bài này tối ưu tuần tự O(N) là tốt nhất về mặt bộ nhớ!',
            likes: 14,
        },
        {
            id: 2,
            author: 'Lê Quỳnh Trang',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80',
            time: '1 ngày trước',
            content: 'Lưu ý khởi tạo maxVal = arr[0] vì testcase có thể có số âm!',
            likes: 29,
        },
    ];

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDraggingH && splitContainerRef.current) {
                const rect = splitContainerRef.current.getBoundingClientRect();
                const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
                if (newWidth >= 20 && newWidth <= 80) {
                    setLeftWidth(newWidth);
                }
            }
            if (isDraggingV && rightColRef.current) {
                const rect = rightColRef.current.getBoundingClientRect();
                const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
                if (newHeight >= 20 && newHeight <= 85) {
                    setEditorHeight(newHeight);
                }
            }
        };

        const handleMouseUp = () => {
            setIsDraggingH(false);
            setIsDraggingV(false);
        };

        if (isDraggingH || isDraggingV) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = 'none';
            document.body.style.cursor = isDraggingH ? 'col-resize' : 'row-resize';
        } else {
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [isDraggingH, isDraggingV]);

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        if (currentProb && currentProb.codes && currentProb.codes[newLang]) {
            setCode(currentProb.codes[newLang]);
        }
    };

    const handleRun = () => {
        setIsRunning(true);
        setIsConsoleCollapsed(false);
        setActiveTestTab('terminal');
        setTerminalOutput({
            status: 'RUNNING',
            msg: '⚡ Đang gửi mã nguồn lên HaUI Sandbox Judge Server...',
        });

        setTimeout(() => {
            setIsRunning(false);
            setTerminalOutput({
                status: 'PASSED',
                type: 'Run',
                time: '14 ms',
                memory: '7.8 MB',
                input: customInput || currentProb.ex1.input,
                output: currentProb.ex1.output,
                expected: currentProb.ex1.output,
                msg: 'Kiểm thử mẫu thành công! Tất cả assertions đều khớp.',
            });
        }, 700);
    };

    const handleSubmit = () => {
        setIsRunning(true);
        setIsConsoleCollapsed(false);
        setActiveTestTab('terminal');
        setTerminalOutput({
            status: 'RUNNING',
            msg: '🚀 Đang chấm điểm trên 20/20 Test cases chuẩn HaUI...',
        });

        setTimeout(() => {
            setIsRunning(false);
            setTerminalOutput({
                status: 'ACCEPTED',
                type: 'Submit',
                score: '100 / 100',
                passedCount: '20 / 20',
                time: '22 ms',
                memory: '13.2 MB',
                reward: `+${currentProb.points} điểm rèn luyện HaUI`,
                msg: '🎉 XUẤT SẮC! Lời giải của bạn đã vượt qua tất cả testcase trong thời gian quy định.',
            });
        }, 1100);
    };

    const resetLayout = () => {
        setLeftWidth(45);
        setEditorHeight(60);
        setIsConsoleCollapsed(false);
    };

    return (
        <div className={cx('containerFluid')}>
            <div className={cx('topBar')}>
                <div className={cx('topBarLeft')}>
                    <Link to={ROUTES.THI_DAU}>
                        <Button variant="secondary" size="sm">
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Danh sách bài
                        </Button>
                    </Link>
                    <div className={cx('problemHeading')}>
                        <strong className={cx('problemName')}>
                            {currentProb.id}. {currentProb.title}
                        </strong>
                        <Badge variant={currentProb.diffVariant}>{currentProb.difficulty}</Badge>
                        <span className={cx('tagLabel')}>{currentProb.category}</span>
                        <span className={cx('pointsBadge')}>+{currentProb.points} pts</span>
                    </div>
                </div>

                <div className={cx('topBarRight')}>
                    <button className={cx('resetLayoutBtn')} onClick={resetLayout} title="Khôi phục kích thước ban đầu">
                        <FontAwesomeIcon icon={faRulerCombined} />
                        Cân bằng khung
                    </button>
                    <Button variant="secondary" size="sm" loading={isRunning} onClick={handleRun}>
                        <FontAwesomeIcon icon={faPlay} />
                        Chạy thử
                    </Button>
                    <Button variant="primary" size="sm" loading={isRunning} onClick={handleSubmit}>
                        <FontAwesomeIcon icon={faRocket} />
                        Nộp bài
                    </Button>
                </div>
            </div>

            <div className={cx('splitView')} ref={splitContainerRef}>
                <div className={cx('leftCol')} style={{ width: `${leftWidth}%` }}>
                    <div className={cx('tabsBar')}>
                        <button
                            onClick={() => setActiveTab('statement')}
                            className={`${cx('tabItem')} ${activeTab === 'statement' ? cx('tabItemActive') : ''}`}
                        >
                            <FontAwesomeIcon icon={faFileLines} style={{ margin: '0 0.5rem 1px 0px' }} />
                            Đề bài
                        </button>
                        <button
                            onClick={() => setActiveTab('hints')}
                            className={`${cx('tabItem')} ${activeTab === 'hints' ? cx('tabItemActive') : ''}`}
                        >
                            <FontAwesomeIcon icon={faLightbulb} style={{ margin: '0 0.5rem 1px 0px' }} />
                            Gợi ý thuật toán
                        </button>
                        <button
                            onClick={() => setActiveTab('discussion')}
                            className={`${cx('tabItem')} ${activeTab === 'discussion' ? cx('tabItemActive') : ''}`}
                        >
                            <FontAwesomeIcon icon={faComment} style={{ margin: '0 0.5rem 1px 0px' }} />
                            Thảo luận ({comments.length})
                        </button>

                        {/* Nút chuyển đổi Tiếng Việt 🇻🇳 / English 🇬🇧 */}
                        {currentProb.content && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto', paddingRight: '8px' }}>
                                <button
                                    onClick={() => setViewLang('vi')}
                                    style={{
                                        padding: '3px 8px',
                                        fontSize: '0.75rem',
                                        borderRadius: '4px',
                                        border: viewLang === 'vi' ? '1px solid var(--color-primary)' : '1px solid transparent',
                                        background: viewLang === 'vi' ? 'rgba(249, 115, 22, 0.18)' : 'transparent',
                                        color: viewLang === 'vi' ? 'var(--color-primary)' : 'var(--text-dim)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                    title="Hiển thị đề bài bằng Tiếng Việt"
                                >
                                    🇻🇳 Tiếng Việt
                                </button>
                                <button
                                    onClick={() => setViewLang('en')}
                                    style={{
                                        padding: '3px 8px',
                                        fontSize: '0.75rem',
                                        borderRadius: '4px',
                                        border: viewLang === 'en' ? '1px solid var(--color-primary)' : '1px solid transparent',
                                        background: viewLang === 'en' ? 'rgba(249, 115, 22, 0.18)' : 'transparent',
                                        color: viewLang === 'en' ? 'var(--color-primary)' : 'var(--text-dim)',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                    title="Hiển thị đề bài gốc Tiếng Anh"
                                >
                                    🇬🇧 English
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={cx('contentScroll')}>
                        {activeTab === 'statement' && (
                            <div className={cx('statementBox')}>
                                {loadingApiDetail ? (
                                    <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                                            Đang tải chi tiết bài toán...
                                        </div>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                                            Đang đồng bộ từ LeetCode API
                                        </span>
                                    </div>
                                ) : currentProb.content ? (
                                    <div style={{ lineHeight: 1.7, color: 'var(--text-main)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                            <h2 className={cx('sectionTitle')} style={{ margin: 0 }}>
                                                {currentProb.title}
                                            </h2>
                                            {isTranslating && viewLang === 'vi' && (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontStyle: 'italic' }}>
                                                    ⚡ Đang dịch sang Tiếng Việt...
                                                </span>
                                            )}
                                        </div>

                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: viewLang === 'vi' && translatedContent ? translatedContent : currentProb.content,
                                            }}
                                            style={{ fontSize: '0.95rem' }}
                                        />

                                        {currentProb.url && (
                                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                                                <a
                                                    href={currentProb.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: 'var(--color-primary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}
                                                >
                                                    🔗 Xem bài gốc trên LeetCode ↗
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className={cx('sectionTitle')}>Mô tả bài toán</h2>
                                        <p className={cx('paragraph')}>{currentProb.statement}</p>

                                        <h3 className={cx('subSectionTitle')}>Đầu vào (Input)</h3>
                                        <pre className={cx('specBox')}>{currentProb.inputSpec}</pre>

                                        <h3 className={cx('subSectionTitle')}>Đầu ra (Output)</h3>
                                        <p className={cx('paragraph')}>{currentProb.outputSpec}</p>

                                        <h3 className={cx('subSectionTitle')}>Ví dụ 1</h3>
                                        <div className={cx('exampleCard')}>
                                            <div className={cx('exampleRow')}>
                                                <span className={cx('exampleLabel')}>Input:</span>
                                                <pre className={cx('codeSnippet')}>{currentProb.ex1.input}</pre>
                                            </div>
                                            <div className={cx('exampleRow')}>
                                                <span className={cx('exampleLabel')}>Output:</span>
                                                <pre className={cx('codeSnippet')}>{currentProb.ex1.output}</pre>
                                            </div>
                                            <div className={cx('exampleNote')}>
                                                <strong>Giải thích:</strong> {currentProb.ex1.note}
                                            </div>
                                        </div>

                                        <h3 className={cx('subSectionTitle')}>Ràng buộc & Giới hạn</h3>
                                        <div className={cx('constraintsBox')}>
                                            <div>
                                                <FontAwesomeIcon
                                                    icon={faClock}
                                                    style={{ marginRight: '0.5rem', fontSize: '1rem', color: '#007bff' }}
                                                />
                                                Giới hạn thời gian: <strong>{currentProb.timeLimit}</strong>
                                            </div>
                                            <div>
                                                <FontAwesomeIcon
                                                    icon={faFloppyDisk}
                                                    style={{ marginRight: '0.5rem', fontSize: '1rem', color: '#f44343' }}
                                                />
                                                Giới hạn bộ nhớ: <strong>{currentProb.memLimit}</strong>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'hints' && (
                            <div className={cx('hintsBox')}>
                                <h2 className={cx('sectionTitle')}>
                                    <FontAwesomeIcon
                                        icon={faLightbulb}
                                        style={{ marginRight: '0.5rem', color: '#ffc107' }}
                                    />
                                    Gợi ý tiếp cận bài toán
                                </h2>
                                <div className={cx('hintItem')}>
                                    <h4 className={cx('hintHeading')}>Hướng dẫn thuật toán</h4>
                                    <p className={cx('paragraph')}>{currentProb.hints}</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'discussion' && (
                            <div className={cx('discussionBox')}>
                                <div className={cx('commentInputBox')}>
                                    <textarea
                                        placeholder="Viết bình luận hoặc chia sẻ mẹo giải bài..."
                                        className={cx('commentTextarea')}
                                        rows="3"
                                    />
                                    <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                        <Button variant="primary" size="sm">
                                            Gửi bình luận
                                        </Button>
                                    </div>
                                </div>

                                <div className={cx('commentsList')}>
                                    {comments.map((cm) => (
                                        <div key={cm.id} className={cx('commentCard')}>
                                            <div className={cx('commentHeader')}>
                                                <img src={cm.avatar} alt={cm.author} className={cx('commentAvatar')} />
                                                <div>
                                                    <strong className={cx('commentAuthor')}>{cm.author}</strong>
                                                    <span className={cx('commentTime')}>
                                                        <FontAwesomeIcon
                                                            icon={faCircle}
                                                            style={{ marginRight: '0.25rem', fontSize: '0.6rem' }}
                                                        />
                                                        {cm.time}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className={cx('commentContent')}>{cm.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className={`${cx('resizerH')} ${isDraggingH ? cx('resizerHActive') : ''}`}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setIsDraggingH(true);
                    }}
                    title="Kéo sang trái / phải để co dãn độ rộng khung"
                >
                    <div className={cx('resizerHandleV')}>
                        <span className={cx('handleDot')}></span>
                        <span className={cx('handleDot')}></span>
                        <span className={cx('handleDot')}></span>
                    </div>
                </div>

                <div className={cx('rightCol')} ref={rightColRef} style={{ width: `${100 - leftWidth}%` }}>
                    <div
                        className={cx('editorSection')}
                        style={{
                            height: isConsoleCollapsed ? 'calc(100% - 40px)' : `${editorHeight}%`,
                        }}
                    >
                        <div className={cx('editorControls')}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                                    Ngôn ngữ:
                                </span>
                                <select value={language} onChange={handleLanguageChange} className={cx('langSelect')}>
                                    <option value="java">Java 17 (OpenJDK)</option>
                                    <option value="cpp">C++ 20 (G++)</option>
                                    <option value="python">Python 3.10</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setCode(currentProb?.codes?.[language] || '')}
                                className={cx('resetBtn')}
                            >
                                🔄 Reset mã
                            </button>
                        </div>

                        <div className={cx('codeEditorContainer')}>
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className={cx('textarea')}
                                spellCheck={false}
                            />
                        </div>
                    </div>

                    {!isConsoleCollapsed && (
                        <div
                            className={`${cx('resizerV')} ${isDraggingV ? cx('resizerVActive') : ''}`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setIsDraggingV(true);
                            }}
                            title="Kéo lên / xuống để co dãn chiều cao editor"
                        >
                            <div className={cx('resizerHandleH')}>
                                <span className={cx('handleDotH')}></span>
                                <span className={cx('handleDotH')}></span>
                                <span className={cx('handleDotH')}></span>
                            </div>
                        </div>
                    )}

                    <div
                        className={`${cx('consolePanel')} ${isConsoleCollapsed ? cx('consolePanelCollapsed') : ''}`}
                        style={{
                            height: isConsoleCollapsed ? '40px' : `calc(${100 - editorHeight}% - 8px)`,
                        }}
                    >
                        <div className={cx('consoleHeader')}>
                            <div className={cx('testTabs')}>
                                <button
                                    className={`${cx('testTabBtn')} ${activeTestTab === 'tc1' ? cx('testTabBtnActive') : ''}`}
                                    onClick={() => {
                                        setIsConsoleCollapsed(false);
                                        setActiveTestTab('tc1');
                                    }}
                                >
                                    Testcase 1
                                </button>
                                <button
                                    className={`${cx('testTabBtn')} ${activeTestTab === 'custom' ? cx('testTabBtnActive') : ''}`}
                                    onClick={() => {
                                        setIsConsoleCollapsed(false);
                                        setActiveTestTab('custom');
                                    }}
                                >
                                    Custom Input
                                </button>
                                <button
                                    className={`${cx('testTabBtn')} ${activeTestTab === 'terminal' ? cx('testTabBtnActive') : ''}`}
                                    onClick={() => {
                                        setIsConsoleCollapsed(false);
                                        setActiveTestTab('terminal');
                                    }}
                                >
                                    Kết quả thực thi {terminalOutput && '●'}
                                </button>
                            </div>

                            <button
                                className={cx('toggleConsoleBtn')}
                                onClick={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
                                title={isConsoleCollapsed ? 'Mở rộng Console' : 'Thu nhỏ Console'}
                            >
                                {isConsoleCollapsed ? '▲ Mở Console' : '▼ Thu nhỏ'}
                            </button>
                        </div>

                        {!isConsoleCollapsed && (
                            <div className={cx('consoleBody')}>
                                {activeTestTab === 'tc1' && (
                                    <div className={cx('tcContent')}>
                                        <div className={cx('tcBlock')}>
                                            <span className={cx('tcLabel')}>Input mẫu:</span>
                                            <pre className={cx('tcPre')}>{currentProb.ex1.input}</pre>
                                        </div>
                                        <div className={cx('tcBlock')}>
                                            <span className={cx('tcLabel')}>Expected Output:</span>
                                            <pre className={cx('tcPre')}>{currentProb.ex1.output}</pre>
                                        </div>
                                    </div>
                                )}

                                {activeTestTab === 'custom' && (
                                    <div className={cx('customInputBox')}>
                                        <span className={cx('tcLabel')}>Nhập dữ liệu kiểm thử tùy chọn:</span>
                                        <textarea
                                            value={customInput}
                                            onChange={(e) => setCustomInput(e.target.value)}
                                            className={cx('customTextarea')}
                                            rows="3"
                                        />
                                    </div>
                                )}

                                {activeTestTab === 'terminal' && (
                                    <div className={cx('terminalBox')}>
                                        {!terminalOutput ? (
                                            <div className={cx('emptyTerminal')}>
                                                Nhấn "▶ Chạy thử" hoặc "🚀 Nộp bài" để kiểm tra mã nguồn trên máy chủ chấm
                                                bài HaUI.
                                            </div>
                                        ) : terminalOutput.status === 'RUNNING' ? (
                                            <div className={cx('runningMessage')}>{terminalOutput.msg}</div>
                                        ) : terminalOutput.status === 'ACCEPTED' ? (
                                            <div className={cx('acceptedResult')}>
                                                <div className={cx('statusBadgeGreen')}>🎉 ACCEPTED (Chính xác)</div>
                                                <div className={cx('statsGridResult')}>
                                                    <div>
                                                        Điểm đạt: <strong>{terminalOutput.score}</strong>
                                                    </div>
                                                    <div>
                                                        Test cases: <strong>{terminalOutput.passedCount}</strong>
                                                    </div>
                                                    <div>
                                                        Thời gian: <strong>{terminalOutput.time}</strong>
                                                    </div>
                                                    <div>
                                                        Bộ nhớ: <strong>{terminalOutput.memory}</strong>
                                                    </div>
                                                </div>
                                                <div className={cx('rewardText')}>🏆 {terminalOutput.reward}</div>
                                            </div>
                                        ) : (
                                            <div className={cx('runSuccessResult')}>
                                                <div className={cx('statusBadgeBlue')}>✓ KIỂM THỬ THÀNH CÔNG</div>
                                                <div className={cx('statsGridResult')}>
                                                    <div>
                                                        Thời gian: <strong>{terminalOutput.time}</strong>
                                                    </div>
                                                    <div>
                                                        Bộ nhớ: <strong>{terminalOutput.memory}</strong>
                                                    </div>
                                                    <div>
                                                        Kết quả: <strong>{terminalOutput.output}</strong>
                                                    </div>
                                                    <div>
                                                        Kỳ vọng: <strong>{terminalOutput.expected}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
