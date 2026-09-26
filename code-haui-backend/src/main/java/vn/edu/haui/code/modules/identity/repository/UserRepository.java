package vn.edu.haui.code.modules.identity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.haui.code.modules.identity.entity.Role;
import vn.edu.haui.code.modules.identity.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByCode(String code);

    Optional<User> findByEmail(String email);

    boolean existsByCode(String code);

    boolean existsByEmail(String email);

    List<User> findByClazz_Id(String classId);

    List<User> findByRole(Role role);

    List<User> findTop10ByRoleOrderByTotalPointsDesc(Role role);


}
