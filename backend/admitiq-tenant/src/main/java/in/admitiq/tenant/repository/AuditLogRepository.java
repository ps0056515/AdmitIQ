package in.admitiq.tenant.repository;

import in.admitiq.tenant.entity.AuditLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLogEntity, String> {
    List<AuditLogEntity> findByTenantId(String tenantId);
    List<AuditLogEntity> findByActorId(String actorId);
}
