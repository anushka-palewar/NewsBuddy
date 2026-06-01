package in.sp.main.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.sp.main.entity.AiDailyDigest;
import in.sp.main.entity.AiWeeklyDigest;
import in.sp.main.services.AiDigestService;

@RestController
@RequestMapping("/api/ai-digest")
@CrossOrigin("*")
public class AiDigestController {

    @Autowired
    private AiDigestService aiDigestService;

    // ==================== PUBLIC GET ENDPOINTS ====================

    @GetMapping("/today")
    public ResponseEntity<?> getTodayDigest() {
        AiDailyDigest digest = aiDigestService.getLatestDailyDigest();
        if (digest == null) {
            return ResponseEntity.ok(Map.of(
                    "summary", "No daily digest has been generated yet.",
                    "generatedAt", ""
            ));
        }
        return ResponseEntity.ok(digest);
    }

    @GetMapping("/weekly")
    public ResponseEntity<?> getWeeklyDigest() {
        AiWeeklyDigest digest = aiDigestService.getLatestWeeklyDigest();
        if (digest == null) {
            return ResponseEntity.ok(Map.of(
                    "summary", "No weekly digest has been generated yet.",
                    "generatedAt", ""
            ));
        }
        return ResponseEntity.ok(digest);
    }

    // ==================== ADMIN-ONLY POST ENDPOINTS ====================

    @PostMapping("/generate-today")
    public ResponseEntity<?> generateTodayDigest() {
        AiDailyDigest digest = aiDigestService.generateDailyDigest();
        return ResponseEntity.ok(Map.of(
                "message", "Daily digest generated successfully",
                "digest", digest
        ));
    }

    @PostMapping("/generate-weekly")
    public ResponseEntity<?> generateWeeklyDigest() {
        AiWeeklyDigest digest = aiDigestService.generateWeeklyDigest();
        return ResponseEntity.ok(Map.of(
                "message", "Weekly digest generated successfully",
                "digest", digest
        ));
    }
}
