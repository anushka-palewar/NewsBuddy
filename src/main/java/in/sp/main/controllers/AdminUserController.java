package in.sp.main.controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.sp.main.entity.User;
import in.sp.main.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin("*")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<UserSummary> listUsers() {
        return userRepository.findAll().stream()
                .map(UserSummary::from)
                .collect(Collectors.toList());
    }

    public static class UserSummary {
        public Long id;
        public String fullName;
        public String email;
        public String role;
        public String dateOfBirth;
        public int age;

        public static UserSummary from(User user) {
            UserSummary s = new UserSummary();
            s.id = user.getId();
            s.fullName = user.getFullName();
            s.email = user.getEmail();
            s.role = user.getRole().name();
            s.dateOfBirth = user.getDateOfBirth().toString();
            s.age = user.getAge();
            return s;
        }
    }
}
