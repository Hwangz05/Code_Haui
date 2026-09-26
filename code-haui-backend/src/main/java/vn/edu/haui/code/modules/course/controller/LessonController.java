package vn.edu.haui.code.modules.course.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import vn.edu.haui.code.common.dto.ApiResponse;
import vn.edu.haui.code.modules.course.dto.LessonDetailDto;
import vn.edu.haui.code.modules.course.service.LessonService;

@RestController
@RequestMapping("/api/v1/lessons")
@RequiredArgsConstructor
@Tag(name = "3. Lessons & Workspace", description = "API Nội dung bài học và Đánh dấu hoàn thành bài học")
public class LessonController {

    private final LessonService lessonService;

    @GetMapping("/{id}")
    @Operation(summary = "Lấy nội dung chi tiết bài học (Lý thuyết Markdown + Code IDE khởi tạo)")
    public ResponseEntity<ApiResponse<LessonDetailDto>> getLessonDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userCode = userDetails != null ? userDetails.getUsername() : null;
        LessonDetailDto lesson = lessonService.getLessonDetail(id, userCode);
        return ResponseEntity.ok(ApiResponse.ok(lesson));
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Đánh dấu bài học đã hoàn thành")
    public ResponseEntity<ApiResponse<Void>> markLessonCompleted(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        lessonService.markLessonCompleted(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Hoàn thành bài học thành công", null));
    }
}
