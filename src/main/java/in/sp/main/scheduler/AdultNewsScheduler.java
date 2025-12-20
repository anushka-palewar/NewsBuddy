package in.sp.main.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import in.sp.main.services.AdultNewsImportService;

@Component
public class AdultNewsScheduler {

    @Autowired
    private AdultNewsImportService service;

    @Scheduled(cron = "0 30 6 * * ?") // daily 6:30 AM
    public void importDailyAdultNews() {
        service.importAdultNews();
    }
}

