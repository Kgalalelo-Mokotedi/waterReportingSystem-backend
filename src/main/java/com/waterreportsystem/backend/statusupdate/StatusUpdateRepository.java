package com.waterreport.statusupdate;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StatusUpdateRepository extends JpaRepository<StatusUpdate, Long> {

    List<StatusUpdate> findByReportIdOrderByCreatedAtAsc(Long reportId);

    List<StatusUpdate> findByTechnicianIdOrderByCreatedAtDesc(Long technicianId);
}
