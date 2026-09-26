package vn.edu.haui.code.modules.identity.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clazz {

    @Id
    @Column(name = "id", length = 50, nullable = false)
    private String id; // DHKTPM16A, DHTH15...

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "faculty", length = 100, nullable = false)
    @Builder.Default
    private String faculty = "Khoa CNTT";

    @Column(name = "academic_year", length = 20)
    @Builder.Default
    private String academicYear = "2022-2026";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
