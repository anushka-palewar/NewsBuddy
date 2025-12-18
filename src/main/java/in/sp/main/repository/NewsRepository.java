package in.sp.main.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import in.sp.main.entity.News;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    List<News> findByAudienceOrderByPublishedDateDesc(String audience);
}

