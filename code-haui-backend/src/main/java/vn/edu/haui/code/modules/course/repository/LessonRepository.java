package vn.edu.haui.code.modules.course.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.haui.code.modules.course.entity.Lesson;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findBySection_IdOrderByOrderIndexAsc(Long sectionId);
    long countBySection_Course_Id(Long courseId);
}
