package vn.edu.haui.code.modules.problem.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.edu.haui.code.modules.problem.entity.Submission;
import vn.edu.haui.code.modules.problem.entity.SubmissionStatus;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByUser_IdOrderByCreatedAtDesc(Long userId);

    Page<Submission> findByUser_Id(Long userId, Pageable pageable);

    List<Submission> findByProblem_IdOrderByCreatedAtDesc(Long problemId);

    long countByProblem_Id(Long problemId);

    long countByProblem_IdAndStatus(Long problemId, SubmissionStatus status);

    boolean existsByUser_IdAndProblem_IdAndStatus(Long userId, Long problemId, SubmissionStatus status);

    @Query("SELECT COUNT(DISTINCT s.problem.id) FROM Submission s WHERE s.user.id = :userId AND s.status = 'AC'")
    long countSolvedProblemsByUser(@Param("userId") Long userId);
}
