package vn.edu.haui.code.modules.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherKpiSummaryDto {
    private long totalStudents;
    private long activeStudents;
    private long totalSubmissions;
    private double overallPassRate;
    private long atRiskCount;
}
