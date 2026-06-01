package in.sp.main.repository;

import in.sp.main.entity.TrendingTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrendingTopicRepository extends JpaRepository<TrendingTopic, Long> {
    List<TrendingTopic> findByOrderByFrequencyDesc();
}
