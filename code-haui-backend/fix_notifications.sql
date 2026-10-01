SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

DELETE FROM notifications;

INSERT INTO notifications (id, user_id, type, title, body, link, is_read, created_at) VALUES
(1, 3, 'ACHIEVEMENT', '👑 Đạt vị trí Quán quân #1 Toàn trường', 'Chúc mừng bạn đã đạt 3,840 điểm và vươn lên vị trí dẫn đầu Bảng xếp hạng HaUI.', '/leaderboard', 0, NOW()),
(2, 3, 'SUBMISSION_RESULT', '✅ Bài nộp Bài toán cái túi đạt AC!', 'Lời giải Java 17 vượt qua 20/20 testcases (48ms, RAM: 17.5MB) nhận +300 điểm.', '/thi-dau', 0, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(3, 3, 'CONTEST_START', '⚔️ Đấu trường HaUI Code Sprint #12', 'Kỳ thi lập trình thuật toán tuần này sẽ bắt đầu lúc 20h00 tối nay. Chuẩn bị tham gia!', '/thi-dau', 0, DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(4, 3, 'COURSE_UPDATE', '📚 Khóa học Lập trình Web Fullstack có bài mới', 'Giảng viên vừa cập nhật video bài học Tích hợp Spring Security & JWT.', '/khoa-hoc', 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 3, 'TEACHER_ALERT', '📢 Thông báo từ TS. Nguyễn Văn Hùng', 'Nhắc nhở lớp KTPM16A hoàn thành đồ án môn học trước ngày 15/10.', '/profile', 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),

(6, 1, 'SUBMISSION_RESULT', '📥 15 sinh viên vừa nộp bài tập mới', 'Lớp DHKTPM16A có 15 sinh viên vừa nộp bài Quản lý Nhân viên kế thừa OOP.', '/teacher/students', 0, NOW()),
(7, 1, 'ACHIEVEMENT', '🌟 96.5% sinh viên đạt tiến độ học tập', 'Báo cáo tuần: 4 lớp học phần duy trì tiến độ làm bài tập xuất sắc.', '/teacher/dashboard', 0, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(8, 1, 'SYSTEM', '🛡️ Máy chủ chấm code Sandbox nâng cấp', 'Hệ thống đã hỗ trợ Java 21, C++ 23 và Python 3.12 tự động.', '/teacher/dashboard', 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),

(9, 4, 'ACHIEVEMENT', '🥈 Xuất sắc đạt vị trí Top #2 Bảng xếp hạng', 'Chúc mừng bạn đã đạt 3,410 điểm và giữ vững Top 2 sinh viên HaUI.', '/leaderboard', 0, NOW()),
(10, 4, 'SUBMISSION_RESULT', '✅ Bài nộp LIS Dãy con tăng dài nhất AC!', 'Lời giải C++ 20 tối ưu thành công với 20ms (+250 điểm).', '/thi-dau', 0, DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(11, 4, 'CONTEST_START', '⚔️ Kỳ thi Tuần HaUI Code Sprint #12', 'Tham gia thi đấu cùng hơn 500 sinh viên lúc 20h00 tối nay.', '/thi-dau', 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),

(12, 5, 'SUBMISSION_RESULT', '✅ Bài nộp được chấp nhận!', 'Bài "Tìm số lớn nhất trong mảng" đạt kết quả AC (38ms).', '/thi-dau', 0, NOW()),
(13, 5, 'ACHIEVEMENT', '🏆 Lên hạng Master!', 'Chúc mừng bạn đã đạt 2000 điểm và vươn lên cấp bậc Master.', '/leaderboard', 0, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(14, 5, 'COURSE_UPDATE', '📚 Khóa học Spring Boot có bài mới', 'Giảng viên vừa thêm bài học "Xây dựng REST API & Security JWT".', '/khoa-hoc', 0, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(15, 5, 'CONTEST_START', '⚔️ Cuộc thi tuần 39 sắp diễn ra', 'Cuộc thi lập trình thuật toán HaUI bắt đầu lúc 20h00 tối nay.', '/thi-dau', 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(16, 5, 'TEACHER_ALERT', '📢 Nhắc nhở nộp bài tập tuần', 'TS. Nguyễn Văn Hùng nhắc cả lớp hoàn thành bài tập OOP trước Chủ Nhật.', '/profile', 1, DATE_SUB(NOW(), INTERVAL 4 DAY)),

(17, 6, 'TEACHER_ALERT', '⚠️ Cảnh báo tiến độ học tập', 'Bạn đã vắng mặt hơn 2 tuần. Vui lòng liên hệ Giảng viên bộ môn.', '/home', 0, NOW());
