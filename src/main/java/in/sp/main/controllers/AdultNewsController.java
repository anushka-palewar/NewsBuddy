package in.sp.main.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.sp.main.entity.News;
import in.sp.main.repository.NewsRepository;
import in.sp.main.services.AdultNewsImportService;
import in.sp.main.services.AiSummarizationService;
import in.sp.main.services.ArticleScrapingService;

@RestController
@RequestMapping("/api/news/adult")
@CrossOrigin("*")
public class AdultNewsController {
	
	@GetMapping("/{id}")
    public News getArticleById(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }
	
    @Autowired
    private NewsRepository repo;
    
    @Autowired
    private AdultNewsImportService importService;
    
    @Autowired
    private ArticleScrapingService scrapingService;
    
    @Autowired
    private AiSummarizationService aiService;

    @GetMapping
    public List<News> getAllAdultNews() {
        return repo.findByAudienceOrderByPublishedDateDesc("ADULT");
    }

    @GetMapping("/category/{cat}")
    public List<News> byCategory(@PathVariable String cat) {
        return repo.findByAudienceAndCategoryAndPublishedDate(
                "ADULT",
                cat,
                LocalDate.now()
        );
    }
    
    @GetMapping("/import")
    public String importAdultNewsNow() {
        importService.importAdultNews();
        return "Adult news imported";
    }
    
    @GetMapping("/{id}/summary")
    public String getArticleSummary(@PathVariable Long id) {
        News news = repo.findById(id).orElseThrow();
        if (news.getSourceUrl() == null || news.getSourceUrl().isEmpty()) {
            return "No source URL available for summarization.";
        }
        
        try {
            String articleText = scrapingService.scrapeArticleText(news.getSourceUrl());
            if (articleText.isEmpty()) {
                return "Unable to extract article content.";
            }
            return aiService.summarizeArticle(articleText);
        } catch (Exception e) {
            return "Error generating summary: " + e.getMessage();
        }
    }
    

}


