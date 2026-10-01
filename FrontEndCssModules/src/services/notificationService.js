import { apiClient } from './api/client';

export const formatNotiTime = (dateStr) => {
  if (!dateStr) return 'Vừa xong';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 1) return 'Hôm qua';
    return `${diffDays} ngày trước`;
  } catch {
    return dateStr;
  }
};

export const mapNotificationFromApi = (n) => ({
  id: n.id,
  title: n.title,
  body: n.body,
  time: formatNotiTime(n.createdAt),
  read: n.isRead ?? false,
  isRead: n.isRead ?? false,
  link: n.link || null,
  type: n.type || 'SYSTEM',
  createdAt: n.createdAt,
});

export const notificationService = {
  // Lấy danh sách thông báo
  async getMyNotifications() {
    try {
      const res = await apiClient.get('/api/v1/notifications');
      const list = Array.isArray(res?.data) ? res.data : [];
      return list.map(mapNotificationFromApi);
    } catch (err) {
      console.warn('Lấy thông báo từ API thất bại:', err.message);
      return [];
    }
  },

  // Lấy số lượng thông báo chưa đọc (cho icon chuông Header)
  async getUnreadCount() {
    try {
      const res = await apiClient.get('/api/v1/notifications/unread-count');
      return res?.data?.unreadCount ?? 0;
    } catch (err) {
      console.warn('Lấy unread count thất bại:', err.message);
      return 0;
    }
  },

  // Đánh dấu một thông báo đã đọc
  async markAsRead(id) {
    try {
      const res = await apiClient.put(`/api/v1/notifications/${id}/read`, {});
      return res?.data ? mapNotificationFromApi(res.data) : null;
    } catch (err) {
      console.warn('Đánh dấu đã đọc thất bại:', err.message);
      return null;
    }
  },
};
