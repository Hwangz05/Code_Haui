import { apiClient } from './api/client';

export const notificationService = {
  // Lấy danh sách thông báo
  async getMyNotifications() {
    const res = await apiClient.get('/notifications');
    return res.data;
  },

  // Lấy số lượng thông báo chưa đọc (cho icon chuông Header)
  async getUnreadCount() {
    const res = await apiClient.get('/notifications/unread-count');
    return res.data.unreadCount;
  },

  // Đánh dấu đã đọc
  async markAsRead(id) {
    const res = await apiClient.put(`/notifications/${id}/read`, {});
    return res.data;
  },
};
