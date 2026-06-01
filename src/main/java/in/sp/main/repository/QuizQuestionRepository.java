package in.sp.main.repository;

import in.sp.main.entity.QuizQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {
    List<QuizQuestion> findByQuizDate(LocalDate quizDate);
    boolean existsByQuizDate(LocalDate quizDate);
}
