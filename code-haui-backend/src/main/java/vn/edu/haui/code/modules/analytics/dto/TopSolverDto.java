package vn.edu.haui.code.modules.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopSolverDto {
    private Long studentId;
    private String studentCode;
    private String fullName;
    private String className;
    private String avatarUrl;
    private long solvedCount;
    private long totalSubmissions;
    private double passRate;
    private int totalPoints;
    private String rankTitle;
}
