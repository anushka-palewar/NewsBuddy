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

@RestController
@RequestMapping("/api/news")
@CrossOrigin("*")
public class AdultNewsController {

    @Autowired
    private NewsRepository repo;
    
    @Autowired
    private AdultNewsImportService importService;

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

}


