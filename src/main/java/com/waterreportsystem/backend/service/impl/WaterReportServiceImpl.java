package com.waterreportsystem.backend.service.impl;

import com.waterreportsystem.backend.dto.WaterReportRequest;
import com.waterreportsystem.backend.dto.WaterReportResponse;
import com.waterreportsystem.backend.entity.IssueCategory;
import com.waterreportsystem.backend.entity.WaterReport;
import com.waterreportsystem.backend.enums.Priority;
import com.waterreportsystem.backend.enums.Status;
import com.waterreportsystem.backend.exception.ResourceNotFoundException;
import com.waterreportsystem.backend.repository.IssueCategoryRepository;
import com.waterreportsystem.backend.repository.WaterReportRepository;
import com.waterreportsystem.backend.service.WaterReportService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class WaterReportServiceImpl implements WaterReportService {

    private final WaterReportRepository waterReportRepository;
    private final IssueCategoryRepository issueCategoryRepository;

    public WaterReportServiceImpl(WaterReportRepository waterReportRepository,
                                  IssueCategoryRepository issueCategoryRepository) {
        this.waterReportRepository = waterReportRepository;
        this.issueCategoryRepository = issueCategoryRepository;
    }


    @Override
    public WaterReportResponse createReport(WaterReportRequest request) {

        IssueCategory category = issueCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        WaterReport report = new WaterReport();

        report.setReferenceNumber(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        report.setTitle(request.getTitle());
        report.setDescription(request.getDescription());
        report.setPhotoUrl(request.getPhotoUrl());

        report.setPriority(Priority.valueOf(request.getPriority().toUpperCase()));
        report.setStatus(Status.valueOf(request.getStatus().toUpperCase()));

        report.setStreetName(request.getStreetName());
        report.setSuburb(request.getSuburb());
        report.setWardNumber(request.getWardNumber());
        report.setMunicipality(request.getMunicipality());
        report.setProvince(request.getProvince());

        report.setResidentId(request.getResidentId());
        report.setCategory(category);

        WaterReport savedReport = waterReportRepository.save(report);

        return mapToResponse(savedReport);
    }


    @Override
    public Page<WaterReportResponse> getAllReports(int page, int size, String sortBy) {

        return waterReportRepository.findAll(
                PageRequest.of(page, size, Sort.by(sortBy))
        ).map(this::mapToResponse);
    }


    @Override
    public WaterReportResponse getReportById(Long id) {

        WaterReport report = waterReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        return mapToResponse(report);
    }


    @Override
    public WaterReportResponse updateReport(Long id, WaterReportRequest request) {

        WaterReport report = waterReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        IssueCategory category = issueCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        report.setTitle(request.getTitle());
        report.setDescription(request.getDescription());
        report.setPhotoUrl(request.getPhotoUrl());

        report.setPriority(Priority.valueOf(request.getPriority().toUpperCase()));
        report.setStatus(Status.valueOf(request.getStatus().toUpperCase()));

        report.setStreetName(request.getStreetName());
        report.setSuburb(request.getSuburb());
        report.setWardNumber(request.getWardNumber());
        report.setMunicipality(request.getMunicipality());
        report.setProvince(request.getProvince());

        report.setResidentId(request.getResidentId());
        report.setCategory(category);

        WaterReport updatedReport = waterReportRepository.save(report);

        return mapToResponse(updatedReport);
    }


    @Override
    public void deleteReport(Long id) {

        WaterReport report = waterReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        waterReportRepository.delete(report);
    }


    // ============================
    // SEARCH & FILTER METHODS
    // ============================

    @Override
    public Page<WaterReportResponse> searchByStatus(Status status, int page, int size) {

        return waterReportRepository.findByStatus(
                status,
                PageRequest.of(page, size)
        ).map(this::mapToResponse);
    }


    @Override
    public Page<WaterReportResponse> searchByPriority(Priority priority, int page, int size) {

        return waterReportRepository.findByPriority(
                priority,
                PageRequest.of(page, size)
        ).map(this::mapToResponse);
    }


    @Override
    public Page<WaterReportResponse> searchByMunicipality(String municipality, int page, int size) {

        return waterReportRepository.findByMunicipalityContainingIgnoreCase(
                municipality,
                PageRequest.of(page, size)
        ).map(this::mapToResponse);
    }


    @Override
    public Page<WaterReportResponse> searchBySuburb(String suburb, int page, int size) {

        return waterReportRepository.findBySuburbContainingIgnoreCase(
                suburb,
                PageRequest.of(page, size)
        ).map(this::mapToResponse);
    }


    @Override
    public Page<WaterReportResponse> searchByCategory(Long categoryId, int page, int size) {

        return waterReportRepository.findByCategoryId(
                categoryId,
                PageRequest.of(page, size)
        ).map(this::mapToResponse);
    }


    @Override
    public Page<WaterReportResponse> searchByTitle(String title, int page, int size) {

        return waterReportRepository.findByTitleContainingIgnoreCase(
                title,
                PageRequest.of(page, size)
        ).map(this::mapToResponse);
    }


    private WaterReportResponse mapToResponse(WaterReport report) {

        WaterReportResponse response = new WaterReportResponse();

        response.setId(report.getId());
        response.setReferenceNumber(report.getReferenceNumber());
        response.setTitle(report.getTitle());
        response.setDescription(report.getDescription());
        response.setPhotoUrl(report.getPhotoUrl());

        response.setPriority(report.getPriority().name());
        response.setStatus(report.getStatus().name());

        response.setStreetName(report.getStreetName());
        response.setSuburb(report.getSuburb());
        response.setWardNumber(report.getWardNumber());
        response.setMunicipality(report.getMunicipality());
        response.setProvince(report.getProvince());

        response.setCreatedAt(report.getCreatedAt());
        response.setUpdatedAt(report.getUpdatedAt());
        response.setResolvedAt(report.getResolvedAt());

        response.setResidentId(report.getResidentId());

        if (report.getCategory() != null) {
            response.setCategoryId(report.getCategory().getId());
        }

        return response;
    }
}
