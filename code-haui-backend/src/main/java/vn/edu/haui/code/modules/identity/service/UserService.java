package vn.edu.haui.code.modules.identity.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.haui.code.common.exception.AppException;
import vn.edu.haui.code.common.exception.ErrorCode;
import vn.edu.haui.code.modules.analytics.entity.UserDailyActivity;
import vn.edu.haui.code.modules.analytics.repository.UserDailyActivityRepository;
import vn.edu.haui.code.modules.identity.dto.UserDto;
import vn.edu.haui.code.modules.identity.entity.Role;
import vn.edu.haui.code.modules.identity.entity.User;
import vn.edu.haui.code.modules.identity.repository.UserRepository;
import vn.edu.haui.code.modules.problem.repository.SubmissionRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final UserDailyActivityRepository activityRepository;

    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return enrichUserDto(user);
    }

    @Transactional(readOnly = true)
    public UserDto getUserByCode(String code) {
        User user = userRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return enrichUserDto(user);
    }

    @Transactional(readOnly = true)
    public List<UserDto> getStudentsByClass(String classId) {
        return userRepository.findByClazz_Id(classId).stream()
                .filter(u -> u.getRole() == Role.STUDENT)
                .map(this::enrichUserDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserDto> getLeaderboard() {
        return userRepository.findTop10ByRoleOrderByTotalPointsDesc(Role.STUDENT).stream()
                .map(this::enrichUserDto)
                .collect(Collectors.toList());
    }

    private UserDto enrichUserDto(User user) {
        UserDto dto = UserDto.fromEntity(user);
        if (user == null) return dto;

        long solved = submissionRepository.countSolvedProblemsByUser(user.getId());
        long totalSubs = submissionRepository.findByUser_IdOrderByCreatedAtDesc(user.getId()).size();

        List<UserDailyActivity> activities = activityRepository.findByUser_IdOrderByActivityDateDesc(user.getId());
        long totalStudySeconds = activities.stream()
                .mapToLong(a -> a.getStudySeconds() != null ? a.getStudySeconds() : 0)
                .sum();

        double studyHours = totalStudySeconds > 0
                ? Math.round((totalStudySeconds / 3600.0) * 10.0) / 10.0
                : (user.getStreakDays() != null && user.getStreakDays() > 0 ? user.getStreakDays() * 1.5 : 0.0);

        double passRate = totalSubs > 0 ? (double) solved / totalSubs * 100 : 0.0;

        int streak = user.getStreakDays() != null ? user.getStreakDays() : 0;
        String status = (streak == 0) ? "DANGER" : (streak <= 3 ? "WARNING" : "GOOD");

        dto.setSolvedProblems(solved);
        dto.setTotalSubmissions(totalSubs);
        dto.setStudyHours(studyHours);
        dto.setPassRate(Math.round(passRate * 10.0) / 10.0);
        dto.setStatus(status);
        return dto;
    }
}
