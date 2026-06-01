package in.sp.main.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import in.sp.main.entity.AiWeeklyDigest;

@Repository
public interface AiWeeklyDigestRepository extends JpaRepository<AiWeeklyDigest, Long> {

    AiWeeklyDigest findTopByOrderByGeneratedAtDesc();
}
