package in.sp.main.repository;

import in.sp.main.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserIdOrderBySubmittedAtDesc(Long userId);
    List<QuizAttempt> findBySubmittedAtAfter(LocalDateTime dateTime);
}
