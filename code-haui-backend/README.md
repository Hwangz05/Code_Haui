# HỆ THỐNG BACKEND CODE HAUI (MODULAR MONOLITH)
**Trường Đại học Công nghiệp Hà Nội (HaUI)**  
**Kiến trúc:** Modular Monolith  
**Môi trường:** Java 25 (OpenJDK 25) / Spring Boot 3.4.1 / MySQL 8.0+

---

## 📁 Cấu Trúc Thư Mục Chuẩn Doanh Nghiệp (Modular Monolith)

```
code-haui-backend/
├── pom.xml                                      # Maven POM Java 25 & Spring Boot 3.4.1
├── src/
│   └── main/
│       ├── java/vn/edu/haui/code/
│       │   ├── CodeHauiApplication.java         # File chạy chính của ứng dụng
│       │   │
│       │   ├── common/                          # SHARED KERNEL (Dùng chung cho toàn hệ thống)
│       │   │   ├── config/                      # Swagger/OpenAPI 3, CORS, JPA Auditing
│       │   │   ├── dto/                         # ApiResponse, PageResponse
│       │   │   ├── entity/                      # BaseEntity (createdAt, updatedAt)
│       │   │   ├── exception/                   # GlobalExceptionHandler, AppException, ErrorCode
│       │   │   └── security/                    # JWT Provider, AuthFilter, SecurityConfig
│       │   │
│       │   └── modules/                         # CÁC MODULE NGHIỆP VỤ ĐỘC LẬP
│       │       ├── identity/                    # 1. Xác thực, Sinh viên, Giảng viên & Lớp học
│       │       │   ├── controller/              # AuthController, UserController, ClassController
│       │       │   ├── dto/                     # LoginRequest, RegisterRequest, AuthResponse, UserDto, ClassDto
│       │       │   ├── entity/                  # User, Clazz, Role
│       │       │   ├── repository/              # UserRepository, ClassRepository
│       │       │   └── service/                 # AuthService, UserService, ClassService
│       │       │
│       │       ├── problem/                     # 2. Bài tập, Danh mục & Chấm bài (Judge)
│       │       │   ├── controller/              # ProblemController, CategoryController, SubmissionController
│       │       │   ├── dto/                     # ProblemDto, ProblemDetailDto, SubmitCodeRequest...
│       │       │   ├── entity/                  # Problem, Category, Testcase, Submission
│       │       │   ├── repository/              # ProblemRepository, CategoryRepository, SubmissionRepository...
│       │       │   └── service/                 # ProblemService, CategoryService, SubmissionService
│       │       │
│       │       ├── course/                      # 3. Khóa học, Chương mục, Bài học & Tiến độ
│       │       │   ├── controller/              # CourseController, LessonController
│       │       │   ├── dto/                     # CourseDto, SectionDto, LessonDto, CourseProgressDto...
│       │       │   ├── entity/                  # Course, CourseSection, Lesson, UserCourseProgress...
│       │       │   ├── repository/              # CourseRepository, LessonRepository, ProgressRepository...
│       │       │   └── service/                 # CourseService, LessonService
│       │       │
│       │       ├── analytics/                   # 4. Thống kê Chuyên cần, KPI Giảng viên & Cảnh báo
│       │       │   ├── controller/              # TeacherAnalyticsController, StudentActivityController
│       │       │   ├── dto/                     # TeacherKpiSummaryDto, TopSolverDto, AtRiskStudentDto...
│       │       │   ├── entity/                  # UserDailyActivity
│       │       │   ├── repository/              # UserDailyActivityRepository
│       │       │   └── service/                 # TeacherAnalyticsService, StudentActivityService
│       │       │
│       │       └── notification/                # 5. Thông báo hệ thống & Badge unread
│       │           ├── controller/              # NotificationController
│       │           ├── dto/                     # NotificationDto
│       │           ├── entity/                  # Notification, NotificationType
│       │           ├── repository/              # NotificationRepository
│       │           └── service/                 # NotificationService
│       │
│       └── resources/
│           └── application.yml                  # Cấu hình CSDL, JWT, Port 8080, CORS
```

---

## 🚀 Hướng Dẫn Mở & Chạy Trên IntelliJ IDEA (Java 25)

### Bước 1: Mở dự án trong IntelliJ IDEA
1. Khởi động **IntelliJ IDEA**.
2. Chọn **File -> Open...** (hoặc **Open** ở màn hình Welcome).
3. Trỏ đến thư mục:
   `C:\Users\AD\.gemini\antigravity\scratch\code-haui-backend`
4. Chọn **Open as Project**.

### Bước 2: Cài đặt JDK 25 trong IntelliJ IDEA
1. Vào **File -> Project Structure...** (phím tắt `Ctrl + Alt + Shift + S`).
2. Tại mục **Project**:
   - **SDK**: Chọn **JDK 25** (Nếu máy chưa nhận, bấm *Add SDK -> Download JDK...* hoặc trỏ đến thư mục cài JDK 25 trên máy bạn).
   - **Language level**: Chọn **25 - No new language features** (hoặc Default).
3. Bấm **Apply -> OK**.

### Bước 3: Cấu hình cơ sở dữ liệu MySQL
Mở file `src/main/resources/application.yml` và kiểm tra thông tin kết nối MySQL:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/code_haui_db?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&allowPublicKeyRetrieval=true&characterEncoding=UTF-8
    username: root
    password: haui_password # Thay đổi thành mật khẩu MySQL trên máy của bạn
```
*Lưu ý: Bạn chỉ cần chạy script `code_haui_database.sql` trong MySQL Workbench / Navicat / DBeaver là có sẵn database và dữ liệu mẫu.*

### Bước 4: Chạy Ứng Dụng
1. Tìm file `src/main/java/vn/edu/haui/code/CodeHauiApplication.java`.
2. Bấm chuột phải -> chọn **Run 'CodeHauiApplication'** (hoặc bấm biểu tượng tam giác xanh ▶️).
3. Ứng dụng sẽ khởi động trên cổng **`http://localhost:8080`**.

---

## 📖 Tài Liệu Swagger UI & Kiểm Thử API

Sau khi khởi động ứng dụng, bạn có thể truy cập tài liệu API trực quan tại:
🔗 **`http://localhost:8080/swagger-ui.html`**

### Tài khoản mẫu đăng nhập thử:
- **Sinh viên:** `2021600123` / Mật khẩu: `haui@2026`
- **Giảng viên:** `GV2026` / Mật khẩu: `haui@2026`
