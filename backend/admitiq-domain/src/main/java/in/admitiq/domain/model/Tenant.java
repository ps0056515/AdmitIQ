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
public class Tenant {
    private String id;
    private String name;
    private String slug;
    private TenantStatus status;
    private PlanTier planTier;
    private String callingWindowStart;
    private String callingWindowEnd;
    private String timezone;
    private int maxConcurrentCalls;
    private Instant createdAt;
    private Instant updatedAt;
}
