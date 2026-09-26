import { apiClient } from './api/client';

export const authService = {
  async login(studentId, password) {
    const res = await apiClient.post('/api/v1/auth/login', { code: studentId, password });
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Đăng nhập thất bại');
    }
    const { accessToken, user } = res.data;
    return {
      token: accessToken,
      user: {
        role: user.role,
        name: user.fullName,
        studentId: user.code,
        teacherId: user.code,
        department: user.department || 'Khoa CNTT - HaUI',
        class: user.className || user.classId || 'DHKTPM16A',
        email: user.email,
        avatar: user.avatarUrl,
        score: user.totalPoints,
        rank: user.rankTitle,
        streak: user.streakDays,
        solvedProblems: 0,
      },
    };
  },

  async getProfile() {
    const res = await apiClient.get('/api/v1/auth/me');
    if (!res.success || !res.data) {
      throw new Error('Không thể lấy thông tin người dùng');
    }
    const user = res.data;
    return {
      role: user.role,
      name: user.fullName,
      studentId: user.code,
      teacherId: user.code,
      department: user.department || 'Khoa CNTT - HaUI',
      class: user.className || user.classId || 'DHKTPM16A',
      email: user.email,
      avatar: user.avatarUrl,
      score: user.totalPoints,
      rank: user.rankTitle,
      streak: user.streakDays,
      solvedProblems: 0,
    };
  },
};
