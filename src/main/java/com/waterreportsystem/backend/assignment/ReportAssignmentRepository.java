package com.waterreportsystem.backend.assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReportAssignmentRepository extends JpaRepository<ReportAssignment, Long> {

    List<ReportAssignment> findByTechnicianId(Long technicianId);

    List<ReportAssignment> findByTechnicianIdAndAssignmentStatusIn(Long technicianId, List<AssignmentStatus> statuses);

    List<ReportAssignment> findByReportId(Long reportId);

    // The single currently-active assignment for a report, if any.
    Optional<ReportAssignment> findFirstByReportIdAndAssignmentStatusInOrderByAssignedAtDesc(
            Long reportId, List<AssignmentStatus> statuses);

    long countByTechnicianIdAndAssignmentStatusIn(Long technicianId, List<AssignmentStatus> statuses);
}
