package in.admitiq.tenant.entity;

import in.admitiq.domain.model.PlanTier;
import in.admitiq.domain.model.TenantStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "tenants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TenantStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_tier", nullable = false, length = 50)
    private PlanTier planTier;

    @Column(name = "calling_window_start", nullable = false, length = 10)
    private String callingWindowStart;

    @Column(name = "calling_window_end", nullable = false, length = 10)
    private String callingWindowEnd;

    @Column(nullable = false, length = 100)
    private String timezone;

    @Column(name = "max_concurrent_calls", nullable = false)
    private int maxConcurrentCalls;

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
