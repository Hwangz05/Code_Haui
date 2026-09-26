package vn.edu.haui.code.modules.course.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import vn.edu.haui.code.common.dto.ApiResponse;
import vn.edu.haui.code.modules.course.dto.CourseDetailDto;
import vn.edu.haui.code.modules.course.dto.CourseDto;
import vn.edu.haui.code.modules.course.dto.CourseProgressDto;
import vn.edu.haui.code.modules.course.service.CourseService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
@Tag(name = "3. Course Management", description = "API Khóa học, Đề cương chi tiết và Tiến độ học tập")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    @Operation(summary = "Lấy danh sách các khóa học đã xuất bản")
    public ResponseEntity<ApiResponse<List<CourseDto>>> getAllCourses() {
        List<CourseDto> courses = courseService.getAllPublishedCourses();
        return ResponseEntity.ok(ApiResponse.ok(courses));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Lấy chi tiết khóa học kèm danh sách chương và bài học")
    public ResponseEntity<ApiResponse<CourseDetailDto>> getCourseDetail(
            @PathVariable String slug,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String userCode = userDetails != null ? userDetails.getUsername() : null;
        CourseDetailDto course = courseService.getCourseDetail(slug, userCode);
        return ResponseEntity.ok(ApiResponse.ok(course));
    }

    @GetMapping("/my-progress")
    @Operation(summary = "Lấy danh sách tiến độ các khóa học của người dùng hiện tại")
    public ResponseEntity<ApiResponse<List<CourseProgressDto>>> getMyProgress(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<CourseProgressDto> progress = courseService.getUserCoursesProgress(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(progress));
    }
}
