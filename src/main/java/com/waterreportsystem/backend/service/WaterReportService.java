package com.waterreportsystem.backend.service;

import com.waterreportsystem.backend.dto.WaterReportRequest;
import com.waterreportsystem.backend.dto.WaterReportResponse;
import com.waterreportsystem.backend.enums.Priority;
import com.waterreportsystem.backend.enums.Status;
import org.springframework.data.domain.Page;

public interface WaterReportService {

    WaterReportResponse createReport(WaterReportRequest request);

    Page<WaterReportResponse> getAllReports(int page, int size, String sortBy);

    WaterReportResponse getReportById(Long id);

    WaterReportResponse updateReport(Long id, WaterReportRequest request);

    void deleteReport(Long id);

    Page<WaterReportResponse> searchByStatus(Status status, int page, int size);

    Page<WaterReportResponse> searchByPriority(Priority priority, int page, int size);

    Page<WaterReportResponse> searchByMunicipality(String municipality, int page, int size);

    Page<WaterReportResponse> searchBySuburb(String suburb, int page, int size);

    Page<WaterReportResponse> searchByCategory(Long categoryId, int page, int size);

    Page<WaterReportResponse> searchByTitle(String title, int page, int size);

    Page<WaterReportResponse> getReportsByResidentId(Long residentId, int page, int size);
}
