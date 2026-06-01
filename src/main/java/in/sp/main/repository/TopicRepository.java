package in.sp.main.repository;

import in.sp.main.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    Optional<Topic> findBySlug(String slug);
    boolean existsByName(String name);
}
