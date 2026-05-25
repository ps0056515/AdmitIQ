package in.admitiq.voice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "transcript_turns")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TranscriptTurnEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "call_session_id", nullable = false, length = 36)
    private String callSessionId;

    @Column(nullable = false, length = 50)
    private String speaker;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    @Column(name = "timestamp_ms", nullable = false)
    private int timestampMs;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
