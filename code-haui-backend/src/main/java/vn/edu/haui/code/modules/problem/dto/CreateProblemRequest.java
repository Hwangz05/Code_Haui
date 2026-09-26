package vn.edu.haui.code.modules.problem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.problem.entity.Difficulty;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProblemRequest {

    @NotBlank(message = "Tiêu đề bài tập không được để trống")
    private String title;

    private String slug;

    @NotNull(message = "Danh mục không được để trống")
    private Integer categoryId;

    @NotNull(message = "Độ khó không được để trống")
    private Difficulty difficulty;

    @Builder.Default
    private Integer points = 100;

    @Builder.Default
    private Integer timeLimitMs = 1000;

    @Builder.Default
    private Integer memoryLimitMb = 256;

    @NotBlank(message = "Đề bài Markdown không được để trống")
    private String statementMd;

    private List<TestcaseRequest> testcases;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestcaseRequest {
        private String inputData;
        private String expectedOutput;
        private Boolean isSample;
    }
}
