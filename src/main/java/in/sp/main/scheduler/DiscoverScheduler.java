package in.sp.main.scheduler;

import in.sp.main.services.DiscoverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DiscoverScheduler {

    @Autowired
    private DiscoverService discoverService;

    // Run every 30 minutes (1800000 milliseconds)
    @Scheduled(fixedRate = 1800000)
    public void runTrendingCalculation() {
        System.out.println("Scheduler running: Calculating dynamic trending news keywords...");
        discoverService.calculateTrendingTopics();
    }
}
