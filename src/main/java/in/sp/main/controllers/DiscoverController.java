package in.sp.main.controllers;

import in.sp.main.entity.News;
import in.sp.main.entity.TrendingTopic;
import in.sp.main.services.DiscoverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/discover")
@CrossOrigin("*")
public class DiscoverController {

    @Autowired
    private DiscoverService discoverService;

    @GetMapping("/topics")
    public ResponseEntity<List<Map<String, Object>>> getTopics() {
        return ResponseEntity.ok(discoverService.getAllTopicsWithCounts());
    }

    @GetMapping("/topics/{topicId}/articles")
    public ResponseEntity<Page<News>> getArticlesByTopic(
            @PathVariable Long topicId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(discoverService.getArticlesByTopic(topicId, page, size));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<TrendingTopic>> getTrending() {
        return ResponseEntity.ok(discoverService.getTrendingTopics());
    }
}
