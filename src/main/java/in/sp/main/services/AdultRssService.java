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
public class AdultRssService {

    @Value("${adult.rss.hindu}")
    private String hinduRss;

    public List<News> fetchAdultNews() {
        List<News> list = new ArrayList<>();

        fetchFromRss(hinduRss, "National", list);

        return list;
    }

    private void fetchFromRss(String rssUrl, String category, List<News> list) {
        try {
            SyndFeed feed = new SyndFeedInput()
                    .build(new XmlReader(new URL(rssUrl)));

            for (SyndEntry entry : feed.getEntries()) {
                News news = new News();
                news.setTitle(entry.getTitle());
                news.setSummary(clean(entry.getDescription()));
                news.setAudience("ADULT");
                news.setCategory(category);
                news.setSource(feed.getTitle());
                news.setSourceUrl(entry.getLink());
                news.setPublishedDate(LocalDate.now());

                list.add(news);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String clean(SyndContent c) {
        if (c == null) return "";
        return c.getValue().replaceAll("<[^>]*>", "");
    }
}

