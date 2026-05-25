package in.admitiq.lead.repository;

import in.admitiq.domain.model.LeadStatus;
import in.admitiq.lead.entity.LeadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeadRepository extends JpaRepository<LeadEntity, String> {
    List<LeadEntity> findByTenantId(String tenantId);
    List<LeadEntity> findByTenantIdAndStatus(String tenantId, LeadStatus status);
    Optional<LeadEntity> findByTenantIdAndDedupKey(String tenantId, String dedupKey);
}
