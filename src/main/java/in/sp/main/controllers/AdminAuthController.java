package in.sp.main.controllers;

import in.sp.main.config.JwtUtil;
import in.sp.main.entity.User;
import in.sp.main.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin("*")
public class AdminAuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String password = body.get("password");

        Optional<User> userOpt = userService.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Admin user not found");
        }

        User user = userOpt.get();

        if (!"ADMIN".equalsIgnoreCase(user.getRole().toString())) {
            return ResponseEntity.badRequest().body("Not an admin account");
        }

        if (!userService.validatePassword(password, user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().toString());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }
}