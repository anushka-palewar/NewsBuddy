package in.sp.main.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
public class AiSummarizationService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String summarizeArticle(String articleText) {

        try {

            articleText = articleText.substring(0, Math.min(articleText.length(), 4000));

            String prompt =
                    "Summarize the following news article in exactly 3 clear sentences:\n\n"
                            + articleText;

            String url = "https://api.groq.com/openai/v1/chat/completions";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = Map.of(
                    "model", "llama-3.1-8b-instant",
                    "messages", new Object[]{
                            Map.of("role", "system", "content", "You are a news summarization assistant."),
                            Map.of("role", "user", "content", prompt)
                    },
                    "temperature", 0.3,
                    "max_tokens", 150
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, request, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            return root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText()
                    .trim();

        } catch (Exception e) {

            return "Unable to generate AI summary (" + e.getMessage() + ")";
        }
    }
}