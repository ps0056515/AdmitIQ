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
public class CallSession {
    private String id;
    private String tenantId;
    private String leadId;
    private CallSessionStatus status;
    private String providerCallId;
    private CallDisposition disposition;
    private LeadScore leadScore;
    private Double confidence;
    private String languageDetected;
    private String transcriptUrl;
    private String recordingUrl;
    private Map<String, Object> slots;
    private Instant startedAt;
    private Instant endedAt;
    private Instant createdAt;
    private Instant updatedAt;
}
