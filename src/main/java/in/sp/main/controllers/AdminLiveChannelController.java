package in.sp.main.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import in.sp.main.entity.LiveChannel;
import in.sp.main.repository.LiveChannelRepository;

@RestController
@RequestMapping("/api/admin/live-channels")
@CrossOrigin("*")
public class AdminLiveChannelController {

    @Autowired
    private LiveChannelRepository repo;

    @GetMapping
    public List<LiveChannel> getAll() {
        return repo.findAll();
    }

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
        LiveChannel ch = repo.findById(id).orElseThrow();
        ch.setActive(!ch.isActive());
        repo.save(ch);
    }
}

