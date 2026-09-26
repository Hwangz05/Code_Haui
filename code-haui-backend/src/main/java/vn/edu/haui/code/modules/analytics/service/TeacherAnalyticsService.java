package vn.edu.haui.code.modules.analytics.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.haui.code.modules.analytics.dto.AtRiskStudentDto;
import vn.edu.haui.code.modules.analytics.dto.TeacherKpiSummaryDto;
import vn.edu.haui.code.modules.analytics.dto.TopSolverDto;
import vn.edu.haui.code.modules.analytics.entity.UserDailyActivity;
import vn.edu.haui.code.modules.analytics.repository.UserDailyActivityRepository;
import vn.edu.haui.code.modules.identity.entity.Role;
import vn.edu.haui.code.modules.identity.entity.User;
import vn.edu.haui.code.modules.identity.repository.UserRepository;
import vn.edu.haui.code.modules.problem.entity.SubmissionStatus;
import vn.edu.haui.code.modules.problem.repository.SubmissionRepository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherAnalyticsService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final UserDailyActivityRepository activityRepository;

    @Transactional(readOnly = true)
    public TeacherKpiSummaryDto getKpiSummary(String classId) {
        List<User> students = getStudents(classId);
        long totalStudents = students.size();

        long activeStudents = students.stream()
                .filter(s -> s.getStreakDays() != null && s.getStreakDays() > 0)
                .count();

        long totalSubmissions = 0;
        long totalAc = 0;

        for (User student : students) {
            long subs = submissionRepository.findByUser_IdOrderByCreatedAtDesc(student.getId()).size();
            long ac = submissionRepository.countSolvedProblemsByUser(student.getId());
            totalSubmissions += subs;
            totalAc += ac;
        }

        double passRate = totalSubmissions > 0 ? (double) totalAc / totalSubmissions * 100 : 0.0;
        long atRiskCount = getAtRiskStudents(classId).size();

        return TeacherKpiSummaryDto.builder()
                .totalStudents(totalStudents)
                .activeStudents(activeStudents)
                .totalSubmissions(totalSubmissions)
                .overallPassRate(Math.round(passRate * 10.0) / 10.0)
                .atRiskCount(atRiskCount)
                .build();
    }

    @Transactional(readOnly = true)
    public List<TopSolverDto> getTopSolvers(String classId) {
        List<User> students = getStudents(classId);

        return students.stream()
                .map(student -> {
                    long totalSubs = submissionRepository.findByUser_IdOrderByCreatedAtDesc(student.getId()).size();
                    long solvedCount = submissionRepository.countSolvedProblemsByUser(student.getId());
                    double rate = totalSubs > 0 ? (double) solvedCount / totalSubs * 100 : 0.0;

                    return TopSolverDto.builder()
                            .studentId(student.getId())
                            .studentCode(student.getCode())
                            .fullName(student.getFullName())
                            .className(student.getClazz() != null ? student.getClazz().getName() : "Chưa phân lớp")
                            .avatarUrl(student.getAvatarUrl())
                            .solvedCount(solvedCount)
                            .totalSubmissions(totalSubs)
                            .passRate(Math.round(rate * 10.0) / 10.0)
                            .totalPoints(student.getTotalPoints())
                            .rankTitle(student.getRankTitle())
                            .build();
                })
                .sorted((a, b) -> Long.compare(b.getSolvedCount(), a.getSolvedCount()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AtRiskStudentDto> getAtRiskStudents(String classId) {
        List<User> students = getStudents(classId);
        List<AtRiskStudentDto> result = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (User student : students) {
            List<UserDailyActivity> activities = activityRepository.findByUser_IdOrderByActivityDateDesc(student.getId());
            int inactiveDays = 14;
            LocalDate lastActive = null;

            if (!activities.isEmpty()) {
                lastActive = activities.get(0).getActivityDate();
                inactiveDays = (int) ChronoUnit.DAYS.between(lastActive, today);
            }

            long totalSubs = submissionRepository.findByUser_IdOrderByCreatedAtDesc(student.getId()).size();

            // Detect risk
            if (inactiveDays >= 7 || (student.getStreakDays() != null && student.getStreakDays() == 0 && totalSubs < 5)) {
                String riskLevel = inactiveDays >= 14 ? "HIGH" : "MEDIUM";
                String reason = inactiveDays >= 14
                        ? "Không hoạt động quá 14 ngày, chưa nộp đủ bài tập tuần"
                        : "Không duy trì chuỗi học, tiến độ dưới 30%";

                result.add(AtRiskStudentDto.builder()
                        .studentId(student.getId())
                        .studentCode(student.getCode())
                        .fullName(student.getFullName())
                        .className(student.getClazz() != null ? student.getClazz().getName() : "Chưa phân lớp")
                        .email(student.getEmail())
                        .avatarUrl(student.getAvatarUrl())
                        .inactiveDays(Math.max(0, inactiveDays))
                        .totalSubmissions(totalSubs)
                        .completedCoursesCount(0)
                        .riskLevel(riskLevel)
                        .riskReason(reason)
                        .lastActiveDate(lastActive)
                        .build());
            }
        }

        return result;
    }

    private List<User> getStudents(String classId) {
        if (classId != null && !classId.isBlank()) {
            return userRepository.findByClazz_Id(classId).stream()
                    .filter(u -> u.getRole() == Role.STUDENT)
                    .collect(Collectors.toList());
        }
        return userRepository.findByRole(Role.STUDENT);
    }
}
