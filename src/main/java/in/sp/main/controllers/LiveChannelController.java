package in.sp.main.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.sp.main.entity.LiveChannel;
import in.sp.main.repository.LiveChannelRepository;

@RestController
@RequestMapping("/api/live-channels")
@CrossOrigin("*")
public class LiveChannelController {

    @Autowired
    private LiveChannelRepository repo;

    // USER
    @GetMapping
    public List<LiveChannel> getActiveChannels() {
        return repo.findByActiveTrue();
    }

    @GetMapping("/language/{lang}")
    public List<LiveChannel> byLanguage(@PathVariable String lang) {
        return repo.findByLanguageAndActiveTrue(lang);
    }

    // ADMIN
    @PostMapping
    public LiveChannel add(@RequestBody LiveChannel ch) {
        ch.setActive(true);
        return repo.save(ch);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    @PutMapping("/{id}/toggle")
    public void toggle(@PathVariable Long id) {
        LiveChannel c = repo.findById(id).orElseThrow();
        c.setActive(!c.isActive());
        repo.save(c);
    }
}

