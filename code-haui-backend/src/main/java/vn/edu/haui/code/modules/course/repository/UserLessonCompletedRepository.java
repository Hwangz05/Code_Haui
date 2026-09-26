package vn.edu.haui.code.modules.course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.haui.code.modules.course.entity.UserLessonCompleted;
import vn.edu.haui.code.modules.course.entity.UserLessonCompletedId;

import java.util.List;
import java.util.Set;

@Repository
public interface UserLessonCompletedRepository extends JpaRepository<UserLessonCompleted, UserLessonCompletedId> {
    List<UserLessonCompleted> findByUser_Id(Long userId);
    List<UserLessonCompleted> findByUser_IdAndLesson_Section_Course_Id(Long userId, Long courseId);
    boolean existsByUser_IdAndLesson_Id(Long userId, Long lessonId);
}
