package vn.edu.haui.code.modules.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.problem.entity.Difficulty;
import vn.edu.haui.code.modules.problem.entity.Problem;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemDto {
    private Long id;
    private String slug;
    private String title;
    private Integer categoryId;
    private String categoryName;
    private Difficulty difficulty;
    private Integer points;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private String authorName;
    private Boolean isPublished;
    private Long totalSubmissions;
    private Long acceptedSubmissions;
    private Double acceptanceRate;
    private LocalDateTime createdAt;

    public static ProblemDto fromEntity(Problem problem) {
        if (problem == null) return null;
        return ProblemDto.builder()
                .id(problem.getId())
                .slug(problem.getSlug())
                .title(problem.getTitle())
                .categoryId(problem.getCategory() != null ? problem.getCategory().getId() : null)
                .categoryName(problem.getCategory() != null ? problem.getCategory().getName() : null)
                .difficulty(problem.getDifficulty())
                .points(problem.getPoints())
                .timeLimitMs(problem.getTimeLimitMs())
                .memoryLimitMb(problem.getMemoryLimitMb())
                .authorName(problem.getAuthor() != null ? problem.getAuthor().getFullName() : "HaUI Code")
                .isPublished(problem.getIsPublished())
                .createdAt(problem.getCreatedAt())
                .build();
    }
}
