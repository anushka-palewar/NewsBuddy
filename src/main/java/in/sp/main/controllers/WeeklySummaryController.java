package in.sp.main.controllers;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.sp.main.entity.News;
import in.sp.main.repository.NewsRepository;

@RestController
@RequestMapping("/api/weekly-summary")
@CrossOrigin("*")
public class WeeklySummaryController {

    @Autowired
    private NewsRepository repo;

    // ADULT WEEKLY SUMMARY (GROUPED BY CATEGORY)
    @GetMapping("/adult")
    public Map<String, List<News>> weeklyAdultSummary() {

        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6);

        List<News> newsList =
                repo.findByAudienceAndPublishedDateBetweenOrderByCategoryAsc(
                        "ADULT",
                        start,
                        end
                );

        return newsList.stream()
                .collect(Collectors.groupingBy(
                        News::getCategory,
                        LinkedHashMap::new,
                        Collectors.toList()
                ));
    }

    // KIDS WEEKLY SUMMARY
    @GetMapping("/kids")
    public List<News> weeklyKidsSummary() {

        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6);

        return repo.findByAudienceAndPublishedDateBetweenOrderByCategoryAsc(
                "CHILD",
                start,
                end
        );
    }
}

