package in.admitiq.tenant.mapper;

import in.admitiq.domain.model.CrmConnection;
import in.admitiq.tenant.entity.CrmConnectionEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CrmConnectionMapper {
    CrmConnection toDomain(CrmConnectionEntity entity);
    CrmConnectionEntity toEntity(CrmConnection domain);
}
