package vn.edu.haui.code.modules.course.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.course.entity.Lesson;
import vn.edu.haui.code.modules.course.entity.LessonType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDto {
    private Long id;
    private Long sectionId;
    private String title;
    private LessonType type;
    private Long problemId;
    private String problemSlug;
    private Integer orderIndex;
    private Boolean isCompleted;

    public static LessonDto fromEntity(Lesson lesson, Boolean isCompleted) {
        if (lesson == null) return null;
        return LessonDto.builder()
                .id(lesson.getId())
                .sectionId(lesson.getSection() != null ? lesson.getSection().getId() : null)
                .title(lesson.getTitle())
                .type(lesson.getType())
                .problemId(lesson.getProblem() != null ? lesson.getProblem().getId() : null)
                .problemSlug(lesson.getProblem() != null ? lesson.getProblem().getSlug() : null)
                .orderIndex(lesson.getOrderIndex())
                .isCompleted(Boolean.TRUE.equals(isCompleted))
                .build();
    }
}
