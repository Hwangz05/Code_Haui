package vn.edu.haui.code.modules.identity.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.haui.code.common.dto.ApiResponse;
import vn.edu.haui.code.modules.identity.dto.UserDto;
import vn.edu.haui.code.modules.identity.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "1. Identity & Users", description = "API Quản lý Sinh viên, Giảng viên & Bảng xếp hạng")
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin người dùng theo ID")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        UserDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok(userDto));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Lấy thông tin người dùng theo Mã SV / Giảng viên")
    public ResponseEntity<ApiResponse<UserDto>> getUserByCode(@PathVariable String code) {
        UserDto userDto = userService.getUserByCode(code);
        return ResponseEntity.ok(ApiResponse.ok(userDto));
    }

    @GetMapping("/leaderboard")
    @Operation(summary = "Lấy bảng xếp hạng Top sinh viên điểm cao nhất")
    public ResponseEntity<ApiResponse<List<UserDto>>> getLeaderboard() {
        List<UserDto> leaderboard = userService.getLeaderboard();
        return ResponseEntity.ok(ApiResponse.ok(leaderboard));
    }
}
