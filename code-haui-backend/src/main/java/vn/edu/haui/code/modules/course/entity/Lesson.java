package vn.edu.haui.code.modules.course.entity;

import jakarta.persistence.*;
import lombok.*;
import vn.edu.haui.code.modules.problem.entity.Problem;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private CourseSection section;

    @Column(name = "title", length = 255, nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    @Builder.Default
    private LessonType type = LessonType.THEORY;

    @Column(name = "content_md", columnDefinition = "LONGTEXT")
    private String contentMd;

    @Column(name = "initial_code", columnDefinition = "TEXT")
    private String initialCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id")
    private Problem problem;

    @Column(name = "order_index", nullable = false)
    @Builder.Default
    private Integer orderIndex = 1;
}
