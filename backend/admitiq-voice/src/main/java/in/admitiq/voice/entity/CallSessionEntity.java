package in.admitiq.voice.entity;

import in.admitiq.domain.model.CallDisposition;
import in.admitiq.domain.model.CallSessionStatus;
import in.admitiq.domain.model.LeadScore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;

@Entity
@Table(name = "call_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CallSessionEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "tenant_id", nullable = false, length = 36)
    private String tenantId;

    @Column(name = "lead_id", nullable = false, length = 36)
    private String leadId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CallSessionStatus status;

    @Column(name = "provider_call_id", length = 100)
    private String providerCallId;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private CallDisposition disposition;

    @Enumerated(EnumType.STRING)
    @Column(name = "lead_score", length = 50)
    private LeadScore leadScore;

    private Double confidence;

    @Column(name = "language_detected", length = 50)
    private String languageDetected;

    @Column(name = "transcript_url", length = 500)
    private String transcriptUrl;

    @Column(name = "recording_url", length = 500)
    private String recordingUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> slots;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "ended_at")
    private Instant endedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
