package com.waterreportsystem.backend.repository;

import com.waterreportsystem.backend.entity.WaterReport;
import com.waterreportsystem.backend.enums.Priority;
import com.waterreportsystem.backend.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WaterReportRepository extends JpaRepository<WaterReport, Long> {

    Page<WaterReport> findByStatus(Status status, Pageable pageable);

    long countByStatus(Status status);

    Page<WaterReport> findByPriority(Priority priority, Pageable pageable);

    Page<WaterReport> findByMunicipalityContainingIgnoreCase(String municipality, Pageable pageable);

    Page<WaterReport> findBySuburbContainingIgnoreCase(String suburb, Pageable pageable);

    Page<WaterReport> findByCategoryId(Long categoryId, Pageable pageable);

    Page<WaterReport> findByTitleContainingIgnoreCase(String title, Pageable pageable);
}
