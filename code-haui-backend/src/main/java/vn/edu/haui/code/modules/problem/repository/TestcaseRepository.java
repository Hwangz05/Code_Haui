package vn.edu.haui.code.modules.problem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.haui.code.modules.problem.entity.Testcase;

import java.util.List;

@Repository
public interface TestcaseRepository extends JpaRepository<Testcase, Long> {
    List<Testcase> findByProblem_IdOrderByOrderIndexAsc(Long problemId);
}
