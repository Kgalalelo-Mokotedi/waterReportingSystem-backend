package com.waterreport.report;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * PLACEHOLDER — Member 3 owns the real WaterReportRepository with all
 * the query methods their module needs. This minimal version exists so
 * the assignment/status-update logic in this module compiles and works
 * independently. Merge with the real one when you integrate branches.
 */
public interface WaterReportRepository extends JpaRepository<WaterReport, Long> {

    List<WaterReport> findByStatus(ReportStatus status);

    long countByStatus(ReportStatus status);
}
