package vn.edu.haui.code.modules.course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.haui.code.modules.course.entity.UserCourseProgress;
import vn.edu.haui.code.modules.course.entity.UserCourseProgressId;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCourseProgressRepository extends JpaRepository<UserCourseProgress, UserCourseProgressId> {
    Optional<UserCourseProgress> findByUser_IdAndCourse_Id(Long userId, Long courseId);
    List<UserCourseProgress> findByUser_Id(Long userId);
}
