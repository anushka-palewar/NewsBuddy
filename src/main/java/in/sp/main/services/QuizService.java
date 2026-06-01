package in.sp.main.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.sp.main.entity.News;
import in.sp.main.entity.QuizAttempt;
import in.sp.main.entity.QuizQuestion;
import in.sp.main.entity.User;
import in.sp.main.repository.NewsRepository;
import in.sp.main.repository.QuizAttemptRepository;
import in.sp.main.repository.QuizQuestionRepository;
import in.sp.main.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Autowired
    private NewsRepository newsRepo;

    @Autowired
    private QuizQuestionRepository quizQuestionRepo;

    @Autowired
    private QuizAttemptRepository quizAttemptRepo;

    @Autowired
    private UserRepository userRepo;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public synchronized void generateDailyQuizQuestions() {
        LocalDate today = LocalDate.now();
        if (quizQuestionRepo.existsByQuizDate(today)) {
            return; // Duplicate prevention
        }

        LocalDate yesterday = today.minusDays(1);
        // Try fetching articles published yesterday
        List<News> newsList = newsRepo.findByAudienceAndPublishedDateBetween("ADULT", yesterday, today);

        // Fallback: if not enough articles, fetch any recent articles
        if (newsList.size() < 10) {
            newsList = newsRepo.findAll().stream()
                    .sorted((a, b) -> b.getPublishedDate().compareTo(a.getPublishedDate()))
                    .limit(20)
                    .collect(Collectors.toList());
        }

        // Shuffle and limit to 10 articles
        Collections.shuffle(newsList);
        List<News> selectedNews = newsList.stream().limit(10).collect(Collectors.toList());

        List<QuizQuestion> generatedQuestions = new ArrayList<>();
        for (News news : selectedNews) {
            try {
                QuizQuestion q = generateQuestionFromArticle(news, today);
                if (q != null) {
                    generatedQuestions.add(q);
                }
            } catch (Exception e) {
                System.out.println("Error generating question for news ID " + news.getId() + ": " + e.getMessage());
            }
        }

        // If we still need more questions to reach 10, generate generic ones or reuse existing ones
        if (generatedQuestions.size() < 10 && !selectedNews.isEmpty()) {
            int attempts = 0;
            while (generatedQuestions.size() < 10 && attempts < 10) {
                attempts++;
                News news = selectedNews.get(attempts % selectedNews.size());
                try {
                    QuizQuestion q = generateQuestionFromArticle(news, today);
                    if (q != null) {
                        generatedQuestions.add(q);
                    }
                } catch (Exception ignored) {}
            }
        }

        if (!generatedQuestions.isEmpty()) {
            quizQuestionRepo.saveAll(generatedQuestions);
        }
    }

    private QuizQuestion generateQuestionFromArticle(News news, LocalDate date) throws Exception {
        String prompt = "Generate exactly one multiple-choice question from this news article.\n\n"
                + "Article Title: " + news.getTitle() + "\n"
                + "Article Content: " + (news.getSummary() != null ? news.getSummary() : "") + "\n\n"
                + "Return ONLY valid JSON with exactly the following structure, do not include any other markdown formatting:\n"
                + "{\n"
                + "  \"question\": \"...\",\n"
                + "  \"optionA\": \"...\",\n"
                + "  \"optionB\": \"...\",\n"
                + "  \"optionC\": \"...\",\n"
                + "  \"optionD\": \"...\",\n"
                + "  \"correctOption\": \"A\"\n"
                + "}";

        String jsonResponse = callGroqApi(prompt);
        if (jsonResponse == null || jsonResponse.isBlank()) {
            return null;
        }

        // Clean JSON if the LLM output contains code blocks like ```json ... ```
        if (jsonResponse.contains("```")) {
            int start = jsonResponse.indexOf("{");
            int end = jsonResponse.lastIndexOf("}");
            if (start != -1 && end != -1 && end > start) {
                jsonResponse = jsonResponse.substring(start, end + 1);
            }
        }

        JsonNode root = mapper.readTree(jsonResponse);
        String questionText = root.path("question").asText();
        String optA = root.path("optionA").asText();
        String optB = root.path("optionB").asText();
        String optC = root.path("optionC").asText();
        String optD = root.path("optionD").asText();
        String correctOpt = root.path("correctOption").asText().trim().toUpperCase();

        if (questionText.isBlank() || optA.isBlank() || optB.isBlank() || optC.isBlank() || optD.isBlank() || correctOpt.isBlank()) {
            return null;
        }

        return new QuizQuestion(questionText, optA, optB, optC, optD, correctOpt, news.getId(), date, LocalDateTime.now());
    }

    private String callGroqApi(String prompt) {
        try {
            String url = "https://api.groq.com/openai/v1/chat/completions";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = Map.of(
                    "model", "llama-3.1-8b-instant",
                    "messages", new Object[]{
                            Map.of("role", "system", "content", "You are an AI assistant that generates multiple choice questions in strictly valid JSON format only."),
                            Map.of("role", "user", "content", prompt)
                    },
                    "temperature", 0.5,
                    "max_tokens", 400
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            JsonNode root = mapper.readTree(response.getBody());

            return root.path("choices").get(0).path("message").path("content").asText().trim();
        } catch (Exception e) {
            System.out.println("Groq API error: " + e.getMessage());
            return null;
        }
    }

    public List<QuizQuestion> getTodayQuizQuestions() {
        LocalDate today = LocalDate.now();
        List<QuizQuestion> questions = quizQuestionRepo.findByQuizDate(today);

        // If today's questions don't exist, try manual generation or look up yesterday's as fallback
        if (questions.isEmpty()) {
            generateDailyQuizQuestions();
            questions = quizQuestionRepo.findByQuizDate(today);
            if (questions.isEmpty()) {
                questions = quizQuestionRepo.findByQuizDate(today.minusDays(1));
            }
        }

        if (questions.size() > 5) {
            // Pick 5 random questions
            List<QuizQuestion> shuffled = new ArrayList<>(questions);
            Collections.shuffle(shuffled);
            return shuffled.subList(0, 5);
        }
        return questions;
    }

    public Map<String, Object> submitQuizAnswers(Long userId, Map<String, String> answers) {
        int correct = 0;
        int wrong = 0;
        int total = answers.size();

        for (Map.Entry<String, String> entry : answers.entrySet()) {
            Long questionId = Long.parseLong(entry.getKey());
            String userAnswer = entry.getValue().trim().toUpperCase();

            Optional<QuizQuestion> questionOpt = quizQuestionRepo.findById(questionId);
            if (questionOpt.isPresent()) {
                if (questionOpt.get().getCorrectOption().equalsIgnoreCase(userAnswer)) {
                    correct++;
                } else {
                    wrong++;
                }
            }
        }

        QuizAttempt attempt = new QuizAttempt(userId, correct, total, LocalDate.now(), LocalDateTime.now());
        quizAttemptRepo.save(attempt);

        Map<String, Object> response = new HashMap<>();
        response.put("score", correct);
        response.put("totalQuestions", total);
        response.put("correctAnswers", correct);
        response.put("wrongAnswers", wrong);

        return response;
    }

    public List<QuizAttempt> getUserQuizHistory(Long userId) {
        return quizAttemptRepo.findByUserIdOrderBySubmittedAtDesc(userId);
    }

    public List<Map<String, Object>> getWeeklyLeaderboard() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<QuizAttempt> attempts = quizAttemptRepo.findBySubmittedAtAfter(sevenDaysAgo);

        // Group by user id and sum score
        Map<Long, Integer> userScores = attempts.stream()
                .collect(Collectors.groupingBy(
                        QuizAttempt::getUserId,
                        Collectors.summingInt(QuizAttempt::getScore)
                ));

        List<Map<String, Object>> leaderboard = new ArrayList<>();
        userScores.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(10)
                .forEach(entry -> {
                    Optional<User> userOpt = userRepo.findById(entry.getKey());
                    if (userOpt.isPresent()) {
                        Map<String, Object> item = new HashMap<>();
                        item.put("username", userOpt.get().getFullName());
                        item.put("score", entry.getValue());
                        leaderboard.add(item);
                    }
                });

        // Add Rank
        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).put("rank", i + 1);
        }

        return leaderboard;
    }
}
