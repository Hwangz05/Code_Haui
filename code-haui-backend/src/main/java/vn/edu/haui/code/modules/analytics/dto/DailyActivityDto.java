package vn.edu.haui.code.modules.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.analytics.entity.UserDailyActivity;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyActivityDto {
    private Long id;
    private LocalDate activityDate;
    private Integer studySeconds;
    private Integer submissionsCount;
    private Integer lessonsCompleted;
    private Boolean isActive;

    public static DailyActivityDto fromEntity(UserDailyActivity activity) {
        if (activity == null) return null;
        return DailyActivityDto.builder()
                .id(activity.getId())
                .activityDate(activity.getActivityDate())
                .studySeconds(activity.getStudySeconds())
                .submissionsCount(activity.getSubmissionsCount())
                .lessonsCompleted(activity.getLessonsCompleted())
                .isActive(activity.getIsActive())
                .build();
    }
}
