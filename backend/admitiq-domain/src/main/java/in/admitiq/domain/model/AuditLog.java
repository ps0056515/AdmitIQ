package in.admitiq.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    private String id;
    private String tenantId;
    private String actorId;
    private String actorRole;
    private String action;
    private String resourceType;
    private String resourceId;
    private String outcome;
    private String ipAddress;
    private Map<String, Object> beforeJson;
    private Map<String, Object> afterJson;
    private String reason;
    private Instant createdAt;
}
