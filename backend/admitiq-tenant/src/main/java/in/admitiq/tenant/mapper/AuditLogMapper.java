package in.admitiq.tenant.mapper;

import in.admitiq.domain.model.AuditLog;
import in.admitiq.tenant.entity.AuditLogEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuditLogMapper {
    AuditLog toDomain(AuditLogEntity entity);
    AuditLogEntity toEntity(AuditLog domain);
}
