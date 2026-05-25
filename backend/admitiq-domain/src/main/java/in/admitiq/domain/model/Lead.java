package in.admitiq.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lead {
    private String id;
    private String tenantId;
    private String campaignId;
    private String crmLeadId;
    private String name;
    private String phoneE164;
    private String email;
    private String courseInterest;
    private String source;
    private LeadStatus status;
    private Instant inquiryAt;
    private String dedupKey;
    private String assignedToId;
    private Instant createdAt;
    private Instant updatedAt;
}
