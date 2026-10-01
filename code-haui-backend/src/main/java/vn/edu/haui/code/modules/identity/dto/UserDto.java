package vn.edu.haui.code.modules.identity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.identity.entity.Role;
import vn.edu.haui.code.modules.identity.entity.User;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String code;
    private String fullName;
    private String email;
    private Role role;
    private String classId;
    private String className;
    private String department;
    private String avatarUrl;
    private Integer totalPoints;
    private String rankTitle;
    private Integer streakDays;
    private Long solvedProblems;
    private Long totalSubmissions;
    private Double studyHours;
    private Double passRate;
    private String status;

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .code(user.getCode())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .classId(user.getClazz() != null ? user.getClazz().getId() : null)
                .className(user.getClazz() != null ? user.getClazz().getName() : null)
                .department(user.getDepartment())
                .avatarUrl(user.getAvatarUrl())
                .totalPoints(user.getTotalPoints())
                .rankTitle(user.getRankTitle())
                .streakDays(user.getStreakDays())
                .build();
    }
}
