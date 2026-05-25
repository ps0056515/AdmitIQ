package in.admitiq.voice.mapper;

import in.admitiq.domain.model.CallSession;
import in.admitiq.voice.entity.CallSessionEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CallSessionMapper {
    CallSession toDomain(CallSessionEntity entity);
    CallSessionEntity toEntity(CallSession domain);
}
