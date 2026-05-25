package in.admitiq.tenant.repository;

import in.admitiq.tenant.entity.TenantEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<TenantEntity, String> {
    Optional<TenantEntity> findBySlug(String slug);
}
