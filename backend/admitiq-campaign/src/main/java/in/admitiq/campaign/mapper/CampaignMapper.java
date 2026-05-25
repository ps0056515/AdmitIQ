package in.admitiq.campaign.mapper;

import in.admitiq.campaign.entity.CampaignEntity;
import in.admitiq.domain.model.Campaign;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CampaignMapper {
    Campaign toDomain(CampaignEntity entity);
    CampaignEntity toEntity(Campaign domain);
}
