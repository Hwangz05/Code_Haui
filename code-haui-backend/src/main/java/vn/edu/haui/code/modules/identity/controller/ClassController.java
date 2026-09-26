package vn.edu.haui.code.modules.identity.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.haui.code.common.dto.ApiResponse;
import vn.edu.haui.code.modules.identity.dto.ClassDto;
import vn.edu.haui.code.modules.identity.dto.UserDto;
import vn.edu.haui.code.modules.identity.service.ClassService;
import vn.edu.haui.code.modules.identity.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/classes")
@RequiredArgsConstructor
@Tag(name = "1. Identity & Classes", description = "API Quản lý Lớp học phần HaUI")
public class ClassController {

    private final ClassService classService;
    private final UserService userService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả các lớp học phần")
    public ResponseEntity<ApiResponse<List<ClassDto>>> getAllClasses() {
        List<ClassDto> classes = classService.getAllClasses();
        return ResponseEntity.ok(ApiResponse.ok(classes));
    }

    @GetMapping("/{classId}")
    @Operation(summary = "Lấy thông tin chi tiết một lớp học phần")
    public ResponseEntity<ApiResponse<ClassDto>> getClassById(@PathVariable String classId) {
        ClassDto classDto = classService.getClassById(classId);
        return ResponseEntity.ok(ApiResponse.ok(classDto));
    }

    @GetMapping("/{classId}/students")
    @Operation(summary = "Lấy danh sách sinh viên thuộc lớp học phần")
    public ResponseEntity<ApiResponse<List<UserDto>>> getStudentsByClass(@PathVariable String classId) {
        List<UserDto> students = userService.getStudentsByClass(classId);
        return ResponseEntity.ok(ApiResponse.ok(students));
    }
}
