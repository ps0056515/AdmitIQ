package in.admitiq.lead.entity;

import in.admitiq.domain.model.LeadStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "leads")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadEntity {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "tenant_id", nullable = false, length = 36)
    private String tenantId;

    @Column(name = "campaign_id", length = 36)
    private String campaignId;

    @Column(name = "crm_lead_id", length = 100)
    private String crmLeadId;

    @Column(nullable = false)
    private String name;

    @Column(name = "phone_e164", nullable = false, length = 30)
    private String phoneE164;

    private String email;

    @Column(name = "course_interest")
    private String courseInterest;

    private String source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private LeadStatus status;

    @Column(name = "inquiry_at", nullable = false)
    private Instant inquiryAt;

    @Column(name = "dedup_key", nullable = false)
    private String dedupKey;

    @Column(name = "assigned_to_id", length = 36)
    private String assignedToId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        if (inquiryAt == null) {
            inquiryAt = Instant.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
