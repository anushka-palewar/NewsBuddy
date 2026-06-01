package in.sp.main.scheduler;

import in.sp.main.services.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class QuizScheduler {

    @Autowired
    private QuizService quizService;

    // Runs every day at 12:05 AM
    @Scheduled(cron = "0 5 0 * * *")
    public void generateDailyQuiz() {
        System.out.println("Scheduler running: Generating Daily AI Quiz Questions...");
        quizService.generateDailyQuizQuestions();
    }
}
