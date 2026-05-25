package in.admitiq.counsellor.mapper;

import in.admitiq.counsellor.entity.CounsellorAssignmentEntity;
import in.admitiq.domain.model.CounsellorAssignment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CounsellorAssignmentMapper {
    CounsellorAssignment toDomain(CounsellorAssignmentEntity entity);
    CounsellorAssignmentEntity toEntity(CounsellorAssignment domain);
}
