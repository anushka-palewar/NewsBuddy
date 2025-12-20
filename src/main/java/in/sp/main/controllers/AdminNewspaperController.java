package in.sp.main.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import in.sp.main.entity.Newspaper;
import in.sp.main.repository.NewspaperRepository;

@RestController
@RequestMapping("/api/admin/newspapers")
@CrossOrigin("*")
public class AdminNewspaperController {

    @Autowired
    private NewspaperRepository repo;

    // GET all papers (admin view)
    @GetMapping
    public List<Newspaper> getAll() {
        return repo.findAll();
    }

    // ADD newspaper
    @PostMapping
    public Newspaper add(@RequestBody Newspaper paper) {
        paper.setActive(true);
        return repo.save(paper);
    }

    // DELETE newspaper
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    // ENABLE / DISABLE
    @PutMapping("/{id}/toggle")
    public void toggle(@PathVariable Long id) {
        Newspaper p = repo.findById(id).orElseThrow();
        p.setActive(!p.isActive());
        repo.save(p);
    }
}

