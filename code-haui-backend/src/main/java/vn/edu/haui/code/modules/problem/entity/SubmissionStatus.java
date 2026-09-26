package vn.edu.haui.code.modules.problem.entity;

public enum SubmissionStatus {
    AC,      // Accepted (Đúng hoàn toàn)
    WA,      // Wrong Answer (Sai kết quả)
    TLE,     // Time Limit Exceeded (Quá thời gian thực thi)
    MLE,     // Memory Limit Exceeded (Tràn bộ nhớ)
    CE,      // Compilation Error (Lỗi biên dịch)
    RE,      // Runtime Error (Lỗi trong quá trình chạy)
    PENDING  // Đang chờ chấm
}
