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
public class TranscriptTurn {
    private String id;
    private String callSessionId;
    private String speaker;
    private String text;
    private int timestampMs;
    private Instant createdAt;
}
