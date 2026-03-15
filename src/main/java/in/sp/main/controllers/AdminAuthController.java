package in.sp.main.controllers;

import in.sp.main.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin("*")
public class AdminAuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String password = body.get("password");

        if ("admin123".equals(password)) {
            String token = jwtUtil.generateToken("admin@newswebsite.com", "ADMIN");

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("role", "ADMIN");

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body("Invalid admin password");
    }
}
