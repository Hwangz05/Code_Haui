import { apiClient } from './api/client';

// Map rankTitle -> màu badge hiển thị
export const mapBadgeColor = (rankTitle) => {
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

// Map UserDto từ Spring Boot sang shape của leaderboard student
export function mapApiStudent(item, index) {
    const finalSolved = item.solvedProblems ?? item.solvedCount ?? 0;
    const finalAcRate = item.passRate ?? item.acRate ?? 0;

    return {
        rank: index + 1,
        name: item.fullName,
        id: item.code || String(item.id),
        class: item.className || item.classId || 'DHKTPM16A',
        faculty: item.department || 'Khoa CNTT',
        solved: finalSolved,
        acRate: finalAcRate,
        points: item.totalPoints ?? item.points ?? 0,
        badge: item.rankTitle ?? 'Thành viên',
        badgeColor: mapBadgeColor(item.rankTitle),
        avatar: item.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        isMe: false,
    };
}

export const leaderboardService = {
    // Lấy danh sách Top 10 sinh viên từ backend Database API
    async getTop10Solvers(classId = '') {
        try {
            const query = classId ? `?classId=${encodeURIComponent(classId)}` : '';
            const res = await apiClient.get(`/api/v1/users/leaderboard${query}`);
            const data = res?.data;
            if (Array.isArray(data) && data.length > 0) return data;
        } catch (e) {
            console.warn('[leaderboardService] getTop10Solvers failed:', e);
        }
        return [];
    },
};
