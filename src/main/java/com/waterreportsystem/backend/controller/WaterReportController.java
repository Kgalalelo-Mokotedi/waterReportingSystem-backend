package com.waterreportsystem.backend.controller;

import com.waterreportsystem.backend.dto.WaterReportRequest;
import com.waterreportsystem.backend.dto.WaterReportResponse;
import com.waterreportsystem.backend.enums.Priority;
import com.waterreportsystem.backend.enums.Status;
import com.waterreportsystem.backend.service.WaterReportService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class WaterReportController {

    private final WaterReportService waterReportService;

    public WaterReportController(WaterReportService waterReportService) {
        this.waterReportService = waterReportService;
    }


    @PostMapping
    public WaterReportResponse createReport(@Valid @RequestBody WaterReportRequest request) {
        return waterReportService.createReport(request);
    }


    @GetMapping
    public Page<WaterReportResponse> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {

        return waterReportService.getAllReports(page, size, sortBy);
    }


    @GetMapping("/{id}")
    public WaterReportResponse getReportById(@PathVariable Long id) {
        return waterReportService.getReportById(id);
    }

    @GetMapping("/resident/{residentId}")
    public Page<WaterReportResponse> getReportsByResident(
            @PathVariable Long residentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return waterReportService.getReportsByResidentId(residentId, page, size);
    }


    @PutMapping("/{id}")
    public WaterReportResponse updateReport(
            @PathVariable Long id,
            @Valid @RequestBody WaterReportRequest request) {

        return waterReportService.updateReport(id, request);
    }


    @DeleteMapping("/{id}")
    public void deleteReport(@PathVariable Long id) {
        waterReportService.deleteReport(id);
    }


    // ============================
    // SEARCH & FILTER ENDPOINTS
    // ============================


    @GetMapping("/search/status")
    public Page<WaterReportResponse> searchByStatus(
            @RequestParam Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return waterReportService.searchByStatus(status, page, size);
    }



    @GetMapping("/search/priority")
    public Page<WaterReportResponse> searchByPriority(
            @RequestParam Priority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return waterReportService.searchByPriority(priority, page, size);
    }


    @GetMapping("/search/municipality")
    public Page<WaterReportResponse> searchByMunicipality(
            @RequestParam String municipality,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return waterReportService.searchByMunicipality(municipality, page, size);
    }


    @GetMapping("/search/suburb")
    public Page<WaterReportResponse> searchBySuburb(
            @RequestParam String suburb,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return waterReportService.searchBySuburb(suburb, page, size);
    }


    @GetMapping("/search/category")
    public Page<WaterReportResponse> searchByCategory(
            @RequestParam Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return waterReportService.searchByCategory(categoryId, page, size);
    }


    @GetMapping("/search/title")
    public Page<WaterReportResponse> searchByTitle(
            @RequestParam String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return waterReportService.searchByTitle(title, page, size);
    }

}
