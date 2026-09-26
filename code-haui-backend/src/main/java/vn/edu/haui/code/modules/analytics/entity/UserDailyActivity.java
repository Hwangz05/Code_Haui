package vn.edu.haui.code.modules.analytics.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.edu.haui.code.modules.identity.entity.User;

import java.time.LocalDate;

@Entity
@Table(name = "user_daily_activity", uniqueConstraints = {
        @UniqueConstraint(name = "uq_user_date", columnNames = {"user_id", "activity_date"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDailyActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(name = "study_seconds", nullable = false)
    @Builder.Default
    private Integer studySeconds = 0;

    @Column(name = "submissions_count", nullable = false)
    @Builder.Default
    private Integer submissionsCount = 0;

    @Column(name = "lessons_completed", nullable = false)
    @Builder.Default
    private Integer lessonsCompleted = 0;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
