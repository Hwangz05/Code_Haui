package vn.edu.haui.code.modules.course.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.course.entity.UserCourseProgress;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseProgressDto {
    private Long courseId;
    private String courseTitle;
    private Integer completedLessonsCount;
    private BigDecimal progressPercent;
    private LocalDateTime enrolledAt;
    private LocalDateTime lastActivityAt;

    public static CourseProgressDto fromEntity(UserCourseProgress progress) {
        if (progress == null) return null;
        return CourseProgressDto.builder()
                .courseId(progress.getCourse().getId())
                .courseTitle(progress.getCourse().getTitle())
                .completedLessonsCount(progress.getCompletedLessonsCount())
                .progressPercent(progress.getProgressPercent())
                .enrolledAt(progress.getEnrolledAt())
                .lastActivityAt(progress.getLastActivityAt())
                .build();
    }
}
