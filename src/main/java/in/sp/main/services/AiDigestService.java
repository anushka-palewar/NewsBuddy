package in.sp.main.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import in.sp.main.entity.AiDailyDigest;
import in.sp.main.entity.AiWeeklyDigest;
import in.sp.main.entity.News;
import in.sp.main.repository.AiDailyDigestRepository;
import in.sp.main.repository.AiWeeklyDigestRepository;
import in.sp.main.repository.NewsRepository;

@Service
public class AiDigestService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Autowired
    private NewsRepository newsRepo;

    @Autowired
    private AiDailyDigestRepository dailyRepo;

    @Autowired
    private AiWeeklyDigestRepository weeklyRepo;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    // ==================== DAILY DIGEST ====================

    public AiDailyDigest generateDailyDigest() {
        // Fetch top 10 news articles from the last 24 hours
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        List<News> recentNews = newsRepo.findByAudienceAndPublishedDateBetween(
                "ADULT", yesterday, today);

        // Take up to 10 articles
        List<News> topNews = recentNews.stream()
                .limit(10)
                .collect(Collectors.toList());

        if (topNews.isEmpty()) {
            AiDailyDigest digest = new AiDailyDigest(
                    "• No news articles available for today's digest.",
                    LocalDateTime.now());
            return dailyRepo.save(digest);
        }

        // Build the prompt with titles and descriptions
        StringBuilder articlesText = new StringBuilder();
        for (int i = 0; i < topNews.size(); i++) {
            News n = topNews.get(i);
            articlesText.append((i + 1)).append(". ")
                    .append(n.getTitle());
            if (n.getSummary() != null && !n.getSummary().isEmpty()) {
                articlesText.append(" — ").append(n.getSummary());
            }
            articlesText.append("\n");
        }

        String prompt = "Based on the following top news articles from today, generate exactly 5 bullet points "
                + "summarizing the most important developments. Each bullet point should start with '• ' and be "
                + "on its own line. Be concise and informative.\n\n"
                + articlesText.toString();

        String summary = callGroqApi(prompt, 500);

        AiDailyDigest digest = new AiDailyDigest(summary, LocalDateTime.now());
        return dailyRepo.save(digest);
    }

    public AiDailyDigest getLatestDailyDigest() {
        return dailyRepo.findTopByOrderByGeneratedAtDesc();
    }

    // ==================== WEEKLY DIGEST ====================

    public AiWeeklyDigest generateWeeklyDigest() {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6);

        List<News> weeklyNews = newsRepo.findByAudienceAndPublishedDateBetweenOrderByCategoryAsc(
                "ADULT", start, end);

        if (weeklyNews.isEmpty()) {
            AiWeeklyDigest digest = new AiWeeklyDigest(
                    "No news articles available for this week's digest.",
                    start, end, LocalDateTime.now());
            return weeklyRepo.save(digest);
        }

        // Build the prompt with all weekly articles
        StringBuilder articlesText = new StringBuilder();
        for (int i = 0; i < Math.min(weeklyNews.size(), 30); i++) {
            News n = weeklyNews.get(i);
            articlesText.append((i + 1)).append(". [")
                    .append(n.getCategory() != null ? n.getCategory() : "General")
                    .append("] ")
                    .append(n.getTitle());
            if (n.getSummary() != null && !n.getSummary().isEmpty()) {
                articlesText.append(" — ").append(n.getSummary());
            }
            articlesText.append("\n");
        }

        String prompt = "Based on the following news articles from the past week, generate a comprehensive weekly digest "
                + "organized into exactly these 4 sections. Use '## ' before each section header and '• ' before each bullet point:\n\n"
                + "## Key Events\n(2-3 bullet points about the most important events)\n\n"
                + "## Technology Updates\n(2-3 bullet points about technology news)\n\n"
                + "## Business Updates\n(2-3 bullet points about business/economy news)\n\n"
                + "## Sports Updates\n(2-3 bullet points about sports news)\n\n"
                + "If a category has no relevant news, write '• No major updates this week.'\n\n"
                + "Articles:\n" + articlesText.toString();

        String summary = callGroqApi(prompt, 1000);

        AiWeeklyDigest digest = new AiWeeklyDigest(summary, start, end, LocalDateTime.now());
        return weeklyRepo.save(digest);
    }

    public AiWeeklyDigest getLatestWeeklyDigest() {
        return weeklyRepo.findTopByOrderByGeneratedAtDesc();
    }

    // ==================== GROQ API CALL ====================

    private String callGroqApi(String prompt, int maxTokens) {
        try {
            // Truncate prompt if too long
            prompt = prompt.substring(0, Math.min(prompt.length(), 6000));

            String url = "https://api.groq.com/openai/v1/chat/completions";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = Map.of(
                    "model", "llama-3.1-8b-instant",
                    "messages", new Object[]{
                            Map.of("role", "system", "content",
                                    "You are a professional news editor who creates clear, concise news digests."),
                            Map.of("role", "user", "content", prompt)
                    },
                    "temperature", 0.3,
                    "max_tokens", maxTokens
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, request, String.class);

            JsonNode root = mapper.readTree(response.getBody());

            return root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText()
                    .trim();

        } catch (Exception e) {
            return "Unable to generate AI digest (" + e.getMessage() + ")";
        }
    }
}
