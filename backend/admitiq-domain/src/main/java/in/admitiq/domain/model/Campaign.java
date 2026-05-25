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
public class Campaign {
    private String id;
    private String tenantId;
    private String name;
    private boolean isActive;
    private Map<String, Object> flowConfig;
    private String callerId;
    private Instant createdAt;
    private Instant updatedAt;
}
