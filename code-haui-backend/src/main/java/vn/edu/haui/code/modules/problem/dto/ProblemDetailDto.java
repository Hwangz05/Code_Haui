package vn.edu.haui.code.modules.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.problem.entity.Difficulty;
import vn.edu.haui.code.modules.problem.entity.Problem;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemDetailDto {
    private Long id;
    private String slug;
    private String title;
    private CategoryDto category;
    private Difficulty difficulty;
    private Integer points;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private String statementMd;
    private String authorName;
    private Boolean isPublished;
    private List<TestcaseDto> sampleTestcases;
    private LocalDateTime createdAt;

    public static ProblemDetailDto fromEntity(Problem problem) {
        if (problem == null) return null;
        List<TestcaseDto> sampleTests = problem.getTestcases() != null
                ? problem.getTestcases().stream()
                .filter(t -> Boolean.TRUE.equals(t.getIsSample()))
                .map(TestcaseDto::fromEntity)
                .collect(Collectors.toList())
                : List.of();

        return ProblemDetailDto.builder()
                .id(problem.getId())
                .slug(problem.getSlug())
                .title(problem.getTitle())
                .category(CategoryDto.fromEntity(problem.getCategory()))
                .difficulty(problem.getDifficulty())
                .points(problem.getPoints())
                .timeLimitMs(problem.getTimeLimitMs())
                .memoryLimitMb(problem.getMemoryLimitMb())
                .statementMd(problem.getStatementMd())
                .authorName(problem.getAuthor() != null ? problem.getAuthor().getFullName() : "HaUI Code")
                .isPublished(problem.getIsPublished())
                .sampleTestcases(sampleTests)
                .createdAt(problem.getCreatedAt())
                .build();
    }
}
