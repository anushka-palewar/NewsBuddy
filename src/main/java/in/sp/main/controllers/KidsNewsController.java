package in.sp.main.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.sp.main.entity.News;
import in.sp.main.repository.NewsRepository;
import in.sp.main.services.KidsNewsImportService;

@RestController
@RequestMapping("/api/kids/news")
@CrossOrigin(origins = "*")
public class KidsNewsController {

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private KidsNewsImportService importService;

    @GetMapping
    public List<News> getKidsNews() {
        return newsRepository
                .findByAudienceOrderByPublishedDateDesc("CHILD");
    }

    @PostMapping("/import")
    public String importKidsNewsNow() {
        importService.importKidsNews();
        return "Kids news imported successfully";
    }
}


