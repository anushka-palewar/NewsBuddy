package in.sp.main.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import in.sp.main.entity.News;
import in.sp.main.repository.NewsRepository;

@Service
public class KidsNewsImportService {

    @Autowired
    private KidsRssService kidsRssService;

    @Autowired
    private NewsRepository newsRepository;

    public void importKidsNews() {
        List<News> rssNews = kidsRssService.fetchKidsNewsFromRss();
        newsRepository.saveAll(rssNews);
    }
}

