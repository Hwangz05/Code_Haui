package vn.edu.haui.code.modules.course.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.haui.code.modules.course.entity.Course;
import vn.edu.haui.code.modules.course.entity.CourseLevel;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDto {
    private Long id;
    private String slug;
    private String title;
    private String description;
    private CourseLevel level;
    private String instructorName;
    private String imageUrl;
    private Boolean isPublished;
    private int totalLessons;
    private LocalDateTime createdAt;

    public static CourseDto fromEntity(Course course) {
        if (course == null) return null;
        int total = course.getSections() != null
                ? course.getSections().stream().mapToInt(s -> s.getLessons() != null ? s.getLessons().size() : 0).sum()
                : 0;

        return CourseDto.builder()
                .id(course.getId())
                .slug(course.getSlug())
                .title(course.getTitle())
                .description(course.getDescription())
                .level(course.getLevel())
                .instructorName(course.getInstructor() != null ? course.getInstructor().getFullName() : "Khoa CNTT HaUI")
                .imageUrl(course.getImageUrl())
                .isPublished(course.getIsPublished())
                .totalLessons(total)
                .createdAt(course.getCreatedAt())
                .build();
    }
}
