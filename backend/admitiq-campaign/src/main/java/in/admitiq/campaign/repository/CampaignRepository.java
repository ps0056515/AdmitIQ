package in.admitiq.campaign.repository;

import in.admitiq.campaign.entity.CampaignEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<CampaignEntity, String> {
    List<CampaignEntity> findByTenantId(String tenantId);
    List<CampaignEntity> findByTenantIdAndIsActive(String tenantId, boolean isActive);
}
