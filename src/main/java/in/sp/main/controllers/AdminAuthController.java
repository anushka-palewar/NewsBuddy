package in.sp.main.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin("*")
public class AdminAuthController {

    @Value("${admin.password}")
    private String adminPassword;

    @PostMapping("/login")
    public boolean login(@RequestBody Map<String, String> body) {
        String password = body.get("password");
        return adminPassword.equals(password);
    }

}
