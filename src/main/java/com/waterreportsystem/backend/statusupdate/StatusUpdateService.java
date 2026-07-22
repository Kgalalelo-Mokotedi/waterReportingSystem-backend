package com.waterreportsystem.backend.statusupdate;

import com.waterreportsystem.backend.enums.Status;
import com.waterreportsystem.backend.entity.WaterReport;
import com.waterreportsystem.backend.repository.WaterReportRepository;
import com.waterreportsystem.backend.statusupdate.dto.StatusUpdateRequest;
import com.waterreportsystem.backend.statusupdate.dto.StatusUpdateResponse;
import com.waterreportsystem.backend.technician.Technician;
import com.waterreportsystem.backend.technician.TechnicianRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatusUpdateService {

    private final StatusUpdateRepository statusUpdateRepository;
    private final WaterReportRepository waterReportRepository;
    private final TechnicianRepository technicianRepository;

    public StatusUpdateService(StatusUpdateRepository statusUpdateRepository,
                                WaterReportRepository waterReportRepository,
                                TechnicianRepository technicianRepository) {
        this.statusUpdateRepository = statusUpdateRepository;
        this.waterReportRepository = waterReportRepository;
        this.technicianRepository = technicianRepository;
    }

    /**
     * Logs a progress update and pushes the new status onto the
     * WaterReport itself, so the resident/admin always see the report's
     * current state without having to walk the whole history.
     */
    @Transactional
    public StatusUpdateResponse logStatusUpdate(StatusUpdateRequest request) {
        WaterReport report = waterReportRepository.findById(request.getReportId())
                .orElseThrow(() -> new EntityNotFoundException("Report not found: " + request.getReportId()));

        Technician technician = technicianRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new EntityNotFoundException("Technician not found: " + request.getTechnicianId()));

        StatusUpdate update = new StatusUpdate(report, technician, request.getNewStatus(), request.getComment());
        update = statusUpdateRepository.save(update);

        report.setStatus(request.getNewStatus());
        if (request.getNewStatus() == Status.RESOLVED) {
            report.setResolvedAt(LocalDateTime.now());
        }
        waterReportRepository.save(report);

        return StatusUpdateResponse.fromEntity(update);
    }

    /** Full chronological history for a report — the audit trail / timeline. */
    public List<StatusUpdateResponse> getHistoryForReport(Long reportId) {
        return statusUpdateRepository.findByReportIdOrderByCreatedAtAsc(reportId).stream()
                .map(StatusUpdateResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /** Everything a given technician has logged, most recent first. */
    public List<StatusUpdateResponse> getUpdatesByTechnician(Long technicianId) {
        return statusUpdateRepository.findByTechnicianIdOrderByCreatedAtDesc(technicianId).stream()
                .map(StatusUpdateResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
