import { apiClient } from './api/client';

export const leaderboardService = {
    // Lấy danh sách Top 10 sinh viên giải nhiều bài
    async getTop10Solvers(classId = '') {
        const query = classId ? `?classId=${classId}` : '';
        const res = await apiClient.get(`/api/v1/users/leaderboard${query}`);
        return Array.isArray(res.data) ? res.data : [];
    },
};
