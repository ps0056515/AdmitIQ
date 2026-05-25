package in.admitiq.lead.mapper;

import in.admitiq.domain.model.Lead;
import in.admitiq.lead.entity.LeadEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LeadMapper {
    Lead toDomain(LeadEntity entity);
    LeadEntity toEntity(Lead domain);
}
