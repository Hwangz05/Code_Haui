package vn.edu.haui.code.modules.course.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.course.entity.Lesson;
import vn.edu.haui.code.modules.course.entity.LessonType;
import vn.edu.haui.code.modules.problem.dto.ProblemDetailDto;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDetailDto {
    private Long id;
    private Long sectionId;
    private String sectionTitle;
    private Long courseId;
    private String courseTitle;
    private String title;
    private LessonType type;
    private String contentMd;
    private String initialCode;
    private Long problemId;
    private ProblemDetailDto problem;
    private Integer orderIndex;
    private Boolean isCompleted;

    public static LessonDetailDto fromEntity(Lesson lesson, Boolean isCompleted) {
        if (lesson == null) return null;
        return LessonDetailDto.builder()
                .id(lesson.getId())
                .sectionId(lesson.getSection() != null ? lesson.getSection().getId() : null)
                .sectionTitle(lesson.getSection() != null ? lesson.getSection().getTitle() : null)
                .courseId(lesson.getSection() != null && lesson.getSection().getCourse() != null ? lesson.getSection().getCourse().getId() : null)
                .courseTitle(lesson.getSection() != null && lesson.getSection().getCourse() != null ? lesson.getSection().getCourse().getTitle() : null)
                .title(lesson.getTitle())
                .type(lesson.getType())
                .contentMd(lesson.getContentMd())
                .initialCode(lesson.getInitialCode())
                .problemId(lesson.getProblem() != null ? lesson.getProblem().getId() : null)
                .problem(lesson.getProblem() != null ? ProblemDetailDto.fromEntity(lesson.getProblem()) : null)
                .orderIndex(lesson.getOrderIndex())
                .isCompleted(Boolean.TRUE.equals(isCompleted))
                .build();
    }
}
