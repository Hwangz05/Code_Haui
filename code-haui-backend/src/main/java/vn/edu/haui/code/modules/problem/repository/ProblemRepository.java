package vn.edu.haui.code.modules.problem.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.edu.haui.code.modules.problem.entity.Difficulty;
import vn.edu.haui.code.modules.problem.entity.Problem;

import java.util.Optional;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    Optional<Problem> findBySlug(String slug);

    boolean existsBySlug(String slug);

    @Query("SELECT p FROM Problem p WHERE " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:difficulty IS NULL OR p.difficulty = :difficulty) AND " +
           "(:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:isPublished IS NULL OR p.isPublished = :isPublished)")
    Page<Problem> searchProblems(
            @Param("categoryId") Integer categoryId,
            @Param("difficulty") Difficulty difficulty,
            @Param("keyword") String keyword,
            @Param("isPublished") Boolean isPublished,
            Pageable pageable
    );
}
