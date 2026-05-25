package in.admitiq.voice.mapper;

import in.admitiq.domain.model.TranscriptTurn;
import in.admitiq.voice.entity.TranscriptTurnEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TranscriptTurnMapper {
    TranscriptTurn toDomain(TranscriptTurnEntity entity);
    TranscriptTurnEntity toEntity(TranscriptTurn domain);
}
