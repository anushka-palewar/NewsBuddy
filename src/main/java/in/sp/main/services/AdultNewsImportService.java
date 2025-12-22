package in.sp.main.services;

import java.time.LocalDate;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.sp.main.entity.News;
import in.sp.main.repository.NewsRepository;

@Service
public class AdultNewsImportService {

    private static final int DAILY_LIMIT = 20;

    @Autowired
    private AdultRssService rssService;

    @Autowired
    private NewsRepository newsRepository;

    public void importAdultNews() {

        LocalDate today = LocalDate.now();

        long alreadyAdded =
            newsRepository.countByAudienceAndPublishedDate("ADULT", today);

        if (alreadyAdded >= DAILY_LIMIT) {
            System.out.println("Adult daily limit reached");
            return;
        }

        List<News> rssNews = rssService.fetchAdultNews();

        int remaining = DAILY_LIMIT - (int) alreadyAdded;
        int added = 0;

        for (News news : rssNews) {
            if (added >= remaining) break;

            news.setAudience("ADULT");
            news.setPublishedDate(today);

            // ⭐ ADD IMAGE FROM ARTICLE URL
            String imageUrl = extractImage(news.getSourceUrl());
            news.setImageUrl(imageUrl);

            newsRepository.save(news);
            added++;
        }

        System.out.println("Adult news added today: " + added);
    }

    // ✅ MUST BE OUTSIDE importAdultNews()
    private String extractImage(String url) {
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0")
                    .timeout(10_000)
                    .get();

            String image =
                doc.select("meta[property=og:image]").attr("content");

            return image.isEmpty() ? null : image;

        } catch (Exception e) {
            return null;
        }
    }
}



