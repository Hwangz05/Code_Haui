package vn.edu.haui.code.modules.course.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.edu.haui.code.modules.identity.entity.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_course_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCourseProgress {

    @EmbeddedId
    private UserCourseProgressId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("courseId")
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(name = "completed_lessons_count", nullable = false)
    @Builder.Default
    private Integer completedLessonsCount = 0;

    @Column(name = "progress_percent", precision = 5, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal progressPercent = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "enrolled_at", updatable = false)
    private LocalDateTime enrolledAt;

    @UpdateTimestamp
    @Column(name = "last_activity_at")
    private LocalDateTime lastActivityAt;
}
