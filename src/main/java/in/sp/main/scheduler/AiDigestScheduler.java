package in.sp.main.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import in.sp.main.services.AiDigestService;

@Component
public class AiDigestScheduler {

    @Autowired
    private AiDigestService aiDigestService;

    // Run daily at 6:00 AM
    @Scheduled(cron = "0 0 6 * * ?")
    public void generateDailyDigest() {
        System.out.println("[AI Digest] Generating daily digest...");
        aiDigestService.generateDailyDigest();
        System.out.println("[AI Digest] Daily digest generated successfully.");
    }

    // Run every Sunday at midnight
    @Scheduled(cron = "0 0 0 ? * SUN")
    public void generateWeeklyDigest() {
        System.out.println("[AI Digest] Generating weekly digest...");
        aiDigestService.generateWeeklyDigest();
        System.out.println("[AI Digest] Weekly digest generated successfully.");
    }
}
