package in.sp.main.controllers;

import in.sp.main.entity.QuizAttempt;
import in.sp.main.entity.QuizQuestion;
import in.sp.main.entity.User;
import in.sp.main.services.QuizService;
import in.sp.main.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin("*")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private UserService userService;

    @GetMapping("/today")
    public ResponseEntity<List<QuizQuestion>> getTodayQuiz() {
        return ResponseEntity.ok(quizService.getTodayQuizQuestions());
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitQuiz(@RequestBody Map<String, Map<String, String>> request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found or authenticated.");
        }

        Map<String, String> answers = request.get("answers");
        if (answers == null) {
            return ResponseEntity.badRequest().body("Missing answers object");
        }

        Map<String, Object> result = quizService.submitQuizAnswers(userOpt.get().getId(), answers);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getQuizHistory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found or authenticated.");
        }

        List<QuizAttempt> history = quizService.getUserQuizHistory(userOpt.get().getId());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getWeeklyLeaderboard() {
        return ResponseEntity.ok(quizService.getWeeklyLeaderboard());
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateQuizManually() {
        quizService.generateDailyQuizQuestions();
        return ResponseEntity.ok(Map.of("message", "Daily quiz questions generated successfully."));
    }
}
