import { apiClient } from './api/client';

export const teacherService = {
  // Lấy danh sách lớp học phần
  async getClasses() {
    const res = await apiClient.get('/classes');
    return res.data;
  },

  // Lấy danh sách sinh viên trong lớp
  async getStudentsByClass(classId) {
    const res = await apiClient.get(`/classes/${classId}/students`);
    return res.data;
  },

  // Lấy tổng hợp KPI giảng dạy
  async getKpiSummary(classId = '') {
    const query = classId ? `?classId=${classId}` : '';
    const res = await apiClient.get(`/teacher/analytics/kpi${query}`);
    return res.data;
  },

  // Lấy danh sách Top sinh viên giải nhiều bài
  async getTopSolvers(classId = '') {
    const query = classId ? `?classId=${classId}` : '';
    const res = await apiClient.get(`/teacher/analytics/top-solvers${query}`);
    return res.data;
  },

  // Lấy danh sách sinh viên nguy cơ bỏ học
  async getAtRiskStudents(classId = '') {
    const query = classId ? `?classId=${classId}` : '';
    const res = await apiClient.get(`/teacher/analytics/at-risk${query}`);
    return res.data;
  },

  // Xem biểu đồ hoạt động tuần của một sinh viên
  async getStudentActivity(studentId, days = 7) {
    const res = await apiClient.get(`/teacher/analytics/student/${studentId}/activity?days=${days}`);
    return res.data;
  },
};
