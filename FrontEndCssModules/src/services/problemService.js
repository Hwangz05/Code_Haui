import { apiClient } from './api/client';

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
    const res = await apiClient.get(`/problems${query}`);
    return res.data; // Trả về PageResponse: { items, totalPages, totalElements... }
  },

  // Lấy chi tiết bài tập theo slug
  async getProblemBySlug(slug) {
    const res = await apiClient.get(`/problems/${slug}`);
    return res.data;
  },

  // Nộp mã nguồn chấm điểm
  async submitCode({ problemId, language, sourceCode }) {
    const res = await apiClient.post('/submissions', {
      problemId,
      language,
      sourceCode,
    });
    return res.data; // Trả về SubmissionDto: { status: 'AC', runtimeMs, scoreEarned... }
  },

  // Giảng viên tạo bài tập mới
  async createProblem(problemData) {
    const res = await apiClient.post('/problems', problemData);
    return res.data;
  },

  // Lấy danh sách danh mục
  async getCategories() {
    const res = await apiClient.get('/categories');
    return res.data;
  },
};
