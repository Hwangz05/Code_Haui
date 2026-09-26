package vn.edu.haui.code.modules.problem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.problem.entity.Submission;
import vn.edu.haui.code.modules.problem.entity.SubmissionStatus;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDto {
    private Long id;
    private Long problemId;
    private String problemTitle;
    private String problemSlug;
    private Long userId;
    private String userCode;
    private String userFullName;
    private String language;
    private SubmissionStatus status;
    private Integer runtimeMs;
    private Integer memoryUsedKb;
    private Integer scoreEarned;
    private String sourceCode;
    private LocalDateTime createdAt;

    public static SubmissionDto fromEntity(Submission submission) {
        if (submission == null) return null;
        return SubmissionDto.builder()
                .id(submission.getId())
                .problemId(submission.getProblem().getId())
                .problemTitle(submission.getProblem().getTitle())
                .problemSlug(submission.getProblem().getSlug())
                .userId(submission.getUser().getId())
                .userCode(submission.getUser().getCode())
                .userFullName(submission.getUser().getFullName())
                .language(submission.getLanguage())
                .status(submission.getStatus())
                .runtimeMs(submission.getRuntimeMs())
                .memoryUsedKb(submission.getMemoryUsedKb())
                .scoreEarned(submission.getScoreEarned())
                .sourceCode(submission.getSourceCode())
                .createdAt(submission.getCreatedAt())
                .build();
    }
}
