package in.admitiq.tenant.repository;

import in.admitiq.tenant.entity.CrmConnectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CrmConnectionRepository extends JpaRepository<CrmConnectionEntity, String> {
    List<CrmConnectionEntity> findByTenantId(String tenantId);
    List<CrmConnectionEntity> findByTenantIdAndIsActive(String tenantId, boolean isActive);
}
