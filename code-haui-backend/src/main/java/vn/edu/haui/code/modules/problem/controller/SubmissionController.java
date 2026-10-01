package vn.edu.haui.code.modules.problem.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import vn.edu.haui.code.common.dto.ApiResponse;
import vn.edu.haui.code.modules.problem.dto.SubmissionDto;
import vn.edu.haui.code.modules.problem.dto.SubmitCodeRequest;
import vn.edu.haui.code.modules.problem.service.SubmissionService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/submissions")
@RequiredArgsConstructor
@Tag(name = "2. Submissions & Code Judge", description = "API Nộp mã nguồn, Chấm bài và Lịch sử nộp bài")
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    @Operation(summary = "Nộp mã nguồn để chấm điểm (Java, C++, Python...)")
    public ResponseEntity<ApiResponse<SubmissionDto>> submitCode(
            @Valid @RequestBody SubmitCodeRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        SubmissionDto response = submissionService.submitCode(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Chấm bài hoàn tất", response));
    }

    @GetMapping("/my")
    @Operation(summary = "Lấy lịch sử nộp bài của tài khoản đang đăng nhập")
    public ResponseEntity<ApiResponse<List<SubmissionDto>>> getMySubmissions(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<SubmissionDto> response = submissionService.getMySubmissions(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Lấy lịch sử nộp bài của một sinh viên theo ID (Dành cho Giảng viên / Quản trị viên)")
    public ResponseEntity<ApiResponse<List<SubmissionDto>>> getUserSubmissions(
            @PathVariable Long userId
    ) {
        List<SubmissionDto> response = submissionService.getUserSubmissions(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/problem/{problemId}")
    @Operation(summary = "Lấy lịch sử nộp bài của một bài tập cụ thể")
    public ResponseEntity<ApiResponse<List<SubmissionDto>>> getProblemSubmissions(
            @PathVariable Long problemId
    ) {
        List<SubmissionDto> response = submissionService.getProblemSubmissions(problemId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
