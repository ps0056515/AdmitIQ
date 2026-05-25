package in.admitiq.counsellor.repository;

import in.admitiq.counsellor.entity.CounsellorAssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CounsellorAssignmentRepository extends JpaRepository<CounsellorAssignmentEntity, String> {
    List<CounsellorAssignmentEntity> findByCounsellorId(String counsellorId);
    List<CounsellorAssignmentEntity> findByLeadId(String leadId);
}
