package in.sp.main.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.sp.main.entity.Newspaper;
import in.sp.main.repository.NewspaperRepository;

@RestController
@RequestMapping("/api/newspapers")
@CrossOrigin("*")
public class NewspaperController {

    @Autowired
    private NewspaperRepository repo;

    @GetMapping
    public List<Newspaper> getAllNewspapers() {
        return repo.findByActiveTrue();
    }
}

