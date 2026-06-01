package in.sp.main.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ai_weekly_digest")
public class AiWeeklyDigest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String summary;

    private LocalDate weekStart;

    private LocalDate weekEnd;

    private LocalDateTime generatedAt;

    public AiWeeklyDigest() {
    }

    public AiWeeklyDigest(String summary, LocalDate weekStart, LocalDate weekEnd, LocalDateTime generatedAt) {
        this.summary = summary;
        this.weekStart = weekStart;
        this.weekEnd = weekEnd;
        this.generatedAt = generatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public LocalDate getWeekStart() {
        return weekStart;
    }

    public void setWeekStart(LocalDate weekStart) {
        this.weekStart = weekStart;
    }

    public LocalDate getWeekEnd() {
        return weekEnd;
    }

    public void setWeekEnd(LocalDate weekEnd) {
        this.weekEnd = weekEnd;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}
