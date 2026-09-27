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

// Map CourseDto/UserDto từ Spring Boot sang props của leaderboard student
export function mapApiStudent(item, index) {
    return {
        rank: index + 1, // API chưa trả field rank -> giả định mảng đã sort theo totalPoints giảm dần
        name: item.fullName,
        id: item.code,
        class: item.classId,
        faculty: item.department || item.className, // "department" hiện null, tạm dùng className thay thế
        solved: item.solvedCount ?? 0, // API hiện chưa có field này, cần backend bổ sung để hiển thị đúng
        acRate: item.acRate ?? 0, // tương tự, tạm mặc định 0
        points: item.totalPoints ?? 0,
        badge: item.rankTitle ?? 'Newbie',
        badgeColor: mapBadgeColor(item.rankTitle),
        avatar: item.avatarUrl,
        isMe: false,
    };
}

export const leaderboardService = {
    // Lấy danh sách Top 10 sinh viên giải nhiều bài
    async getTop10Solvers(classId = '') {
        const query = classId ? `?classId=${classId}` : '';
        const res = await apiClient.get(`/api/v1/users/leaderboard${query}`);

        return Array.isArray(res?.data) ? res.data : [];
    },
};
