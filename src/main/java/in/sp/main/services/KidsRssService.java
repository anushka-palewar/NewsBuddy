package in.sp.main.services;

import java.net.URL;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.rometools.rome.feed.synd.SyndContent;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;

import in.sp.main.entity.News;

@Service
public class KidsRssService {

    @Value("${kids.rss.url}")
    private String rssUrl;

    public List<News> fetchKidsNewsFromRss() {

        List<News> newsList = new ArrayList<>();

        try {
            SyndFeed feed = new SyndFeedInput()
                    .build(new XmlReader(new URL(rssUrl)));

            for (SyndEntry entry : feed.getEntries()) {

                News news = new News();
                news.setTitle(entry.getTitle());
                news.setSummary(clean(entry.getDescription()));
                news.setAudience("CHILD");
                news.setCategory("Kids");
                news.setSource("The Hindu - Young World");
                news.setSourceUrl(entry.getLink());
                news.setPublishedDate(LocalDate.now());

                // ✅ THIS IS THE FIX
                news.setImageUrl(extractImage(entry.getLink()));

                newsList.add(news);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return newsList;
    }

    private String clean(SyndContent content) {
        if (content == null) return "";
        String text = content.getValue().replaceAll("<[^>]*>", "");
        return text.substring(0, Math.min(200, text.length()));
    }

    // ✅ OG IMAGE SCRAPER
    private String extractImage(String url) {
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0")
                    .timeout(10_000)
                    .get();

            return doc.select("meta[property=og:image]")
                      .attr("content");

        } catch (Exception e) {
            return null;
        }
    }
}

