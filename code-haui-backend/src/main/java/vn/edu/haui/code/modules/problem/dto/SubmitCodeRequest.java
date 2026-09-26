package vn.edu.haui.code.modules.problem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitCodeRequest {

    @NotNull(message = "ID bài tập không được để trống")
    private Long problemId;

    @NotBlank(message = "Mã nguồn nộp không được để trống")
    private String sourceCode;

    @NotBlank(message = "Ngôn ngữ lập trình không được để trống")
    private String language; // JAVA, CPP, PYTHON, CSHARP
}
