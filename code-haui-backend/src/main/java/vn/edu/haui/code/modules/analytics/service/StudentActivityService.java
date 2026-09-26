package vn.edu.haui.code.modules.analytics.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.haui.code.common.exception.AppException;
import vn.edu.haui.code.common.exception.ErrorCode;
import vn.edu.haui.code.modules.analytics.dto.DailyActivityDto;
import vn.edu.haui.code.modules.analytics.entity.UserDailyActivity;
import vn.edu.haui.code.modules.analytics.repository.UserDailyActivityRepository;
import vn.edu.haui.code.modules.identity.entity.User;
import vn.edu.haui.code.modules.identity.repository.UserRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentActivityService {

    private final UserDailyActivityRepository activityRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<DailyActivityDto> getRecentActivities(String userCode, int days) {
        User user = userRepository.findByCode(userCode)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);

        return activityRepository.findByUser_IdAndActivityDateBetweenOrderByActivityDateAsc(
                user.getId(), startDate, endDate
        ).stream().map(DailyActivityDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DailyActivityDto> getStudentActivitiesById(Long studentId, int days) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);

        return activityRepository.findByUser_IdAndActivityDateBetweenOrderByActivityDateAsc(
                studentId, startDate, endDate
        ).stream().map(DailyActivityDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public void recordHeartbeat(String userCode, int additionalSeconds) {
        User user = userRepository.findByCode(userCode).orElse(null);
        if (user == null) return;

        LocalDate today = LocalDate.now();
        UserDailyActivity activity = activityRepository.findByUser_IdAndActivityDate(user.getId(), today)
                .orElseGet(() -> UserDailyActivity.builder()
                        .user(user)
                        .activityDate(today)
                        .studySeconds(0)
                        .submissionsCount(0)
                        .lessonsCompleted(0)
                        .isActive(true)
                        .build());

        activity.setStudySeconds(activity.getStudySeconds() + additionalSeconds);
        activityRepository.save(activity);
    }
}
