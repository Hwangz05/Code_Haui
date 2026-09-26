package vn.edu.haui.code.modules.identity.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.edu.haui.code.common.entity.BaseEntity;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", length = 50, nullable = false, unique = true)
    private String code; // 2021600123 or GV2026

    @Column(name = "full_name", length = 100, nullable = false)
    private String fullName;

    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", length = 255, nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @Builder.Default
    private Role role = Role.STUDENT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private Clazz clazz;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;

    @Column(name = "total_points", nullable = false)
    @Builder.Default
    private Integer totalPoints = 0;

    @Column(name = "rank_title", length = 50, nullable = false)
    @Builder.Default
    private String rankTitle = "Newbie";

    @Column(name = "streak_days", nullable = false)
    @Builder.Default
    private Integer streakDays = 0;
}
