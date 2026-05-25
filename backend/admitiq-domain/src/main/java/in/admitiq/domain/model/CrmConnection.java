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
public class CrmConnection {
    private String id;
    private String tenantId;
    private String provider;
    private Map<String, Object> credentials;
    private Map<String, Object> fieldMapping;
    private boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
}
