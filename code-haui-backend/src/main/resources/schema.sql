-- ====================================================================
-- HỆ THỐNG ĐÀO TẠO & HỌC LẬP TRÌNH CODE HAUI - DATABASE SCHEMA & FULL SEED DATA
-- Tự động thực thi bởi Spring Boot khi khởi động
-- ====================================================================
ALTER USER 'root'@'localhost' IDENTIFIED BY 'codehaui';
-- Tắt kiểm tra khóa ngoại tạm thời để khởi tạo lại bảng sạch sẽ
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `class_course_assignments`;
DROP TABLE IF EXISTS `user_daily_activity`;
DROP TABLE IF EXISTS `user_lesson_completed`;
DROP TABLE IF EXISTS `user_course_progress`;
DROP TABLE IF EXISTS `lessons`;
DROP TABLE IF EXISTS `course_sections`;
DROP TABLE IF EXISTS `courses`;
DROP TABLE IF EXISTS `submissions`;
DROP TABLE IF EXISTS `testcases`;
DROP TABLE IF EXISTS `problems`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `classes`;

SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- PHÂN HỆ 1: NGƯỜI DÙNG & LỚP HỌC (USERS & CLASSES)
-- ====================================================================

-- 1. Bảng lớp học phần
CREATE TABLE IF NOT EXISTS `classes` (
    `id`            VARCHAR(50)  NOT NULL COMMENT 'Mã lớp: DHKTPM16A, DHTH15...',
    `name`          VARCHAR(100) NOT NULL COMMENT 'Tên lớp',
    `faculty`       VARCHAR(100) NOT NULL DEFAULT 'Khoa CNTT' COMMENT 'Khoa/Viện quản lý',
    `academic_year` VARCHAR(20)  DEFAULT '2022-2026' COMMENT 'Niên khóa',
    `created_at`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng tài khoản người dùng (Sinh viên & Giảng viên)
CREATE TABLE IF NOT EXISTS `users` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT,
    `code`          VARCHAR(50)  NOT NULL COMMENT 'MSSV hoặc Mã Giảng viên (GV...)',
    `full_name`     VARCHAR(100) NOT NULL COMMENT 'Họ và tên',
    `email`         VARCHAR(100) NOT NULL COMMENT 'Email HaUI',
    `password_hash` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã băm bằng bcrypt',
    `role`          ENUM('STUDENT','TEACHER','ADMIN') NOT NULL DEFAULT 'STUDENT',
    `class_id`      VARCHAR(50)  DEFAULT NULL COMMENT 'FK → classes.id (NULL nếu là Giảng viên)',
    `department`    VARCHAR(100) DEFAULT NULL COMMENT 'Bộ môn/Khoa nếu là Giảng viên',
    `avatar_url`    VARCHAR(255) DEFAULT NULL,
    `total_points`  INT          NOT NULL DEFAULT 0 COMMENT 'Tổng điểm tích lũy',
    `rank_title`    VARCHAR(50)  NOT NULL DEFAULT 'Newbie',
    `streak_days`   INT          NOT NULL DEFAULT 0 COMMENT 'Số ngày học liên tiếp',
    `created_at`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_user_code`  (`code`),
    UNIQUE KEY `uq_user_email` (`email`),
    KEY `idx_users_class`   (`class_id`),
    KEY `idx_users_role`    (`role`),
    CONSTRAINT `fk_users_classes`
        FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- PHÂN HỆ 2: BÀI TẬP, THI ĐẤU & CHẤM CODE (PROBLEMS & SUBMISSIONS)
-- ====================================================================

-- 3. Bảng chủ đề bài tập
CREATE TABLE IF NOT EXISTS `categories` (
    `id`   INT          NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(10)  DEFAULT '📂',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_category_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng bài tập lập trình
CREATE TABLE IF NOT EXISTS `problems` (
    `id`              BIGINT  NOT NULL AUTO_INCREMENT,
    `slug`            VARCHAR(150) NOT NULL,
    `title`           VARCHAR(255) NOT NULL,
    `category_id`     INT          DEFAULT NULL,
    `difficulty`      ENUM('EASY','MEDIUM','HARD') NOT NULL DEFAULT 'EASY',
    `points`          INT          NOT NULL DEFAULT 100,
    `time_limit_ms`   INT          NOT NULL DEFAULT 1000,
    `memory_limit_mb` INT          NOT NULL DEFAULT 256,
    `statement_md`    TEXT         NOT NULL,
    `author_id`       BIGINT       DEFAULT NULL,
    `is_published`    TINYINT(1)   NOT NULL DEFAULT 1,
    `created_at`      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_problem_slug` (`slug`),
    KEY `idx_problems_category`   (`category_id`),
    KEY `idx_problems_author`     (`author_id`),
    KEY `idx_problems_difficulty` (`difficulty`),
    CONSTRAINT `fk_problems_categories`
        FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_problems_author`
        FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng bộ testcase
CREATE TABLE IF NOT EXISTS `testcases` (
    `id`              BIGINT NOT NULL AUTO_INCREMENT,
    `problem_id`      BIGINT NOT NULL,
    `input_data`      TEXT   NOT NULL,
    `expected_output` TEXT   NOT NULL,
    `is_sample`       TINYINT(1) NOT NULL DEFAULT 0,
    `order_index`     INT  NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    KEY `idx_testcases_problem` (`problem_id`),
    CONSTRAINT `fk_testcases_problems`
        FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng lịch sử nộp bài
CREATE TABLE IF NOT EXISTS `submissions` (
    `id`             BIGINT NOT NULL AUTO_INCREMENT,
    `user_id`        BIGINT NOT NULL,
    `problem_id`     BIGINT NOT NULL,
    `source_code`    MEDIUMTEXT NOT NULL,
    `language`       VARCHAR(20) NOT NULL,
    `status`         ENUM('AC','WA','TLE','MLE','CE','RE','PENDING') NOT NULL DEFAULT 'PENDING',
    `runtime_ms`     INT          DEFAULT NULL,
    `memory_used_kb` INT          DEFAULT NULL,
    `score_earned`   INT          NOT NULL DEFAULT 0,
    `created_at`     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_submissions_user`            (`user_id`),
    KEY `idx_submissions_problem`         (`problem_id`),
    KEY `idx_submissions_user_status`     (`user_id`, `status`),
    KEY `idx_submissions_user_problem`    (`user_id`, `problem_id`),
    KEY `idx_submissions_created`         (`created_at`),
    CONSTRAINT `fk_submissions_users`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_submissions_problems`
        FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- PHÂN HỆ 3: KHÓA HỌC & BÀI HỌC (COURSES & LESSONS)
-- ====================================================================

-- 7. Bảng khóa học
CREATE TABLE IF NOT EXISTS `courses` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT,
    `slug`          VARCHAR(150) NOT NULL,
    `title`         VARCHAR(255) NOT NULL,
    `description`   TEXT         DEFAULT NULL,
    `level`         ENUM('BASIC','INTERMEDIATE','ADVANCED') NOT NULL DEFAULT 'BASIC',
    `instructor_id` BIGINT       DEFAULT NULL,
    `image_url`     VARCHAR(255) DEFAULT NULL,
    `is_published`  TINYINT(1)   NOT NULL DEFAULT 1,
    `created_at`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_course_slug` (`slug`),
    KEY `idx_courses_instructor` (`instructor_id`),
    CONSTRAINT `fk_courses_instructor`
        FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Bảng phân công khóa học cho lớp
CREATE TABLE IF NOT EXISTS `class_course_assignments` (
    `class_id`    VARCHAR(50) NOT NULL,
    `course_id`   BIGINT      NOT NULL,
    `assigned_by` BIGINT      DEFAULT NULL,
    `assigned_at` TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`class_id`, `course_id`),
    KEY `idx_cca_course`    (`course_id`),
    KEY `idx_cca_assigned`  (`assigned_by`),
    CONSTRAINT `fk_cca_class`
        FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_cca_course`
        FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_cca_teacher`
        FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Bảng chương học
CREATE TABLE IF NOT EXISTS `course_sections` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT,
    `course_id`   BIGINT       NOT NULL,
    `title`       VARCHAR(255) NOT NULL,
    `order_index` INT          NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    KEY `idx_sections_course` (`course_id`),
    CONSTRAINT `fk_sections_courses`
        FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Bảng bài học
CREATE TABLE IF NOT EXISTS `lessons` (
    `id`           BIGINT  NOT NULL AUTO_INCREMENT,
    `section_id`   BIGINT  NOT NULL,
    `title`        VARCHAR(255) NOT NULL,
    `type`         ENUM('THEORY','PRACTICE','QUIZ') NOT NULL DEFAULT 'THEORY',
    `content_md`   LONGTEXT     DEFAULT NULL,
    `initial_code` TEXT         DEFAULT NULL,
    `problem_id`   BIGINT       DEFAULT NULL,
    `order_index`  INT          NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    KEY `idx_lessons_section` (`section_id`),
    KEY `idx_lessons_problem` (`problem_id`),
    CONSTRAINT `fk_lessons_sections`
        FOREIGN KEY (`section_id`) REFERENCES `course_sections` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_lessons_problems`
        FOREIGN KEY (`problem_id`) REFERENCES `problems` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Bảng tiến độ khóa học
CREATE TABLE IF NOT EXISTS `user_course_progress` (
    `user_id`                 BIGINT  NOT NULL,
    `course_id`               BIGINT  NOT NULL,
    `completed_lessons_count` INT     NOT NULL DEFAULT 0,
    `progress_percent`        DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    `enrolled_at`             TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    `last_activity_at`        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`, `course_id`),
    KEY `idx_ucp_course` (`course_id`),
    CONSTRAINT `fk_ucp_users`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_ucp_courses`
        FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Bảng bài học đã hoàn thành
CREATE TABLE IF NOT EXISTS `user_lesson_completed` (
    `user_id`      BIGINT    NOT NULL,
    `lesson_id`    BIGINT    NOT NULL,
    `completed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`, `lesson_id`),
    KEY `idx_ulc_lesson` (`lesson_id`),
    CONSTRAINT `fk_ulc_users`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_ulc_lessons`
        FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- PHÂN HỆ 4: THỐNG KÊ CHUYÊN CẦN & HOẠT ĐỘNG (ANALYTICS)
-- ====================================================================

-- 13. Bảng ghi nhận nhật ký học tập hàng ngày
CREATE TABLE IF NOT EXISTS `user_daily_activity` (
    `id`                BIGINT NOT NULL AUTO_INCREMENT,
    `user_id`           BIGINT NOT NULL,
    `activity_date`     DATE   NOT NULL,
    `study_seconds`     INT    NOT NULL DEFAULT 0,
    `submissions_count` INT    NOT NULL DEFAULT 0,
    `lessons_completed` INT    NOT NULL DEFAULT 0,
    `is_active`         TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_user_date` (`user_id`, `activity_date`),
    KEY `idx_activity_date` (`activity_date`),
    CONSTRAINT `fk_activity_users`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- PHÂN HỆ 5: THÔNG BÁO (NOTIFICATIONS)
-- ====================================================================

-- 14. Bảng thông báo
CREATE TABLE IF NOT EXISTS `notifications` (
    `id`         BIGINT       NOT NULL AUTO_INCREMENT,
    `user_id`    BIGINT       NOT NULL,
    `type`       ENUM('SUBMISSION_RESULT','ACHIEVEMENT','COURSE_UPDATE','CONTEST_START','TEACHER_ALERT','SYSTEM') NOT NULL DEFAULT 'SYSTEM',
    `title`      VARCHAR(255) NOT NULL,
    `body`       TEXT         DEFAULT NULL,
    `link`       VARCHAR(255) DEFAULT NULL,
    `is_read`    TINYINT(1)   NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_notif_user_read`  (`user_id`, `is_read`),
    KEY `idx_notif_created`    (`created_at`),
    CONSTRAINT `fk_notif_users`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ====================================================================
-- SEED DATA ĐẦY ĐỦ (DỮ LIỆU MẪU MỞ RỘNG)
-- ====================================================================

-- 1. Lớp học phần HaUI (6 Lớp)
INSERT INTO `classes` (`id`, `name`, `faculty`, `academic_year`) VALUES
('DHKTPM16A', 'Kỹ thuật phần mềm 16A',   'Khoa CNTT', '2022-2026'),
('DHKTPM16B', 'Kỹ thuật phần mềm 16B',   'Khoa CNTT', '2022-2026'),
('DHTH15',    'Tin học ứng dụng 15',      'Khoa CNTT', '2021-2025'),
('DHKHMT17',  'Khoa học máy tính 17',     'Khoa CNTT', '2023-2027'),
('DHKTPM17A', 'Kỹ thuật phần mềm 17A',   'Khoa CNTT', '2023-2027'),
('DHATTT16',  'An toàn thông tin 16',     'Khoa CNTT', '2022-2026')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 2. Giảng viên & Sinh viên (2 Giảng viên + 18 Sinh viên kèm Avatar thật)
INSERT INTO `users` (`id`, `code`, `full_name`, `email`, `password_hash`, `role`, `class_id`, `department`, `avatar_url`, `total_points`, `rank_title`, `streak_days`) VALUES
(1, 'GV2026', 'TS. Nguyễn Văn Hùng', 'hungnv@haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'TEACHER', NULL, 'Bộ môn Kỹ thuật Phần mềm - Khoa CNTT', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 0, 'Giảng viên', 0),
(2, 'GV2024', 'ThS. Đỗ Thị Mai', 'maidt@haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'TEACHER', NULL, 'Bộ môn Khoa học Máy tính - Khoa CNTT', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 0, 'Giảng viên', 0),

(3, '2020601111', 'Trần Văn Mạnh', '2020601111@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHKTPM16A', NULL, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', 3840, 'Grandmaster', 32),
(4, '2022604567', 'Lê Quỳnh Trang', '2022604567@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHKTPM16A', NULL, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 3410, 'Master', 24),
(5, '2021600123', 'Nguyễn Văn An', '2021600123@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHKTPM16A', NULL, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 2150, 'Master', 16),
(6, '2021605566', 'Vũ Hải Nam', '2021605566@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHKTPM16A', NULL, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 180, 'Newbie', 0),
(7, '2021602288', 'Hoàng Minh Tuấn', '2021602288@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHKTPM16A', NULL, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 1620, 'Expert', 11),

(8, '2021603344', 'Phạm Đức Long', '2021603344@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHKTPM16B', NULL, 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', 1890, 'Expert', 14),
(9, '2021607799', 'Nguyễn Thị Thu Hà', '2021607799@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHKTPM16B', NULL, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 1450, 'Expert', 9),
(10, '2021608811', 'Đặng Quốc Huy', '2021608811@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHKTPM16B', NULL, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 920, 'Specialist', 5),
(11, '2021609933', 'Bùi Ngọc Ánh', '2021609933@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHKTPM16B', NULL, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 120, 'Newbie', 0),

(12, '2020603412', 'Phan Thanh Tùng', '2020603412@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHTH15', NULL, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 2650, 'Master', 21),
(13, '2020607823', 'Dương Thùy Linh', '2020607823@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHTH15', NULL, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', 1780, 'Expert', 12),
(14, '2020609145', 'Lý Hoàng Nam', '2020609145@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHTH15', NULL, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 450, 'Specialist', 2),

(15, '2022601999', 'Trịnh Gia Bảo', '2022601999@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHKHMT17', NULL, 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', 2980, 'Master', 26),
(16, '2022603456', 'Vũ Mai Phương', '2022603456@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHKHMT17', NULL, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 1320, 'Expert', 8),
(17, '2022607890', 'Ngô Đình Khang', '2022607890@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHKHMT17', NULL, 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 80, 'Newbie', 0),
(18, '2022609012', 'Lê Hữu Đạt', '2022609012@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHKTPM17A', NULL, 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', 750, 'Specialist', 6),
(19, '2022609988', 'Nguyễn Khánh Ly', '2022609988@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHKTPM17A', NULL, 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 1150, 'Expert', 10),
(20, '2021604477', 'Tạ Minh Quang', '2021604477@sv.haui.edu.vn', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36e9H2M9i2kZ5O', 'STUDENT', 'DHATTT16', NULL, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 2200, 'Master', 18)
ON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`);

-- 3. Danh mục chủ đề (6 Danh mục)
INSERT INTO `categories` (`id`, `name`, `slug`, `icon`) VALUES
(1, 'Java Core',              'java-core',             '☕'),
(2, 'Java OOP',               'java-oop',              '🧩'),
(3, 'Cấu trúc dữ liệu',      'cau-truc-du-lieu',      '🌳'),
(4, 'Thuật toán & Quy hoạch', 'thuat-toan-quy-hoach',  '⚡'),
(5, 'Lập trình C/C++',       'lap-trinh-c-cpp',       '🔧'),
(6, 'Web Backend Spring',     'web-backend-spring',    '🌐')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 4. Bài tập lập trình phong phú (15 Bài tập)
INSERT INTO `problems` (`id`, `slug`, `title`, `category_id`, `difficulty`, `points`, `time_limit_ms`, `memory_limit_mb`, `statement_md`, `author_id`) VALUES
(1, 'tim-so-lon-nhat', 'Tìm số lớn nhất trong mảng', 1, 'EASY', 100, 1000, 256, 
 'Cho mảng gồm $N$ số nguyên. Hãy tìm và in ra giá trị lớn nhất trong mảng.\n\n### Input\n- Dòng 1: $N$ ($1 \\le N \\le 10^5$).\n- Dòng 2: $N$ số nguyên.\n\n### Output\n- Một số nguyên duy nhất là số lớn nhất.', 1),

(2, 'quan-ly-nhan-vien-oop', 'Quản lý Nhân viên kế thừa OOP', 2, 'MEDIUM', 150, 1500, 256, 
 'Thiết kế lớp `Person` (name, age) và `Employee` kế thừa `Person` có thêm `salary`. In ra thông tin nhân viên có lương cao nhất.\n\n### Input\n- Dòng 1: Số nhân viên $N$.\n- $N$ dòng tiếp: Tên Tuổi Lương.\n\n### Output\n- Tên và Lương nhân viên cao nhất.', 1),

(3, 'two-sum', 'Hai con số có tổng bằng Target', 4, 'EASY', 100, 1000, 256, 
 'Cho mảng số nguyên và số nguyên $K$. Tìm chỉ số (0-based) của 2 phần tử sao cho tổng bằng $K$.\n\n### Input\n- Dòng 1: $N$ và $K$.\n- Dòng 2: $N$ số nguyên.\n\n### Output\n- Hai chỉ số cách nhau dấu cách.', 1),

(4, 'dao-nguoc-chuoi', 'Đảo ngược chuỗi ký tự', 1, 'EASY', 80, 1000, 256, 
 'Cho một chuỗi ký tự $S$. Hãy in ra chuỗi đảo ngược của $S$.\n\n### Input\n- Một dòng chứa chuỗi $S$ (độ dài $\\le 1000$).\n\n### Output\n- Chuỗi sau khi đảo ngược.', 1),

(5, 'kiem-tra-so-nguyen-to', 'Kiểm tra số nguyên tố', 1, 'EASY', 90, 1000, 256, 
 'Cho số nguyên dương $N$. Kiểm tra $N$ có phải là số nguyên tố hay không.\n\n### Input\n- Số nguyên $N$ ($1 \\le N \\le 10^9$).\n\n### Output\n- In ra `YES` nếu là số nguyên tố, ngược lại in `NO`.', 1),

(6, 'sap-xep-noi-bot-oop', 'Sắp xếp danh sách Sinh viên theo Điểm', 2, 'MEDIUM', 140, 1500, 256, 
 'Viết chương trình nhập vào danh sách $N$ sinh viên (Mã SV, Họ tên, Điểm GPA). Sắp xếp danh sách theo GPA giảm dần bằng giao diện `Comparable` trong Java.\n\n### Output\n- Danh sách sinh viên sau sắp xếp.', 1),

(7, 'ngan-xep-ngoac-hop-le', 'Kiểm tra dấu ngoặc hợp lệ (Stack)', 3, 'MEDIUM', 160, 1000, 256, 
 'Cho chuỗi ngoặc gồm `(`, `)`, `[`, `]`, `{`, `}`. Dùng cấu trúc dữ liệu Stack kiểm tra chuỗi ngoặc có hợp lệ hay không.\n\n### Input\n- Chuỗi ký tự $S$.\n\n### Output\n- `true` hoặc `false`.', 2),

(8, 'tim-kiem-nhi-phan', 'Thuật toán Tìm kiếm nhị phân', 4, 'EASY', 100, 1000, 256, 
 'Cho mảng đã sắp xếp tăng dần gồm $N$ phần tử và số $X$. Dùng Binary Search tìm vị trí xuất hiện của $X$.\n\n### Output\n- Vị trí (0-based) hoặc in `-1` nếu không tìm thấy.', 2),

(9, 'day-con-tang-dai-nhat-lis', 'Dãy con tăng dài nhất (LIS)', 4, 'HARD', 250, 2000, 256, 
 'Cho dãy số nguyên gồm $N$ phần tử. Hãy tìm độ dài của dãy con tăng nghiêm ngặt dài nhất bằng Quy hoạch động $O(N \\log N)$.\n\n### Input\n- Dòng 1: $N$ ($1 \\le N \\le 10^5$).\n- Dòng 2: $N$ số nguyên.\n\n### Output\n- Một số nguyên là độ dài lớn nhất.', 2),

(10, 'bai-toan-cai-tui-knapsack', 'Bài toán cái túi 0/1 (Knapsack)', 4, 'HARD', 300, 2000, 256, 
 'Có $N$ đồ vật, mỗi vật có trọng lượng $W_i$ và giá trị $V_i$. Chiếc túi có sức chứa tối đa $M$. Hãy chọn các đồ vật sao cho tổng giá trị là lớn nhất mà không vượt quá $M$.\n\n### Output\n- Giá trị lớn nhất đạt được.', 2),

(11, 'danh-sach-lien-ket-don', 'Đảo ngược Danh sách liên kết đơn', 3, 'MEDIUM', 150, 1000, 256, 
 'Xây dựng cấu trúc Node trong Java/C++ và viết hàm đảo ngược danh sách liên kết đơn trong thời gian $O(N)$ và bộ nhớ $O(1)$.', 1),

(12, 'cay-nhi-phan-tim-kiem-bst', 'Duyệt cây nhị phân tìm kiếm BST', 3, 'HARD', 220, 1500, 256, 
 'Xây dựng cây BST từ mảng số nguyên. In ra thứ tự duyệt cây theo thứ tự In-order (Trung thứ) và Pre-order (Tiền thứ).', 2),

(13, 'tong-hai-ma-tran', 'Tính tổng và tích hai ma trận', 5, 'EASY', 100, 1000, 256, 
 'Cho 2 ma trận kích thước $N \\times M$. Tính ma trận tổng.', 1),

(14, 'thuat-toan-dijkstra-do-thi', 'Tìm đường đi ngắn nhất (Dijkstra)', 4, 'HARD', 280, 2000, 256, 
 'Cho đồ thị có hướng có trọng số dương gồm $V$ đỉnh và $E$ cạnh. Tìm khoảng cách ngắn nhất từ đỉnh nguồn $S$ tới tất cả các đỉnh còn lại.', 2),

(15, 'thiet-ke-rest-api-user', 'Thiết kế REST API Quản lý User', 6, 'MEDIUM', 180, 2000, 512, 
 'Viết Controller và Service xử lý nghiệp vụ CRUD tài khoản người dùng chuẩn RESTful trong Spring Boot.', 1)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- 5. Testcases cho các bài tập
INSERT INTO `testcases` (`problem_id`, `input_data`, `expected_output`, `is_sample`, `order_index`) VALUES
(1, '5\n1 9 3 7 5', '9', 1, 1),
(1, '3\n-5 -2 -10', '-2', 0, 2),
(1, '1\n42', '42', 0, 3),
(2, '3\nAn 22 5000000\nBinh 25 8000000\nCuong 30 6000000', 'Binh 8000000', 1, 1),
(3, '4 9\n2 7 11 15', '0 1', 1, 1),
(3, '3 6\n3 2 4', '1 2', 0, 2),
(4, 'HelloHaUI', 'IUaHolleH', 1, 1),
(4, 'Java', 'avaJ', 0, 2),
(5, '7', 'YES', 1, 1),
(5, '10', 'NO', 1, 2),
(5, '999999937', 'YES', 0, 3),
(7, '()[]{}', 'true', 1, 1),
(7, '(]', 'false', 1, 2),
(7, '([{}])', 'true', 0, 3),
(8, '5 7\n1 3 5 7 9', '3', 1, 1),
(8, '5 4\n1 3 5 7 9', '-1', 0, 2),
(9, '6\n10 9 2 5 3 7 101 18', '4', 1, 1),
(10, '3 4\n1 1500\n3 2000\n4 3000', '3500', 1, 1);

-- 6. Khóa học đầy đủ (4 Khóa học với ảnh Unsplash công nghệ)
INSERT INTO `courses` (`id`, `slug`, `title`, `description`, `level`, `instructor_id`, `image_url`) VALUES
(1, 'java-co-ban-oop', 'Lập trình Java Căn bản & OOP HaUI', 
 'Nắm vững cú pháp Java 17/21, các nguyên lý OOP (Đóng gói, Kế thừa, Đa hình, Trừu tượng) chuẩn đầu ra Khoa CNTT HaUI.', 
 'BASIC', 1, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600'),

(2, 'cau-truc-du-lieu-giai-thuat', 'Cấu trúc Dữ liệu & Giải thuật Ứng dụng', 
 'Luyện tập các cấu trúc dữ liệu kinh điển: Stack, Queue, Linked List, Tree BST, Graph và Quy hoạch động.', 
 'INTERMEDIATE', 2, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600'),

(3, 'lap-trinh-web-spring-boot', 'Phát triển Web Backend với Spring Boot & MySQL', 
 'Xây dựng hệ thống RESTful API chuẩn doanh nghiệp, bảo mật JWT, kết nối JPA MySQL và thiết kế Modular Monolith.', 
 'ADVANCED', 1, 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600'),

(4, 'lap-trinh-c-cpp-can-ban', 'Lập trình C/C++ Căn bản cho Tân sinh viên', 
 'Nhập môn lập trình: Biến, vòng lặp, mảng, con trỏ và cấp phát bộ nhớ động chuẩn đại học.', 
 'BASIC', 2, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- 7. Phân công khóa học cho các lớp
INSERT INTO `class_course_assignments` (`class_id`, `course_id`, `assigned_by`) VALUES
('DHKTPM16A', 1, 1),
('DHKTPM16A', 2, 1),
('DHKTPM16A', 3, 1),
('DHKTPM16B', 1, 1),
('DHKTPM16B', 2, 1),
('DHTH15',    1, 1),
('DHTH15',    4, 2),
('DHKHMT17',  2, 2)
ON DUPLICATE KEY UPDATE `assigned_by`=VALUES(`assigned_by`);

-- 8. Chương học (Course Sections)
INSERT INTO `course_sections` (`id`, `course_id`, `title`, `order_index`) VALUES
(1, 1, 'Chương 1: Cú pháp Java & Cài đặt Môi trường', 1),
(2, 1, 'Chương 2: Lập trình Hướng đối tượng (OOP)', 2),
(3, 1, 'Chương 3: Xử lý Ngoại lệ & Java Collections Framework', 3),

(4, 2, 'Chương 1: Mảng, Ngăn xếp (Stack) & Hàng đợi (Queue)', 1),
(5, 2, 'Chương 2: Danh sách liên kết & Cây nhị phân BST', 2),
(6, 2, 'Chương 3: Thuật toán Sắp xếp & Quy hoạch động', 3),

(7, 3, 'Chương 1: Tổng quan Spring Boot & Dependency Injection', 1),
(8, 3, 'Chương 2: Xây dựng RESTful API & Bảo mật JWT', 2),

(9, 4, 'Chương 1: Nhập môn C/C++ & Cú pháp cơ bản', 1),
(10, 4, 'Chương 2: Mảng và Con trỏ trong C++', 2)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- 9. Bài học chi tiết (Lessons)
INSERT INTO `lessons` (`id`, `section_id`, `title`, `type`, `content_md`, `initial_code`, `problem_id`, `order_index`) VALUES
(1, 1, 'Bài 1: Giới thiệu Java & Cài đặt JDK', 'THEORY', '### 1. Giới thiệu Java\nJava là ngôn ngữ lập trình hướng đối tượng độc lập nền tảng (Write Once, Run Anywhere)...', NULL, NULL, 1),
(2, 1, 'Bài 2: Biến, Kiểu dữ liệu & Toán tử', 'PRACTICE', 'Thực hành khai báo biến và tìm số lớn nhất.', 'public class Solution {\n    public static void main(String[] args) {\n        // Viết code tại đây\n    }\n}', 1, 2),
(3, 2, 'Bài 3: Lớp và Đối tượng (Class & Object)', 'THEORY', '### Lớp và Đối tượng\nClass là khuôn mẫu (Blueprint), Object là thực thể cụ thể...', NULL, NULL, 1),
(4, 2, 'Bài 4: Kế thừa (Inheritance) & Đa hình', 'PRACTICE', 'Thực hành xây dựng lớp Person và Employee kế thừa.', 'public class Solution {\n    // Khai báo class Person & Employee\n}', 2, 2),
(5, 3, 'Bài 5: Java List & Map Collections', 'PRACTICE', 'Thực hành giải bài toán Two Sum bằng HashMap $O(N)$.', 'public class Solution {\n    // Sử dụng HashMap\n}', 3, 1),
(6, 3, 'Bài 6: Xử lý Ngoại lệ (Try-Catch-Finally)', 'THEORY', '### Exception Handling trong Java\nCơ chế bắt và xử lý ngoại lệ an toàn trong ứng dụng...', NULL, NULL, 2),

(7, 4, 'Bài 1: Cấu trúc Ngăn xếp (Stack) & Ứng dụng', 'PRACTICE', 'Thực hành kiểm tra dấu ngoặc hợp lệ bằng Stack.', 'import java.util.Stack;\npublic class Solution {\n    public boolean isValid(String s) {\n        // Code tại đây\n        return true;\n    }\n}', 7, 1),
(8, 4, 'Bài 2: Cấu trúc Hàng đợi (Queue) & Deque', 'THEORY', '### Hàng đợi Queue\nNguyên lý vào trước ra trước (FIFO - First In First Out)...', NULL, NULL, 2),
(9, 5, 'Bài 3: Danh sách liên kết đơn (Linked List)', 'PRACTICE', 'Thực hành đảo ngược Linked List.', NULL, 11, 1),
(10, 6, 'Bài 4: Quy hoạch động căn bản (DP)', 'PRACTICE', 'Giải bài toán Cái túi Knapsack 0/1 bằng DP.', NULL, 10, 1),

(11, 7, 'Bài 1: Kiến trúc Spring Boot 3 & Maven', 'THEORY', '### Spring Boot Framework\nGiới thiệu IoC Container, Bean và cơ chế Auto-configuration...', NULL, NULL, 1),
(12, 8, 'Bài 2: Xây dựng REST API & Security JWT', 'PRACTICE', 'Thực hành tạo Controller trả về JSON chuẩn.', NULL, 15, 1),

(13, 9, 'Bài 1: Cấu trúc chương trình C/C++', 'THEORY', '### Nhập môn C++\nCú pháp `cin`, `cout`, thư viện `iostream` và hàm `main()`...', NULL, NULL, 1),
(14, 10, 'Bài 2: Ma trận và Mảng 2 chiều', 'PRACTICE', 'Thực hành tính tổng 2 ma trận.', NULL, 13, 1)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- 10. Tiến độ khóa học của sinh viên
INSERT INTO `user_course_progress` (`user_id`, `course_id`, `completed_lessons_count`, `progress_percent`) VALUES
(3, 1, 6, 100.00),
(3, 2, 4, 100.00),
(4, 1, 5, 83.33),
(4, 2, 3, 75.00),
(5, 1, 4, 66.67),
(5, 2, 2, 50.00),
(7, 1, 3, 50.00),
(8, 1, 4, 66.67),
(12, 1, 6, 100.00),
(15, 2, 4, 100.00),
(6, 1, 1, 16.67)
ON DUPLICATE KEY UPDATE `progress_percent`=VALUES(`progress_percent`);

-- 11. Bài học hoàn thành
INSERT IGNORE INTO `user_lesson_completed` (`user_id`, `lesson_id`) VALUES
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8), (3, 9), (3, 10),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 7), (4, 8), (4, 9),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 7), (5, 8),
(6, 1),
(7, 1), (7, 2), (7, 3),
(8, 1), (8, 2), (8, 3), (8, 4),
(12, 1), (12, 2), (12, 3), (12, 4), (12, 5), (12, 6);

-- 12. Lịch sử nộp bài phong phú
INSERT IGNORE INTO `submissions` (`user_id`, `problem_id`, `source_code`, `language`, `status`, `runtime_ms`, `memory_used_kb`, `score_earned`, `created_at`) VALUES
(3, 1, 'import java.util.*;\npublic class Solution { public static void main(String[] args){ Scanner sc=new Scanner(System.in); int n=sc.nextInt(), m=Integer.MIN_VALUE; while(n-->0) m=Math.max(m,sc.nextInt()); System.out.println(m); } }', 'JAVA', 'AC', 38, 15420, 100, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(3, 2, '// Code OOP Employee\nclass Employee extends Person { ... }', 'JAVA', 'AC', 55, 18200, 150, DATE_SUB(NOW(), INTERVAL 9 DAY)),
(3, 3, '// Two sum hashmap', 'JAVA', 'AC', 42, 16000, 100, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(3, 9, '// DP LIS O(NlogN)', 'CPP', 'AC', 18, 8900, 250, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 10, '// Knapsack 0/1', 'JAVA', 'AC', 48, 17500, 300, DATE_SUB(NOW(), INTERVAL 2 DAY)),

(4, 1, 'public class Main { ... }', 'JAVA', 'AC', 40, 15800, 100, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(4, 2, 'public class Main { ... }', 'JAVA', 'AC', 62, 19100, 150, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(4, 3, 'public class Main { ... }', 'JAVA', 'AC', 45, 16200, 100, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(4, 7, 'public class Main { ... }', 'JAVA', 'AC', 36, 14900, 160, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(4, 9, 'public class Main { ... }', 'CPP', 'WA', 25, 9200, 0, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 9, 'public class Main { ... }', 'CPP', 'AC', 20, 9100, 250, NOW()),

(5, 1, 'public class Main { ... }', 'JAVA', 'AC', 44, 15900, 100, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(5, 2, 'public class Main { ... }', 'JAVA', 'WA', 68, 19400, 0, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(5, 2, 'public class Main { ... }', 'JAVA', 'AC', 58, 18900, 150, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(5, 3, 'public class Main { ... }', 'JAVA', 'AC', 41, 16100, 100, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(5, 4, 'public class Main { ... }', 'JAVA', 'AC', 35, 14800, 80, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(5, 5, 'public class Main { ... }', 'JAVA', 'AC', 39, 15200, 90, NOW()),

(6, 1, 'public class Main { ... }', 'JAVA', 'WA', 45, 16000, 0, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(6, 1, 'public class Main { ... }', 'JAVA', 'AC', 48, 16200, 100, DATE_SUB(NOW(), INTERVAL 17 DAY)),

(7, 1, 'public class Main { ... }', 'JAVA', 'AC', 42, 15700, 100, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(7, 3, 'public class Main { ... }', 'JAVA', 'AC', 46, 16300, 100, DATE_SUB(NOW(), INTERVAL 2 DAY)),

(8, 1, 'public class Main { ... }', 'JAVA', 'AC', 39, 15500, 100, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(8, 2, 'public class Main { ... }', 'JAVA', 'AC', 59, 18700, 150, DATE_SUB(NOW(), INTERVAL 3 DAY)),

(15, 1, 'public class Main { ... }', 'CPP', 'AC', 15, 8400, 100, DATE_SUB(NOW(), INTERVAL 7 DAY)),
(15, 7, 'public class Main { ... }', 'CPP', 'AC', 19, 8700, 160, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(15, 9, 'public class Main { ... }', 'CPP', 'AC', 22, 9000, 250, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 13. Nhật ký hoạt động hàng ngày
INSERT INTO `user_daily_activity` (`user_id`, `activity_date`, `study_seconds`, `submissions_count`, `lessons_completed`) VALUES
(3, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 7200, 4, 2),
(3, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 5400, 3, 1),
(3, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 8100, 5, 2),
(3, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 6300, 3, 1),
(3, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 9000, 6, 2),
(3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 7800, 4, 1),
(3, CURDATE(),                            4500, 2, 1),

(5, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 3600, 2, 1),
(5, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 4200, 3, 1),
(5, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 5400, 3, 2),
(5, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 2700, 2, 1),
(5, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 4800, 4, 1),
(5, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 3600, 2, 1),
(5, CURDATE(),                            1800, 2, 1),

(4, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 4800, 3, 1),
(4, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 6000, 4, 2),
(4, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 3900, 2, 1),
(4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 5100, 3, 1),
(4, CURDATE(),                            2400, 1, 0),

(6, DATE_SUB(CURDATE(), INTERVAL 18 DAY), 1200, 1, 1),
(6, DATE_SUB(CURDATE(), INTERVAL 17 DAY), 1800, 1, 0),

(11, DATE_SUB(CURDATE(), INTERVAL 15 DAY), 900, 1, 0),

(17, DATE_SUB(CURDATE(), INTERVAL 14 DAY), 600, 0, 0)
ON DUPLICATE KEY UPDATE `study_seconds`=VALUES(`study_seconds`);

-- 14. Thông báo mẫu
INSERT INTO `notifications` (`user_id`, `type`, `title`, `body`, `link`, `is_read`) VALUES
(5, 'SUBMISSION_RESULT', '✅ Bài nộp được chấp nhận!', 'Bài "Tìm số lớn nhất trong mảng" đạt kết quả AC (38ms).', '/problems/tim-so-lon-nhat', 0),
(5, 'ACHIEVEMENT', '🏆 Lên hạng Master!', 'Chúc mừng bạn đã đạt 2000 điểm và vươn lên cấp bậc Master.', '/leaderboard', 0),
(5, 'COURSE_UPDATE', '📚 Khóa học Spring Boot có bài mới', 'Giảng viên vừa thêm bài học "Xây dựng REST API & Security JWT".', '/khoa-hoc/lap-trinh-web-spring-boot', 0),
(5, 'CONTEST_START', '⚔️ Cuộc thi tuần 39 sắp diễn ra', 'Cuộc thi lập trình thuật toán HaUI bắt đầu lúc 20h00 tối nay.', '/thi-dau', 1),
(5, 'TEACHER_ALERT', '📢 Nhắc nhở nộp bài tập tuần', 'TS. Nguyễn Văn Hùng nhắc cả lớp hoàn thành bài tập OOP trước Chủ Nhật.', '/teacher/problems', 1),

(3, 'ACHIEVEMENT', '👑 Đạt danh hiệu Grandmaster!', 'Bạn đã lọt vào Top 1 sinh viên xuất sắc nhất khoa CNTT.', '/leaderboard', 0),
(6, 'TEACHER_ALERT', '⚠️ Cảnh báo tiến độ học tập', 'Bạn đã vắng mặt hơn 2 tuần. Vui lòng liên hệ Giảng viên bộ môn.', '/home', 0);
