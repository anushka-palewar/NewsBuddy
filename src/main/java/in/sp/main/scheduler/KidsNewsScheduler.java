package in.sp.main.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import in.sp.main.services.KidsNewsImportService;

@Component
public class KidsNewsScheduler {

    @Autowired
    private KidsNewsImportService importService;

    @Scheduled(cron = "0 0 6 * * ?") // Daily at 6 AM
    public void fetchDailyKidsNews() {
        importService.importKidsNews();
    }
}

