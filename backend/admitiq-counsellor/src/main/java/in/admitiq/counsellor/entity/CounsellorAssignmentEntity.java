package in.admitiq.counsellor.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;

@Entity
@Table(name = "counsellor_assignments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CounsellorAssignmentEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "lead_id", nullable = false, length = 36)
    private String leadId;

    @Column(name = "counsellor_id", nullable = false, length = 36)
    private String counsellorId;

    @Column(name = "callback_scheduled_at")
    private Instant callbackScheduledAt;

    @Column(name = "is_overdue", nullable = false)
    private boolean isOverdue;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "context_package")
    private Map<String, Object> contextPackage;

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
