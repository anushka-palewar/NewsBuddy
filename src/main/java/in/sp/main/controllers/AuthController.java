package in.sp.main.controllers;

import in.sp.main.entity.User;
import in.sp.main.services.AdminOtpService;
import in.sp.main.services.UserService;
import in.sp.main.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminOtpService adminOtpService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String fullName = request.get("fullName");
            String email = request.get("email");
            String password = request.get("password");
            LocalDate dateOfBirth = LocalDate.parse(request.get("dateOfBirth"));

            // Prevent creation of admin users through registration
            if (email != null && email.toLowerCase().endsWith("@admin.com")) {
                return ResponseEntity.badRequest().body("Admin accounts must use the admin login flow");
            }

            // Basic password validation
            if (password.length() < 6) {
                return ResponseEntity.badRequest().body("Password must be at least 6 characters long");
            }

            User user = userService.registerUser(fullName, email, password, dateOfBirth);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("role", user.getRole().toString());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email != null && email.toLowerCase().endsWith("@admin.com")) {
            return ResponseEntity.badRequest().body("Admin users must use the admin login flow");
        }

        Optional<User> userOpt = userService.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (userService.validatePassword(password, user.getPassword())) {
                String token = jwtUtil.generateToken(email, user.getRole().toString());

                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("role", user.getRole().toString());

                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.badRequest().body("Invalid credentials");
    }

    @PostMapping("/admin/request-otp")
    public ResponseEntity<?> requestAdminOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || !email.toLowerCase().endsWith("@admin.com")) {
            return ResponseEntity.badRequest().body("Admin login requires an @admin.com email");
        }

        if (!"admin123".equals(password)) {
            return ResponseEntity.badRequest().body("Invalid admin credentials");
        }

        String otp = adminOtpService.generateOtpFor(email);

        // TODO: Replace with real email delivery in production.
        System.out.printf("[OTP] Sent OTP %s to %s (valid for 5 minutes)%n", otp, email);

        return ResponseEntity.ok(Map.of("message", "OTP has been sent to your email"));
    }

    @PostMapping("/admin/verify-otp")
    public ResponseEntity<?> verifyAdminOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || !email.toLowerCase().endsWith("@admin.com")) {
            return ResponseEntity.badRequest().body("Admin login requires an @admin.com email");
        }

        if (otp == null || otp.isBlank()) {
            return ResponseEntity.badRequest().body("OTP is required");
        }

        boolean valid = adminOtpService.validateOtp(email, otp);
        if (!valid) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }

        String token = jwtUtil.generateToken(email, "ADMIN");
        adminOtpService.invalidateOtp(email);

        return ResponseEntity.ok(Map.of("token", token, "role", "ADMIN"));
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("Backend is running!");
    }
}
