package in.sp.main.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trending_topics")
public class TrendingTopic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String keyword;

    @Column(nullable = false)
    private int frequency;

    @Column(nullable = false)
    private LocalDateTime lastCalculatedAt;

    public TrendingTopic() {
    }

    public TrendingTopic(String keyword, int frequency, LocalDateTime lastCalculatedAt) {
        this.keyword = keyword;
        this.frequency = frequency;
        this.lastCalculatedAt = lastCalculatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public int getFrequency() {
        return frequency;
    }

    public void setFrequency(int frequency) {
        this.frequency = frequency;
    }

    public LocalDateTime getLastCalculatedAt() {
        return lastCalculatedAt;
    }

    public void setLastCalculatedAt(LocalDateTime lastCalculatedAt) {
        this.lastCalculatedAt = lastCalculatedAt;
    }
}
