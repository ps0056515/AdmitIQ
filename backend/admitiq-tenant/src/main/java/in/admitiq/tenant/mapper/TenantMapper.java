package in.admitiq.tenant.mapper;

import in.admitiq.domain.model.Tenant;
import in.admitiq.tenant.entity.TenantEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TenantMapper {
    Tenant toDomain(TenantEntity entity);
    TenantEntity toEntity(Tenant domain);
}
