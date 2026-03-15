package in.sp.main.services;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AdminOtpService {

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;

    private record OtpEntry(String code, Instant expiresAt, int attempts, boolean used) {
        OtpEntry withAttempt() {
            return new OtpEntry(code, expiresAt, attempts + 1, used);
        }

        OtpEntry markUsed() {
            return new OtpEntry(code, expiresAt, attempts, true);
        }

        boolean isExpired() {
            return Instant.now().isAfter(expiresAt);
        }

        boolean canAttempt() {
            return attempts < MAX_ATTEMPTS && !used && !isExpired();
        }
    }

    private final Map<String, OtpEntry> otpCache = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public String generateOtpFor(String email) {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        Instant expiresAt = Instant.now().plus(OTP_EXPIRY_MINUTES, ChronoUnit.MINUTES);
        otpCache.put(email.toLowerCase(), new OtpEntry(otp, expiresAt, 0, false));
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        OtpEntry entry = otpCache.get(email.toLowerCase());
        if (entry == null || entry.isExpired() || entry.used) {
            return false;
        }

        if (!entry.canAttempt()) {
            return false;
        }

        OtpEntry updated = entry.withAttempt();

        if (entry.code.equals(otp)) {
            otpCache.put(email.toLowerCase(), updated.markUsed());
            return true;
        }

        otpCache.put(email.toLowerCase(), updated);
        return false;
    }

    public void invalidateOtp(String email) {
        otpCache.remove(email.toLowerCase());
    }

    public boolean existsValidOtp(String email) {
        OtpEntry entry = otpCache.get(email.toLowerCase());
        return entry != null && !entry.isExpired() && !entry.used;
    }
}