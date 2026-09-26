package vn.edu.haui.code.modules.course.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.course.entity.CourseSection;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectionDto {
    private Long id;
    private String title;
    private Integer orderIndex;
    private List<LessonDto> lessons;

    public static SectionDto fromEntity(CourseSection section, Set<Long> completedLessonIds) {
        if (section == null) return null;
        List<LessonDto> lessonDtos = section.getLessons() != null
                ? section.getLessons().stream()
                .map(l -> LessonDto.fromEntity(l, completedLessonIds != null && completedLessonIds.contains(l.getId())))
                .collect(Collectors.toList())
                : List.of();

        return SectionDto.builder()
                .id(section.getId())
                .title(section.getTitle())
                .orderIndex(section.getOrderIndex())
                .lessons(lessonDtos)
                .build();
    }
}
