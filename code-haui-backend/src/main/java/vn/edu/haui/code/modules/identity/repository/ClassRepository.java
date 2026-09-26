package vn.edu.haui.code.modules.identity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.haui.code.modules.identity.entity.Clazz;

@Repository
public interface ClassRepository extends JpaRepository<Clazz, String> {
}
