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
public class CounsellorAssignment {
    private String id;
    private String leadId;
    private String counsellorId;
    private Instant callbackScheduledAt;
    private boolean isOverdue;
    private Map<String, Object> contextPackage;
    private Instant createdAt;
    private Instant updatedAt;
}
