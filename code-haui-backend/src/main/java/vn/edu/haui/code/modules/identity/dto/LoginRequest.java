package vn.edu.haui.code.modules.identity.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Mã sinh viên hoặc email không được để trống")
    private String code;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
}
