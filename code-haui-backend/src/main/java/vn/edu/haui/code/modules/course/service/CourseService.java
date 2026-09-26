package vn.edu.haui.code.modules.course.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.haui.code.common.exception.AppException;
import vn.edu.haui.code.common.exception.ErrorCode;
import vn.edu.haui.code.modules.course.dto.CourseDetailDto;
import vn.edu.haui.code.modules.course.dto.CourseDto;
import vn.edu.haui.code.modules.course.dto.CourseProgressDto;
import vn.edu.haui.code.modules.course.entity.Course;
import vn.edu.haui.code.modules.course.entity.UserCourseProgress;
import vn.edu.haui.code.modules.course.entity.UserLessonCompleted;
import vn.edu.haui.code.modules.course.repository.CourseRepository;
import vn.edu.haui.code.modules.course.repository.UserCourseProgressRepository;
import vn.edu.haui.code.modules.course.repository.UserLessonCompletedRepository;
import vn.edu.haui.code.modules.identity.entity.User;
import vn.edu.haui.code.modules.identity.repository.UserRepository;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserCourseProgressRepository userCourseProgressRepository;
    private final UserLessonCompletedRepository userLessonCompletedRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CourseDto> getAllPublishedCourses() {
        return courseRepository.findByIsPublishedTrueOrderByCreatedAtDesc().stream()
                .map(CourseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseDetailDto getCourseDetail(String slug, String userCode) {
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOT_FOUND));

        Set<Long> completedLessonIds = Collections.emptySet();
        BigDecimal progressPercent = BigDecimal.ZERO;

        if (userCode != null) {
            User user = userRepository.findByCode(userCode).orElse(null);
            if (user != null) {
                completedLessonIds = userLessonCompletedRepository
                        .findByUser_IdAndLesson_Section_Course_Id(user.getId(), course.getId()).stream()
                        .map(ulc -> ulc.getLesson().getId())
                        .collect(Collectors.toSet());

                UserCourseProgress progress = userCourseProgressRepository
                        .findByUser_IdAndCourse_Id(user.getId(), course.getId())
                        .orElse(null);

                if (progress != null) {
                    progressPercent = progress.getProgressPercent();
                }
            }
        }

        return CourseDetailDto.fromEntity(course, completedLessonIds, progressPercent);
    }

    @Transactional(readOnly = true)
    public List<CourseProgressDto> getUserCoursesProgress(String userCode) {
        User user = userRepository.findByCode(userCode)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userCourseProgressRepository.findByUser_Id(user.getId()).stream()
                .map(CourseProgressDto::fromEntity)
                .collect(Collectors.toList());
    }
}
