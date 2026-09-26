import { apiClient } from './api/client';

const LEVEL_LABELS = {
  BASIC: 'Cơ bản',
  INTERMEDIATE: 'Trung cấp',
  ADVANCED: 'Nâng cao',
};

function inferCategory(item) {
  const text = `${item.slug || ''} ${item.title || ''}`.toLowerCase();
  if (text.includes('java') || text.includes('spring')) return 'Java';
  if (text.includes('cau-truc') || text.includes('giai-thuat') || text.includes('giải thuật')) {
    return 'Algorithms';
  }
  if (text.includes('web') || text.includes('react')) return 'Web';
  if (text.includes('c++') || text.includes('cpp') || text.includes('c/c++')) return 'C++';
  if (text.includes('sql') || text.includes('database') || text.includes('dữ liệu')) return 'Database';
  return 'Lập trình';
}

/** Map CourseDto từ Spring Boot sang props của CourseCard */
export function mapCourseFromApi(item) {
  const levelLabel = LEVEL_LABELS[item.level] || item.level || 'Cơ bản';
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: inferCategory(item),
    level: levelLabel,
    lessons: item.totalLessons || 0,
    students: item.enrolledCount || 100,
    rating: item.rating || 5.0,
    image:
      item.imageUrl ||
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60',
    desc: item.description || '',
    instructor: item.instructorName || 'Khoa CNTT - HaUI',
    duration: item.totalDurationMinutes
      ? `${Math.round(item.totalDurationMinutes / 60)} giờ`
      : '35 giờ',
    badge: 'HaUI',
  };
}

export const courseService = {
  // apiClient đã trả body JSON { success, message, data } — không bọc thêm như axios
  async getAllCourses() {
    const res = await apiClient.get('/api/v1/courses');
    return Array.isArray(res.data) ? res.data : [];
  },

  async getCourseDetail(slug) {
    const res = await apiClient.get(`/api/v1/courses/${slug}`);
    return res.data;
  },

  async getLessonDetail(id) {
    const res = await apiClient.get(`/api/v1/lessons/${id}`);
    return res.data;
  },

  async markLessonCompleted(id) {
    const res = await apiClient.post(`/api/v1/lessons/${id}/complete`, {});
    return res.data;
  },

  async getMyProgress() {
    const res = await apiClient.get('/api/v1/courses/my-progress');
    return Array.isArray(res.data) ? res.data : [];
  },
};
