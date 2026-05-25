package in.admitiq.voice.repository;

import in.admitiq.voice.entity.CallSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CallSessionRepository extends JpaRepository<CallSessionEntity, String> {
    List<CallSessionEntity> findByTenantId(String tenantId);
    List<CallSessionEntity> findByLeadId(String leadId);
    Optional<CallSessionEntity> findByProviderCallId(String providerCallId);
}
