package in.sp.main.services;

import in.sp.main.entity.News;
import in.sp.main.entity.Topic;
import in.sp.main.entity.TrendingTopic;
import in.sp.main.repository.NewsRepository;
import in.sp.main.repository.TopicRepository;
import in.sp.main.repository.TrendingTopicRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DiscoverService {

    @Autowired
    private TopicRepository topicRepo;

    @Autowired
    private TrendingTopicRepository trendingRepo;

    @Autowired
    private NewsRepository newsRepo;

    @PostConstruct
    public void initTopics() {
        List<String[]> defaultTopics = List.of(
                new String[]{"Technology", "technology", "Latest news in tech, software, gadgets, and AI"},
                new String[]{"Politics", "politics", "Updates from government, elections, policy, and public affairs"},
                new String[]{"Business", "business", "Market news, economy updates, startups, and corporate developments"},
                new String[]{"Sports", "sports", "Football, cricket, basketball, tennis, and other sports news"},
                new String[]{"Science", "science", "Discoveries, research, space exploration, and environmental updates"},
                new String[]{"Health", "health", "Wellness, medical research, nutrition, and public health updates"},
                new String[]{"Entertainment", "entertainment", "Movies, music, celebrity news, pop culture, and television"}
        );

        for (String[] t : defaultTopics) {
            if (!topicRepo.existsByName(t[0])) {
                topicRepo.save(new Topic(t[0], t[1], t[2], LocalDateTime.now()));
            }
        }

        // Run an initial calculation for trending topics
        try {
            calculateTrendingTopics();
        } catch (Exception e) {
            System.out.println("Failed initial trending calculation: " + e.getMessage());
        }
    }

    public List<Map<String, Object>> getAllTopicsWithCounts() {
        List<Topic> topics = topicRepo.findAll();
        List<Map<String, Object>> response = new ArrayList<>();

        for (Topic t : topics) {
            long count = newsRepo.countByCategoryIgnoreCase(t.getName());
            Map<String, Object> item = new HashMap<>();
            item.put("id", t.getId());
            item.put("name", t.getName());
            item.put("slug", t.getSlug());
            item.put("description", t.getDescription());
            item.put("articleCount", count);
            response.add(item);
        }

        return response;
    }

    public Page<News> getArticlesByTopic(Long topicId, int page, int size) {
        Topic topic = topicRepo.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedDate").descending());
        return newsRepo.findByCategoryIgnoreCase(topic.getName(), pageable);
    }

    public void calculateTrendingTopics() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // Fetch news from last 24 hours
        List<News> recentNews = newsRepo.findByAudienceAndPublishedDateBetween("ADULT", yesterday, today);

        // Fallback: if no news from last 24h, take recent 30 articles
        if (recentNews.isEmpty()) {
            recentNews = newsRepo.findAll(PageRequest.of(0, 30, Sort.by("publishedDate").descending())).getContent();
        }

        Map<String, Integer> freqMap = new HashMap<>();
        Set<String> stopWords = Set.of(
                "the", "a", "an", "is", "was", "are", "and", "or", "but", "for", "with", "from",
                "in", "on", "at", "to", "of", "by", "that", "this", "it", "as", "about", "has", "have", "had", "will"
        );

        for (News n : recentNews) {
            String text = (n.getTitle() != null ? n.getTitle() : "") + " " + (n.getSummary() != null ? n.getSummary() : "");
            String cleaned = text.toLowerCase().replaceAll("[^a-zA-Z\\s]", " ");
            String[] words = cleaned.split("\\s+");
            for (String w : words) {
                w = w.trim();
                if (w.length() >= 3 && !stopWords.contains(w)) {
                    freqMap.put(w, freqMap.getOrDefault(w, 0) + 1);
                }
            }
        }

        List<Map.Entry<String, Integer>> sortedKeywords = freqMap.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(10)
                .collect(Collectors.toList());

        trendingRepo.deleteAll();
        LocalDateTime now = LocalDateTime.now();
        for (Map.Entry<String, Integer> entry : sortedKeywords) {
            trendingRepo.save(new TrendingTopic(entry.getKey(), entry.getValue(), now));
        }
    }

    public List<TrendingTopic> getTrendingTopics() {
        return trendingRepo.findByOrderByFrequencyDesc();
    }
}
