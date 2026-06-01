package in.sp.main.controllers;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.sp.main.repository.LiveChannelRepository;
import in.sp.main.repository.NewspaperRepository;
import in.sp.main.repository.NewsRepository;
import in.sp.main.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/status")
@CrossOrigin("*")
public class AdminStatusController {

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private LiveChannelRepository liveChannelRepository;

    @Autowired
    private NewspaperRepository newspaperRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public Map<String, Object> getStatus() {
        Map<String, Object> status = new HashMap<>();

        status.put("serverTime", Instant.now().toString());

        status.put("totalUsers", userRepository.count());

        status.put("totalAdultNews", newsRepository.countByAudienceAndPublishedDate("ADULT", java.time.LocalDate.now()));
        status.put("totalKidsNews", newsRepository.countByAudienceAndPublishedDate("CHILD", java.time.LocalDate.now()));

        status.put("activeAdultChannels", liveChannelRepository.countByAudienceAndActiveTrue("ADULT"));
        status.put("activeKidsChannels", liveChannelRepository.countByAudienceAndActiveTrue("CHILD"));

        status.put("activeAdultNewspapers", newspaperRepository.countByAudienceAndActiveTrue("ADULT"));
        status.put("activeKidsNewspapers", newspaperRepository.countByAudienceAndActiveTrue("CHILD"));

        return status;
    }
}
