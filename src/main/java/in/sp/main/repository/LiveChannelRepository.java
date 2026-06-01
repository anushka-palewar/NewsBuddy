package in.sp.main.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import in.sp.main.entity.LiveChannel;

public interface LiveChannelRepository extends JpaRepository<LiveChannel, Long> {

	List<LiveChannel> findByActiveTrue();
	List<LiveChannel> findByLanguageAndActiveTrue(String language);

	List<LiveChannel> findByAudience(String audience);
	List<LiveChannel> findByAudienceAndActiveTrue(String audience);
	long countByAudienceAndActiveTrue(String audience);
	List<LiveChannel> findTop5ByOrderByIdDesc();
}

