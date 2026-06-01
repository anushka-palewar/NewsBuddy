package in.sp.main.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import in.sp.main.entity.AiDailyDigest;

@Repository
public interface AiDailyDigestRepository extends JpaRepository<AiDailyDigest, Long> {

    AiDailyDigest findTopByOrderByGeneratedAtDesc();
}
