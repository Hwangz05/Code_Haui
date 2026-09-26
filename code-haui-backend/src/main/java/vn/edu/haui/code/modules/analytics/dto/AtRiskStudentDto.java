package vn.edu.haui.code.modules.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtRiskStudentDto {
    private Long studentId;
    private String studentCode;
    private String fullName;
    private String className;
    private String email;
    private String avatarUrl;
    private int inactiveDays;
    private long totalSubmissions;
    private int completedCoursesCount;
    private String riskLevel; // HIGH, MEDIUM, LOW
    private String riskReason;
    private LocalDate lastActiveDate;
}
