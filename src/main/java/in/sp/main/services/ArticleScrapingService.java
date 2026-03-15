package in.sp.main.services;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

@Service
public class ArticleScrapingService {

    public String scrapeArticleText(String url) throws Exception {
        Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .timeout(10000)
                .get();

        Elements paragraphs = doc.select("p");
        StringBuilder text = new StringBuilder();

        for (Element p : paragraphs) {
            String paraText = p.text().trim();
            if (!paraText.isEmpty() && paraText.length() > 20) { // Filter short paragraphs
                text.append(paraText).append(" ");
            }
        }

        return text.toString().trim();
    }
}