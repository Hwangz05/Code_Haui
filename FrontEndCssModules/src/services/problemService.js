import { apiClient } from './api/client';

export const DIFFICULTY_VI = {
    EASY: 'Dễ',
    MEDIUM: 'Trung bình',
    HARD: 'Khó',
};

export const DIFFICULTY_BACKEND = {
    'Dễ': 'EASY',
    'Trung bình': 'MEDIUM',
    'Khó': 'HARD',
};

export const DIFFICULTY_CONFIG = {
    'Dễ': { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', variant: 'green' },
    'Trung bình': { color: '#d97706', bg: '#fffbeb', border: '#fde68a', variant: 'yellow' },
    'Khó': { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', variant: 'red' },
};

export const formatDate = (isoStr) => {
    if (!isoStr) return '—';
    try {
        const d = new Date(isoStr);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    } catch {
        return isoStr;
    }
};

export const mapProblemFromApi = (p) => {
    if (!p) return null;
    const diffVi = DIFFICULTY_VI[p.difficulty] || p.difficulty || 'Dễ';
    return {
        id: p.id,
        title: p.title,
        categoryName: p.categoryName || 'Chung',
        category: p.categoryName || 'Chung',
        difficulty: diffVi,
        diffVariant: diffVi === 'Dễ' ? 'green' : diffVi === 'Trung bình' ? 'yellow' : 'red',
        points: p.points || (diffVi === 'Dễ' ? 100 : diffVi === 'Trung bình' ? 200 : 300),
        timeLimitMs: p.timeLimitMs || 1000,
        memoryLimitMb: p.memoryLimitMb || 256,
        totalSubmissions: p.totalSubmissions || 0,
        acceptanceRate: p.acceptanceRate ?? 0,
        acRate: p.acceptanceRate != null ? `${Number(p.acceptanceRate).toFixed(1)}%` : '75.0%',
        createdAt: p.createdAt || '',
        formattedDate: formatDate(p.createdAt),
        authorName: p.authorName || 'HaUI Code',
        slug: p.slug || `prob-${p.id}`,
        isPublished: p.isPublished !== false,
        isHaUI: true,
    };
};

export const mapHauiProblemFromApi = (p, solvedProblemIds = new Set(), solvedProblemTitles = new Set()) => {
    const numId = Number(p.id);
    const isSolved = solvedProblemIds.has(numId) || solvedProblemTitles.has((p.title || '').toLowerCase().trim());
    const diffVi = DIFFICULTY_VI[p.difficulty] || p.difficulty || 'Dễ';

    return {
        id: `H${p.id}`,
        rawId: p.id,
        title: p.title,
        slug: p.slug || `haui-prob-${p.id}`,
        category: p.categoryName || 'Bài tập HaUI',
        difficulty: diffVi,
        diffVariant: diffVi === 'Dễ' ? 'green' : diffVi === 'Trung bình' ? 'yellow' : 'red',
        acRate: p.acceptanceRate != null ? `${Number(p.acceptanceRate).toFixed(1)}%` : '75.0%',
        points: p.points || (diffVi === 'Dễ' ? 100 : diffVi === 'Trung bình' ? 250 : 500),
        solved: isSolved,
        tags: ['HaUI', p.categoryName || 'CNTT'],
        isHaUI: true,
    };
};

export const mapLeetCodeProblemFromApi = (item) => {
    const diffVi = item.difficulty === 'Easy' ? 'Dễ' : item.difficulty === 'Medium' ? 'Trung bình' : 'Khó';
    return {
        id: item.frontend_id,
        title: item.title,
        slug: item.title_slug,
        category: item.topic_tags?.[0] || 'Thuật toán',
        difficulty: diffVi,
        diffVariant: diffVi === 'Dễ' ? 'green' : diffVi === 'Trung bình' ? 'yellow' : 'red',
        acRate: `${item.like_ratio || 80}%`,
        points: diffVi === 'Dễ' ? 100 : diffVi === 'Trung bình' ? 250 : 500,
        solved: false,
        tags: item.topic_tags || ['Algorithm'],
        url: item.url,
        isHaUI: false,
    };
};

export function parseProblemStatement(statementMd, title = '') {
    if (!statementMd) {
        return {
            statement: `Bài toán lập trình: ${title}. Hãy viết chương trình tối ưu giải bài toán này.`,
            inputSpec: 'Xem mô tả chi tiết và các ràng buộc trong đề bài.',
            outputSpec: 'In ra kết quả chuẩn theo yêu cầu bài toán.',
        };
    }

    let raw = String(statementMd).replace(/\\n/g, '\n');

    // Tách phần Input và Output nếu có định dạng markdown ###
    const inputMatch = raw.match(/###\s*Input([\s\S]*?)(?=###\s*Output|$)/i);
    const outputMatch = raw.match(/###\s*Output([\s\S]*)$/i);

    let statement = raw;
    if (raw.search(/###\s*Input|###\s*Output/i) !== -1) {
        statement = raw.split(/###\s*Input|###\s*Output/i)[0].trim();
    }

    let inputSpec = inputMatch ? inputMatch[1].trim() : 'Xem mô tả chi tiết và các ràng buộc trong đề bài.';
    let outputSpec = outputMatch ? outputMatch[1].trim() : 'In ra kết quả chuẩn theo yêu cầu bài toán.';

    // Dọn dẹp ký tự đầu dòng
    inputSpec = inputSpec.replace(/^-\s*/gm, '• ').trim();
    outputSpec = outputSpec.replace(/^-\s*/gm, '• ').trim();

    return {
        statement: statement.trim() || `Bài toán lập trình: ${title}.`,
        inputSpec: inputSpec || 'Xem mô tả chi tiết và các ràng buộc trong đề bài.',
        outputSpec: outputSpec || 'In ra kết quả chuẩn theo yêu cầu bài toán.',
    };
}

export const mapProblemDetailFromApi = (p) => {
    if (!p) return null;
    const diffVi = DIFFICULTY_VI[p.difficulty] || p.difficulty || 'Dễ';
    const sample1 = p.sampleTestcases?.[0];
    const sample2 = p.sampleTestcases?.[1];

    const parsed = parseProblemStatement(p.statementMd || p.statement, p.title);
    const sanitizeStr = (s) => (s ? String(s).replace(/\\n/g, '\n').trim() : '');

    return {
        id: p.id,
        rawId: p.id,
        title: p.title,
        slug: p.slug || `prob-${p.id}`,
        category: p.category?.name || p.categoryName || 'Lập trình HaUI',
        difficulty: diffVi,
        diffVariant: diffVi === 'Dễ' ? 'green' : diffVi === 'Trung bình' ? 'yellow' : 'red',
        points: p.points || (diffVi === 'Dễ' ? 100 : diffVi === 'Trung bình' ? 250 : 500),
        statement: parsed.statement,
        inputSpec: parsed.inputSpec,
        outputSpec: parsed.outputSpec,
        ex1: sample1
            ? { input: sanitizeStr(sample1.inputData), output: sanitizeStr(sample1.expectedOutput), note: 'Testcase mẫu 1' }
            : { input: '5\n10 45 2 99 30', output: '99', note: 'Ví dụ mẫu' },
        ex2: sample2
            ? { input: sanitizeStr(sample2.inputData), output: sanitizeStr(sample2.expectedOutput), note: 'Testcase mẫu 2' }
            : null,
        timeLimit: `${(p.timeLimitMs || 1000) / 1000} giây`,
        memLimit: `${p.memoryLimitMb || 256} MB`,
        authorName: p.authorName || 'HaUI Code',
        hints: 'Phân tích kỹ độ phức tạp thuật toán và sử dụng cấu trúc dữ liệu phù hợp.',
        codes: {
            java: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Viết lời giải thuật toán tại đây\n    }\n}`,
            cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Viết lời giải thuật toán tại đây\n    return 0;\n}`,
            python: `import sys\n\ndef main():\n    # Viết lời giải thuật toán tại đây\n    pass\n\nif __name__ == '__main__':\n    main()`,
        },
        isHaUI: true,
    };
};

export const problemService = {
    // Lấy danh sách bài tập (có tìm kiếm, lọc độ khó, phân trang)
    async getProblems(params = {}) {
        const searchParams = new URLSearchParams();
        if (params.categoryId) searchParams.append('categoryId', params.categoryId);
        if (params.difficulty) searchParams.append('difficulty', params.difficulty);
        if (params.keyword) searchParams.append('keyword', params.keyword);
        if (params.page) searchParams.append('page', params.page);
        if (params.size) searchParams.append('size', params.size);

        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        const res = await apiClient.get(`/api/v1/problems${query}`);
        const data = res?.data;
        if (data?.items && Array.isArray(data.items)) {
            return {
                ...data,
                items: data.items.map(mapProblemFromApi),
            };
        }
        return data;
    },

    // Lấy chi tiết bài tập theo slug
    async getProblemBySlug(slug) {
        try {
            const res = await apiClient.get(`/api/v1/problems/${encodeURIComponent(slug)}`);
            return res?.data ? mapProblemDetailFromApi(res.data) : null;
        } catch (err) {
            console.warn(`[problemService] getProblemBySlug(${slug}) failed:`, err.message);
            return null;
        }
    },

    // Nộp mã nguồn chấm điểm
    async submitCode({ problemId, language, sourceCode }) {
        const res = await apiClient.post('/api/v1/submissions', {
            problemId,
            language,
            sourceCode,
        });
        return res.data;
    },

    // Giảng viên tạo bài tập mới
    async createProblem(problemData) {
        const res = await apiClient.post('/api/v1/problems', problemData);
        return res?.data ? mapProblemFromApi(res.data) : null;
    },

    // Lấy danh sách bài tập từ LeetCode API công khai
    async getLeetCodeProblems() {
        const CACHE_KEY = 'codehaui_leetcode_problems_v1';
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }

            const res = await fetch('https://leetcode-api-pied.vercel.app/problems');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                } catch (e) {}
            }
            return data;
        } catch (error) {
            console.warn('[problemService] Failed to fetch LeetCode API, fallback to local cache:', error);
            const fallback = localStorage.getItem(CACHE_KEY);
            return fallback ? JSON.parse(fallback) : [];
        }
    },

    // Lấy chi tiết nội dung bài tập từ LeetCode API theo slug hoặc ID
    async getLeetCodeProblemDetail(slugOrId) {
        const CACHE_KEY = `codehaui_prob_detail_${slugOrId}`;
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) {
                return JSON.parse(cached);
            }

            const res = await fetch(`https://leetcode-api-pied.vercel.app/problem/${slugOrId}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            if (data) {
                try {
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
                } catch (e) {}
            }
            return data;
        } catch (error) {
            console.warn('[problemService] Failed to fetch LeetCode problem detail:', error);
            return null;
        }
    },

    // Lấy danh sách danh mục
    async getCategories() {
        const res = await apiClient.get('/api/v1/categories');
        return res?.data || [];
    },
};
