package in.admitiq.voice.repository;

import in.admitiq.voice.entity.TranscriptTurnEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TranscriptTurnRepository extends JpaRepository<TranscriptTurnEntity, String> {
    List<TranscriptTurnEntity> findByCallSessionIdOrderByTimestampMsAsc(String callSessionId);
}
