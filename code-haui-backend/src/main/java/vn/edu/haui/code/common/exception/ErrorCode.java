package vn.edu.haui.code.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION("Lỗi hệ thống không xác định", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_NOT_FOUND("Không tìm thấy người dùng", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS("Mã sinh viên/giảng viên hoặc email đã tồn tại", HttpStatus.BAD_REQUEST),
    INVALID_CREDENTIALS("Mã đăng nhập hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("Bạn chưa đăng nhập hoặc token đã hết hạn", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("Bạn không có quyền thực hiện thao tác này", HttpStatus.FORBIDDEN),
    PROBLEM_NOT_FOUND("Không tìm thấy bài tập", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND("Không tìm thấy danh mục", HttpStatus.NOT_FOUND),
    COURSE_NOT_FOUND("Không tìm thấy khóa học", HttpStatus.NOT_FOUND),
    LESSON_NOT_FOUND("Không tìm thấy bài học", HttpStatus.NOT_FOUND),
    CLASS_NOT_FOUND("Không tìm thấy lớp học phần", HttpStatus.NOT_FOUND),
    NOTIFICATION_NOT_FOUND("Không tìm thấy thông báo", HttpStatus.NOT_FOUND),
    INVALID_REQUEST("Dữ liệu yêu cầu không hợp lệ", HttpStatus.BAD_REQUEST);

    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String message, HttpStatus httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
