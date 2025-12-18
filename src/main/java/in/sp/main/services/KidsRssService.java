package in.sp.main.services;

import java.net.URL;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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
            URL feedUrl = new URL(rssUrl);
            SyndFeedInput input = new SyndFeedInput();
            SyndFeed feed = input.build(new XmlReader(feedUrl));

            for (SyndEntry entry : feed.getEntries()) {
                News news = new News();
                news.setTitle(entry.getTitle());
                news.setSummary(cleanSummary(entry.getDescription()));
                news.setAudience("CHILD");
                news.setCategory("Kids");
                news.setSource("The Hindu - Young World");
                news.setSourceUrl(entry.getLink());
                news.setPublishedDate(LocalDate.now());

                newsList.add(news);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return newsList;
    }

    private String cleanSummary(SyndContent content) {
        if (content == null) return "";
        return content.getValue()
                .replaceAll("<[^>]*>", "")
                .substring(0, Math.min(200, content.getValue().length()));
    }
}

