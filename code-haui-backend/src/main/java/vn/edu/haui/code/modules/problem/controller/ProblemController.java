package vn.edu.haui.code.modules.problem.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import vn.edu.haui.code.common.dto.ApiResponse;
import vn.edu.haui.code.common.dto.PageResponse;
import vn.edu.haui.code.modules.problem.dto.CreateProblemRequest;
import vn.edu.haui.code.modules.problem.dto.ProblemDetailDto;
import vn.edu.haui.code.modules.problem.dto.ProblemDto;
import vn.edu.haui.code.modules.problem.entity.Difficulty;
import vn.edu.haui.code.modules.problem.service.ProblemService;

@RestController
@RequestMapping("/api/v1/problems")
@RequiredArgsConstructor
@Tag(name = "2. Problem Management", description = "API Danh sách bài tập, Chi tiết đề bài & Tạo bài tập mới")
public class ProblemController {

    private final ProblemService problemService;

    @GetMapping
    @Operation(summary = "Lấy danh sách bài tập (có tìm kiếm, lọc độ khó, danh mục, phân trang)")
    public ResponseEntity<ApiResponse<PageResponse<ProblemDto>>> getProblems(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isPublished,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<ProblemDto> response = problemService.getProblems(
                categoryId, difficulty, keyword, isPublished, page, size
        );
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Lấy chi tiết đề bài theo slug (bao gồm testcase mẫu)")
    public ResponseEntity<ApiResponse<ProblemDetailDto>> getProblemBySlug(@PathVariable String slug) {
        ProblemDetailDto response = problemService.getProblemBySlug(slug);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/id/{id}")
    @Operation(summary = "Lấy chi tiết đề bài theo ID")
    public ResponseEntity<ApiResponse<ProblemDetailDto>> getProblemById(@PathVariable Long id) {
        ProblemDetailDto response = problemService.getProblemById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    @Operation(summary = "Tạo bài tập mới (Dành cho Giảng viên / Quản trị viên)")
    public ResponseEntity<ApiResponse<ProblemDetailDto>> createProblem(
            @Valid @RequestBody CreateProblemRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ProblemDetailDto response = problemService.createProblem(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Tạo bài tập mới thành công", response));
    }
}
