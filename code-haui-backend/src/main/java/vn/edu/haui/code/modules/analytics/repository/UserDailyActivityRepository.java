package vn.edu.haui.code.modules.analytics.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.haui.code.modules.analytics.entity.UserDailyActivity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserDailyActivityRepository extends JpaRepository<UserDailyActivity, Long> {

    List<UserDailyActivity> findByUser_IdAndActivityDateBetweenOrderByActivityDateAsc(
            Long userId, LocalDate startDate, LocalDate endDate
    );

    List<UserDailyActivity> findByUser_IdOrderByActivityDateDesc(Long userId);

    Optional<UserDailyActivity> findByUser_IdAndActivityDate(Long userId, LocalDate date);
}
