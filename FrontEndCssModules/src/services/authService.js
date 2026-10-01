import { apiClient } from './api/client';

const mapUserFromApi = (user) => {
  return {
    id: user.id,
    role: user.role,
    name: user.fullName,
    fullName: user.fullName,
    studentId: user.code,
    code: user.code,
    teacherId: user.code,
    department: user.department || 'Khoa CNTT - HaUI',
    class: user.className || user.classId || 'DHKTPM16A',
    className: user.className || user.classId || 'DHKTPM16A',
    email: user.email,
    avatar: user.avatarUrl,
    avatarUrl: user.avatarUrl,
    score: user.totalPoints ?? 0,
    totalPoints: user.totalPoints ?? 0,
    rank: user.rankTitle || 'Thành viên',
    rankTitle: user.rankTitle || 'Thành viên',
    streak: user.streakDays ?? 0,
    streakDays: user.streakDays ?? 0,
    solvedProblems: user.solvedProblems ?? 0,
    totalSubmissions: user.totalSubmissions ?? 0,
    passRate: user.passRate ?? 0,
  };
};

export const authService = {
  async login(studentId, password) {
    const res = await apiClient.post('/api/v1/auth/login', { code: studentId, password });
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Đăng nhập thất bại');
    }
    const { accessToken, user } = res.data;
    return {
      token: accessToken,
      user: mapUserFromApi(user),
    };
  },

  async getProfile() {
    const res = await apiClient.get('/api/v1/auth/me');
    if (!res.success || !res.data) {
      throw new Error('Không thể lấy thông tin người dùng');
    }
    const user = res.data;
    return mapUserFromApi(user);
  },
};
