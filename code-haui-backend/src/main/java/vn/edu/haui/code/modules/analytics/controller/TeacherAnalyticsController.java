package vn.edu.haui.code.modules.analytics.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.edu.haui.code.common.dto.ApiResponse;
import vn.edu.haui.code.modules.analytics.dto.AtRiskStudentDto;
import vn.edu.haui.code.modules.analytics.dto.DailyActivityDto;
import vn.edu.haui.code.modules.analytics.dto.TeacherKpiSummaryDto;
import vn.edu.haui.code.modules.analytics.dto.TopSolverDto;
import vn.edu.haui.code.modules.analytics.service.StudentActivityService;
import vn.edu.haui.code.modules.analytics.service.TeacherAnalyticsService;

import vn.edu.haui.code.modules.problem.dto.SubmissionDto;
import vn.edu.haui.code.modules.problem.service.SubmissionService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teacher/analytics")
@RequiredArgsConstructor
@Tag(name = "4. Teacher Analytics", description = "API Thống kê, Báo cáo & Cảnh báo sinh viên dành cho Giảng viên")
public class TeacherAnalyticsController {

    private final TeacherAnalyticsService teacherAnalyticsService;
    private final StudentActivityService studentActivityService;
    private final SubmissionService submissionService;

    @GetMapping("/kpi")
    @Operation(summary = "Lấy tổng hợp chỉ số KPI giảng dạy (Tổng SV, Tỷ lệ nộp bài, Tỷ lệ Pass, SV nguy cơ)")
    public ResponseEntity<ApiResponse<TeacherKpiSummaryDto>> getKpiSummary(
            @RequestParam(required = false) String classId
    ) {
        TeacherKpiSummaryDto summary = teacherAnalyticsService.getKpiSummary(classId);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    @GetMapping("/top-solvers")
    @Operation(summary = "Lấy danh sách Top sinh viên giải nhiều bài nhất")
    public ResponseEntity<ApiResponse<List<TopSolverDto>>> getTopSolvers(
            @RequestParam(required = false) String classId
    ) {
        List<TopSolverDto> topSolvers = teacherAnalyticsService.getTopSolvers(classId);
        return ResponseEntity.ok(ApiResponse.ok(topSolvers));
    }

    @GetMapping("/at-risk")
    @Operation(summary = "Lấy danh sách sinh viên có nguy cơ bỏ học / tiến độ kém")
    public ResponseEntity<ApiResponse<List<AtRiskStudentDto>>> getAtRiskStudents(
            @RequestParam(required = false) String classId
    ) {
        List<AtRiskStudentDto> atRisk = teacherAnalyticsService.getAtRiskStudents(classId);
        return ResponseEntity.ok(ApiResponse.ok(atRisk));
    }

    @GetMapping("/student/{studentId}/activity")
    @Operation(summary = "Xem biểu đồ hoạt động tuần của một sinh viên cụ thể")
    public ResponseEntity<ApiResponse<List<DailyActivityDto>>> getStudentActivity(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "7") int days
    ) {
        List<DailyActivityDto> activity = studentActivityService.getStudentActivitiesById(studentId, days);
        return ResponseEntity.ok(ApiResponse.ok(activity));
    }

    @GetMapping("/student/{studentId}/submissions")
    @Operation(summary = "Lấy lịch sử nộp bài của một sinh viên theo ID")
    public ResponseEntity<ApiResponse<List<SubmissionDto>>> getStudentSubmissions(
            @PathVariable Long studentId
    ) {
        List<SubmissionDto> submissions = submissionService.getUserSubmissions(studentId);
        return ResponseEntity.ok(ApiResponse.ok(submissions));
    }
}

