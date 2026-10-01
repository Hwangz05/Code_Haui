import { apiClient } from './api/client';

export const formatRelativeDate = (dateStr) => {
    if (!dateStr) return 'Gần đây';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Vừa xong';
        if (diffHours < 24) return `Hôm nay ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
        if (diffDays === 1) return `Hôm qua ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
        return dateStr;
    }
};

export const formatLangLabel = (lang) => {
    if (!lang) return 'Java 17';
    const u = String(lang).toUpperCase();
    if (u.includes('JAVA')) return 'Java 17';
    if (u.includes('CPP') || u.includes('C++')) return 'C++ 20';
    if (u.includes('PYTHON') || u.includes('PY')) return 'Python 3';
    if (u.includes('JS') || u.includes('JAVASCRIPT')) return 'JavaScript';
    return lang;
};

export const mapUserProfileFromApi = (user) => {
    if (!user) return null;
    return {
        id: user.id,
        role: user.role,
        name: user.fullName || user.name || '',
        fullName: user.fullName || user.name || '',
        studentId: user.code || user.studentId || '',
        code: user.code || user.studentId || '',
        teacherId: user.code || user.teacherId || '',
        department: user.department || 'Khoa CNTT - HaUI',
        class: user.className || user.classId || 'DHKTPM16A',
        className: user.className || user.classId || 'DHKTPM16A',
        classId: user.classId || null,
        email: user.email || '',
        avatar: user.avatarUrl || user.avatar || '',
        avatarUrl: user.avatarUrl || user.avatar || '',
        score: user.totalPoints ?? 0,
        totalPoints: user.totalPoints ?? 0,
        rank: user.rankTitle || 'Thành viên',
        rankTitle: user.rankTitle || 'Thành viên',
        streak: user.streakDays ?? 0,
        streakDays: user.streakDays ?? 0,
        solvedProblems: user.solvedProblems ?? 0,
        totalSubmissions: user.totalSubmissions ?? 0,
        studyHours: user.studyHours ?? 0,
        passRate: user.passRate ?? 0,
        status: user.status || ((user.streakDays ?? 0) === 0 ? 'DANGER' : (user.streakDays ?? 0) <= 3 ? 'WARNING' : 'GOOD'),
    };
};

export const mapUserSubmissionFromApi = (s) => {
    if (!s) return null;
    return {
        id: s.id,
        problemId: s.problemId,
        problemTitle: s.problemTitle || s.problem || 'Bài tập lập trình',
        problemSlug: s.problemSlug || '',
        language: s.language || 'JAVA',
        langFormatted: formatLangLabel(s.language),
        status: s.status || 'PENDING',
        runtimeMs: s.runtimeMs ?? 0,
        memoryUsedKb: s.memoryUsedKb ?? 0,
        scoreEarned: s.scoreEarned ?? 0,
        createdAt: s.createdAt,
        formattedTime: formatRelativeDate(s.createdAt),
    };
};

export const computeUserSkills = ({ profile, user, submissions = [], isTeacher = false }) => {
    if (isTeacher) {
        return [
            { name: 'Kiến trúc Hướng đối tượng (OOP) & Java', percent: 98, color: '#f97316' },
            { name: 'Cấu trúc dữ liệu & Thiết kế Giải thuật', percent: 99, color: '#eab308' },
            { name: 'C / C++ & Tối ưu hóa Bộ nhớ Hệ thống', percent: 95, color: '#3b82f6' },
            { name: 'Hệ quản trị CSDL & Kiến trúc SQL', percent: 96, color: '#a855f7' },
            { name: 'Phát triển Ứng dụng Web & Hệ phân tán', percent: 94, color: '#06b6d4' },
        ];
    }

    const acCount = submissions.filter((s) => s.status === 'AC' || s.status === 'ACCEPTED').length;
    const totalSubCount = submissions.length;
    const passRateCalc =
        profile?.passRate != null
            ? Number(profile.passRate)
            : totalSubCount > 0
            ? (acCount / totalSubCount) * 100
            : 100.0;

    const pointsCalc = Number(profile?.totalPoints || user?.totalPoints || 0);

    const javaAcs = submissions.filter(
        (s) => (s.language || '').toUpperCase().includes('JAVA') && (s.status === 'AC' || s.status === 'ACCEPTED')
    ).length;
    const cppAcs = submissions.filter(
        (s) =>
            ((s.language || '').toUpperCase().includes('CPP') || (s.language || '').toUpperCase().includes('C++')) &&
            (s.status === 'AC' || s.status === 'ACCEPTED')
    ).length;
    const pyAcs = submissions.filter(
        (s) => (s.language || '').toUpperCase().includes('PY') && (s.status === 'AC' || s.status === 'ACCEPTED')
    ).length;

    const isKTPM = String(profile?.className || profile?.classId || user?.className || '').toUpperCase().includes('KTPM');

    // 1. Java & OOP
    const javaPercent = Math.min(99, Math.max(35, Math.round(40 + Math.min(45, javaAcs * 12) + (passRateCalc / 100) * 14)));

    // 2. C/C++
    const cppPercent = Math.min(
        98,
        Math.max(30, Math.round(35 + Math.min(45, cppAcs * 25) + Math.min(18, Math.round(pointsCalc / 250))))
    );

    // 3. Cấu trúc dữ liệu & Giải thuật
    const algoPercent = Math.min(
        98,
        Math.max(30, Math.round((pointsCalc / 4000) * 60 + Math.min(25, acCount * 5) + 15))
    );

    // 4. SQL & Database
    const dbPercent = Math.min(
        95,
        Math.max(30, Math.round(45 + Math.min(30, acCount * 6) + (isKTPM ? 15 : 5)))
    );

    // 5. Python / Web
    const pyPercent = Math.min(
        95,
        Math.max(25, Math.round(30 + Math.min(40, pyAcs * 20) + (passRateCalc > 70 ? 20 : 10)))
    );

    return [
        { name: 'Java & Lập trình Hướng đối tượng OOP', percent: javaPercent, color: '#f97316' },
        { name: 'Cấu trúc dữ liệu & Giải thuật nâng cao', percent: algoPercent, color: '#eab308' },
        { name: 'C / C++ Lập trình thi đấu & Tối ưu', percent: cppPercent, color: '#3b82f6' },
        { name: 'Cơ sở dữ liệu & Thiết kế Hệ thống SQL', percent: dbPercent, color: '#a855f7' },
        { name: 'Python & Phân tích thuật toán', percent: pyPercent, color: '#06b6d4' },
    ];
};

export const userService = {
    // Lấy thông tin người dùng theo MSSV / mã cán bộ
    async getUserByCode(code) {
        try {
            const res = await apiClient.get(`/api/v1/users/code/${encodeURIComponent(code)}`);
            return res?.data ? mapUserProfileFromApi(res.data) : null;
        } catch (e) {
            console.warn('[userService] getUserByCode failed:', e.message);
            return null;
        }
    },

    // Lấy thông tin người dùng theo ID số
    async getUserById(id) {
        try {
            const res = await apiClient.get(`/api/v1/users/${encodeURIComponent(id)}`);
            return res?.data ? mapUserProfileFromApi(res.data) : null;
        } catch (e) {
            console.warn('[userService] getUserById failed:', e.message);
            return null;
        }
    },

    // Lấy lịch sử submissions của một người dùng
    async getUserSubmissions(userId) {
        try {
            const res = await apiClient.get(`/api/v1/submissions/user/${encodeURIComponent(userId)}`);
            const list = Array.isArray(res?.data) ? res.data : [];
            return list.map(mapUserSubmissionFromApi);
        } catch (e) {
            console.warn('[userService] getUserSubmissions failed:', e.message);
            return [];
        }
    },
};
