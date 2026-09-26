package vn.edu.haui.code.modules.analytics.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import vn.edu.haui.code.common.dto.ApiResponse;
import vn.edu.haui.code.modules.analytics.dto.DailyActivityDto;
import vn.edu.haui.code.modules.analytics.service.StudentActivityService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "4. Activity & Chuyên cần", description = "API Nhật ký chuyên cần, Thời gian học tập cá nhân")
public class StudentActivityController {

    private final StudentActivityService studentActivityService;

    @GetMapping("/my-activity")
    @Operation(summary = "Lấy nhật ký học tập gần nhất của tài khoản hiện tại")
    public ResponseEntity<ApiResponse<List<DailyActivityDto>>> getMyActivity(
            @RequestParam(defaultValue = "14") int days,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<DailyActivityDto> activity = studentActivityService.getRecentActivities(userDetails.getUsername(), days);
        return ResponseEntity.ok(ApiResponse.ok(activity));
    }

    @PostMapping("/heartbeat")
    @Operation(summary = "Ghi nhận thời gian học (Heartbeat ping mỗi 60 giây)")
    public ResponseEntity<ApiResponse<Void>> recordHeartbeat(
            @RequestParam(defaultValue = "60") int seconds,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        studentActivityService.recordHeartbeat(userDetails.getUsername(), seconds);
        return ResponseEntity.ok(ApiResponse.ok("Ghi nhận thời gian học thành công", null));
    }
}
