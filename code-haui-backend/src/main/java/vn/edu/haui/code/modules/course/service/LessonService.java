package vn.edu.haui.code.modules.course.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.haui.code.common.exception.AppException;
import vn.edu.haui.code.common.exception.ErrorCode;
import vn.edu.haui.code.modules.course.dto.LessonDetailDto;
import vn.edu.haui.code.modules.course.entity.*;
import vn.edu.haui.code.modules.course.repository.CourseRepository;
import vn.edu.haui.code.modules.course.repository.LessonRepository;
import vn.edu.haui.code.modules.course.repository.UserCourseProgressRepository;
import vn.edu.haui.code.modules.course.repository.UserLessonCompletedRepository;
import vn.edu.haui.code.modules.identity.entity.User;
import vn.edu.haui.code.modules.identity.repository.UserRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final UserLessonCompletedRepository userLessonCompletedRepository;
    private final UserCourseProgressRepository userCourseProgressRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public LessonDetailDto getLessonDetail(Long lessonId, String userCode) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));

        boolean isCompleted = false;
        if (userCode != null) {
            User user = userRepository.findByCode(userCode).orElse(null);
            if (user != null) {
                isCompleted = userLessonCompletedRepository.existsByUser_IdAndLesson_Id(user.getId(), lesson.getId());
            }
        }

        return LessonDetailDto.fromEntity(lesson, isCompleted);
    }

    @Transactional
    public void markLessonCompleted(Long lessonId, String userCode) {
        User user = userRepository.findByCode(userCode)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new AppException(ErrorCode.LESSON_NOT_FOUND));

        Course course = lesson.getSection().getCourse();

        // 1. Mark lesson as completed if not done yet
        if (!userLessonCompletedRepository.existsByUser_IdAndLesson_Id(user.getId(), lesson.getId())) {
            UserLessonCompleted completed = UserLessonCompleted.builder()
                    .id(new UserLessonCompletedId(user.getId(), lesson.getId()))
                    .user(user)
                    .lesson(lesson)
                    .build();
            userLessonCompletedRepository.save(completed);
        }

        // 2. Update or Create Course Progress
        long completedCount = userLessonCompletedRepository
                .findByUser_IdAndLesson_Section_Course_Id(user.getId(), course.getId()).size();
        long totalLessons = lessonRepository.countBySection_Course_Id(course.getId());

        BigDecimal progressPercent = BigDecimal.ZERO;
        if (totalLessons > 0) {
            progressPercent = BigDecimal.valueOf(completedCount)
                    .divide(BigDecimal.valueOf(totalLessons), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        UserCourseProgressId progressId = new UserCourseProgressId(user.getId(), course.getId());
        UserCourseProgress progress = userCourseProgressRepository.findById(progressId)
                .orElseGet(() -> UserCourseProgress.builder()
                        .id(progressId)
                        .user(user)
                        .course(course)
                        .build());

        progress.setCompletedLessonsCount((int) completedCount);
        progress.setProgressPercent(progressPercent);
        userCourseProgressRepository.save(progress);
    }
}
