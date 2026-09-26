package vn.edu.haui.code.modules.course.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.course.entity.Course;
import vn.edu.haui.code.modules.course.entity.CourseLevel;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDetailDto {
    private Long id;
    private String slug;
    private String title;
    private String description;
    private CourseLevel level;
    private String instructorName;
    private String imageUrl;
    private Boolean isPublished;
    private int totalLessons;
    private int completedLessons;
    private BigDecimal progressPercent;
    private List<SectionDto> sections;
    private LocalDateTime createdAt;

    public static CourseDetailDto fromEntity(Course course, Set<Long> completedLessonIds, BigDecimal progressPercent) {
        if (course == null) return null;
        List<SectionDto> sectionDtos = course.getSections() != null
                ? course.getSections().stream()
                .map(s -> SectionDto.fromEntity(s, completedLessonIds))
                .collect(Collectors.toList())
                : List.of();

        int total = sectionDtos.stream().mapToInt(s -> s.getLessons() != null ? s.getLessons().size() : 0).sum();
        int completed = completedLessonIds != null ? completedLessonIds.size() : 0;

        return CourseDetailDto.builder()
                .id(course.getId())
                .slug(course.getSlug())
                .title(course.getTitle())
                .description(course.getDescription())
                .level(course.getLevel())
                .instructorName(course.getInstructor() != null ? course.getInstructor().getFullName() : "Khoa CNTT HaUI")
                .imageUrl(course.getImageUrl())
                .isPublished(course.getIsPublished())
                .totalLessons(total)
                .completedLessons(completed)
                .progressPercent(progressPercent != null ? progressPercent : BigDecimal.ZERO)
                .sections(sectionDtos)
                .createdAt(course.getCreatedAt())
                .build();
    }
}
