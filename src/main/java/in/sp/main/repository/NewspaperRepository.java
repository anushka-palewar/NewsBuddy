package in.sp.main.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import in.sp.main.entity.Newspaper;

@Repository
public interface NewspaperRepository extends JpaRepository<Newspaper, Long> {

		List<Newspaper> findByActiveTrue();

		List<Newspaper> findByAudience(String audience);
		List<Newspaper> findByAudienceAndActiveTrue(String audience);
		long countByAudienceAndActiveTrue(String audience);
		List<Newspaper> findTop5ByOrderByIdDesc();
}

