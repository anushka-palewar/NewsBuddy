package in.sp.main.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import in.sp.main.entity.News;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    Page<News> findByCategoryIgnoreCase(String category, Pageable pageable);
    long countByCategoryIgnoreCase(String category);

    List<News> findByAudienceOrderByPublishedDateDesc(String audience);

    List<News> findTop5ByAudienceOrderByPublishedDateDesc(String audience);

    List<News> findByAudienceAndPublishedDate(
            String audience,
            LocalDate publishedDate
    );

    long countByAudienceAndPublishedDate(
            String audience,
            LocalDate publishedDate
    );
    
    List<News> findByAudienceAndCategoryAndPublishedDate(
            String audience,
            String category,
            LocalDate publishedDate
    );
    
    List<News> findByAudienceAndPublishedDateBetween(
            String audience,
            LocalDate startDate,
            LocalDate endDate
    );
    
    List<News> findByAudienceAndPublishedDateBetweenOrderByCategoryAsc(
            String audience,
            LocalDate startDate,
            LocalDate endDate
    );


}


