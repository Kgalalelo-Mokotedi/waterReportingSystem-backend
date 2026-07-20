package com.waterreportsystem.backend.assignment;

import com.waterreportsystem.backend.assignment.dto.AssignTechnicianRequest;
import com.waterreportsystem.backend.assignment.dto.AssignmentResponse;
import com.waterreportsystem.backend.enums.Status;
import com.waterreportsystem.backend.entity.WaterReport;
import com.waterreportsystem.backend.repository.WaterReportRepository;
import com.waterreportsystem.backend.technician.AvailabilityStatus;
import com.waterreportsystem.backend.technician.Technician;
import com.waterreportsystem.backend.technician.TechnicianRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportAssignmentService {

    // Statuses that count as "this assignment is still live"
    private static final List<AssignmentStatus> ACTIVE_STATUSES =
            List.of(AssignmentStatus.ASSIGNED, AssignmentStatus.ACCEPTED, AssignmentStatus.IN_PROGRESS);

    private final ReportAssignmentRepository assignmentRepository;
    private final WaterReportRepository waterReportRepository;
    private final TechnicianRepository technicianRepository;

    public ReportAssignmentService(ReportAssignmentRepository assignmentRepository,
                                    WaterReportRepository waterReportRepository,
                                    TechnicianRepository technicianRepository) {
        this.assignmentRepository = assignmentRepository;
        this.waterReportRepository = waterReportRepository;
        this.technicianRepository = technicianRepository;
    }

    /**
     * Assigns a technician to a report. If the report already has an
     * active assignment, that one is marked REASSIGNED before the new
     * one is created — a report should only ever have one active
     * assignment at a time.
     */
    @Transactional
    public AssignmentResponse assignTechnician(AssignTechnicianRequest request) {
        WaterReport report = waterReportRepository.findById(request.getReportId())
                .orElseThrow(() -> new EntityNotFoundException("Report not found: " + request.getReportId()));

        Technician technician = technicianRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new EntityNotFoundException("Technician not found: " + request.getTechnicianId()));

        if (technician.getAvailabilityStatus() == AvailabilityStatus.OFF_DUTY) {
            throw new IllegalStateException("Cannot assign a report to a technician who is off duty");
        }

        // Close out any existing active assignment for this report (reassignment case)
        assignmentRepository
                .findFirstByReportIdAndAssignmentStatusInOrderByAssignedAtDesc(report.getId(), ACTIVE_STATUSES)
                .ifPresent(existing -> {
                    existing.setAssignmentStatus(AssignmentStatus.REASSIGNED);
                    assignmentRepository.save(existing);
                });

        ReportAssignment assignment = new ReportAssignment(report, technician, request.getNotes());
        assignment = assignmentRepository.save(assignment);

        report.setStatus(Status.ASSIGNED);
        waterReportRepository.save(report);

        technician.setAvailabilityStatus(AvailabilityStatus.BUSY);
        technicianRepository.save(technician);

        return AssignmentResponse.fromEntity(assignment);
    }

    public List<AssignmentResponse> getAssignmentsForTechnician(Long technicianId) {
        return assignmentRepository.findByTechnicianId(technicianId).stream()
                .map(AssignmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<AssignmentResponse> getActiveAssignmentsForTechnician(Long technicianId) {
        return assignmentRepository.findByTechnicianIdAndAssignmentStatusIn(technicianId, ACTIVE_STATUSES).stream()
                .map(AssignmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<AssignmentResponse> getAssignmentHistoryForReport(Long reportId) {
        return assignmentRepository.findByReportId(reportId).stream()
                .map(AssignmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public long getWorkloadCount(Long technicianId) {
        return assignmentRepository.countByTechnicianIdAndAssignmentStatusIn(technicianId, ACTIVE_STATUSES);
    }

    @Transactional
    public AssignmentResponse markInProgress(Long assignmentId) {
        ReportAssignment assignment = getAssignmentOrThrow(assignmentId);
        assignment.setAssignmentStatus(AssignmentStatus.IN_PROGRESS);

        WaterReport report = assignment.getReport();
        report.setStatus(Status.IN_PROGRESS);
        waterReportRepository.save(report);

        return AssignmentResponse.fromEntity(assignmentRepository.save(assignment));
    }

    @Transactional
    public AssignmentResponse completeAssignment(Long assignmentId) {
        ReportAssignment assignment = getAssignmentOrThrow(assignmentId);
        assignment.setAssignmentStatus(AssignmentStatus.COMPLETED);
        assignment.setCompletedAt(LocalDateTime.now());
        assignmentRepository.save(assignment);

        WaterReport report = assignment.getReport();
        report.setStatus(Status.RESOLVED);
        report.setResolvedAt(LocalDateTime.now());
        waterReportRepository.save(report);

        // Free the technician back up, unless they still have other active work
        Technician technician = assignment.getTechnician();
        long remaining = getWorkloadCount(technician.getId());
        if (remaining == 0) {
            technician.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
            technicianRepository.save(technician);
        }

        return AssignmentResponse.fromEntity(assignment);
    }

    @Transactional
    public AssignmentResponse cancelAssignment(Long assignmentId) {
        ReportAssignment assignment = getAssignmentOrThrow(assignmentId);
        assignment.setAssignmentStatus(AssignmentStatus.CANCELLED);
        assignmentRepository.save(assignment);

        WaterReport report = assignment.getReport();
        report.setStatus(Status.REPORTED);
        waterReportRepository.save(report);

        return AssignmentResponse.fromEntity(assignment);
    }

    private ReportAssignment getAssignmentOrThrow(Long assignmentId) {
        return assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new EntityNotFoundException("Assignment not found: " + assignmentId));
    }
}
